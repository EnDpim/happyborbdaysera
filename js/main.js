// ==========================================================
// main.js  -  draws the dotted trail behind the milestones.
//
// How it works, in plain words:
//   1. Find the center of every milestone image.
//   2. Draw an invisible smooth curve that starts at the top of the
//      page, passes through every center in order, and ends at the
//      bottom.
//   3. Walk along that curve and drop a copy of your trail image
//      every few pixels, turned to face the direction of the curve.
// ==========================================================


// ---------- SETTINGS (safe to change) ----------
const TRAIL_IMAGE = 'assets/images/trail.png';  // your small trail image
const SPACING     = 100;   // pixels between pieces. Bigger = more gap
                          // between them. Set it to your image's width
                          // for a solid, unbroken line.
const SKIP_RADIUS = 0;    // 0 = trail runs underneath the milestones.
                          // Try 90 to leave a gap around each one.


// ---------- Things we need from the page ----------
const map   = document.querySelector('.map');
const trail = document.querySelector('.trail');
const tiles = Array.from(document.querySelectorAll('.tile'));
const SVG_NS = 'http://www.w3.org/2000/svg';


// ---------- Step 1: find the points the trail must pass through ----------
function getPoints() {
  const mapBox = map.getBoundingClientRect();

  // The center of each milestone, measured from the map's top-left corner
  const points = tiles.map((tile) => {
    const box = tile.getBoundingClientRect();
    return {
      x: box.left - mapBox.left + box.width / 2,
      y: box.top - mapBox.top + box.height / 2
    };
  });

  // Add a start point at the very top and an end point at the very bottom
  points.unshift({ x: mapBox.width / 2, y: 0 });
  points.push({ x: mapBox.width / 2, y: mapBox.height });

  return points;
}


// ---------- Step 2: turn the points into a smooth curve ----------
// This writes the curve as an SVG path string. The math (called a
// Catmull-Rom spline) just makes the curve bend smoothly through each
// point instead of making sharp corners.
function buildPathData(points) {
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}


// ---------- Step 3: drop trail pieces along the curve ----------
function drawTrail() {
  trail.innerHTML = '';                 // clear any old trail first
  if (tiles.length === 0) return;

  const points = getPoints();

  // Make an invisible SVG path, just so the browser can measure the
  // curve and tell us the coordinates of points along it.
  const svg  = document.createElementNS(SVG_NS, 'svg');
  const path = document.createElementNS(SVG_NS, 'path');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.style.visibility = 'hidden';
  path.setAttribute('d', buildPathData(points));
  svg.appendChild(path);
  trail.appendChild(svg);

  const total = path.getTotalLength();               // curve length in px
  const milestoneCenters = points.slice(1, -1);      // without start/end

  for (let dist = 0; dist <= total; dist += SPACING) {
    const here = path.getPointAtLength(dist);

    // Optionally leave a gap around each milestone
    if (SKIP_RADIUS > 0) {
      const tooClose = milestoneCenters.some(
        (c) => Math.hypot(c.x - here.x, c.y - here.y) < SKIP_RADIUS
      );
      if (tooClose) continue;
    }

    // Work out which way the curve is heading so we can rotate the piece
    const before = path.getPointAtLength(Math.max(dist - 0.5, 0));
    const after  = path.getPointAtLength(Math.min(dist + 0.5, total));
    const angle  = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI;

    const piece = document.createElement('img');
    piece.src = TRAIL_IMAGE;
    piece.alt = '';
    piece.className = 'trail-piece';
    piece.style.left = here.x + 'px';
    piece.style.top  = here.y + 'px';
    // translate(-50%, -50%) centers the piece on the point
    piece.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    trail.appendChild(piece);
  }
}


// ---------- Run it ----------
drawTrail();                                   // once the page is ready
window.addEventListener('load', drawTrail);    // again when everything loaded

// Redraw if the window is resized (milestones move, so the trail must too)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(drawTrail, 100);
});

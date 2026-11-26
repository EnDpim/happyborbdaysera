// ==========================================================
// dots.js  -  scatters your dot images across the whole page,
// behind everything else.
//
// It lays out an invisible grid, puts one dot in every cell, and
// nudges each one a random amount so it looks scattered instead of
// perfectly lined up. Each dot picks one of your images at random.
// ==========================================================


// ---------- SETTINGS (safe to change) ----------
const DOT_IMAGES = [                 // your dot images: add or remove lines
  'assets/images/sera.png',
  'assets/images/sera2.png',
  'assets/images/sera3.png'
];
const CELL     = 110;   // px between dots. Smaller = more dots
const JITTER   = 0.35;  // 0 = perfect grid, 0.5 = very scattered
const MIN_SIZE = 18;    // smallest dot width in px
const MAX_SIZE = 34;    // biggest dot width in px
const ROTATE   = true;  // true = each dot is turned a random amount
const SEED     = 7;     // change this number to get a different layout


const layer = document.querySelector('.dots');


// A "seeded" random number generator. It's like Math.random(), but the
// same seed always gives the same sequence, so the dots stay put when
// the page is redrawn (for example when you resize the window).
function makeRandom(seed) {
  return function () {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}


function drawDots() {
  layer.innerHTML = '';                      // clear old dots first
  const random = makeRandom(SEED);
  const width  = layer.clientWidth;
  const height = layer.clientHeight;
  const batch  = document.createDocumentFragment();

  // Go through the grid, row by row
  for (let y = 0; y < height; y += CELL) {
    for (let x = 0; x < width; x += CELL) {

      // Always ask for the random numbers in the same order,
      // so the layout stays stable.
      const pick   = Math.floor(random() * DOT_IMAGES.length);
      const offX   = (random() - 0.5) * 2 * JITTER * CELL;
      const offY   = (random() - 0.5) * 2 * JITTER * CELL;
      const size   = MIN_SIZE + random() * (MAX_SIZE - MIN_SIZE);
      const turn   = ROTATE ? random() * 360 : 0;

      const dot = document.createElement('img');
      dot.src = DOT_IMAGES[pick];
      dot.alt = '';
      dot.className = 'dot';
      dot.style.width  = size + 'px';
      dot.style.left   = (x + CELL / 2 + offX) + 'px';
      dot.style.top    = (y + CELL / 2 + offY) + 'px';
      dot.style.transform = `translate(-50%, -50%) rotate(${turn}deg)`;
      batch.appendChild(dot);
    }
  }
  layer.appendChild(batch);
}


// ---------- Run it ----------
drawDots();
window.addEventListener('load', drawDots);

let dotsResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(dotsResizeTimer);
  dotsResizeTimer = setTimeout(drawDots, 150);
});

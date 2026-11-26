// ==========================================================
// dots.js  -  scatters your dot images across the whole page,
// behind everything else, and guarantees they never touch.
//
// It lays out an invisible grid, puts one dot in every cell, and
// nudges each one a random amount so it looks scattered. The nudge
// is automatically limited so neighbouring dots always keep at
// least GAP pixels of empty space between them, even when rotated.
// ==========================================================


// ---------- SETTINGS (safe to change) ----------
const DOT_IMAGES = [                 // your dot images: add or remove lines
  'assets/images/sera.png',
  'assets/images/sera2.png',
  'assets/images/sera3.png'
];
const CELL     = 150;   // px between dots. Smaller = more dots, but it can't
                        // go lower than the dots need (see GAP below)
const GAP      = 12;    // minimum empty space between any two dots, in px
const JITTER   = 0.35;  // 0 = perfect grid, 0.5 = very scattered
                        // (it's limited automatically so dots never touch)
const MIN_SIZE = 75;    // smallest dot width in px
const MAX_SIZE = 75;    // biggest dot width in px
const ROTATE   = true;  // true = each dot is turned a random amount
const SEED     = 7;     // change this number to get a different layout


const layer = document.querySelector('.dots');
let tallestShape = 1;   // height / width of your tallest image (set on load)


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


// Load every dot image once to find out its shape (height / width).
// We need this to know how much room the biggest dot can take up.
function measureImages() {
  return Promise.all(DOT_IMAGES.map((src) => new Promise((resolve) => {
    const img = new Image();
    img.onload  = () => resolve(img.naturalHeight / img.naturalWidth);
    img.onerror = () => resolve(1);
    img.src = src;
  })));
}


function drawDots() {
  layer.innerHTML = '';                      // clear old dots first
  const random = makeRandom(SEED);
  const width  = layer.clientWidth;
  const height = layer.clientHeight;
  const batch  = document.createDocumentFragment();

  // The most space one dot can ever take up, measured from its center.
  // (A turned rectangle reaches as far as its diagonal.)
  const reach = ROTATE
    ? MAX_SIZE * Math.sqrt(1 + tallestShape * tallestShape)
    : MAX_SIZE * Math.max(1, tallestShape);

  // Cells can't be smaller than one dot plus the gap
  const cell = Math.max(CELL, reach + GAP);

  // How far a dot may drift from the center of its cell while still
  // leaving GAP pixels between it and its neighbours
  const maxDrift = Math.min(JITTER * cell, (cell - reach - GAP) / 2);

  for (let y = 0; y < height; y += cell) {
    for (let x = 0; x < width; x += cell) {

      // Always ask for the random numbers in the same order,
      // so the layout stays stable.
      const pick = Math.floor(random() * DOT_IMAGES.length);
      const offX = (random() - 0.5) * 2 * maxDrift;
      const offY = (random() - 0.5) * 2 * maxDrift;
      const size = MIN_SIZE + random() * (MAX_SIZE - MIN_SIZE);
      const turn = ROTATE ? random() * 360 : 0;

      const dot = document.createElement('img');
      dot.src = DOT_IMAGES[pick];
      dot.alt = '';
      dot.className = 'dot';
      dot.style.width  = size + 'px';
      dot.style.left   = (x + cell / 2 + offX) + 'px';
      dot.style.top    = (y + cell / 2 + offY) + 'px';
      dot.style.transform = `translate(-50%, -50%) rotate(${turn}deg)`;
      batch.appendChild(dot);
    }
  }
  layer.appendChild(batch);
}


// ---------- Run it ----------
measureImages().then((shapes) => {
  tallestShape = Math.max(1, ...shapes);
  drawDots();
});

let dotsResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(dotsResizeTimer);
  dotsResizeTimer = setTimeout(drawDots, 150);
});

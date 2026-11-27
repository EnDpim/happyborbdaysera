// ==========================================================
// entry.js  -  the big envelope that opens the page.
// Clicking it reveals the map and starts the music. The click is
// what lets the browser allow sound.
// ==========================================================

const OPEN_DELAY = 700;   // ms to show the opened envelope before leaving
const FADE_TIME  = 600;   // ms for the screen to fade away (match the CSS)

const root        = document.documentElement;
const entry       = document.getElementById('entry');
const entryButton = document.getElementById('entry-button');
const bgm         = document.getElementById('bgm');

if (!root.classList.contains('skip-entry')) {
  root.classList.add('entry-active');     // stops the page scrolling behind it

  entryButton.addEventListener('click', () => {
    entry.classList.add('opening');       // show the opened envelope
    bgm.play().catch(() => {});           // start the music
    try { sessionStorage.setItem('entered', '1'); } catch (e) {}

    setTimeout(() => {
      entry.classList.add('leaving');     // fade the screen away
      root.classList.remove('entry-active');
      setTimeout(() => { entry.style.display = 'none'; }, FADE_TIME);
    }, OPEN_DELAY);
  }, { once: true });
}

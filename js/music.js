// Background music: tries to start automatically, and falls back to
// starting on the visitor's first click, tap or key press if the
// browser blocks autoplay (which most browsers do).
const music  = document.getElementById('bgm');
const toggle = document.getElementById('music-toggle');
const icon   = document.getElementById('music-icon');

const PLAY_IMAGE  = 'assets/images/play.png';   // shown while paused
const PAUSE_IMAGE = 'assets/images/pause.png';  // shown while playing

music.volume = 0.4;     // 0 = silent, 1 = full volume. Keep it gentle.

// Load the pause picture in advance so there's no flash on the first swap
new Image().src = PAUSE_IMAGE;


// Keep the button picture in step with what the music is really doing.
// This runs whenever the music starts or stops, however that happens.
function updateButton() {
  if (music.paused) {
    icon.src = PLAY_IMAGE;
    toggle.setAttribute('aria-label', 'Play music');
  } else {
    icon.src = PAUSE_IMAGE;
    toggle.setAttribute('aria-label', 'Pause music');
  }
}
music.addEventListener('play', updateButton);
music.addEventListener('pause', updateButton);


// The button itself just toggles
toggle.addEventListener('click', () => {
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
});


// ---------- Auto-start ----------
// Step 1: try to start right away. Works only if the browser allows it.
// Step 2: if it's blocked, wait for the visitor's first interaction
//         with the page and start the music then.
const FIRST_ACTIONS = ['click', 'keydown', 'touchstart'];

function stopWaiting() {
  FIRST_ACTIONS.forEach((action) =>
    document.removeEventListener(action, startOnFirstAction));
}

function startOnFirstAction() {
  music.play().then(stopWaiting).catch(() => {});   // try again next time if refused
}

music.play().catch(() => {
  FIRST_ACTIONS.forEach((action) =>
    document.addEventListener(action, startOnFirstAction));
});

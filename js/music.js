// Plays and pauses the background music with one picture button.
const music  = document.getElementById('bgm');
const toggle = document.getElementById('music-toggle');
const icon   = document.getElementById('music-icon');

const PLAY_IMAGE  = 'assets/images/play.png';   // shown while paused
const PAUSE_IMAGE = 'assets/images/pause.png';  // shown while playing

music.volume = 0.4;     // 0 = silent, 1 = full volume. Keep it gentle.

// Load the pause picture in advance so there's no flash on the first click
new Image().src = PAUSE_IMAGE;

toggle.addEventListener('click', () => {
  if (music.paused) {
    music.play();
    icon.src = PAUSE_IMAGE;
    toggle.setAttribute('aria-label', 'Pause music');
  } else {
    music.pause();
    icon.src = PLAY_IMAGE;
    toggle.setAttribute('aria-label', 'Play music');
  }
});

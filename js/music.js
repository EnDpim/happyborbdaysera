// Plays and pauses the background music with one button.
const music  = document.getElementById('bgm');
const toggle = document.getElementById('music-toggle');

music.volume = 0.4;     // 0 = silent, 1 = full volume. Keep it gentle.

toggle.addEventListener('click', () => {
  if (music.paused) {
    music.play();
    toggle.innerHTML = '&#9835; Pause music';
  } else {
    music.pause();
    toggle.innerHTML = '&#9835; Play music';
  }
});

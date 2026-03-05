export function initSplash() {
  var splash = document.getElementById("splash");
  if (!splash) return;

  var words = splash.querySelectorAll(".splash__word");
  if (!words.length) return;

  var i = 0;
  var interval = 320;

  function showNext() {
    if (i > 0) words[i - 1].classList.remove("is-visible");

    if (i < words.length) {
      words[i].classList.add("is-visible");
      i += 1;
      setTimeout(showNext, interval);
      return;
    }

    setTimeout(function() {
      splash.classList.add("is-fading");
      setTimeout(function() {
        splash.remove();
      }, 700);
    }, 400);
  }

  setTimeout(showNext, 200);
}

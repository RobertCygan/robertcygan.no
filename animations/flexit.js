// FlexiT video player. Replace the MP4 and poster paths in flexit.html to change the film.
"use strict";
(() => {
  const video = document.querySelector("video[data-animation-video]");
  const embedded = new URLSearchParams(location.search).get("embed") === "1";
  video.controls = !embedded;
  video.muted = true;
  // Media loading can delay the iframe's load event and the parent's key binding.
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || parent === window) return;
    parent.postMessage({ type: "portfolio-demo-close" }, location.origin === "null" ? "*" : location.origin);
  }, true);
  window.AnimationPlayer.init();
})();

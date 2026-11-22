"use strict";
(() => {
  const video = document.querySelector("video[data-animation-video]");
  const embedded = new URLSearchParams(location.search).get("embed") === "1";
  video.controls = !embedded;
  video.muted = true;
  const smallSource = video.querySelector("source[media]");
  if (video.dataset.smallPoster && smallSource && matchMedia(smallSource.media).matches) {
    video.poster = video.dataset.smallPoster;
  }

  // Media loading can delay the iframe's load event and the parent's key binding.
  const targetOrigin = location.protocol === "file:" ? "*" : location.origin;
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || parent === window) return;
    parent.postMessage({ type: "portfolio-demo-close" }, targetOrigin);
  }, true);
  window.AnimationPlayer.init();
})();

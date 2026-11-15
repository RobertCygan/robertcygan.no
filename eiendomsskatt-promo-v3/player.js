"use strict";
const parameters = new URLSearchParams(location.search);
if (parameters.has("t") || parameters.has("hq")) {
  document.querySelector(".controls").hidden = true;
} else {
  window.AnimationPlayer.initVideo();
}

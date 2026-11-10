"use strict";
(() => {
  function init() {
    const toggle = document.getElementById("motion");
    if (!toggle) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const embedded = new URLSearchParams(location.search).get("embed") === "1";
    const videos = document.querySelectorAll("video[data-animation-video]");
    let manualPause = preference.matches;
    let offscreen = embedded && parent !== window;
    let playbackRequested = false;
    const sync = () => {
      const paused = manualPause || offscreen || document.hidden;
      playbackRequested = !paused;
      document.body.classList.toggle("is-paused", paused);
      // CSS animation timelines and native SVG/SMIL share the same play state.
      document.querySelectorAll("svg").forEach((svg) => {
        if (paused) svg.pauseAnimations?.();
        else svg.unpauseAnimations?.();
      });
      videos.forEach((video) => {
        if (paused) video.pause();
        else video.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
      });
      toggle.setAttribute("aria-pressed", String(manualPause));
      toggle.textContent = manualPause ? "Spill animasjon" : "Pause animasjon";
    };
    // Keep the shared pause button in sync with the standalone video controls.
    videos.forEach((video) => {
      video.addEventListener("pause", () => {
        if (!playbackRequested || !video.paused) return;
        manualPause = true;
        sync();
      });
      video.addEventListener("play", () => {
        if (playbackRequested || video.paused) return;
        if (!offscreen && !document.hidden) manualPause = false;
        sync();
      });
    });
    toggle.addEventListener("click", () => {
      manualPause = !manualPause;
      sync();
    });
    if (embedded) {
      document.querySelector(".controls").hidden = true;
      const badge = document.querySelector(".badge");
      if (badge) badge.hidden = true;
    }
    addEventListener("message", (event) => {
      if (
        event.origin !== location.origin ||
        event.source !== parent ||
        event.data?.type !== "portfolio-motion"
      )
        return;
      offscreen = !event.data.visible;
      manualPause = Boolean(event.data.paused);
      sync();
    });
    preference.addEventListener("change", () => {
      manualPause = preference.matches;
      sync();
    });
    document.addEventListener("visibilitychange", sync);
    sync();
  }
  function mount(animation, { logo } = {}) {
    document.title = `${animation.name} · Animert presentasjon`;
    document.getElementById("preview").innerHTML =
      `<header class="preview-head"><div class="brand">${logo ? `<img src="${logo}" alt="">` : ""}${animation.name}</div><span class="badge">${animation.badge}</span></header><svg viewBox="0 0 620 300" role="img" aria-label="${animation.caption}">${animation.graphic}</svg><p class="caption">${animation.caption}</p>`;
    init();
  }
  window.AnimationPlayer = { init, mount };
})();

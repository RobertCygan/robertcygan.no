"use strict";
// Keep offscreen previews paused while browsing this standalone gallery.
(() => {
  const frames = Array.from(document.querySelectorAll("iframe"));
  const visible = new WeakMap();
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const sync = (frame) =>
    frame.contentWindow?.postMessage(
      {
        type: "portfolio-motion",
        visible: Boolean(visible.get(frame)) && !document.hidden,
        paused: preference.matches,
      },
      location.protocol === "file:" ? "*" : location.origin,
    );
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        visible.set(entry.target, entry.isIntersecting);
        sync(entry.target);
      }),
    { threshold: 0.05 },
  );
  frames.forEach((frame) => {
    observer.observe(frame);
    frame.addEventListener("load", () => sync(frame));
  });
  preference.addEventListener("change", () => frames.forEach(sync));
  document.addEventListener("visibilitychange", () => frames.forEach(sync));
})();

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
  addEventListener("message", event => {
    if (event.origin !== location.origin || event.data?.type !== "portfolio-motion-ready") return;
    const frame = frames.find(item => item.contentWindow === event.source);
    if (frame) sync(frame);
  });
  frames.forEach((frame) => {
    observer.observe(frame);
    frame.addEventListener("load", () => sync(frame));
  });
  preference.addEventListener("change", () => frames.forEach(sync));
  document.addEventListener("visibilitychange", () => frames.forEach(sync));
})();

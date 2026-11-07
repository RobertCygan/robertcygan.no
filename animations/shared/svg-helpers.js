"use strict";
(() => {
  const rect = (x, y, w, h, cls = "panel", rx = 6) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="${cls}"/>`;
  const text = (x, y, value, size = 12, cls = "") =>
    `<text x="${x}" y="${y}" font-size="${size}" class="${cls}">${value}</text>`;
  const line = (x, y, w) =>
    `<path d="M${x} ${y}h${w}" stroke="#65715e" stroke-width="3" stroke-linecap="round"/>`;
  const wire = (x, y, w) =>
    `<path d="M${x} ${y}h${w}" class="wire"/><path d="m${x + w - 8} ${y - 6} 8 6-8 6" fill="none" stroke="#c9a86a" stroke-width="2"/>`;
  const bars = (x, y, widths) =>
    widths.map((h, i) => rect(x + i * 26, y - h, 16, h, "bar", 3)).join("");
  const calendar = (x, y) =>
    Array.from({ length: 28 }, (_, i) =>
      rect(
        x + (i % 7) * 18,
        y + Math.floor(i / 7) * 18,
        13,
        13,
        i % 8 === 0 ? "bar" : "panel",
        2,
      ),
    ).join("");

  window.AnimationSvg = { rect, text, line, wire, bars, calendar };
})();

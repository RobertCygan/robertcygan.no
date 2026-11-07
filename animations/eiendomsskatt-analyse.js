// Animation: Eiendomsskatt · 2010–2026. Edit this file to change the scene and its text.
"use strict";
(() => {
  const { rect, text, line, wire, bars, calendar } = window.AnimationSvg;
  const animation = {
    name: "Eiendomsskatt",
    badge: "2010—2026",
    caption: "Fiktive grunnkretser → tidslinje → simulert skatteinntekt",
    graphic:
      rect(20, 37, 260, 214) +
      text(37, 62, "Simulert kommune · 3D", 14) +
      AnimationDistrictIllustration(
        Array.from({ length: 12 }, (_, id) => ({
          id,
          name: `Grunnkrets ${id + 1}`,
          height: [
            400, 1150, 650, 1700, 300, 1250, 850, 500, 1500, 750, 1050, 350,
          ][id],
          color: ["#678565", "#8c9d70", "#b2af78", "#d3b47a"][
            Math.floor(id / 3)
          ],
        })),
        { small: true },
      ).replace("<svg ", '<svg x="19" y="77" width="258" height="170" ') +
      wire(290, 137, 23) +
      rect(326, 37, 275, 214) +
      text(343, 64, "Eiendomsskatt", 17) +
      text(343, 94, "12,8 mill. kr", 27, "gold") +
      text(343, 116, "Høyde: skatt per m²", 11, "dim") +
      `<path d="M343 211 365 203 394 207 425 177 455 167 485 174 515 152 575 137" class="trace"/>` +
      text(343, 235, "2010", 10, "dim") +
      text(548, 235, "2026", 10, "gold") +
      text(20, 279, "01 / GRUNNKRETSER · SØYLEHØYDER", 10, "gold") +
      text(326, 279, "02 / UTVIKLING", 11, "gold"),
  };
  window.AnimationPlayer.mount(animation, {});
})();

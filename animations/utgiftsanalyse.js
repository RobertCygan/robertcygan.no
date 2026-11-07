// Animation: Utgiftsanalyse. Edit this file to change the scene and its text.
"use strict";
(() => {
  const { rect, text, line, wire, bars, calendar } = window.AnimationSvg;
  const animation = {
    name: "Utgiftsanalyse",
    badge: "SIMULASJON",
    caption: "Fiktive fakturalinjer → tjenesteområder → innsikt over tid",
    graphic:
      rect(20, 42, 142, 196) +
      text(35, 69, "Fakturagrunnlag", 13) +
      [0, 1, 2, 3, 4]
        .map((i) => text(35, 101 + i * 25, `201${i + 6}   •   DEMO`, 11, "dim"))
        .join("") +
      wire(176, 139, 51) +
      rect(245, 29, 356, 225) +
      text(262, 55, "Kommunens utgifter", 16) +
      text(262, 76, "2016–2025 · Fiktive data", 10, "dim") +
      rect(262, 90, 148, 47) +
      text(272, 108, "DRIFTSUTGIFTER", 9, "dim") +
      text(272, 129, "86,4 mill. kr", 19, "gold") +
      rect(422, 90, 160, 47) +
      text(433, 108, "TJENESTEOMRÅDER", 9, "dim") +
      text(433, 129, "6 kategorier", 17) +
      bars(269, 223, [36, 53, 43, 67, 79]) +
      `<path d="M441 222 466 205 487 212 510 174 536 181 575 152" class="trace"/>` +
      text(20, 279, "01 / DATAGRUNNLAG", 11, "gold") +
      text(245, 279, "02 / ØKONOMISK OVERSIKT", 11, "gold"),
  };
  window.AnimationPlayer.mount(animation, {});
})();

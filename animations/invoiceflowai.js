// Animation: InvoiceFlowAI. Edit this file to change the scene and its text.
"use strict";
(() => {
  const { rect, text, line, wire, bars, calendar } = window.AnimationSvg;
  const animation = {
    name: "InvoiceFlowAI",
    badge: "KONSEPTVISNING",
    caption: "Illustrert arbeidsflyt · Import → analyse → kontroll → oversikt",
    graphic:
      rect(20, 56, 120, 166, "paper", 5) +
      text(33, 83, "FAKTURA", 13, "paper-text") +
      line(34, 104, 78) +
      line(34, 119, 56) +
      line(34, 146, 78) +
      line(34, 161, 56) +
      text(33, 201, "12 500 kr", 18, "paper-text") +
      `<path d="M25 95h110" stroke="#78a47a" stroke-width="3" class="cursor"/>` +
      wire(152, 139, 49) +
      rect(216, 89, 104, 104) +
      text(242, 136, "AI", 32, "gold") +
      text(230, 163, "ANALYSE", 10, "dim") +
      wire(332, 139, 49) +
      rect(396, 41, 205, 202) +
      text(413, 69, "Fakturakontroll", 15) +
      ["Leverandør", "Fakturadato", "Beløp og mva"]
        .map(
          (t, i) =>
            text(414, 103 + i * 31, t, 12) +
            text(572, 103 + i * 31, "✓", 13, "gold"),
        )
        .join("") +
      `<g class="approved">${rect(414, 189, 169, 32, "bar", 5)}${text(436, 209, "Klar for gjennomgang", 11, "paper-text")}</g>` +
      text(20, 279, "01 / IMPORT", 11, "gold") +
      text(216, 279, "02 / ANALYSE", 11, "gold") +
      text(396, 279, "03 / KONTROLL", 11, "gold"),
  };
  window.AnimationPlayer.mount(animation, {});
})();

// Animation: FlexiT – Arbeidstidsregistrering. Edit this file to change the scene and its text.
"use strict";
(() => {
  const { rect, text, line, wire, bars, calendar } = window.AnimationSvg;
  const animation = {
    name: "FlexiT – Arbeidstidsregistrering",
    badge: "PROTOTYPE",
    caption: "Android: Start / Stopp → Fravær → Lederpanel med kalender",
    graphic:
      `<g class="flexit-phone">
<rect x="15" y="17" width="174" height="249" rx="19" fill="#172018" stroke="#827f90"/>
<rect x="23" y="34" width="158" height="220" rx="12" fill="#f5f4fa"/>
<rect x="76" y="21" width="52" height="6" rx="3" fill="#424848"/>
${text(36, 51, "9:41", 8, "paper-text")}
<image href="assets/flexit-logo.png" x="83" y="40" width="40" height="40"/>
${text(38, 91, "Arbeidsdag · Android", 11, "paper-text")}
<g class="flexit-idle">
${text(43, 122, "Klar til start", 15, "paper-text")}
${rect(37, 136, 128, 28, "phone-start", 7)}
${text(82, 154, "START", 11, "phone-white")}
</g>
<g class="flexit-running">
${text(45, 122, "07:45:00", 23, "paper-text")}
${rect(37, 136, 128, 28, "phone-stop", 7)}
${text(82, 154, "STOPP", 11, "phone-white")}
</g>
<g class="flexit-absence">
${text(37, 186, "Fravær ▾", 12, "paper-text")}
${rect(34, 193, 134, 48, "phone-menu", 5)}
${text(43, 207, "Ferie · Avspasering", 10, "paper-text")}
${text(43, 222, "Sykefravær · Permisjon", 9, "paper-text")}
${text(43, 236, "Sykt barn · Tjenestereise", 9, "paper-text")}
</g>
</g>` +
      wire(201, 138, 39) +
      `<g class="flexit-leader">` +
      rect(255, 36, 346, 206) +
      text(273, 62, "Lederpanel", 17) +
      text(273, 83, "Oktober 2026 · Godkjenning", 10, "dim") +
      calendar(273, 102) +
      rect(421, 99, 158, 120) +
      text(432, 121, "Ansatt 105118", 12) +
      line(432, 138, 100) +
      text(432, 158, "Fleksitid   +12:40", 11) +
      text(432, 178, "Fravær       1 dag", 11) +
      `<g class="approved">${rect(432, 190, 134, 19, "bar", 4)}${text(452, 204, "✓ GODKJENT", 10, "paper-text")}</g></g>` +
      text(24, 289, "01 / ANDROID · START / STOPP / FRAVÆR", 9, "gold") +
      text(255, 289, "02 / LEDER · KALENDER / GODKJENNING", 9, "gold"),
  };
  window.AnimationPlayer.mount(animation, { logo: "assets/flexit-logo.png" });
})();

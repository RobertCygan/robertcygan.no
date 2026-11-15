/* Eiendomsskatt per grunnkrets — promo v3.
   The app layer is a frame-accurate capture of the REAL app (src/original.html) driven in
   headless Chrome/WebGL (src/capture_v3.py): open colour/height lists, height slider, 3D rotation, year playback.
   This scene adds camera, cursor, Norwegian captions, title and end card. Pure function of t. */
(() => {
  const P = new URLSearchParams(location.search);
  const MODE = P.get("mode") === "square" ? "square" : "landscape";
  const HQ = P.has("hq");
  const TL = window.TL;
  const FPS = 30, DUR = TL.dur, NF = Math.round(DUR * FPS);
  document.body.classList.add(MODE); if (HQ) document.body.classList.add("hq");
  const W = MODE === "square" ? 1080 : 1920, H = 1080;
  const S0 = MODE === "square" ? 0.64 : 1.1;
  const CAP_H = MODE === "square" ? 250 : 210;
  const MARGIN = 56, ZMAX = 2.2;

  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, x) => a + (b - a) * x;
  const sine = x => 0.5 - 0.5 * Math.cos(Math.PI * clamp(x));
  const span = (t, a, b) => sine((t - a) / (b - a));
  const fade = (t, a, b, c, d) => (t < a || t > d) ? 0 : t < b ? span(t, a, b) : t <= c ? 1 : 1 - span(t, c, d);

  /* ---------- camera (one sine-eased move per beat) ---------- */
  const FULL = null;
  const R_DD1 = [350, 92, 690, 500];                         // colour list (12 options)
  const R_DD2 = [684, 92, 1025, 527];                        // height list (13 options)
  const R_HEIGHT = [300, 150, 880, 560];                     // height slider + central districts
  const R_MAP = MODE === "square" ? [140, 200, 900, 820] : [20, 230, 1030, 780];
  // [start, rect, duration, dip, keepCaptionBandClear]
  const KEYS = [[0, FULL, 0, 0, true], [1.4, R_DD1, 1.3, 0, "dd"], [5.5, R_DD2, 1.3, 0, "dd"],
                [9.8, R_HEIGHT, 1.3, 0, true], [12.6, R_MAP, 1.3, 0, false], [20.3, FULL, 1.3, 0, true]];
  function camFor(r, clear) {
    if (!r) return { lz: 0, ax: 800, ay: 450, tx: W / 2, ty: H / 2 };
    const ch = clear === "dd" ? (MODE === "square" ? 230 : 180) : clear ? CAP_H : 0;
    const rw = r[2] - r[0], rh = r[3] - r[1];
    const z = clamp(Math.min((W - 2 * MARGIN) / (rw * S0), (H - 2 * MARGIN - ch) / (rh * S0)), 1, ZMAX);
    return { lz: Math.log(z), ax: (r[0] + r[2]) / 2, ay: (r[1] + r[3]) / 2, tx: W / 2, ty: (H - ch) / 2 };
  }
  function camAt(t) {
    let c = camFor(KEYS[0][1], true);
    for (let i = 1; i < KEYS.length; i++) {
      const [t0, r, d, dip, clear] = KEYS[i];
      if (t < t0) break;
      const n = camFor(r, clear), x = clamp((t - t0) / d), e = sine(x), s = Math.sin(Math.PI * x);
      c = { lz: lerp(c.lz, n.lz, e) + dip * s * s, ax: lerp(c.ax, n.ax, e), ay: lerp(c.ay, n.ay, e),
            tx: lerp(c.tx, n.tx, e), ty: lerp(c.ty, n.ty, e) };
    }
    return c;
  }

  /* ---------- cursor (app coordinates; shared timeline with capture_v3.py) ---------- */
  const exag = t => 1 + 2 * span(t, TL.drag.t0, TL.drag.t1);
  const thumbX = v => 353.5 + (v - 0.2) / 2.8 * 74;
  function cursorAt(t) {
    let p = TL.cursor[0][2];
    for (const [a, b, f, to] of TL.cursor) { if (t < a) break; const e = span(t, a, b); p = [lerp(f[0], to[0], e), lerp(f[1], to[1], e)]; }
    let [x, y] = p;
    if (t >= TL.drag.t0 - 0.2 && t < TL.cursor[9][0]) { x = thumbX(exag(t)); y = 181; }
    const r = TL.cursor[10];
    if (t >= r[0]) y -= 22 * Math.sin(Math.PI * clamp((t - r[0]) / (r[1] - r[0])));
    const op = Math.max(...TL.cursorVis.map(v => fade(t, ...v)));
    const press = 1 - 0.13 * Math.max(...TL.press.map(v => fade(t, ...v)));
    return { x, y, op, press };
  }

  /* ---------- captions: Norwegian bokmål only ---------- */
  const CAPS = [
    [1.9, 5.4, "Farge", "Velg fargekoding"],
    [5.8, 9.6, "Høyde", "Velg høydegrunnlag"],
    [10.1, 12.8, "3D-modell", "Dynamisk høyde per grunnkrets"],
    [13.3, 16.3, "3D-kart", "Roter og utforsk kartet i 3D"],
    [16.6, 20.2, "Tidslinje", "Se utviklingen år for år"],
  ];

  const $ = id => document.getElementById(id);
  const cam = $("cam"), app = $("app"), cur = $("cursor"), rip = $("ripple"), vid = $("appvid"), img = $("appimg");
  app.style.transform = `scale(${S0})`;
  rip.style.display = "none";
  const frameIdx = t => Math.min(NF - 1, Math.max(0, Math.round(t * FPS)));
  const FR = P.get("frames") || "frames", EVERY = +(P.get("every") || 1);
  const src = i => `../capture-v3/${FR}/app_${String(Math.floor(i / EVERY) * EVERY).padStart(4, "0")}.png`;

  function renderOverlay(tIn) {
    const t = clamp(tIn, 0, DUR);
    // year counter — same schedule as capture_v3.py (TL.years)
    const Y = TL.years; let yr = 2026;
    if (t >= Y.drop[0]) { yr = 2014; for (let k = 0; k < 12; k++) if (t >= Y.start + Y.step * k) yr = 2015 + k; }
    if ($("yearNum").textContent !== String(yr)) $("yearNum").textContent = String(yr);
    $("yearbadge").style.opacity = fade(t, Y.drop[0] + 0.05, Y.drop[0] + 0.45, 20.0, 20.4);
    const c = camAt(t), z = Math.exp(c.lz), k = S0 * z;
    const left = c.tx - c.ax * k, top = c.ty - c.ay * k;
    cam.style.transform = `translate(${left}px,${top}px) scale(${z})`;
    const blur = 3 * (1 - span(t, 1.2, 1.9)) + 7 * span(t, 20.7, 21.5);
    cam.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
    window.__cam = { t, z, zoomEff: k, left, top };

    const cu = cursorAt(t), cs = 1.15 / Math.sqrt(z);
    cur.style.opacity = cu.op;
    cur.style.transform = `translate(${cu.x - 2.9 * cs}px,${cu.y - 2 * cs}px) scale(${cs * cu.press})`;

    $("dim").style.opacity = Math.max(0.72 * (1 - span(t, 1.3, 2.0)), 0.8 * span(t, 20.7, 21.4));
    const ti = $("title"), to = 1 - span(t, 1.3, 1.75);
    ti.style.opacity = to; ti.style.transform = `translateY(${-14 * (1 - to)}px)`;
    const ec = $("endcard"), eo = span(t, 21.0, 21.6);
    ec.style.opacity = eo; ec.style.transform = `translateY(${16 * (1 - eo)}px)`;
    let co = 0, ck = "", cm = "";
    for (const [a, b, kk, mm] of CAPS) { const o = fade(t, a, a + 0.45, b - 0.35, b); if (o > co) { co = o; ck = kk; cm = mm; } }
    if (ck && $("capK").textContent !== ck) $("capK").textContent = ck;
    if (cm && $("capM").textContent !== cm) $("capM").textContent = cm;
    $("caption").style.opacity = co;
    $("caption").style.transform = `translateY(${12 * (1 - co)}px)`;
    $("scrim").style.opacity = Math.max(co, fade(t, 1.9, 2.4, 20.2, 20.7) * 0.85);
    // shorter scrim while a list is open, so the lowest options stay at full contrast
    const ddk = fade(t, 1.4, 2.0, 9.6, 10.2), sh = MODE === "square" ? [400, 290] : [360, 225];
    $("scrim").style.height = lerp(sh[0], sh[1], ddk) + "px";
  }

  /* render mode: exact frame image; returns a promise that resolves when drawn */
  let lastI = -1;
  async function setTime(t) {
    if (HQ) {
      const i = frameIdx(t);
      if (i !== lastI) { img.src = src(i); await img.decode(); lastI = i; }
    }
    renderOverlay(t);
  }

  function fit() {
    const s = Math.min(innerWidth / W, innerHeight / H);
    $("stage").style.transform = `translate(${(innerWidth - W * s) / 2}px,${(innerHeight - H * s) / 2}px) scale(${s})`;
  }
  addEventListener("resize", fit); fit();

  window.DURATION = DUR;
  window.setTime = setTime;
  window.__ready = document.fonts.ready;

  if (HQ || P.has("t")) {
    if (!HQ) { vid.src = "assets/app-v3.mp4"; vid.addEventListener("loadeddata", () => { vid.currentTime = +P.get("t"); }); }
    setTime(+(P.get("t") || 0));
  } else {
    // standalone: the app video is the clock (autoplay muted, loops)
    vid.src = "assets/app-v3.mp4";
    renderOverlay(0);
    // The shared player handles autoplay, pause and offscreen visibility.
    let raf;
    const loop = () => {
      renderOverlay(vid.currentTime || 0);
      if (!vid.paused) raf = requestAnimationFrame(loop);
    };
    vid.addEventListener("play", () => { cancelAnimationFrame(raf); loop(); });
    vid.addEventListener("pause", () => { cancelAnimationFrame(raf); renderOverlay(vid.currentTime || 0); });
    vid.addEventListener("seeked", () => renderOverlay(vid.currentTime || 0));
  }
})();

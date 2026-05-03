const palette = {
  ink: "#f3f5ff",
  muted: "#8d95c0",
  mutedDim: "#6b7299",
  grid: "rgba(255,255,255,0.06)",
  pink: "#ff5d8f",
  pinkSoft: "#ff9ebd",
  purple: "#b388ff",
  purpleDeep: "#7c5cff",
  blue: "#5b8def",
  blue2: "#7d8dff",
  teal: "#4ee0d2",
  amber: "#f9c74f",
  green: "#4cd97b",
  red: "#ff6b6b",
  surface: "#161c3a"
};

const dem = {
  total: 2679,
  men: 1361,
  women: 1318,
  history: {
    years:     [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
    pop:       [2507, 2543, 2543, 2534, 2576, 2608, 2586, 2591, 2665, 2672, 2662, 2679],
    births:    [22,   21,   17,   16,   24,   10,   27,   29,   19,   26,   24],
    deaths:    [25,   25,   30,   42,   24,   38,   36,   45,   37,   32,   25],
    migration: [39,    5,    3,   68,   32,    9,   13,   90,   26,   -4,   18]
  },
  age: {
    youth: 456, working: 1574, seniors: 649, sen67_79: 469, sen80: 180,
    byGender: {
      youth:   [223, 233],
      working: [810, 764],
      seniors: [328, 321]
    },
    trend: {
      years: [2024, 2025, 2026],
      steigenMedian: [47, 47, 47],
      steigenMean: [45.5, 45.5, 45.9],
      norwayMedian: [40, 40, 41],
      norwayMean: [41.3, 41.6, 41.8]
    },
    comparison2025: [
      ["0-17", "473 (17,8%)", "456 (17,0%)", "-17"],
      ["18-66", "1 559 (58,6%)", "1 574 (58,8%)", "+15"],
      ["67+", "630 (23,7%)", "649 (24,2%)", "+19"],
      ["80+", "171 (6,4%)", "180 (6,7%)", "+9"]
    ]
  },
  forecast: {
    years:   [2025, 2030, 2035, 2040, 2045, 2050],
    total:   [2695, 2749, 2805, 2842, 2867, 2877],
    youth:   [459,  462,  482,  509,  521,  504],
    working: [1596, 1604, 1614, 1594, 1597, 1627],
    seniors: [640,  683,  709,  739,  749,  746],
    sen80:   [177,  235,  265,  281,  303,  314]
  },
  immigration: {
    steigen: { all: 16.8, western: 7.9, nonWestern: 8.9, native: 1.2 },
    norway:  { all: 21.8, western: 8.1, nonWestern: 13.7, native: 4.2 }
  },
  immigrationCounts: [
    ["Innvandrere + barn", 450, "16,8%"],
    ["Innvandrere", 418, "15,6%"],
    ["Norskfødte barn av innv.", 32, "1,2%"],
    ["Vestlige land", 213, "7,9%"],
    ["Andre land", 237, "8,9%"]
  ],
  sectors: [
    ["Jordbruk, skog, fiske", 307, "#ff5d8f"],
    ["Helse og sosial", 284, "#b388ff"],
    ["Industri (fiskeforedl.)", 152, "#7d8dff"],
    ["Handel og verksted", 113, "#4ee0d2"],
    ["Utdanning", 92, "#f9c74f"],
    ["Transport / lager", 77, "#c779ff"],
    ["Bygg og anlegg", 76, "#5b8def"],
    ["Adm. og forsvar", 55, "#ff9ebd"],
    ["Tekniske tjenester", 37, "#4cd97b"],
    ["Hotell og servering", 33, "#ff6b6b"],
    ["Personlige tjenester", 31, "#7d8dff"],
    ["Vann, kraft, avfall", 29, "#b388ff"],
    ["Bergverk", 17, "#5b8def"]
  ],
  neet: {
    employed:   { steigen: 68.7, norway: 63.7 },
    unemployed: { steigen: 0.7,  norway: 1.1 },
    neet:       { steigen: 8.6,  norway: 9.9 }
  },
  commuting: [
    ["Bor i Steigen", 717, 640, 1357],
    ["Jobber i Steigen", 716, 622, 1338],
    ["Utpendling", 130, 76, 206],
    ["Innpendling", 129, 58, 187],
    ["Pendlingsbalanse", -1, -18, -19]
  ],
  education: {
    levels:  ["Grunnskole", "Videregående", "Fagskole", "Høyere kort", "Høyere lang"],
    steigen: [27.7, 41.9, 3.8, 19.5, 7.1],
    norway:  [23.1, 35.6, 3.3, 25.4, 12.5],
    male:    [29.0, 47.1, 4.5, 13.5, 5.8],
    female:  [26.4, 36.4, 3.0, 25.8, 8.5],
    rows: [
      ["Grunnskole", "27,7%", "29,0%", "26,4%", "23,1%"],
      ["Videregående", "41,9%", "47,1%", "36,4%", "35,6%"],
      ["Fagskole", "3,8%", "4,5%", "3,0%", "3,3%"],
      ["Høyere kort", "19,5%", "13,5%", "25,8%", "25,4%"],
      ["Høyere lang", "7,1%", "5,8%", "8,5%", "12,5%"],
      ["Høyere totalt", "26,6%", "19,3%", "34,3%", "37,9%"]
    ]
  },
  income: [
    ["Alle hush.",        788500,  633700,  856300, 92.1],
    ["Aleneboende",       460100,  373300,  500800, 91.9],
    ["Par u/barn",       1014600,  812100, 1098100, 92.4],
    ["Par m/barn",       1424500, 1104700, 1500300, 94.9],
    ["Aleneforsørgere",   684800,  559400,  701700, 97.6]
  ],
  households: [
    ["Aleneboende",          567, 43.6, 41.2, "#ff5d8f"],
    ["Par uten barn",        339, 26.1, 24.2, "#b388ff"],
    ["Par m/barn 6-17",      107,  8.2, 10.2, "#7d8dff"],
    ["M/voksne barn",         94,  7.2,  7.3, "#4ee0d2"],
    ["Par m/barn 0-5",        91,  7.0,  8.2, "#f9c74f"],
    ["Flerfamilie",           55,  4.3,  4.9, "#c779ff"],
    ["Aleneforsørger 6-17",   39,  3.0,  3.3, "#5b8def"],
    ["Aleneforsørger 0-5",     9,  0.7,  0.8, "#ff9ebd"]
  ],
  fertility: {
    years:    [2020, 2021, 2022, 2023, 2024],
    norway:   [1.48, 1.55, 1.41, 1.40, 1.44],
    nordland: [1.41, 1.59, 1.43, 1.51, 1.42]
  },
  economics: [
    ["67+ / 18-66", "41,2%", "Høye helse- og omsorgsutgifter per skattyter"],
    ["80+ mot 2050", "+77%", "Nesten dobling av behov for langvarig omsorg"],
    ["Medianinntekt", "92,1%", "Lavere skattegrunnlag per husholdning enn Norge"],
    ["Høyere utdanning", "26,6%", "Færre høyinntektsjobber og vanskeligere rekruttering"],
    ["Aleneboende", "43,6%", "Mer etterspørsel etter sosiale tjenester"],
    ["Primærnæring", "25,1%", "Spesifikke behov for vei, drift og infrastruktur"],
    ["Driftsutgifter / innb.", "152 017 NOK", "4. høyeste nivå i Norge"],
    ["Driftsinntekter / innb.", "148 546 NOK", "Operasjonelt gap på -3,9%"],
    ["Tettstedandel", "9%", "91% spredt bosetting gir dyre tjenester"],
    ["Pendlingsbalanse", "-19", "Liten netto arbeidslekkasje"],
    ["Migrasjon netto", "~+25 / år", "Lokal dynamikk holdes oppe av innflytting"]
  ],
  challenges: [
    ["🧓", "Aldring", "80+ vokser fra 6,7% (2026) til 10,9% (2050). Krever utbygging av sykehjem, hjemmetjeneste og opplæring av helsepersonell."],
    ["📉", "Negativ naturlig vekst", "Siden 2014 dør flere enn det fødes. Befolkning avhenger 100% av migrasjon — uten netto innflytting krymper Steigen."],
    ["🏗️", "Spredt bosetting", "91% bor utenfor tettsted. Skoleskyss på 81,9% — høye kostnader for hjemmetjeneste, vei og infrastruktur."],
    ["💸", "Strukturelt budsjettunderskudd", "Driftsresultat -3,9% i 2025. Utgifter vokser raskere enn inntekter — uten plan vil ubalansen øke."],
    ["🎓", "Lavt utdanningsnivå", "26,6% høyere utdanning vs 37,9% i Norge. Utfordrende å tiltrekke seg helse- og pedagogfagpersonell."],
    ["🐟", "Avhengig av én næring", "22,6% av jobber i jordbruk og fiske. Lakseprisene styrer økonomien direkte."],
    ["♀️", "Færre kvinner og barn", "Feminitetsindeks 96,8/100. Bare 197 husholdninger med barn 0-17 — selvforsterkende fødselsnedgang."]
  ]
};

const fmt = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 1 });
const fmt0 = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });
const withSign = (v) => `${v > 0 ? "+" : ""}${fmt0.format(v)}`;

const state = {
  popMode: "population",
  forecastMode: "absolute",
  immRegion: "steigen",
  incMode: "brutto"
};

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width: rect.width, height: rect.height };
}

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function niceTicks(min, max, count = 5) {
  if (min === max) return [min];
  const span = max - min;
  const stepRaw = span / Math.max(1, count - 1);
  const magnitude = 10 ** Math.floor(Math.log10(Math.abs(stepRaw) || 1));
  const step = Math.ceil(stepRaw / magnitude) * magnitude;
  const first = Math.floor(min / step) * step;
  const ticks = [];
  for (let v = first; v <= max + step; v += step) {
    if (v >= min - step * 0.2) ticks.push(v);
    if (ticks.length >= count + 2) break;
  }
  return ticks;
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, Math.abs(h) / 2, Math.abs(w) / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawGrid(ctx, b, ticks, min, max, formatter) {
  ctx.strokeStyle = palette.grid;
  ctx.fillStyle = palette.muted;
  ctx.lineWidth = 1;
  ctx.font = "11px Manrope, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ticks.forEach((tick) => {
    const y = b.bottom - ((tick - min) / (max - min || 1)) * b.height;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(b.left, y);
    ctx.lineTo(b.right, y);
    ctx.stroke();
    ctx.fillText(formatter(tick), b.left - 8, y);
  });
  ctx.setLineDash([]);
}

function wrapLabel(ctx, text, x, y, maxWidth, lineHeight) {
  const words = String(text).split(" ");
  let line = "";
  const lines = [];
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (ctx.measureText(t).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = t;
  }
  lines.push(line);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((s, i) => ctx.fillText(s, x, startY + i * lineHeight));
}

function wrapCenter(ctx, text, cx, y, maxWidth, lineHeight) {
  const words = String(text).split(" ");
  let line = "";
  const lines = [];
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (ctx.measureText(t).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = t;
  }
  lines.push(line);
  lines.forEach((s, i) => ctx.fillText(s, cx, y + i * lineHeight));
}

function drawAreaChart(canvas, labels, series, options = {}) {
  const { ctx, width, height } = setupCanvas(canvas);
  ctx.clearRect(0, 0, width, height);
  const b = {
    left: options.left ?? 50,
    right: width - 14,
    top: 18,
    bottom: height - 30
  };
  b.width = b.right - b.left;
  b.height = b.bottom - b.top;

  const all = series.flatMap((s) => s.values).filter((v) => v != null);
  const minV = options.min ?? Math.min(...all);
  const maxV = options.max ?? Math.max(...all);
  const pad = (maxV - minV || 1) * 0.15;
  const minY = options.min ?? minV - pad;
  const maxY = options.max ?? maxV + pad;
  const ticks = niceTicks(minY, maxY, 5);
  const yFormat = options.yFormat ?? ((v) => fmt0.format(v));

  drawGrid(ctx, b, ticks, minY, maxY, yFormat);

  ctx.fillStyle = palette.muted;
  ctx.font = "11px Manrope, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  labels.forEach((label, i) => {
    const x = b.left + (i / Math.max(1, labels.length - 1)) * b.width;
    ctx.fillText(String(label), x, b.bottom + 10);
  });

  const xy = (v, i, len) => ({
    x: b.left + (i / Math.max(1, len - 1)) * b.width,
    y: b.bottom - ((v - minY) / (maxY - minY || 1)) * b.height
  });

  series.forEach((s) => {
    const points = s.values
      .map((v, i) => (v == null ? null : xy(v, i, s.values.length)))
      .filter(Boolean);
    if (points.length < 2) return;

    if (s.area !== false) {
      const grad = ctx.createLinearGradient(0, b.top, 0, b.bottom);
      grad.addColorStop(0, hexToRgba(s.color, 0.45));
      grad.addColorStop(1, hexToRgba(s.color, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(points[0].x, b.bottom);
      points.forEach((p, i) => {
        if (i === 0) ctx.lineTo(p.x, p.y);
        else {
          const prev = points[i - 1];
          const cx = (prev.x + p.x) / 2;
          ctx.bezierCurveTo(cx, prev.y, cx, p.y, p.x, p.y);
        }
      });
      ctx.lineTo(points[points.length - 1].x, b.bottom);
      ctx.closePath();
      ctx.fill();
    }

    ctx.shadowColor = hexToRgba(s.color, 0.6);
    ctx.shadowBlur = 12;
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.width ?? 2.6;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else {
        const prev = points[i - 1];
        const cx = (prev.x + p.x) / 2;
        ctx.bezierCurveTo(cx, prev.y, cx, p.y, p.x, p.y);
      }
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    if (s.dots !== false) {
      points.forEach((p) => {
        ctx.fillStyle = palette.surface;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }
  });
}

function drawHorizontalBars(canvas, rows, opts = {}) {
  const { ctx, width, height } = setupCanvas(canvas);
  ctx.clearRect(0, 0, width, height);
  const labelW = Math.min(opts.labelWidth ?? 180, width * 0.42);
  const b = { left: labelW, right: width - 14, top: 6, bottom: height - 6 };
  const gap = 6;
  const rowH = Math.max(18, (b.bottom - b.top - gap * (rows.length - 1)) / rows.length);
  const max = Math.max(...rows.map((r) => Math.abs(r[1])));

  ctx.font = "12px Manrope, sans-serif";
  rows.forEach((row, i) => {
    const [label, value, color] = row;
    const y = b.top + i * (rowH + gap);
    const w = (Math.abs(value) / max) * (b.right - b.left);

    ctx.fillStyle = palette.muted;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    wrapLabel(ctx, label, 4, y + rowH / 2, labelW - 18, 13);

    ctx.fillStyle = "rgba(255,255,255,0.04)";
    roundRect(ctx, b.left, y, b.right - b.left, rowH, 8);
    ctx.fill();

    const grad = ctx.createLinearGradient(b.left, y, b.left + w, y);
    grad.addColorStop(0, hexToRgba(color, 0.85));
    grad.addColorStop(1, color);
    ctx.fillStyle = grad;
    roundRect(ctx, b.left, y, Math.max(w, 2), rowH, 8);
    ctx.fill();

    ctx.fillStyle = palette.ink;
    ctx.font = "700 12px Manrope, sans-serif";
    ctx.textAlign = "right";
    const txt = opts.formatter ? opts.formatter(value) : `${fmt0.format(value)}`;
    ctx.fillText(txt, b.right - 8, y + rowH / 2);
    ctx.font = "12px Manrope, sans-serif";
  });
}

function drawDonut(canvas, segments, options = {}) {
  const { ctx, width, height } = setupCanvas(canvas);
  ctx.clearRect(0, 0, width, height);
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 2 - 28;
  const inner = r * 0.62;
  const total = segments.reduce((a, s) => a + s.value, 0);
  let angle = -Math.PI / 2;

  segments.forEach((seg) => {
    const slice = (seg.value / total) * Math.PI * 2;
    const next = angle + slice;

    ctx.beginPath();
    ctx.arc(cx, cy, r, angle, next);
    ctx.arc(cx, cy, inner, next, angle, true);
    ctx.closePath();
    const grad = ctx.createRadialGradient(cx, cy, inner, cx, cy, r);
    grad.addColorStop(0, hexToRgba(seg.color, 0.95));
    grad.addColorStop(1, hexToRgba(seg.color, 0.7));
    ctx.fillStyle = grad;
    ctx.fill();

    const pct = (seg.value / total) * 100;
    if (pct >= 4) {
      const mid = (angle + next) / 2;
      const lx = cx + Math.cos(mid) * (r + 14);
      const ly = cy + Math.sin(mid) * (r + 14);
      ctx.fillStyle = palette.ink;
      ctx.font = "700 12px Manrope, sans-serif";
      ctx.textAlign = Math.cos(mid) > 0 ? "left" : "right";
      ctx.textBaseline = "middle";
      ctx.fillText(`${fmt.format(pct)}%`, lx, ly);
      ctx.fillStyle = palette.muted;
      ctx.font = "10px Manrope, sans-serif";
      ctx.fillText(seg.label, lx, ly + 13);
    }
    angle = next;
  });

  ctx.fillStyle = palette.muted;
  ctx.font = "10px Manrope, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(options.subtitle || "Total", cx, cy - 14);
  ctx.fillStyle = palette.ink;
  ctx.font = "800 22px Manrope, sans-serif";
  ctx.fillText(options.center ?? fmt0.format(total), cx, cy + 8);
}

function drawAgePyramid(canvas, groups) {
  const { ctx, width, height } = setupCanvas(canvas);
  ctx.clearRect(0, 0, width, height);
  const cx = width / 2;
  const halfW = width / 2 - 16;
  const b = { top: 16, bottom: height - 28 };
  const gap = 14;
  const rowH = Math.max(28, (b.bottom - b.top - gap * (groups.length - 1)) / groups.length);
  const maxV = Math.max(...groups.flatMap((g) => [g.men, g.women]));

  ctx.font = "11px Manrope, sans-serif";
  ctx.fillStyle = palette.muted;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("Menn", cx - halfW / 2, b.bottom + 8);
  ctx.fillText("Kvinner", cx + halfW / 2, b.bottom + 8);

  groups.forEach((g, i) => {
    const y = b.top + i * (rowH + gap);

    ctx.fillStyle = palette.ink;
    ctx.font = "700 12px Manrope, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(g.label, cx, y + rowH / 2);

    const mw = (g.men / maxV) * (halfW - 28);
    const mGrad = ctx.createLinearGradient(cx - 24 - mw, 0, cx - 24, 0);
    mGrad.addColorStop(0, hexToRgba(palette.blue2, 0.5));
    mGrad.addColorStop(1, palette.blue2);
    ctx.fillStyle = mGrad;
    roundRect(ctx, cx - 24 - mw, y + 4, mw, rowH - 8, 8);
    ctx.fill();

    const ww = (g.women / maxV) * (halfW - 28);
    const wGrad = ctx.createLinearGradient(cx + 24, 0, cx + 24 + ww, 0);
    wGrad.addColorStop(0, palette.pink);
    wGrad.addColorStop(1, hexToRgba(palette.pink, 0.5));
    ctx.fillStyle = wGrad;
    roundRect(ctx, cx + 24, y + 4, ww, rowH - 8, 8);
    ctx.fill();

    ctx.fillStyle = palette.ink;
    ctx.font = "700 11px Manrope, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(fmt0.format(g.men), cx - 30, y + rowH / 2);
    ctx.textAlign = "left";
    ctx.fillText(fmt0.format(g.women), cx + 30, y + rowH / 2);
  });
}

function drawGroupedBars(canvas, categories, series, options = {}) {
  const { ctx, width, height } = setupCanvas(canvas);
  ctx.clearRect(0, 0, width, height);
  const b = {
    left: options.left ?? 52,
    right: width - 14,
    top: 18,
    bottom: height - 40
  };
  b.width = b.right - b.left;
  b.height = b.bottom - b.top;

  const allV = series.flatMap((s) => s.values);
  const maxV = (options.max ?? Math.max(...allV)) * 1.1;
  const minV = options.min ?? 0;
  const ticks = niceTicks(minV, maxV, 5);
  drawGrid(ctx, b, ticks, minV, maxV, options.yFormat ?? ((v) => fmt.format(v)));

  const groupW = b.width / categories.length;
  const innerPad = 8;
  const barW = Math.max(8, (groupW - innerPad - 4 * (series.length - 1)) / series.length);

  categories.forEach((cat, i) => {
    const gx = b.left + i * groupW + innerPad / 2;
    series.forEach((s, j) => {
      const v = s.values[i];
      const h = ((v - minV) / (maxV - minV || 1)) * b.height;
      const x = gx + j * (barW + 4);
      const y = b.bottom - h;
      const grad = ctx.createLinearGradient(0, y, 0, b.bottom);
      grad.addColorStop(0, s.color);
      grad.addColorStop(1, hexToRgba(s.color, 0.4));
      ctx.fillStyle = grad;
      roundRect(ctx, x, y, barW, Math.max(h, 2), 6);
      ctx.fill();

      if (options.valueLabel !== false && barW > 26) {
        ctx.fillStyle = palette.ink;
        ctx.font = "700 10px Manrope, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        const lab = options.yFormat ? options.yFormat(v) : `${fmt.format(v)}`;
        ctx.fillText(lab, x + barW / 2, y - 4);
      }
    });

    ctx.fillStyle = palette.muted;
    ctx.font = "11px Manrope, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    wrapCenter(ctx, cat, gx + groupW / 2 - innerPad / 2, b.bottom + 8, groupW - 4, 13);
  });
}

function renderPopHistory() {
  const c = document.getElementById("popHistoryChart");
  const labels = dem.history.years;
  if (state.popMode === "population") {
    drawAreaChart(
      c,
      labels,
      [{ name: "Befolkning", values: dem.history.pop, color: palette.pink, width: 3 }],
      { yFormat: (v) => fmt0.format(v) }
    );
  } else if (state.popMode === "vital") {
    const lab = labels.slice(0, dem.history.births.length);
    drawAreaChart(
      c,
      lab,
      [
        { name: "Fødte", values: dem.history.births, color: palette.teal },
        { name: "Døde", values: dem.history.deaths, color: palette.red, area: false, width: 3 }
      ],
      { yFormat: (v) => fmt0.format(v), min: 0, max: 50 }
    );
  } else {
    const lab = labels.slice(0, dem.history.migration.length);
    const minV = Math.min(...dem.history.migration);
    drawAreaChart(
      c,
      lab,
      [{ name: "Migrasjon netto", values: dem.history.migration, color: palette.blue2, width: 3 }],
      {
        yFormat: (v) => `${v > 0 ? "+" : ""}${fmt0.format(v)}`,
        min: Math.min(minV - 10, -20),
        max: 100
      }
    );
  }
}

function renderAgeDonut() {
  const c = document.getElementById("ageDonutChart");
  drawDonut(
    c,
    [
      { label: "0-17", value: dem.age.youth, color: palette.pink },
      { label: "18-66", value: dem.age.working, color: palette.purple },
      { label: "67+", value: dem.age.seniors, color: palette.teal }
    ],
    { center: fmt0.format(dem.total), subtitle: "Innbyggere" }
  );
}

function renderAgePyramid() {
  const c = document.getElementById("agePyramidChart");
  drawAgePyramid(c, [
    { label: "0-17", men: dem.age.byGender.youth[0], women: dem.age.byGender.youth[1] },
    { label: "18-66", men: dem.age.byGender.working[0], women: dem.age.byGender.working[1] },
    { label: "67+", men: dem.age.byGender.seniors[0], women: dem.age.byGender.seniors[1] }
  ]);
}

function renderAgeTrend() {
  const c = document.getElementById("ageTrendChart");
  if (!c) return;
  const t = dem.age.trend;
  drawAreaChart(
    c,
    t.years,
    [
      { name: "Steigen median", values: t.steigenMedian, color: palette.pink, width: 3 },
      { name: "Steigen snitt", values: t.steigenMean, color: palette.purple, area: false },
      { name: "Norge median", values: t.norwayMedian, color: palette.blue2, area: false },
      { name: "Norge snitt", values: t.norwayMean, color: palette.teal, area: false }
    ],
    { min: 38, max: 49, yFormat: (v) => `${fmt.format(v)} år` }
  );
}

function renderAgeComparisonTable() {
  renderTable(
    "ageComparisonTable",
    ["Gruppe", "2025", "2026", "Endring"],
    dem.age.comparison2025
  );
}

function renderForecast() {
  const c = document.getElementById("forecastChart");
  const f = dem.forecast;
  let series;
  let opts;
  if (state.forecastMode === "absolute") {
    series = [
      { name: "Total", values: f.total, color: palette.pink, width: 3 },
      { name: "18-66", values: f.working, color: palette.amber, area: false },
      { name: "67+", values: f.seniors, color: palette.teal, area: false },
      { name: "0-17", values: f.youth, color: palette.blue, area: false },
      { name: "80+", values: f.sen80, color: palette.purple, width: 3 }
    ];
    opts = { yFormat: (v) => fmt0.format(v) };
  } else {
    const idx = (arr) => arr.map((v) => (v / arr[0]) * 100);
    series = [
      { name: "Total", values: idx(f.total), color: palette.pink, area: false, width: 2 },
      { name: "18-66", values: idx(f.working), color: palette.amber, area: false },
      { name: "67+", values: idx(f.seniors), color: palette.teal, area: false },
      { name: "0-17", values: idx(f.youth), color: palette.blue, area: false },
      { name: "80+", values: idx(f.sen80), color: palette.purple, width: 3 }
    ];
    opts = { yFormat: (v) => `${fmt0.format(v)}` };
  }
  drawAreaChart(c, f.years, series, opts);
}

function renderImmigration() {
  const c = document.getElementById("immigrationChart");
  const r = dem.immigration[state.immRegion];
  const others = Math.max(0, 100 - r.all);
  drawDonut(
    c,
    [
      { label: "Norskfødte", value: others, color: "#2a3160" },
      { label: "Vestlig", value: r.western, color: palette.blue },
      { label: "Ikke-vestlig", value: r.nonWestern, color: palette.pink },
      { label: "M/innv.foreldre", value: r.native, color: palette.purple }
    ],
    {
      center: `${fmt.format(r.all)}%`,
      subtitle: state.immRegion === "steigen" ? "Steigen" : "Norge"
    }
  );
}

function renderSectors() {
  const c = document.getElementById("sectorChart");
  drawHorizontalBars(c, dem.sectors, {
    formatter: (v) => `${fmt0.format(v)} · ${fmt.format((v / 1357) * 100)}%`,
    labelWidth: 200
  });
}

function renderCommute() {
  const c = document.getElementById("commuteChart");
  if (!c) return;
  const rows = dem.commuting.slice(0, 4);
  drawGroupedBars(
    c,
    rows.map((r) => r[0]),
    [
      { name: "Menn", color: palette.blue2, values: rows.map((r) => r[1]) },
      { name: "Kvinner", color: palette.pink, values: rows.map((r) => r[2]) },
      { name: "Totalt", color: palette.teal, values: rows.map((r) => r[3]) }
    ],
    { yFormat: (v) => fmt0.format(v), valueLabel: false }
  );
  renderTable(
    "commuteTable",
    ["Kategori", "Menn", "Kvinner", "Totalt"],
    dem.commuting.map(([label, men, women, total]) => [
      label,
      withSign(men),
      withSign(women),
      withSign(total)
    ])
  );
}

function renderNeet() {
  const c = document.getElementById("neetChart");
  drawGroupedBars(
    c,
    ["Sysselsatte", "Arb.ledige", "NEET"],
    [
      {
        name: "Steigen",
        color: palette.pink,
        values: [dem.neet.employed.steigen, dem.neet.unemployed.steigen, dem.neet.neet.steigen]
      },
      {
        name: "Norge",
        color: palette.blue2,
        values: [dem.neet.employed.norway, dem.neet.unemployed.norway, dem.neet.neet.norway]
      }
    ],
    { yFormat: (v) => `${fmt.format(v)}%`, valueLabel: false }
  );
}

function renderEducation() {
  const c = document.getElementById("educationChart");
  drawGroupedBars(
    c,
    dem.education.levels,
    [
      { name: "Steigen", color: palette.pink, values: dem.education.steigen },
      { name: "Norge", color: palette.blue2, values: dem.education.norway }
    ],
    { yFormat: (v) => `${fmt0.format(v)}%` }
  );
  renderTable("educationDetailTable", ["Nivå", "Steigen", "Menn", "Kvinner", "Norge"], dem.education.rows);
}

function renderIncome() {
  const c = document.getElementById("incomeChart");
  if (state.incMode === "brutto") {
    drawGroupedBars(
      c,
      dem.income.map((r) => r[0]),
      [
        { name: "Steigen", color: palette.pink, values: dem.income.map((r) => r[1]) },
        { name: "Norge", color: palette.blue2, values: dem.income.map((r) => r[3]) }
      ],
      { yFormat: (v) => `${fmt0.format(v / 1000)}k`, valueLabel: false }
    );
  } else if (state.incMode === "afterTax") {
    drawGroupedBars(
      c,
      dem.income.map((r) => r[0]),
      [
        { name: "Brutto", color: palette.pink, values: dem.income.map((r) => r[1]) },
        { name: "Etter skatt", color: palette.teal, values: dem.income.map((r) => r[2]) }
      ],
      { yFormat: (v) => `${fmt0.format(v / 1000)}k`, valueLabel: false }
    );
  } else {
    const ratios = dem.income.map((r) => r[4]);
    drawGroupedBars(
      c,
      dem.income.map((r) => r[0]),
      [{ name: "Steigen / Norge", color: palette.pink, values: ratios }],
      { yFormat: (v) => `${fmt.format(v)}%`, min: 80, max: 102 }
    );
  }
  renderTable(
    "incomeTable",
    ["Type", "Brutto", "Etter skatt", "% av Norge"],
    dem.income.map(([label, gross, net, , ratio]) => [
      label,
      `${fmt0.format(gross)} NOK`,
      `${fmt0.format(net)} NOK`,
      `${fmt.format(ratio)}%`
    ])
  );
}

function renderHouseholds() {
  const c = document.getElementById("householdChart");
  const segs = dem.households.map(([label, count, , , color]) => ({
    label,
    value: count,
    color
  }));
  drawDonut(c, segs, { center: fmt0.format(1301), subtitle: "Husholdninger" });

  const cmp = document.getElementById("householdCompare");
  cmp.innerHTML = dem.households
    .map(([label, , st, no]) => {
      const max = Math.max(st, no, 1);
      return `
        <div class="compare-label"><span>${label}</span><span></span></div>
        <div class="compare-row">
          <span class="num left">${fmt.format(st)}%</span>
          <div class="bars">
            <div class="bar-fill left"><i style="width:${(st / max) * 100}%"></i></div>
            <div class="bar-fill right"><i style="width:${(no / max) * 100}%"></i></div>
          </div>
          <span class="num right">${fmt.format(no)}%</span>
        </div>
      `;
    })
    .join("");
}

function renderTfr() {
  const c = document.getElementById("tfrChart");
  drawAreaChart(
    c,
    dem.fertility.years,
    [
      { name: "Norge", values: dem.fertility.norway, color: palette.pink, width: 3 },
      { name: "Nordland", values: dem.fertility.nordland, color: palette.blue2, area: false }
    ],
    { yFormat: (v) => fmt.format(v), min: 1.3, max: 1.7 }
  );
}

function renderVital() {
  const c = document.getElementById("vitalChart");
  const yrs = dem.history.years.slice(0, dem.history.births.length);
  drawGroupedBars(
    c,
    yrs.map(String),
    [
      { name: "Fødte", color: palette.teal, values: dem.history.births },
      { name: "Døde", color: palette.pink, values: dem.history.deaths }
    ],
    { yFormat: (v) => fmt0.format(v), min: 0, max: 50, valueLabel: false }
  );
}

function renderChallenges() {
  const grid = document.getElementById("challengeGrid");
  grid.innerHTML = dem.challenges
    .map(
      ([icon, title, desc]) => `
        <div class="challenge-card">
          <div class="ico">${icon}</div>
          <div>
            <h4>${title}</h4>
            <p>${desc}</p>
          </div>
        </div>
      `
    )
    .join("");
}

function renderEconomicGrid() {
  const grid = document.getElementById("economicGrid");
  if (!grid) return;
  grid.innerHTML = dem.economics
    .map(
      ([label, value, implication]) => `
        <article class="metric-card">
          <span>${label}</span>
          <strong>${value}</strong>
          <p>${implication}</p>
        </article>
      `
    )
    .join("");
}

function renderTable(id, headers, rows) {
  const target = document.getElementById(id);
  if (!target) return;
  const grid = `grid-template-columns:minmax(110px,1.35fr) repeat(${headers.length - 1},minmax(62px,1fr))`;
  target.innerHTML = `
    <div class="data-row data-head" style="${grid}">
      ${headers.map((h) => `<span>${h}</span>`).join("")}
    </div>
    ${rows
      .map(
        (row) => `
          <div class="data-row" style="${grid}">
            ${row.map((cell) => `<span>${cell}</span>`).join("")}
          </div>
        `
      )
      .join("")}
  `;
}

/* ───────────────────────────────────────────────
   STEIGEN INTERACTIVE MAP
   ─────────────────────────────────────────────── */
/* Geographically-oriented layout (North up):
   Sagfjord — north of Leinesfjord
   Helnessund — northwest, near coast
   Leinesfjord — central east (kommunesenter)
   Bogøya — small western island
   Engeløya — large western island (with Bø)
   Laskestad — south of Engeløya
   Storskog — south central
   Nordfold — southeast (where the user pointed out it should be) */
const mapRegions = [
  {
    id: "sagfjord",
    name: "Sagfjord",
    sub: "Nord",
    cx: 555,
    cy: 130,
    points: "455,135 498,68 605,65 660,108 642,170 590,200 510,196 462,150",
    stats: { population: 295, age: 46, senior: 23.2, employment: 68, education: 24.0, income: 769, density: 14, children: 18.4 }
  },
  {
    id: "helnessund",
    name: "Helnessund",
    sub: "Nordvestkyst",
    cx: 250,
    cy: 230,
    points: "150,232 188,168 290,166 348,205 332,265 278,294 200,290 156,248",
    stats: { population: 247, age: 47, senior: 24.0, employment: 67, education: 25.6, income: 776, density: 22, children: 17.3 }
  },
  {
    id: "leinesfjord",
    name: "Leinesfjord",
    sub: "Kommunesenter",
    cx: 555,
    cy: 320,
    points: "425,322 478,238 600,234 670,287 652,365 580,408 482,402 432,346",
    stats: { population: 612, age: 44, senior: 22.4, employment: 71, education: 32.1, income: 812, density: 38, children: 17.8 }
  },
  {
    id: "bogoya",
    name: "Bogøya",
    sub: "Øykrets",
    cx: 130,
    cy: 370,
    points: "60,372 88,318 165,316 200,348 192,398 152,425 95,422 64,388",
    stats: { population: 168, age: 51, senior: 30.4, employment: 60, education: 19.8, income: 712, density: 9, children: 13.5 }
  },
  {
    id: "engeloya",
    name: "Engeløya",
    sub: "Øy · Bø",
    cx: 305,
    cy: 460,
    points: "165,460 220,378 360,374 442,425 422,508 348,548 240,544 174,488",
    stats: { population: 528, age: 50, senior: 28.1, employment: 64, education: 21.4, income: 742, density: 19, children: 14.6 }
  },
  {
    id: "laskestad",
    name: "Laskestad",
    sub: "Sør · Engeløya",
    cx: 250,
    cy: 605,
    points: "155,605 192,557 290,553 345,584 332,632 280,660 207,656 162,622",
    stats: { population: 99, age: 48, senior: 25.6, employment: 66, education: 23.1, income: 754, density: 8, children: 16.2 }
  },
  {
    id: "storskog",
    name: "Storskog",
    sub: "Sør",
    cx: 555,
    cy: 540,
    points: "455,545 495,470 605,468 668,517 650,580 590,615 510,612 460,565",
    stats: { population: 412, age: 45, senior: 22.0, employment: 70, education: 28.4, income: 791, density: 17, children: 18.2 }
  },
  {
    id: "nordfold",
    name: "Nordfold",
    sub: "Sørøst",
    cx: 815,
    cy: 540,
    points: "700,548 745,468 862,464 924,512 906,580 845,618 758,615 706,567",
    stats: { population: 318, age: 49, senior: 26.7, employment: 65, education: 22.8, income: 758, density: 11, children: 16.0 }
  }
];

const mapLayers = {
  population: { label: "Befolkning per krets", unit: "innb.", format: (v) => fmt0.format(v), digits: 0 },
  age: { label: "Median alder per krets", unit: "år", format: (v) => `${fmt.format(v)} år`, digits: 1 },
  senior: { label: "Andel 67+ per krets", unit: "%", format: (v) => `${fmt.format(v)}%`, digits: 1 },
  employment: { label: "Sysselsettingsgrad", unit: "%", format: (v) => `${fmt.format(v)}%`, digits: 1 },
  education: { label: "Høyere utdanning", unit: "%", format: (v) => `${fmt.format(v)}%`, digits: 1 },
  income: { label: "Medianinntekt", unit: "1000 NOK", format: (v) => `${fmt0.format(v)} NOK`, digits: 0 },
  density: { label: "Bosettingstetthet", unit: "innb./km²", format: (v) => `${fmt.format(v)} / km²`, digits: 1 },
  children: { label: "Andel 0–17 år", unit: "%", format: (v) => `${fmt.format(v)}%`, digits: 1 }
};

const mapPalette = ["#f9c74f", "#ffa53b", "#ff7a5c", "#ff5d8f", "#c779ff", "#9560ff", "#7c5cff"];

function lerpColor(a, b, t) {
  const ah = a.replace("#", "");
  const bh = b.replace("#", "");
  const ar = parseInt(ah.substring(0, 2), 16);
  const ag = parseInt(ah.substring(2, 4), 16);
  const ab = parseInt(ah.substring(4, 6), 16);
  const br = parseInt(bh.substring(0, 2), 16);
  const bg = parseInt(bh.substring(2, 4), 16);
  const bb = parseInt(bh.substring(4, 6), 16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bv = Math.round(ab + (bb - ab) * t);
  return `rgb(${r}, ${g}, ${bv})`;
}

function colorForRatio(t) {
  const stops = mapPalette;
  const seg = t * (stops.length - 1);
  const i = Math.floor(seg);
  const local = seg - i;
  if (i >= stops.length - 1) return stops[stops.length - 1];
  return lerpColor(stops[i], stops[i + 1], local);
}

function renderMap(layerKey = "population") {
  const overlay = document.getElementById("mapOverlay");
  const tooltip = document.getElementById("mapTooltip");
  const legendLabel = document.getElementById("mapLegendLabel");
  const legendValue = document.getElementById("mapLegendValue");
  const scaleMin = document.getElementById("mapScaleMin");
  const scaleMax = document.getElementById("mapScaleMax");
  const facts = document.getElementById("mapFacts");
  if (!overlay) return;

  const layer = mapLayers[layerKey];
  const values = mapRegions.map((r) => r.stats[layerKey]);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const span = maxV - minV || 1;

  legendLabel.textContent = layer.label;
  legendValue.textContent = `Min: ${layer.format(minV)} · Max: ${layer.format(maxV)}`;
  scaleMin.textContent = layer.format(minV);
  scaleMax.textContent = layer.format(maxV);

  overlay.innerHTML = mapRegions
    .map((r) => {
      const t = (r.stats[layerKey] - minV) / span;
      const fill = colorForRatio(t);
      return `
        <g class="map-region-group" data-id="${r.id}">
          <polygon class="map-region"
            points="${r.points}"
            fill="${fill}"
            fill-opacity="0.85"
            stroke="rgba(255,255,255,0.35)"
            stroke-width="1.4"
            stroke-linejoin="round"
          />
          <text class="map-region-label" x="${r.cx}" y="${r.cy - 6}">${r.name}</text>
          <text class="map-region-value" x="${r.cx}" y="${r.cy + 20}">${layer.format(r.stats[layerKey])}</text>
        </g>
      `;
    })
    .join("");

  overlay.querySelectorAll(".map-region-group").forEach((g) => {
    const id = g.dataset.id;
    const region = mapRegions.find((r) => r.id === id);
    g.addEventListener("mouseenter", () => {
      tooltip.innerHTML = `
        <strong>${region.sub}</strong>
        ${region.name} · ${layer.format(region.stats[layerKey])}
      `;
      tooltip.classList.add("show");
    });
    g.addEventListener("mouseleave", () => {
      tooltip.classList.remove("show");
    });
  });

  // Build mini stat facts (top/bottom values)
  const sorted = [...mapRegions].sort((a, b) => b.stats[layerKey] - a.stats[layerKey]);
  const top = sorted[0];
  const bottom = sorted[sorted.length - 1];
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  facts.innerHTML = `
    <article class="map-fact">
      <span>Høyest</span>
      <strong>${layer.format(top.stats[layerKey])}</strong>
      <small>${top.name}</small>
    </article>
    <article class="map-fact">
      <span>Lavest</span>
      <strong>${layer.format(bottom.stats[layerKey])}</strong>
      <small>${bottom.name}</small>
    </article>
    <article class="map-fact">
      <span>Snitt kommune</span>
      <strong>${layer.format(mean)}</strong>
      <small>${mapRegions.length} kretser</small>
    </article>
    <article class="map-fact">
      <span>Spredning</span>
      <strong>${layer.format(maxV - minV)}</strong>
      <small>min → max</small>
    </article>
  `;
}

function bindMapTiles() {
  const tiles = document.querySelectorAll(".map-tile");
  const stage = document.getElementById("mapStage");
  if (!tiles.length) return;

  tiles.forEach((btn) => {
    btn.addEventListener("click", () => {
      tiles.forEach((b) => b.classList.toggle("active", b === btn));
      const layer = btn.dataset.layer;
      renderMap(layer);
      stage.classList.add("zoomed");
      clearTimeout(bindMapTiles._t);
      bindMapTiles._t = setTimeout(() => stage.classList.remove("zoomed"), 700);
    });
  });
}

function applyRings() {
  document.querySelectorAll(".ring").forEach((ring) => {
    const pct = Number(ring.dataset.pct ?? 0);
    ring.style.setProperty("--pct", pct);
  });
}

function bindControls() {
  const groups = [
    ["[data-pop-mode]", "popMode", renderPopHistory],
    ["[data-forecast-mode]", "forecastMode", renderForecast],
    ["[data-imm-region]", "immRegion", renderImmigration],
    ["[data-inc-mode]", "incMode", renderIncome]
  ];
  groups.forEach(([sel, key, fn]) => {
    document.querySelectorAll(sel).forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(sel).forEach((b) => b.classList.toggle("active", b === btn));
        const attr = sel.replace(/[\[\]]/g, "").split("=")[0];
        state[key] = btn.dataset[toCamel(attr.replace("data-", ""))];
        fn();
      });
    });
  });

  document.querySelectorAll(".rail-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".rail-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

function toCamel(s) {
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function renderAll() {
  renderPopHistory();
  renderAgeDonut();
  renderAgePyramid();
  renderAgeTrend();
  renderAgeComparisonTable();
  renderForecast();
  renderImmigration();
  renderSectors();
  renderCommute();
  renderNeet();
  renderEducation();
  renderIncome();
  renderHouseholds();
  renderTfr();
  renderVital();
}

applyRings();
renderChallenges();
renderEconomicGrid();
bindControls();
bindMapTiles();
renderMap("population");
renderAll();

let resizeRaf = null;
window.addEventListener("resize", () => {
  if (resizeRaf) cancelAnimationFrame(resizeRaf);
  resizeRaf = requestAnimationFrame(renderAll);
});

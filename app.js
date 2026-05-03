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

const data = {
  years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
  revenue: [275891, 317854, 310835, 327583, 339455, 384588, 374565, 435311],
  expense: [280440, 294188, 314291, 319011, 345676, 378513, 396542, 410978],
  netResult: [-2576, 29475, 481, 11749, 661, 9138, -23631, 19539],
  sectors2024: [
    ["Helse og omsorg", 122762, palette.pink, "HO"],
    ["Grunnskole", 65967, palette.purple, "GR"],
    ["Administrasjon", 27901, palette.blue2, "AD"],
    ["Barnehage", 27455, palette.teal, "BH"],
    ["Eiendomsforvaltning", 23999, palette.amber, "EI"],
    ["Barnevern", 20208, "#c779ff", "BV"],
    ["Øvrige netto", 16849, "#7d8dff", "ØV"]
  ],
  revenueMix2024: [
    ["Rammetilskudd", 152246, palette.pink],
    ["Skatt på inntekt og formue", 84082, palette.purple],
    ["Andre statlige overføringer", 82401, palette.blue2],
    ["Salgs- og leieinntekter", 46974, palette.teal],
    ["Andre driftsinntekter", 46423, palette.amber],
    ["Eiendomsskatt", 13452, "#c779ff"],
    ["Utbytte og eieruttak", 5403, "#7d8dff"]
  ],
  taxForecast: {
    years: [2024, 2025, 2026, 2027, 2028, 2029, 2030],
    conservative: [13452, 13564.595, 13678.206, 13792.844, 13908.517, 14025.235, 14143.009],
    base: [13452, 13766.375, 14088.171, 14417.564, 14754.737, 15099.873, 15453.162],
    optimistic: [13452, 14013.49, 14598.712, 15208.681, 15844.455, 16507.136, 17197.877]
  },
  pillars: [
    ["A", "Internt vikarpool", "slutt på avhengighet av vikarbyrå", "8-12 mill.", palette.pink],
    ["B", "Velferdsteknologi / TØRN", "færre nattevakter og rutinebesøk", "3-5 mill.", palette.purple],
    ["C", "Forebygging og omsorgstrapp", "senere innleggelse på sykehjem", "2-4 mill.", palette.teal],
    ["D", "Skole- og barnehagestruktur", "politisk vedtak etter dialog", "3-4 mill.", palette.amber],
    ["E", "Interkommunalt samarbeid", "felles tjenester og rekruttering", "2-3 mill.", palette.blue2]
  ]
};

const fmt = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 1 });
const fmt0 = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });
const state = { taxScenario: "base" };

const mln = (v) => v / 1000;
const moneyMln = (v) => `${v > 0 ? "+" : v < 0 ? "-" : ""}${fmt.format(Math.abs(v))} mill.`;

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width: rect.width, height: rect.height };
}

function niceTicks(min, max, count = 5) {
  if (min === max) return [min];
  const span = max - min;
  const stepRaw = span / Math.max(1, count - 1);
  const magnitude = 10 ** Math.floor(Math.log10(stepRaw));
  const step = Math.ceil(stepRaw / magnitude) * magnitude;
  const first = Math.floor(min / step) * step;
  const ticks = [];
  for (let v = first; v <= max + step; v += step) {
    if (v >= min - step * 0.2) ticks.push(v);
    if (ticks.length >= count + 2) break;
  }
  return ticks;
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

function drawAreaChart(canvas, labels, series, options = {}) {
  const { ctx, width, height } = setupCanvas(canvas);
  ctx.clearRect(0, 0, width, height);
  const b = {
    left: options.left ?? 48,
    right: width - 14,
    top: 18,
    bottom: height - 30
  };
  b.width = b.right - b.left;
  b.height = b.bottom - b.top;

  const allValues = series.flatMap((s) => s.values);
  const minV = options.min ?? Math.min(...allValues);
  const maxV = options.max ?? Math.max(...allValues);
  const pad = (maxV - minV || 1) * 0.15;
  const minY = options.min ?? minV - pad;
  const maxY = options.max ?? maxV + pad;
  const ticks = niceTicks(minY, maxY, 5);
  const yFormat = options.yFormat ?? ((v) => fmt0.format(v / 1000));

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
    const points = s.values.map((v, i) => xy(v, i, s.values.length));

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

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawHorizontalBars(canvas, rows) {
  const { ctx, width, height } = setupCanvas(canvas);
  ctx.clearRect(0, 0, width, height);
  const labelWidth = Math.min(180, width * 0.4);
  const b = {
    left: labelWidth,
    right: width - 14,
    top: 12,
    bottom: height - 12
  };
  const gap = 10;
  const rowH = Math.max(20, (b.bottom - b.top - gap * (rows.length - 1)) / rows.length);
  const max = Math.max(...rows.map((r) => Math.abs(r[1])));

  ctx.font = "12px Manrope, sans-serif";
  rows.forEach((row, i) => {
    const [label, value, color] = row;
    const y = b.top + i * (rowH + gap);
    const w = (Math.abs(value) / max) * (b.right - b.left);

    ctx.fillStyle = palette.muted;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    wrapLabel(ctx, label, 4, y + rowH / 2, labelWidth - 18, 13);

    ctx.fillStyle = "rgba(255,255,255,0.04)";
    roundRect(ctx, b.left, y, b.right - b.left, rowH, 8);
    ctx.fill();

    const grad = ctx.createLinearGradient(b.left, y, b.left + w, y);
    grad.addColorStop(0, hexToRgba(color, 0.85));
    grad.addColorStop(1, color);
    ctx.fillStyle = grad;
    roundRect(ctx, b.left, y, w, rowH, 8);
    ctx.fill();

    ctx.fillStyle = palette.ink;
    ctx.font = "700 12px Manrope, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`${fmt.format(mln(value))} mill.`, b.right - 8, y + rowH / 2);
  });
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function wrapLabel(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
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

function drawColumnChart(canvas, labels, values, options = {}) {
  const { ctx, width, height } = setupCanvas(canvas);
  ctx.clearRect(0, 0, width, height);
  const b = {
    left: options.left ?? 56,
    right: width - 14,
    top: 18,
    bottom: height - 32
  };
  b.width = b.right - b.left;
  b.height = b.bottom - b.top;

  const minV = Math.min(0, ...values);
  const maxV = Math.max(0, ...values);
  const pad = (maxV - minV || 1) * 0.12;
  const minY = minV - pad;
  const maxY = maxV + pad;
  const ticks = niceTicks(minY, maxY, 5);
  const yFormat = options.yFormat ?? ((v) => fmt0.format(v / 1000));

  drawGrid(ctx, b, ticks, minY, maxY, yFormat);

  const zeroY = b.bottom - ((0 - minY) / (maxY - minY || 1)) * b.height;
  const gap = 10;
  const barW = (b.width - gap * (values.length - 1)) / values.length;

  ctx.font = "11px Manrope, sans-serif";
  values.forEach((v, i) => {
    const x = b.left + i * (barW + gap);
    const h = ((v - 0) / (maxY - minY || 1)) * b.height;
    const y = v >= 0 ? zeroY - h : zeroY;
    const barHeight = Math.max(2, Math.abs(h));
    const baseColor = v >= 0 ? options.posColor || palette.green : options.negColor || palette.pink;
    const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
    if (v >= 0) {
      grad.addColorStop(0, baseColor);
      grad.addColorStop(1, hexToRgba(baseColor, 0.4));
    } else {
      grad.addColorStop(0, hexToRgba(baseColor, 0.4));
      grad.addColorStop(1, baseColor);
    }
    ctx.fillStyle = grad;
    roundRect(ctx, x, y, barW, barHeight, 6);
    ctx.fill();

    ctx.fillStyle = palette.ink;
    ctx.font = "700 11px Manrope, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = v >= 0 ? "bottom" : "top";
    const labelOffset = v >= 0 ? -6 : barHeight + 6;
    ctx.fillText(moneyMln(v), x + barW / 2, y + labelOffset);

    ctx.fillStyle = palette.muted;
    ctx.font = "11px Manrope, sans-serif";
    ctx.textBaseline = "top";
    ctx.fillText(String(labels[i]), x + barW / 2, b.bottom + 10);
  });
}

function drawDonutChart(canvas, segments, options = {}) {
  const { ctx, width, height } = setupCanvas(canvas);
  ctx.clearRect(0, 0, width, height);
  const cx = width * 0.4;
  const cy = height / 2;
  const r = Math.min(width * 0.7, height) / 2 - 18;
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
    angle = next;
  });

  ctx.fillStyle = palette.muted;
  ctx.font = "10px Manrope, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(options.subtitle || "Total", cx, cy - 14);
  ctx.fillStyle = palette.ink;
  ctx.font = "800 18px Manrope, sans-serif";
  ctx.fillText(options.center ?? `${fmt0.format(total / 1000)} mill.`, cx, cy + 8);

  const legendX = width * 0.68;
  let legendY = 24;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  segments.forEach((seg) => {
    const pct = (seg.value / total) * 100;
    ctx.fillStyle = seg.color;
    roundRect(ctx, legendX, legendY - 5, 10, 10, 2);
    ctx.fill();
    ctx.fillStyle = palette.ink;
    ctx.font = "600 11px Manrope, sans-serif";
    ctx.fillText(seg.label, legendX + 16, legendY);
    ctx.fillStyle = palette.muted;
    ctx.font = "10px Manrope, sans-serif";
    ctx.fillText(`${fmt.format(pct)}% · ${fmt0.format(seg.value / 1000)} mill.`, legendX + 16, legendY + 14);
    legendY += 32;
  });
}

function drawWaterfall(canvas, rows) {
  const { ctx, width, height } = setupCanvas(canvas);
  ctx.clearRect(0, 0, width, height);
  const b = { left: 50, right: width - 16, top: 18, bottom: height - 50 };
  b.width = b.right - b.left;
  b.height = b.bottom - b.top;

  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.value)), 1);
  const zeroY = b.top + b.height / 2;

  ctx.strokeStyle = palette.grid;
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ctx.moveTo(b.left, zeroY);
  ctx.lineTo(b.right, zeroY);
  ctx.stroke();
  ctx.setLineDash([]);

  const compact = width < 460;
  const gap = compact ? 10 : 16;
  const barW = (b.width - gap * (rows.length - 1)) / rows.length;

  rows.forEach((row, i) => {
    const x = b.left + i * (barW + gap);
    const h = (Math.abs(row.value) / maxAbs) * (b.height / 2 - 14);
    const y = row.value >= 0 ? zeroY - h : zeroY;
    const grad = ctx.createLinearGradient(0, y, 0, y + h);
    grad.addColorStop(0, row.color);
    grad.addColorStop(1, hexToRgba(row.color, 0.4));
    ctx.fillStyle = grad;
    roundRect(ctx, x, y, barW, Math.max(h, 2), 8);
    ctx.fill();

    ctx.fillStyle = palette.ink;
    ctx.font = "700 12px Manrope, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = row.value >= 0 ? "bottom" : "top";
    ctx.fillText(moneyMln(row.value), x + barW / 2, row.value >= 0 ? y - 8 : y + h + 8);

    ctx.fillStyle = palette.muted;
    ctx.font = `${compact ? 10 : 11}px Manrope, sans-serif`;
    ctx.textBaseline = "top";
    wrapCentered(ctx, compact && row.short ? row.short : row.label, x + barW / 2, b.bottom + 14, barW + 12, 13);
  });
}

function wrapCentered(ctx, text, cx, y, maxWidth, lineHeight) {
  const words = text.split(" ");
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

function renderRecentList() {
  const list = document.querySelector("#recentList");
  list.innerHTML = data.sectors2024
    .slice(0, 5)
    .map(
      ([name, value, color, ico]) => `
        <li>
          <span class="ico" style="background:linear-gradient(135deg, ${color}, ${hexToRgba(color, 0.55)})">${ico}</span>
          <span>
            <span class="name">${name}</span>
            <span class="sub">${shareLabel(value)}</span>
          </span>
          <span class="amt">${fmt.format(mln(value))} mill.</span>
        </li>
      `
    )
    .join("");
}

function shareLabel(value) {
  const total = data.sectors2024.reduce((acc, [, v]) => acc + v, 0);
  return `${fmt.format((value / total) * 100)}% av netto utgifter`;
}

function renderPillars() {
  const target = document.querySelector("#pillarList");
  target.innerHTML = data.pillars
    .map(
      ([letter, name, desc, effect, color]) => `
        <div class="pillar">
          <b style="background:linear-gradient(135deg, ${color}, ${hexToRgba(color, 0.55)})">${letter}</b>
          <span><strong>${name}</strong><span>${desc}</span></span>
          <em>${effect}</em>
        </div>
      `
    )
    .join("");
}

function getNumber(id) {
  return Number(document.getElementById(id).value);
}

function setOutput(id, value) {
  document.getElementById(id).textContent = `${fmt.format(value)} mill.`;
}

function updateSimulation() {
  ["pillarA", "pillarB", "pillarC", "pillarD", "pillarE", "revenueLift", "costPressure"].forEach((id) =>
    setOutput(`${id}Value`, getNumber(id))
  );

  const savings =
    getNumber("pillarA") + getNumber("pillarB") + getNumber("pillarC") + getNumber("pillarD") + getNumber("pillarE");
  const revenueLift = getNumber("revenueLift");
  const pressure = getNumber("costPressure");
  const scenarioValues = data.taxForecast[state.taxScenario];
  const tax2030Mln = mln(scenarioValues.at(-1));
  const taxIncrement = tax2030Mln - mln(13452);
  const annualEffect = savings + revenueLift + taxIncrement - pressure;
  const projectedNet = mln(19539) + annualEffect;
  const projectedRevenue2030 = mln(435311) * 1.02 ** 6 + revenueLift + taxIncrement;
  const margin = projectedNet / projectedRevenue2030;

  document.getElementById("annualEffect").textContent = moneyMln(annualEffect);
  document.getElementById("projectedNet").textContent = moneyMln(projectedNet);
  document.getElementById("projectedMargin").textContent = `${fmt.format(margin * 100)}%`;
  document.getElementById("tax2030").textContent = `${fmt.format(tax2030Mln)} mill.`;

  const card = document.getElementById("projectedMargin").closest(".result-card");
  card.classList.remove("good", "warn", "bad");
  if (margin >= 0.025) {
    card.classList.add("good");
    document.getElementById("marginStatus").textContent = "over mål 2,5%";
  } else if (margin >= 0.0175) {
    card.classList.add("warn");
    document.getElementById("marginStatus").textContent = "over TBU-minimum";
  } else {
    card.classList.add("bad");
    document.getElementById("marginStatus").textContent = "under TBU-minimum";
  }

  drawWaterfall(document.getElementById("simulationChart"), [
    { label: "Innsparinger", short: "Spare", value: savings, color: palette.pink },
    { label: "Nye inntekter", short: "Inntekt", value: revenueLift, color: palette.purple },
    { label: "Eiendomsskatt", short: "E.skatt", value: taxIncrement, color: palette.amber },
    { label: "Kostnadspress", short: "Press", value: -pressure, color: palette.red },
    { label: "Nettoeffekt", short: "Netto", value: annualEffect, color: annualEffect >= 0 ? palette.green : palette.red }
  ]);
}

function renderCharts() {
  drawAreaChart(
    document.getElementById("incomeExpenseChart"),
    data.years,
    [
      { name: "Inntekter", values: data.revenue, color: palette.pink },
      { name: "Utgifter", values: data.expense, color: palette.blue2 }
    ]
  );

  drawColumnChart(
    document.getElementById("pulseChart"),
    data.years,
    data.netResult,
    {
      posColor: palette.green,
      negColor: palette.pink,
      yFormat: (v) => `${fmt.format(v / 1000)}`
    }
  );

  drawHorizontalBars(document.getElementById("sectorChart"), data.sectors2024);
  drawDonutChart(
    document.getElementById("revenueMixChart"),
    data.revenueMix2024.map(([label, value, color]) => ({ label, value, color })),
    { subtitle: "Inntekter 2024", center: `${fmt0.format(data.revenueMix2024.reduce((a,r) => a + r[1], 0) / 1000)} mill.` }
  );

  drawAreaChart(
    document.getElementById("taxChart"),
    data.taxForecast.years,
    [
      { name: "Konservativ", values: data.taxForecast.conservative, color: palette.blue, area: false, width: 2.4 },
      { name: "Basis", values: data.taxForecast.base, color: palette.pink, area: false, width: 3.2 },
      { name: "Optimistisk", values: data.taxForecast.optimistic, color: palette.amber, area: false, width: 2.4 }
    ],
    { yFormat: (v) => `${fmt.format(v / 1000)} mill.` }
  );

  updateSimulation();
}

function bindControls() {
  document.querySelectorAll("input[type='range']").forEach((input) => {
    input.addEventListener("input", updateSimulation);
  });

  document.querySelectorAll(".segment").forEach((button) => {
    button.addEventListener("click", () => {
      state.taxScenario = button.dataset.scenario;
      document.querySelectorAll(".segment").forEach((b) => b.classList.toggle("active", b === button));
      updateSimulation();
    });
  });

  document.querySelectorAll(".rail-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".rail-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

function applyRings() {
  document.querySelectorAll(".ring").forEach((ring) => {
    const pct = Number(ring.dataset.pct ?? 0);
    ring.style.setProperty("--pct", pct);
  });
}

applyRings();
renderRecentList();
renderPillars();
bindControls();
renderCharts();

let resizeRaf = null;
window.addEventListener("resize", () => {
  if (resizeRaf) cancelAnimationFrame(resizeRaf);
  resizeRaf = requestAnimationFrame(renderCharts);
});

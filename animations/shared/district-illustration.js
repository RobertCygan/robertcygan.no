"use strict";
(() => {
  // Deliberately fictional, contiguous districts. These coordinates are unrelated to a real municipality.
  const vertices = Array.from({ length: 4 }, (_, row) =>
    Array.from({ length: 5 }, (_, col) => [
      (col - 2) * 0.014 + Math.sin(row * 3 + col * 2) * 0.0024,
      (row - 1.5) * 0.014 + Math.cos(row * 2 + col * 3) * 0.002,
    ]),
  );
  const rings = Array.from({ length: 12 }, (_, id) => {
    const row = Math.floor(id / 4),
      col = id % 4;
    const ring = [
      vertices[row][col],
      vertices[row][col + 1],
      vertices[row + 1][col + 1],
      vertices[row + 1][col],
    ];
    return [...ring, ring[0]];
  });
  function illustration(rows, { small = false, flat = false } = {}) {
    const project = ([x, y], height = 0) => [
      245 + x * 4700 + y * 1800,
      190 - y * 2250 + x * 1000 - height * (small ? 0.065 : 0.09),
    ];
    const points = (coordinates) =>
      coordinates.map((p) => p.map((n) => n.toFixed(1)).join(",")).join(" ");
    const ordered = [...rows].sort((a, b) => b.id - a.id);
    return `<svg class="district-map district-map--3d" viewBox="0 0 490 300" role="img" aria-label="${flat ? "Kart" : "3D-visning med søylehøyder"} over fiktive grunnkretser">${ordered
      .map((row) => {
        const original = rings[row.id].slice(0, 4),
          center = original.reduce(
            (s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4],
            [0, 0],
          );
        const ring = original.map((p) => [
          center[0] + (p[0] - center[0]) * 0.93,
          center[1] + (p[1] - center[1]) * 0.93,
        ]);
        const base = ring.map((p) => project(p)),
          top = ring.map((p) => project(p, flat ? 0 : row.height));
        return `<g role="button" tabindex="0" data-district="${row.id}" aria-label="Velg ${row.name}" aria-pressed="${!!row.selected}">${ring
          .map((_, i) => {
            const j = (i + 1) % 4;
            return `<polygon points="${points([base[i], base[j], top[j], top[i]])}" fill="${row.color}" stroke="#18261f" stroke-width="1"/><polygon points="${points([base[i], base[j], top[j], top[i]])}" fill="#0b1714" opacity="${i % 2 ? 0.3 : 0.12}"/>`;
          })
          .join(
            "",
          )}<polygon points="${points(top)}" fill="${row.color}" stroke="${row.selected ? "#fff4c8" : "#253b30"}" stroke-width="${row.selected ? 3 : 1}"/><title>${row.name} · ${row.label || ""}</title>${small ? "" : `<text x="${top.reduce((s, p) => s + p[0], 0) / 4}" y="${top.reduce((s, p) => s + p[1], 0) / 4}" text-anchor="middle" fill="#172119" style="font:600 11px system-ui">${String(row.id + 1).padStart(2, "0")}</text>`}</g>`;
      })
      .join("")}</svg>`;
  }

  window.AnimationDistrictIllustration = illustration;
})();

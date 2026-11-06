"use strict";
(() => {
  // Deliberately fictional, contiguous districts. These coordinates are unrelated to a real municipality.
  const vertices = Array.from({ length: 4 }, (_, row) => Array.from({ length: 5 }, (_, col) => [
    (col - 2) * .014 + Math.sin(row * 3 + col * 2) * .0024,
    (row - 1.5) * .014 + Math.cos(row * 2 + col * 3) * .002
  ]));
  const rings = Array.from({ length: 12 }, (_, id) => {
    const row = Math.floor(id / 4), col = id % 4;
    const ring = [vertices[row][col], vertices[row][col + 1], vertices[row + 1][col + 1], vertices[row + 1][col]];
    return [...ring, ring[0]];
  });
  function illustration(rows, { small = false, flat = false } = {}) {
    const project = ([x, y], height = 0) => [245 + x * 4700 + y * 1800, 190 - y * 2250 + x * 1000 - height * (small ? .065 : .09)];
    const points = coordinates => coordinates.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ');
    const ordered = [...rows].sort((a,b) => b.id - a.id);
    return `<svg class="district-map district-map--3d" viewBox="0 0 490 300" role="img" aria-label="${flat?'Kart':'3D-visning med søylehøyder'} over fiktive grunnkretser">${ordered.map(row => {
      const original = rings[row.id].slice(0,4), center=original.reduce((s,p)=>[s[0]+p[0]/4,s[1]+p[1]/4],[0,0]);
      const ring=original.map(p=>[center[0]+(p[0]-center[0])*.93,center[1]+(p[1]-center[1])*.93]);
      const base = ring.map(p => project(p)), top = ring.map(p => project(p, flat ? 0 : row.height));
      return `<g role="button" tabindex="0" data-district="${row.id}" aria-label="Velg ${row.name}" aria-pressed="${!!row.selected}">${ring.map((_,i) => {
        const j = (i + 1) % 4;
        return `<polygon points="${points([base[i],base[j],top[j],top[i]])}" fill="${row.color}" stroke="#18261f" stroke-width="1"/><polygon points="${points([base[i],base[j],top[j],top[i]])}" fill="#0b1714" opacity="${i%2?.3:.12}"/>`;
      }).join('')}<polygon points="${points(top)}" fill="${row.color}" stroke="${row.selected?'#fff4c8':'#253b30'}" stroke-width="${row.selected?3:1}"/><title>${row.name} · ${row.label || ''}</title>${small ? '' : `<text x="${top.reduce((s,p)=>s+p[0],0)/4}" y="${top.reduce((s,p)=>s+p[1],0)/4}" text-anchor="middle" fill="#172119" style="font:600 11px system-ui">${String(row.id+1).padStart(2,'0')}</text>`}</g>`;
    }).join('')}</svg>`;
  }
  class TaxMap {
    constructor(container, onSelect) {
      this.container = container; this.onSelect = onSelect; this.rows = []; this.threeD = true;
      this.ready = false; this.failed = false;
      addEventListener('pagehide', event => {
        if (event.persisted) return;
        this.resizeObserver?.disconnect();
        this.popup?.remove();
        this.map?.remove();
        this.map = null;
      });
      const fallbackClick = event => {
        const target = event.target.closest('[data-district]');
        if (target) onSelect(Number(target.dataset.district));
      };
      container.addEventListener('click', fallbackClick);
      container.addEventListener('keydown', event => {
        if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-district]')) { event.preventDefault(); fallbackClick(event); }
      });
      try {
        if (!window.maplibregl) throw new Error('MapLibre unavailable');
        this.map = new maplibregl.Map({
          container, center: [0, 0], zoom: 12.25, pitch: 58, bearing: -26,
          attributionControl: false, maxPitch: 75, minZoom: 10, maxZoom: 16,
          style: { version: 8, sources: {}, layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#13201c' } }] }
        });
        this.map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
        this.map.on('load', () => {
          if (this.failed) return;
          this.map.addSource('districts', { type: 'geojson', data: this.geoJSON() });
          this.map.addLayer({ id: 'district-extrusions', type: 'fill-extrusion', source: 'districts', paint: {
            'fill-extrusion-color': ['get', 'color'], 'fill-extrusion-height': this.heightExpression(),
            'fill-extrusion-base': 0, 'fill-extrusion-opacity': .94, 'fill-extrusion-vertical-gradient': true,
            'fill-extrusion-height-transition': { duration: matchMedia('(prefers-reduced-motion: reduce)').matches?0:450 }
          } });
          this.map.setLight({ anchor: 'viewport', color: '#ffefcb', intensity: .55, position: [1.5, 190, 45] });
          this.map.on('click', 'district-extrusions', event => {
            const feature = event.features?.[0];
            if (feature) onSelect(Number(feature.properties.id));
          });
          this.map.on('mouseenter', 'district-extrusions', () => { this.map.getCanvas().style.cursor = 'pointer'; });
          this.map.on('mouseleave', 'district-extrusions', () => { this.map.getCanvas().style.cursor = ''; this.popup?.remove(); });
          this.map.on('mousemove', 'district-extrusions', event => {
            const feature = event.features?.[0]; if (!feature) return;
            this.popup?.remove();
            this.popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false }).setLngLat(event.lngLat)
              .setText(`${feature.properties.name} · ${feature.properties.label}`).addTo(this.map);
          });
          this.ready = true; container.dataset.ready = 'true'; container.dataset.renderer = 'webgl';
          this.map.resize();
        });
        this.map.on('error', event => { if (!this.ready) this.fallback(); });
        this.resizeObserver = new ResizeObserver(() => this.map?.resize()); this.resizeObserver.observe(container);
      } catch { this.fallback(); }
    }
    heightExpression() { return this.threeD ? ['get', 'height'] : 0; }
    geoJSON() { return { type: 'FeatureCollection', features: this.rows.map(row => ({ type: 'Feature', id: row.id, properties: { ...row, color: row.selected?'#f2d491':row.color }, geometry: { type: 'Polygon', coordinates: [rings[row.id].map(p => {const ring=rings[row.id].slice(0,4),c=ring.reduce((s,v)=>[s[0]+v[0]/4,s[1]+v[1]/4],[0,0]);return [c[0]+(p[0]-c[0])*.93,c[1]+(p[1]-c[1])*.93];})] } })) }; }
    update(rows) {
      this.rows = rows;
      if (this.failed) this.drawFallback();
      else if (this.ready) this.map.getSource('districts').setData(this.geoJSON());
    }
    view(threeD) {
      this.threeD = threeD;
      if (this.failed) this.drawFallback();
      else {
        this.map.easeTo({ pitch: threeD?58:0, duration: matchMedia('(prefers-reduced-motion: reduce)').matches?0:450 });
        if (this.ready) this.map.setPaintProperty('district-extrusions', 'fill-extrusion-height', this.heightExpression());
      }
    }
    resetCamera() { if (!this.failed) this.map.easeTo({ center: [0,0], zoom: 12.25, bearing: -26, pitch: this.threeD?58:0 }); }
    fallback() {
      if (this.failed) return;
      this.failed = true; this.resizeObserver?.disconnect(); this.map?.remove(); this.map = null;
      this.container.dataset.renderer = 'illustration'; this.container.dataset.ready = 'true'; this.drawFallback();
    }
    drawFallback() { this.container.innerHTML = illustration(this.rows, { flat: !this.threeD }) + '<p class="map-fallback-note">Skjematisk 3D-visning. WebGL er ikke tilgjengelig i denne nettleseren.</p>'; }
  }
  window.TaxMap = TaxMap;
  window.TaxMapIllustration = illustration;
})();

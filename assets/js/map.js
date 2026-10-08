/*
 * Mapa interativo: imóveis (localização aproximada) + escritório.
 * MapLibre GL + OpenFreeMap (dados OpenStreetMap; sem chave e com uso comercial liberado).
 * Carrega só quando a seção se aproxima. Também expõe MAPA.mini() para a página do imóvel.
 */
(function () {
  'use strict';
  var D = window.SITE_DATA, E = D.empresa;
  var STYLE = 'https://tiles.openfreemap.org/styles/positron';
  var COR = { barra: '#145f7a', copacabana: '#0b2c3d', angra: '#1c9a8f' };
  var el = document.getElementById('map'), listEl = document.getElementById('maplist');
  var map = null, markers = {}, buttons = {}, visible = null, officeMarker = null;

  /* Pinos que ficariam um em cima do outro (mesmo prédio, casas vizinhas)
     se abrem em leque em volta do ponto, para cada um ficar visível e clicável. */
  function spread(pts, w, h) {
    var groups = [];
    pts.forEach(function (p) {
      var g = groups.filter(function (g) { return g.some(function (q) { return Math.abs(q.x - p.x) < (w || 64) && Math.abs(q.y - p.y) < (h || 30); }); })[0];
      if (g) g.push(p); else groups.push([p]);
    });
    var out = {};
    groups.forEach(function (g) {
      if (g.length === 1) { out[g[0].k] = [0, 0]; return; }
      var cx = 0, cy = 0; g.forEach(function (p) { cx += p.x; cy += p.y; }); cx /= g.length; cy /= g.length;
      var R = g.length === 2 ? 36 : 30 + 12 * g.length;
      g.forEach(function (p, n) {
        var a = (g.length === 2 ? Math.PI : -Math.PI / 2) + (2 * Math.PI * n) / g.length;
        out[p.k] = [Math.round(cx + R * Math.cos(a) - p.x), Math.round(cy + R * Math.sin(a) * 0.75 - p.y)];
      });
    });
    return out;
  }
  window.MAP_SPREAD = spread;
  var dq = null;
  function declutterSoon() { if (dq) return; dq = requestAnimationFrame(function () { dq = null; declutter(); }); }
  function declutter() {
    if (!map) return;
    var all = Object.keys(markers).map(function (k) { var ll = markers[k].getLngLat(), p = map.project(ll); return { k: k, x: p.x, y: p.y }; });
    if (officeMarker) { var op = map.project(officeMarker.getLngLat()); all.push({ k: '__office', x: op.x, y: op.y }); }
    var off = spread(all);
    Object.keys(markers).forEach(function (k) { var o = off[k] || [0, 0]; markers[k].setOffset(o); markers[k].getPopup().setOffset([o[0], o[1] - 20]); });
    if (officeMarker) officeMarker.setOffset(off.__office || [0, 0]);
  }
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var track = function (n, d) { if (window.APP) APP.track(n, d); };
  var LOCALE = {
    'CooperativeGesturesHandler.WindowsHelpText': 'Use Ctrl + rolagem para dar zoom no mapa',
    'CooperativeGesturesHandler.MacHelpText': 'Use ⌘ + rolagem para dar zoom no mapa',
    'CooperativeGesturesHandler.MobileHelpText': 'Use dois dedos para mover o mapa',
    'NavigationControl.ZoomIn': 'Aproximar', 'NavigationControl.ZoomOut': 'Afastar',
    'AttributionControl.ToggleAttribution': 'Créditos do mapa', 'Popup.Close': 'Fechar'
  };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // círculo aproximado (polígono) em volta de um ponto
  function circle(lng, lat, meters, props) {
    var pts = [], R = 6378137, n = 48;
    for (var k = 0; k <= n; k++) {
      var a = (k / n) * 2 * Math.PI, dx = meters * Math.cos(a), dy = meters * Math.sin(a);
      pts.push([lng + (dx / (R * Math.cos(lat * Math.PI / 180))) * 180 / Math.PI, lat + (dy / R) * 180 / Math.PI]);
    }
    return { type: 'Feature', properties: props || {}, geometry: { type: 'Polygon', coordinates: [pts] } };
  }
  // cores da marca sobre o estilo claro
  function tint(m) {
    var set = function (id, prop, v) { if (m.getLayer(id)) m.setPaintProperty(id, prop, v); };
    set('background', 'background-color', '#f3eee4');
    set('water', 'fill-color', '#bcd8e1');
    set('park', 'fill-color', '#dde7d8');
    set('landcover_wood', 'fill-color', '#d5e2d0');
    set('landuse_residential', 'fill-color', '#efe9de');
    set('building', 'fill-color', '#e8e1d4');
  }
  function addAreas(m, list) {
    m.addSource('areas', { type: 'geojson', data: { type: 'FeatureCollection', features: list.map(function (i) { return circle(i.lng, i.lat, 260, { cor: COR[i.destino], slug: i.slug }); }) } });
    m.addLayer({ id: 'areas-fill', type: 'fill', source: 'areas', paint: { 'fill-color': ['get', 'cor'], 'fill-opacity': 0.14 } });
    m.addLayer({ id: 'areas-line', type: 'line', source: 'areas', paint: { 'line-color': ['get', 'cor'], 'line-width': 1.5, 'line-opacity': 0.8 } });
  }

  /* ---------- lista lateral (funciona mesmo sem o mapa) ---------- */
  if (listEl) {
    listEl.innerHTML = D.imoveis.map(function (i, n) {
      return '<li><button type="button" data-map-slug="' + i.slug + '"><span class="dot" style="background:' + COR[i.destino] + '">' + (n + 1) + '</span>' +
        '<span><strong>' + esc(i.nome) + '</strong><small>' + esc(i.bairro) + ' · até ' + i.hospedes + ' hóspedes</small></span></button></li>';
    }).join('');
    Array.prototype.forEach.call(listEl.querySelectorAll('[data-map-slug]'), function (b) {
      buttons[b.dataset.mapSlug] = b;
      b.addEventListener('click', function () { if (!map) { window.APP && APP.openImovel(b.dataset.mapSlug); return; } focus(b.dataset.mapSlug); });
    });
  }

  function active(slug) { Object.keys(buttons).forEach(function (k) { buttons[k].classList.toggle('is-active', k === slug); }); }
  function focus(slug) {
    var i = D.imoveis.filter(function (x) { return x.slug === slug; })[0]; if (!i) return;
    active(slug);
    Object.keys(markers).forEach(function (k) { var p = markers[k].getPopup(); if (p && p.isOpen()) p.remove(); });
    map.flyTo({ center: [i.lng, i.lat], zoom: 15, duration: reduce ? 0 : 1100, essential: true });
    map.once('moveend', function () { if (!markers[slug].getPopup().isOpen()) markers[slug].togglePopup(); });
  }
  function popupHTML(i) {
    var p = window.APP ? APP.img(i) : { src: '' };
    return '<div class="pop"><img src="' + p.src + '" alt="" loading="lazy"><div class="pop__b"><strong>' + esc(i.nome) + '</strong>' +
      '<span>' + esc(i.referencia) + '<br>Até ' + i.hospedes + ' hóspedes' + (i.nota ? ' · ★ ' + i.nota : '') + '</span>' +
      '<a href="#imovel/' + i.slug + '">Ver imóvel</a></div></div>';
  }
  function bounds(where) {
    var pts = (where === 'todos' ? D.imoveis : D.imoveis.filter(function (i) { return i.destino === where; })).map(function (i) { return [i.lng, i.lat]; });
    if (where === 'todos' || where === 'barra') pts.push([E.escritorio.lng, E.escritorio.lat]);
    var b = new maplibregl.LngLatBounds(pts[0], pts[0]);
    pts.forEach(function (p) { b.extend(p); });
    return b;
  }
  function fly(where, instant) {
    map.fitBounds(bounds(where), { padding: window.innerWidth < 700 ? 50 : 80, maxZoom: 15, duration: instant || reduce ? 0 : 1200 });
  }

  function init() {
    if (map || !window.maplibregl || !el) return;
    map = new maplibregl.Map({
      container: el, style: STYLE, bounds: bounds('todos'), fitBoundsOptions: { padding: 60, maxZoom: 15 },
      cooperativeGestures: false, scrollZoom: true, attributionControl: false, dragRotate: false, pitchWithRotate: false, touchPitch: false, locale: LOCALE, maxZoom: 19
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
    map.on('zoom', declutterSoon);
    map.on('moveend', declutterSoon);
    map.on('load', function () {
      declutter();
      tint(map); addAreas(map, D.imoveis);
      if (visible) MAPA.highlight(visible);
      track('map_load');
    });
    map.on('error', function () { /* um bloco que falha não derruba o mapa */ });

    D.imoveis.forEach(function (i, n) {
      var node = document.createElement('button');
      node.type = 'button'; node.className = 'mkp'; node.setAttribute('aria-label', i.nome + ', ' + i.bairro);
      node.innerHTML = '<span class="mkp__in">' + (i.nota ? '★ ' + i.nota : 'Novo') + '</span>';
      var pop = new maplibregl.Popup({ offset: 22, maxWidth: '260px', closeButton: true, focusAfterOpen: false }).setHTML(popupHTML(i));
      markers[i.slug] = new maplibregl.Marker({ element: node }).setLngLat([i.lng, i.lat]).setPopup(pop).addTo(map);
      node.addEventListener('click', function () { active(i.slug); track('map_pin_click', { slug: i.slug }); });
    });

    var off = document.createElement('div');
    off.className = 'mk mk--office';
    off.innerHTML = '<span class="mk__pulse"></span><span class="mk__pulse mk__pulse--2"></span><span class="mk__dot">3D</span>';
    officeMarker = new maplibregl.Marker({ element: off }).setLngLat([E.escritorio.lng, E.escritorio.lat])
      .setPopup(new maplibregl.Popup({ offset: 22, maxWidth: '260px' }).setHTML('<div class="pop"><div class="pop__b"><strong>Escritório · Grupo 3D</strong><span>' + esc(E.escritorio.nome) + '<br>' + esc(E.escritorio.endereco) + '</span>' +
        '<a href="https://www.google.com/maps/dir/?api=1&destination=Shopping+Citt%C3%A0+America+Barra+da+Tijuca" target="_blank" rel="noopener">Traçar rota</a></div></div>'))
      .addTo(map);
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-fly]'), function (b) {
    b.addEventListener('click', function () {
      Array.prototype.forEach.call(document.querySelectorAll('[data-fly]'), function (x) { x.setAttribute('aria-selected', String(x === b)); });
      if (map) fly(b.dataset.fly);
    });
  });

  var MAPA = window.MAPA = {
    // destaca os imóveis que passam nos filtros da vitrine
    highlight: function (slugs) {
      visible = slugs;
      Object.keys(buttons).forEach(function (k) { buttons[k].parentNode.style.opacity = slugs.indexOf(k) > -1 ? '' : '.45'; });
      Object.keys(markers).forEach(function (k) { markers[k].getElement().style.opacity = slugs.indexOf(k) > -1 ? '1' : '.35'; });
      // enquadra só o que passou nos filtros, como o Airbnb faz ao filtrar
      if (map && slugs.length) {
        var pts = D.imoveis.filter(function (i) { return slugs.indexOf(i.slug) > -1; });
        var b = new maplibregl.LngLatBounds([pts[0].lng, pts[0].lat], [pts[0].lng, pts[0].lat]);
        pts.forEach(function (i) { b.extend([i.lng, i.lat]); });
        map.fitBounds(b, { padding: 120, maxZoom: 13.5, duration: reduce ? 0 : 900 });
      }
    },
    // pino aceso quando o mouse passa no card (como no Airbnb)
    active: function (slug) {
      Object.keys(markers).forEach(function (k) { var e = markers[k].getElement(); e.classList.toggle('is-active', k === slug); e.style.zIndex = k === slug ? '5' : ''; });
    },
    // chamado quando o painel do mapa aparece
    resize: function () { if (!map) init(); else map.resize(); },
    // mapa pequeno da página do imóvel
    mini: function (container, i) {
      if (!window.maplibregl) return null;
      var m = new maplibregl.Map({ container: container, style: STYLE, center: [i.lng, i.lat], zoom: 14, cooperativeGestures: true, attributionControl: false, dragRotate: false, locale: LOCALE });
      m.addControl(new maplibregl.AttributionControl({ compact: true }));
      m.on('load', function () { tint(m); addAreas(m, [i]); });
      return m;
    }
  };

  function boot() {
    if (!el) return;
    if (!window.maplibregl) { el.innerHTML = '<p class="map-fallback">Não foi possível carregar o mapa agora. Use a lista ao lado ou o botão de rota.</p>'; return; }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); init(); } }, { rootMargin: '400px' });
      io.observe(el);
    } else init();
  }
  if (document.readyState === 'complete') boot(); else window.addEventListener('load', boot);
})();

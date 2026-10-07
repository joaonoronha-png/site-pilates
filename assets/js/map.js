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
  var map = null, markers = {}, buttons = {}, visible = null;
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
      cooperativeGestures: true, attributionControl: false, dragRotate: false, pitchWithRotate: false, locale: LOCALE
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
    map.on('load', function () {
      tint(map); addAreas(map, D.imoveis);
      if (visible) MAPA.highlight(visible);
      track('map_load');
    });
    map.on('error', function () { /* um bloco que falha não derruba o mapa */ });

    D.imoveis.forEach(function (i, n) {
      var node = document.createElement('button');
      node.type = 'button'; node.className = 'mk'; node.setAttribute('aria-label', i.nome + ', ' + i.bairro);
      node.innerHTML = '<span class="mk__dot" style="background:' + COR[i.destino] + '">' + (n + 1) + '</span>';
      var pop = new maplibregl.Popup({ offset: 22, maxWidth: '260px', closeButton: true, focusAfterOpen: false }).setHTML(popupHTML(i));
      markers[i.slug] = new maplibregl.Marker({ element: node }).setLngLat([i.lng, i.lat]).setPopup(pop).addTo(map);
      node.addEventListener('click', function () { active(i.slug); track('map_pin_click', { slug: i.slug }); });
    });

    var off = document.createElement('div');
    off.className = 'mk mk--office';
    off.innerHTML = '<span class="mk__pulse"></span><span class="mk__pulse mk__pulse--2"></span><span class="mk__dot">3D</span>';
    new maplibregl.Marker({ element: off }).setLngLat([E.escritorio.lng, E.escritorio.lat])
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
    },
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

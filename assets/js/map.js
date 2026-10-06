/* Mapa interativo "Onde estamos"
   Desenhado com Leaflet a partir de dados do OpenStreetMap salvos no próprio
   site (data/map-data.js): não carrega mapas de terceiros nem cookies.
   Só é montado quando o visitante chega perto da seção. */
(function () {
  'use strict';
  var box = document.querySelector('[data-map]');
  if (!box) return;
  var KB = window.MAPERSI_KB;
  var track = window.mapersiTrack || function () {};
  var canvas = box.querySelector('[data-map-canvas]');
  var isTouch = window.matchMedia('(hover: none)').matches;
  var isDesktop = window.matchMedia('(min-width: 960px)');
  var CENTER = [KB.company.geo.lat, KB.company.geo.lng];
  var map = null;

  function load(src, cb) {
    var s = document.createElement('script');
    s.src = src; s.onload = cb; s.onerror = function () { box.classList.add('is-error'); };
    document.head.appendChild(s);
  }
  function css(href) {
    if (document.querySelector('link[href="' + href + '"]')) return;
    var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l);
  }
  function ensureLibs(cb) {
    var need = [];
    if (!window.L) { css('assets/vendor/leaflet.css'); need.push('assets/vendor/leaflet.js'); }
    if (!window.MAPERSI_MAP) need.push('data/map-data.js');
    (function next() { if (!need.length) return cb(); load(need.shift(), next); })();
  }

  function token(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

  function build() {
    var L = window.L, D = window.MAPERSI_MAP;
    var bounds = L.latLngBounds([-22.8795, -43.3865], [-22.8365, -43.3375]);
    map = L.map(canvas, {
      zoomControl: false, attributionControl: false,
      scrollWheelZoom: false, dragging: !isTouch, tap: false,
      minZoom: 14, maxZoom: 18, zoomSnap: 0.5, zoomDelta: 0.5,
      maxBounds: bounds.pad(0.05), maxBoundsViscosity: 0.9,
      renderer: L.canvas({ padding: 0.5 })
    });

    var C = {
      land: token('--map-land') || '#EFE7DA',
      park: token('--map-park') || '#C9CCB0',
      water: token('--map-water') || '#B9C6C4',
      minor: token('--map-minor') || '#FBF8F3',
      mid: token('--map-mid') || '#F7F3EC',
      major: token('--map-major') || '#D9C8AE',
      casing: token('--map-casing') || '#C4B293',
      rail: token('--map-rail') || '#7A7366',
      street: token('--terra') || '#A65A36'
    };
    canvas.style.background = C.land;

    var layers = [];
    function lines(list, style) { var g = L.polyline(list, Object.assign({ interactive: false, lineCap: 'round', lineJoin: 'round' }, style)).addTo(map); layers.push([g, style]); return g; }
    L.polygon(D.parks, { interactive: false, stroke: false, fillColor: C.park, fillOpacity: 0.55 }).addTo(map);
    lines(D.water, { color: C.water, weight: 2 });
    lines(D.minor, { color: C.minor, weight: 2.2, base: 2.2 });
    lines(D.mid, { color: C.casing, weight: 4.6, base: 4.6 });
    lines(D.mid, { color: C.mid, weight: 3.4, base: 3.4 });
    lines(D.major, { color: C.casing, weight: 7.5, base: 7.5 });
    lines(D.major, { color: C.major, weight: 6, base: 6 });
    lines(D.rail, { color: C.rail, weight: 1.6, dashArray: '6 5', base: 1.6 });
    lines(D.street, { color: C.street, weight: 4, base: 4, opacity: 0.85 });

    function restyle() {
      var k = Math.pow(2, (map.getZoom() - 15) * 0.85);
      layers.forEach(function (p) { if (p[1].base) p[0].setStyle({ weight: p[1].base * k }); });
      box.classList.toggle('show-roads', map.getZoom() >= 15);
      box.classList.toggle('show-minor', map.getZoom() >= 16);
    }
    map.on('zoomend', restyle);

    // bairros e estações
    D.labels.forEach(function (l) {
      if (!l.n) return;
      var html = l.k === 'station' ? '<span class="mlabel mlabel--station">Estação ' + l.n + '</span>' : '<span class="mlabel mlabel--place">' + l.n + '</span>';
      L.marker(l.p, { interactive: false, keyboard: false, icon: L.divIcon({ className: 'mlabel-wrap', html: html, iconSize: null }) }).addTo(map);
    });
    // nomes das vias principais, alinhados à rua
    D.roadNames.forEach(function (r) {
      var dy = -(r.b[0] - r.a[0]), dx = (r.b[1] - r.a[1]) * Math.cos(r.a[0] * Math.PI / 180);
      var ang = Math.atan2(dy, dx) * 180 / Math.PI;
      if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
      var mid = [(r.a[0] + r.b[0]) / 2, (r.a[1] + r.b[1]) / 2];
      L.marker(mid, { interactive: false, keyboard: false, icon: L.divIcon({ className: 'mlabel-wrap', html: '<span class="mlabel mlabel--road" style="transform:translate(-50%,-50%) rotate(' + ang.toFixed(1) + 'deg)">' + r.n + '</span>', iconSize: null }) }).addTo(map);
    });

    // marcador da Mapersí
    var pin = L.marker(CENTER, {
      title: 'Mapersí Buffet', keyboard: true, riseOnHover: true,
      icon: L.divIcon({ className: 'mpin-wrap', iconSize: null, html: '<span class="mpin"><span class="mpin__pulse"></span><span class="mpin__pulse mpin__pulse--2"></span><span class="mpin__dot">M</span></span><span class="mpin__label">Mapersí Buffet</span>' })
    }).addTo(map);
    pin.bindPopup('<strong>Mapersí Buffet</strong><br>Rua Caiena · Bento Ribeiro<br>Rio de Janeiro – RJ<br><a href="' + KB.company.maps.directionsUrl + '" target="_blank" rel="noopener">Como chegar →</a>', { className: 'mpopup', offset: [0, -18], closeButton: false });
    pin.on('click', function () { track('map_pin_click'); });

    function recenter(animate) {
      map.setView(CENTER, 15.5, { animate: !!animate });
      if (isDesktop.matches) map.panBy([-Math.min(260, canvas.clientWidth * 0.2), 0], { animate: !!animate });
    }
    recenter(false);
    restyle();

    box.querySelectorAll('[data-map-zoom]').forEach(function (b) {
      b.addEventListener('click', function () { map.setZoom(map.getZoom() + (+b.getAttribute('data-map-zoom')) * 0.5); });
    });
    box.querySelector('[data-map-center]').addEventListener('click', function () { recenter(true); pin.openPopup(); });

    // roda do mouse só depois que a pessoa clica no mapa (não sequestra a rolagem)
    map.on('click', function () { map.scrollWheelZoom.enable(); box.classList.add('is-active'); });
    canvas.addEventListener('mouseleave', function () { map.scrollWheelZoom.disable(); box.classList.remove('is-active'); });

    var unlock = box.querySelector('[data-map-unlock]');
    if (isTouch) {
      unlock.addEventListener('click', function () {
        map.dragging.enable(); box.classList.add('is-unlocked'); track('map_unlock');
      });
    } else unlock.hidden = true;

    window.addEventListener('resize', function () { map.invalidateSize(); });
    track('map_load');
  }

  function start() { ensureLibs(build); }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { io.disconnect(); start(); }
    }, { rootMargin: '600px 0px' });
    io.observe(box);
  } else start();

  // copiar endereço
  var copyBtn = document.querySelector('[data-copy-address]');
  if (copyBtn) copyBtn.addEventListener('click', function () {
    var text = 'Rua Caiena, Bento Ribeiro, Rio de Janeiro – RJ, CEP 21555-140';
    var done = function () { copyBtn.textContent = 'Endereço copiado'; setTimeout(function () { copyBtn.textContent = 'Copiar endereço'; }, 2400); };
    try { navigator.clipboard.writeText(text).then(done, function () { copyBtn.textContent = text; }); }
    catch (e) { copyBtn.textContent = text; }
    track('address_copy');
  });
})();

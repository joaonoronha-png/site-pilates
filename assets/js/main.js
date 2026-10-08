/* Aluguel Temporada RJ — interações do site */
(function () {
  'use strict';
  var D = window.SITE_DATA;
  var E = D.empresa;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ---------- utilidades ---------- */
  function waLink(msg) { return 'https://wa.me/' + E.whatsapp + '?text=' + encodeURIComponent(msg); }
  // abre o WhatsApp; se o navegador bloquear a janela, mostra um link para tocar
  function openWa(url, link) {
    if (link) { link.href = url; link.hidden = false; }
    try { window.open(url, '_blank', 'noopener'); } catch (e) {}
  }
  function track(name, data) { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: name }, data || {})); }
  function fmtDate(iso) { if (!iso) return ''; var p = iso.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
  function nights(a, b) { if (!a || !b) return 0; var n = Math.round((new Date(b) - new Date(a)) / 864e5); return n > 0 ? n : 0; }
  function todayISO(offset) { var d = new Date(); d.setDate(d.getDate() + (offset || 0)); return d.toISOString().slice(0, 10); }
  var store = {
    get: function (k, def) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  function toast(text) {
    var t = $('.toast') || document.body.appendChild(Object.assign(document.createElement('div'), { className: 'toast', role: 'status' }));
    t.textContent = text; t.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }
  var destName = {}; D.destinos.forEach(function (d) { destName[d.id] = d.nome; });
  var bySlug = {}; D.imoveis.forEach(function (i) { bySlug[i.slug] = i; });

  // Foto de capa: própria do imóvel ou foto da região (até a empresa enviar as fotos)
  var REGIAO = {
    'posto-4-varanda': 'barra-mar', 'posto-4-vista-frontal': 'barra-orla', 'flat-vista-mar': 'barra-por-do-sol',
    'leme-copacabana': 'leme', 'angra-ponta-da-cruz': 'angra-praia', 'angra-paraiso': 'angra-pedra'
  };
  function img(i, idx) {
    if (i.fotos && i.fotos.length) {
      var f = i.fotos[idx || 0];
      return { src: f.src + '-720.webp', big: f.src + '-1080.webp', srcset: f.src + '-720.webp 720w, ' + f.src + '-1080.webp 1080w', alt: f.alt, own: true };
    }
    var r = 'assets/img/destinos/' + (REGIAO[i.slug] || 'barra-orla');
    return { src: r + '-800.webp', big: r + '-1600.webp', srcset: r + '-800.webp 800w, ' + r + '-1600.webp 1600w', alt: 'Foto ilustrativa da região: ' + destName[i.destino], own: false };
  }

  /* ---------- links de WhatsApp declarativos ---------- */
  function bindWa(root) {
    $$('[data-wa-msg]', root).forEach(function (a) {
      a.href = waLink(a.getAttribute('data-wa-msg'));
      if (!a.dataset.waBound) { a.dataset.waBound = '1'; a.addEventListener('click', function () { track('whatsapp_click', { context: a.dataset.wa || 'link' }); }); }
    });
  }
  bindWa(document);
  var yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- intro ---------- */
  (function intro() {
    var el = $('#intro'); if (!el) return;
    var seen = false; try { seen = sessionStorage.getItem('atrj-intro') === '1'; } catch (e) {}
    if (seen) { el.remove(); return; }
    if (reduce) el.classList.add('is-short');
    document.body.classList.add('no-scroll');
    var done = function () {
      if (el.classList.contains('is-done')) return;
      el.classList.add('is-done'); document.body.classList.remove('no-scroll');
      try { sessionStorage.setItem('atrj-intro', '1'); } catch (e) {}
      setTimeout(function () { el.remove(); }, 1100);
    };
    $('[data-intro-skip]', el).addEventListener('click', done);
    el.addEventListener('click', done);
    document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { done(); document.removeEventListener('keydown', k); } });
    setTimeout(done, reduce ? 900 : 2900);
  })();

  /* ---------- header, menu, botões flutuantes ---------- */
  var header = $('#header'), fab = $('#fab'), burger = $('#burger'), nav = $('#nav');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 20);
    fab.classList.toggle('visible', y > 300);
  }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  var closeMenu = function () { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); burger.setAttribute('aria-label', 'Abrir menu'); };
  $$('a', nav).forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('click', function (e) { if (!nav.contains(e.target) && !burger.contains(e.target)) closeMenu(); });

  // botão redondo do mapa: menu de rotas (Google Maps, Mapas do iPhone, Waze, Uber)
  var route = $('[data-route]');
  if (route) {
    var rbtn = $('.fab__btn--map', route), opts = $$('.fab__opt', route);
    var setOpen = function (open) {
      route.classList.toggle('is-open', open);
      fab.classList.toggle('routes-open', open);
      rbtn.setAttribute('aria-expanded', String(open));
      rbtn.setAttribute('aria-label', open ? 'Fechar opções de rota' : 'Como chegar ao escritório: escolher aplicativo');
      opts.forEach(function (o) { o.setAttribute('tabindex', open ? '0' : '-1'); });
      if (open) track('routes_open');
    };
    setOpen(false);
    rbtn.addEventListener('click', function (e) { e.stopPropagation(); setOpen(!route.classList.contains('is-open')); });
    opts.forEach(function (o) { o.addEventListener('click', function () { track('directions_click', { app: o.textContent.trim() }); setOpen(false); }); });
    document.addEventListener('click', function (e) { if (!route.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && route.classList.contains('is-open')) { setOpen(false); rbtn.focus(); } });
  }

  /* ---------- favoritos ---------- */
  var favs = store.get('atrj-favs', []);
  function isFav(slug) { return favs.indexOf(slug) > -1; }
  function toggleFav(slug) {
    favs = isFav(slug) ? favs.filter(function (s) { return s !== slug; }) : favs.concat(slug);
    store.set('atrj-favs', favs); updateFavCount();
    toast(isFav(slug) ? 'Salvo nos favoritos' : 'Removido dos favoritos');
    track('favorite_toggle', { slug: slug, on: isFav(slug) });
  }
  function updateFavCount() { $$('[data-fav-count]').forEach(function (e) { e.textContent = favs.length; }); }
  updateFavCount();

  /* ---------- vitrine (organização inspirada no Airbnb) ---------- */
  var state = { dest: '', cat: '', am: [], guests: 0, pets: 0, onlyFavs: false, checkin: '', checkout: '' };
  var G = { adultos: 0, criancas: 0, bebes: 0, pets: 0 };
  var grid = $('#grid'), countEl = $('#results-count'), emptyEl = $('#empty');

  function filtersOf(f) {
    var am = f.am.slice();
    if (f.cat && f.cat.indexOf('dest:') !== 0 && am.indexOf(f.cat) < 0) am.push(f.cat);
    return { dest: f.cat.indexOf('dest:') === 0 ? f.cat.slice(5) : f.dest, am: am };
  }
  function match(i, f) {
    f = f || state; var x = filtersOf(f);
    if (x.dest && i.destino !== x.dest) return false;
    if (f.guests && i.hospedes < f.guests) return false;
    if (f.onlyFavs && !isFav(i.slug)) return false;
    for (var k = 0; k < x.am.length; k++) if (i.comodidades.indexOf(x.am[k]) < 0) return false;
    return true;
  }
  var bairro = function (i) { return i.destino === 'angra' ? 'Angra dos Reis' : i.bairro; };
  function tipoCurto(i) { return /^Casa/.test(i.tipo) ? 'Casa' : /^Flat/.test(i.tipo) ? 'Flat' : 'Apartamento'; }
  function card(i, n) {
    var fotos = i.fotos.length ? i.fotos.slice(0, 5).map(function (f, k) { return img(i, k); }) : [img(i)];
    var slides = fotos.map(function (p, k) {
      return '<img src="' + p.src + '" srcset="' + p.srcset + '" sizes="(max-width: 560px) 50vw, (max-width: 950px) 33vw, 20vw" width="720" height="684" loading="' + (n < 4 && k === 0 ? 'eager' : 'lazy') + '" alt="' + esc(p.alt) + '">';
    }).join('');
    var multi = fotos.length > 1;
    return '<article class="card" style="--i:' + n + '" data-card="' + i.slug + '">' +
      '<div class="card__media">' +
        '<div class="card__slides" tabindex="-1">' + slides + '</div>' +
        '<a class="card__link" href="#imovel/' + i.slug + '" aria-label="' + esc(i.nome) + ', ' + esc(bairro(i)) + '"></a>' +
        (multi ? '<button class="card__nav card__nav--prev" type="button" data-slide="-1" aria-label="Foto anterior"><svg aria-hidden="true"><use href="#i-chev"/></svg></button>' +
          '<button class="card__nav card__nav--next" type="button" data-slide="1" aria-label="Próxima foto"><svg aria-hidden="true"><use href="#i-chev"/></svg></button>' +
          '<span class="card__dots" aria-hidden="true">' + fotos.map(function (f, k) { return '<i' + (k ? '' : ' class="on"') + '></i>'; }).join('') + '</span>' : '') +
        '<span class="card__badge">' + esc(i.destaque) + '</span>' +
        (fotos[0].own ? '' : '<span class="no-photo-note">Foto da região</span>') +
        '<button class="fav" type="button" data-fav="' + i.slug + '" aria-pressed="' + isFav(i.slug) + '" aria-label="Salvar ' + esc(i.nome) + ' nos favoritos"><svg aria-hidden="true"><use href="#i-heart"/></svg></button>' +
      '</div>' +
      '<a class="card__body" href="#imovel/' + i.slug + '" tabindex="-1">' +
        '<span class="card__l1"><strong>' + tipoCurto(i) + ' em ' + esc(bairro(i)) + '</strong>' +
          (i.nota ? '<span class="card__rating"><svg aria-hidden="true"><use href="#i-star"/></svg>' + i.nota + ' (' + i.avaliacoes + ')</span>' : '<span class="card__rating">Novo <svg aria-hidden="true"><use href="#i-star"/></svg></span>') + '</span>' +
        '<span class="card__l2">' + esc(i.nome) + '</span>' +
        '<span class="card__l2">' + i.hospedes + ' hóspedes · ' + (i.quartos > 1 ? i.quartos + ' suítes' : '1 quarto') + ' · ' + esc(i.banheiros) + '</span>' +
        '<span class="card__l3">' + (i.diariaAPartir ? '<b>R$ ' + i.diariaAPartir + '</b> noite' : '<b>Valor sob consulta</b><span> · resposta em até 1 h</span>') + '</span>' +
      '</a>' +
    '</article>';
  }
  function guestLabel() {
    var g = G.adultos + G.criancas, p = [];
    if (g) p.push(g + (g === 1 ? ' hóspede' : ' hóspedes'));
    if (G.bebes) p.push(G.bebes + (G.bebes === 1 ? ' bebê' : ' bebês'));
    if (G.pets) p.push(G.pets + (G.pets === 1 ? ' pet' : ' pets'));
    return p.join(', ');
  }
  // fileiras lado a lado, como a página inicial do Airbnb (quando não há filtro)
  var notaN = function (i) { return i.nota ? parseFloat(i.nota.replace(',', '.')) : 0; };
  // cada imóvel aparece uma vez só: as fileiras dividem por destino
  var ROWS = [
    { t: 'Pé na areia na Barra da Tijuca', cat: 'dest:barra', list: function () { return D.imoveis.filter(function (i) { return i.destino === 'barra'; }).sort(function (a, b) { return notaN(b) - notaN(a); }); } },
    { t: 'Copacabana, Leme e Angra dos Reis', cat: '', list: function () { return D.imoveis.filter(function (i) { return i.destino !== 'barra'; }); } }
  ];
  function rowsHTML() {
    var n = 0;
    return ROWS.map(function (r, k) {
      var items = r.list();
      var head = r.cat ? '<button type="button" class="row__title" data-row-cat="' + r.cat + '">' + esc(r.t) + ' <svg aria-hidden="true"><use href="#i-chev"/></svg></button>' : '<span class="row__title">' + esc(r.t) + '</span>';
      return '<section class="row" aria-label="' + esc(r.t) + '"><header class="row__head"><h3>' + head + '</h3>' +
        '<div class="row__nav"><button type="button" data-row="-1" aria-label="Voltar"><svg aria-hidden="true"><use href="#i-chev"/></svg></button><button type="button" data-row="1" aria-label="Avançar"><svg aria-hidden="true"><use href="#i-chev"/></svg></button></div></header>' +
        '<div class="row__track">' + items.map(function (i) { return card(i, k === 0 ? n++ : 9); }).join('') + '</div></section>';
    }).join('');
  }
  function isFiltered() { return !!(state.dest || state.cat || state.am.length || state.onlyFavs || state.guests); }
  function render() {
    var list = D.imoveis.filter(function (i) { return match(i); });
    var rows = !isFiltered() && !document.body.classList.contains('show-map');
    grid.classList.toggle('grid--rows', rows);
    grid.innerHTML = rows ? rowsHTML() : list.map(card).join('');
    if (rows) {
      $$('.row', grid).forEach(function (r) {
        var tr = $('.row__track', r), prev = $('[data-row="-1"]', r), next = $('[data-row="1"]', r);
        var upd = function () { prev.disabled = tr.scrollLeft < 8; next.disabled = tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 8; r.classList.toggle('row--fits', prev.disabled && next.disabled); };
        [prev, next].forEach(function (b) { b.addEventListener('click', function () { tr.scrollBy({ left: Number(b.dataset.row) * tr.clientWidth * 0.9, behavior: reduce ? 'auto' : 'smooth' }); }); });
        tr.addEventListener('scroll', upd, { passive: true }); upd(); setTimeout(upd, 300);
      });
      $$('[data-row-cat]', grid).forEach(function (b) { b.addEventListener('click', function () { state.cat = b.dataset.rowCat; render(); document.getElementById('imoveis').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }); });
    }
    emptyEl.hidden = list.length > 0;
    var x = filtersOf(state);
    countEl.textContent = list.length + (list.length === 1 ? ' acomodação' : ' acomodações') +
      (x.dest ? ' em ' + destName[x.dest] : ' no Rio e em Angra') + (state.guests ? ' para ' + state.guests + (state.guests === 1 ? ' hóspede' : ' hóspedes') : '');
    $$('[data-cat]').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.cat === state.cat)); });
    var nf = state.am.length + (state.dest ? 1 : 0) + (state.onlyFavs ? 1 : 0) + (state.guests ? 1 : 0);
    var badge = $('#filters-n'); badge.hidden = !nf; badge.textContent = nf;
    $('[data-clear]').hidden = !(nf || state.cat);
    // pílula de busca
    $('#sv-where').textContent = state.dest ? destName[state.dest] : 'Buscar destinos';
    $('#sv-who').textContent = guestLabel() || 'Hóspedes?';
    $('#msearch-sub').textContent = (state.dest ? destName[state.dest] : 'Qualquer destino') + ' · ' +
      (state.checkin && state.checkout ? fmtDate(state.checkin).slice(0, 5) + '–' + fmtDate(state.checkout).slice(0, 5) : 'Qualquer data') + ' · ' + (guestLabel() || 'Hóspedes');
    bindCards();
    if (window.MAPA && window.MAPA.highlight) window.MAPA.highlight(list.map(function (i) { return i.slug; }));
  }
  function bindCards() {
    $$('[data-fav]', grid).forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault(); toggleFav(b.dataset.fav);
        $$('[data-fav="' + b.dataset.fav + '"]', grid).forEach(function (x) { x.setAttribute('aria-pressed', String(isFav(b.dataset.fav))); });
        if (state.onlyFavs) render();
      });
    });
    $$('.card', grid).forEach(function (c) {
      var sl = $('.card__slides', c), dots = $$('.card__dots i', c);
      $$('[data-slide]', c).forEach(function (b) {
        b.addEventListener('click', function (e) { e.preventDefault(); sl.scrollBy({ left: Number(b.dataset.slide) * sl.clientWidth, behavior: reduce ? 'auto' : 'smooth' }); });
      });
      if (dots.length) sl.addEventListener('scroll', function () {
        var k = Math.round(sl.scrollLeft / sl.clientWidth);
        dots.forEach(function (d, j) { d.classList.toggle('on', j === k); });
        c.classList.toggle('at-start', k === 0); c.classList.toggle('at-end', k === dots.length - 1);
      }, { passive: true });
      c.classList.add('at-start');
      c.addEventListener('mouseenter', function () { if (window.MAPA && MAPA.active) MAPA.active(c.dataset.card); });
      c.addEventListener('mouseleave', function () { if (window.MAPA && MAPA.active) MAPA.active(null); });
    });
  }

  // categorias
  $$('[data-cat]').forEach(function (b) {
    b.addEventListener('click', function () { state.cat = b.dataset.cat; track('category', { cat: state.cat }); render(); });
  });
  $('[data-clear]').addEventListener('click', function () { clearAll(); render(); });
  function clearAll() { state.dest = ''; state.cat = ''; state.am = []; state.onlyFavs = false; state.guests = 0; G.adultos = G.criancas = G.bebes = G.pets = 0; syncGuests(); }
  $('[data-show-favs]').addEventListener('click', function () { state.onlyFavs = true; render(); document.getElementById('imoveis').scrollIntoView(); });

  /* busca em pílula: Onde · Check-in · Check-out · Quem */
  var form = $('#search'), sIn = $('#s-in'), sOut = $('#s-out');
  sIn.min = todayISO(0); sOut.min = todayISO(1);
  sIn.addEventListener('change', function () { if (sIn.value) { sOut.min = sIn.value; if (sOut.value && sOut.value <= sIn.value) sOut.value = ''; try { sOut.showPicker && sOut.showPicker(); } catch (e) {} } });
  $('#dest-pick').innerHTML = '<button type="button" class="dest-opt" data-pick=""><span class="dest-opt__ico"><svg aria-hidden="true"><use href="#i-map"/></svg></span><span><b>Qualquer destino</b><small>Rio de Janeiro e Angra dos Reis</small></span></button>' +
    D.destinos.map(function (d) {
      var n = D.imoveis.filter(function (i) { return i.destino === d.id; }).length;
      return '<button type="button" class="dest-opt" data-pick="' + d.id + '"><img src="' + d.foto + '-800.webp" alt="" loading="lazy"><span><b>' + esc(d.nome) + '</b><small>' + n + (n === 1 ? ' imóvel · ' : ' imóveis · ') + esc(d.chamada) + '</small></span></button>';
    }).join('');
  function pop(name, open) {
    $$('[data-pop]').forEach(function (b) {
      var on = b.dataset.pop === name && open;
      b.setAttribute('aria-expanded', String(on)); b.parentNode.classList.toggle('is-active', on);
      $('#pop-' + b.dataset.pop).hidden = !on;
    });
    form.classList.toggle('has-pop', !!open);
  }
  $$('[data-pop]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.stopPropagation(); pop(b.dataset.pop, b.getAttribute('aria-expanded') !== 'true'); });
  });
  $$('.sbar__pop').forEach(function (p) { p.addEventListener('click', function (e) { e.stopPropagation(); }); });
  document.addEventListener('click', function () { pop(null, false); });
  $$('[data-pick]').forEach(function (b) {
    b.addEventListener('click', function () { state.dest = b.dataset.pick; render(); pop(null, false); try { sIn.focus(); sIn.showPicker && sIn.showPicker(); } catch (e) {} });
  });
  function syncGuests() {
    $$('[data-gv]').forEach(function (o) { o.textContent = G[o.dataset.gv]; });
    $$('[data-g]').forEach(function (b) { b.disabled = Number(b.dataset.d) < 0 && G[b.dataset.g] === 0; });
    state.guests = G.adultos + G.criancas; state.pets = G.pets;
  }
  $$('[data-g]').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.dataset.g, d = Number(b.dataset.d);
      G[k] = Math.max(0, Math.min(k === 'pets' ? 3 : 14, G[k] + d));
      if (d > 0 && (k === 'criancas' || k === 'bebes' || k === 'pets') && !G.adultos) G.adultos = 1;
      syncGuests(); render();
    });
  });
  syncGuests();
  var mbtn = $('#msearch');
  function sheetSearch(open) { form.classList.toggle('is-open', open); form.parentNode.classList.toggle('is-open', open); mbtn.setAttribute('aria-expanded', String(open)); document.body.classList.toggle('no-scroll', open); }
  mbtn.addEventListener('click', function () { sheetSearch(true); });
  $('[data-close-search]').addEventListener('click', function () { sheetSearch(false); });
  form.addEventListener('submit', function (e) {
    e.preventDefault(); pop(null, false); sheetSearch(false);
    state.checkin = sIn.value; state.checkout = sOut.value; state.cat = ''; state.onlyFavs = false;
    track('search', { dest: state.dest, guests: state.guests }); render();
    document.getElementById('imoveis').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });
  $('[data-ask-concierge]').addEventListener('click', function () { pop(null, false); sheetSearch(false); if (window.CONCIERGE) window.CONCIERGE.open(); });

  /* janela de filtros */
  var fdlg = $('#filters'), fState = null;
  var AMS = Object.keys(D.comodidades).filter(function (k) { return D.imoveis.some(function (i) { return i.comodidades.indexOf(k) > -1; }); });
  function fCount() { return D.imoveis.filter(function (i) { return match(i, fState); }).length; }
  function fRender() {
    $('#f-dest').innerHTML = [['', 'Todos']].concat(D.destinos.map(function (d) { return [d.id, d.nome]; })).map(function (d) {
      return '<button type="button" aria-pressed="' + (fState.dest === d[0]) + '" data-fdest="' + d[0] + '">' + esc(d[1]) + '</button>';
    }).join('');
    $('#f-guests').textContent = fState.guests || 'Qualquer';
    $('#f-am').innerHTML = AMS.map(function (k) {
      return '<label class="fcheck"><input type="checkbox" value="' + k + '"' + (fState.am.indexOf(k) > -1 ? ' checked' : '') + '><span>' + esc(D.comodidades[k]) + '</span></label>';
    }).join('');
    $('#f-favs').checked = fState.onlyFavs;
    var n = fCount(); $('#f-apply').textContent = n ? 'Mostrar ' + n + (n === 1 ? ' acomodação' : ' acomodações') : 'Nenhuma acomodação';
    $$('[data-fdest]', fdlg).forEach(function (b) { b.addEventListener('click', function () { fState.dest = b.dataset.fdest; fRender(); }); });
    $$('#f-am input', fdlg).forEach(function (c) { c.addEventListener('change', function () { var at = fState.am.indexOf(c.value); if (c.checked && at < 0) fState.am.push(c.value); if (!c.checked && at > -1) fState.am.splice(at, 1); fRender(); }); });
  }
  $('#f-favs').addEventListener('change', function (e) { fState.onlyFavs = e.target.checked; fRender(); });
  $$('[data-fstep]').forEach(function (b) { b.addEventListener('click', function () { fState.guests = Math.max(0, Math.min(14, fState.guests + Number(b.dataset.fstep))); fRender(); }); });
  $('#open-filters').addEventListener('click', function () {
    fState = { dest: state.dest, cat: state.cat, am: state.am.slice(), guests: state.guests, onlyFavs: state.onlyFavs };
    fRender(); fdlg.hidden = false; document.body.classList.add('no-scroll'); $('.filters-dlg__panel button', fdlg).focus(); track('filters_open');
  });
  function closeFilters(apply) {
    if (fdlg.hidden) return;
    if (apply && fState) { state.dest = fState.dest; state.am = fState.am; state.onlyFavs = fState.onlyFavs; if (fState.guests !== state.guests) { G.adultos = fState.guests; G.criancas = 0; syncGuests(); } render(); }
    fdlg.hidden = true; document.body.classList.remove('no-scroll'); $('#open-filters').focus();
  }
  $$('[data-close-filters]', fdlg).forEach(function (b) { b.addEventListener('click', function () { closeFilters(b.id === 'f-apply'); }); });
  $('[data-filters-clear]').addEventListener('click', function () { fState = { dest: '', cat: state.cat, am: [], guests: 0, onlyFavs: false }; fRender(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeFilters(false); pop(null, false); if (form.classList.contains('is-open')) sheetSearch(false); } });

  /* lista ⇄ mapa (botão flutuante, como no Airbnb) */
  var mtog = $('#map-toggle');
  function showMap(on) {
    document.body.classList.toggle('show-map', on); render();
    mtog.setAttribute('aria-pressed', String(on));
    mtog.innerHTML = on ? '<span>Mostrar lista</span><svg aria-hidden="true"><use href="#i-list"/></svg>' : '<span>Mostrar mapa</span><svg aria-hidden="true"><use href="#i-map"/></svg>';
    setTimeout(function () { if (window.MAPA && MAPA.resize) MAPA.resize(); }, 60);
    track('map_toggle', { on: on });
  }
  mtog.addEventListener('click', function () {
    var on = !document.body.classList.contains('show-map'); showMap(on);
    if (on && window.innerWidth < 950) window.scrollTo(0, document.getElementById('imoveis').offsetTop - 120);
  });
  $$('[data-show-map]').forEach(function (a) { a.addEventListener('click', function () { showMap(true); }); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { mtog.classList.toggle('is-on', es[0].isIntersecting); }, { rootMargin: '-30% 0px -20% 0px' }).observe(document.getElementById('imoveis'));
  } else mtog.classList.add('is-on');


  /* ---------- mensagem de reserva ---------- */
  function bookingMsg(i, ci, co, g) {
    ci = ci || state.checkin; co = co || state.checkout; g = g || state.guests || 2;
    var m = 'Olá! Vim pelo site e tenho interesse no imóvel "' + i.nome + '" (' + destName[i.destino] + ').';
    if (ci && co) m += '\nDatas: ' + fmtDate(ci) + ' a ' + fmtDate(co) + ' (' + nights(ci, co) + ' noites).';
    else m += '\nAinda vou definir as datas.';
    m += '\nHóspedes: ' + g + '.';
    m += '\nPode me passar disponibilidade e valor?';
    return m;
  }

  /* ---------- destinos, avaliações, proprietários ---------- */
  $('#dest-list').innerHTML = D.destinos.map(function (d) {
    var n = D.imoveis.filter(function (i) { return i.destino === d.id; }).length;
    return '<article class="dest__card" data-reveal>' +
      '<img src="' + d.foto + '-800.webp" srcset="' + d.foto + '-800.webp 800w, ' + d.foto + '-1600.webp 1600w" sizes="(max-width: 1000px) 100vw, 40vw" width="800" height="533" loading="lazy" alt="' + esc(d.fotoAlt) + '">' +
      '<div class="dest__body"><span class="dest__count">' + n + (n === 1 ? ' imóvel' : ' imóveis') + '</span>' +
      '<h3>' + esc(d.nome) + '</h3><p>' + esc(d.texto) + '</p>' +
      '<button class="btn btn--light btn--sm" type="button" data-go-dest="' + d.id + '">Ver imóveis</button></div></article>';
  }).join('');
  $$('[data-go-dest]').forEach(function (b) {
    b.addEventListener('click', function () { state.dest = b.dataset.goDest; state.am = []; state.onlyFavs = false; render(); document.getElementById('imoveis').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); });
  });

  var star = '<svg aria-hidden="true"><use href="#i-star"/></svg>';
  // notas por categoria, no formato da página de avaliações do Airbnb
  var CATS = [['limpeza', 'Limpeza', 'i-clean'], ['exatidao', 'Exatidão', 'i-check'], ['checkin', 'Check-in', 'i-key'],
    ['comunicacao', 'Comunicação', 'i-chat'], ['localizacao', 'Localização', 'i-map'], ['custoBeneficio', 'Custo-benefício', 'i-tag']];
  var nf = function (v) { return v.toFixed(1).replace('.', ','); };
  function ratingCats(notas, dist) {
    if (!notas) return '';
    var bars = dist ? '<div class="rcat rcat--dist"><span class="rcat__label">Classificação geral</span><ol class="rdist">' +
      dist.map(function (p, k) { return '<li><span>' + (5 - k) + '</span><i><b style="width:' + p + '%"></b></i></li>'; }).join('') + '</ol></div>' : '';
    return bars + CATS.map(function (c) {
      return '<div class="rcat"><span class="rcat__label">' + c[1] + '</span><strong>' + nf(notas[c[0]]) + '</strong><svg aria-hidden="true"><use href="#' + c[2] + '"/></svg></div>';
    }).join('');
  }
  $('#rcats').innerHTML = ratingCats(E.airbnb.notas, E.airbnb.distribuicao);

  function reviewCard(r, dup) {
    return '<article class="review-card"' + (dup ? ' aria-hidden="true"' : '') + '>' +
      '<header><span class="review-card__av" aria-hidden="true">' + esc(r.nome[0]) + '</span><span><strong>' + esc(r.nome) + '</strong>' +
      '<small>' + esc(r.origem) + '</small></span></header>' +
      '<p class="review-card__meta"><span class="review-card__stars" role="img" aria-label="Nota ' + r.nota + ' de 5">' + new Array(r.nota + 1).join(star) + '</span> · ' + esc(r.data) + '</p>' +
      '<p class="review-card__text">' + esc(r.texto) + '</p>' +
      (r.traduzido ? '<span class="review-tag">Traduzido do ' + esc(r.traduzido) + '</span>' : '') + '</article>';
  }
  var rTrack = $('#reviews .reviews-track');
  rTrack.innerHTML = D.avaliacoes.map(function (r) { return reviewCard(r, false); }).join('') +
    D.avaliacoes.map(function (r) { return reviewCard(r, true); }).join('');

  // carrossel infinito das avaliações (mesmo comportamento dos sites anteriores):
  // roda sozinho, pausa com o mouse em cima e pode ser arrastado com o dedo ou o mouse
  function initMarquee(container, durationSec) {
    var track = container.querySelector('.reviews-track');
    if (!track || reduce) { container.classList.add('is-static'); return; }
    var dragging = false, moved = false, startX = 0, startOffset = 0, shift = 0;
    var measure = function () {
      var firstDup = track.querySelector('.review-card[aria-hidden="true"]');
      shift = firstDup ? firstDup.offsetLeft - track.firstElementChild.offsetLeft : track.scrollWidth / 2;
      track.style.setProperty('--shift', '-' + shift + 'px');
    };
    measure();
    if (!shift) return;
    track.style.animation = 'none'; void track.offsetHeight;
    track.style.animation = 'marquee-scroll ' + durationSec + 's linear infinite';
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(measure, 200); });
    var currentX = function () { return new DOMMatrixReadOnly(getComputedStyle(track).transform).m41; };
    var wrapX = function (x) { var v = x % shift; if (v > 0) v -= shift; return v; };
    container.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      dragging = true; moved = false; startX = e.clientX; startOffset = currentX();
      track.style.animation = 'none'; track.style.transform = 'translateX(' + startOffset + 'px)';
      if (container.setPointerCapture) container.setPointerCapture(e.pointerId);
      container.classList.add('is-dragging');
    });
    container.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      if (Math.abs(e.clientX - startX) > 4) moved = true;
      track.style.transform = 'translateX(' + wrapX(startOffset + (e.clientX - startX)) + 'px)';
    });
    var endDrag = function () {
      if (!dragging) return;
      dragging = false; container.classList.remove('is-dragging');
      var elapsed = (-currentX() / shift) * durationSec;
      track.style.transform = '';
      track.style.animation = 'marquee-scroll ' + durationSec + 's linear infinite';
      track.style.animationDelay = '-' + elapsed + 's';
    };
    container.addEventListener('pointerup', endDrag);
    container.addEventListener('pointercancel', endDrag);
    // pausa só com mouse de verdade (no toque o :hover fica preso e parecia travado)
    container.addEventListener('mouseenter', function () { if (!dragging) track.style.animationPlayState = 'paused'; });
    container.addEventListener('mouseleave', function () { if (!dragging) track.style.animationPlayState = 'running'; });
    // teclado: foco dentro do carrossel também pausa
    container.addEventListener('focusin', function () { track.style.animationPlayState = 'paused'; });
    container.addEventListener('focusout', function () { track.style.animationPlayState = 'running'; });
  }
  initMarquee($('#reviews'), 45);

  $('#owners-list').innerHTML = E.gestao.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('');

  /* ---------- FAQ com busca ---------- */
  var faqList = $('#faq-list');
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function renderFaq(q) {
    var nq = norm(q || '').trim();
    var items = D.faq.filter(function (f) {
      if (!nq) return true;
      return norm(f.pergunta + ' ' + f.resposta + ' ' + f.palavras.join(' ')).indexOf(nq) > -1;
    });
    faqList.innerHTML = items.length ? items.map(function (f, n) {
      return '<details class="faq__item"' + (n === 0 && !nq ? ' open' : '') + '><summary><span><span class="faq__cat">' + esc(f.categoria) + '</span>' + esc(f.pergunta) + '</span></summary>' +
        '<p>' + esc(f.resposta) + (f.status === 'pendente' ? ' <span class="faq__pend">confirmado no atendimento</span>' : '') + '</p></details>';
    }).join('') : '<p class="faq__none">Nada encontrado para "' + esc(q) + '". <button type="button" class="linklike" data-open-chat>Pergunte ao assistente</button>.</p>';
  }
  renderFaq('');
  $('#faq-q').addEventListener('input', function (e) { renderFaq(e.target.value); });

  /* ---------- página do imóvel (#imovel/slug) ---------- */
  var sheet = $('#sheet'), sheetBody = $('#sheet-body'), lastFocus = null, miniMap = null;
  function gallery(i) {
    if (!i.fotos.length) {
      var p = img(i);
      return '<div class="gal gal--single"><button type="button" data-lb="0" aria-label="Ampliar foto"><img src="' + p.big + '" alt="' + esc(p.alt) + '"></button>' +
        '<span class="gal__note">Foto ilustrativa da região. <a href="' + i.airbnb + '" target="_blank" rel="noopener" style="color:inherit;font-weight:600">Ver fotos do imóvel no Airbnb →</a></span></div>';
    }
    var show = i.fotos.slice(0, 5);
    return '<div class="gal">' + show.map(function (f, n) {
      return '<button type="button" data-lb="' + n + '" aria-label="Ampliar foto ' + (n + 1) + '"><img src="' + f.src + (n === 0 ? '-1080' : '-720') + '.webp" alt="' + esc(f.alt) + '" loading="' + (n ? 'lazy' : 'eager') + '">' +
        (n === show.length - 1 && i.fotos.length > 5 ? '<span class="gal__more">+' + (i.fotos.length - 5) + ' fotos</span>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function openImovel(slug) {
    var i = bySlug[slug]; if (!i) return;
    var am = i.comodidades.map(function (k) { return '<li>' + esc(D.comodidades[k]) + '</li>'; }).join('') + (i.extras || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    var r = i.regras;
    var yn = function (v, s, n) { return v === true ? s : v === false ? n : 'Consultar'; };
    sheetBody.innerHTML = gallery(i) +
      '<div class="pdp"><div>' +
        '<header class="pdp__head"><p class="eyebrow">' + esc(destName[i.destino]) + ' · ' + esc(i.tipo) + '</p><h2 id="sheet-title">' + esc(i.nome) + '</h2>' +
        '<p class="pdp__ref">' + esc(i.referencia) + '</p></header>' +
        '<ul class="pdp__specs"><li>Até ' + i.hospedes + ' hóspedes</li><li>' + (i.quartos > 1 ? i.quartos + ' suítes' : '1 quarto') + '</li><li>' + esc(i.camas) + '</li><li>' + esc(i.banheiros) + '</li>' +
        (i.nota ? '<li>★ ' + i.nota + ' · ' + i.avaliacoes + ' avaliações</li>' : '<li>Anúncio novo</li>') + '</ul>' +
        (i.nota ? '<div class="pdp-fav"><span class="pdp-fav__l"><svg class="laurel" aria-hidden="true"><use href="#i-laurel"/></svg><b>Avaliado por hóspedes</b><svg class="laurel laurel--r" aria-hidden="true"><use href="#i-laurel"/></svg></span>' +
          '<span class="pdp-fav__t">Nota média dada pelos hóspedes no Airbnb</span>' +
          '<span class="pdp-fav__n"><strong>' + i.nota + '</strong><span class="pdp-fav__s" aria-hidden="true">' + new Array(6).join(star) + '</span></span><span class="pdp-fav__c"><strong>' + i.avaliacoes + '</strong>avaliações</span></div>'
          : '<div class="pdp-fav pdp-fav--new"><strong>Novo no Airbnb</strong><span>Ainda com poucas avaliações. Pergunte à equipe sobre o imóvel.</span></div>') +
        '<div class="pdp-host"><span class="pdp-host__av" aria-hidden="true">D</span><div><strong>Anfitrião: ' + esc(E.anfitriao) + '</strong><small>Superhost · ' + E.airbnb.anosHospedando + ' anos hospedando</small></div></div>' +
        (i.destaquesAirbnb && i.destaquesAirbnb.length ? '<ul class="pdp-hl">' + i.destaquesAirbnb.map(function (h) {
          var ic = /check-in/i.test(h.titulo) ? 'i-door' : /mergulho/.test(h.titulo) ? 'i-pool' : /trabalho/.test(h.titulo) ? 'i-desk' : 'i-map';
          return '<li><svg aria-hidden="true"><use href="#' + ic + '"/></svg><div><strong>' + esc(h.titulo) + '</strong><span>' + esc(h.texto) + '</span></div></li>';
        }).join('') + '</ul>' : '') +
        '<p>' + esc(i.resumo) + '</p>' +
        '<h3>O espaço</h3><ul class="pdp__desc">' + i.descricao.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>' +
        '<h3>Comodidades</h3><ul class="pdp__am">' + am + '</ul>' +
        (i.notas ? '<h3 class="pdp-rev__h"><svg aria-hidden="true"><use href="#i-star"/></svg> ' + i.nota + ' · ' + i.avaliacoes + ' avaliações</h3><div class="rcats rcats--pdp">' + ratingCats(i.notas, i.distribuicao) + '</div>' +
          '<p class="pdp__ref"><a href="' + i.airbnb + '#reviews" target="_blank" rel="noopener">Ler as avaliações deste imóvel no Airbnb →</a></p>' : '') +
        '<h3>Regras e horários</h3><dl class="pdp__rules">' +
          '<div><dt>Check-in</dt><dd>' + esc(r.checkin) + '</dd></div><div><dt>Check-out</dt><dd>' + esc(r.checkout) + '</dd></div>' +
          '<div><dt>Pets</dt><dd>' + yn(r.pet, 'Permitidos', 'Não permitidos') + '</dd></div><div><dt>Fumar</dt><dd>' + yn(r.fumar, 'Permitido', 'Proibido') + '</dd></div>' +
          '<div><dt>Festas</dt><dd>' + yn(r.festas, 'Permitidas', 'Não permitidas') + '</dd></div><div><dt>Entrada</dt><dd>' + esc(r.selfCheckin ? 'Self check-in ' + r.selfCheckin : 'Combinada com o anfitrião') + '</dd></div>' +
        '</dl>' +
        '<h3>Localização aproximada</h3><p class="pdp__ref">O endereço exato é enviado após a reserva.</p><div class="pdp__mini" id="mini-map"></div>' +
      '</div>' +
      '<aside class="book" aria-label="Consultar disponibilidade">' +
        '<p class="book__price">' + (i.diariaAPartir ? 'A partir de R$ ' + i.diariaAPartir + '<small>por noite</small>' : 'Consulte o valor<small>O preço varia com a data e o número de hóspedes.</small>') + '</p>' +
        '<form id="book-form" novalidate><div class="book__grid">' +
          '<label>Check-in<input type="date" name="ci" min="' + todayISO(0) + '" value="' + (state.checkin || '') + '"></label>' +
          '<label>Check-out<input type="date" name="co" min="' + todayISO(1) + '" value="' + (state.checkout || '') + '"></label>' +
          '<label>Hóspedes<input type="number" name="g" min="1" max="' + i.hospedes + '" value="' + Math.min(state.guests || 2, i.hospedes) + '" inputmode="numeric"></label>' +
        '</div>' +
        '<p class="book__sum" id="book-sum" aria-live="polite"></p><p class="book__warn" id="book-warn" hidden></p>' +
        '<button class="btn btn--sun" type="submit"><svg aria-hidden="true"><use href="#i-wa"/></svg> Consultar disponibilidade</button>' +
        '<a class="wa-open" id="book-open" target="_blank" rel="noopener" hidden>Mensagem pronta: toque para abrir no WhatsApp →</a></form>' +
        '<p class="book__alt">ou reserve pelo <a href="' + i.airbnb + '" target="_blank" rel="noopener">Airbnb</a></p>' +
        '<button class="btn btn--ghost btn--sm" type="button" data-fav-sheet aria-pressed="' + isFav(i.slug) + '"><svg aria-hidden="true"><use href="#i-heart"/></svg> <span>' + (isFav(i.slug) ? 'Salvo nos favoritos' : 'Salvar nos favoritos') + '</span></button>' +
      '</aside></div>' +
      '<div class="sheet__cta"><button class="btn btn--sun" type="button" data-go-book><svg aria-hidden="true"><use href="#i-wa"/></svg> Consultar disponibilidade</button></div>';

    lastFocus = document.activeElement;
    sheet.hidden = false; document.body.classList.add('no-scroll');
    $('.sheet__panel', sheet).scrollTop = 0; $('.sheet__panel', sheet).focus();
    document.title = i.nome + ' — Aluguel Temporada RJ';
    track('property_view', { slug: slug });

    // reserva
    var f = $('#book-form'), sum = $('#book-sum'), warn = $('#book-warn');
    var upd = function () {
      var n = nights(f.ci.value, f.co.value);
      sum.textContent = n ? n + (n === 1 ? ' noite' : ' noites') + ' · ' + (f.g.value || 1) + ' hóspede(s)' : 'Escolha as datas para consultar.';
      if (f.ci.value) f.co.min = f.ci.value;
    };
    f.addEventListener('input', upd); upd();
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var g = parseInt(f.g.value, 10) || 1;
      if (g > i.hospedes) { warn.hidden = false; warn.textContent = 'Este imóvel recebe até ' + i.hospedes + ' hóspedes.'; f.g.focus(); return; }
      if (f.ci.value && f.co.value && nights(f.ci.value, f.co.value) < 1) { warn.hidden = false; warn.textContent = 'A saída precisa ser depois da entrada.'; f.co.focus(); return; }
      warn.hidden = true;
      state.checkin = f.ci.value; state.checkout = f.co.value;
      track('booking_whatsapp', { slug: slug });
      openWa(waLink(bookingMsg(i, f.ci.value, f.co.value, g)), $('#book-open'));
    });
    var fb = $('[data-fav-sheet]');
    fb.addEventListener('click', function () { toggleFav(i.slug); fb.setAttribute('aria-pressed', String(isFav(i.slug))); $('span', fb).textContent = isFav(i.slug) ? 'Salvo nos favoritos' : 'Salvar nos favoritos'; render(); });

    $('[data-go-book]').addEventListener('click', function () { $('#book-form').scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(function () { $('#book-form').ci.focus(); }, 500); });
    // galeria
    $$('[data-lb]', sheetBody).forEach(function (b) { b.addEventListener('click', function () { lightbox(i, Number(b.dataset.lb)); }); });

    // mini mapa
    if (window.MAPA && window.MAPA.mini) {
      setTimeout(function () {
        if (miniMap) { miniMap.remove(); miniMap = null; }
        var el = $('#mini-map'); if (el) miniMap = window.MAPA.mini(el, i);
      }, 350);
    }
  }
  function closeSheet() {
    if (sheet.hidden) return;
    sheet.hidden = true; document.body.classList.remove('no-scroll');
    document.title = 'Aluguel Temporada RJ — Barra da Tijuca, Copacabana e Angra dos Reis';
    if (miniMap) { miniMap.remove(); miniMap = null; }
    if (location.hash.indexOf('#imovel/') === 0) history.replaceState(null, '', location.pathname + location.search + '#imoveis');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$('[data-close-sheet]').forEach(function (b) { b.addEventListener('click', closeSheet); });
  document.addEventListener('keydown', function (e) {
    var lbOpen = $('.lb') && !$('.lb').hidden;
    if (e.key === 'Escape' && !sheet.hidden && !lbOpen) closeSheet();
    if (e.key === 'Tab' && !sheet.hidden) {
      var f = $$('a[href], button, input, select, textarea', $('.sheet__panel')).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  function route_() {
    var m = location.hash.match(/^#imovel\/([\w-]+)/);
    if (m && bySlug[m[1]]) openImovel(m[1]); else closeSheet();
  }
  window.addEventListener('hashchange', route_);

  /* lightbox */
  function lightbox(i, start) {
    var pics = i.fotos.length ? i.fotos.map(function (f) { return { src: f.src + '-1080.webp', alt: f.alt }; }) : [{ src: img(i).big, alt: img(i).alt }];
    var lb = $('.lb');
    if (!lb) {
      lb = document.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Galeria de fotos');
      lb.innerHTML = '<button type="button" data-lb-prev aria-label="Foto anterior">‹</button><button type="button" data-lb-next aria-label="Próxima foto">›</button><button class="lb__close" type="button" data-lb-close aria-label="Fechar galeria">×</button><p class="lb__count"></p>';
      var pic = new Image(); pic.src = pics[start].src; pic.alt = pics[start].alt;
      lb.insertBefore(pic, $('[data-lb-next]', lb));
      document.body.appendChild(lb);
    }
    var n = start, im = $('img', lb), ct = $('.lb__count', lb);
    var show = function () { im.src = pics[n].src; im.alt = pics[n].alt; ct.textContent = (n + 1) + ' / ' + pics.length; };
    var go = function (d) { n = (n + d + pics.length) % pics.length; show(); };
    var close = function () { lb.hidden = true; document.removeEventListener('keydown', key); };
    var key = function (e) { if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1); else if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    $('[data-lb-prev]', lb).onclick = function () { go(-1); };
    $('[data-lb-next]', lb).onclick = function () { go(1); };
    $('[data-lb-close]', lb).onclick = close;
    lb.onclick = function (e) { if (e.target === lb) close(); };
    var sx = 0; lb.ontouchstart = function (e) { sx = e.touches[0].clientX; }; lb.ontouchend = function (e) { var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); };
    lb.hidden = false; show(); $('[data-lb-close]', lb).focus();
    document.addEventListener('keydown', key);
  }

  /* ---------- formulário de contato -> WhatsApp ---------- */
  var lead = $('#lead');
  lead.addEventListener('submit', function (e) {
    e.preventDefault();
    var err = $('#lead-err'), f = lead;
    f.nome.removeAttribute('aria-invalid');
    if (!f.nome.value.trim()) { err.hidden = false; err.textContent = 'Informe seu nome para a equipe saber com quem fala.'; f.nome.setAttribute('aria-invalid', 'true'); f.nome.focus(); return; }
    if (f.checkin.value && f.checkout.value && nights(f.checkin.value, f.checkout.value) < 1) { err.hidden = false; err.textContent = 'A data de saída precisa ser depois da entrada.'; f.checkout.focus(); return; }
    err.hidden = true;
    var m = 'Olá! Meu nome é ' + f.nome.value.trim() + '.';
    m += '\nDestino: ' + (f.destino.value || 'ainda não decidi') + '.';
    if (f.checkin.value && f.checkout.value) m += '\nDatas: ' + fmtDate(f.checkin.value) + ' a ' + fmtDate(f.checkout.value) + '.';
    m += '\nHóspedes: ' + (f.hospedes.value || 'a definir') + '.';
    if (f.msg.value.trim()) m += '\n' + f.msg.value.trim();
    m += '\nPode me indicar as opções disponíveis?';
    track('lead_whatsapp');
    openWa(waLink(m), $('#lead-open'));
  });

  /* ---------- revelar ao rolar ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    $$('[data-reveal]').forEach(function (el) { io.observe(el); });
    // reforço: se o observador atrasar (aba em segundo plano, máquina lenta), revela o que já passou pela tela
    var sweep = function () {
      var vh = window.innerHeight;
      $$('[data-reveal]:not(.in-view)').forEach(function (el) { if (el.getBoundingClientRect().top < vh) { el.classList.add('in-view'); io.unobserve(el); } });
    };
    var st; window.addEventListener('scroll', function () { clearTimeout(st); st = setTimeout(sweep, 150); }, { passive: true });
  } else { $$('[data-reveal]').forEach(function (el) { el.classList.add('in-view'); }); }

  /* ---------- API pública para o mapa e o assistente ---------- */
  window.APP = {
    state: state, render: render, openImovel: function (slug) { location.hash = 'imovel/' + slug; },
    img: img, waLink: waLink, bookingMsg: bookingMsg, destName: destName, track: track, fmtDate: fmtDate, nights: nights, toast: toast,
    applyFilters: function (f) {
      state.dest = f.dest || ''; state.cat = ''; state.am = f.am || []; state.onlyFavs = false;
      if (f.guests) { G.adultos = f.guests; G.criancas = 0; syncGuests(); }
      if (f.checkin) state.checkin = f.checkin; if (f.checkout) state.checkout = f.checkout;
      render();
    }
  };
  render();
  route_();
})();

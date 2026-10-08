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
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }); });

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

  /* ---------- vitrine e filtros ---------- */
  var state = { dest: '', am: [], guests: 2, onlyFavs: false, checkin: '', checkout: '' };
  var grid = $('#grid'), countEl = $('#results-count'), emptyEl = $('#empty'), guestsOut = $('#guests-out');

  function match(i) {
    if (state.dest && i.destino !== state.dest) return false;
    if (i.hospedes < state.guests) return false;
    if (state.onlyFavs && !isFav(i.slug)) return false;
    for (var k = 0; k < state.am.length; k++) if (i.comodidades.indexOf(state.am[k]) < 0) return false;
    return true;
  }
  function specs(i) {
    return '<ul class="card__specs">' +
      '<li><svg aria-hidden="true"><use href="#i-users"/></svg> até ' + i.hospedes + '</li>' +
      '<li><svg aria-hidden="true"><use href="#i-bed"/></svg> ' + (i.quartos > 1 ? i.quartos + ' suítes' : '1 quarto') + '</li>' +
      '</ul>';
  }
  function rating(i) {
    return i.nota
      ? '<span class="card__rating"><svg aria-hidden="true"><use href="#i-star"/></svg>' + i.nota + ' <small>(' + i.avaliacoes + ')</small></span>'
      : '<span class="card__rating"><small>Novo</small></span>';
  }
  function card(i, n) {
    var p = img(i);
    return '<article class="card" style="--i:' + n + '">' +
      '<div class="card__media">' +
        '<img src="' + p.src + '" srcset="' + p.srcset + '" sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw" width="720" height="610" loading="lazy" alt="' + esc(p.alt) + '">' +
        '<span class="card__badge">' + esc(i.destaque) + '</span>' +
        (p.own ? '' : '<span class="no-photo-note">Foto da região</span>') +
        '<span class="card__badge card__badge--region">' + esc(destName[i.destino]) + '</span>' +
        '<button class="fav" type="button" data-fav="' + i.slug + '" aria-pressed="' + isFav(i.slug) + '" aria-label="Salvar ' + esc(i.nome) + ' nos favoritos"><svg aria-hidden="true"><use href="#i-heart"/></svg></button>' +
        '<a class="card__link" href="#imovel/' + i.slug + '" aria-label="Ver detalhes de ' + esc(i.nome) + '"></a>' +
      '</div>' +
      '<div class="card__top"><h3>' + esc(i.nome) + '</h3>' + rating(i) + '</div>' +
      '<p class="card__ref">' + esc(i.referencia) + '</p>' +
      specs(i) +
      '<div class="card__cta"><a class="btn btn--mar btn--sm" href="#imovel/' + i.slug + '">Ver imóvel</a>' +
      '<a class="btn btn--ghost btn--sm" href="' + waLink(bookingMsg(i)) + '" target="_blank" rel="noopener" data-wa="card">Consultar</a></div>' +
    '</article>';
  }
  function render() {
    var list = D.imoveis.filter(match);
    grid.innerHTML = list.map(card).join('');
    emptyEl.hidden = list.length > 0;
    countEl.textContent = list.length + (list.length === 1 ? ' imóvel encontrado' : ' imóveis encontrados') + (state.guests > 1 ? ' para ' + state.guests + ' hóspedes' : '');
    guestsOut.textContent = state.guests + (state.guests === 1 ? ' hóspede' : ' hóspedes');
    $$('[data-dest]').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.dest === state.dest)); });
    $$('[data-am]').forEach(function (b) { b.setAttribute('aria-pressed', String(state.am.indexOf(b.dataset.am) > -1)); });
    $('[data-only-favs]').setAttribute('aria-pressed', String(state.onlyFavs));
    $('[data-clear]').hidden = !(state.dest || state.am.length || state.onlyFavs || state.guests > 2);
    $$('[data-fav]', grid).forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); toggleFav(b.dataset.fav); b.setAttribute('aria-pressed', String(isFav(b.dataset.fav))); if (state.onlyFavs) render(); });
    });
    if (window.MAPA && window.MAPA.highlight) window.MAPA.highlight(list.map(function (i) { return i.slug; }));
  }
  $$('[data-dest]').forEach(function (b) { b.addEventListener('click', function () { state.dest = b.dataset.dest; track('filter', { dest: state.dest }); render(); }); });
  $$('[data-am]').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.dataset.am, at = state.am.indexOf(k);
      if (at > -1) state.am.splice(at, 1); else state.am.push(k);
      track('filter', { am: k }); render();
    });
  });
  $$('[data-step]').forEach(function (b) {
    b.addEventListener('click', function () { state.guests = Math.min(14, Math.max(1, state.guests + Number(b.dataset.step))); render(); });
  });
  $('[data-only-favs]').addEventListener('click', function () { state.onlyFavs = !state.onlyFavs; render(); });
  $('[data-show-favs]').addEventListener('click', function () { state.onlyFavs = true; render(); document.getElementById('imoveis').scrollIntoView(); });
  $('[data-clear]').addEventListener('click', function () { state.dest = ''; state.am = []; state.onlyFavs = false; state.guests = 2; render(); });

  // busca do hero
  var sIn = $('#s-in'), sOut = $('#s-out');
  sIn.min = todayISO(0); sOut.min = todayISO(1);
  sIn.addEventListener('change', function () { if (sIn.value) { sOut.min = sIn.value; if (sOut.value && sOut.value <= sIn.value) sOut.value = ''; } });
  $('#search').addEventListener('submit', function (e) {
    e.preventDefault();
    state.dest = $('#s-dest').value; state.guests = Math.min(14, Math.max(1, parseInt($('#s-guests').value, 10) || 2));
    state.checkin = sIn.value; state.checkout = sOut.value; state.am = []; state.onlyFavs = false;
    track('search', { dest: state.dest, guests: state.guests }); render();
    document.getElementById('imoveis').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });
  // busca inteligente: vai para o assistente
  $('#smart').addEventListener('submit', function (e) {
    e.preventDefault();
    var q = $('#smart-q').value.trim(); if (!q) { $('#smart-q').focus(); return; }
    $('#smart-q').value = ''; track('smart_search');
    if (window.CONCIERGE) window.CONCIERGE.ask(q);
  });

  /* ---------- mensagem de reserva ---------- */
  function bookingMsg(i, ci, co, g) {
    ci = ci || state.checkin; co = co || state.checkout; g = g || state.guests;
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
  function reviewCard(r, dup) {
    return '<article class="review-card"' + (dup ? ' aria-hidden="true"' : '') + '>' +
      '<div class="review-card__stars" role="img" aria-label="Nota ' + r.nota + ' de 5">' + new Array(r.nota + 1).join(star) + '</div>' +
      '<p class="review-card__text">“' + esc(r.texto) + '”</p>' +
      '<footer><span class="review-card__av" aria-hidden="true">' + esc(r.nome[0]) + '</span><span><strong>' + esc(r.nome) + '</strong>' +
      '<small>' + esc(r.origem) + ' · ' + esc(r.data) + '</small></span></footer>' +
      '<span class="review-tag">Airbnb' + (r.traduzido ? ' · traduzido do ' + esc(r.traduzido) : '') + '</span></article>';
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
        '<p>' + esc(i.resumo) + '</p>' +
        '<h3>O espaço</h3><ul class="pdp__desc">' + i.descricao.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>' +
        '<h3>Comodidades</h3><ul class="pdp__am">' + am + '</ul>' +
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
          '<label>Hóspedes<input type="number" name="g" min="1" max="' + i.hospedes + '" value="' + Math.min(state.guests, i.hospedes) + '" inputmode="numeric"></label>' +
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
      state.dest = f.dest || ''; state.am = f.am || []; state.guests = f.guests || 2; state.onlyFavs = false;
      if (f.checkin) state.checkin = f.checkin; if (f.checkout) state.checkout = f.checkout;
      render();
    }
  };
  render();
  route_();
})();

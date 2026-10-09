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

  /* ---------- vitrine ---------- */
  var state = { dest: '', am: [], guests: 0, checkin: '', checkout: '' };
  var DEST = {}; D.destinos.forEach(function (d) { DEST[d.id] = d; });
  var grid = $('#grid'), countEl = $('#results-count');
  var notaN = function (i) { return i.nota ? parseFloat(i.nota.replace(',', '.')) : 0; };
  var doDestino = function (id) { return D.imoveis.filter(function (i) { return i.destino === id; }).sort(function (a, b) { return notaN(b) - notaN(a); }); };
  var plural = function (n, um, varios) { return n + ' ' + (n === 1 ? um : varios); };
  var bairro = function (i) { return i.destino === 'angra' ? 'Angra dos Reis' : i.bairro; };
  function tipoCurto(i) { return /^Casa/.test(i.tipo) ? 'Casa' : /^Flat/.test(i.tipo) ? 'Flat' : 'Apartamento'; }
  function card(i, n) {
    var fotos = i.fotos.length ? i.fotos.slice(0, 5).map(function (f, k) { return img(i, k); }) : [img(i)];
    var slides = fotos.map(function (p, k) {
      return '<img src="' + p.src + '" srcset="' + p.srcset + '" sizes="(max-width: 640px) 92vw, (max-width: 1280px) 45vw, 25vw" width="720" height="684" loading="' + (n < 2 && k === 0 ? 'eager' : 'lazy') + '" alt="' + esc(p.alt) + '">';
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
  function bindCards() {
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

  /* ---------- página inicial: os destinos primeiro ---------- */
  $('#dest-list').innerHTML = D.destinos.map(function (d, k) {
    var n = doDestino(d.id).length;
    return '<a class="dpick__card" href="#destino/' + d.id + '" style="--k:' + k + '">' +
      '<img src="' + d.foto + '-800.webp" srcset="' + d.foto + '-800.webp 800w, ' + d.foto + '-1600.webp 1600w" sizes="(max-width: 900px) 100vw, 40vw" width="800" height="533" alt="' + esc(d.fotoAlt) + '"' + (k ? ' loading="lazy"' : ' fetchpriority="high"') + '>' +
      '<span class="dpick__body"><span class="dpick__count">' + plural(n, 'imóvel', 'imóveis') + '</span>' +
      '<span class="dpick__name">' + esc(d.nome) + '</span>' +
      '<span class="dpick__sub">' + esc(d.chamada) + '</span>' +
      '<span class="dpick__go">Ver imóveis <svg aria-hidden="true"><use href="#i-arrow"/></svg></span></span></a>';
  }).join('');

  /* ---------- página do destino (#destino/barra) ---------- */
  function renderDestino(id) {
    var d = DEST[id], list = doDestino(id);
    state.dest = id;
    $('#dhero').innerHTML =
      '<img class="dhero__bg" src="' + d.foto + '-1600.webp" srcset="' + d.foto + '-800.webp 800w, ' + d.foto + '-1600.webp 1600w" sizes="100vw" width="1600" height="1066" alt="' + esc(d.fotoAlt) + '">' +
      '<div class="dhero__in">' +
        '<a class="back back--light" href="#destinos"><svg aria-hidden="true"><use href="#i-arrow"/></svg>Todos os destinos</a>' +
        '<div class="dhero__txt"><p class="dhero__count">' + plural(list.length, 'imóvel', 'imóveis') + '</p>' +
        '<h1>' + esc(d.nome) + '</h1><p class="dhero__sub">' + esc(d.texto) + '</p>' +
        '<a class="dhero__alem" href="#alem-das-chaves/' + id + '"><svg aria-hidden="true"><use href="#i-key"/></svg>O que vem junto em ' + esc(d.nome.split(' &')[0]) + ' <svg aria-hidden="true"><use href="#i-arrow"/></svg></a></div>' +
        '<nav class="dtabs" aria-label="Destinos">' + D.destinos.map(function (x) {
          return '<a href="#destino/' + x.id + '"' + (x.id === id ? ' aria-current="page"' : '') + '>' + esc(x.nome) + '</a>';
        }).join('') + '</nav>' +
      '</div>';
    countEl.textContent = plural(list.length, 'acomodação', 'acomodações') + ' em ' + d.nome;
    grid.innerHTML = list.map(card).join('');
    bindCards();
    state.visible = list.map(function (i) { return i.slug; });
    if (window.MAPA && MAPA.highlight) MAPA.highlight(state.visible);
  }

  /* lista ⇄ mapa: no computador ficam lado a lado; no celular, botão flutuante como no Airbnb */
  var mtog = $('#map-toggle');
  var wide = function () { return window.innerWidth >= 950; };
  function showMap(on, silent) {
    document.body.classList.toggle('show-map', on);
    mtog.setAttribute('aria-pressed', String(on));
    mtog.innerHTML = on ? '<span>Mostrar lista</span><svg aria-hidden="true"><use href="#i-list"/></svg>' : '<span>Mostrar mapa</span><svg aria-hidden="true"><use href="#i-map"/></svg>';
    setTimeout(function () { if (window.MAPA && MAPA.resize) MAPA.resize(); }, 60);
    if (!silent) track('map_toggle', { on: on });
  }
  mtog.addEventListener('click', function () {
    var on = !document.body.classList.contains('show-map'); showMap(on);
    if (!wide()) window.scrollTo(0, document.getElementById('imoveis').offsetTop - 70);
  });
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

  /* ---------- avaliações ---------- */
  var star = '<svg aria-hidden="true"><use href="#i-star"/></svg>';
  // notas por categoria, no formato da página de avaliações do Airbnb (usadas na página do imóvel)
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

  function reviewCard(r, dup) {
    return '<article class="review-card"' + (dup ? ' aria-hidden="true"' : '') + '>' +
      '<header><span class="review-card__av" aria-hidden="true">' + esc(r.nome[0]) + '</span><span><strong>' + esc(r.nome) + '</strong>' +
      '<small>' + esc(r.origem) + '</small></span></header>' +
      '<p class="review-card__meta"><span class="review-card__stars" role="img" aria-label="Nota ' + r.nota + ' de 5">' + new Array(r.nota + 1).join(star) + '</span> · ' + esc(r.data) + '</p>' +
      '<p class="review-card__text">' + esc(r.texto) + '</p>' +
      (r.traduzido ? '<span class="review-tag">Traduzido do ' + esc(r.traduzido) + '</span>' : '') + '</article>';
  }
  $('#reviews .reviews-track').innerHTML = D.avaliacoes.map(function (r) { return reviewCard(r, false); }).join('') +
    D.avaliacoes.map(function (r) { return reviewCard(r, true); }).join('');

  // carrossel infinito das avaliações (mesmo comportamento dos sites anteriores):
  // roda sozinho, pausa com o mouse em cima e pode ser arrastado com o dedo ou o mouse
  function initMarquee(container, durationSec) {
    var track = container.querySelector('.reviews-track');
    if (!track || reduce) { container.classList.add('is-static'); return; }
    var dragging = false, startX = 0, startOffset = 0, shift = 0;
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
      dragging = true; startX = e.clientX; startOffset = currentX();
      track.style.animation = 'none'; track.style.transform = 'translateX(' + startOffset + 'px)';
      if (container.setPointerCapture) container.setPointerCapture(e.pointerId);
      container.classList.add('is-dragging');
    });
    container.addEventListener('pointermove', function (e) {
      if (!dragging) return;
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

  /* ---------- dúvidas: só a busca; sem resultado, vai para o assistente ---------- */
  var faqList = $('#faq-list'), faqHint = $('#faq-hint'), faqQ = $('#faq-q');
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  var STOP = ' de da do das dos e o a os as um uma no na nos nas em com para pra por que qual quais tem ter vcs voces eu meu minha posso pode como e sao ser ou se ja '.split(' ');
  function faqSearch(q) {
    var nq = norm(q).replace(/[?!.,;:]/g, ' ').trim();
    var words = nq.split(/\s+/).filter(function (w) { return w.length > 1 && STOP.indexOf(w) < 0; });
    if (!words.length) return [];
    return D.faq.map(function (f) {
      var kw = norm(f.palavras.join(' | ')), pq = norm(f.pergunta), rs = norm(f.resposta), s = 0;
      f.palavras.forEach(function (p) { if (nq.indexOf(norm(p)) > -1) s += 6; });
      words.forEach(function (w) {
        var root = w.length > 4 ? w.slice(0, -1) : w;   // pet/pets, garagem/garagens
        if (kw.indexOf(root) > -1) s += 3; else if (pq.indexOf(root) > -1) s += 2; else if (rs.indexOf(root) > -1) s += 0.5;
      });
      return { f: f, s: s };
    }).filter(function (x) { return x.s >= 2; }).sort(function (a, b) { return b.s - a.s; })
      .filter(function (x, k, all) { return x.s >= all[0].s * 0.6; }).slice(0, 3).map(function (x) { return x.f; });
  }
  function renderFaq(q) {
    var t = q.trim();
    if (t.length < 2) { faqList.innerHTML = ''; faqHint.hidden = false; return; }
    var items = faqSearch(t);
    faqHint.hidden = true;
    var askBtn = function (label, cls) { return '<button type="button" class="' + cls + '" data-ask-q>' + '<svg aria-hidden="true"><use href="#i-bot"/></svg>' + label + '</button>'; };
    faqList.innerHTML = items.length
      ? items.map(function (f, n) {
          return '<article class="ask__item" style="--k:' + n + '"><span class="ask__cat">' + esc(f.categoria) + '</span><h3>' + esc(f.pergunta) + '</h3>' +
            '<p>' + esc(f.resposta) + (f.status === 'pendente' ? ' <span class="faq__pend">confirmado no atendimento</span>' : '') + '</p></article>';
        }).join('') + '<p class="ask__more">Não era isso? ' + askBtn('Perguntar ao assistente', 'linklike') + '</p>'
      : '<div class="ask__none"><p>Não encontrei <b>“' + esc(t) + '”</b> nas dúvidas frequentes. O assistente virtual responde na hora, e se ele não souber, passa para a equipe.</p>' + askBtn('Perguntar ao assistente', 'btn btn--mar btn--sm') + '</div>';
    $$('[data-ask-q]', faqList).forEach(function (b) {
      b.addEventListener('click', function () { track('faq_to_chat', { q: t }); if (window.CONCIERGE) CONCIERGE.ask(t); });
    });
  }
  var fqt; faqQ.addEventListener('input', function () { clearTimeout(fqt); fqt = setTimeout(function () { renderFaq(faqQ.value); }, 120); });
  faqQ.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    e.preventDefault(); renderFaq(faqQ.value);
    if (faqQ.value.trim().length > 1 && !faqSearch(faqQ.value).length && window.CONCIERGE) CONCIERGE.ask(faqQ.value.trim());
  });

  /* ---------- além das chaves (#alem-das-chaves/regiao) ---------- */
  var REG = [
    { id: 'barra', nome: 'Barra da Tijuca', foto: 'assets/img/destinos/barra-por-do-sol', alt: 'Pôr do sol sobre o mar na Praia da Barra da Tijuca' },
    { id: 'copacabana', nome: 'Copacabana & Leme', foto: 'assets/img/destinos/copacabana-noite', alt: 'Orla de Copacabana iluminada à noite, vista do alto' },
    { id: 'angra', nome: 'Angra dos Reis', foto: 'assets/img/destinos/angra-costao', alt: 'Costão coberto de mata e mar turquesa na baía de Angra dos Reis' }
  ];
  function alemItem(x, k) {
    var act = '';
    if (x.wa) act = '<a class="alem__act" href="#" data-wa-msg="' + esc(x.wa) + '" data-wa="alem" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg>Pedir pelo WhatsApp</a>';
    else if (x.imoveis) act = '<span class="alem__where">' + x.imoveis.map(function (s) { return bySlug[s] ? '<a href="#imovel/' + s + '">' + esc(bySlug[s].nome) + '</a>' : ''; }).join('') + '</span>';
    return '<li class="alem__item" style="--k:' + k + '"><span class="alem__ico" aria-hidden="true"><svg><use href="#' + x.icone + '"/></svg></span>' +
      '<div><h3>' + esc(x.titulo) + (x.etiqueta ? ' <span class="alem__tag">' + esc(x.etiqueta) + '</span>' : '') + '</h3><p>' + esc(x.texto) + '</p>' + act + '</div></li>';
  }
  function renderAlem(reg) {
    var r = REG.filter(function (x) { return x.id === reg; })[0] || REG[0], n = doDestino(r.id).length;
    $('#alem-tabs').innerHTML = REG.map(function (x) {
      return '<a role="tab" href="#alem-das-chaves/' + x.id + '" aria-selected="' + (x.id === r.id) + '"><img src="' + x.foto + '-800.webp" alt="" loading="lazy"><span>' + esc(x.nome) + '</span></a>';
    }).join('');
    $('#alem-body').innerHTML =
      '<div class="alem__grid">' +
        '<figure class="alem__photo"><img src="' + r.foto + '-1600.webp" srcset="' + r.foto + '-800.webp 800w, ' + r.foto + '-1600.webp 1600w" sizes="(max-width: 900px) 100vw, 40vw" alt="' + esc(r.alt) + '">' +
          '<figcaption><b>' + esc(r.nome) + '</b><span>' + plural(n, 'imóvel', 'imóveis') + '</span><a class="btn btn--light btn--sm" href="#destino/' + r.id + '">Ver imóveis</a></figcaption></figure>' +
        '<ul class="alem__list">' + D.alem[r.id].map(alemItem).join('') + '</ul>' +
      '</div>' +
      '<div class="alem__all"><h2>Em todos os destinos</h2><ul class="alem__list alem__list--row">' + D.alem.todos.map(alemItem).join('') + '</ul></div>' +
      '<div class="alem__ask"><p><b>Procura outra coisa?</b> Transfer, mercado antes da chegada, horário diferente: pergunte. A equipe diz o que é possível.</p>' +
        '<button class="btn btn--ghost btn--sm" type="button" data-open-chat>Perguntar ao assistente</button></div>';
    bindWa($('#alem-body'));
  }

  /* ---------- anuncie seu imóvel (#anuncie) ---------- */
  $('#owners-list').innerHTML = E.gestao.map(function (g) { return '<li><svg aria-hidden="true"><use href="#i-check"/></svg>' + esc(g) + '</li>'; }).join('');
  var oform = $('#owner-form'), oerr = $('#owner-err');
  function ownerMsg() {
    var f = oform, v = function (k) { return (f[k].value || '').trim(); }, m = [];
    m.push('Olá! Quero anunciar meu imóvel com a Aluguel Temporada RJ (Grupo 3D).', '', '*Proprietário*');
    m.push('Nome: ' + v('nome'), 'WhatsApp: ' + v('tel'));
    if (v('email')) m.push('E-mail: ' + v('email'));
    m.push('', '*Imóvel*', v('tipo') + ' em ' + v('local'));
    var nums = [['quartos', 'quarto(s)'], ['banheiros', 'banheiro(s)'], ['hospedes', 'hóspedes'], ['vagas', 'vaga(s)']]
      .filter(function (x) { return v(x[0]) !== ''; }).map(function (x) { return v(x[0]) + ' ' + x[1]; });
    if (nums.length) m.push(nums.join(' · '));
    var ck = [['mobiliado', 'Mobiliado'], ['vista', 'Vista para o mar'], ['lazer', 'Prédio com lazer'], ['anuncia', 'Já anuncia em temporada']]
      .filter(function (x) { return f[x[0]].checked; }).map(function (x) { return x[1]; });
    if (ck.length) m.push(ck.join(' · '));
    if (v('link')) m.push('Anúncio/fotos: ' + v('link'));
    if (v('obs')) m.push('Observações: ' + v('obs'));
    m.push('', 'Podem avaliar?');
    return m.join('\n');
  }
  oform.addEventListener('input', function () {
    $('#owner-mail').href = 'mailto:' + E.email + '?subject=' + encodeURIComponent('Quero anunciar meu imóvel') + '&body=' + encodeURIComponent(ownerMsg().replace(/\*/g, ''));
  });
  oform.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = ['nome', 'tel', 'local'].filter(function (k) { var x = oform[k]; x.removeAttribute('aria-invalid'); return !x.value.trim(); });
    if (!bad.length && oform.tel.value.replace(/\D/g, '').length < 8) bad = ['tel'];
    if (bad.length) {
      bad.forEach(function (k) { oform[k].setAttribute('aria-invalid', 'true'); });
      oerr.hidden = false; oerr.textContent = bad[0] === 'tel' && oform.tel.value.trim() ? 'Confira o número de WhatsApp.' : 'Preencha nome, WhatsApp e bairro/cidade para a equipe retornar.';
      oform[bad[0]].focus(); return;
    }
    oerr.hidden = true;
    track('owner_form');
    openWa(waLink(ownerMsg()), $('#owner-open'));
    toast('Mensagem pronta no WhatsApp da empresa');
  });

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
        (n === show.length - 1 && i.fotos.length > 5 ? '<span class="gal__more">+' + (i.fotos.length - 5) + (i.fotos.length - 5 === 1 ? ' foto' : ' fotos') + '</span>' : '') + '</button>';
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
      '</aside></div>' +
      '<div class="sheet__cta"><button class="btn btn--sun" type="button" data-go-book><svg aria-hidden="true"><use href="#i-wa"/></svg> Consultar disponibilidade</button></div>';

    if (sheet.hidden) lastFocus = document.activeElement;
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
  // fromRoute: o endereço já mudou (voltar do navegador); senão volta à página de onde o imóvel foi aberto
  function closeSheet(fromRoute) {
    if (sheet.hidden) return;
    sheet.hidden = true; document.body.classList.remove('no-scroll');
    document.title = TITLES[cur.view] ? TITLES[cur.view](cur.arg) : TITLES.home();
    if (miniMap) { miniMap.remove(); miniMap = null; }
    if (fromRoute !== true && location.hash.indexOf('#imovel/') === 0) history.replaceState(null, '', location.pathname + location.search + lastBase);
    if (lastFocus && lastFocus.focus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
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

  /* ---------- páginas pelo endereço (funciona no site e no artefato, sem servidor) ---------- */
  var BASE_TITLE = 'Aluguel Temporada RJ';
  var TITLES = {
    home: function () { return BASE_TITLE + ' — Barra da Tijuca, Copacabana e Angra dos Reis'; },
    destino: function (id) { return 'Imóveis em ' + DEST[id].nome + ' — ' + BASE_TITLE; },
    alem: function () { return 'Além das chaves — ' + BASE_TITLE; },
    anuncie: function () { return 'Anuncie seu imóvel — ' + BASE_TITLE; }
  };
  var views = $$('.view'), cur = { view: null, arg: null }, lastBase = '#inicio', marqueeOn = false;
  var LEGACY = { imoveis: ['home', null, 'destinos'], mapa: ['home', null, 'destinos'], proprietarios: ['anuncie'], experiencias: ['alem', 'barra'], contato: ['home', null, 'contato'] };
  function parseHash() {
    var h = location.hash.slice(1), m;
    try { h = decodeURIComponent(h); } catch (e) {}
    if ((m = h.match(/^imovel\/([\w-]+)/)) && bySlug[m[1]]) return { imovel: m[1] };
    if ((m = h.match(/^destino\/([\w-]+)/)) && DEST[m[1]]) return { view: 'destino', arg: m[1] };
    if ((m = h.match(/^alem-das-chaves(?:\/([\w-]+))?$/))) return { view: 'alem', arg: m[1] && D.alem[m[1]] && m[1] !== 'todos' ? m[1] : 'barra' };
    if (h === 'anuncie') return { view: 'anuncie' };
    if (LEGACY[h]) return { view: LEGACY[h][0], arg: LEGACY[h][1] || null, anchor: LEGACY[h][2] };
    return { view: 'home', anchor: h && document.getElementById(h) ? h : null };
  }
  function showView(v, arg) {
    var res = { view: cur.view !== v, arg: cur.view !== v || cur.arg !== arg };
    if (!res.arg) return res;
    views.forEach(function (el) { el.hidden = el.dataset.view !== v; });
    document.body.setAttribute('data-page', v);
    if (v === 'destino') { renderDestino(arg); if (res.view) showMap(wide(), true); }
    if (v === 'alem') renderAlem(arg);
    if (v === 'home' && !marqueeOn) { marqueeOn = true; initMarquee($('#reviews'), 45); }
    $$('[data-nav]').forEach(function (a) { a.setAttribute('aria-current', String(a.dataset.nav === v)); });
    document.title = TITLES[v](arg);
    cur = { view: v, arg: arg };
    if (v === 'destino') setTimeout(function () { if (window.MAPA && MAPA.resize) MAPA.resize(); }, 80);
    if (window.revealSweep) setTimeout(window.revealSweep, 50);
    return res;
  }
  function route_() {
    var r = parseHash();
    if (r.imovel) {
      // link direto para um imóvel: abre por cima da página do destino dele
      if (!cur.view) { showView('destino', bySlug[r.imovel].destino); lastBase = '#destino/' + bySlug[r.imovel].destino; }
      openImovel(r.imovel); return;
    }
    closeSheet(true);
    var changed = showView(r.view, r.arg);
    lastBase = location.hash || '#inicio';
    var smooth = reduce || changed.view ? 'auto' : 'smooth';
    if (r.anchor && r.anchor !== 'inicio' && r.anchor !== 'topo') {
      var el = document.getElementById(r.anchor);
      requestAnimationFrame(function () { el.scrollIntoView({ behavior: smooth }); });
    } else if (r.view === 'home' && r.anchor) window.scrollTo({ top: 0, behavior: smooth });
    else if (changed.view || (changed.arg && r.view === 'destino')) window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route_);

  /* ---------- revelar ao rolar ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    $$('[data-reveal]').forEach(function (el) { io.observe(el); });
    // reforço: se o observador atrasar (aba em segundo plano, máquina lenta), revela o que já passou pela tela
    var sweep = window.revealSweep = function () {
      var vh = window.innerHeight;
      $$('[data-reveal]:not(.in-view)').forEach(function (el) { var t = el.getBoundingClientRect().top; if (t && t < vh) { el.classList.add('in-view'); io.unobserve(el); } });
    };
    var st; window.addEventListener('scroll', function () { clearTimeout(st); st = setTimeout(sweep, 150); }, { passive: true });
  } else { $$('[data-reveal]').forEach(function (el) { el.classList.add('in-view'); }); }

  /* ---------- API pública para o mapa e o assistente ---------- */
  window.APP = {
    state: state, openImovel: function (slug) { location.hash = 'imovel/' + slug; },
    img: img, waLink: waLink, bookingMsg: bookingMsg, destName: destName, track: track, fmtDate: fmtDate, nights: nights, toast: toast,
    // o assistente guarda a busca; "Ver imóveis" leva à página do destino
    applyFilters: function (f) {
      state.dest = f.dest || ''; state.am = f.am || [];
      if (f.guests) state.guests = f.guests;
      if (f.checkin) state.checkin = f.checkin; if (f.checkout) state.checkout = f.checkout;
    },
    showResults: function () { location.hash = state.dest ? 'destino/' + state.dest : 'destinos'; }
  };
  route_();
})();

/* Requinte & Sabor Buffet — interações (JavaScript puro + Lenis para rolagem suave) */
(function () {
  'use strict';

  var C = window.SITE_CONFIG || {};
  var KB = window.RS_KB || {};
  var Lead = window.RSLead;
  var track = window.rsTrack || function () {};
  var doc = document;
  var root = doc.documentElement;
  var $ = function (s, ctx) { return (ctx || doc).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---------- Intro (abertura) ---------- */
  var loaded = false;
  function finishLoading() {
    if (loaded) return;
    loaded = true;
    root.classList.add('is-loaded');
  }
  var seen = false;
  try { seen = sessionStorage.getItem('rs_seen') === '1'; sessionStorage.setItem('rs_seen', '1'); } catch (e) { /* ok */ }
  if (reduceMotion || seen) finishLoading();
  else {
    window.addEventListener('load', function () { setTimeout(finishLoading, 650); });
    setTimeout(finishLoading, 2200); // nunca segura o visitante
  }

  /* ---------- Rolagem suave (Lenis, só desktop) ---------- */
  var lenis = null;
  if (!reduceMotion && window.Lenis && window.matchMedia('(min-width: 960px)').matches) {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    var lraf = function (t) { lenis.raf(t); requestAnimationFrame(lraf); };
    requestAnimationFrame(lraf);
  }
  window.RSUI = { lenis: function () { return lenis; } };
  function scrollToTarget(target) {
    var offset = -70;
    if (lenis) lenis.scrollTo(target, { offset: offset });
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset + offset, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var target = doc.querySelector(id);
    if (!target) return;
    e.preventDefault();
    scrollToTarget(target);
    if (history.replaceState) history.replaceState(null, '', id);
    if (id === '#orcamento') {
      track('quote_cta_click', { label: a.getAttribute('data-track-label') || a.textContent.trim().slice(0, 40) });
      setTimeout(function () { var f = $('[data-quote] .q-step.is-active input'); if (f) f.focus({ preventScroll: true }); }, 900);
    }
  });

  /* ---------- WhatsApp ---------- */
  var phone = (KB.company && KB.company.whatsapp.e164) || C.whatsapp || '5521975143297';
  var templates = KB.whatsappTemplates || {};
  var defaultMsg = templates.default || C.mensagemPadrao;
  function waLink(msg) { return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg || defaultMsg); }
  function waMsg(a) { return a.getAttribute('data-wa-msg') || templates[a.getAttribute('data-wa')] || defaultMsg; }
  $$('[data-wa]').forEach(function (a) { a.href = waLink(waMsg(a)); });
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('[data-wa]');
    if (!a) return;
    // se a pessoa já contou algo no orçamento ou na assistente, a mensagem leva junto
    if (Lead && Lead.filled().length && !a.hasAttribute('data-wa-msg')) a.href = Lead.waUrl(Lead.message(waMsg(a)));
    track('whatsapp_click', { context: a.getAttribute('data-wa-context') || 'site' });
  });

  /* ---------- Concierge Virtual ---------- */
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-chat-open]');
    if (!b || !window.RSConcierge) return;
    e.preventDefault();
    if (root.classList.contains('menu-open')) setMenu(false);
    window.RSConcierge.open(b.getAttribute('data-chat-context') || 'botao');
    var ask = b.getAttribute('data-chat-ask');
    if (ask) setTimeout(function () { window.RSConcierge.ask(ask); }, 500);
  });

  /* ---------- Conteúdo controlado por config.js ---------- */
  if (C.horario) $$('[data-config="horario"]').forEach(function (el) { el.textContent = C.horario; });
  if (C.linkAvaliacoesGoogle) $$('[data-google-reviews]').forEach(function (a) { a.href = C.linkAvaliacoesGoogle; });
  if (C.imagensIlustrativas !== false) root.classList.add('show-ilustrativa');

  var flags = {
    desde1995: C.desde1995Confirmado === true,
    portfolio: Array.isArray(C.portfolio) && C.portfolio.length > 0,
    ilustrativas: C.imagensIlustrativas !== false
  };
  $$('[data-only-if]').forEach(function (el) {
    if (flags[el.getAttribute('data-only-if')]) el.hidden = false;
  });
  var year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- FAQ: campo de busca ligado à assistente ---------- */
  var faqSearch = $('[data-faq-search]');
  if (faqSearch) {
    var faqItems = $$('[data-faq] details');
    var faqEmpty = $('[data-faq-empty]');
    var faqAsk = $('[data-faq-ask]');
    var normTxt = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); };
    var faqTimer;
    faqSearch.addEventListener('input', function () {
      var q = normTxt(faqSearch.value.trim());
      var words = q.split(/\s+/).filter(function (w) { return w.length > 2; });
      var shown = 0;
      faqItems.forEach(function (d) {
        var txt = normTxt(d.textContent);
        var ok = !words.length || words.every(function (w) { return txt.indexOf(w) > -1; });
        d.hidden = !ok; if (ok) shown++;
        if (words.length && ok && shown === 1) d.open = true;
      });
      faqEmpty.hidden = !(words.length && !shown);
      faqAsk.setAttribute('data-chat-ask', faqSearch.value.trim());
      clearTimeout(faqTimer);
      faqTimer = setTimeout(function () { if (words.length) track('faq_search', { found: shown }); }, 900);
    });
    $('[data-faq-form]').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = faqSearch.value.trim();
      if (!v || !window.RSConcierge) return;
      window.RSConcierge.open('faq_busca');
      setTimeout(function () { window.RSConcierge.ask(v); }, 500);
    });
  }
  $$('[data-faq] details').forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) track('faq_open', { q: d.querySelector('summary').textContent.slice(0, 60) }); });
  });

  // Cardápio oficial
  var menu = $('[data-menu]');
  if (menu && C.cardapio && Array.isArray(C.cardapio.secoes) && C.cardapio.secoes.length) {
    var html = '<h3>' + esc(C.cardapio.titulo || 'Cardápio') + '</h3><div class="menu-block__cols">';
    C.cardapio.secoes.forEach(function (s) {
      html += '<div><h4>' + esc(s.nome) + '</h4><ul>' + (s.itens || []).map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></div>';
    });
    html += '</div>';
    if (C.cardapio.observacao) html += '<p class="menu-block__note">' + esc(C.cardapio.observacao) + '</p>';
    menu.innerHTML = html;
    menu.hidden = false;
  }

  // Depoimentos reais
  var tWrap = $('[data-testimonials]');
  var tTrack = $('[data-testimonials-track]');
  var reviews = (C.avaliacoes || []).filter(function (r) { return r && r.texto && r.nome; });
  if (tWrap && tTrack && reviews.length) {
    tTrack.innerHTML = reviews.map(function (r) {
      return '<figure class="testimonial"><span class="stars" aria-label="5 estrelas">★★★★★</span>' +
        '<blockquote>“' + esc(r.texto) + '”</blockquote>' +
        '<figcaption>' + esc(r.nome) + '<span>' + esc(r.fonte || 'Google') + '</span></figcaption></figure>';
    }).join('');
    tWrap.hidden = false;
    var step = function (dir) {
      var card = tTrack.firstElementChild;
      var w = card ? card.getBoundingClientRect().width + 32 : 300;
      tTrack.scrollBy({ left: dir * w, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    $('[data-t-prev]').addEventListener('click', function () { step(-1); });
    $('[data-t-next]').addEventListener('click', function () { step(1); });
    if (reviews.length < 2) $('.testimonials__nav').hidden = true;
  }

  // Portfólio (somente fotos reais)
  if (flags.portfolio) {
    var grid = $('[data-portfolio-grid]');
    var filters = $('[data-portfolio-filters]');
    var order = ['Casamentos', '15 anos', 'Aniversários', 'Corporativos', 'Gastronomia'];
    var cats = order.filter(function (c) { return C.portfolio.some(function (p) { return p.categoria === c; }); });
    grid.innerHTML = C.portfolio.map(function (p) {
      return '<figure data-cat="' + esc(p.categoria) + '"><button type="button" data-lightbox aria-label="Ampliar: ' + esc(p.alt) + '">' +
        '<img src="' + esc(p.src) + '" alt="' + esc(p.alt) + '" loading="lazy" decoding="async"' +
        (p.largura ? ' width="' + p.largura + '" height="' + p.altura + '"' : '') + '></button></figure>';
    }).join('');
    if (cats.length > 1) {
      filters.innerHTML = '<button type="button" aria-pressed="true" data-f="*">Todos</button>' +
        cats.map(function (c) { return '<button type="button" aria-pressed="false" data-f="' + esc(c) + '">' + esc(c) + '</button>'; }).join('');
      filters.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        $$('button', filters).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        var f = b.getAttribute('data-f');
        $$('figure', grid).forEach(function (fig) { fig.hidden = f !== '*' && fig.getAttribute('data-cat') !== f; });
      });
    } else {
      filters.hidden = true;
    }
  }

  /* ---------- Cabeçalho ---------- */
  var header = $('[data-header]');
  var hero = $('.hero');
  var lastY = window.scrollY;
  function onHeader() {
    var y = window.scrollY;
    var heroH = hero ? hero.offsetHeight : 400;
    header.classList.toggle('is-scrolled', y > heroH - 90);
    var hide = y > lastY && y > heroH && !root.classList.contains('menu-open');
    header.classList.toggle('is-hidden', hide);
    lastY = y;
  }

  /* ---------- Menu móvel ---------- */
  var toggle = $('[data-menu-toggle]');
  var mobile = $('[data-mobile-menu]');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.menu-toggle__label').textContent = open ? 'Fechar' : 'Menu';
    root.classList.toggle('menu-open', open);
    if (open) {
      mobile.hidden = false;
      requestAnimationFrame(function () { mobile.classList.add('is-open'); });
      var first = mobile.querySelector('nav a'); if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 60);
      if (lenis) lenis.stop();
      track('menu_open');
    } else {
      mobile.classList.remove('is-open');
      if (lenis) lenis.start();
      setTimeout(function () { if (!mobile.classList.contains('is-open')) mobile.hidden = true; }, 820);
    }
  }
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  mobile.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  $$('[data-menu-close]').forEach(function (b) { b.addEventListener('click', function () { setMenu(false); toggle.focus({ preventScroll: true }); }); });
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('menu-open')) { setMenu(false); toggle.focus(); }
  });

  /* ---------- Hero: sequência cinematográfica ---------- */
  var slides = $$('.hero__slide');
  var dots = $$('.hero__dots i');
  var current = 0;
  function showSlide(i) {
    slides[current].classList.remove('is-active');
    if (dots[current]) dots[current].classList.remove('is-active');
    current = i;
    slides[current].classList.add('is-active');
    if (dots[current]) { void dots[current].offsetWidth; dots[current].classList.add('is-active'); }
  }
  if (dots[0]) dots[0].classList.add('is-active');
  if (slides.length > 1 && !reduceMotion) {
    setInterval(function () {
      if (doc.hidden) return;
      showSlide((current + 1) % slides.length);
    }, 7000);
  }

  /* ---------- Texto revelado palavra por palavra ---------- */
  function splitWords(el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.textContent.split(/(\s+)/);
          var frag = doc.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(doc.createTextNode(' ')); return; }
            var w = doc.createElement('span'); w.className = 'w';
            var inner = doc.createElement('span'); inner.textContent = p;
            inner.style.setProperty('--d', (i++ * 0.055).toFixed(3) + 's');
            w.appendChild(inner); frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    })(el);
  }
  $$('[data-split]').forEach(function (el) {
    splitWords(el);
  });

  /* ---------- Revelações no scroll ---------- */
  var revealEls = $$('[data-reveal], [data-reveal-img], [data-split], .process__steps li');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
    // O título do hero entra imediatamente
    $$('.hero [data-split]').forEach(function (el) { requestAnimationFrame(function () { el.classList.add('is-in'); }); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Parallax, zoom e storytelling (um único loop rAF) ---------- */
  var parallaxEls = $$('[data-speed]');
  var zoomEls = $$('[data-zoom]');
  var story = $('[data-story]');
  var storyTrack = story && $('.story__track', story);
  var stepImgs = story ? $$('[data-step-img]', story) : [];
  var steps = story ? $$('[data-step]', story) : [];
  var bar = story && $('.story__progress', story);
  var activeStep = -1;
  var vh = window.innerHeight;

  function setStep(i) {
    if (i === activeStep) return;
    steps.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
    activeStep = i;
  }

  function updateStory() {
    if (!storyTrack) return;
    var r = storyTrack.getBoundingClientRect();
    var total = r.height - vh;
    if (r.bottom < 0 || r.top > vh) return;
    var p = clamp(-r.top / total, 0, 1);
    var n = stepImgs.length;
    var s = p * n; // 0..n
    stepImgs.forEach(function (fig, i) {
      var reveal = i === 0 ? 1 : clamp((s - (i - 0.25)) / 0.5, 0, 1);
      fig.style.clipPath = 'inset(' + ((1 - reveal) * 100).toFixed(2) + '% 0 0 0)';
      var z = clamp((s - i + 0.5) / 1.5, 0, 1);
      fig.querySelector('img').style.setProperty('--s', (1.14 - z * 0.14).toFixed(4));
    });
    setStep(clamp(Math.floor(s + 0.0001), 0, n - 1));
    if (bar) bar.style.setProperty('--progress', p.toFixed(4));
  }

  function updateParallax() {
    parallaxEls.forEach(function (el) {
      var box = el.parentElement.getBoundingClientRect();
      if (box.bottom < -100 || box.top > vh + 100) return;
      var center = box.top + box.height / 2 - vh / 2;
      var speed = parseFloat(el.getAttribute('data-speed')) || 0;
      var max = box.height * 0.07;
      var y = clamp(-center * speed, -max, max);
      el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
    });
    zoomEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var p = clamp((vh - r.top) / (vh + r.height), 0, 1);
      el.style.setProperty('--p', p.toFixed(4));
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      onHeader();
      if (!reduceMotion) updateParallax();
      updateStory();
      updateFloat();
      ticking = false;
    });
  }

  /* ---------- Diferenciais: palavras + fotografia ---------- */
  var words = $('[data-words]');
  if (words) {
    var items = $$('li[data-word-img]', words);
    var floatBox = $('[data-words-float]', words);
    var imgPath = function (name, w) { return 'assets/img/provisorias/' + name + '-' + w + '.webp'; };

    items.forEach(function (li) {
      var name = li.getAttribute('data-word-img');
      // miniatura em pílula (toque)
      var thumb = doc.createElement('span');
      thumb.className = 'words__thumb';
      thumb.setAttribute('aria-hidden', 'true');
      thumb.innerHTML = '<img src="' + imgPath(name, 480) + '" alt="" loading="lazy" decoding="async">';
      li.insertBefore(thumb, li.firstChild);
      // imagem flutuante (mouse)
      if (floatBox) {
        var im = doc.createElement('img');
        im.alt = ''; im.decoding = 'async'; im.loading = 'lazy';
        im.src = imgPath(name, 480);
        im.setAttribute('data-for', name);
        floatBox.appendChild(im);
      }
    });

    var setActiveWord = function (li) {
      items.forEach(function (x) { x.classList.toggle('is-active', x === li); });
      if (floatBox && li) {
        var name = li.getAttribute('data-word-img');
        $$('img', floatBox).forEach(function (im) { im.classList.toggle('is-current', im.getAttribute('data-for') === name); });
      }
    };

    if (finePointer && !reduceMotion && floatBox) {
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = null, inside = false;
      var loop = function () {
        cx += (tx - cx) * 0.14; cy += (ty - cy) * 0.14;
        var rot = clamp((tx - cx) * 0.04, -8, 8);
        floatBox.style.transform = 'translate3d(' + (cx + 36) + 'px,' + cy + 'px,0) translate(0,-50%) rotate(' + rot.toFixed(2) + 'deg) scale(' + (inside ? 1 : .85) + ')';
        raf = (inside || Math.abs(tx - cx) > .5) ? requestAnimationFrame(loop) : null;
      };
      words.addEventListener('pointermove', function (e) {
        tx = e.clientX; ty = e.clientY;
        if (!raf) { if (!inside) { cx = tx; cy = ty; } raf = requestAnimationFrame(loop); }
      });
      items.forEach(function (li) {
        li.addEventListener('pointerenter', function () { inside = true; floatBox.classList.add('is-visible'); setActiveWord(li); });
      });
      $('.words__list', words).addEventListener('pointerleave', function () {
        inside = false; floatBox.classList.remove('is-visible'); setActiveWord(null);
      });
    } else if ('IntersectionObserver' in window) {
      // Toque: a palavra que passa pelo centro da tela acende e revela sua foto
      var wio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) setActiveWord(e.target); });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      items.forEach(function (li) { wio.observe(li); });
    }
  }

  /* ---------- Lightbox ---------- */
  var dlg = $('[data-lightbox-dialog]');
  var lbImg = dlg && $('[data-lb-img]', dlg);
  var lbCap = dlg && $('[data-lb-caption]', dlg);
  var lbList = [], lbIndex = 0, lbOpener = null;

  function largestSrc(img) {
    var set = img.getAttribute('srcset');
    if (!set) return img.currentSrc || img.src;
    var best = set.split(',').map(function (s) { var p = s.trim().split(/\s+/); return { u: p[0], w: parseInt(p[1], 10) || 0 }; })
      .sort(function (a, b) { return b.w - a.w; })[0];
    return best ? best.u : img.src;
  }
  function lbShow(i) {
    lbIndex = (i + lbList.length) % lbList.length;
    var img = lbList[lbIndex].querySelector('img');
    lbImg.src = largestSrc(img);
    lbImg.alt = img.alt;
    lbCap.textContent = img.alt + (root.classList.contains('show-ilustrativa') && lbList[lbIndex].closest('[data-ilustrativa]') ? ' · Imagem ilustrativa' : '');
    lbImg.style.animation = 'none'; void lbImg.offsetWidth; lbImg.style.animation = '';
  }
  if (dlg && typeof dlg.showModal === 'function') {
    doc.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-lightbox]');
      if (!btn) return;
      var gallery = btn.closest('[data-gallery]');
      lbList = $$('[data-lightbox]', gallery).filter(function (b) { return !b.closest('[hidden]'); });
      lbOpener = btn;
      lbShow(lbList.indexOf(btn));
      dlg.showModal();
    });
    $('[data-lb-close]', dlg).addEventListener('click', function () { dlg.close(); });
    $('[data-lb-prev]', dlg).addEventListener('click', function () { lbShow(lbIndex - 1); });
    $('[data-lb-next]', dlg).addEventListener('click', function () { lbShow(lbIndex + 1); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.classList.contains('lightbox__figure')) dlg.close(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
      if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
    });
    dlg.addEventListener('close', function () { if (lbOpener) lbOpener.focus({ preventScroll: true }); });
    var sx = null;
    dlg.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) lbShow(lbIndex + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }

  /* ---------- Links de evento → orçamento interativo já com o tipo ---------- */
  $$('[data-event]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (!Lead) return;
      Lead.set('evento', a.getAttribute('data-event'));
      if (window.RSQuote) window.RSQuote.rebuild();
      track('service_interest', { service: a.getAttribute('data-event'), source: 'eventos' });
    });
  });

  /* ---------- Botões flutuantes: menu "Como chegar" ---------- */
  var routes = $('[data-routes]');
  if (routes) {
    var rBtn = $('[data-routes-btn]', routes);
    var rMenu = $('#rfab-menu');
    var setRoutes = function (open) {
      routes.classList.toggle('is-open', open);
      rBtn.setAttribute('aria-expanded', String(open));
      rMenu.hidden = !open;
      if (open) track('routes_open');
    };
    rBtn.addEventListener('click', function (e) { e.stopPropagation(); setRoutes(rMenu.hidden); });
    doc.addEventListener('click', function (e) { if (!routes.contains(e.target)) setRoutes(false); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !rMenu.hidden) { setRoutes(false); rBtn.focus(); } });
  }
  var fabs = $('[data-fabs]');
  function updateFloat() {
    if (!fabs) return;
    var pastHero = hero ? hero.getBoundingClientRect().bottom < vh * 0.55 : true;
    fabs.classList.toggle('is-visible', pastHero);
  }

  /* ---------- Copiar endereço ---------- */
  $$('[data-copy-address]').forEach(function (b) {
    b.addEventListener('click', function () {
      var txt = (KB.company && KB.company.address.full) || '';
      var done = function () { var o = b.textContent; b.textContent = 'Endereço copiado'; setTimeout(function () { b.textContent = o; }, 2200); track('address_copy'); };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () {}); else done();
    });
  });

  /* ---------- Mapa sob demanda (não pesa no carregamento) ---------- */
  var mapBtn = $('[data-map-load]');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var iframe = doc.createElement('iframe');
      iframe.title = 'Mapa: Rua Pecegueiro do Amaral, 280 — Vargem Pequena, Rio de Janeiro';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      track('map_load');
      iframe.src = 'https://maps.google.com/maps?q=' + encodeURIComponent('Rua Pecegueiro do Amaral, 280 - Vargem Pequena, Rio de Janeiro - RJ, 22783-490') + '&z=16&output=embed';
      mapBtn.replaceWith(iframe);
    });
  }

  /* ---------- Navegação ativa ---------- */
  var navLinks = $$('.site-nav a');
  if ('IntersectionObserver' in window) {
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id ? 'true' : 'false'); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) { var s = $(a.getAttribute('href')); if (s) nio.observe(s); });
  }

  /* ---------- Inicialização ---------- */
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { vh = window.innerHeight; onScroll(); });
  onScroll();
})();

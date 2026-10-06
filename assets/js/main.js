/* Mapersí Buffet — interações do site
   Sofisticação > quantidade de efeitos. Tudo respeita prefers-reduced-motion. */
(function () {
  'use strict';

  var KB = window.MAPERSI_KB;
  var Lead = window.MapersiLead;
  var track = window.mapersiTrack || function () {};
  var doc = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isDesktop = window.matchMedia('(min-width: 960px)');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------- loader ---------------- */
  var loaded = false;
  function finishLoading() {
    if (loaded) return;
    loaded = true;
    doc.classList.add('is-loaded');
    $$('.hero [data-reveal], .hero [data-split]').forEach(function (el) { el.classList.add('is-in'); });
  }
  var seen = false;
  try { seen = sessionStorage.getItem('mapersi_seen') === '1'; sessionStorage.setItem('mapersi_seen', '1'); } catch (e) { /* ok */ }
  if (reduceMotion || seen) finishLoading();
  else {
    window.addEventListener('load', function () { setTimeout(finishLoading, 500); });
    setTimeout(finishLoading, 1600); // nunca segura o visitante
  }

  /* ---------------- smooth scroll (Lenis) ---------------- */
  var lenis = null;
  if (!reduceMotion && window.Lenis && isDesktop.matches) {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  function scrollToTarget(target) {
    var offset = -(parseInt(getComputedStyle(doc).getPropertyValue('--header-h'), 10) || 72) + 1;
    if (lenis) lenis.scrollTo(target, { offset: offset });
    else {
      var y = target.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute('data-wa')) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(target);
    if (history.replaceState) history.replaceState(null, '', id);
    if (id === '#orcamento') {
      track('quote_cta_click', { label: a.getAttribute('data-track') || 'link' });
      setTimeout(function () { var f = $('[data-quote] .q-step.is-active input, [data-quote] .q-step.is-active textarea'); if (f) f.focus({ preventScroll: true }); }, 900);
    }
  });

  /* ---------------- header ---------------- */
  var header = $('[data-header]');
  var hero = $('.hero');
  var lastY = window.pageYOffset;
  function onScrollHeader() {
    var y = window.pageYOffset;
    var heroH = hero ? hero.offsetHeight : 600;
    var solidAt = isDesktop.matches ? 40 : heroH - 80;
    header.classList.toggle('is-solid', y > solidAt);
    var goingDown = y > lastY + 4, goingUp = y < lastY - 4;
    if (!doc.classList.contains('menu-open')) {
      if (goingDown && y > heroH * .9) header.classList.add('is-hidden');
      else if (goingUp || y < heroH * .5) header.classList.remove('is-hidden');
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------------- menu lateral ---------------- */
  var menu = $('[data-menu]');
  var toggle = $('[data-menu-toggle]');
  var peeks = $$('.drawer__ph');
  function openMenu() {
    if (!menu) return;
    menu.removeAttribute('inert');
    doc.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
    // destaca a seção atual
    setTimeout(function () { var f = $('.drawer__close', menu); if (f) f.focus(); }, 350);
    track('menu_open');
  }
  function closeMenu() {
    if (!menu || !doc.classList.contains('menu-open')) return;
    doc.classList.remove('menu-open');
    menu.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
    toggle.focus({ preventScroll: true });
  }
  if (toggle) toggle.addEventListener('click', function () { doc.classList.contains('menu-open') ? closeMenu() : openMenu(); });
  $$('[data-menu-close]').forEach(function (b) { b.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  // foto que acompanha o link (desktop)
  $$('[data-peek-to]').forEach(function (a) {
    var show = function () { var i = a.getAttribute('data-peek-to'); peeks.forEach(function (p) { p.classList.toggle('is-on', p.getAttribute('data-peek') === i); }); };
    a.addEventListener('mouseenter', show); a.addEventListener('focus', show);
  });
  // atalhos do menu que já abrem o portfólio filtrado
  $$('[data-go-filter]').forEach(function (a) {
    a.addEventListener('click', function () {
      var f = $('[data-filter="' + a.getAttribute('data-go-filter') + '"]');
      if (f) setTimeout(function () { f.click(); }, 50);
    });
  });
  // marca no menu a seção que está na tela
  var drawerLinks = $$('.drawer__nav a');
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        drawerLinks.forEach(function (l) { if (l.getAttribute('href') === '#' + en.target.id) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current'); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    drawerLinks.forEach(function (l) { var sct = $(l.getAttribute('href')); if (sct) secObs.observe(sct); });
  }

  /* ---------------- split text ---------------- */
  function splitWords(el) {
    var i = 0;
    function walk(node, parent) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { parent.appendChild(document.createTextNode(' ')); return; }
            var outer = document.createElement('span');
            outer.className = 'split-line';
            var inner = document.createElement('span');
            inner.style.setProperty('--i', i++);
            inner.textContent = part;
            outer.appendChild(inner);
            parent.appendChild(outer);
          });
        } else if (child.nodeType === 1) {
          var clone = child.cloneNode(false);
          walk(child, clone);
          parent.appendChild(clone);
        }
      });
    }
    var label = el.textContent.replace(/\s+/g, ' ').trim();
    var frag = document.createDocumentFragment();
    walk(el, frag);
    el.textContent = '';
    el.appendChild(frag);
    el.setAttribute('aria-label', label);
    $$('.split-line', el).forEach(function (s) { s.setAttribute('aria-hidden', 'true'); });
  }
  if (!reduceMotion) $$('[data-split]').forEach(splitWords);

  /* ---------------- reveals ---------------- */
  var revealEls = $$('[data-reveal], [data-split], [data-img-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); ro.unobserve(en.target); }
      });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { if (!el.closest('.hero')) ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------- parallax + impacto (um único rAF) ---------------- */
  var parallaxEls = reduceMotion ? [] : $$('[data-parallax]');
  var impact = $('[data-impact]');
  var ticking = false;
  function frame() {
    ticking = false;
    var vh = window.innerHeight;
    parallaxEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var f = parseFloat(el.getAttribute('data-parallax')) || 0;
      var delta = (r.top + r.height / 2 - vh / 2) * f;
      el.style.transform = 'translate3d(0,' + delta.toFixed(1) + 'px,0)';
    });
    if (impact && !reduceMotion) {
      var ir = impact.getBoundingClientRect();
      var total = ir.height - vh;
      var p = Math.min(1, Math.max(0, -ir.top / (total || 1)));
      impact.style.setProperty('--p', p.toFixed(3));
    }
  }
  function requestFrame() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', requestFrame);
  frame();

  /* ---------------- vídeos ---------------- */
  var heroVideo = $('[data-autoplay]');
  var heroToggle = $('[data-video-toggle]');
  var PAUSE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5h3v14H8zM13 5h3v14h-3z"/></svg>';
  var PLAY_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg>';
  function setHeroState(paused) {
    if (!heroToggle) return;
    heroToggle.innerHTML = paused ? PLAY_ICON : PAUSE_ICON;
    heroToggle.setAttribute('aria-label', paused ? 'Reproduzir vídeo de fundo' : 'Pausar vídeo de fundo');
  }
  if (heroVideo) {
    var saveData = navigator.connection && navigator.connection.saveData;
    if (reduceMotion || saveData) { heroVideo.removeAttribute('autoplay'); heroVideo.pause(); setHeroState(true); }
    if (heroToggle) heroToggle.addEventListener('click', function () {
      if (heroVideo.paused) { heroVideo.play(); setHeroState(false); } else { heroVideo.pause(); setHeroState(true); }
    });
  }
  var inviewVideos = $$('[data-inview-play]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          if (v.preload === 'none') { v.preload = 'auto'; }
          var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
        } else v.pause();
      });
    }, { threshold: .25 });
    inviewVideos.forEach(function (v) { vo.observe(v); });
  }
  $$('[data-track-video]').forEach(function (v) {
    v.addEventListener('play', function once() { track(v.getAttribute('data-track-video')); v.removeEventListener('play', once); });
  });

  /* ---------------- experiências ---------------- */
  var xpItems = $$('[data-xp]');
  var xpPics = $$('[data-xp-img]');
  var xpCounter = $('[data-xp-counter]');
  var viewedXp = {};
  function setXp(id) {
    xpItems.forEach(function (it, idx) {
      var on = it.getAttribute('data-xp') === id;
      it.classList.toggle('is-active', on);
      if (on && xpCounter) xpCounter.textContent = ('0' + (idx + 1)).slice(-2);
    });
    xpPics.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-xp-img') === id); });
    if (!viewedXp[id]) { viewedXp[id] = 1; track('service_view', { service: id }); }
  }
  if (xpPics[0]) xpPics[0].classList.add('is-active');
  if ('IntersectionObserver' in window) {
    var xo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setXp(en.target.getAttribute('data-xp')); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    xpItems.forEach(function (it) { xo.observe(it); });
  }
  xpItems.forEach(function (it) {
    it.addEventListener('mouseenter', function () { if (isDesktop.matches) setXp(it.getAttribute('data-xp')); });
  });

  /* ---------------- rail (gastronomia) ---------------- */
  var rail = $('[data-rail-track]');
  if (rail) {
    var bar = $('[data-rail-bar]');
    var step = function () { var it = rail.querySelector('.rail__item'); return it ? it.getBoundingClientRect().width + 16 : 300; };
    var updateBar = function () {
      var max = rail.scrollWidth - rail.clientWidth;
      var vis = rail.clientWidth / rail.scrollWidth;
      var p = max > 0 ? rail.scrollLeft / max : 0;
      if (bar) bar.style.transform = 'translateX(' + (p * (1 / vis - 1) * 100).toFixed(1) + '%) scaleX(' + vis.toFixed(3) + ')';
    };
    if (bar) bar.style.transformOrigin = 'left';
    rail.addEventListener('scroll', updateBar, { passive: true });
    window.addEventListener('resize', updateBar);
    updateBar();
    $('[data-rail-prev]').addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    $('[data-rail-next]').addEventListener('click', function () { rail.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    // arrastar com o mouse
    var down = false, startX = 0, startLeft = 0, moved = false;
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; startX = e.clientX; startLeft = rail.scrollLeft;
      rail.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      rail.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', function () { if (!down) return; down = false; rail.classList.remove('is-dragging'); });
    rail.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  }

  /* ---------------- portfólio + lightbox ---------------- */
  var dlg = $('[data-lightbox-dialog]');
  var stage = $('[data-lightbox-stage]');
  var caption = $('[data-lightbox-caption]');
  var lbItems = [], lbIndex = 0, lastFocus = null;
  function renderLb() {
    var it = lbItems[lbIndex];
    stage.innerHTML = '';
    var media;
    if (it.type === 'video') {
      media = document.createElement('video');
      media.src = it.src; media.controls = true; media.autoplay = true; media.loop = true; media.playsInline = true; media.muted = true;
    } else {
      media = document.createElement('img');
      media.src = it.src; media.alt = it.alt || '';
    }
    stage.appendChild(media);
    caption.textContent = it.cap + (lbItems.length > 1 ? '  ·  ' + (lbIndex + 1) + '/' + lbItems.length : '');
  }
  function openLb(items, i) {
    lbItems = items; lbIndex = i || 0; lastFocus = document.activeElement;
    renderLb();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    if (lenis) lenis.stop();
  }
  function closeLb() { stage.innerHTML = ''; if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }
  function moveLb(d) { lbIndex = (lbIndex + d + lbItems.length) % lbItems.length; renderLb(); }
  if (dlg) {
    $('[data-lightbox-close]').addEventListener('click', closeLb);
    $('[data-lightbox-prev]').addEventListener('click', function () { moveLb(-1); });
    $('[data-lightbox-next]').addEventListener('click', function () { moveLb(1); });
    dlg.addEventListener('close', function () { stage.innerHTML = ''; if (lenis) lenis.start(); if (lastFocus) lastFocus.focus(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target === stage) closeLb(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') moveLb(1);
      if (e.key === 'ArrowLeft') moveLb(-1);
    });
    var sx = null;
    stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (sx == null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) moveLb(dx < 0 ? 1 : -1);
      sx = null;
    });
  }
  $$('[data-case]').forEach(function (b) {
    b.addEventListener('click', function () {
      var items = []; try { items = JSON.parse(b.getAttribute('data-case')); } catch (e) { return; }
      openLb(items, 0);
      track('portfolio_open', { evento: b.closest('.case').querySelector('.case__title').textContent });
    });
  });
  // filtros
  var filters = $$('[data-filter]');
  var caseCards = $$('.case[data-cat]');
  filters.forEach(function (f) {
    f.addEventListener('click', function () {
      var cat = f.getAttribute('data-filter');
      filters.forEach(function (x) { var on = x === f; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      caseCards.forEach(function (c) {
        var show = cat === 'todos' || c.getAttribute('data-cat') === cat;
        c.hidden = !show;
        if (show) c.classList.add('is-in');
      });
      track('portfolio_filter', { filtro: cat });
    });
  });
  var portfolio = $('#portfolio');
  if (portfolio && 'IntersectionObserver' in window) {
    var po = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { track('portfolio_view'); po.disconnect(); }
    }, { threshold: .2 });
    po.observe(portfolio);
  }

  /* ---------------- avaliações em rotação ---------------- */
  var rv = $('[data-rv]');
  if (rv) {
    var slides = $$('.rv__slide', rv);
    var dotsBox = $('[data-rv-dots]', rv);
    var RV_TIME = 7000, ri = 0, rvTimer = null, paused = false;
    rv.style.setProperty('--rv-time', RV_TIME / 1000 + 's');
    var dots = slides.map(function (_, i) {
      var d = document.createElement('button');
      d.type = 'button'; d.className = 'rv__dot';
      d.setAttribute('aria-label', 'Avaliação ' + (i + 1));
      d.addEventListener('click', function () { goRv(i, true); });
      dotsBox.appendChild(d);
      return d;
    });
    function goRv(i, user) {
      ri = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { var on = k === ri; s.classList.toggle('is-active', on); s.setAttribute('aria-hidden', on ? 'false' : 'true'); });
      dots.forEach(function (d, k) {
        d.classList.remove('is-active');
        d.classList.toggle('is-done', k < ri);
        if (k === ri) { void d.offsetWidth; d.classList.add('is-active'); d.setAttribute('aria-current', 'true'); } else d.removeAttribute('aria-current');
      });
      schedule();
      if (user) track('review_nav');
    }
    function schedule() {
      clearTimeout(rvTimer);
      if (reduceMotion || paused) return;
      rvTimer = setTimeout(function () { goRv(ri + 1); }, RV_TIME);
    }
    function setPaused(v) { paused = v; rv.classList.toggle('is-paused', v); if (!v) schedule(); else clearTimeout(rvTimer); }
    $('[data-rv-prev]', rv).addEventListener('click', function () { goRv(ri - 1, true); });
    $('[data-rv-next]', rv).addEventListener('click', function () { goRv(ri + 1, true); });
    rv.addEventListener('mouseenter', function () { setPaused(true); });
    rv.addEventListener('mouseleave', function () { setPaused(false); });
    rv.addEventListener('focusin', function () { setPaused(true); });
    rv.addEventListener('focusout', function () { setPaused(false); });
    var rsx = null;
    rv.addEventListener('touchstart', function (e) { rsx = e.touches[0].clientX; }, { passive: true });
    rv.addEventListener('touchend', function (e) {
      if (rsx == null) return;
      var dx = e.changedTouches[0].clientX - rsx;
      if (Math.abs(dx) > 40) goRv(ri + (dx < 0 ? 1 : -1), true);
      rsx = null;
    });
    goRv(0);
  }

  /* ---------------- WhatsApp contextual ---------------- */
  function waText(key) {
    var tpl = (KB.whatsappTemplates && KB.whatsappTemplates[key]) || KB.whatsappTemplates.default;
    return tpl;
  }
  $$('[data-wa]').forEach(function (a) {
    a.href = Lead.waUrl(waText(a.getAttribute('data-wa')));
    a.target = '_blank';
    a.rel = 'noopener';
    a.addEventListener('click', function () {
      var key = a.getAttribute('data-wa');
      // se o visitante já contou algo (no chat ou orçamento), a mensagem leva junto
      var text = Lead.filled().length && key !== 'catalogo' ? Lead.message(waText(key)) : waText(key);
      a.href = Lead.waUrl(text);
      track('whatsapp_click', { context: a.getAttribute('data-wa-context') || key });
      if (key === 'catalogo') track('catalog_request');
    });
  });

  /* ---------------- botão "Como chegar" (menu de apps) ---------------- */
  var routes = $('[data-routes]');
  if (routes) {
    var rBtn = $('[data-routes-btn]', routes), rMenu = $('.rfab__menu', routes);
    var setRoutes = function (open) {
      rMenu.hidden = !open;
      routes.classList.toggle('is-open', open);
      rBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      rBtn.setAttribute('aria-label', open ? 'Fechar opções de rota' : 'Como chegar: escolher app de mapas');
      if (open) { track('routes_open'); var f = rMenu.querySelector('a'); if (f) f.focus(); }
    };
    rBtn.addEventListener('click', function () { setRoutes(rMenu.hidden); });
    document.addEventListener('click', function (e) { if (!rMenu.hidden && !routes.contains(e.target)) setRoutes(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !rMenu.hidden) { setRoutes(false); rBtn.focus(); } });
  }

  /* ---------------- abrir concierge ---------------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-chat-open]');
    if (!b) return;
    e.preventDefault();
    if (window.MapersiConcierge) window.MapersiConcierge.open(b.getAttribute('data-chat-context'));
  });

  window.MapersiUI = {
    lenis: function () { return lenis; },
    refreshDock: onScrollHeader,
    scrollTo: scrollToTarget
  };
})();

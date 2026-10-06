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
  var dock = $('[data-dock]');
  var lastY = window.pageYOffset;
  var quoteSection = $('#orcamento');
  var quoteInView = false;
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
    if (dock) dock.classList.toggle('is-visible', y > heroH * .6 && !quoteInView && !doc.classList.contains('chat-open'));
    lastY = y;
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();
  if (quoteSection && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { quoteInView = en[0].isIntersecting; onScrollHeader(); }, { threshold: .25 }).observe(quoteSection);
  }

  // item de menu atual
  var navLinks = $$('.nav__list a');
  if ('IntersectionObserver' in window) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (l) { l.classList.toggle('is-current', l.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (l) { var s = $(l.getAttribute('href')); if (s) navObs.observe(s); });
  }

  /* ---------------- menu mobile ---------------- */
  var menu = $('[data-menu]');
  var toggle = $('[data-menu-toggle]');
  function openMenu() {
    menu.hidden = false;
    requestAnimationFrame(function () { menu.classList.add('is-open'); });
    toggle.setAttribute('aria-expanded', 'true');
    toggle.querySelector('.menu-toggle__label').textContent = 'Fechar';
    doc.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
    setTimeout(function () { var f = menu.querySelector('a'); if (f) f.focus(); }, 300);
  }
  function closeMenu() {
    if (!menu || !doc.classList.contains('menu-open')) return;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('.menu-toggle__label').textContent = 'Menu';
    doc.classList.remove('menu-open');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
    setTimeout(function () { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 800);
  }
  if (toggle) toggle.addEventListener('click', function () { doc.classList.contains('menu-open') ? closeMenu() : openMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

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

  /* ---------------- galeria + lightbox ---------------- */
  var dlg = $('[data-lightbox-dialog]');
  var tiles = $$('[data-lightbox]');
  var lbIndex = 0, lastFocus = null;
  var stage = $('[data-lightbox-stage]');
  var caption = $('[data-lightbox-caption]');
  function renderLb() {
    var t = tiles[lbIndex];
    var src = t.getAttribute('href');
    stage.innerHTML = '';
    var media;
    if (t.getAttribute('data-type') === 'video') {
      media = document.createElement('video');
      media.src = src; media.controls = true; media.autoplay = true; media.loop = true; media.playsInline = true; media.muted = true;
    } else {
      media = document.createElement('img');
      media.src = src;
      var inner = t.querySelector('img');
      media.alt = inner ? inner.alt : '';
    }
    stage.appendChild(media);
    caption.textContent = t.getAttribute('data-caption') || '';
  }
  function openLb(i) {
    lbIndex = i; lastFocus = document.activeElement;
    renderLb();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    if (lenis) lenis.stop();
    track('gallery_open', { index: i });
  }
  function closeLb() { stage.innerHTML = ''; if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }
  function moveLb(d) { lbIndex = (lbIndex + d + tiles.length) % tiles.length; renderLb(); }
  if (dlg) {
    tiles.forEach(function (t, i) { t.addEventListener('click', function (e) { e.preventDefault(); openLb(i); }); });
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
  var gallery = $('#galeria');
  if (gallery && 'IntersectionObserver' in window) {
    var go = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { track('gallery_view'); go.disconnect(); }
    }, { threshold: .2 });
    go.observe(gallery);
  }

  /* ---------------- avaliações (da base de conhecimento) ---------------- */
  var reviewsBox = $('[data-reviews]');
  if (reviewsBox && KB.reviews && KB.reviews.length) {
    var esc = function (s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
    reviewsBox.innerHTML =
      '<div class="slider__viewport"><div class="slider__track">' +
      KB.reviews.map(function (r, i) {
        return '<div class="slider__slide" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' de ' + KB.reviews.length + '"><blockquote>“' + esc(r.text) + '”</blockquote><cite>' + esc(r.author) + ' · ' + esc(r.source || 'Google') + '</cite></div>';
      }).join('') +
      '</div></div><div class="slider__controls"><button class="icon-btn" type="button" aria-label="Avaliação anterior" data-s-prev><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><button class="icon-btn" type="button" aria-label="Próxima avaliação" data-s-next><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button></div>';
    var track_ = $('.slider__track', reviewsBox), si = 0, n = KB.reviews.length, timer;
    var go_ = function (d) { si = (si + d + n) % n; track_.style.transform = 'translateX(' + (-si * 100) + '%)'; };
    $('[data-s-prev]', reviewsBox).addEventListener('click', function () { go_(-1); });
    $('[data-s-next]', reviewsBox).addEventListener('click', function () { go_(1); });
    if (!reduceMotion && n > 1) {
      var start = function () { timer = setInterval(function () { go_(1); }, 7000); };
      var stop = function () { clearInterval(timer); };
      reviewsBox.addEventListener('mouseenter', stop); reviewsBox.addEventListener('mouseleave', start);
      reviewsBox.addEventListener('focusin', stop);
      start();
    }
  }

  /* ---------------- mapa (carrega só no clique) ---------------- */
  var mapBtn = $('[data-map-load]');
  if (mapBtn) mapBtn.addEventListener('click', function () {
    var box = $('[data-map]');
    var f = document.createElement('iframe');
    f.src = KB.company.maps.embedUrl;
    f.title = 'Mapa: Mapersí Buffet, Rua Caiena, Bento Ribeiro, Rio de Janeiro';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    box.appendChild(f);
    $('.map__facade', box).remove();
    track('map_load');
  });

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

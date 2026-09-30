/* Carrione Festas — interações */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ---------- Contato (confirmado em linktr.ee/carrionefestas) ---------- */
  var WHATSAPP = '5521999874670';
  var MSG_BASE = 'Olá! Encontrei a Carrione Festas pelo site e gostaria de solicitar um orçamento';
  var MENSAGENS = {
    geral: MSG_BASE + '.',
    decoracao: MSG_BASE + ' de decoração de festa.',
    pegue: MSG_BASE + ' de Pegue e Monte.',
    buffet: MSG_BASE + ' de buffet.'
  };

  function waLink(msg) {
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg);
  }
  function waTema(nome) {
    return waLink(MSG_BASE + ' de decoração. Vi o tema ' + nome + ' e gostaria de algo parecido.');
  }

  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = waLink(MENSAGENS[a.getAttribute('data-wa')] || MENSAGENS.geral);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DATA = window.CARRIONE_FOTOS || { destaques: {}, temas: [] };
  var temas = DATA.temas || [];

  /* ---------- Fotos nos espaços fixos (hero, serviços, momentos) ---------- */
  function putImage(el, src, alt, eager) {
    if (!src) return;
    var img = new Image();
    img.decoding = 'async';
    if (eager) { img.fetchPriority = 'high'; } else { img.loading = 'lazy'; }
    img.alt = alt || '';
    img.onload = function () { img.classList.add('is-loaded'); };
    img.onerror = function () { img.remove(); el.classList.remove('has-img'); };
    img.src = src;
    el.appendChild(img);
    el.classList.add('has-img');
    if (img.complete) img.classList.add('is-loaded');
  }

  document.querySelectorAll('[data-slot]').forEach(function (el) {
    var d = (DATA.destaques || {})[el.getAttribute('data-slot')];
    if (d && d.src) putImage(el, d.src, d.alt, el.getAttribute('data-slot') === 'hero');
  });

  /* ---------- Faixa de temas + tags ---------- */
  var ribbon = document.querySelector('[data-ribbon]');
  if (ribbon && temas.length) {
    var words = temas.map(function (t) { return t.nome; })
      .concat(['Decoração', 'Buffet', 'Pegue e Monte']);
    var html = words.map(function (w) { return '<span>' + w + '</span>'; }).join('');
    ribbon.innerHTML = html + html; // duplicado para o loop contínuo
  }

  var tags = document.querySelector('[data-theme-tags]');
  if (tags) {
    tags.innerHTML = temas.map(function (t) {
      return '<li><a href="#trabalhos" data-goto="' + t.id + '">' + t.nome + '</a></li>';
    }).join('');
  }

  /* ---------- Portfólio ---------- */
  var gallery = document.querySelector('[data-gallery]');
  var filtersEl = document.querySelector('[data-filters]');
  var RATIOS = ['4 / 5', '1 / 1', '3 / 4', '4 / 5', '5 / 4', '2 / 3', '1 / 1'];
  var current = 'todos';
  var visiblePhotos = [];

  function isDark(hex) {
    var n = parseInt(hex.replace('#', ''), 16);
    var r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) < 150;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function buildItems(filter) {
    var items = [];
    temas.forEach(function (t) {
      if (filter !== 'todos' && filter !== t.id) return;
      if (t.fotos && t.fotos.length) {
        t.fotos.forEach(function (f) { items.push({ type: 'photo', tema: t, foto: f }); });
      } else {
        items.push({ type: 'tone', tema: t });
      }
    });
    return items;
  }

  function renderGallery(filter) {
    if (!gallery) return;
    current = filter;
    visiblePhotos = [];
    var items = buildItems(filter);
    gallery.innerHTML = '';

    items.forEach(function (it, i) {
      var t = it.tema;
      var el, media;

      if (it.type === 'photo') {
        var f = it.foto;
        var idx = visiblePhotos.length;
        visiblePhotos.push({ src: f.src, alt: f.alt || ('Decoração de festa tema ' + t.nome + ' — Carrione Festas'), tema: t });
        el = document.createElement('button');
        el.type = 'button';
        el.className = 'tile tile--photo';
        el.setAttribute('aria-label', 'Ampliar foto do tema ' + t.nome);
        el.addEventListener('click', function () { openLightbox(idx); });
        media = document.createElement('div');
        media.className = 'media';
        media.style.cssText = toneVars(t.tons);
        if (f.w && f.h) media.style.setProperty('--ar', f.w + ' / ' + f.h);
        else media.style.setProperty('--ar', RATIOS[i % RATIOS.length]);
        el.appendChild(media);
        putImage(media, f.src, visiblePhotos[idx].alt, false);
      } else {
        // Sem foto ainda: capa artística nas cores do tema, levando ao álbum oficial.
        el = document.createElement('a');
        el.className = 'tile tile--tone' + (isDark(t.tons[0]) ? ' is-dark' : '');
        el.href = t.album;
        el.target = '_blank';
        el.rel = 'noopener';
        el.setAttribute('aria-label', 'Ver álbum do tema ' + t.nome + ' no Facebook');
        media = document.createElement('div');
        media.className = 'media';
        media.style.cssText = toneVars(t.tons);
        media.style.setProperty('--ar', RATIOS[i % RATIOS.length]);
        el.appendChild(media);
      }

      el.style.setProperty('--i', i);
      el.insertAdjacentHTML('beforeend',
        '<span class="tile__cap"><span><span class="tile__kicker">' +
        (it.type === 'photo' ? 'Tema' : 'Ver álbum') + '</span><span class="tile__name">' + esc(t.nome) +
        '</span></span><span class="tile__go" aria-hidden="true"><svg class="i"><use href="#i-' +
        (it.type === 'photo' ? 'arrow' : 'out') + '"/></svg></span></span>');
      gallery.appendChild(el);
    });
  }

  function toneVars(tons) {
    tons = tons || [];
    return '--t1:' + (tons[0] || '#e9cfd9') + ';--t2:' + (tons[1] || '#f1c89a') + ';--t3:' + (tons[2] || '#f6ece2');
  }

  function renderFilters() {
    if (!filtersEl) return;
    var opts = [{ id: 'todos', nome: 'Todos' }].concat(temas);
    filtersEl.innerHTML = opts.map(function (t) {
      return '<button type="button" class="chip" data-filter="' + t.id + '" aria-pressed="' + (t.id === current) + '">' + esc(t.nome) + '</button>';
    }).join('');
    filtersEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-filter]');
      if (!b) return;
      setFilter(b.getAttribute('data-filter'));
    });
  }

  function setFilter(id) {
    if (!filtersEl) return;
    filtersEl.querySelectorAll('.chip').forEach(function (c) {
      var on = c.getAttribute('data-filter') === id;
      c.setAttribute('aria-pressed', on);
      if (on) c.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    renderGallery(id);
  }

  renderFilters();
  renderGallery('todos');

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-goto]');
    if (a) setFilter(a.getAttribute('data-goto'));
  });

  /* ---------- Lightbox ---------- */
  var lb = document.querySelector('[data-lightbox]');
  var lbImg = lb && lb.querySelector('[data-lb-img]');
  var lbCap = lb && lb.querySelector('[data-lb-cap]');
  var lbCta = lb && lb.querySelector('[data-lb-cta]');
  var lbCount = lb && lb.querySelector('[data-lb-count]');
  var lbIndex = 0, lastFocus = null;

  function showPhoto(i) {
    if (!visiblePhotos.length) return;
    lbIndex = (i + visiblePhotos.length) % visiblePhotos.length;
    var p = visiblePhotos[lbIndex];
    lbImg.classList.add('is-swapping');
    var pre = new Image();
    pre.onload = pre.onerror = function () {
      lbImg.src = p.src;
      lbImg.alt = p.alt;
      requestAnimationFrame(function () { lbImg.classList.remove('is-swapping'); });
    };
    pre.src = p.src;
    lbCap.textContent = 'Tema ' + p.tema.nome;
    lbCta.href = waTema(p.tema.nome);
    lbCta.target = '_blank';
    lbCta.rel = 'noopener';
    lbCount.textContent = (lbIndex + 1) + ' / ' + visiblePhotos.length;
    var many = visiblePhotos.length > 1;
    lb.querySelector('[data-lb-prev]').hidden = !many;
    lb.querySelector('[data-lb-next]').hidden = !many;
  }

  function openLightbox(i) {
    if (!lb) return;
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    showPhoto(i);
    requestAnimationFrame(function () { lb.classList.add('is-open'); });
    lb.querySelector('[data-lb-close]').focus();
  }

  function closeLightbox() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () { lb.hidden = true; lbImg.removeAttribute('src'); }, 300);
    if (lastFocus) lastFocus.focus();
  }

  if (lb) {
    lb.querySelector('[data-lb-close]').addEventListener('click', closeLightbox);
    lb.querySelector('[data-lb-prev]').addEventListener('click', function () { showPhoto(lbIndex - 1); });
    lb.querySelector('[data-lb-next]').addEventListener('click', function () { showPhoto(lbIndex + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lightbox__stage')) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') showPhoto(lbIndex - 1);
      else if (e.key === 'ArrowRight') showPhoto(lbIndex + 1);
      else if (e.key === 'Tab') {
        var f = [].slice.call(lb.querySelectorAll('button:not([hidden]), a[href]'));
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    var sx = null, sy = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) showPhoto(lbIndex + (dx < 0 ? 1 : -1));
      else if (dy > 90) closeLightbox();
      sx = sy = null;
    });
  }

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.getElementById('menu');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false); });
  }

  /* ---------- Reveal ao rolar ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-img');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Cabeçalho, botão flutuante e parallax ---------- */
  var header = document.querySelector('[data-header]');
  var waFloat = document.querySelector('[data-wa-float]');
  var hero = document.querySelector('.hero');
  var ctaSection = document.getElementById('orcamento');
  var parallaxEls = [].slice.call(document.querySelectorAll('[data-parallax]'));
  var canParallax = !reduceMotion && window.matchMedia('(min-width: 860px) and (pointer: fine)').matches;
  var lastY = window.scrollY, ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var heroH = hero ? hero.offsetHeight : 600;
    header.classList.toggle('is-solid', y > 40);
    header.classList.toggle('is-hidden', y > heroH && y > lastY + 4 && !document.body.classList.contains('menu-open'));
    if (y < lastY - 4) header.classList.remove('is-hidden');

    if (waFloat) {
      var ctaRect = ctaSection ? ctaSection.getBoundingClientRect() : null;
      var overCta = ctaRect && ctaRect.top < window.innerHeight * 0.6 && ctaRect.bottom > window.innerHeight * 0.4;
      waFloat.classList.toggle('is-visible', y > heroH * 0.6 && !overCta);
    }

    if (canParallax) {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var img = el.querySelector('img');
        if (!img || !el.classList.contains('is-in')) return;
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var offset = (r.top + r.height / 2 - vh / 2) * parseFloat(el.getAttribute('data-parallax'));
        img.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Instagram (incorporação oficial, carregada sob demanda) ---------- */
  var insta = document.querySelector('[data-insta]');
  if (insta && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io2.disconnect();
      var f = document.createElement('iframe');
      f.src = 'https://www.instagram.com/carrione_festas/embed/';
      f.title = 'Publicações do Instagram @carrione_festas';
      f.loading = 'lazy';
      f.setAttribute('scrolling', 'yes');
      f.style.opacity = '0';
      f.style.transition = 'opacity .6s';
      f.onload = function () { f.style.opacity = '1'; };
      insta.appendChild(f);
    }, { rootMargin: '400px 0px' });
    io2.observe(insta);
  }

  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();
})();

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
  // Fotos com "-1600." no nome ganham automaticamente a versão "-800." para celular.
  function putImage(el, src, alt, eager, sizes) {
    if (!src) return;
    var img = new Image();
    img.decoding = 'async';
    if (/-1600\.(webp|jpe?g|png)$/.test(src)) {
      img.srcset = src.replace(/-1600\./, '-800.') + ' 800w, ' + src + ' 1600w';
      img.sizes = sizes || '100vw';
    }
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
    if (d && d.src) putImage(el, d.src, d.alt, el.getAttribute('data-slot') === 'hero', el.getAttribute('data-sizes'));
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
    var groups = temas.filter(function (t) { return filter === 'todos' || filter === t.id; })
      .map(function (t) {
        return t.fotos && t.fotos.length
          ? t.fotos.map(function (f) { return { type: 'photo', tema: t, foto: f }; })
          : [{ type: 'tone', tema: t }];
      });
    // Em "Todos", intercala os temas para a galeria ficar variada.
    var items = [], max = Math.max.apply(null, groups.map(function (g) { return g.length; }).concat(0));
    for (var i = 0; i < max; i++) {
      groups.forEach(function (g) { if (g[i]) items.push(g[i]); });
    }
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
        putImage(media, f.src, visiblePhotos[idx].alt, false, '(min-width: 1180px) 300px, (min-width: 760px) 33vw, 50vw');
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
  var intro = document.querySelector('[data-intro]');
  var introActive = intro && !document.documentElement.classList.contains('no-intro');
  var revealEls = [].slice.call(document.querySelectorAll('.reveal, .reveal-img'))
    .filter(function (el) { return !(introActive && el.closest('.hero')); });
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

  var progress = document.querySelector('[data-progress]');
  var useGsap = false; // vira true quando GSAP carregar (ver fim do arquivo)

  function onScroll() {
    var y = window.scrollY;
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0).toFixed(4) + ')';
    }
    var heroH = hero ? hero.offsetHeight : 600;
    header.classList.toggle('is-solid', y > 40);
    header.classList.toggle('is-hidden', y > heroH && y > lastY + 4 && !document.body.classList.contains('menu-open'));
    if (y < lastY - 4) header.classList.remove('is-hidden');

    if (waFloat) {
      var ctaRect = ctaSection ? ctaSection.getBoundingClientRect() : null;
      var overCta = ctaRect && ctaRect.top < window.innerHeight * 0.6 && ctaRect.bottom > window.innerHeight * 0.4;
      waFloat.classList.toggle('is-visible', y > heroH * 0.6 && !overCta);
    }

    if (canParallax && !useGsap) {
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

  /* ---------- Carrossel giratório (Instagram) ---------- */
  var reel = document.querySelector('[data-reel]');
  if (reel) {
    var all = [];
    temas.forEach(function (t) { (t.fotos || []).forEach(function (f) { all.push({ f: f, t: t }); }); });
    // intercala os temas e divide em duas faixas
    all.sort(function (a, b) { return a.f.src < b.f.src ? -1 : a.f.src > b.f.src ? 1 : 0; });
    var mixed = [], byTema = {};
    all.forEach(function (x) { (byTema[x.t.id] = byTema[x.t.id] || []).push(x); });
    var keys = Object.keys(byTema), more = true;
    for (var k = 0; more; k++) {
      more = false;
      keys.forEach(function (id) { if (byTema[id][k]) { mixed.push(byTema[id][k]); more = true; } });
    }
    var rows = [mixed.filter(function (_, i) { return i % 2 === 0; }), mixed.filter(function (_, i) { return i % 2 === 1; })];
    reel.querySelectorAll('[data-reel-row]').forEach(function (row, r) {
      var items = rows[r];
      if (!items.length) return;
      var html = items.map(function (x) {
        var ar = x.f.w && x.f.h ? (x.f.w / x.f.h).toFixed(3) : '0.8';
        return '<a class="reel__item" href="https://www.instagram.com/carrione_festas/" target="_blank" rel="noopener" style="--ar:' + ar + '" tabindex="-1">' +
          '<img src="' + x.f.src.replace(/-1600\./, '-800.') + '" alt="' + esc(x.f.alt || ('Tema ' + x.t.nome)) + '" loading="lazy" decoding="async">' +
          '<span class="reel__tag"><svg class="i" aria-hidden="true"><use href="#i-ig"/></svg>' + esc(x.t.nome) + '</span></a>';
      }).join('');
      row.innerHTML = '<div class="reel__track" style="--dur:' + (items.length * 5) + 's">' + html + html + '</div>';
      // a segunda metade é só repetição visual
      [].slice.call(row.querySelectorAll('.reel__item')).slice(items.length).forEach(function (el) { el.setAttribute('aria-hidden', 'true'); });
    });
  }

  /* ---------- Abertura: fotos em rotação ---------- */
  var slidesBox = document.querySelector('[data-hero-slides]');
  var slides = (DATA.destaques && DATA.destaques.heroSlides) ||
    (DATA.destaques && DATA.destaques.hero && DATA.destaques.hero.src ? [DATA.destaques.hero] : []);
  var slideEls = [], slideIdx = 0, slideTimer = null;
  var heroCap = document.querySelector('[data-hero-cap]');
  var heroDots = document.querySelector('[data-hero-dots]');
  function makeSlide(d, i) {
    var img = new Image();
    img.decoding = 'async';
    img.alt = i === 0 ? (d.alt || '') : '';
    if (i === 0) img.fetchPriority = 'high';
    img.sizes = '100vw';
    img.dataset.srcset = d.src.replace(/-1600\./, '-800.') + ' 800w, ' + d.src + ' 1600w';
    img.dataset.src = d.src;
    if (i === 0) { img.srcset = img.dataset.srcset; img.src = d.src; img.className = 'is-active'; }
    slidesBox.appendChild(img);
    return img;
  }
  function showSlide(i) {
    if (!slideEls.length) return;
    slideIdx = (i + slideEls.length) % slideEls.length;
    [slideEls[slideIdx], slideEls[(slideIdx + 1) % slideEls.length]].forEach(function (el) {
      if (el && !el.getAttribute('src')) { el.srcset = el.dataset.srcset; el.src = el.dataset.src; }
    });
    slideEls.forEach(function (el, n) {
      var wasActive = el.classList.contains('is-active');
      el.classList.toggle('is-prev', n !== slideIdx && wasActive);
      el.classList.toggle('is-active', n === slideIdx);
    });
    if (heroCap) heroCap.textContent = 'Tema ' + (slides[slideIdx].tema || '');
    if (heroDots) [].forEach.call(heroDots.children, function (b, n) { b.setAttribute('aria-current', n === slideIdx); });
  }
  function startSlides() {
    if (slideEls.length < 2 || reduceMotion || slideTimer) return;
    slideTimer = setInterval(function () { if (!document.hidden) showSlide(slideIdx + 1); }, 6500);
  }
  if (slidesBox && slides.length) {
    slidesBox.classList.add('has-img');
    slideEls = slides.map(makeSlide);
    if (slides.length > 1 && heroDots) {
      heroDots.innerHTML = slides.map(function (d, n) {
        return '<button type="button" aria-label="Mostrar tema ' + esc(d.tema || n + 1) + '"><span></span></button>';
      }).join('');
      heroDots.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b) return;
        clearInterval(slideTimer); slideTimer = null;
        showSlide([].indexOf.call(heroDots.children, b));
        startSlides();
      });
      var heroBar = document.querySelector('[data-hero-bar]');
      if (heroBar) heroBar.hidden = false;
    }
    showSlide(0);
  }

  /* ---------- Intro ---------- */
  function heroIn() {
    document.querySelectorAll('.hero .reveal').forEach(function (el) { el.classList.add('is-in'); });
    startSlides();
  }
  if (introActive) {
    var started = Date.now(), introDone = false;
    var heroImg = document.querySelector('.hero__media img');
    var finish = function () {
      if (introDone) return;
      introDone = true;
      intro.classList.add('is-out');
      document.documentElement.classList.remove('intro-on');
      setTimeout(heroIn, 350);
      setTimeout(function () { intro.remove(); }, 1300);
      try { sessionStorage.setItem('carrione-intro', '1'); } catch (e) {}
    };
    var ready = function () { setTimeout(finish, Math.max(0, 2100 - (Date.now() - started))); };
    if (!heroImg || heroImg.complete) ready();
    else { heroImg.addEventListener('load', ready); heroImg.addEventListener('error', ready); }
    setTimeout(finish, 3200); // nunca segura o visitante por mais tempo
    intro.addEventListener('click', finish);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Enter') finish(); }, { once: true });
  } else {
    if (intro) intro.remove();
    heroIn();
  }

  /* ---------- GSAP + Lenis: rolagem suave e parallax (só se carregarem) ---------- */
  // Carregadas depois da página: o site funciona igual se o CDN falhar.
  function loadScript(src) {
    return new Promise(function (ok, fail) {
      var el = document.createElement('script');
      el.src = src; el.async = true; el.onload = ok; el.onerror = fail;
      document.head.appendChild(el);
    });
  }
  function initMotion() {
    useGsap = true;
    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    if (window.Lenis && canParallax) {
      var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on('scroll', window.ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href^="#"]');
        if (!a || a.getAttribute('href').length < 2) return;
        var target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -60 });
      });
    }
    // parallax suave nas fotos editoriais e dos serviços
    document.querySelectorAll('[data-parallax] > img, .service__media > img').forEach(function (img) {
      var box = img.parentElement;
      var amount = parseFloat(box.getAttribute('data-parallax') || '0.06') * 600;
      gsap.fromTo(img, { yPercent: 0, y: -amount / 2 }, {
        y: amount / 2, ease: 'none',
        scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    // o mapa aproxima de leve ao entrar
    var mapImg = document.querySelector('[data-map] img');
    if (mapImg) {
      gsap.fromTo(mapImg, { scale: 1.12 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: mapImg, start: 'top bottom', end: 'center center', scrub: true }
      });
    }
    // a faixa de temas acelera com a velocidade da rolagem
    var track = document.querySelector('[data-ribbon]');
    if (track) {
      window.ScrollTrigger.create({
        onUpdate: function (st) {
          var v = Math.min(4, 1 + Math.abs(st.getVelocity()) / 800);
          track.getAnimations().forEach(function (an) { an.playbackRate = v; });
          clearTimeout(track._calm);
          track._calm = setTimeout(function () {
            track.getAnimations().forEach(function (an) { an.playbackRate = 1; });
          }, 180);
        }
      });
    }
  }

  if (!reduceMotion) {
    var boot = function () {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js')
        .then(function () { return loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js'); })
        .then(function () { return canParallax ? loadScript('https://unpkg.com/lenis@1.1.13/dist/lenis.min.js').catch(function () {}) : null; })
        .then(initMotion)
        .catch(function () { /* sem GSAP: fica o parallax simples */ });
    };
    if (document.readyState === 'complete') boot();
    else window.addEventListener('load', boot);
  }

  /* ---------- Pedido: respostas viram mensagem para o WhatsApp ---------- */
  var form = document.querySelector('[data-form]');
  if (form) {
    var formDone = document.querySelector('[data-form-done]');
    var doneWa = document.querySelector('[data-form-wa]');
    var summary = document.querySelector('[data-form-summary]');
    var statusEl = form.querySelector('.form__status');
    var phoneEl = form.querySelector('[data-mask="phone"]');

    if (phoneEl) phoneEl.addEventListener('input', function () {
      var d = phoneEl.value.replace(/\D/g, '');
      if (d.indexOf('55') === 0 && d.length > 11) d = d.slice(2);
      d = d.slice(0, 11);
      var out = d;
      if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
      if (d.length > 6) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4);
      phoneEl.value = out;
    });

    var checked = function (name) {
      return [].map.call(form.querySelectorAll('input[name="' + name + '"]:checked'), function (i) { return i.value; });
    };
    var rules = {
      nome: function () { return form.elements.nome.value.trim().length >= 2 ? '' : 'Conte como podemos te chamar.'; },
      whatsapp: function () { return form.elements.whatsapp.value.replace(/\D/g, '').length >= 10 ? '' : 'Informe um WhatsApp com DDD.'; },
      servicos: function () { return checked('servicos').length ? '' : 'Escolha pelo menos um serviço.'; }
    };
    var fieldOf = function (name) {
      return name === 'servicos' ? form.querySelector('[data-group="servicos"]') : form.elements[name].closest('.field');
    };
    var validate = function (name) {
      var msg = rules[name]();
      var field = fieldOf(name);
      field.classList.toggle('has-error', !!msg);
      var err = field.querySelector('.field__error');
      if (err) { err.id = err.id || 'erro-' + name; err.textContent = msg; }
      if (name !== 'servicos') {
        var input = form.elements[name];
        input.setAttribute('aria-invalid', msg ? 'true' : 'false');
        if (msg) input.setAttribute('aria-describedby', err.id); else input.removeAttribute('aria-describedby');
      }
      return !msg;
    };
    ['nome', 'whatsapp'].forEach(function (name) {
      var input = form.elements[name];
      input.addEventListener('blur', function () { if (input.value) validate(name); });
      input.addEventListener('input', function () { if (input.closest('.field').classList.contains('has-error')) validate(name); });
    });
    form.querySelectorAll('input[name="servicos"]').forEach(function (c) { c.addEventListener('change', function () { validate('servicos'); }); });

    // Botões de serviço do site já deixam o serviço marcado no formulário
    document.querySelectorAll('[data-pedido]').forEach(function (a) {
      a.addEventListener('click', function () {
        var box = form.querySelector('input[name="servicos"][value="' + a.getAttribute('data-pedido') + '"]');
        if (box) box.checked = true;
      });
    });

    var fmtDate = function (v) {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
      return m ? m[3] + '/' + m[2] + '/' + m[1] : v;
    };
    var buildMessage = function () {
      var el = form.elements;
      var val = function (n) { return (el[n] && el[n].value || '').trim(); };
      return [
        'Olá! Encontrei a Carrione Festas pelo site e gostaria de solicitar um orçamento.',
        '',
        '*Nome:* ' + val('nome'),
        '*WhatsApp:* ' + val('whatsapp'),
        '*Serviço:* ' + checked('servicos').join(', '),
        checked('tipo').length ? '*Tipo de festa:* ' + checked('tipo')[0] : null,
        val('tema') ? '*Tema:* ' + val('tema') : null,
        val('data') ? '*Data:* ' + fmtDate(val('data')) : null,
        val('bairro') ? '*Bairro/local:* ' + val('bairro') : null,
        val('convidados') ? '*Convidados (aprox.):* ' + val('convidados') : null,
        val('mensagem') ? '*O que estou imaginando:* ' + val('mensagem') : null
      ].filter(function (l) { return l !== null; }).join('\n');
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.elements.empresa && form.elements.empresa.value) return;
      var invalid = Object.keys(rules).filter(function (n) { return !validate(n); });
      if (invalid.length) {
        var first = invalid[0] === 'servicos' ? form.querySelector('input[name="servicos"]') : form.elements[invalid[0]];
        first.focus();
        statusEl.textContent = 'Revise os campos destacados para continuar.';
        return;
      }
      var msg = buildMessage();
      summary.textContent = msg.replace(/\*/g, '');
      doneWa.href = waLink(msg);
      statusEl.textContent = '';
      form.hidden = true;
      formDone.hidden = false;
      formDone.focus({ preventScroll: true });
      formDone.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });

    document.querySelector('[data-form-edit]').addEventListener('click', function () {
      formDone.hidden = true;
      form.hidden = false;
      form.elements.nome.focus();
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  }

  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();
})();

/* Requinte & Sabor Buffet — interações (JavaScript puro, sem dependências) */
(function () {
  'use strict';

  var C = window.SITE_CONFIG || {};
  var doc = document;
  var root = doc.documentElement;
  var $ = function (s, ctx) { return (ctx || doc).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---------- WhatsApp ---------- */
  var phone = C.whatsapp || '5521975143297';
  var defaultMsg = C.mensagemPadrao || 'Olá! Conheci a Requinte & Sabor pelo site e gostaria de solicitar um orçamento para meu evento.';
  function waLink(msg) { return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg || defaultMsg); }
  $$('[data-wa]').forEach(function (a) { a.href = waLink(a.getAttribute('data-wa-msg')); });

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

  // FAQ: só entram perguntas com resposta confirmada
  var faq = $('[data-faq]');
  (C.faqPendentes || []).forEach(function (item) {
    if (!faq || !item.resposta || !String(item.resposta).trim()) return;
    var d = doc.createElement('details');
    d.innerHTML = '<summary>' + esc(item.pergunta) + '</summary><p>' + esc(item.resposta) + '</p>';
    faq.appendChild(d);
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
      var first = mobile.querySelector('a'); if (first) first.focus({ preventScroll: true });
    } else {
      mobile.classList.remove('is-open');
      setTimeout(function () { if (!mobile.classList.contains('is-open')) mobile.hidden = true; }, 450);
    }
  }
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  mobile.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
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
  var track = story && $('.story__track', story);
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
    if (!track) return;
    var r = track.getBoundingClientRect();
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

  /* ---------- Formulário → WhatsApp ---------- */
  var form = $('[data-quote-form]');
  var status = $('[data-form-status]');
  var typeSelect = $('#f-tipo');

  // Links "Planejar meu casamento" etc. pré-selecionam o tipo de evento
  $$('[data-event]').forEach(function (a) {
    a.addEventListener('click', function () {
      var v = a.getAttribute('data-event');
      if (typeSelect) typeSelect.value = v;
      setTimeout(function () { var n = $('#f-nome'); if (n) n.focus({ preventScroll: true }); }, reduceMotion ? 0 : 900);
    });
  });

  function fieldError(input, msg) {
    var field = input.closest('.field');
    var err = field.querySelector('.field__error');
    field.classList.toggle('is-invalid', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (msg) {
      if (!err) {
        err = doc.createElement('span'); err.className = 'field__error';
        err.id = input.id + '-erro'; field.appendChild(err);
        input.setAttribute('aria-describedby', err.id);
      }
      err.textContent = msg;
    } else if (err) { err.remove(); input.removeAttribute('aria-describedby'); }
  }

  function formatDate(v) {
    if (!v) return '';
    var p = v.split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : v;
  }

  if (form) {
    var whats = $('#f-whats');
    whats.addEventListener('input', function () {
      var d = whats.value.replace(/\D/g, '').slice(0, 11);
      var out = d;
      if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
      if (d.length > 7) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4);
      whats.value = out;
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var ok = true;
      var nome = f.nome.value.trim();
      var tel = f.whatsapp.value.replace(/\D/g, '');
      fieldError(f.nome, nome ? '' : 'Informe seu nome.'); ok = ok && !!nome;
      var telOk = tel.length >= 10;
      fieldError(f.whatsapp, telOk ? '' : 'Informe um WhatsApp com DDD.'); ok = ok && telOk;
      var emailOk = !f.email.value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value);
      fieldError(f.email, emailOk ? '' : 'Confira o e-mail.'); ok = ok && emailOk;
      fieldError(f.tipo, f.tipo.value ? '' : 'Selecione o tipo de evento.'); ok = ok && !!f.tipo.value;
      if (!ok) {
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        status.textContent = 'Confira os campos destacados.';
        return;
      }

      var lines = [
        'Olá! Conheci a Requinte & Sabor pelo site e gostaria de receber uma proposta para meu evento.',
        '',
        '*Nome:* ' + nome,
        '*WhatsApp:* ' + f.whatsapp.value.trim()
      ];
      if (f.email.value.trim()) lines.push('*E-mail:* ' + f.email.value.trim());
      lines.push('*Tipo de evento:* ' + f.tipo.value);
      if (f.data.value) lines.push('*Data:* ' + formatDate(f.data.value));
      if (f.convidados.value) lines.push('*Convidados (aprox.):* ' + f.convidados.value);
      if (f.local.value.trim()) lines.push('*Local:* ' + f.local.value.trim());
      if (f.mensagem.value.trim()) lines.push('', '*Mensagem:* ' + f.mensagem.value.trim());

      var url = waLink(lines.join('\n'));
      status.textContent = 'Abrindo o WhatsApp com a sua mensagem…';
      var win = window.open(url, '_blank', 'noopener');
      if (!win) window.location.href = url;
    });
  }

  /* ---------- Botão flutuante ---------- */
  var floatBtn = $('[data-float]');
  var hideZones = $$('#orcamento, #contato, .site-footer');
  function updateFloat() {
    if (!floatBtn) return;
    var pastHero = hero ? hero.getBoundingClientRect().bottom < vh * 0.4 : true;
    var inZone = hideZones.some(function (z) {
      var r = z.getBoundingClientRect();
      return r.top < vh * 0.8 && r.bottom > vh * 0.2;
    });
    floatBtn.classList.toggle('is-visible', pastHero && !inZone && !root.classList.contains('menu-open'));
  }

  /* ---------- Mapa sob demanda (não pesa no carregamento) ---------- */
  var mapBtn = $('[data-map-load]');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var iframe = doc.createElement('iframe');
      iframe.title = 'Mapa: Rua Pecegueiro do Amaral, 280 — Vargem Pequena, Rio de Janeiro';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
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

/* By Dani Decora — interações do site (sem dependências) */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 768px)');

  /* ---------- Hero: entrada suave após a imagem principal carregar ---------- */
  const hero = $('.hero');
  if (hero) {
    const heroImgs = $$('img', hero).filter((img) => img.offsetParent !== null);
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      requestAnimationFrame(() => hero.classList.add('is-loaded'));
    };
    Promise.all(heroImgs.map((img) => (img.complete ? Promise.resolve() : new Promise((r) => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); })))).then(reveal);
    setTimeout(reveal, 1600); // nunca segurar o conteúdo por muito tempo
  }

  /* ---------- Header: transparente → sólido ---------- */
  const header = $('[data-header]');
  const floatBtn = $('[data-float]');
  const mobileCta = $('[data-mobile-cta]');
  let ctaBlocked = false;

  const onScroll = () => {
    const y = window.scrollY;
    if (header && !document.body.classList.contains('legal')) header.classList.toggle('is-solid', y > 40);
    const pastHero = y > (hero ? hero.offsetHeight * 0.7 : 300);
    floatBtn?.classList.toggle('is-visible', pastHero && !ctaBlocked);
    mobileCta?.classList.toggle('is-visible', pastHero && !ctaBlocked);
  };

  // Esconde os CTAs fixos quando a seção de CTA/contato já está na tela (evita redundância)
  const ctaZones = $$('.cta, #contato, .site-footer');
  if (ctaZones.length && 'IntersectionObserver' in window) {
    const visible = new Set();
    const zoneObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      ctaBlocked = visible.size > 0;
      onScroll();
    }, { threshold: 0.15 });
    ctaZones.forEach((z) => zoneObs.observe(z));
  }

  /* ---------- Parallax sutil (desktop, sem movimento reduzido) ---------- */
  const heroMedia = $('[data-hero-media]');
  const parallaxEls = $$('[data-parallax]');
  const parallax = () => {
    if (reduceMotion.matches || !desktop.matches) return;
    const vh = window.innerHeight;
    if (heroMedia && window.scrollY < vh * 1.2) {
      heroMedia.style.transform = `translate3d(0, ${window.scrollY * 0.22}px, 0)`;
    }
    parallaxEls.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      const offset = (r.top + r.height / 2 - vh / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onScroll();
      parallax();
      ticking = false;
    });
  }, { passive: true });
  onScroll();
  parallax();

  /* ---------- Reveal ao rolar ---------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const obs = new IntersectionObserver((entries) => {
      const incoming = entries.filter((e) => e.isIntersecting);
      incoming
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach((e, i) => {
          e.target.style.setProperty('--d', `${Math.min(i, 5) * 0.09}s`);
          e.target.classList.add('is-in');
          obs.unobserve(e.target);
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach((el) => obs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Menu mobile ---------- */
  const toggle = $('[data-menu-toggle]');
  const menu = $('[data-menu]');
  if (toggle && menu) {
    $$('li', menu).forEach((li, i) => li.style.setProperty('--i', i));
    let lastFocus = null;

    const focusables = () => $$('a, button', menu).concat(toggle);
    const trap = (e) => {
      if (e.key === 'Escape') return close();
      if (e.key !== 'Tab') return;
      const f = focusables();
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    const open = () => {
      lastFocus = document.activeElement;
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
      toggle.setAttribute('aria-expanded', 'true');
      toggle.querySelector('.menu-toggle__label').textContent = 'Fechar';
      root.classList.add('menu-open');
      document.body.classList.add('is-locked');
      document.addEventListener('keydown', trap);
      setTimeout(() => $('a', menu)?.focus(), 60);
    };
    function close() {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.querySelector('.menu-toggle__label').textContent = 'Menu';
      root.classList.remove('menu-open');
      document.body.classList.remove('is-locked');
      document.removeEventListener('keydown', trap);
      setTimeout(() => { menu.hidden = true; }, reduceMotion.matches ? 0 : 420);
      if (lastFocus && lastFocus !== document.body) lastFocus.focus({ preventScroll: true });
    }
    toggle.addEventListener('click', () => (toggle.getAttribute('aria-expanded') === 'true' ? close() : open()));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => { lastFocus = null; close(); }));
    window.matchMedia('(min-width: 1200px)').addEventListener('change', (m) => m.matches && !menu.hidden && close());
  }

  /* ---------- Link ativo no menu ---------- */
  const navLinks = $$('.nav__list a');
  const sections = navLinks.map((a) => $(a.hash)).filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    const navObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        navLinks.forEach((a) => a.setAttribute('aria-current', String(a.hash === `#${e.target.id}`)));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => navObs.observe(s));
  }

  /* ---------- Serviços: imagem que acompanha a lista (desktop) ---------- */
  const services = $$('[data-service]');
  const stage = $$('[data-stage]');
  if (services.length && stage.length && 'IntersectionObserver' in window) {
    const setActive = (i) => {
      services.forEach((s) => s.classList.toggle('is-active', s.dataset.service === i));
      stage.forEach((p) => p.classList.toggle('is-active', p.dataset.stage === i));
    };
    const servObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.isIntersecting && setActive(e.target.dataset.service));
    }, { rootMargin: '-45% 0px -45% 0px' });
    services.forEach((s) => {
      servObs.observe(s);
      s.addEventListener('mouseenter', () => setActive(s.dataset.service));
    });
    setActive('0');
  }

  /* ---------- Faixa horizontal de detalhes ---------- */
  const track = $('[data-details-track]');
  if (track) {
    const prev = $('[data-details-prev]');
    const next = $('[data-details-next]');
    const step = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 24;
    const update = () => {
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduceMotion.matches ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduceMotion.matches ? 'auto' : 'smooth' }));
    track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Lightbox ---------- */
  const dialog = $('[data-lightbox-dialog]');
  const items = $$('[data-lightbox]');
  if (dialog && items.length && typeof dialog.showModal === 'function') {
    const img = $('[data-lb-img]', dialog);
    const caption = $('[data-lb-caption]', dialog);
    const count = $('[data-lb-count]', dialog);
    let index = 0;
    let opener = null;

    const altOf = (a) => a.querySelector('img')?.alt || '';
    const preload = (i) => { const a = items[(i + items.length) % items.length]; const im = new Image(); im.src = a.href; };

    const show = (i, animate = true) => {
      index = (i + items.length) % items.length;
      const a = items[index];
      const apply = () => {
        img.src = a.href;
        img.alt = altOf(a);
        if (a.dataset.w) { img.width = a.dataset.w; img.height = a.dataset.h; }
        caption.textContent = a.dataset.caption || altOf(a);
        count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
        img.classList.remove('is-changing');
      };
      if (animate && !reduceMotion.matches) {
        img.classList.add('is-changing');
        setTimeout(apply, 180);
      } else apply();
      preload(index + 1);
      preload(index - 1);
    };

    items.forEach((a, i) => a.addEventListener('click', (e) => {
      e.preventDefault();
      opener = a;
      show(i, false);
      dialog.showModal();
      document.body.classList.add('is-locked');
    }));

    $('[data-lb-prev]', dialog).addEventListener('click', () => show(index - 1));
    $('[data-lb-next]', dialog).addEventListener('click', () => show(index + 1));
    $('[data-lb-close]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      document.body.classList.remove('is-locked');
      opener?.focus({ preventScroll: true });
    });
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') show(index + 1);
      if (e.key === 'ArrowLeft') show(index - 1);
    });
    // Clique fora da imagem fecha
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog || e.target.classList.contains('lightbox__stage')) dialog.close();
    });
    // Gesto de arrastar no celular
    let x0 = null;
    dialog.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    dialog.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  /* ---------- Avaliações: mostrar mais ---------- */
  const moreBtn = $('[data-reviews-more]');
  if (moreBtn) {
    const list = moreBtn.closest('.reviews__list');
    list.classList.add('is-collapsed');
    moreBtn.hidden = false;
    moreBtn.addEventListener('click', () => {
      list.classList.remove('is-collapsed');
      $$('[data-review-extra]', list).forEach((el) => el.classList.add('is-in'));
      const first = $('[data-review-extra] blockquote', list);
      moreBtn.closest('.reviews__more').remove();
      if (first) { first.setAttribute('tabindex', '-1'); first.focus({ preventScroll: true }); }
    });
  }

  /* ---------- Formulário → WhatsApp ---------- */
  const form = $('[data-quote-form]');
  if (form) {
    const status = $('[data-form-status]', form);
    const phone = $('#f-whatsapp', form);

    // Máscara simples: (21) 99999-9999
    phone?.addEventListener('input', () => {
      const d = phone.value.replace(/\D/g, '').slice(0, 11);
      let v = d;
      if (d.length > 2) v = `(${d.slice(0, 2)}) ${d.slice(2)}`;
      if (d.length > 7) v = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
      phone.value = v;
    });

    const setError = (field, msg) => {
      const wrap = field.closest('.field');
      wrap.classList.toggle('has-error', !!msg);
      let el = wrap.querySelector('.field__error');
      if (msg) {
        if (!el) {
          el = document.createElement('span');
          el.className = 'field__error';
          el.id = `${field.id}-erro`;
          wrap.appendChild(el);
        }
        el.textContent = msg;
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', el.id);
      } else {
        el?.remove();
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
      }
    };

    const validate = () => {
      let firstInvalid = null;
      const checks = [
        [form.nome, (v) => v.trim().length >= 2, 'Informe seu nome.'],
        [form.whatsapp, (v) => v.replace(/\D/g, '').length >= 10, 'Informe um WhatsApp com DDD.'],
        [form.tipo, (v) => !!v, 'Selecione o tipo de evento.'],
        [form.email, (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Confira o e-mail informado.'],
      ];
      checks.forEach(([field, ok, msg]) => {
        const valid = ok(field.value);
        setError(field, valid ? '' : msg);
        if (!valid && !firstInvalid) firstInvalid = field;
      });
      return firstInvalid;
    };

    form.addEventListener('input', (e) => {
      if (e.target.closest('.field.has-error')) validate();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const invalid = validate();
      if (invalid) {
        invalid.focus();
        status.textContent = 'Confira os campos destacados.';
        return;
      }
      const f = new FormData(form);
      const date = f.get('data') ? new Date(`${f.get('data')}T12:00:00`).toLocaleDateString('pt-BR') : '';
      const fields = [
        `*Nome:* ${f.get('nome').trim()}`,
        `*WhatsApp:* ${f.get('whatsapp')}`,
        f.get('email') && `*E-mail:* ${f.get('email')}`,
        `*Tipo de evento:* ${f.get('tipo')}`,
        date && `*Data:* ${date}`,
        f.get('local') && `*Local:* ${f.get('local').trim()}`,
        f.get('convidados') && `*Convidados (aprox.):* ${f.get('convidados')}`,
        f.get('mensagem') && `*O que estou imaginando:* ${f.get('mensagem').trim()}`,
      ].filter(Boolean);
      const text = `Olá! Conheci o trabalho da By Dani pelo site e gostaria de conversar sobre a decoração do meu evento.\n\n${fields.join('\n')}`;
      const url = `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(text)}`;
      const win = window.open(url, '_blank');
      if (win) win.opener = null;
      else window.location.href = url;
      status.textContent = 'Pronto! Abrimos o WhatsApp com as informações do seu evento. É só enviar a mensagem.';
    });
  }
})();

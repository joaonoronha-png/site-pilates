/* ==========================================================================
   Rebecca Gemaque — interações
   Vanilla JS, sem dependências. Tudo respeita prefers-reduced-motion.
   ========================================================================== */
(() => {
  'use strict';

  const CFG = window.SITE_CONFIG || {};
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const waNumber = CFG.whatsapp || '5521999811992';
  const waLink = (text) => `https://wa.me/${waNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

  /* ---------- Métricas ---------- */
  const track = (event, params = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
    if (typeof window.gtag === 'function') window.gtag('event', event, params);
    if (typeof window.fbq === 'function') {
      if (event === 'generate_lead') window.fbq('track', 'Lead');
      if (event === 'contact_whatsapp') window.fbq('track', 'Contact');
    }
  };

  const loadAnalytics = () => {
    const { ga4, metaPixel } = CFG.analytics || {};
    if (ga4) {
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4)}`;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', ga4);
    }
    if (metaPixel) {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq('init', metaPixel);
      window.fbq('track', 'PageView');
    }
  };

  /* ---------- Ano dinâmico ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- WhatsApp ---------- */
  const waFloat = $('[data-wa-float]');
  if (waFloat && CFG.whatsappGreeting) waFloat.href = waLink(CFG.whatsappGreeting);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="wa.me"]');
    if (a) track('contact_whatsapp', { location: a.dataset.waFloat !== undefined ? 'floating' : 'inline' });
  });

  /* ---------- Header ---------- */
  const header = $('[data-header]');
  const hero = $('.hero');
  const onScrollHeader = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40 || header.hasAttribute('data-header-solid'));
    if (waFloat) {
      const heroEnd = hero ? hero.offsetHeight * 0.6 : 400;
      const nearForm = $('#contato')?.getBoundingClientRect();
      const formVisible = nearForm && nearForm.top < window.innerHeight * 0.6 && nearForm.bottom > 0;
      waFloat.classList.toggle('is-visible', y > heroEnd && !formVisible);
    }
  };

  /* Link ativo do menu conforme a seção visível */
  const navLinks = $$('.nav__list a');
  const sectionIds = navLinks.map((a) => a.getAttribute('href').slice(1));
  if ('IntersectionObserver' in window) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => {
          if (a.getAttribute('href') === `#${entry.target.id}`) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sectionIds.forEach((id) => { const s = document.getElementById(id); if (s) navIO.observe(s); });
  }

  /* ---------- Menu mobile ---------- */
  const toggle = $('[data-menu-toggle]');
  const menu = $('[data-mobile-menu]');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.menu-toggle__label').textContent = open ? 'Fechar' : 'Menu';
    header.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
      menu.querySelector('a')?.focus({ preventScroll: true });
    } else {
      menu.classList.remove('is-open');
      setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, reduceMotion.matches ? 0 : 500);
    }
  };
  if (toggle && menu) {
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 1100px)').addEventListener('change', (m) => { if (m.matches) setMenu(false); });
  }

  /* ---------- Reveal no scroll ---------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Contadores ---------- */
  const counters = $$('[data-count]');
  const fmt = (n, d) => n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    if (reduceMotion.matches) { el.textContent = fmt(target, dec); return; }
    const dur = 1800;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(target * eased, dec);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------- Parallax discreto + progresso da jornada ---------- */
  const parallaxEls = $$('[data-parallax]');
  const journey = $('[data-journey]');
  const journeyFill = $('[data-journey-fill]');
  const steps = $$('[data-step]');
  let ticking = false;

  const onFrame = () => {
    ticking = false;
    const vh = window.innerHeight;
    onScrollHeader();

    if (!reduceMotion.matches) {
      parallaxEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        const speed = parseFloat(el.dataset.parallax) || 0.05;
        const limit = r.height * 0.07; // nunca passa da margem de sangria (8%)
        const offset = Math.max(-limit, Math.min(limit, (r.top + r.height / 2 - vh / 2) * speed));
        el.style.setProperty('--py', `${offset.toFixed(1)}px`);
      });
    }

    if (journey) {
      const r = journey.getBoundingClientRect();
      const anchor = vh * 0.6;
      const p = Math.min(1, Math.max(0, (anchor - r.top) / r.height));
      journeyFill.style.setProperty('--p', p.toFixed(3));
      steps.forEach((s) => {
        if (s.getBoundingClientRect().top < anchor) s.classList.add('is-active');
      });
    }
  };
  const requestFrame = () => { if (!ticking) { ticking = true; requestAnimationFrame(onFrame); } };
  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', requestFrame, { passive: true });
  onFrame();

  /* ---------- Modalidades: imagem acompanha o item ---------- */
  const services = $$('[data-service]');
  const serviceImgs = $$('[data-service-img]');
  const activateService = (i) => {
    services.forEach((s) => s.classList.toggle('is-active', s.dataset.service === i));
    serviceImgs.forEach((img) => img.classList.toggle('is-active', img.dataset.serviceImg === i));
  };
  services.forEach((s) => {
    s.addEventListener('mouseenter', () => activateService(s.dataset.service));
    s.addEventListener('focusin', () => activateService(s.dataset.service));
  });

  /* "Saiba mais" pré-seleciona a modalidade no formulário */
  $$('[data-modalidade]').forEach((a) => {
    a.addEventListener('click', () => {
      const radio = $(`input[name="modalidade"][value="${a.dataset.modalidade}"]`);
      if (radio) radio.checked = true;
    });
  });

  /* ---------- Slider de depoimentos ---------- */
  const slider = $('[data-slider]');
  const prev = $('[data-slider-prev]');
  const next = $('[data-slider-next]');
  if (slider && prev && next) {
    const stepSize = () => (slider.querySelector('.quote')?.getBoundingClientRect().width || 300) + 24;
    const behavior = () => (reduceMotion.matches ? 'auto' : 'smooth');
    prev.addEventListener('click', () => slider.scrollBy({ left: -stepSize(), behavior: behavior() }));
    next.addEventListener('click', () => slider.scrollBy({ left: stepSize(), behavior: behavior() }));
    const updateNav = () => {
      const max = slider.scrollWidth - slider.clientWidth - 4;
      prev.disabled = slider.scrollLeft <= 4;
      next.disabled = slider.scrollLeft >= max;
      $('.slider-nav').style.visibility = max <= 0 ? 'hidden' : '';
    };
    slider.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav, { passive: true });
    updateNav();
  }

  /* ---------- Lightbox ---------- */
  const dialog = $('[data-lightbox-dialog]');
  const items = $$('[data-lightbox]');
  if (dialog && items.length && typeof dialog.showModal === 'function') {
    const stage = $('[data-lightbox-stage]', dialog);
    const title = $('[data-lightbox-title]', dialog);
    const meta = $('[data-lightbox-meta]', dialog);
    const count = $('[data-lightbox-count]', dialog);
    const link = $('[data-lightbox-link]', dialog);
    let current = 0;
    let lastFocus = null;

    const render = (i) => {
      current = (i + items.length) % items.length;
      const btn = items[current];
      const src = btn.querySelector('.ph');
      const clone = src.cloneNode(true);
      clone.removeAttribute('data-reveal');
      clone.style.removeProperty('--py');
      const img = clone.querySelector('img');
      if (img) {
        if (img.dataset.full) img.src = img.dataset.full;
        img.removeAttribute('loading');
        img.removeAttribute('srcset');
        img.sizes = '100vw';
      }
      const r = src.getBoundingClientRect();
      clone.classList.toggle('is-portrait', r.height > r.width);
      stage.replaceChildren(clone);
      title.textContent = btn.dataset.title || '';
      meta.textContent = btn.dataset.meta || '';
      count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
      if (btn.dataset.href) { link.href = btn.dataset.href; link.hidden = false; } else { link.hidden = true; }
    };

    items.forEach((btn, i) => btn.addEventListener('click', () => {
      lastFocus = btn;
      render(i);
      dialog.showModal();
      document.body.classList.add('menu-open');
    }));
    $('[data-lightbox-prev]', dialog).addEventListener('click', () => render(current - 1));
    $('[data-lightbox-next]', dialog).addEventListener('click', () => render(current + 1));
    $('[data-lightbox-close]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      document.body.classList.remove('menu-open');
      lastFocus?.focus({ preventScroll: true });
    });
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') render(current - 1);
      if (e.key === 'ArrowRight') render(current + 1);
    });
    dialog.addEventListener('click', (e) => { if (e.target === stage) dialog.close(); });

    let touchX = null;
    stage.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) render(current + (dx < 0 ? 1 : -1));
      touchX = null;
    }, { passive: true });
  }

  /* ---------- Formulário ---------- */
  const form = $('[data-form]');
  if (form) {
    const done = $('[data-form-done]');
    const doneText = $('[data-form-done-text]');
    const doneWa = $('[data-form-wa]');
    const status = $('.form__status', form);
    const submitBtn = $('button[type="submit"]', form);

    // Máscara de telefone brasileiro
    const phone = $('[data-mask="phone"]', form);
    phone?.addEventListener('input', () => {
      let d = phone.value.replace(/\D/g, '');
      if (d.startsWith('55') && d.length > 11) d = d.slice(2);
      d = d.slice(0, 11);
      let out = d;
      if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
      if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
      phone.value = out;
    });

    const rules = {
      nome: (v) => (v.trim().length >= 2 ? '' : 'Conte-nos como podemos te chamar.'),
      whatsapp: (v) => (v.replace(/\D/g, '').length >= 10 ? '' : 'Informe um WhatsApp com DDD.'),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Informe um e-mail válido.'),
      tipo: (v) => (v ? '' : 'Selecione o tipo de evento.')
    };

    const validateField = (name) => {
      const input = form.elements[name];
      if (!input || !rules[name]) return true;
      const msg = rules[name](input.value || '');
      const field = input.closest('.field');
      field.classList.toggle('has-error', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      const err = field.querySelector('.field__error');
      if (err) {
        if (!err.id) err.id = `${input.id}-erro`;
        err.textContent = msg;
        if (msg) input.setAttribute('aria-describedby', err.id); else input.removeAttribute('aria-describedby');
      }
      return !msg;
    };

    Object.keys(rules).forEach((name) => {
      const input = form.elements[name];
      input?.addEventListener('blur', () => { if (input.value) validateField(name); });
      input?.addEventListener('input', () => { if (input.closest('.field').classList.contains('has-error')) validateField(name); });
      input?.addEventListener('change', () => validateField(name));
    });

    const buildMessage = (d) => [
      `Olá, Rebecca! Meu nome é ${d.nome}.`,
      '',
      `Tipo de evento: ${d.tipo}`,
      d.data ? `Data prevista: ${d.data}` : null,
      d.local ? `Local: ${d.local}` : null,
      d.convidados ? `Convidados: ${d.convidados}` : null,
      `Modalidade de interesse: ${d.modalidade || 'Ainda não sei'}`,
      d.mensagem ? `\nSobre o evento: ${d.mensagem}` : null,
      '',
      `Contato: ${d.whatsapp} · ${d.email}`
    ].filter((l) => l !== null).join('\n');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fields = Object.keys(rules);
      const invalid = fields.filter((n) => !validateField(n));
      if (invalid.length) {
        form.elements[invalid[0]].focus();
        status.textContent = 'Revise os campos destacados para continuar.';
        return;
      }
      if (form.elements.empresa?.value) return; // honeypot

      const data = Object.fromEntries(new FormData(form).entries());
      delete data.empresa;
      const message = buildMessage(data);
      doneWa.href = waLink(message);
      status.textContent = '';

      if (CFG.formEndpoint) {
        submitBtn.disabled = true;
        status.textContent = 'Enviando…';
        try {
          const res = await fetch(CFG.formEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ ...data, origem: 'site' })
          });
          if (!res.ok) throw new Error(String(res.status));
          doneText.textContent = 'Recebemos sua mensagem e a equipe vai responder em breve. Se preferir, você também pode continuar a conversa agora pelo WhatsApp.';
        } catch (err) {
          doneText.textContent = 'Não conseguimos enviar pelo site agora — mas sua mensagem já está pronta para seguir pelo WhatsApp.';
        } finally {
          submitBtn.disabled = false;
          status.textContent = '';
        }
      }

      track('generate_lead', { event_type: data.tipo, modalidade: data.modalidade });
      form.hidden = true;
      done.hidden = false;
      done.focus({ preventScroll: true });
      done.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'center' });
    });
  }

  /* ---------- Carregar métricas após a página ficar ociosa ---------- */
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500));
  window.addEventListener('load', () => idle(loadAnalytics));
})();

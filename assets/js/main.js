/* ==========================================================================
   Rebecca Gemaque — interações
   GSAP + ScrollTrigger + SplitText + Lenis (carregados por CDN).
   Se as bibliotecas não carregarem, o site continua completo e legível.
   Tudo respeita prefers-reduced-motion.
   ========================================================================== */
(() => {
  'use strict';

  const CFG = window.SITE_CONFIG || {};
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const G = window.gsap;
  const ST = window.ScrollTrigger;
  const Split = window.SplitText;
  const hasGSAP = !!(G && ST) && !reduce;
  const pad = (n) => String(n).padStart(2, '0');
  const waNumber = CFG.whatsapp || '5521999811992';
  const waLink = (text) => `https://wa.me/${waNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

  if (hasGSAP) {
    G.registerPlugin(ST);
    if (Split) G.registerPlugin(Split);
    root.classList.add('has-gsap');
  }

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

  /* ---------- Ano dinâmico / WhatsApp ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  const waFloat = $('[data-wa-float]');
  if (waFloat && CFG.whatsappGreeting) waFloat.href = waLink(CFG.whatsappGreeting);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="wa.me"]');
    if (a) track('contact_whatsapp', { location: a.hasAttribute('data-wa-float') ? 'floating' : 'inline' });
  });

  /* ==========================================================================
     ROLAGEM SUAVE (Lenis)
     ========================================================================== */
  let lenis = null;
  if (hasGSAP && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ST.update);
    G.ticker.add((t) => lenis.raf(t * 1000));
    G.ticker.lagSmoothing(0);
  }
  const header = $('[data-header]');
  const headerOffset = () => (header ? header.offsetHeight : 0);
  const scrollToTarget = (target) => {
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: target.id === 'inicio' ? 0 : -headerOffset() + 1, duration: 1.4 });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  /* ==========================================================================
     MENU EM TELA CHEIA
     ========================================================================== */
  const menu = $('[data-menu]');
  const toggle = $('[data-menu-toggle]');
  let menuOpen = false;
  const setInert = (on) => { ['main', '.footer'].forEach((s) => { const el = $(s); if (el) el.inert = on; }); };
  const openMenu = () => {
    if (!menu) return;
    menuOpen = true;
    menu.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
    toggle.setAttribute('aria-expanded', 'true');
    header.classList.add('is-menu');
    document.body.classList.add('is-locked');
    lenis?.stop();
    setInert(true);
    setTimeout(() => menu.querySelector('.menu__nav a')?.focus({ preventScroll: true }), 400);
  };
  const closeMenu = () => {
    if (!menu || !menuOpen) return;
    menuOpen = false;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    header.classList.remove('is-menu');
    document.body.classList.remove('is-locked');
    lenis?.start();
    setInert(false);
    setTimeout(() => { if (!menuOpen) menu.hidden = true; }, reduce ? 0 : 900);
  };
  toggle?.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) { closeMenu(); toggle.focus(); } });
  const previews = $$('.menu__preview img');
  $$('[data-menu-img]').forEach((a) => {
    const show = () => previews.forEach((img, i) => img.classList.toggle('is-active', i === +a.dataset.menuImg));
    a.addEventListener('mouseenter', show);
    a.addEventListener('focus', show);
  });

  /* Links internos: rolagem suave + fecha o menu */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const modal = a.dataset.modalidade;
    if (modal) { const r = $(`input[name="modalidade"][value="${modal}"]`); if (r) r.checked = true; }
    if (menuOpen) { closeMenu(); setTimeout(() => scrollToTarget(target), 350); } else scrollToTarget(target);
    if (history.replaceState) history.replaceState(null, '', `#${id}`);
  });

  /* ==========================================================================
     HEADER, PROGRESSO E WHATSAPP
     ========================================================================== */
  const hero = $('.hero');
  const progress = $('[data-progress]');
  const contact = $('#contato');
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (header && !header.hasAttribute('data-header-solid')) {
      header.classList.toggle('is-scrolled', y > 40);
      if (!menuOpen) header.classList.toggle('is-hidden', y > 500 && y > lastY + 2);
      if (y < lastY - 2) header.classList.remove('is-hidden');
    }
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    }
    if (waFloat) {
      const heroEnd = hero ? hero.offsetHeight * 0.7 : 400;
      const r = contact?.getBoundingClientRect();
      const formVisible = r && r.top < window.innerHeight * 0.6 && r.bottom > 0;
      waFloat.classList.toggle('is-visible', y > heroEnd && !formVisible);
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ==========================================================================
     HERO — slideshow automático (pausa fora da tela)
     ========================================================================== */
  const slides = $$('.hero__slide');
  const bars = $$('[data-hero-bars] button');
  const heroCaption = $('[data-hero-caption]');
  const heroCount = $('[data-hero-count]');
  let slide = 0;
  const goSlide = (n) => {
    if (!slides.length) return;
    slides[slide].classList.remove('is-active');
    bars[slide]?.classList.remove('is-active');
    slide = (n + slides.length) % slides.length;
    const next = slides[(slide + 1) % slides.length].querySelector('img');
    if (next) next.loading = 'eager';
    const img = slides[slide].querySelector('img');
    if (img) img.loading = 'eager';
    slides[slide].classList.add('is-active');
    bars.forEach((b, k) => b.classList.toggle('is-done', k < slide));
    const bar = bars[slide];
    if (bar) { void bar.offsetWidth; bar.classList.add('is-active'); }
    if (heroCaption) heroCaption.textContent = slides[slide].dataset.caption || '';
    if (heroCount) heroCount.textContent = pad(slide + 1);
  };
  if (hero && slides.length > 1) {
    hero.style.setProperty('--slide-dur', '6.5s');
    hero.classList.add('is-paused');
    bars.forEach((b, k) => b.addEventListener('click', () => goSlide(k)));
    if (!reduce) {
      bars.forEach((b) => b.querySelector('span')?.addEventListener('animationend', () => { if (b.classList.contains('is-active')) goSlide(slide + 1); }));
      const io = new IntersectionObserver(([en]) => hero.classList.toggle('is-paused', !en.isIntersecting || document.hidden), { threshold: 0.2 });
      document.addEventListener('visibilitychange', () => hero.classList.toggle('is-paused', document.hidden));
      window.addEventListener('rg:intro-done', () => { hero.classList.remove('is-paused'); io.observe(hero); }, { once: true });
    }
    // deslizar no celular troca a foto
    let sx = 0; let sy = 0;
    hero.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    hero.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) goSlide(slide + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* ==========================================================================
     TELA DE ABERTURA + ENTRADA DO HERO
     ========================================================================== */
  const introDone = () => window.dispatchEvent(new Event('rg:intro-done'));
  const loader = $('[data-loader]');
  let seenIntro = false;
  try { seenIntro = sessionStorage.getItem('rg-intro') === '1'; sessionStorage.setItem('rg-intro', '1'); } catch (e) { /* sem storage */ }

  const buildHeroIntro = () => {
    const tl = G.timeline({ paused: true, defaults: { ease: 'expo.out' } });
    const title = $('[data-hero-title]');
    if (title && Split) {
      const s = Split.create(title, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
      tl.from(s.lines, { yPercent: 110, duration: 1.5, stagger: 0.12 }, 0.1);
    } else if (title) {
      tl.from(title, { opacity: 0, y: 30, duration: 1.2 }, 0.1);
    }
    tl.from('[data-hero-in]', { opacity: 0, y: 26, duration: 1.2, stagger: 0.12, ease: 'power3.out' }, 0.45)
      .from('.hero__media', { scale: 1.12, duration: 2.4 }, 0);
    return tl;
  };

  const startIntro = () => {
    if (!hasGSAP) { root.classList.add('no-intro'); introDone(); return; }
    const heroTl = hero ? buildHeroIntro() : null;
    const playHero = () => { heroTl?.play(); introDone(); };
    if (!loader || seenIntro || root.classList.contains('no-intro')) { loader?.remove(); playHero(); return; }

    lenis?.stop();
    const name = $('[data-loader-name]');
    let chars = [name];
    if (Split && name) chars = Split.create(name, { type: 'chars', mask: 'chars' }).chars;
    G.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => { loader.remove(); lenis?.start(); } })
      .set('.loader__inner', { opacity: 1 })
      .from(chars, { yPercent: 110, duration: 1, stagger: 0.03 })
      .from('[data-loader-tag]', { opacity: 0, y: 10, duration: 0.7 }, '-=0.6')
      .to('[data-loader-bar]', { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, '-=0.4')
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, '+=0.05')
      .add(playHero, '-=0.55');
  };

  /* ==========================================================================
     ANIMAÇÕES DE ROLAGEM (GSAP)
     ========================================================================== */
  const setupScrollAnimations = () => {
    if (!hasGSAP) return;

    // Títulos: linhas sobem de dentro de uma máscara
    $$('[data-split]').forEach((el) => {
      if (!Split) { G.from(el, { opacity: 0, y: 40, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }); return; }
      Split.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
        onSplit: (self) => G.from(self.lines, { yPercent: 108, duration: 1.3, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      });
    });

    // Frases que "acendem" palavra por palavra conforme a rolagem
    $$('[data-scrub-words]').forEach((el) => {
      if (!Split) return;
      const s = Split.create(el, { type: 'words', wordsClass: 'scrub-word' });
      G.to(s.words, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: true } });
    });

    // Blocos de texto
    G.set('[data-reveal]', { opacity: 0, y: 40 });
    ST.batch('[data-reveal]', {
      start: 'top 90%', once: true,
      onEnter: (batch) => G.to(batch, { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: 'power3.out', overwrite: true })
    });

    // Imagens: cortina de baixo para cima
    $$('[data-reveal-img]').forEach((el) => {
      const img = el.querySelector('img');
      const tl = G.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', clearProps: 'clipPath' });
      if (img && !img.hasAttribute('data-parallax')) tl.from(img, { scale: 1.3, duration: 2, ease: 'expo.out', clearProps: 'transform' }, 0.1);
    });

    // Parallax discreto
    $$('[data-parallax]').forEach((img) => {
      const amt = Math.min(Math.abs(parseFloat(img.dataset.parallax) || 8), 12) / 2 * Math.sign(parseFloat(img.dataset.parallax) || 1);
      G.fromTo(img, { yPercent: -amt }, { yPercent: amt, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Linhas finas que crescem
    $$('[data-line]').forEach((el) => G.from(el, { scaleY: 0, transformOrigin: 'top', duration: 1.8, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));

    // Hero: conteúdo sobe e esmaece ao rolar
    if (hero) {
      G.to('.hero__content', { yPercent: -18, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      G.to('.hero__media', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    }

    // Modalidades: a foto acompanha o item em foco durante a rolagem
    $$('[data-service]').forEach((s) => ST.create({ trigger: s, start: 'top 55%', end: 'bottom 55%', onToggle: (self) => { if (self.isActive) activateService(s.dataset.service); } }));

    // Jornada: linha de progresso e etapas
    const journey = $('[data-journey]');
    if (journey) {
      ST.create({
        trigger: journey, start: 'top 60%', end: 'bottom 60%', scrub: true,
        onUpdate: (self) => $('[data-journey-fill]').style.setProperty('--p', self.progress.toFixed(3))
      });
      $$('[data-step]').forEach((st) => ST.create({ trigger: st, start: 'top 62%', onEnter: () => st.classList.add('is-active'), onLeaveBack: () => st.classList.remove('is-active') }));
    }

    // Letreiro do rodapé
    const word = $('[data-footer-word]');
    if (word && Split) {
      const s = Split.create(word, { type: 'chars', mask: 'chars' });
      G.from(s.chars, { yPercent: 105, duration: 1.2, stagger: 0.035, ease: 'expo.out', scrollTrigger: { trigger: word, start: 'top 95%', once: true } });
    }

    // Portfólio horizontal (desktop)
    const section = $('[data-hscroll]');
    const trackEl = $('[data-hscroll-track]');
    const countEl = $('[data-hscroll-count]');
    const hint = $('[data-hint-text]');
    if (section && trackEl) {
      const items = $$('.gallery__item', trackEl);
      const mm = G.matchMedia();
      mm.add('(min-width: 900px)', () => {
        root.classList.add('has-hscroll');
        if (hint) hint.textContent = 'Role para ver';
        const dist = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);
        const tween = G.to(trackEl, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: {
            trigger: section, pin: true, start: 'top top', end: () => `+=${dist()}`, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
            onUpdate: (self) => { if (countEl) countEl.textContent = pad(Math.min(items.length, Math.round(self.progress * (items.length - 1)) + 1)); }
          }
        });
        // leve movimento das fotos dentro das molduras
        items.forEach((it) => {
          const img = it.querySelector('img');
          if (img) G.fromTo(img, { xPercent: -6, scale: 1.12 }, { xPercent: 6, scale: 1.12, ease: 'none', scrollTrigger: { trigger: it, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
        });
        return () => { root.classList.remove('has-hscroll'); if (hint) hint.textContent = 'Deslize para ver'; };
      });
    }

    window.addEventListener('load', () => ST.refresh());
  };

  /* Contador do portfólio no celular (rolagem nativa) */
  const galleryTrack = $('[data-hscroll-track]');
  if (galleryTrack) {
    const countEl = $('[data-hscroll-count]');
    const items = $$('.gallery__item', galleryTrack);
    galleryTrack.addEventListener('scroll', () => {
      if (root.classList.contains('has-hscroll')) return;
      const x = galleryTrack.scrollLeft + 10;
      let idx = 0;
      items.forEach((it, i) => { if (it.offsetLeft - galleryTrack.offsetLeft <= x + 40) idx = i; });
      if (countEl) countEl.textContent = pad(idx + 1);
    }, { passive: true });
  }

  /* ---------- Modalidades ---------- */
  const services = $$('[data-service]');
  const serviceImgs = $$('[data-service-img]');
  function activateService(i) {
    services.forEach((s) => s.classList.toggle('is-active', s.dataset.service === i));
    serviceImgs.forEach((img) => img.classList.toggle('is-active', img.dataset.serviceImg === i));
  }
  services.forEach((s) => {
    s.addEventListener('mouseenter', () => activateService(s.dataset.service));
    s.addEventListener('focusin', () => activateService(s.dataset.service));
  });

  /* ---------- Jornada sem GSAP ---------- */
  if (!hasGSAP) {
    const journey = $('[data-journey]');
    const fill = $('[data-journey-fill]');
    const steps = $$('[data-step]');
    const upd = () => {
      if (!journey) return;
      const r = journey.getBoundingClientRect();
      const anchor = window.innerHeight * 0.6;
      fill.style.setProperty('--p', Math.min(1, Math.max(0, (anchor - r.top) / r.height)).toFixed(3));
      steps.forEach((s) => { if (s.getBoundingClientRect().top < anchor) s.classList.add('is-active'); });
    };
    window.addEventListener('scroll', upd, { passive: true });
    upd();
  }

  /* ==========================================================================
     FAIXA DE CATEGORIAS (duplica o conteúdo para o loop infinito)
     ========================================================================== */
  const ticker = $('[data-ticker]');
  if (ticker) ticker.innerHTML += ticker.innerHTML;

  /* ==========================================================================
     CARROSSEL AUTOMÁTICO ARRASTÁVEL (Instagram)
     ========================================================================== */
  class Drift {
    constructor(el) {
      this.el = el;
      this.track = el.querySelector('[data-drift-track]');
      this.base = reduce ? 0 : parseFloat(el.dataset.speed) || 0.5;
      this.x = 0; this.v = this.base; this.dragging = false; this.hover = false; this.visible = false;
      this.build();
      this.bind();
      new IntersectionObserver(([en]) => { this.visible = en.isIntersecting; }).observe(el);
      let last = performance.now();
      const tick = (now) => {
        const dt = Math.min(64, now - last) / 16.67; last = now;
        if (this.visible && !this.dragging) {
          const target = this.hover ? 0 : this.base;
          this.v += (target - this.v) * 0.04;
          this.x -= this.v * dt;
        }
        this.render();
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
    build() {
      const orig = Array.from(this.track.children);
      const cloneSet = () => orig.forEach((n) => { const c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.querySelectorAll('img').forEach((i) => { i.alt = ''; }); this.track.appendChild(c); });
      let guard = 0;
      while (this.track.scrollWidth < this.el.clientWidth * 1.3 && guard++ < 8) cloneSet();
      const setCount = this.track.children.length;
      Array.from(this.track.children).slice(0, setCount).forEach((n) => { const c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.querySelectorAll('img').forEach((i) => { i.alt = ''; }); this.track.appendChild(c); });
      this.setCount = setCount;
      this.measure();
      window.addEventListener('resize', () => this.measure());
    }
    measure() {
      const first = this.track.children[0];
      const dup = this.track.children[this.setCount];
      this.w = dup && first ? dup.offsetLeft - first.offsetLeft : this.track.scrollWidth / 2;
    }
    render() {
      if (!this.w) return;
      this.x = ((this.x % this.w) - this.w) % this.w;
      this.track.style.transform = `translate3d(${this.x.toFixed(2)}px,0,0)`;
    }
    bind() {
      let lastX = 0; let lastT = 0; let startX = 0; let startY = 0; let decided = false; let horizontal = false;
      this.el.addEventListener('pointerdown', (e) => {
        this.dragging = true; decided = e.pointerType === 'mouse'; horizontal = decided;
        startX = lastX = e.clientX; startY = e.clientY; lastT = performance.now();
        if (decided) { this.el.setPointerCapture(e.pointerId); this.el.classList.add('is-dragging'); }
      });
      this.el.addEventListener('pointermove', (e) => {
        if (!this.dragging) return;
        if (!decided) {
          const dx = Math.abs(e.clientX - startX); const dy = Math.abs(e.clientY - startY);
          if (dx + dy < 6) return;
          decided = true; horizontal = dx > dy;
          if (!horizontal) { this.dragging = false; return; }
          this.el.setPointerCapture(e.pointerId); this.el.classList.add('is-dragging');
        }
        if (!horizontal) return;
        const now = performance.now();
        const dx = e.clientX - lastX;
        this.x += dx;
        this.v = -dx / Math.max(1, (now - lastT) / 16.67);
        lastX = e.clientX; lastT = now;
      });
      const end = () => { this.dragging = false; this.el.classList.remove('is-dragging'); };
      this.el.addEventListener('pointerup', end);
      this.el.addEventListener('pointercancel', end);
      this.el.addEventListener('lostpointercapture', end);
      if (finePointer) {
        this.el.addEventListener('mouseenter', () => { this.hover = true; });
        this.el.addEventListener('mouseleave', () => { this.hover = false; });
      }
      if (this.el.hasAttribute('role')) {
        this.el.tabIndex = 0;
        this.el.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight') { this.x -= 240; e.preventDefault(); }
          if (e.key === 'ArrowLeft') { this.x += 240; e.preventDefault(); }
        });
      }
    }
  }
  $$('[data-drift]').forEach((el) => new Drift(el));

  /* ==========================================================================
     DEPOIMENTOS — passam sozinhos, pausam ao tocar/passar o mouse
     ========================================================================== */
  const slider = $('[data-slider]');
  if (slider) {
    const prev = $('[data-slider-prev]');
    const next = $('[data-slider-next]');
    const bar = $('[data-slider-progress]');
    const INTERVAL = 6500;
    let elapsed = 0; let paused = false; let visible = false; let resumeTimer;
    const step = () => (slider.querySelector('.quote')?.getBoundingClientRect().width || 300) + parseFloat(getComputedStyle(slider).columnGap || 16);
    const behavior = reduce ? 'auto' : 'smooth';
    const goNext = () => {
      const max = slider.scrollWidth - slider.clientWidth - 4;
      if (slider.scrollLeft >= max) slider.scrollTo({ left: 0, behavior });
      else slider.scrollBy({ left: step(), behavior });
      elapsed = 0;
    };
    const goPrev = () => {
      if (slider.scrollLeft <= 4) slider.scrollTo({ left: slider.scrollWidth, behavior });
      else slider.scrollBy({ left: -step(), behavior });
      elapsed = 0;
    };
    next?.addEventListener('click', goNext);
    prev?.addEventListener('click', goPrev);
    const pause = () => { paused = true; clearTimeout(resumeTimer); };
    const resumeLater = (ms = 4000) => { clearTimeout(resumeTimer); resumeTimer = setTimeout(() => { paused = false; }, ms); };
    if (finePointer) { slider.addEventListener('mouseenter', pause); slider.addEventListener('mouseleave', () => resumeLater(800)); }
    slider.addEventListener('touchstart', pause, { passive: true });
    slider.addEventListener('touchend', () => resumeLater(), { passive: true });
    slider.addEventListener('focusin', pause);
    slider.addEventListener('focusout', () => resumeLater());

    // arrastar com o mouse
    if (finePointer) {
      let down = false; let sx = 0; let sl = 0; let moved = false;
      slider.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = slider.scrollLeft; slider.style.scrollSnapType = 'none'; slider.style.cursor = 'grabbing'; });
      window.addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; slider.scrollLeft = sl - dx; });
      window.addEventListener('pointerup', () => {
        if (!down) return; down = false; slider.style.cursor = '';
        const s = step(); const target = Math.round(slider.scrollLeft / s) * s;
        slider.scrollTo({ left: target, behavior });
        setTimeout(() => { slider.style.scrollSnapType = ''; }, 500);
        if (moved) elapsed = 0;
      });
    }

    if (!reduce) {
      new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0.3 }).observe(slider);
      let last = performance.now();
      const loop = (now) => {
        const dt = now - last; last = now;
        if (visible && !paused && !document.hidden) {
          elapsed += dt;
          if (elapsed >= INTERVAL) goNext();
        }
        if (bar) bar.style.transform = `scaleX(${Math.min(1, elapsed / INTERVAL)})`;
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  /* ---------- Contadores ---------- */
  const fmt = (n, d) => n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    if (reduce) { el.textContent = fmt(target, dec); return; }
    const t0 = performance.now();
    const stepFn = (t) => {
      const p = Math.min(1, (t - t0) / 1800);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 4)), dec);
      if (p < 1) requestAnimationFrame(stepFn);
    };
    requestAnimationFrame(stepFn);
  };
  const cio = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); } }), { threshold: 0.6 });
  $$('[data-count]').forEach((c) => cio.observe(c));

  /* ---------- FAQ com abertura suave ---------- */
  $$('.acc').forEach((d) => {
    const summary = d.querySelector('summary');
    const body = d.querySelector('.acc__body');
    if (!summary || !body || reduce || !body.animate) return;
    let anim = null;
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      anim?.cancel();
      if (d.open) {
        const h = body.offsetHeight;
        anim = body.animate([{ height: `${h}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 450, easing: 'cubic-bezier(.22,.61,.36,1)' });
        anim.onfinish = () => { d.open = false; ST?.refresh(); };
      } else {
        d.open = true;
        const h = body.offsetHeight;
        anim = body.animate([{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 550, easing: 'cubic-bezier(.16,1,.3,1)' });
        anim.onfinish = () => ST?.refresh();
      }
    });
  });

  /* ---------- Botões magnéticos ---------- */
  if (hasGSAP && finePointer) {
    $$('[data-magnetic]').forEach((btn) => {
      const xTo = G.quickTo(btn, 'x', { duration: 0.6, ease: 'power3' });
      const yTo = G.quickTo(btn, 'y', { duration: 0.6, ease: 'power3' });
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.25);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      });
      btn.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- Cursor personalizado ---------- */
  const cursor = $('[data-cursor]');
  if (cursor && finePointer && !reduce) {
    root.classList.add('has-cursor');
    const label = $('[data-cursor-label]');
    let x = -100; let y = -100; let cx = x; let cy = y;
    window.addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
    document.addEventListener('pointerenter', () => cursor.classList.remove('is-hidden'));
    const loop = () => {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
      cursor.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    document.addEventListener('pointerover', (e) => {
      const t = e.target;
      const labelled = t.closest('.gallery__btn') ? 'Ver' : t.closest('[data-drift], [data-slider]') ? 'Arraste' : '';
      const isLink = !labelled && t.closest('a, button, summary, label, [role="button"]');
      cursor.classList.toggle('is-label', !!labelled);
      cursor.classList.toggle('is-link', !!isLink);
      if (label) label.textContent = labelled;
    });
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
    let current = 0; let lastFocus = null;
    const render = (i) => {
      current = (i + items.length) % items.length;
      const btn = items[current];
      const src = btn.querySelector('img');
      const img = document.createElement('img');
      img.src = src?.dataset.full || src?.currentSrc || src?.src || '';
      img.alt = src?.alt || '';
      stage.replaceChildren(img);
      title.textContent = btn.dataset.title || '';
      meta.textContent = btn.dataset.meta || '';
      count.textContent = `${pad(current + 1)} / ${pad(items.length)}`;
      if (btn.dataset.href) { link.href = btn.dataset.href; link.hidden = false; } else link.hidden = true;
    };
    items.forEach((btn, i) => btn.addEventListener('click', () => {
      lastFocus = btn; render(i); dialog.showModal(); lenis?.stop(); document.body.classList.add('is-locked');
    }));
    $('[data-lightbox-prev]', dialog).addEventListener('click', () => render(current - 1));
    $('[data-lightbox-next]', dialog).addEventListener('click', () => render(current + 1));
    $('[data-lightbox-close]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => { lenis?.start(); document.body.classList.remove('is-locked'); lastFocus?.focus({ preventScroll: true }); });
    dialog.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') render(current - 1); if (e.key === 'ArrowRight') render(current + 1); });
    dialog.addEventListener('click', (e) => { if (e.target === stage) dialog.close(); });
    let tx = null;
    stage.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', (e) => {
      if (tx === null) return;
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) render(current + (dx < 0 ? 1 : -1));
      tx = null;
    }, { passive: true });
  }

  /* ==========================================================================
     FORMULÁRIO
     ========================================================================== */
  const form = $('[data-form]');
  if (form) {
    const done = $('[data-form-done]');
    const doneText = $('[data-form-done-text]');
    const doneWa = $('[data-form-wa]');
    const status = $('.form__status', form);
    const submitBtn = $('button[type="submit"]', form);

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
      const invalid = Object.keys(rules).filter((n) => !validateField(n));
      if (invalid.length) {
        form.elements[invalid[0]].focus();
        status.textContent = 'Revise os campos destacados para continuar.';
        return;
      }
      if (form.elements.empresa?.value) return;

      const data = Object.fromEntries(new FormData(form).entries());
      delete data.empresa;
      doneWa.href = waLink(buildMessage(data));
      status.textContent = '';

      if (CFG.formEndpoint) {
        submitBtn.disabled = true;
        status.textContent = 'Enviando…';
        try {
          const res = await fetch(CFG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...data, origem: 'site' }) });
          if (!res.ok) throw new Error(String(res.status));
          doneText.textContent = 'Recebemos sua mensagem e a equipe vai responder em breve. Se preferir, você também pode continuar a conversa agora pelo WhatsApp.';
        } catch (err) {
          doneText.textContent = 'Não conseguimos enviar pelo site agora, mas sua mensagem já está pronta para seguir pelo WhatsApp.';
        } finally {
          submitBtn.disabled = false;
          status.textContent = '';
        }
      }

      track('generate_lead', { event_type: data.tipo, modalidade: data.modalidade });
      form.hidden = true;
      done.hidden = false;
      done.focus({ preventScroll: true });
      if (lenis) lenis.scrollTo(done, { offset: -headerOffset() - 20 }); else done.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      ST?.refresh();
    });
  }

  /* ==========================================================================
     INÍCIO
     ========================================================================== */
  const boot = () => {
    try { setupScrollAnimations(); } catch (err) { console.error(err); }
    startIntro();
  };
  if (hasGSAP && document.fonts && document.fonts.ready) {
    // espera as fontes para quebrar as linhas no lugar certo (máx. 0,8 s)
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 800))]).then(boot);
  } else {
    boot();
  }

  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500));
  window.addEventListener('load', () => idle(loadAnalytics));
})();

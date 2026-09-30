(() => {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const whatsappFab = document.getElementById('whatsappFab');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // abertura: toque/tecla pula; o nó sai do DOM quando a cortina termina de subir
  const intro = document.getElementById('intro');
  const heroSection = document.querySelector('.hero');
  requestAnimationFrame(() => requestAnimationFrame(() => heroSection?.classList.add('is-ready')));
  if (intro && document.documentElement.classList.contains('no-intro')) intro.remove();
  if (intro?.isConnected) {
    intro.addEventListener('animationend', (e) => { if (e.animationName === 'intro-out') intro.remove(); });
    const skip = () => {
      if (!intro.isConnected || intro.classList.contains('is-skipping')) return;
      intro.classList.add('is-skipping');
      document.documentElement.style.setProperty('--intro-offset', '.45s');
      // transições já agendadas não relêem o novo atraso: volta o hero ao
      // estado inicial sem transição e o reanima com o atraso curto
      const heroEls = [...heroSection.querySelectorAll('[data-reveal]'), heroSection.querySelector('.hero-bg')];
      heroEls.forEach(el => { el.style.transition = 'none'; el.classList.remove('in-view'); });
      heroSection.classList.remove('is-ready');
      void heroSection.offsetHeight;
      heroEls.forEach(el => { el.style.transition = ''; });
      void heroSection.offsetHeight;
      heroEls.forEach(el => { if (el.hasAttribute('data-reveal')) el.classList.add('in-view'); });
      heroSection.classList.add('is-ready');
    };
    intro.addEventListener('click', skip);
    window.addEventListener('keydown', skip, { once: true });
  }

  // header shrink + whatsapp fab visibility on scroll
  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    header?.classList.toggle('scrolled', scrolled);
    whatsappFab?.classList.toggle('visible', window.scrollY > 300);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // mobile nav toggle
  navToggle?.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.classList.toggle('is-active', isOpen);
  });
  mainNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // scroll reveal
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // carrossel de avaliações: rolagem nativa com snap + botões anterior/próximo
  // (sem autoplay — o conteúdo só se move quando a pessoa pede)
  const track = document.getElementById('reviewsTrack');
  if (track) {
    const prev = document.querySelector('.reviews-controls [data-dir="-1"]');
    const next = document.querySelector('.reviews-controls [data-dir="1"]');
    const step = () => {
      const card = track.querySelector('.review-card');
      return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 20) : 360;
    };
    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
    };
    [prev, next].forEach(btn => btn?.addEventListener('click', () => {
      track.scrollBy({ left: step() * Number(btn.dataset.dir), behavior: 'smooth' });
    }));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
})();

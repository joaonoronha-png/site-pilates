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
      const heroEls = [...heroSection.querySelectorAll('[data-reveal], .hero-img, .hero-lines ellipse')];
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


  // auto-scrolling marquees (gallery, reviews) — smooth CSS animation by default,
  // hands control over to the finger/mouse while actively dragging, no per-frame JS work
  const initMarquee = (container, durationSec) => {
    const track = container.querySelector(':scope > *');
    if (!track) return;
    let dragging = false;
    let startX = 0;
    let startOffset = 0;
    let shift = 0; // exact px distance to the duplicated set (always positive)

    // The exact loop distance is where the duplicated (aria-hidden) items begin —
    // measuring it directly avoids rounding mismatches that a 50% guess can have
    // with flex gaps, which caused a visible snap once per cycle.
    const measure = () => {
      const firstDup = track.querySelector('[aria-hidden="true"]');
      shift = firstDup ? firstDup.offsetLeft : track.scrollWidth / 2;
      track.style.setProperty('--shift', `-${shift}px`);
    };
    measure();
    if (!shift) return;
    // force the animation to (re)start after --shift is set, so the keyframe's
    // end value is resolved correctly from the first cycle
    track.style.animation = 'none';
    void track.offsetHeight;
    track.style.animation = `marquee-scroll ${durationSec}s linear infinite`;

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measure, 200);
    });

    const currentX = () => new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
    const wrap = (x) => {
      let v = x % shift;
      if (v > 0) v -= shift;
      return v;
    };

    container.addEventListener('pointerdown', (e) => {
      dragging = true;
      startX = e.clientX;
      startOffset = currentX();
      track.style.animation = 'none';
      track.style.transform = `translateX(${startOffset}px)`;
      container.setPointerCapture?.(e.pointerId);
      container.style.cursor = 'grabbing';
    });
    container.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      track.style.transform = `translateX(${wrap(startOffset + (e.clientX - startX))}px)`;
    });
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      container.style.cursor = '';
      const elapsed = (-currentX() / shift) * durationSec;
      track.style.transform = '';
      track.style.animation = `marquee-scroll ${durationSec}s linear infinite`;
      track.style.animationDelay = `-${elapsed}s`;
    };
    container.addEventListener('pointerup', endDrag);
    container.addEventListener('pointercancel', endDrag);

    // pause on real mouse hover only — on touch devices a tap can leave a
    // synthetic :hover stuck "on", which is what made it look frozen after tapping
    container.addEventListener('mouseenter', () => { if (!dragging) track.style.animationPlayState = 'paused'; });
    container.addEventListener('mouseleave', () => { if (!dragging) track.style.animationPlayState = 'running'; });
  };

  document.querySelectorAll('.reviews-marquee').forEach(el => initMarquee(el, 50));
})();

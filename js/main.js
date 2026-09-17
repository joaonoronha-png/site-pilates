(() => {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const whatsappFab = document.getElementById('whatsappFab');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

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

  // animated stat counters
  const statEls = document.querySelectorAll('.stat-number');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const format = el.dataset.format;
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;

      if (format === 'year') {
        el.textContent = Math.round(value);
      } else if (format === 'decimal') {
        el.textContent = value.toFixed(1).replace('.', ',');
      } else {
        el.textContent = Math.round(value);
      }

      if (progress < 1) requestAnimationFrame(step);
      else {
        if (format === 'decimal') el.textContent = target.toFixed(1).replace('.', ',');
        else el.textContent = Math.round(target);
      }
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const statIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => statIo.observe(el));
  } else {
    statEls.forEach(animateCount);
  }

  // before/after drag-to-compare slider
  document.querySelectorAll('[data-ba-slider]').forEach((slider) => {
    const handle = slider.querySelector('[data-ba-handle]');
    let dragging = false;

    const setPos = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      slider.style.setProperty('--pos', pct + '%');
    };

    slider.addEventListener('pointerdown', (e) => {
      dragging = true;
      slider.setPointerCapture?.(e.pointerId);
      setPos(e.clientX);
    });
    slider.addEventListener('pointermove', (e) => { if (dragging) setPos(e.clientX); });
    slider.addEventListener('pointerup', () => { dragging = false; });
    slider.addEventListener('pointercancel', () => { dragging = false; });

    handle?.addEventListener('keydown', (e) => {
      const current = parseFloat(slider.style.getPropertyValue('--pos')) || 50;
      if (e.key === 'ArrowLeft') { slider.style.setProperty('--pos', Math.max(0, current - 5) + '%'); e.preventDefault(); }
      if (e.key === 'ArrowRight') { slider.style.setProperty('--pos', Math.min(100, current + 5) + '%'); e.preventDefault(); }
    });
  });

  // auto-scrolling marquees (gallery, reviews) — pause and let the user drag/swipe on touch
  const initMarquee = (container, pxPerSecond) => {
    const track = container.querySelector(':scope > *');
    if (!track) return;
    let paused = false;
    let resumeTimer = null;
    let lastTime = null;
    let half = track.scrollWidth / 2;

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { half = track.scrollWidth / 2; }, 200);
    });

    const step = (now) => {
      if (lastTime === null) lastTime = now;
      const dt = Math.min(now - lastTime, 100);
      lastTime = now;
      if (!paused && half > 0) {
        container.scrollLeft += (pxPerSecond * dt) / 1000;
        if (container.scrollLeft >= half) container.scrollLeft -= half;
      }
      requestAnimationFrame(step);
    };

    const pause = () => {
      paused = true;
      if (resumeTimer) clearTimeout(resumeTimer);
    };
    const scheduleResume = () => {
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { paused = false; lastTime = null; }, 1200);
    };

    container.addEventListener('pointerdown', pause);
    container.addEventListener('pointerup', scheduleResume);
    container.addEventListener('pointercancel', scheduleResume);
    container.addEventListener('mouseenter', pause);
    container.addEventListener('mouseleave', scheduleResume);
    container.addEventListener('scroll', () => {
      if (paused) scheduleResume();
    }, { passive: true });

    requestAnimationFrame(step);
  };

  document.querySelectorAll('.gallery-marquee').forEach(el => initMarquee(el, 110));
  document.querySelectorAll('.reviews-marquee').forEach(el => initMarquee(el, 42));
})();

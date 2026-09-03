(() => {
  'use strict';

  /* ---------- Config: single source of truth for links ---------- */
  const WHATSAPP_NUMBER = '5521993911879';
  const ADDRESS_TEXT = 'Rua Gildásio Amado, 55 - Sala 1113, Barra da Tijuca, Rio de Janeiro - RJ, 22631-020';
  const BUSINESS_QUERY = 'Pilates Tatiana Nobre, Rua Gildásio Amado, 55, Barra da Tijuca, Rio de Janeiro';

  const WA_MESSAGES = {
    agendar: 'Olá, Tatiana! Vi o site do Pilates Tatiana Nobre e gostaria de saber mais sobre as aulas.',
    comecar: 'Olá, Tatiana! Vi o site do Pilates Tatiana Nobre e gostaria de saber mais sobre as aulas.',
    wellhub: 'Olá, Tatiana! Vi o site do Pilates Tatiana Nobre e gostaria de saber mais sobre as aulas.',
    horario: 'Olá, Tatiana! Vi o site do Pilates Tatiana Nobre e gostaria de saber mais sobre as aulas.',
  };

  function waLink(key) {
    const msg = WA_MESSAGES[key] || WA_MESSAGES.agendar;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  const mapsOpenLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS_QUERY)}`;
  const mapsDirectionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS_TEXT)}`;
  const mapsReviewsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS_QUERY)}`;

  /* ---------- Wire up every link on the page ---------- */
  document.querySelectorAll('.js-wa').forEach((el) => {
    el.setAttribute('href', waLink(el.dataset.waMsg));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });
  document.querySelectorAll('.js-maps-open').forEach((el) => {
    el.setAttribute('href', mapsOpenLink);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });
  document.querySelectorAll('.js-maps-directions').forEach((el) => {
    el.setAttribute('href', mapsDirectionsLink);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });
  document.querySelectorAll('.js-maps-reviews').forEach((el) => {
    el.setAttribute('href', mapsReviewsLink);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
  // Hero content is above the fold on load: reveal it immediately rather than
  // waiting on the observer, so the first paint is never blank.
  document.querySelectorAll('.hero .reveal, .hero .reveal-scale').forEach((el) => el.classList.add('is-visible'));

  const revealEls = document.querySelectorAll('.reveal:not(.is-visible), .reveal-scale:not(.is-visible)');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const groups = new Map();
    revealEls.forEach((el) => {
      const parent = el.parentElement;
      const list = groups.get(parent) || [];
      list.push(el);
      groups.set(parent, list);
    });
    groups.forEach((list) => {
      list.forEach((el, i) => {
        el.style.setProperty('--reveal-delay', `${Math.min(i * 70, 280)}ms`);
      });
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });

    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

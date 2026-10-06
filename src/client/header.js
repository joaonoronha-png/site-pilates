/** Header dinâmico, intro, menu mobile e navegação ativa. */
import { reduced } from './motion.js';

export function mountIntro() {
  const intro = document.querySelector('.intro');
  if (!intro) return;
  const root = document.documentElement;
  if (root.classList.contains('intro-seen') || reduced()) {
    intro.remove();
    root.classList.add('intro-done');
    return;
  }
  try { sessionStorage.setItem('bcm-intro', '1'); } catch {}
  intro.classList.add('is-playing');
  setTimeout(() => {
    intro.classList.add('is-leaving');
    root.classList.add('intro-done');
  }, 1250);
  setTimeout(() => intro.remove(), 2000);
}

export function mountHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu fullscreen mobile
  const toggle = header.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.documentElement.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
      menu.querySelector('a')?.focus();
    } else {
      menu.classList.remove('is-open');
      setTimeout(() => (menu.hidden = true), reduced() ? 0 : 350);
    }
  };
  toggle?.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu?.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
  });

  // Link ativo conforme a seção visível
  const links = [...header.querySelectorAll('[data-nav]')];
  const sections = links.map((l) => document.getElementById(l.dataset.nav)).filter(Boolean);
  if (!sections.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        links.forEach((l) => (l.dataset.nav === e.target.id ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current')));
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((s) => io.observe(s));
}

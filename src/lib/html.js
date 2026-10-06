import { images } from '../data/site.js';

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ESC[c]);

/** Junta pedaços de template ignorando valores falsy. */
export const join = (parts) => parts.filter(Boolean).join('');

/**
 * <picture> responsivo com AVIF + WebP (800w e 1600w).
 * Todas as imagens ficam em /public/img/<key>-<largura>.<formato>.
 */
export function picture(key, { sizes = '100vw', className = '', loading = 'lazy', priority = false, alt } = {}) {
  const meta = images[key];
  if (!meta) throw new Error(`Imagem desconhecida: ${key}`);
  const set = (fmt) => `/img/${key}-800.${fmt} 800w, /img/${key}-1600.${fmt} 1600w`;
  return `<picture class="${esc(className)}">
    <source type="image/avif" srcset="${set('avif')}" sizes="${esc(sizes)}">
    <source type="image/webp" srcset="${set('webp')}" sizes="${esc(sizes)}">
    <img src="/img/${key}-800.webp" width="${meta.w}" height="${meta.h}" alt="${esc(alt ?? meta.alt)}" loading="${priority ? 'eager' : loading}" decoding="async"${priority ? ' fetchpriority="high"' : ''}>
  </picture>`;
}

const PATHS = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowDown: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  whatsapp: '<path d="M3.5 20.5l1.3-4A8.5 8.5 0 1 1 8 19.6z"/><path d="M9 9.2c0 3.2 2.6 5.8 5.8 5.8l1-1.4-2-1-1 .7a4 4 0 0 1-2-2l.7-1-1-2z"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
  chat: '<path d="M4 5h16v11H9l-5 4V5z"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  send: '<path d="M4 12l16-8-6 16-2.5-6.5z"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  chevronLeft: '<path d="M15 6l-6 6 6 6"/>',
  chevronRight: '<path d="M9 6l6 6-6 6"/>',
};

export const icon = (name, cls = '') =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${PATHS[name] ?? ''}</svg>`;

/** Marca BCM: três arcos concêntricos — as camadas da pele. */
export const logoMark = (cls = '') => `<svg class="logo-mark ${cls}" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
  <circle cx="24" cy="24" r="22.5" fill="none" stroke="currentColor" stroke-width="1.2" class="lm-ring"/>
  <path d="M10 21c4.5-3 9-4.5 14-4.5S33.5 18 38 21" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" class="lm-l1"/>
  <path d="M10 27c4.5-3 9-4.5 14-4.5S33.5 24 38 27" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" class="lm-l2"/>
  <path d="M13 33c3.6-2.4 7.2-3.5 11-3.5s7.4 1.1 11 3.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" class="lm-l3"/>
</svg>`;

export const logo = (cls = '') => `<span class="logo ${cls}">
  ${logoMark()}
  <span class="logo-text"><span class="logo-name">BCM</span><span class="logo-sub">Dermatologia<br>Especializada</span></span>
</span>`;

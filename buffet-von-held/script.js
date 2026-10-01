/* Buffet Von Held — interações */

// TODO: confirmar o número oficial com a empresa (formato: 55 + DDD + número, só dígitos).
const WHATSAPP = '5521000000000';

const waLink = (text) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

document.documentElement.classList.remove('no-js');
window.addEventListener('load', () => document.body.classList.add('loaded'));
setTimeout(() => document.body.classList.add('loaded'), 600);

/* Header ao rolar + botão flutuante */
const nav = document.getElementById('nav');
const waFloat = document.querySelector('.wa-float');
const onScroll = () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 60);
  waFloat.classList.toggle('show', y > window.innerHeight * 0.6);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Menu mobile */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const setMenu = (open) => {
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  document.body.style.overflow = open ? 'hidden' : '';
};
burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

/* Slideshow do hero */
const slides = document.querySelectorAll('.hero .slide');
const dots = document.querySelectorAll('.hero-dots i');
let current = 0;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (slides.length > 1 && !reduceMotion) {
  setInterval(() => {
    slides[current].classList.remove('is-active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('is-active');
    dots.forEach((d, i) => d.classList.toggle('on', i === current));
  }, 6000);
}

/* Reveal ao rolar */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealIO.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  // pequeno escalonamento para elementos irmãos
  const siblings = el.parentElement.querySelectorAll(':scope > .reveal');
  const idx = Array.prototype.indexOf.call(siblings, el);
  if (idx > 0) el.style.transitionDelay = `${Math.min(idx, 5) * 0.1}s`;
  revealIO.observe(el);
});

/* Contadores */
const countIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const start = performance.now();
    const dur = 1800;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals).replace('.', ',');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countIO.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach((el) => countIO.observe(el));

/* Abas do cardápio */
const tabs = document.querySelectorAll('.menu-tabs [role="tab"]');
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.setAttribute('aria-selected', t === tab));
    document.querySelectorAll('.menu-list').forEach((panel) => {
      const active = panel.dataset.panel === tab.dataset.tab;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
  });
});

/* Galeria + lightbox */
const items = [...document.querySelectorAll('.g-item')];
const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('img');
let lbIndex = 0;
let lastFocus = null;
const showLb = (i) => {
  lbIndex = (i + items.length) % items.length;
  lbImg.src = items[lbIndex].dataset.full;
  lbImg.alt = items[lbIndex].querySelector('img').alt;
};
const openLb = (i) => {
  lastFocus = document.activeElement;
  showLb(i);
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
  lb.querySelector('.lb-close').focus();
};
const closeLb = () => {
  lb.hidden = true;
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
};
items.forEach((item, i) => item.addEventListener('click', () => openLb(i)));
lb.querySelector('.lb-close').addEventListener('click', closeLb);
lb.querySelector('.lb-prev').addEventListener('click', () => showLb(lbIndex - 1));
lb.querySelector('.lb-next').addEventListener('click', () => showLb(lbIndex + 1));
lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', (e) => {
  if (lb.hidden) {
    if (e.key === 'Escape' && nav.classList.contains('open')) setMenu(false);
    return;
  }
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
  if (e.key === 'ArrowRight') showLb(lbIndex + 1);
});

/* Links diretos de WhatsApp */
document.querySelectorAll('.js-wa').forEach((a) => {
  a.href = waLink(a.dataset.msg || 'Olá! Vim pelo site e gostaria de um orçamento para o meu evento no Buffet Von Held.');
  a.target = '_blank';
  a.rel = 'noopener';
});

/* Formulário → WhatsApp */
const form = document.getElementById('quoteForm');

// links como "Orçamento de casamento" já deixam o tipo de evento selecionado
document.querySelectorAll('[data-evento]').forEach((a) => {
  a.addEventListener('click', () => { form.tipo.value = a.dataset.evento; });
});
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = form.nome.value.trim();
  const tipo = form.tipo.value;
  form.nome.classList.toggle('invalid', !nome);
  form.tipo.classList.toggle('invalid', !tipo);
  if (!nome || !tipo) {
    note.textContent = 'Preencha seu nome e o tipo de evento, por favor.';
    (!nome ? form.nome : form.tipo).focus();
    return;
  }
  let data = '';
  if (form.data.value) {
    const [y, m, d] = form.data.value.split('-');
    data = `${d}/${m}/${y}`;
  }
  const lines = [
    `Olá! Meu nome é ${nome} e gostaria de um orçamento no Buffet Von Held.`,
    `• Evento: ${tipo}`,
    data && `• Data prevista: ${data}`,
    form.convidados.value && `• Convidados: ${form.convidados.value}`,
    form.mensagem.value.trim() && `• Observações: ${form.mensagem.value.trim()}`,
  ].filter(Boolean);
  note.textContent = 'Abrindo o WhatsApp…';
  const a = document.createElement('a');
  a.href = waLink(lines.join('\n'));
  a.target = '_blank';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
});

document.getElementById('year').textContent = new Date().getFullYear();

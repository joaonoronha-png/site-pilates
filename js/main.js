/*
 * HOPE STUDIO — comportamento mínimo (sem dependências externas).
 *
 * BOOKING_URL: canal oficial de agendamento. NÃO foi possível
 * confirmar com segurança qual dos dois telefones publicamente
 * divergentes é o atual (ver README.md), nem localizar um link de
 * agendamento próprio. Por isso todo botão "Agendar" aponta, por
 * ora, para o perfil oficial do Instagram — onde o link/telefone
 * correto está sempre disponível na bio. Assim que confirmado,
 * troque o valor abaixo por wa.me/55XXXXXXXXXXX ou pela URL da
 * plataforma de agendamento.
 */
const BOOKING_URL = 'https://www.instagram.com/hopestudio_oficial/';

document.querySelectorAll('.js-book').forEach((el) => {
  el.setAttribute('href', BOOKING_URL);
  el.setAttribute('target', '_blank');
  el.setAttribute('rel', 'noopener');
});

document.getElementById('year').textContent = new Date().getFullYear();

// Header solid background after leaving the hero.
const header = document.getElementById('siteHeader');
const onScroll = () => {
  header.classList.toggle('is-solid', window.scrollY > window.innerHeight * 0.7);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile nav toggle.
const nav = document.getElementById('mainNav');
const navToggle = document.getElementById('navToggle');
navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Reveal sections on scroll.
document.querySelectorAll('.section').forEach((section) => section.setAttribute('data-reveal', ''));
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));

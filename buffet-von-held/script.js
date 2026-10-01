/* Buffet Von Held — interações */

// TODO: confirmar o número oficial com a empresa (formato: 55 + DDD + número, só dígitos).
const WHATSAPP = '5521000000000';

const waLink = (text) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

document.documentElement.classList.remove('no-js');

/* Abertura: logotipo desenhado + cortina que se abre */
const root = document.documentElement;
const intro = document.getElementById('intro');
let heroStarted = false;
const startHero = () => {
  if (heroStarted) return;
  heroStarted = true;
  document.body.classList.add('loaded');
};
const closeIntro = () => {
  if (!root.classList.contains('intro-on') || intro.classList.contains('is-leaving')) return;
  try { sessionStorage.setItem('vh-intro', '1'); } catch (e) {}
  intro.classList.add('is-leaving');
  setTimeout(startHero, 450);
  setTimeout(() => root.classList.remove('intro-on'), 1200);
};
if (root.classList.contains('intro-on')) {
  setTimeout(closeIntro, 3000);
  intro.addEventListener('click', closeIntro);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' || e.key === 'Enter') closeIntro(); });
} else {
  window.addEventListener('load', startHero);
  setTimeout(startHero, 600);
}

/* Header ao rolar + botão flutuante */
const nav = document.getElementById('nav');
const waFloat = document.querySelector('.wa-float');
const progress = document.getElementById('progress');
const toTop = document.getElementById('toTop');
const onScroll = () => {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  nav.classList.toggle('scrolled', y > 60);
  waFloat.classList.toggle('show', y > window.innerHeight * 0.6);
  toTop.classList.toggle('show', y > window.innerHeight * 1.5);
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
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
const visibleItems = () => items.filter((it) => !it.classList.contains('is-out'));
const showLb = (i) => {
  const list = visibleItems();
  lbIndex = (i + list.length) % list.length;
  lbImg.src = list[lbIndex].dataset.full;
  lbImg.alt = list[lbIndex].querySelector('img').alt;
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
items.forEach((item) => item.addEventListener('click', () => openLb(visibleItems().indexOf(item))));
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

/* Galeria — filtros */
document.querySelectorAll('.filters .chip').forEach((btn, _, all) => {
  btn.addEventListener('click', () => {
    all.forEach((b) => {
      b.classList.toggle('is-on', b === btn);
      b.setAttribute('aria-pressed', b === btn);
    });
    const f = btn.dataset.filter;
    items.forEach((it) => {
      const show = f === 'todos' || it.dataset.cat === f;
      it.classList.toggle('is-out', !show);
      it.classList.remove('is-in');
      if (show) { void it.offsetWidth; it.classList.add('is-in'); }
    });
  });
});

/* Monte sua festa */
const planner = document.getElementById('planner');
const pConv = document.getElementById('pConv');
const pConvOut = document.getElementById('pConvOut');
const tEvento = document.getElementById('tEvento');
const tConv = document.getElementById('tConv');
const tList = document.getElementById('tList');
const tSend = document.getElementById('tSend');
const convLabel = (v) => (v >= 500 ? '500+' : String(v));
const updatePlanner = () => {
  const evento = planner.querySelector('input[name="p-evento"]:checked').value;
  const conv = parseInt(pConv.value, 10);
  const escolhas = [...planner.querySelectorAll('input[name="p-menu"]:checked, input[name="p-extra"]:checked')].map((i) => i.value);
  pConvOut.textContent = convLabel(conv);
  tEvento.textContent = evento;
  tConv.textContent = convLabel(conv);
  tList.innerHTML = '';
  if (!escolhas.length) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'Escolha os itens ao lado';
    tList.appendChild(li);
  }
  escolhas.forEach((e) => {
    const li = document.createElement('li');
    li.textContent = e;
    tList.appendChild(li);
  });
  const msg = [
    'Olá! Montei minha festa no site do Buffet Von Held:',
    `• Evento: ${evento}`,
    `• Convidados: cerca de ${convLabel(conv)}`,
    escolhas.length && `• Quero: ${escolhas.join(', ')}`,
    'Pode me enviar um orçamento?',
  ].filter(Boolean).join('\n');
  tSend.href = waLink(msg);
};
planner.addEventListener('input', updatePlanner);
planner.addEventListener('submit', (e) => e.preventDefault());
updatePlanner();

/* Contagem regressiva até a festa */
const qData = document.getElementById('qData');
const countdown = document.getElementById('countdown');
qData.addEventListener('input', () => {
  countdown.textContent = '';
  if (!qData.value) return;
  const [y, m, d] = qData.value.split('-').map(Number);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dias = Math.round((new Date(y, m - 1, d) - today) / 86400000);
  if (dias > 1) countdown.textContent = `Faltam ${dias} dias para a sua festa`;
  else if (dias === 1) countdown.textContent = 'Sua festa é amanhã!';
  else if (dias === 0) countdown.textContent = 'Sua festa é hoje!';
  else countdown.textContent = 'Escolha uma data futura.';
});

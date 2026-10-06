/** Comportamentos das seções da home e páginas internas. */
import { clinic } from '../data/site.js';
import { esc } from '../lib/html.js';
import { normalize } from '../lib/text.js';
import { reduced, finePointer } from './motion.js';

/** Status "Aberto agora" calculado no horário de Brasília. */
export function mountOpenStatus() {
  const el = document.querySelector('[data-open-status]');
  const table = document.querySelector('[data-hours]');
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );
  const minutes = parseInt(parts.hour, 10) * 60 + parseInt(parts.minute, 10);
  const toMin = (t) => parseInt(t, 10) * 60 + parseInt(t.slice(3), 10);
  const today = clinic.hours.find((h) => h.schema === parts.weekday);
  table?.querySelector(`[data-day="${parts.weekday}"]`)?.classList.add('is-today');
  if (!el) return;
  const fmt = (t) => `${parseInt(t, 10)}h`;
  const open = today && minutes >= toMin(today.opens) && minutes < toMin(today.closes);
  el.classList.toggle('is-open', Boolean(open));
  el.querySelector('.status-text').innerHTML = open
    ? `<strong>Aberto agora</strong><span>Hoje até ${fmt(today.closes)} · ${esc(clinic.phone.display)}</span>`
    : `<strong>Fora do horário</strong><span>${today && minutes < toMin(today.opens) ? `Abre hoje às ${fmt(today.opens)}` : 'Seg a sex a partir das 8h'} · WhatsApp disponível</span>`;
}

/** Luz que acompanha o cursor no hero (desktop). */
export function mountCursorOrb() {
  const orb = document.querySelector('[data-cursor-orb]');
  const hero = orb?.closest('.hero');
  if (!orb || reduced() || !finePointer()) return;
  let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
  const loop = () => {
    x += (tx - x) * 0.08;
    y += (ty - y) * 0.08;
    orb.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : 0;
  };
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
    if (!raf) raf = requestAnimationFrame(loop);
  });
}

/** Busca inteligente no conteúdo do site (índice carregado sob demanda). */
export function mountSmartSearch(openAssistant) {
  const form = document.querySelector('[data-smart-search]');
  if (!form) return;
  const input = form.querySelector('input');
  const box = document.getElementById('smart-search-results');
  let search;
  const ensure = async () => {
    if (!search) {
      const { createSearch } = await import('../lib/searchIndex.js');
      search = createSearch();
    }
    return search;
  };
  const render = async () => {
    const q = input.value.trim();
    if (!q) { box.innerHTML = ''; box.classList.remove('has-results'); return; }
    const results = (await ensure())(q, { limit: 5 });
    box.classList.add('has-results');
    box.innerHTML = `<ul class="sr-list">${results
      .map(({ doc }) => `<li><a class="sr-item" href="${doc.href}" ${doc.faqId ? `data-faq-target="${doc.faqId}"` : ''}>
        <span class="sr-type">${esc(doc.type)}</span><span class="sr-title">${esc(doc.title)}</span>
        ${doc.answer ? `<span class="sr-snippet">${esc(doc.answer.slice(0, 140))}${doc.answer.length > 140 ? '…' : ''}</span>` : ''}
      </a></li>`)
      .join('')}
      <li><button type="button" class="sr-item sr-ask" data-ask><span class="sr-type">Assistente BCM</span><span class="sr-title">Perguntar: “${esc(q)}”</span></button></li>
    </ul>${results.length ? '' : '<p class="sr-empty">Nada encontrado no site — o Assistente BCM pode ajudar ou encaminhar você para a equipe.</p>'}`;
  };
  let t;
  input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(render, 90); });
  input.addEventListener('focus', ensure, { once: true });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const first = box.querySelector('.sr-item');
    first?.click();
  });
  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-ask]')) openAssistant(input.value.trim());
    const faq = e.target.closest('[data-faq-target]');
    if (faq) openFaqItem(faq.dataset.faqTarget);
  });
  document.querySelectorAll('[data-search-example]').forEach((b) =>
    b.addEventListener('click', () => { input.value = b.textContent; input.focus(); render(); }),
  );
  // Atalho "/" para focar a busca
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
  });
}

/** Explorador da dermatologia (tabs acessíveis + troca automática). */
export function mountExplorer() {
  const root = document.querySelector('[data-explorer]');
  if (!root) return;
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const select = (tab, focus = false) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      panel.hidden = !on;
      panel.classList.toggle('is-active', on);
    });
    if (focus) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { stop(); select(t); });
    t.addEventListener('pointerenter', () => { if (finePointer()) { stop(); select(t); } });
    t.addEventListener('keydown', (e) => {
      const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (d) { e.preventDefault(); stop(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
    });
  });
  // Avança sozinho enquanto ninguém interage
  let timer = 0;
  let touched = false;
  const stop = () => { touched = true; clearInterval(timer); };
  if (!reduced()) {
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting && !touched) timer = setInterval(() => {
        const i = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
        select(tabs[(i + 1) % tabs.length]);
      }, 4200);
    });
    io.observe(root);
    root.addEventListener('focusin', stop);
  }
}

/** "Encontre um especialista": filtros por especialidade e nome. */
export function mountFinder() {
  const root = document.querySelector('[data-finder]');
  if (!root) return;
  const spec = root.querySelector('[data-finder-specialty]');
  const name = root.querySelector('[data-finder-name]');
  const count = root.querySelector('[data-finder-count]');
  const empty = document.querySelector('[data-finder-empty]');
  const cards = [...document.querySelectorAll('[data-doctor]')];
  const apply = () => {
    const n = normalize(name.value);
    let visible = 0;
    cards.forEach((c) => {
      const ok = (!spec.value || c.dataset.specialty === spec.value) && (!n || normalize(c.dataset.name).includes(n));
      c.hidden = !ok;
      visible += ok;
    });
    count.textContent = `${visible} ${visible === 1 ? 'profissional' : 'profissionais'}`;
    empty.hidden = visible > 0;
  };
  spec.addEventListener('change', apply);
  name.addEventListener('input', apply);
}

/** Galeria com lightbox: teclado, setas e swipe. */
export function mountGallery() {
  const items = [...document.querySelectorAll('[data-gallery-item]')];
  const box = document.querySelector('[data-lightbox]');
  if (!items.length || !box) return;
  const img = box.querySelector('[data-lightbox-img]');
  const cap = box.querySelector('[data-lightbox-caption]');
  let index = 0;
  let opener;
  const show = (i) => {
    index = (i + items.length) % items.length;
    img.src = items[index].dataset.src;
    img.alt = items[index].dataset.alt;
    cap.textContent = `${index + 1} / ${items.length} · Imagem ilustrativa`;
  };
  const open = (i) => {
    opener = document.activeElement;
    show(i);
    box.hidden = false;
    requestAnimationFrame(() => box.classList.add('is-open'));
    document.documentElement.classList.add('menu-open');
    box.querySelector('[data-lightbox-close]').focus();
  };
  const close = () => {
    box.classList.remove('is-open');
    document.documentElement.classList.remove('menu-open');
    setTimeout(() => (box.hidden = true), reduced() ? 0 : 250);
    opener?.focus();
  };
  items.forEach((el, i) => el.addEventListener('click', () => open(i)));
  box.querySelector('[data-lightbox-close]').addEventListener('click', close);
  box.querySelector('[data-lightbox-prev]').addEventListener('click', () => show(index - 1));
  box.querySelector('[data-lightbox-next]').addEventListener('click', () => show(index + 1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'Tab') {
      const f = [...box.querySelectorAll('button')];
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    }
  });
  let sx = 0;
  box.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
  box.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
  });
}

/** Abre (e rola até) uma pergunta da FAQ. */
export function openFaqItem(id) {
  const item = document.getElementById(`faq-${id}`);
  if (!item) return;
  item.hidden = false;
  const btn = item.querySelector('button');
  if (btn.getAttribute('aria-expanded') !== 'true') btn.click();
  setTimeout(() => btn.focus({ preventScroll: true }), 50);
}

/** FAQ: acordeão, categorias e busca. */
export function mountFAQ(openAssistant) {
  const root = document.querySelector('[data-faq-root]');
  if (!root) return;
  const items = [...root.querySelectorAll('[data-faq]')];
  const search = root.querySelector('[data-faq-search]');
  const empty = root.querySelector('[data-faq-empty]');
  const more = root.querySelector('[data-faq-more]');
  let cat = '';
  let expanded = false;
  more?.addEventListener('click', () => {
    expanded = true;
    more.hidden = true;
    filter();
    items.find((it) => it.hasAttribute('data-faq-extra'))?.querySelector('button').focus();
  });

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-q button');
    if (btn) {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.closest('[data-faq]').classList.toggle('is-open', open);
      return;
    }
    const c = e.target.closest('[data-faq-cat]');
    if (c) {
      cat = c.dataset.faqCat;
      root.querySelectorAll('[data-faq-cat]').forEach((b) => {
        b.classList.toggle('is-active', b === c);
        b.setAttribute('aria-pressed', String(b === c));
      });
      filter();
    }
  });
  const filter = () => {
    const q = normalize(search.value);
    let n = 0;
    const browsing = !cat && !q && !expanded;
    items.forEach((it) => {
      const ok = (!cat || it.dataset.category === cat) && (!q || normalize(it.textContent).includes(q));
      it.hidden = !ok || (browsing && it.hasAttribute('data-faq-extra'));
      n += ok;
    });
    empty.hidden = n > 0;
    if (more) more.hidden = !browsing;
  };
  filter();
  search.addEventListener('input', filter);
  root.querySelector('[data-faq-ask-query]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openAssistant(search.value.trim());
  });

  // Abre a pergunta indicada no endereço (#faq-id)
  const fromHash = () => location.hash.startsWith('#faq-') && openFaqItem(location.hash.slice(5));
  window.addEventListener('hashchange', fromHash);
  fromHash();
}

/** Mapa do Google somente após consentimento (clique). */
export function mountMap() {
  const frame = document.querySelector('[data-map]');
  frame?.querySelector('[data-map-load]')?.addEventListener('click', () => {
    frame.innerHTML = `<iframe title="Mapa: ${esc(clinic.name)}" src="${frame.dataset.embed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
    frame.classList.add('is-loaded');
  });
}

/** Linha do tempo que se preenche conforme o scroll. */
export function mountTimeline() {
  const wrap = document.querySelector('[data-timeline]');
  const fill = wrap?.querySelector('[data-timeline-fill]');
  if (!fill) return;
  if (reduced()) { fill.style.transform = 'scaleX(1) scaleY(1)'; return; }
  const steps = [...wrap.querySelectorAll('.timeline-step')];
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = wrap.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height + vh * 0.25)));
    wrap.style.setProperty('--progress', p.toFixed(3));
    steps.forEach((s, i) => s.classList.toggle('is-active', p >= (i + 0.5) / steps.length - 0.1));
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

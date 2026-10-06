/** Utilitários de movimento — respeitam prefers-reduced-motion. */
export const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Revela elementos ao entrarem na tela (scroll reveal + stagger). */
export function mountReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-clip, .reveal-stagger');
  if (reduced() || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  // Stagger: irmãos revelados em sequência.
  const groups = new Map();
  els.forEach((el) => {
    const list = groups.get(el.parentElement) || [];
    list.push(el);
    groups.set(el.parentElement, list);
  });
  groups.forEach((list) => list.forEach((el, i) => el.style.setProperty('--stagger', `${Math.min(i, 6) * 70}ms`)));
  els.forEach((el) => io.observe(el));
}

/** Parallax leve via transform, só quando visível. */
export function mountParallax() {
  if (reduced()) return;
  const items = [...document.querySelectorAll('[data-parallax]')].map((el) => ({ el, k: parseFloat(el.dataset.parallax) || 0.08, visible: false }));
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => entries.forEach((e) => (items.find((i) => i.el === e.target).visible = e.isIntersecting)));
  items.forEach((i) => io.observe(i.el));
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    for (const i of items) {
      if (!i.visible) continue;
      const r = i.el.getBoundingClientRect();
      const offset = (r.top + r.height / 2 - vh / 2) * -i.k;
      i.el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.08)`;
    }
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/** Botões magnéticos sutis (somente mouse). */
export function mountMagnetic() {
  if (reduced() || !finePointer()) return;
  document.addEventListener('pointermove', (e) => {
    const el = e.target.closest?.('.magnetic');
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.18;
    const y = (e.clientY - r.top - r.height / 2) * 0.28;
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  });
  document.addEventListener('pointerout', (e) => {
    const el = e.target.closest?.('.magnetic');
    if (el && !el.contains(e.relatedTarget)) el.style.transform = '';
  });
}

/** Cartões com profundidade (tilt 3D discreto). */
export function mountTilt() {
  if (reduced() || !finePointer()) return;
  document.querySelectorAll('[data-tilt], .tilt-card').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${(px * 5).toFixed(2)}deg) rotateX(${(-py * 5).toFixed(2)}deg)`;
    });
    el.addEventListener('pointerleave', () => (el.style.transform = ''));
  });
}

/** Contador animado (ex.: "2018"). */
export function mountCounters() {
  if (reduced()) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      const end = parseInt(e.target.dataset.count, 10);
      const start = end - 18;
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / 1100);
        e.target.textContent = Math.round(start + (end - start) * (1 - (1 - p) ** 3));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  });
  document.querySelectorAll('[data-count]').forEach((el) => io.observe(el));
}

/* ==========================================================
   Graal Marcenaria — interações
   ========================================================== */

// Número do WhatsApp (DDI + DDD + número, só dígitos)
const WHATSAPP = "5521998680606";

(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = matchMedia("(hover: hover)").matches;

  /* ---------- WhatsApp ---------- */
  const wa = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  $$(".js-wa").forEach((a) => {
    a.href = wa(a.dataset.msg || "Olá! Vim pelo site da Graal Marcenaria.");
    a.target = "_blank";
    a.rel = "noopener";
  });
  $("#ano").textContent = new Date().getFullYear();

  /* ---------- Intro ---------- */
  const first = new Image();
  first.src = "assets/img/hero-1.jpg";
  Promise.all([
    new Promise((r) => setTimeout(r, reduced ? 0 : 1400)),
    new Promise((r) => { first.onload = first.onerror = r; setTimeout(r, 3500); }),
  ]).then(() => { root.classList.add("ready"); hero(); });

  /* ---------- Hero slideshow ---------- */
  function hero() {
    const slides = $$(".hero__slide");
    const now = $(".hero__now");
    slides.slice(1).forEach((s) => { new Image().src = s.style.backgroundImage.slice(5, -2); });
    if (reduced) return;
    let i = 0;
    setInterval(() => {
      slides[i].classList.remove("is-active");
      i = (i + 1) % slides.length;
      slides[i].classList.add("is-active");
      now.textContent = String(i + 1).padStart(2, "0");
    }, 6000);
  }

  /* ---------- Header + float ---------- */
  const header = $(".header");
  const waBtn = $(".wa");
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle("solid", y > 40);
    header.classList.toggle("up", y > lastY && y > 700 && !document.body.classList.contains("open"));
    waBtn.classList.toggle("show", y > innerHeight * 0.5);
    lastY = y;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = $(".burger");
  const menu = $("#menu");
  const setMenu = (open) => {
    document.body.classList.toggle("open", open);
    document.body.classList.toggle("lock", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menu.setAttribute("aria-hidden", !open);
  };
  burger.addEventListener("click", () => setMenu(!document.body.classList.contains("open")));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---------- Reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const sibs = [...el.parentElement.children].filter((c) => c.matches(".rv, .rv-img"));
      el.style.transitionDelay = `${Math.min(Math.max(0, sibs.indexOf(el)), 5) * 0.08}s`;
      el.classList.add("in");
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
  $$(".rv, .rv-img").forEach((el) => io.observe(el));

  /* ---------- Active nav ---------- */
  const links = $$(".nav a");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.hash === `#${e.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((a) => { const s = $(a.hash); if (s) spy.observe(s); });

  /* ---------- Parallax ---------- */
  if (!reduced) {
    const plx = $$("[data-plx]");
    let tick = false;
    const run = () => {
      plx.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        el.style.transform = `translate3d(0, ${p * -14}%, 0)`;
      });
      tick = false;
    };
    addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(run); } }, { passive: true });
    run();
  }

  /* ---------- Counters ---------- */
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      cio.unobserve(el);
      const end = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.dec || "0", 10);
      const fmt = (v) => v.toFixed(dec).replace(".", ",");
      if (reduced) { el.textContent = fmt(end); return; }
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 1600);
        el.textContent = fmt(end * (1 - Math.pow(1 - k, 4)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => cio.observe(el));

  /* ---------- Project filters ---------- */
  const items = $$(".pitem");
  $$(".filters button").forEach((b) => b.addEventListener("click", () => {
    $$(".filters button").forEach((x) => x.classList.toggle("is-on", x === b));
    const f = b.dataset.f;
    items.forEach((it) => {
      const show = f === "all" || it.dataset.cat === f;
      it.classList.toggle("out", !show);
      if (show) it.classList.add("in");
    });
  }));

  /* ---------- Lightbox ---------- */
  const lb = $(".lb");
  const lbImg = $("img", lb);
  const lbCap = $("figcaption", lb);
  let list = [], cur = 0;
  const show = (n) => {
    cur = (n + list.length) % list.length;
    const a = list[cur];
    lbImg.src = a.href;
    lbImg.alt = $("img", a).alt;
    lbCap.textContent = $(".pitem__cap b", a)?.textContent || "";
  };
  const close = () => { lb.hidden = true; document.body.classList.remove("lock"); list[cur]?.focus(); };
  items.forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    list = items.filter((x) => !x.classList.contains("out"));
    show(list.indexOf(a));
    lb.hidden = false;
    document.body.classList.add("lock");
    $(".lb__x").focus();
  }));
  $(".lb__x").addEventListener("click", close);
  $(".lb__prev").addEventListener("click", () => show(cur - 1));
  $(".lb__next").addEventListener("click", () => show(cur + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.tagName === "FIGURE") close(); });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") { setMenu(false); if (!lb.hidden) close(); }
    if (lb.hidden) return;
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
  let tx = 0;
  lb.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
  });

  /* ---------- Ambientes: imagem que segue o cursor ---------- */
  const float = $(".spaces__float");
  const floatImg = $("img", float);
  if (canHover && !reduced) {
    let x = 0, y = 0, fx = 0, fy = 0, raf = null;
    const loop = () => {
      fx += (x - fx) * 0.14;
      fy += (y - fy) * 0.14;
      float.style.translate = `${fx + 30}px ${fy - 180}px`;
      raf = requestAnimationFrame(loop);
    };
    $$(".slist a").forEach((a) => {
      new Image().src = a.dataset.img;
      a.addEventListener("mouseenter", () => {
        floatImg.src = a.dataset.img;
        float.classList.add("show");
        if (!raf) loop();
      });
      a.addEventListener("mouseleave", () => float.classList.remove("show"));
      a.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });
    });
  }

  /* ---------- Form → WhatsApp ---------- */
  const form = $("#form");
  $$("select", form).forEach((s) => s.addEventListener("change", () => s.classList.add("has")));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    const amb = form.ambiente.value;
    form.nome.parentElement.classList.toggle("bad", !nome);
    form.ambiente.parentElement.classList.toggle("bad", !amb);
    if (!nome) return form.nome.focus();
    if (!amb) return form.ambiente.focus();

    const lines = [
      `Olá, Graal Marcenaria! Meu nome é ${nome}.`,
      `Gostaria de um orçamento:`,
      ``,
      `• Ambiente: ${amb}`,
    ];
    if (form.bairro.value.trim()) lines.push(`• Bairro: ${form.bairro.value.trim()}`);
    if (form.prazo.value) lines.push(`• Prazo: ${form.prazo.value}`);
    if (form.detalhes.value.trim()) lines.push(`• Detalhes: ${form.detalhes.value.trim()}`);
    window.open(wa(lines.join("\n")), "_blank", "noopener");
  });
  $$("input, select", form).forEach((el) =>
    el.addEventListener("input", () => el.parentElement.classList.remove("bad"))
  );
})();

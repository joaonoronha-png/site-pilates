(() => {
  const WA_NUMBER = "5521966092692";
  const WA_DEFAULT_MSG = "Olá! Encontrei a MG Estética Automotiva pelo site e gostaria de saber mais sobre os serviços.";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Links do WhatsApp com mensagem automática ---------- */
  document.querySelectorAll("[data-wa]").forEach((a) => {
    const msg = a.dataset.waMsg || WA_DEFAULT_MSG;
    a.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  });

  /* ---------- Ano no rodapé ---------- */
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Nav ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = nav.querySelector(".nav__toggle");
  const mobile = document.getElementById("menu-mobile");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    mobile.hidden = !open;
    nav.classList.toggle("is-scrolled", open || window.scrollY > 20);
  };
  toggle.addEventListener("click", () => setMenu(mobile.hidden));
  mobile.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---------- Aberto agora (horário de Brasília) ---------- */
  const HOURS = { 0: [10, 14], 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 18], 5: [9, 18], 6: [9, 18] };
  const nowInRio = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo", weekday: "short", hour: "numeric", minute: "numeric", hour12: false,
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { day, minutes: (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10) };
  };
  const updateStatus = () => {
    let day, minutes;
    try { ({ day, minutes } = nowInRio()); } catch { return; }
    const [o, c] = HOURS[day];
    const open = minutes >= o * 60 && minutes < c * 60;
    let text;
    if (open) {
      text = `Aberto agora · até ${String(c).padStart(2, "0")}h`;
    } else if (minutes < o * 60) {
      text = `Fechado · abre às ${String(o).padStart(2, "0")}h`;
    } else {
      const next = HOURS[(day + 1) % 7][0];
      text = `Fechado · abre amanhã às ${String(next).padStart(2, "0")}h`;
    }
    document.querySelectorAll("[data-status]").forEach((el) => {
      el.classList.toggle("is-open", open);
      el.classList.toggle("is-closed", !open);
      el.querySelector("[data-status-text]").textContent = text;
    });
    document.querySelectorAll(".hours tr").forEach((tr) => {
      tr.classList.toggle("is-today", tr.dataset.days.split(",").map(Number).includes(day));
    });
  };
  updateStatus();
  setInterval(updateStatus, 60 * 1000);

  /* ---------- Galeria (fotos reais do Instagram oficial) ---------- */
  const IMG = "assets/img/";
  const WORKS = [
    { f: "corsa-polido-frente", t: "Corsa", s: "Lixamento · Polimento", c: ["exterior", "detalhamento"], size: "xl" },
    { f: "audi-a3-frente", t: "Audi A3", s: "Polimento", c: ["exterior"] },
    { f: "audi-a3-bancos-couro", t: "Audi A3", s: "Limpeza dos bancos em couro", c: ["interior"], size: "tall" },
    { f: "s10-lateral", t: "Chevrolet S10", s: "Polimento · Lavagem", c: ["exterior", "utilitarios"] },
    { f: "gol-polido-frente", t: "VW Gol", s: "Lavagem detalhada · Polimento", c: ["exterior"] },
    { f: "motorhome-frente", t: "Motorhome", s: "Lavagem completa externa", c: ["exterior", "utilitarios"], size: "tall" },
    { f: "gol-motor", t: "VW Gol", s: "Lavagem de motor", c: ["detalhamento"] },
    { f: "corsa-polido-traseira", t: "Corsa", s: "Polimento", c: ["exterior"] },
    { f: "gol-interior-limpo", t: "VW Gol", s: "Limpeza interna", c: ["interior"] },
    { f: "master-polida", t: "Renault Master", s: "Polimento · Revitalização de plásticos", c: ["exterior", "utilitarios"], size: "xl" },
    { f: "audi-a3-traseira", t: "Audi A3", s: "Polimento", c: ["exterior"] },
    { f: "corsa-lixamento", t: "Corsa", s: "Lixamento — em andamento", c: ["detalhamento"] },
    { f: "gol-interior-desmontado", t: "VW Gol", s: "Limpeza interna — em andamento", c: ["interior", "detalhamento"] },
    { f: "s10-frente", t: "Chevrolet S10", s: "Polimento · Limpeza interna", c: ["exterior", "utilitarios"] },
    { f: "gol-traseira", t: "VW Gol", s: "Lavagem detalhada", c: ["exterior"] },
    { f: "motorhome-roda", t: "Motorhome", s: "Detalhe das rodas", c: ["detalhamento", "utilitarios"] },
    { f: "master-preparacao", t: "Renault Master", s: "Preparação para polimento", c: ["detalhamento", "utilitarios"] },
    { f: "gol-lateral", t: "VW Gol", s: "Lavagem detalhada · Polimento", c: ["exterior"] },
    { f: "motorhome-lateral", t: "Motorhome", s: "Lavagem completa externa", c: ["exterior", "utilitarios"] },
    { f: "master-lateral", t: "Renault Master", s: "Polimento das laterais", c: ["exterior", "utilitarios"] },
    { f: "gol-preparacao", t: "VW Gol", s: "Preparação para polimento", c: ["detalhamento"] },
  ];

  const gallery = document.getElementById("gallery");
  gallery.innerHTML = WORKS.map((w, i) => `
    <button class="g-item${w.size ? " g-item--" + w.size : ""} reveal" data-i="${i}" data-cat="${w.c.join(" ")}" aria-label="Ampliar foto: ${w.t} — ${w.s}">
      <img src="${IMG}${w.f}${w.size === "xl" ? "" : "-sm"}.jpg" alt="${w.t} — ${w.s}" loading="lazy">
      <span class="g-item__zoom" aria-hidden="true">＋</span>
      <span class="g-item__meta"><strong>${w.t}</strong><span>${w.s}</span></span>
    </button>`).join("");

  const items = [...gallery.querySelectorAll(".g-item")];
  document.querySelectorAll(".filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
      });
      const f = btn.dataset.filter;
      items.forEach((it) => {
        const show = f === "all" || it.dataset.cat.split(" ").includes(f);
        it.classList.toggle("is-hidden", !show);
        if (show) it.classList.add("is-in");
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = lb.querySelector("img");
  const lbCap = lb.querySelector(".lightbox__caption");
  const lbCount = lb.querySelector(".lightbox__count");
  let visible = [];
  let cur = 0;
  let lastFocus = null;

  const show = (idx) => {
    cur = (idx + visible.length) % visible.length;
    const w = WORKS[visible[cur]];
    lbImg.style.opacity = 0;
    const src = IMG + w.f + ".jpg";
    const img = new Image();
    img.onload = () => { lbImg.src = src; lbImg.alt = `${w.t} — ${w.s}`; lbImg.style.opacity = 1; };
    img.src = src;
    lbCap.textContent = `${w.t} — ${w.s}`;
    lbCount.textContent = `${String(cur + 1).padStart(2, "0")} / ${String(visible.length).padStart(2, "0")}`;
  };
  const open = (i) => {
    visible = items.filter((it) => !it.classList.contains("is-hidden")).map((it) => +it.dataset.i);
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => lb.classList.add("is-open"));
    show(visible.indexOf(i));
    lb.querySelector(".lightbox__close").focus();
  };
  const close = () => {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => { lb.hidden = true; }, reduceMotion ? 0 : 300);
    if (lastFocus) lastFocus.focus();
  };
  items.forEach((it) => it.addEventListener("click", () => open(+it.dataset.i)));
  lb.querySelector(".lightbox__close").addEventListener("click", close);
  lb.querySelector(".lightbox__prev").addEventListener("click", () => show(cur - 1));
  lb.querySelector(".lightbox__next").addEventListener("click", () => show(cur + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.tagName === "FIGURE") close(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
  let tx = null;
  lb.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    tx = null;
  });

  /* ---------- Comparador durante / depois ---------- */
  const cmp = document.getElementById("compare");
  const range = cmp.querySelector(".compare__range");
  const before = cmp.querySelector(".compare__before");
  const after = cmp.querySelector(".compare__after");
  range.addEventListener("input", () => cmp.style.setProperty("--pos", range.value + "%"));
  document.querySelectorAll(".compare-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".compare-tab").forEach((t) => {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", String(t === tab));
      });
      before.src = tab.dataset.before;
      before.alt = `${tab.dataset.alt} durante o serviço`;
      after.src = tab.dataset.after;
      after.alt = `${tab.dataset.alt} depois do serviço`;
      range.value = 50;
      cmp.style.setProperty("--pos", "50%");
    });
  });

  /* ---------- Animações de entrada ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const siblings = [...en.target.parentElement.children].filter((c) => c.classList.contains("reveal"));
        en.target.style.animationDelay = `${Math.min(siblings.indexOf(en.target), 6) * 70}ms`;
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Parallax discreto no hero ---------- */
  const visual = document.querySelector(".hero__visual .hud-frame");
  if (visual && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    const hero = document.querySelector(".hero");
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      visual.style.transform = `perspective(1200px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });
    hero.addEventListener("mouseleave", () => { visual.style.transform = ""; });
    visual.style.transition = "transform .6s cubic-bezier(.2,.7,.1,1)";
  }
})();

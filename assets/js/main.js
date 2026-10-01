/* ==========================================================
   Graal Marcenaria — interações
   ========================================================== */

// Número do WhatsApp (DDI + DDD + número, só dígitos)
const WHATSAPP = "5521998680606";

/* ----------------------------------------------------------
   AVALIAÇÕES (rotação)
   Copie avaliações reais do perfil da Graal no Google Maps.
   nome: como aparece no Google · quando: ex. "há 2 meses" ·
   texto: a avaliação · nota: 1 a 5
   Itens com texto vazio aparecem como espaço reservado.
   ---------------------------------------------------------- */
const AVALIACOES = [
  { nome: "", quando: "", nota: 5, texto: "" },
  { nome: "", quando: "", nota: 5, texto: "" },
  { nome: "", quando: "", nota: 5, texto: "" },
  { nome: "", quando: "", nota: 5, texto: "" },
  { nome: "", quando: "", nota: 5, texto: "" },
  { nome: "", quando: "", nota: 5, texto: "" },
];

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
  const pctEl = $(".intro__pct b");
  const bar = $(".intro__bar");
  const minTime = reduced ? 0 : 2300;
  const t0 = performance.now();
  let loaded = false;
  const imgReady = new Promise((r) => { first.onload = first.onerror = r; setTimeout(r, 4000); })
    .then(() => { loaded = true; });
  // contador: avança com o tempo, mas só chega a 100 quando a foto da capa carregou
  const count = () => {
    const k = Math.min(1, (performance.now() - t0) / Math.max(minTime, 1));
    const p = loaded ? k : Math.min(k, 0.9);
    const eased = p * p * (3 - 2 * p);
    pctEl.textContent = Math.round(eased * 100);
    bar.style.setProperty("--p", eased);
    if (eased < 1) requestAnimationFrame(count);
  };
  requestAnimationFrame(count);
  Promise.all([new Promise((r) => setTimeout(r, minTime)), imgReady]).then(() => {
    pctEl.textContent = 100;
    bar.style.setProperty("--p", 1);
    root.classList.add("leaving");
    setTimeout(() => { root.classList.add("ready"); hero(); }, reduced ? 0 : 450);
  });

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
  const mapBtn = $(".map-fab");
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle("solid", y > 40);
    header.classList.toggle("up", y > lastY && y > 700 && !document.body.classList.contains("open"));
    waBtn.classList.toggle("show", y > innerHeight * 0.5);
    mapBtn.classList.toggle("show", y > innerHeight * 0.5);
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

  /* ---------- Avaliações: carrossel ---------- */
  (() => {
    const box = $(".carousel");
    if (!box) return;
    const track = $(".carousel__track", box);
    const dotsEl = $(".carousel__dots", box);
    const bar = $(".carousel__progress i", box);
    const gIcon = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2.1 5-4.4 6.6v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.1z"/><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.6-3.8-12.3-9H4.4v5.7C8 41.1 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.7 28.3c-.4-1.3-.7-2.8-.7-4.3s.3-3 .7-4.3V14H4.4C2.9 17 2 20.4 2 24s.9 7 2.4 10l7.3-5.7z"/><path fill="#EA4335" d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.4 2 8 6.9 4.4 14l7.3 5.7c1.7-5.2 6.6-9 12.3-9z"/></svg>';
    const esc = (t) => t.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

    AVALIACOES.forEach((r, n) => {
      const empty = !r.texto.trim();
      const nome = r.nome.trim() || "Cliente Graal";
      const li = document.createElement("li");
      li.className = "rcard" + (empty ? " is-empty" : "");
      li.setAttribute("role", "group");
      li.setAttribute("aria-label", `Avaliação ${n + 1} de ${AVALIACOES.length}`);
      li.innerHTML = `<div class="rcard__in">
        <div class="rcard__top"><span class="rcard__stars" aria-label="${r.nota} de 5 estrelas">${"★".repeat(r.nota)}</span>${gIcon}</div>
        <blockquote>${empty ? "Cole aqui uma avaliação real do Google (veja AVALIACOES em main.js)." : esc(r.texto.trim())}</blockquote>
        <div class="rcard__who"><span class="rcard__av" aria-hidden="true">${esc(nome[0].toUpperCase())}</span>
          <div><b>${esc(nome)}</b><span>Avaliação no Google${r.quando ? " · " + esc(r.quando) : ""}</span></div></div>
      </div>`;
      track.appendChild(li);
    });
    const cards = $$(".rcard", track);
    const perView = () => Math.max(1, Math.round(track.parentElement.clientWidth / cards[0].getBoundingClientRect().width));
    let i = 0, timer = null;
    const DUR = 6000;
    box.style.setProperty("--dur", DUR + "ms");

    const pages = () => Math.max(1, cards.length - perView() + 1);
    const renderDots = () => {
      dotsEl.innerHTML = "";
      for (let k = 0; k < pages(); k++) {
        const d = document.createElement("button");
        d.setAttribute("role", "tab");
        d.setAttribute("aria-label", `Ir para avaliação ${k + 1}`);
        d.addEventListener("click", () => go(k));
        dotsEl.appendChild(d);
      }
    };
    const go = (k) => {
      const max = pages();
      i = (k + max) % max;
      track.style.transform = `translateX(${-i * cards[0].getBoundingClientRect().width}px)`;
      cards.forEach((c, n) => c.classList.toggle("is-current", n >= i && n < i + perView()));
      $$("button", dotsEl).forEach((d, n) => d.setAttribute("aria-selected", n === i));
      restart();
    };
    const restart = () => {
      clearTimeout(timer);
      bar.classList.remove("run"); void bar.offsetWidth;
      if (reduced || box.classList.contains("paused")) return;
      bar.classList.add("run");
      timer = setTimeout(() => go(i + 1), DUR);
    };
    const pause = () => { box.classList.add("paused"); clearTimeout(timer); };
    const resume = () => {
      if (!box.classList.contains("paused")) return;
      box.classList.remove("paused");
      restart();
    };

    $(".carousel__prev", box).addEventListener("click", () => go(i - 1));
    $(".carousel__next", box).addEventListener("click", () => go(i + 1));
    box.addEventListener("mouseenter", pause);
    box.addEventListener("mouseleave", resume);
    box.addEventListener("focusin", pause);
    box.addEventListener("focusout", resume);

    // arrastar / deslizar
    let sx = 0, dx = 0, dragging = false;
    const vp = $(".carousel__viewport", box);
    vp.addEventListener("pointerdown", (e) => { dragging = true; sx = e.clientX; dx = 0; track.classList.add("dragging"); clearTimeout(timer); });
    addEventListener("pointermove", (e) => {
      if (!dragging) return;
      dx = e.clientX - sx;
      track.style.transform = `translateX(${-i * cards[0].getBoundingClientRect().width + dx}px)`;
    });
    addEventListener("pointerup", () => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("dragging");
      go(Math.abs(dx) > 60 ? i + (dx < 0 ? 1 : -1) : i);
    });

    // só começa a rodar quando a seção aparece na tela
    let started = false;
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) { started = true; go(0); }
      else if (!e.isIntersecting && started) clearTimeout(timer);
      else if (e.isIntersecting) restart();
    }, { threshold: 0.3 }).observe(box);

    let rt;
    addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { renderDots(); go(Math.min(i, pages() - 1)); }, 150); });
    renderDots();
  })();

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

/* =========================================================
   ARGENTO ESCORAMENTOS — interações
   ========================================================= */
(() => {
  const C = window.ARGENTO;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- links de contato a partir do config ---------- */
  const waLink = (text = `Olá, ${C.contactShort || "Argento"}! Vim pelo site da Argento Escoramentos e gostaria de mais informações.`) =>
    `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`;
  window.argentoWa = waLink;

  function bindContacts(root = document) {
    $$("[data-wa]", root).forEach((a) => { if (!a.dataset.waText) { a.href = waLink(); } else { a.href = waLink(a.dataset.waText); } a.target = "_blank"; a.rel = "noopener"; });
    $$("[data-tel]", root).forEach((a) => (a.href = `tel:${C.phone}`));
    $$("[data-mail]", root).forEach((a) => (a.href = `mailto:${C.email}`));
    $$("[data-cfg]", root).forEach((el) => { const v = C[el.dataset.cfg]; if (v) el.textContent = v; });
  }
  window.argentoBind = bindContacts;
  bindContacts();
  $("#year").textContent = new Date().getFullYear();

  /* =========================================================
     INTRO
     ========================================================= */
  const intro = $("#intro");
  const brand = $(".intro__brand");
  brand.innerHTML = [...brand.textContent].map((c, i) => `<span class="ch" style="animation-delay:${1.95 + i * 0.06}s">${c}</span>`).join("");

  let introDone = false;
  const count = $(".intro__count");
  const DURATION = reduced ? 600 : 3900;
  const t0 = performance.now();
  (function tick(now) {
    if (introDone) return;
    const p = Math.min(1, (now - t0) / DURATION);
    count.textContent = Math.round(p * p * (3 - 2 * p) * 100);
    if (p < 1) requestAnimationFrame(tick); else setTimeout(endIntro, 350);
  })(t0);

  function endIntro(fast) {
    if (introDone) return;
    introDone = true;
    intro.classList.add("is-leaving");
    setTimeout(() => {
      intro.classList.add("is-open");
      document.body.classList.remove("is-intro");
      document.body.classList.add("is-ready");
      intro.setAttribute("aria-hidden", "true");
      startCounters();
    }, fast ? 450 : 900);
    setTimeout(() => intro.classList.add("is-done"), fast ? 1600 : 2100);
  }
  $("#introSkip").addEventListener("click", () => endIntro(true));
  addEventListener("keydown", (e) => { if (!introDone && (e.key === "Escape" || e.key === "Enter")) endIntro(true); });

  /* =========================================================
     NAV / PROGRESS / ACTIVE LINK
     ========================================================= */
  const nav = $("#nav");
  const bar = $(".progress span");
  let lastY = 0;
  function onScroll() {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle("is-solid", y > 40);
    nav.classList.toggle("is-hidden", y > 500 && y > lastY + 4 && !drawer.classList.contains("is-open"));
    if (y < lastY - 4 || y < 500) nav.classList.remove("is-hidden");
    lastY = y;
    stepsProgress();
  }
  addEventListener("scroll", onScroll, { passive: true });

  const navLinks = $$(".nav__links a");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) [...navLinks, ...$$(".drawer__link")].forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${en.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => spy.observe(s));

  // drawer mobile
  const burger = $("#burger");
  const drawer = $("#drawer");
  function toggleDrawer(open) {
    const o = open ?? !drawer.classList.contains("is-open");
    drawer.classList.toggle("is-open", o);
    burger.setAttribute("aria-expanded", o);
    drawer.setAttribute("aria-hidden", !o);
    document.body.style.overflow = o ? "hidden" : "";
    document.body.classList.toggle("menu-open", o);
  }
  burger.addEventListener("click", () => toggleDrawer());
  $$("#drawer a, #drawer [data-open-quote]").forEach((a) => a.addEventListener("click", () => toggleDrawer(false)));

  /* =========================================================
     REVEAL + COUNTERS
     ========================================================= */
  const rev = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); rev.unobserve(en.target); } });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; rev.observe(el); });

  function startCounters() {
    $$("[data-count]").forEach((el) => {
      const end = +el.dataset.count; const t = performance.now();
      (function f(n) { const p = Math.min(1, (n - t) / 1400); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(t);
    });
  }

  /* =========================================================
     HERO PARALLAX + MAGNETIC
     ========================================================= */
  const stack = $(".hero__stack");
  if (!reduced && matchMedia("(pointer:fine)").matches) {
    $(".hero").addEventListener("mousemove", (e) => {
      const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      $$(".card-photo", stack).forEach((c) => { const d = +c.dataset.depth; c.style.transform = `translate(${x * d}px, ${y * d}px) rotate(var(--r0))`; });
    });
    $$(".magnetic").forEach((b) => {
      b.addEventListener("mousemove", (e) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`; });
      b.addEventListener("mouseleave", () => (b.style.transform = ""));
    });
  }

  /* =========================================================
     RAIO-X
     ========================================================= */
  const xray = $("#xray");
  const parts = window.XRAY;
  let xi = 0;
  const dots = $("#xrDots");
  dots.innerHTML = parts.map(() => "<span></span>").join("");
  function showPart(i, focus = true) {
    xi = (i + parts.length) % parts.length;
    const p = parts[xi];
    const info = $(".xray__info");
    info.classList.remove("is-swap"); void info.offsetWidth; info.classList.add("is-swap");
    $("#xrNum").textContent = xi + 1; $("#xrTitle").textContent = p.t; $("#xrText").textContent = p.d; $("#xrTip").textContent = p.tip;
    $$("span", dots).forEach((d, k) => d.classList.toggle("is-on", k === xi));
    $$(".hot", xray).forEach((h) => h.classList.toggle("is-on", h.dataset.part === p.part));
    if (focus) {
      xray.classList.add("has-focus");
      $$(".x-part", xray).forEach((g) => g.classList.toggle("is-focus", g.dataset.part === p.part));
    }
  }
  $$(".hot", xray).forEach((h) => h.addEventListener("click", () => showPart(parts.findIndex((p) => p.part === h.dataset.part))));
  $$(".x-part", xray).forEach((g) => g.addEventListener("click", () => showPart(parts.findIndex((p) => p.part === g.dataset.part))));
  $("#xrNext").addEventListener("click", () => showPart(xi + 1));
  $("#xrPrev").addEventListener("click", () => showPart(xi - 1));
  $(".xray__svg").addEventListener("mouseleave", () => { xray.classList.remove("has-focus"); });
  showPart(0, false);
  new IntersectionObserver((en, o) => { if (en[0].isIntersecting) { xray.classList.add("is-built"); o.disconnect(); } }, { threshold: 0.35 }).observe(xray);

  /* =========================================================
     OBRAS + LIGHTBOX
     ========================================================= */
  const works = $("#works");
  const D = window.DESTAQUE;
  if (D && D.fotos.length) window.OBRAS.push({ ...D, hideInGrid: true });
  works.innerHTML = window.OBRAS.map((o, i) => o.hideInGrid ? "" : `
    <button class="work ${o.size ? "work--" + o.size : ""} reveal" data-uf="${o.uf}" data-i="${i}" aria-label="Abrir galeria: ${o.nome}">
      <img src="${o.fotos[0]}" alt="${o.nome} — ${o.cidade}/${o.uf}" loading="lazy">
      <span class="work__uf">${o.uf}</span>
      <span class="work__count">${o.fotos.length} foto${o.fotos.length > 1 ? "s" : ""}</span>
      <span class="work__body">
        <span class="work__seg">${o.seg}</span>
        <span class="work__name">${o.nome}</span>
        <span class="work__meta">${o.cidade} · ${o.uf}</span>
      </span>
      <span class="work__go" aria-hidden="true">↗</span>
    </button>`).join("");
  $$(".work", works).forEach((w) => { rev.observe(w); w.addEventListener("click", () => openLB(+w.dataset.i)); });

  $$("#filters .chip").forEach((c) => c.addEventListener("click", () => {
    $$("#filters .chip").forEach((x) => x.classList.toggle("is-on", x === c));
    const f = c.dataset.filter;
    $$(".work", works).forEach((w) => { const show = f === "all" || w.dataset.uf === f; w.classList.toggle("is-hidden", !show); if (show) w.classList.add("is-in"); });
  }));

  const lb = $("#lightbox");
  let lbO = 0, lbI = 0, lastFocus = null;
  function renderLB() {
    const o = window.OBRAS[lbO];
    const img = $("#lbImg");
    img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
    img.src = o.fotos[lbI]; img.alt = `${o.nome} — foto ${lbI + 1}`;
    $("#lbTitle").textContent = o.nome;
    $("#lbMeta").textContent = `${o.cidade}/${o.uf} · ${o.seg} — ${o.desc}`;
    $("#lbCount").textContent = `${lbI + 1} / ${o.fotos.length}`;
    $("#lbThumbs").innerHTML = o.fotos.map((f, k) => `<button class="${k === lbI ? "is-on" : ""}" data-k="${k}" aria-label="Foto ${k + 1}"><img src="${f}" alt=""></button>`).join("");
    $$("#lbThumbs button").forEach((b) => b.addEventListener("click", () => { lbI = +b.dataset.k; renderLB(); }));
    $$(".lightbox__arrow", lb).forEach((a) => (a.style.visibility = o.fotos.length > 1 ? "" : "hidden"));
  }
  function openLB(o, i = 0) {
    lbO = o; lbI = i; lastFocus = document.activeElement;
    lb.hidden = false; lb.classList.add("is-open"); document.body.style.overflow = "hidden";
    renderLB(); $(".lightbox__close", lb).focus();
  }
  window.argentoOpenObra = (id) => { const i = window.OBRAS.findIndex((o) => o.id === id); if (i > -1) openLB(i); };
  function closeLB() { lb.hidden = true; document.body.style.overflow = ""; lastFocus && lastFocus.focus(); }
  const stepLB = (d) => { const n = window.OBRAS[lbO].fotos.length; lbI = (lbI + d + n) % n; renderLB(); };
  $(".lightbox__close", lb).addEventListener("click", closeLB);
  $(".lightbox__arrow--prev", lb).addEventListener("click", () => stepLB(-1));
  $(".lightbox__arrow--next", lb).addEventListener("click", () => stepLB(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLB(); });
  addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLB();
    if (e.key === "ArrowRight") stepLB(1);
    if (e.key === "ArrowLeft") stepLB(-1);
  });
  let tx = null;
  lb.addEventListener("touchstart", (e) => (tx = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) stepLB(dx < 0 ? 1 : -1); tx = null; });

  /* ---------- obra em destaque ---------- */
  const feat = $("#destaque");
  if (D && feat) {
    if (!reduced) feat.classList.add("js-draw");
    new IntersectionObserver((en, o) => { if (en[0].isIntersecting) { feat.classList.add("is-drawn"); o.disconnect(); } }, { threshold: 0.3 }).observe(feat);
    if (D.fotos.length) {
      const box = $("#featPhotos");
      box.innerHTML = D.fotos.slice(0, 3).map((f, k) => `<button type="button" data-k="${k}" aria-label="Abrir foto ${k + 1} de ${D.nome}"><img src="${f}" alt="${D.nome} — foto ${k + 1}" loading="lazy"></button>`).join("");
      box.hidden = false; $(".feat__aerial", feat).hidden = true;
      $$("button", box).forEach((b) => b.addEventListener("click", () => openLB(window.OBRAS.findIndex((o) => o.id === D.id), +b.dataset.k)));
    }
    $("#featMap").addEventListener("click", () => {
      $("#map").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      initMap(); setTimeout(() => window.argentoFocusDestaque && window.argentoFocusDestaque(), 900);
    });
  }

  /* =========================================================
     PROCESSO — linha que preenche
     ========================================================= */
  const steps = $$(".step");
  const stepsEl = $("#steps");
  const line = $(".steps__line");
  const stepObs = new IntersectionObserver((en) => en.forEach((e) => e.isIntersecting && e.target.classList.add("is-in")), { rootMargin: "0px 0px -35% 0px" });
  steps.forEach((s) => stepObs.observe(s));
  function placeLine() { line.style.setProperty("--line-top", `${stepsEl.offsetTop + 30}px`); }
  function stepsProgress() {
    const r = stepsEl.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.65 - r.top) / r.height));
    line.style.setProperty("--p", p.toFixed(3));
  }
  placeLine(); addEventListener("resize", placeLine);

  /* =========================================================
     AVALIAÇÕES
     ========================================================= */
  const RV = window.AVALIACOES || [];
  const rail = $("#rvRail");
  const star = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5l2.6 5.5 6 .7-4.4 4.1 1.2 5.9L10 14.8 4.6 17.7l1.2-5.9L1.4 7.7l6-.7z"/></svg>';
  const stars = (n) => Array.from({ length: 5 }, (_, i) => `<span class="${i < Math.round(n) ? "on" : ""}">${star}</span>`).join("");
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  rail.innerHTML = RV.map((r, i) => `
    <article class="rv-card" aria-label="Avaliação ${i + 1} de ${RV.length}">
      <div class="rv-card__top">
        <span class="rv-stars" role="img" aria-label="${r.nota} de 5 estrelas">${stars(r.nota)}</span>
        ${r.exemplo ? '<span class="rv-tag">Exemplo</span>' : ""}
      </div>
      <p class="rv-card__text">${esc(r.texto)}</p>
      <footer class="rv-card__who">
        <span class="rv-av" aria-hidden="true">${esc(r.nome.trim()[0] || "?")}</span>
        <span><b>${esc(r.nome)}</b><small>${esc(r.cargo)}${r.obra ? " · " + esc(r.obra) : ""}</small></span>
        ${r.data ? `<time>${esc(r.data)}</time>` : ""}
      </footer>
    </article>`).join("");
  $("#rvNote").hidden = !RV.some((r) => r.exemplo);

  const cards = $$(".rv-card", rail);
  const rvDots = $("#rvDots");
  rvDots.innerHTML = cards.map((_, i) => `<button type="button" aria-label="Ir para avaliação ${i + 1}"></button>`).join("");
  const dotBtns = $$("button", rvDots);
  const current = () => { const x = rail.scrollLeft; let best = 0, d = Infinity; cards.forEach((c, i) => { const dd = Math.abs(c.offsetLeft - rail.offsetLeft - x); if (dd < d) { d = dd; best = i; } }); return best; };
  const goTo = (i) => { const c = cards[(i + cards.length) % cards.length]; rail.scrollTo({ left: c.offsetLeft - rail.offsetLeft, behavior: reduced ? "auto" : "smooth" }); };
  const syncDots = () => { const k = current(); dotBtns.forEach((b, i) => b.classList.toggle("is-on", i === k)); };
  dotBtns.forEach((b, i) => b.addEventListener("click", () => goTo(i)));
  $("#rvPrev").addEventListener("click", () => goTo(current() - 1));
  $("#rvNext").addEventListener("click", () => { const k = current(); const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4; goTo(atEnd ? 0 : k + 1); });
  rail.addEventListener("scroll", () => requestAnimationFrame(syncDots), { passive: true });
  rail.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") { e.preventDefault(); $("#rvNext").click(); } if (e.key === "ArrowLeft") { e.preventDefault(); $("#rvPrev").click(); } });
  syncDots();
  // autoplay suave, pausa quando o visitante interage
  let rvPaused = false, rvVisible = false;
  ["mouseenter", "focusin", "touchstart"].forEach((ev) => rail.addEventListener(ev, () => (rvPaused = true), { passive: true }));
  ["mouseleave", "focusout"].forEach((ev) => rail.addEventListener(ev, () => (rvPaused = false)));
  new IntersectionObserver((en) => (rvVisible = en[0].isIntersecting), { threshold: 0.4 }).observe(rail);
  if (!reduced) setInterval(() => { if (rvVisible && !rvPaused && !document.hidden) $("#rvNext").click(); }, 5500);

  /* =========================================================
     TELA DE ORÇAMENTO
     ========================================================= */
  const qModal = $("#quoteModal");
  let qLastFocus = null;
  function openQuote() {
    qLastFocus = document.activeElement;
    qModal.hidden = false; document.body.style.overflow = "hidden";
    if (window.argentoBot) window.argentoBot.close();
    setTimeout(() => $(".opt", qModal).focus({ preventScroll: true }), 60);
  }
  function closeQuote() { qModal.hidden = true; document.body.style.overflow = ""; qLastFocus && qLastFocus.focus && qLastFocus.focus({ preventScroll: true }); }
  window.argentoOpenQuote = openQuote;
  document.addEventListener("click", (e) => {
    const t = e.target.closest('[data-open-quote], a[href="#orcamento"]');
    if (!t) return;
    e.preventDefault(); openQuote();
  });
  $("#quoteClose").addEventListener("click", closeQuote);
  qModal.addEventListener("click", (e) => { if (e.target === qModal) closeQuote(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !qModal.hidden) closeQuote(); });

  /* =========================================================
     SIMULADOR DE ORÇAMENTO
     ========================================================= */
  const form = $("#quoteForm");
  $$(".opts", form).forEach((g) => {
    const multi = g.classList.contains("opts--multi");
    $$(".opt", g).forEach((b) => b.addEventListener("click", () => {
      if (multi) b.classList.toggle("is-on");
      else $$(".opt", g).forEach((x) => x.classList.toggle("is-on", x === b));
      b.setAttribute("aria-pressed", b.classList.contains("is-on"));
    }));
  });
  const area = $("#area"), alt = $("#altura");
  const fmt = (n) => n.toLocaleString("pt-BR");
  function fill(r) { r.style.setProperty("--fill", `${((r.value - r.min) / (r.max - r.min)) * 100}%`); }
  function estimate() {
    const A = +area.value, h = +alt.value;
    $("#areaOut").textContent = `${fmt(A)} m²`;
    $("#hOut").textContent = `${h.toFixed(1).replace(".", ",")} m`;
    fill(area); fill(alt);
    let lo, hi, unit;
    if (h > 4.5) { lo = Math.ceil(A / 4); hi = Math.ceil(A / 2.25); unit = "módulos de torre de escoramento (aprox.)"; }
    else { lo = Math.ceil(A / 1.8); hi = Math.ceil(A / 1.0); unit = "escoras metálicas (aprox.)"; }
    $("#estNum").textContent = `${fmt(lo)} – ${fmt(hi)}`;
    $("#estUnit").textContent = unit;
    return { A, h, lo, hi, unit };
  }
  [area, alt].forEach((r) => r.addEventListener("input", estimate));
  estimate();

  function buildMsg() {
    const val = (n) => $$(`.opts[data-name="${n}"] .opt.is-on`, form).map((b) => b.dataset.v).join(", ") || "não informado";
    const e = estimate();
    return [
      "Olá, Argento! Gostaria de um orçamento de escoramento.",
      "",
      `• Nome: ${$("#nome").value.trim()}`,
      $("#empresa").value.trim() ? `• Empresa: ${$("#empresa").value.trim()}` : null,
      `• Tipo de obra: ${val("tipo")}`,
      `• Elementos: ${val("elemento")}`,
      `• Área por concretagem: ${fmt(e.A)} m²`,
      `• Pé-direito: ${e.h.toFixed(1).replace(".", ",")} m`,
      `• Local: ${$("#cidade").value.trim() || "não informado"}`,
      `• Início: ${$("#inicio").value}`,
      `• Projeto estrutural: ${$("#temProjeto").checked ? "sim, posso enviar" : "ainda não"}`,
      "",
      `(Estimativa do site: ${fmt(e.lo)}–${fmt(e.hi)} ${e.unit})`,
    ].filter((l) => l !== null).join("\n");
  }
  function validate() {
    const f = $("#nome").closest(".field");
    const ok = $("#nome").value.trim().length >= 2;
    f.classList.toggle("is-error", !ok);
    $("#formMsg").textContent = ok ? "" : "Informe seu nome para continuarmos.";
    if (!ok) $("#nome").focus();
    return ok;
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;
    const url = waLink(buildMsg());
    window.open(url, "_blank", "noopener");
    $("#formMsg").innerHTML = `Pedido pronto! Se o WhatsApp não abriu, <a href="${url}" target="_blank" rel="noopener">toque aqui para enviar</a>.`;
  });
  $("#quoteMail").addEventListener("click", () => {
    if (!validate()) return;
    location.href = `mailto:${C.email}?subject=${encodeURIComponent("Orçamento de escoramento — site")}&body=${encodeURIComponent(buildMsg())}`;
  });

  /* =========================================================
     DÚVIDAS — busca com resposta instantânea
     ========================================================= */
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  window.argentoNorm = norm;
  const ans = (it) => (typeof it.a === "function" ? it.a() : it.a);
  const faqRes = $("#faqRes"), faqInput = $("#faqSearch");
  const escQ = (t) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function faqFind(q) {
    if (window.argentoBot && window.argentoBot.rank) return window.argentoBot.rank(q).slice(0, 2);
    const words = norm(q).split(/\s+/).filter((w) => w.length > 2);
    return window.KB.filter((it) => { const hay = norm(it.q + " " + it.k.join(" ")); return words.length && words.every((w) => hay.includes(w)); }).slice(0, 2);
  }
  function faqRender() {
    const q = faqInput.value.trim();
    if (q.length < 3) { faqRes.innerHTML = ""; return; }
    const found = faqFind(q);
    const wa = waLink(`Olá! Vim pelo site da Argento. Minha dúvida: ${q}`);
    const actions = (lead) => `
      <div class="fq-help">
        <span>${lead}</span>
        <button type="button" class="btn btn--teal btn--sm" data-ask-bot>Perguntar ao assistente</button>
        <a class="btn btn--wa btn--sm" href="${wa}" target="_blank" rel="noopener">Falar no WhatsApp</a>
      </div>`;
    faqRes.innerHTML = found.length
      ? found.map((it) => `<article class="fq-card"><h3>${it.q}</h3><div>${ans(it)}</div></article>`).join("") + actions("Não era isso?")
      : `<article class="fq-card fq-card--empty"><h3>Não encontrei uma resposta pronta para “${escQ(q)}”.</h3><p>O assistente pode responder agora — ou fale direto com a equipe.</p></article>` + actions("");
    bindContacts(faqRes);
    $$("[data-close]", faqRes).forEach((a) => a.removeAttribute("data-close"));
    $("[data-ask-bot]", faqRes).addEventListener("click", () => window.argentoBot && window.argentoBot.open(q));
  }
  let faqT;
  faqInput.addEventListener("input", () => { clearTimeout(faqT); faqT = setTimeout(faqRender, 180); });
  faqInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); clearTimeout(faqT); faqRender(); } });

  /* =========================================================
     MAPA (Leaflet, carregado sob demanda)
     ========================================================= */
  let map;
  function mosaicLayer(index, minZoom, maxNative, attribution) {
    const cache = {};
    const load = (src) => cache[src] || (cache[src] = new Promise((ok) => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => ok(null); im.src = src; }));
    const Layer = L.GridLayer.extend({
      createTile(c, done) {
        const tile = document.createElement("canvas"); tile.width = tile.height = 256;
        const zn = Math.min(c.z, maxNative), f = 2 ** (c.z - zn);
        const px = Math.floor(c.x / f), py = Math.floor(c.y / f);
        const m = (index[zn] || []).find((q) => px >= q.x0 && px < q.x0 + q.w && py >= q.y0 && py < q.y0 + q.h);
        if (!m) { setTimeout(() => done(null, tile)); return tile; }
        load(m.src).then((im) => {
          if (im) tile.getContext("2d").drawImage(im, (px - m.x0) * 256 + (c.x % f) * 256 / f, (py - m.y0) * 256 + (c.y % f) * 256 / f, 256 / f, 256 / f, 0, 0, 256, 256);
          done(null, tile);
        });
        return tile;
      },
    });
    return new Layer({ minZoom, maxZoom: 18, attribution });
  }
  function initMap() {
    if (map || !window.L) return;
    map = L.map("map", { scrollWheelZoom: false, zoomControl: true, attributionControl: true, maxZoom: 18 }).setView(C.hq, 7);
    const esri = "https://server.arcgisonline.com/ArcGIS/rest/services/";
    const attribution = "Tiles &copy; Esri — Esri, HERE, Garmin, &copy; OpenStreetMap contributors";
    const satAttribution = "Imagens &copy; Esri, Maxar, Earthstar Geographics";
    let streetLayers, satLayers;
    if (window.ARGENTO_TILES) { // tiles locais (versão de preview, sem acesso a servidores de mapa)
      const T = window.ARGENTO_TILES;
      map.setMinZoom(T.minZoom); map.setMaxBounds(T.bounds);
      const base = L.tileLayer(T.url, { minZoom: T.minZoom, maxNativeZoom: 8, maxZoom: 18, attribution });
      streetLayers = [base, mosaicLayer(T.mosaics.dark, 9, 15)];
      satLayers = [base, mosaicLayer(T.mosaics.color, 4, 18, satAttribution)];
    } else {
      streetLayers = [
        L.tileLayer(esri + "Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", { maxNativeZoom: 16, maxZoom: 18, attribution }),
        L.tileLayer(esri + "Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", { maxNativeZoom: 16, maxZoom: 18 }),
      ];
      satLayers = [
        L.tileLayer(esri + "World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxNativeZoom: 19, maxZoom: 18, attribution: satAttribution }),
        L.tileLayer(esri + "Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}", { minZoom: 12, maxNativeZoom: 19, maxZoom: 18 }),
        L.tileLayer(esri + "Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", { maxNativeZoom: 19, maxZoom: 18 }),
      ];
    }
    let satOn = true;
    satLayers.forEach((l) => l.addTo(map));
    const setSat = (on) => {
      satOn = on;
      (on ? streetLayers : satLayers).forEach((l) => map.removeLayer(l));
      (on ? satLayers : streetLayers).forEach((l) => l.addTo(map));
      $("#mapSat").classList.toggle("is-on", on);
    };
    $("#mapSat").addEventListener("click", () => setSat(!satOn));
    map.on("click", () => map.scrollWheelZoom.enable());
    map.on("mouseout", () => map.scrollWheelZoom.disable());

    let hqMarker;
    const hqIcon = L.divIcon({ className: "pin-wrap", html: '<div class="pin pin--hq"></div>', iconSize: [48, 54], iconAnchor: [24, 54], popupAnchor: [0, -50] });
    const sede = L.layerGroup([
      hqMarker = L.marker(C.hq, { icon: hqIcon, title: "Sede Argento" }).bindPopup(`<div class="pop"><b>Argento Escoramentos</b><span>${C.address}<br>${C.hours}</span><br><button type="button" class="pop__route" data-route-to="${C.hq.join(",")}" data-route-name="Argento Escoramentos" data-route-addr="${C.address}">Como chegar</button></div>`),
    ]);
    const obras = L.layerGroup(window.OBRAS.map((o, i) => {
      const ic = L.divIcon({ className: "pin-wrap", html: `<div class="pin">${o.uf}</div>`, iconSize: [30, 34], iconAnchor: [15, 34], popupAnchor: [0, -30] });
      return L.marker(o.coords, { icon: ic, title: o.nome }).bindPopup(
        `<div class="pop"><img src="${o.fotos[0]}" alt=""><b>${o.nome}</b><span>${o.cidade}/${o.uf} · ${o.seg}</span><br><button type="button" data-obra="${o.id}">Ver galeria (${o.fotos.length})</button> <button type="button" class="pop__zoom" data-zoom="${o.coords.join(",")}">Ver de perto</button> <button type="button" class="pop__route" data-route-to="${o.coords.join(",")}" data-route-name="${o.nome}">Como chegar</button></div>`
      );
    }));
    if (D) {
      const dIcon = L.divIcon({ className: "pin-wrap", html: '<div class="pin pin--star">★</div>', iconSize: [40, 46], iconAnchor: [20, 46], popupAnchor: [0, -42] });
      const dm = L.marker(D.coords, { icon: dIcon, title: D.nome, zIndexOffset: 1000 }).bindPopup(
        `<div class="pop">${D.fotos[0] ? `<img src="${D.fotos[0]}" alt="">` : ""}<b>★ ${D.nome}</b><span>${D.cidade}/${D.uf} · ${D.seg}</span><br><button type="button" data-destaque>Ver obra em destaque</button> <button type="button" class="pop__zoom" data-zoom="${D.coords.join(",")}">Ver de perto</button> <button type="button" class="pop__route" data-route-to="${D.coords.join(",")}" data-route-name="${D.nome}">Como chegar</button></div>`
      );
      obras.addLayer(dm);
      window.argentoFocusDestaque = () => { if (!map.hasLayer(obras)) { obras.addTo(map); $('[data-layer="obras"]').classList.add("is-on"); } map.flyTo(D.coords, Math.min(13, map.getMaxZoom()), { duration: 1.2 }); setTimeout(() => dm.openPopup(), 1300); };
    }
    window.argentoFocusSede = () => {
      if (!map.hasLayer(sede)) { sede.addTo(map); $('[data-layer="sede"]').classList.add("is-on"); }
      map.flyTo(C.hq, 15, { duration: 1.3 }); setTimeout(() => hqMarker.openPopup(), 1400);
    };
    sede.addTo(map); obras.addTo(map);
    const layers = { sede, obras };
    map.on("popupopen", (e) => {
      const el = e.popup.getElement();
      const b = el.querySelector("[data-obra]"); if (b) b.addEventListener("click", () => window.argentoOpenObra(b.dataset.obra));
      const d = el.querySelector("[data-destaque]"); if (d) d.addEventListener("click", () => $("#destaque").scrollIntoView({ behavior: "smooth", block: "start" }));
      const rb = el.querySelector("[data-route-to]");
      if (rb) rb.addEventListener("click", () => openRoutes(rb.dataset.routeName, rb.dataset.routeTo.split(",").map(Number), rb.dataset.routeAddr || ""));
      const zb = el.querySelector("[data-zoom]");
      if (zb) zb.addEventListener("click", () => { const c = zb.dataset.zoom.split(",").map(Number); map.closePopup(); setSat(true); map.flyTo(c, 17, { duration: 1.4 }); });
    });

    const fitAll = () => {
      const pts = [];
      if (map.hasLayer(sede)) pts.push(C.hq);
      if (map.hasLayer(obras)) { window.OBRAS.forEach((o) => pts.push(o.coords)); if (D) pts.push(D.coords); }
      if (pts.length) map.flyToBounds(L.latLngBounds(pts), { padding: [50, 50], duration: 1.2, maxZoom: 11 });
    };
    $$("[data-layer]").forEach((b) => b.addEventListener("click", () => {
      const l = layers[b.dataset.layer];
      if (map.hasLayer(l)) { map.removeLayer(l); b.classList.remove("is-on"); } else { l.addTo(map); b.classList.add("is-on"); }
      fitAll();
    }));
    $("#mapFit").addEventListener("click", fitAll);
    setTimeout(fitAll, 400);
  }
  /* ---------- como chegar (Uber, Mapas do iPhone, Waze, Google Maps) ---------- */
  const routeSheet = $("#routeSheet");
  let routeLastFocus = null;
  function openRoutes(name, coords, address = "") {
    const [la, lo] = coords, nm = encodeURIComponent(name);
    const links = {
      uber: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${la}&dropoff[longitude]=${lo}&dropoff[nickname]=${nm}${address ? `&dropoff[formatted_address]=${encodeURIComponent(address)}` : ""}`,
      apple: `https://maps.apple.com/?daddr=${la},${lo}&q=${nm}`,
      waze: `https://waze.com/ul?ll=${la},${lo}&navigate=yes`,
      google: `https://www.google.com/maps/dir/?api=1&destination=${la},${lo}`,
    };
    $$("[data-route]", routeSheet).forEach((a) => (a.href = links[a.dataset.route]));
    $("#rsTitle").textContent = name;
    $("#rsSub").textContent = address;
    routeLastFocus = document.activeElement;
    routeSheet.hidden = false;
    $("a", routeSheet).focus({ preventScroll: true });
  }
  function closeRoutes() { routeSheet.hidden = true; routeLastFocus && routeLastFocus.focus && routeLastFocus.focus({ preventScroll: true }); }
  window.argentoRoutes = openRoutes;
  $("#routeClose").addEventListener("click", closeRoutes);
  routeSheet.addEventListener("click", (e) => { if (e.target === routeSheet) closeRoutes(); });
  $$("a", routeSheet).forEach((a) => a.addEventListener("click", () => setTimeout(closeRoutes, 50)));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !routeSheet.hidden) closeRoutes(); });
  $("#routeBtn").addEventListener("click", (e) => { e.preventDefault(); openRoutes("Argento Escoramentos", C.hq, C.address); });

  /* ---------- botão redondo de mapa: leva até a sede ---------- */
  $("#mapFab").addEventListener("click", () => {
    $("#map").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    initMap();
    setTimeout(() => window.argentoFocusSede && window.argentoFocusSede(), 900);
  });
  new IntersectionObserver((en, o) => { if (en[0].isIntersecting) { initMap(); o.disconnect(); } }, { rootMargin: "300px" }).observe($("#map"));

  onScroll();
})();

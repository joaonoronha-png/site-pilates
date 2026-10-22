/* =========================================================
   ARGENTO ESCORAMENTOS — interações
   ========================================================= */
(() => {
  const C = window.ARGENTO;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- links de contato a partir do config ---------- */
  const waLink = (text = "Olá! Vim pelo site da Argento Escoramentos e gostaria de mais informações.") =>
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
      if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${en.target.id}`));
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
  }
  burger.addEventListener("click", () => toggleDrawer());
  $$("#drawer a").forEach((a) => a.addEventListener("click", () => toggleDrawer(false)));

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
  works.innerHTML = window.OBRAS.map((o, i) => `
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
     FAQ
     ========================================================= */
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  window.argentoNorm = norm;
  const ans = (it) => (typeof it.a === "function" ? it.a() : it.a);
  const faqItems = window.KB.filter((k) => k.faq);
  const all = window.KB;
  const faqList = $("#faqList");
  function renderFaq(list) {
    faqList.innerHTML = list.length
      ? list.map((it) => `<details class="faq__item"><summary>${it.q}</summary><div class="faq__a">${ans(it)}</div></details>`).join("")
      : `<p class="faq__empty">Nada encontrado — <button class="link-arrow" style="background:none;border:0;padding:0" data-open-bot>pergunte ao assistente</button>.</p>`;
    bindContacts(faqList);
    $$("[data-close]", faqList).forEach((a) => a.removeAttribute("data-close"));
    $$("[data-open-bot]", faqList).forEach((b) => b.addEventListener("click", () => window.argentoBot && window.argentoBot.open($("#faqSearch").value)));
  }
  renderFaq(faqItems);
  $("#faqSearch").addEventListener("input", (e) => {
    const q = norm(e.target.value.trim());
    if (!q) return renderFaq(faqItems);
    const words = q.split(/\s+/).filter((w) => w.length > 2);
    const res = all.filter((it) => {
      const hay = norm(it.q + " " + it.k.join(" ") + " " + ans(it).replace(/<[^>]+>/g, ""));
      return words.every((w) => hay.includes(w));
    });
    renderFaq(res);
    if (res.length === 1) faqList.querySelector("details").open = true;
  });
  // acordeão: abre um por vez
  faqList.addEventListener("toggle", (e) => { if (e.target.open) $$("details", faqList).forEach((d) => d !== e.target && (d.open = false)); }, true);

  /* =========================================================
     MAPA (Leaflet, carregado sob demanda)
     ========================================================= */
  let map;
  function initMap() {
    if (map || !window.L) return;
    map = L.map("map", { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView(C.hq, 7);
    const esri = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/";
    const attribution = "Tiles &copy; Esri — Esri, HERE, Garmin, &copy; OpenStreetMap contributors";
    if (window.ARGENTO_TILES) { // tiles locais (versão de preview)
      const T = window.ARGENTO_TILES;
      map.setMinZoom(T.minZoom); map.setMaxZoom(T.maxZoom); map.setMaxBounds(T.bounds);
      L.tileLayer(T.url, { minZoom: T.minZoom, maxZoom: T.maxZoom, attribution }).addTo(map);
    } else {
      L.tileLayer(esri + "World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16, attribution }).addTo(map);
      L.tileLayer(esri + "World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", { maxZoom: 16 }).addTo(map);
    }
    map.on("click", () => map.scrollWheelZoom.enable());
    map.on("mouseout", () => map.scrollWheelZoom.disable());

    const hqIcon = L.divIcon({ className: "pin-wrap", html: '<div class="pin pin--hq"></div>', iconSize: [48, 54], iconAnchor: [24, 54], popupAnchor: [0, -50] });
    const sede = L.layerGroup([
      L.marker(C.hq, { icon: hqIcon, title: "Sede Argento" }).bindPopup(`<div class="pop"><b>Argento Escoramentos</b><span>${C.address}<br>${C.hours}</span></div>`),
    ]);
    const obras = L.layerGroup(window.OBRAS.map((o, i) => {
      const ic = L.divIcon({ className: "pin-wrap", html: `<div class="pin">${o.uf}</div>`, iconSize: [30, 34], iconAnchor: [15, 34], popupAnchor: [0, -30] });
      return L.marker(o.coords, { icon: ic, title: o.nome }).bindPopup(
        `<div class="pop"><img src="${o.fotos[0]}" alt=""><b>${o.nome}</b><span>${o.cidade}/${o.uf} · ${o.seg}</span><br><button type="button" data-obra="${o.id}">Ver galeria (${o.fotos.length})</button></div>`
      );
    }));
    sede.addTo(map); obras.addTo(map);
    const layers = { sede, obras };
    map.on("popupopen", (e) => { const b = e.popup.getElement().querySelector("[data-obra]"); if (b) b.addEventListener("click", () => window.argentoOpenObra(b.dataset.obra)); });

    const fitAll = () => {
      const pts = [];
      if (map.hasLayer(sede)) pts.push(C.hq);
      if (map.hasLayer(obras)) window.OBRAS.forEach((o) => pts.push(o.coords));
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
  $("#routeBtn").href = `https://www.google.com/maps/dir/?api=1&destination=${C.hq.join(",")}`;
  new IntersectionObserver((en, o) => { if (en[0].isIntersecting) { initMap(); o.disconnect(); } }, { rootMargin: "300px" }).observe($("#map"));

  onScroll();
})();

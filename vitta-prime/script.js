(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
    sget(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    sset(k, v) { try { sessionStorage.setItem(k, v); } catch {} },
  };
  const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  /* ---------- INTRO ---------- */
  const intro = $("#intro");
  const hero = $(".hero");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let introTimer;
  function endIntro() {
    if (!intro || intro.classList.contains("is-leaving")) return;
    clearTimeout(introTimer);
    intro.classList.add("is-leaving");
    document.body.classList.remove("intro-on");
    hero.classList.add("is-in");
    store.sset("vp-intro", "1");
    setTimeout(() => intro.classList.add("is-done"), 1400);
  }
  if (intro && !reduced && !store.sget("vp-intro")) {
    document.body.classList.add("intro-on");
    introTimer = setTimeout(endIntro, 2700);
    $("#introSkip").addEventListener("click", endIntro);
    intro.addEventListener("click", (e) => { if (e.target === intro || e.target.classList.contains("intro__panel")) endIntro(); });
    addEventListener("keydown", (e) => { if (e.key === "Escape") endIntro(); });
  } else if (intro) {
    intro.classList.add("is-done");
    requestAnimationFrame(() => hero.classList.add("is-in"));
  }

  /* ---------- HEADER ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("is-solid", scrollY > 40);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  const burger = $("#burger");
  burger.addEventListener("click", () => {
    const open = header.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });
  $$("#nav a").forEach((a) => a.addEventListener("click", () => {
    header.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }));

  /* ---------- THEME ---------- */
  const root = document.documentElement;
  const saved = store.get("vp-theme");
  if (saved) root.dataset.theme = saved;
  $("#themeToggle").addEventListener("click", () => {
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    store.set("vp-theme", root.dataset.theme);
  });

  /* ---------- IMÓVEIS (dados ilustrativos) ---------- */
  const U = (id) => `https://images.unsplash.com/photo-${id}?w=900&q=75&auto=format&fit=crop`;
  const IMOVEIS = [
    { id: "VP-1024", mode: "venda", tipo: "Cobertura", bairro: "Barra da Tijuca", titulo: "Cobertura linear com vista para o mar", area: 310, quartos: 4, suites: 4, vagas: 3, preco: 6900000, img: U("1600596542815-ffad4c1539a9"), tag: "Exclusivo", destaque: 1 },
    { id: "VP-1031", mode: "venda", tipo: "Apartamento", bairro: "Jardim Oceânico", titulo: "Apartamento a 200 m da praia, próximo ao metrô", area: 128, quartos: 3, suites: 1, vagas: 2, preco: 2350000, img: U("1502672260266-1c1ef2d93688"), destaque: 2 },
    { id: "VP-1047", mode: "venda", tipo: "Casa em condomínio", bairro: "Barra da Tijuca", titulo: "Casa contemporânea em condomínio fechado", area: 520, quartos: 5, suites: 5, vagas: 4, preco: 8500000, img: U("1600585154340-be6161a56a0c"), tag: "Novo", destaque: 3 },
    { id: "VP-1052", mode: "venda", tipo: "Apartamento", bairro: "Península", titulo: "Andar alto com varanda gourmet e vista para a lagoa", area: 165, quartos: 3, suites: 3, vagas: 2, preco: 2980000, img: U("1600607687644-c7171b42498f"), destaque: 4 },
    { id: "VP-1060", mode: "venda", tipo: "Casa em condomínio", bairro: "Recreio dos Bandeirantes", titulo: "Casa com piscina e área gourmet", area: 380, quartos: 4, suites: 3, vagas: 4, preco: 3200000, img: U("1564013799919-ab600027ffc6"), destaque: 5 },
    { id: "VP-1068", mode: "venda", tipo: "Casa em condomínio", bairro: "Joá", titulo: "Residência com vista panorâmica do mar", area: 640, quartos: 5, suites: 5, vagas: 6, preco: 12500000, img: U("1512917774080-9991f1c4c750"), tag: "Exclusivo", destaque: 6 },
    { id: "VP-2011", mode: "aluguel", tipo: "Apartamento", bairro: "Barra da Tijuca", titulo: "Apartamento mobiliado em condomínio com lazer completo", area: 96, quartos: 2, suites: 1, vagas: 1, preco: 6800, img: U("1522708323590-d24dbb6b0267"), destaque: 1 },
    { id: "VP-2018", mode: "aluguel", tipo: "Cobertura", bairro: "Recreio dos Bandeirantes", titulo: "Cobertura duplex com piscina privativa", area: 240, quartos: 3, suites: 3, vagas: 3, preco: 14500, img: U("1600566753190-17f0baa2a6c3"), tag: "Novo", destaque: 2 },
    { id: "VP-2025", mode: "aluguel", tipo: "Sala comercial", bairro: "Barra da Tijuca", titulo: "Sala comercial em centro empresarial na Av. das Américas", area: 42, quartos: 0, suites: 0, vagas: 1, preco: 3900, img: U("1486406146926-c627a92ad1ab"), destaque: 3 },
    { id: "VP-2033", mode: "aluguel", tipo: "Apartamento", bairro: "Jardim Oceânico", titulo: "Três quartos reformado, a uma quadra da praia", area: 118, quartos: 3, suites: 1, vagas: 1, preco: 9200, img: U("1493809842364-78817add7ffb"), destaque: 4 },
    { id: "VP-2040", mode: "aluguel", tipo: "Casa em condomínio", bairro: "Itanhangá", titulo: "Casa em meio ao verde com quintal amplo", area: 410, quartos: 4, suites: 4, vagas: 4, preco: 18000, img: U("1600047509807-ba8f99d2cdde"), destaque: 5 },
    { id: "VP-3001", mode: "lancamento", tipo: "Apartamento", bairro: "Barra da Tijuca", titulo: "Residencial Orla Prime", area: 142, quartos: 3, suites: 3, vagas: 2, preco: 2890000, img: U("1545324418-cc1a3fa10c00"), tag: "Pré-venda", destaque: 1 },
    { id: "VP-3002", mode: "lancamento", tipo: "Apartamento", bairro: "Península", titulo: "Torre Lagoa: plantas de 2 a 4 suítes", area: 98, quartos: 2, suites: 2, vagas: 2, preco: 1650000, img: U("1560448204-e02f11c3d0e2"), tag: "Lançamento", destaque: 2 },
    { id: "VP-3003", mode: "lancamento", tipo: "Casa em condomínio", bairro: "Recreio dos Bandeirantes", titulo: "Condomínio de casas Vila Recreio", area: 260, quartos: 4, suites: 4, vagas: 3, preco: 2750000, img: U("1580587771525-78b9dba3b914"), tag: "Em obras", destaque: 3 },
  ];

  const state = { mode: "venda", bairro: "", tipo: "", quartos: 0, ordem: "destaque" };
  const favs = new Set(JSON.parse(store.get("vp-favs") || "[]"));
  const cards = $("#cards");
  const TITLES = { venda: "Imóveis à venda", aluguel: "Imóveis para alugar", lancamento: "Lançamentos e pré-vendas" };
  const ico = {
    area: '<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4zM4 9h5V4"/></svg>',
    bed: '<svg viewBox="0 0 24 24"><path d="M3 18V7M3 14h18v4M21 14v-3a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="11" r="1.5"/></svg>',
    car: '<svg viewBox="0 0 24 24"><path d="M5 16V11l2-5h10l2 5v5M3 16h18v3H3zM5 11h14"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  };

  function render() {
    let list = IMOVEIS.filter((i) =>
      i.mode === state.mode &&
      (!state.bairro || i.bairro === state.bairro) &&
      (!state.tipo || i.tipo === state.tipo) &&
      i.quartos >= state.quartos);
    const sorters = {
      destaque: (a, b) => a.destaque - b.destaque,
      menor: (a, b) => a.preco - b.preco,
      maior: (a, b) => b.preco - a.preco,
      area: (a, b) => b.area - a.area,
    };
    list.sort(sorters[state.ordem]);

    $("#listTitle").textContent = TITLES[state.mode];
    $("#fCount").textContent = `${list.length} ${list.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}`;
    $("#empty").hidden = list.length > 0;

    cards.innerHTML = list.map((i, n) => {
      const priceLabel = i.mode === "aluguel" ? "Aluguel" : i.mode === "lancamento" ? "A partir de" : "Venda";
      const suffix = i.mode === "aluguel" ? "<em>/mês</em>" : "";
      const m2 = i.mode !== "aluguel" ? `<li title="Preço por m²"><span>${brl(Math.round(i.preco / i.area))}/m²</span></li>` : "";
      const rooms = i.quartos ? `<li>${ico.bed}<b>${i.quartos}</b> quartos${i.suites ? ` · ${i.suites} suítes` : ""}</li>` : "";
      return `
      <article class="card" style="animation-delay:${n * 60}ms">
        <div class="card__media">
          <img src="${i.img}" alt="${i.titulo}" loading="lazy">
          ${i.tag ? `<span class="card__tag ${i.tag === "Exclusivo" ? "card__tag--gold" : ""}">${i.tag}</span>` : ""}
          <button type="button" class="card__fav" data-fav="${i.id}" aria-pressed="${favs.has(i.id)}" aria-label="Salvar ${i.titulo} nos favoritos">${ico.heart}</button>
        </div>
        <div class="card__body">
          <p class="card__loc">${i.bairro} · ${i.tipo}</p>
          <h3 class="card__title">${i.titulo}</h3>
          <ul class="card__specs">
            <li>${ico.area}<b>${i.area}</b> m²</li>
            ${rooms}
            <li>${ico.car}<b>${i.vagas}</b> ${i.vagas === 1 ? "vaga" : "vagas"}</li>
            ${m2}
          </ul>
          <div class="card__foot">
            <div class="card__price"><small>${priceLabel} · Cód. ${i.id}</small><strong>${brl(i.preco)}</strong>${suffix}</div>
            <a href="#contato" class="card__cta" data-interest="Imóvel ${i.id}: ${i.titulo}">Tenho interesse →</a>
          </div>
        </div>
      </article>`;
    }).join("");
  }

  function setMode(mode) {
    state.mode = mode;
    $$("#listTabs button, .search__tabs button").forEach((b) => {
      const on = b.dataset.mode === mode;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", String(on));
    });
    render();
  }
  function syncSelects() {
    $("#fBairro").value = state.bairro; $("#sBairro").value = state.bairro;
    $("#fTipo").value = state.tipo; $("#sTipo").value = state.tipo;
    $("#fQuartos").value = String(state.quartos); $("#sQuartos").value = String(state.quartos);
    $("#fOrdem").value = state.ordem;
  }
  function clearFilters() {
    Object.assign(state, { bairro: "", tipo: "", quartos: 0, ordem: "destaque" });
    syncSelects(); render();
  }
  const goList = () => $("#imoveis").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });

  $$("#listTabs button").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
  $$(".search__tabs button").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
  $$("a[data-mode]").forEach((a) => a.addEventListener("click", () => setMode(a.dataset.mode)));

  [["#fBairro", "bairro"], ["#fTipo", "tipo"], ["#fQuartos", "quartos"], ["#fOrdem", "ordem"]].forEach(([sel, key]) =>
    $(sel).addEventListener("change", (e) => {
      state[key] = key === "quartos" ? Number(e.target.value) : e.target.value;
      syncSelects(); render();
    }));
  $("#fClear").addEventListener("click", clearFilters);
  $("#emptyClear").addEventListener("click", clearFilters);

  $("#heroSearch").addEventListener("submit", (e) => {
    e.preventDefault();
    state.bairro = $("#sBairro").value;
    state.tipo = $("#sTipo").value;
    state.quartos = Number($("#sQuartos").value);
    syncSelects(); render(); goList();
  });
  $$("[data-quick]").forEach((b) => b.addEventListener("click", () => {
    state.tipo = b.dataset.quick; state.bairro = "";
    syncSelects(); render(); goList();
  }));
  $$("[data-quick-bairro], .hood").forEach((b) => b.addEventListener("click", () => {
    state.bairro = b.dataset.quickBairro || b.dataset.bairro; state.tipo = "";
    syncSelects(); render(); goList();
  }));

  cards.addEventListener("click", (e) => {
    const fav = e.target.closest("[data-fav]");
    if (!fav) return;
    const id = fav.dataset.fav;
    favs.has(id) ? favs.delete(id) : favs.add(id);
    fav.setAttribute("aria-pressed", String(favs.has(id)));
    store.set("vp-favs", JSON.stringify([...favs]));
    toast(favs.has(id) ? "Imóvel salvo nos favoritos" : "Imóvel removido dos favoritos");
  });

  /* ---------- Interesse → pré-preenche contato ---------- */
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-interest]");
    if (!el) return;
    const subj = $("#cAssunto");
    const txt = el.dataset.interest;
    if (/Avalia/.test(txt)) subj.value = "Avaliação do meu imóvel";
    else if (/Lançamento/.test(txt) || state.mode === "lancamento") subj.value = "Lançamentos";
    else subj.value = state.mode === "aluguel" ? "Alugar um imóvel" : "Comprar um imóvel";
    $("#cMsg").value = `Olá! Tenho interesse em: ${txt}.`;
  });

  /* ---------- AVALIAÇÃO ---------- */
  $("#evalForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const m2 = Number($("#eBairro").value);
    const area = Number($("#eArea").value);
    const ok = m2 > 0 && area >= 20;
    $("#eBairro").closest(".input").classList.toggle("is-invalid", !m2);
    $("#eArea").closest(".input").classList.toggle("is-invalid", !(area >= 20));
    $("#evalError").hidden = ok;
    if (!ok) { $("#estimate").hidden = true; return; }
    const base = m2 * Number($("#eTipo").value) * Number($("#eEstado").value);
    const mid = base * area;
    const round = (n) => Math.round(n / 10000) * 10000;
    $("#estValue").textContent = `${brl(round(mid * 0.92))} – ${brl(round(mid * 1.08))}`;
    $("#estM2").textContent = `Referência de ${brl(Math.round(base))}/m² para ${$("#eBairro").selectedOptions[0].text}.`;
    $("#estimate").hidden = false;
  });

  /* ---------- FORMS ---------- */
  function handleForm(formSel, okSel, required, msg) {
    $(formSel).addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      required.forEach((id) => {
        const el = $(id);
        const bad = !el.value.trim();
        el.closest(".input").classList.toggle("is-invalid", bad);
        if (bad) valid = false;
      });
      const ok = $(okSel);
      if (!valid) { ok.hidden = true; toast("Preencha os campos destacados."); return; }
      ok.textContent = msg(); ok.hidden = false;
      e.target.reset();
    });
  }
  handleForm("#ownerForm", "#ownerOk", ["#oNome", "#oFone", "#oBairro"],
    () => `Obrigado, ${$("#oNome").value.split(" ")[0]}! Um corretor vai entrar em contato pelo WhatsApp informado para agendar a visita de captação.`);
  handleForm("#contactForm", "#contactOk", ["#cNome", "#cFone"],
    () => `Recebemos sua mensagem, ${$("#cNome").value.split(" ")[0]}. Um corretor responde em breve.`);

  /* ---------- COPY ---------- */
  $$("[data-copy]").forEach((b) => b.addEventListener("click", () => {
    const el = $("#" + b.dataset.copy);
    const txt = el.textContent.trim();
    const fallback = () => { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast("Número selecionado. Use Ctrl+C para copiar."); };
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => toast("Número copiado"), fallback);
    else fallback();
  }));

  /* ---------- TOAST ---------- */
  let toastT;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(() => (t.hidden = true), 2600);
  }

  render();
})();

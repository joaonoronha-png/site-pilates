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
  const U = (id) => `https://images.unsplash.com/photo-${id}?w=1200&q=75&auto=format&fit=crop`;
  const INTERIORES = ["1600607687939-ce8a6c25118c", "1600566753190-17f0baa2a6c3", "1493809842364-78817add7ffb", "1502672260266-1c1ef2d93688", "1522708323590-d24dbb6b0267", "1600607687644-c7171b42498f"];
  const LAZER_CLUBE = ["Piscina adulto e infantil", "Academia", "Salão de festas", "Espaço gourmet", "Playground", "Quadra poliesportiva", "Portaria 24h"];
  const IMOVEIS = [
    { id: "VP-1024", mode: "venda", tipo: "Cobertura", bairro: "Barra da Tijuca", titulo: "Cobertura linear com vista para o mar", area: 310, quartos: 4, suites: 4, vagas: 3, banheiros: 6, preco: 6900000, condo: 4200, iptu: 1350, foto: "1600596542815-ffad4c1539a9", tag: "Exclusivo", destaque: 1,
      desc: "Cobertura linear de frente para a praia, com terraço de 120 m², piscina privativa e churrasqueira. Sala em três ambientes com vista para o mar, cozinha planejada e suíte master com closet e banheira.",
      caract: ["Piscina privativa", "Terraço 120 m²", "Vista mar", "Closet", "Cozinha planejada", "Ar-condicionado", "Depósito"], lazer: ["Portaria 24h", "Academia", "Piscina", "Salão de festas"] },
    { id: "VP-1031", mode: "venda", tipo: "Apartamento", bairro: "Jardim Oceânico", titulo: "Apartamento a 200 m da praia, próximo ao metrô", area: 128, quartos: 3, suites: 1, vagas: 2, banheiros: 3, preco: 2350000, condo: 1900, iptu: 520, foto: "1502672260266-1c1ef2d93688", destaque: 2,
      desc: "Três quartos com suíte em rua arborizada do Jardim Oceânico, a poucos minutos a pé da estação de metrô e da praia. Varanda, dependência completa e duas vagas.",
      caract: ["Varanda", "Dependência completa", "Armários embutidos", "Andar alto", "Sol da manhã"], lazer: ["Portaria 24h", "Salão de festas", "Playground"] },
    { id: "VP-1047", mode: "venda", tipo: "Casa em condomínio", bairro: "Barra da Tijuca", titulo: "Casa contemporânea em condomínio fechado", area: 520, quartos: 5, suites: 5, vagas: 4, banheiros: 7, preco: 8500000, condo: 3100, iptu: 2100, foto: "1600585154340-be6161a56a0c", tag: "Novo", destaque: 3,
      desc: "Casa de arquitetura contemporânea em condomínio com segurança 24h. Pé-direito duplo, integração total com a área externa, piscina com raia, sauna e cinco suítes.",
      caract: ["Piscina com raia", "Sauna", "Pé-direito duplo", "Automação", "Energia solar", "Jardim"], lazer: ["Segurança 24h", "Quadra de tênis", "Clube", "Ciclovia interna"] },
    { id: "VP-1052", mode: "venda", tipo: "Apartamento", bairro: "Península", titulo: "Andar alto com varanda gourmet e vista para a lagoa", area: 165, quartos: 3, suites: 3, vagas: 2, banheiros: 4, preco: 2980000, condo: 2600, iptu: 640, foto: "1600607687644-c7171b42498f", destaque: 4,
      desc: "Apartamento em andar alto na Península, com varanda gourmet voltada para a lagoa e o verde. Três suítes, lavabo e lazer completo de clube.",
      caract: ["Varanda gourmet", "Vista lagoa", "Lavabo", "Andar alto", "Porcelanato"], lazer: LAZER_CLUBE },
    { id: "VP-1060", mode: "venda", tipo: "Casa em condomínio", bairro: "Recreio dos Bandeirantes", titulo: "Casa com piscina e área gourmet", area: 380, quartos: 4, suites: 3, vagas: 4, banheiros: 5, preco: 3200000, condo: 1500, iptu: 980, foto: "1564013799919-ab600027ffc6", destaque: 5,
      desc: "Casa duplex com quintal amplo, piscina e área gourmet coberta, em condomínio tranquilo a poucos minutos da praia do Recreio.",
      caract: ["Piscina", "Área gourmet", "Quintal", "Escritório", "Placas solares"], lazer: ["Segurança 24h", "Playground", "Quadra"] },
    { id: "VP-1068", mode: "venda", tipo: "Casa em condomínio", bairro: "Joá", titulo: "Residência com vista panorâmica do mar", area: 640, quartos: 5, suites: 5, vagas: 6, banheiros: 8, preco: 12500000, condo: 3800, iptu: 3200, foto: "1512917774080-9991f1c4c750", tag: "Exclusivo", destaque: 6,
      desc: "Residência no alto do Joá com vista aberta para o mar e a Barra. Piscina de borda infinita, adega, cinema e suítes com varanda.",
      caract: ["Piscina borda infinita", "Vista mar", "Adega", "Cinema", "Elevador", "Gerador"], lazer: ["Segurança 24h", "Rua fechada"] },
    { id: "VP-2011", mode: "aluguel", tipo: "Apartamento", bairro: "Barra da Tijuca", titulo: "Apartamento mobiliado em condomínio com lazer completo", area: 96, quartos: 2, suites: 1, vagas: 1, banheiros: 2, preco: 6800, condo: 1400, iptu: 280, foto: "1522708323590-d24dbb6b0267", destaque: 1,
      desc: "Dois quartos mobiliado e equipado, pronto para morar, em condomínio-clube próximo a shoppings e à Av. das Américas.",
      caract: ["Mobiliado", "Varanda", "Ar-condicionado", "Armários"], lazer: LAZER_CLUBE },
    { id: "VP-2018", mode: "aluguel", tipo: "Cobertura", bairro: "Recreio dos Bandeirantes", titulo: "Cobertura duplex com piscina privativa", area: 240, quartos: 3, suites: 3, vagas: 3, banheiros: 4, preco: 14500, condo: 2200, iptu: 610, foto: "1600566753190-17f0baa2a6c3", tag: "Novo", destaque: 2,
      desc: "Cobertura duplex com terraço, piscina e churrasqueira, a duas quadras da praia do Recreio.",
      caract: ["Piscina privativa", "Terraço", "Churrasqueira", "Vista mar lateral"], lazer: ["Portaria 24h", "Academia", "Salão de festas"] },
    { id: "VP-2025", mode: "aluguel", tipo: "Sala comercial", bairro: "Barra da Tijuca", titulo: "Sala comercial em centro empresarial na Av. das Américas", area: 42, quartos: 0, suites: 0, vagas: 1, banheiros: 1, preco: 3900, condo: 950, iptu: 210, foto: "1486406146926-c627a92ad1ab", destaque: 3,
      desc: "Sala pronta com divisórias, piso elevado e ar central, em centro empresarial com recepção, estacionamento e fácil acesso ao BRT.",
      caract: ["Ar central", "Piso elevado", "Copa", "Banheiro privativo"], lazer: ["Recepção", "Estacionamento", "Auditório"] },
    { id: "VP-2033", mode: "aluguel", tipo: "Apartamento", bairro: "Jardim Oceânico", titulo: "Três quartos reformado, a uma quadra da praia", area: 118, quartos: 3, suites: 1, vagas: 1, banheiros: 2, preco: 9200, condo: 1700, iptu: 390, foto: "1493809842364-78817add7ffb", destaque: 4,
      desc: "Reformado com cozinha americana, iluminação em LED e varanda integrada. Rua tranquila a uma quadra da praia e perto do metrô.",
      caract: ["Reformado", "Cozinha americana", "Varanda integrada", "Armários"], lazer: ["Portaria 24h", "Piscina"] },
    { id: "VP-2040", mode: "aluguel", tipo: "Casa em condomínio", bairro: "Itanhangá", titulo: "Casa em meio ao verde com quintal amplo", area: 410, quartos: 4, suites: 4, vagas: 4, banheiros: 5, preco: 18000, condo: 1900, iptu: 1100, foto: "1600047509807-ba8f99d2cdde", destaque: 5,
      desc: "Casa em condomínio arborizado no Itanhangá, com quintal, piscina, espaço gourmet e vista para a mata.",
      caract: ["Piscina", "Quintal", "Espaço gourmet", "Vista verde", "Home office"], lazer: ["Segurança 24h", "Trilhas", "Quadra"] },
    { id: "VP-3001", mode: "lancamento", stage: "Pré-lançamento", tipo: "Apartamento", bairro: "Barra da Tijuca", titulo: "Residencial Orla Prime", area: 142, quartos: 3, suites: 3, vagas: 2, banheiros: 4, preco: 2890000, foto: "1545324418-cc1a3fa10c00", destaque: 1, entrega: "Dez/2028", obra: 0,
      desc: "Apartamentos de 3 e 4 suítes a poucos passos da praia, com plantas flexíveis, varanda gourmet e lazer completo de clube no rooftop.",
      plantas: [["3 suítes", 142, 3, 2, 2890000], ["3 suítes ampliado", 168, 3, 2, 3350000], ["4 suítes", 210, 4, 3, 4290000], ["Cobertura 4 suítes", 260, 4, 4, 5900000]],
      caract: ["Varanda gourmet", "Planta flexível", "Infra para ar-condicionado", "Medição individual"], lazer: ["Rooftop com piscina", "Academia", "Coworking", "Espaço gourmet", "Brinquedoteca", "Pet place"] },
    { id: "VP-3002", mode: "lancamento", stage: "Lançamento", tipo: "Apartamento", bairro: "Península", titulo: "Torre Lagoa", area: 98, quartos: 2, suites: 2, vagas: 2, banheiros: 3, preco: 1650000, foto: "1560448204-e02f11c3d0e2", destaque: 2, entrega: "Jun/2028", obra: 8,
      desc: "Torre única junto à lagoa, com plantas de 2 a 4 suítes, varanda em todos os apartamentos e lazer integrado ao paisagismo.",
      plantas: [["2 suítes", 98, 2, 2, 1650000], ["3 suítes", 132, 3, 2, 2240000], ["4 suítes", 178, 4, 3, 3100000]],
      caract: ["Varanda", "Fechadura digital", "Tomadas USB", "Vaga para carro elétrico"], lazer: ["Piscina", "Academia", "Salão de festas", "Deck na lagoa"] },
    { id: "VP-3003", mode: "lancamento", stage: "Em obras", tipo: "Casa em condomínio", bairro: "Recreio dos Bandeirantes", titulo: "Vila Recreio", area: 260, quartos: 4, suites: 4, vagas: 3, banheiros: 5, preco: 2750000, foto: "1580587771525-78b9dba3b914", destaque: 3, entrega: "Mar/2027", obra: 62,
      desc: "Condomínio de casas com quintal privativo e piscina, a cinco minutos da praia do Recreio.",
      plantas: [["Casa 4 suítes", 260, 4, 3, 2750000], ["Casa 4 suítes + terraço", 300, 4, 3, 3150000]],
      caract: ["Quintal privativo", "Piscina", "Terraço", "Espaço gourmet"], lazer: ["Portaria 24h", "Clube", "Quadra", "Playground"] },
    { id: "VP-3004", mode: "lancamento", stage: "Pré-lançamento", tipo: "Apartamento", bairro: "Jardim Oceânico", titulo: "Oceânico 360", area: 74, quartos: 2, suites: 1, vagas: 1, banheiros: 2, preco: 1290000, foto: "1600210492486-724fe5c67fb0", destaque: 4, entrega: "Out/2029", obra: 0,
      desc: "Studios e apartamentos de 1 e 2 quartos a uma quadra do metrô Jardim Oceânico, com rooftop e lojas no térreo.",
      plantas: [["Studio", 38, 0, 0, 690000], ["1 quarto", 52, 1, 1, 920000], ["2 quartos", 74, 1, 1, 1290000]],
      caract: ["Perto do metrô", "Lojas no térreo", "Lavanderia compartilhada"], lazer: ["Rooftop", "Coworking", "Academia", "Bicicletário"] },
    { id: "VP-3005", mode: "lancamento", stage: "Lançamento", tipo: "Cobertura", bairro: "Barra da Tijuca", titulo: "Mirante Marapendi", area: 190, quartos: 4, suites: 4, vagas: 3, banheiros: 5, preco: 3990000, foto: "1515263487990-61b07816b324", destaque: 5, entrega: "Dez/2028", obra: 5,
      desc: "Apartamentos e coberturas com vista para a Lagoa de Marapendi e o mar, em torre com apenas dois apartamentos por andar.",
      plantas: [["4 suítes", 190, 4, 3, 3990000], ["Cobertura duplex", 340, 4, 4, 7800000]],
      caract: ["Dois por andar", "Vista lagoa e mar", "Elevador privativo"], lazer: LAZER_CLUBE },
    { id: "VP-3006", mode: "lancamento", stage: "Em obras", tipo: "Apartamento", bairro: "Itanhangá", titulo: "Reserva Itanhangá", area: 115, quartos: 3, suites: 1, vagas: 2, banheiros: 3, preco: 1480000, foto: "1598928506311-c55ded91a20c", destaque: 6, entrega: "Ago/2027", obra: 45,
      desc: "Condomínio cercado de verde, com 70% de área livre, trilhas e lazer de clube, perto da Barra e do Alto da Boa Vista.",
      plantas: [["2 quartos", 82, 1, 1, 1090000], ["3 quartos", 115, 1, 2, 1480000]],
      caract: ["Área verde", "Varanda", "Bicicletário"], lazer: ["Trilhas", "Piscina", "Academia", "Horta comunitária"] },
  ];
  const COORDS = {
    "VP-1024": [-23.0112, -43.3585], "VP-1031": [-23.0079, -43.3105], "VP-1047": [-23.0030, -43.3790], "VP-1052": [-22.9978, -43.3445],
    "VP-1060": [-23.0150, -43.4560], "VP-1068": [-23.0072, -43.2895], "VP-2011": [-23.0005, -43.3660], "VP-2018": [-23.0185, -43.4695],
    "VP-2025": [-23.0002, -43.3500], "VP-2033": [-23.0093, -43.3150], "VP-2040": [-22.9905, -43.3045], "VP-3001": [-23.0035, -43.3925],
    "VP-3002": [-22.9960, -43.3480], "VP-3003": [-23.0125, -43.4410], "VP-3004": [-23.0058, -43.3085], "VP-3005": [-23.0040, -43.4020],
    "VP-3006": [-22.9875, -43.3110],
  };
  IMOVEIS.forEach((i, n) => {
    [i.lat, i.lng] = COORDS[i.id];
    i.img = U(i.foto);
    const pool = INTERIORES.filter((f) => f !== i.foto);
    i.fotos = [i.foto, ...[0, 1, 2].map((k) => pool[(n + k * 2) % pool.length])].map(U);
    if (!i.tag && i.stage) i.tag = i.stage;
  });
  const byId = (id) => IMOVEIS.find((i) => i.id === id);

  const state = { mode: "venda", bairro: "", tipo: "", quartos: 0, ordem: "destaque", stage: "" };
  const favs = new Set(JSON.parse(store.get("vp-favs") || "[]"));
  const cards = $("#cards");
  const TITLES = { venda: "Imóveis à venda", aluguel: "Imóveis para alugar", lancamento: "Lançamentos" };
  const ico = {
    area: '<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4zM4 9h5V4"/></svg>',
    bed: '<svg viewBox="0 0 24 24"><path d="M3 18V7M3 14h18v4M21 14v-3a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="11" r="1.5"/></svg>',
    car: '<svg viewBox="0 0 24 24"><path d="M5 16V11l2-5h10l2 5v5M3 16h18v3H3zM5 11h14"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  };
  const priceLabel = (i) => (i.mode === "aluguel" ? "Aluguel" : i.mode === "lancamento" ? "A partir de" : "Venda");
  const priceText = (i) => brl(i.preco) + (i.mode === "aluguel" ? "/mês" : "");

  function cardHtml(i, n) {
    const m2 = i.mode !== "aluguel" ? `<li><span>${brl(Math.round(i.preco / i.area))}/m²</span></li>` : "";
    const rooms = i.quartos ? `<li>${ico.bed}<b>${i.quartos}</b> ${i.quartos === 1 ? "quarto" : "quartos"}${i.suites ? ` · ${i.suites} ${i.suites === 1 ? "suíte" : "suítes"}` : ""}</li>` : "";
    const area = i.plantas ? `${Math.min(...i.plantas.map((p) => p[1]))}–${Math.max(...i.plantas.map((p) => p[1]))}` : i.area;
    return `
      <article class="card" style="animation-delay:${n * 50}ms">
        <button type="button" class="card__open" data-open="${i.id}" aria-label="Ver detalhes: ${i.titulo}"></button>
        <div class="card__media">
          <img src="${i.img}" alt="" loading="lazy" draggable="false">
          ${i.tag ? `<span class="card__tag ${i.tag === "Exclusivo" ? "card__tag--accent" : ""}">${i.tag}</span>` : ""}
          <button type="button" class="card__fav" data-fav="${i.id}" aria-pressed="${favs.has(i.id)}" aria-label="Salvar ${i.titulo} nos favoritos">${ico.heart}</button>
        </div>
        <div class="card__body">
          <p class="card__loc">${i.bairro} · ${i.tipo}</p>
          <h3 class="card__title">${i.titulo}</h3>
          <ul class="card__specs">
            <li>${ico.area}<b>${area}</b> m²</li>
            ${rooms}
            <li>${ico.car}<b>${i.vagas}</b> ${i.vagas === 1 ? "vaga" : "vagas"}</li>
            ${m2}
          </ul>
          <div class="card__foot">
            <div class="card__price"><small>${priceLabel(i)}</small><strong>${brl(i.preco)}</strong>${i.mode === "aluguel" ? "<em>/mês</em>" : ""}</div>
            <span class="card__cta">Ver detalhes →</span>
          </div>
        </div>
      </article>`;
  }

  function render() {
    const list = IMOVEIS.filter((i) =>
      i.mode === state.mode &&
      (!state.bairro || i.bairro === state.bairro) &&
      (!state.tipo || i.tipo === state.tipo) &&
      (!state.stage || i.stage === state.stage) &&
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
    $("#stageChips").hidden = state.mode !== "lancamento";
    cards.closest(".rail").hidden = list.length === 0;
    cards.innerHTML = list.map(cardHtml).join("");
    cards.scrollLeft = 0;
    updateRail(cards);
  }

  function setMode(mode) {
    state.mode = mode;
    if (mode !== "lancamento") state.stage = "";
    $$("#listTabs button, .search__tabs button").forEach((b) => {
      const on = b.dataset.mode === mode;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", String(on));
    });
    $$("#stageChips button").forEach((b) => b.classList.toggle("is-active", b.dataset.stage === state.stage));
    render();
  }
  function syncSelects() {
    $("#fBairro").value = state.bairro; $("#sBairro").value = state.bairro;
    $("#fTipo").value = state.tipo; $("#sTipo").value = state.tipo;
    $("#fQuartos").value = String(state.quartos); $("#sQuartos").value = String(state.quartos);
    $("#fOrdem").value = state.ordem;
  }
  function clearFilters() {
    Object.assign(state, { bairro: "", tipo: "", quartos: 0, ordem: "destaque", stage: "" });
    $$("#stageChips button").forEach((b) => b.classList.toggle("is-active", b.dataset.stage === ""));
    syncSelects(); render();
  }
  const goList = () => $("#imoveis").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });

  $$("#listTabs button, .search__tabs button").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
  $$("a[data-mode]").forEach((a) => a.addEventListener("click", () => setMode(a.dataset.mode)));
  $$("#stageChips button").forEach((b) => b.addEventListener("click", () => {
    state.stage = b.dataset.stage;
    $$("#stageChips button").forEach((x) => x.classList.toggle("is-active", x === b));
    render();
  }));
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

  document.addEventListener("click", (e) => {
    const fav = e.target.closest("[data-fav]");
    if (!fav) return;
    const id = fav.dataset.fav;
    favs.has(id) ? favs.delete(id) : favs.add(id);
    $$(`[data-fav="${id}"]`).forEach((b) => b.setAttribute("aria-pressed", String(favs.has(id))));
    store.set("vp-favs", JSON.stringify([...favs]));
    toast(favs.has(id) ? "Imóvel salvo nos favoritos" : "Imóvel removido dos favoritos");
  });

  /* ---------- CARROSSÉIS: setas, arrastar com o mouse e barra de progresso ---------- */
  function updateRail(track) {
    const rail = track.closest(".rail");
    const max = track.scrollWidth - track.clientWidth;
    const bar = $(".rail__progress i", rail);
    if (bar) {
      const w = track.scrollWidth ? track.clientWidth / track.scrollWidth : 1;
      bar.style.width = `${Math.min(100, w * 100)}%`;
      bar.style.marginLeft = `${track.scrollWidth ? (track.scrollLeft / track.scrollWidth) * 100 : 0}%`;
    }
    $$(".rail__btn", rail).forEach((b) => (b.disabled = b.dataset.dir === "-1" ? track.scrollLeft <= 2 : track.scrollLeft >= max - 2));
  }
  function initRail(rail) {
    const track = $(".rail__track", rail);
    $$(".rail__btn", rail).forEach((b) => b.addEventListener("click", () =>
      track.scrollBy({ left: Number(b.dataset.dir) * track.clientWidth * 0.9, behavior: reduced ? "auto" : "smooth" })));
    track.addEventListener("scroll", () => updateRail(track), { passive: true });
    addEventListener("resize", () => updateRail(track));
    let down = null, moved = false;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = { x: e.clientX, left: track.scrollLeft }; moved = false;
    });
    addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - down.x;
      if (!moved && Math.abs(dx) > 6) { moved = true; track.classList.add("is-dragging"); }
      if (moved) track.scrollLeft = down.left - dx;
    });
    addEventListener("pointerup", () => {
      if (!down) return;
      down = null;
      if (moved) {
        track.classList.remove("is-dragging");
        const left = track.scrollLeft, w = track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width : 1;
        track.scrollTo({ left: Math.round(left / w) * w, behavior: reduced ? "auto" : "smooth" });
        // evita que o clique ao soltar abra um card
        track.addEventListener("click", (ev) => { ev.stopPropagation(); ev.preventDefault(); }, { capture: true, once: true });
        setTimeout(() => (moved = false), 0);
      }
    });
    updateRail(track);
  }

  /* ---------- EXPLORE: guias ---------- */
  const GUIAS = [
    { id: "comprar-passo-a-passo", cat: "Comprar", titulo: "Comprar um imóvel: o passo a passo", resumo: "Da primeira visita ao registro no cartório, sem surpresas.", foto: "1600596542815-ffad4c1539a9",
      body: `<p>Comprar bem é seguir uma ordem. Este é o caminho que usamos com nossos clientes.</p>
      <ol><li><b>Defina o orçamento total.</b> Some entrada, parcelas e os custos da compra (ITBI, escritura e registro).</li>
      <li><b>Visite com critério.</b> Compare pelo menos três imóveis da mesma região e anote condomínio, IPTU e estado de conservação.</li>
      <li><b>Faça a proposta por escrito.</b> Inclua valor, forma de pagamento e prazo de validade.</li>
      <li><b>Analise a documentação.</b> Matrícula atualizada do imóvel, certidões do vendedor e declaração de quitação do condomínio.</li>
      <li><b>Assine o contrato e pague o sinal.</b> O contrato de promessa de compra e venda define prazos e multas.</li>
      <li><b>Financiamento, se houver.</b> O banco avalia o imóvel e aprova o crédito.</li>
      <li><b>Pague o ITBI, lavre a escritura e registre.</b> O imóvel só é seu depois do registro no Cartório de Registro de Imóveis.</li></ol>` },
    { id: "financiamento", cat: "Comprar", titulo: "Como funciona o financiamento imobiliário", resumo: "Entrada, tabelas SAC e Price, FGTS e como comparar bancos.", foto: "1600607687939-ce8a6c25118c",
      body: `<p>O financiamento permite pagar o imóvel em parcelas, com o próprio imóvel como garantia (alienação fiduciária).</p>
      <h3>Entrada</h3><p>Os bancos costumam financiar só parte do valor. O restante é a entrada, paga com recursos próprios ou FGTS.</p>
      <h3>SAC ou Price</h3><ul><li><b>SAC:</b> parcelas começam mais altas e diminuem ao longo do tempo. O total de juros é menor.</li>
      <li><b>Price:</b> parcelas fixas no início, mais fáceis de encaixar no orçamento, mas com mais juros no total.</li></ul>
      <h3>FGTS</h3><p>Pode ser usado na entrada ou para amortizar, desde que o imóvel seja residencial, para moradia própria, e você cumpra as regras da Caixa.</p>
      <h3>Compare o CET</h3><p>Simule em pelo menos três bancos e compare o Custo Efetivo Total (CET), não só a taxa de juros.</p>` },
    { id: "custos-da-compra", cat: "Comprar", titulo: "Custos além do preço: ITBI, escritura e registro", resumo: "Quanto reservar para as despesas de cartório e impostos.", foto: "1545324418-cc1a3fa10c00",
      body: `<p>Além do valor do imóvel, a compra tem custos obrigatórios. Planeje-os desde o início.</p>
      <ul><li><b>ITBI:</b> imposto municipal pago antes da escritura. No Rio de Janeiro a alíquota é de 3% sobre o valor do imóvel.</li>
      <li><b>Escritura:</b> lavrada em Cartório de Notas, com valor definido pela tabela de emolumentos do estado.</li>
      <li><b>Registro:</b> feito no Cartório de Registro de Imóveis. É ele que transfere a propriedade.</li>
      <li><b>Financiamento:</b> quando há banco, o contrato do banco substitui a escritura, mas há taxa de avaliação do imóvel.</li></ul>
      <p>Uma regra prática é reservar de 4% a 5% do valor do imóvel para essas despesas.</p>` },
    { id: "morar-na-barra", cat: "Comprar", titulo: "Morar na Barra e arredores: guia de bairros", resumo: "Jardim Oceânico, Península, Recreio, Itanhangá e Joá.", foto: "1483729558449-99ef09a8c325",
      body: `<ul><li><b>Jardim Oceânico:</b> ruas arborizadas, comércio de rua e a estação de metrô que liga a Barra à Zona Sul.</li>
      <li><b>Barra da Tijuca:</b> orla extensa, condomínios-clube, shoppings e acesso pela Av. das Américas.</li>
      <li><b>Península:</b> torres cercadas de verde junto à Lagoa da Tijuca, com segurança e lazer completo.</li>
      <li><b>Recreio dos Bandeirantes:</b> clima mais tranquilo, casas e praias para quem gosta de esportes ao ar livre.</li>
      <li><b>Itanhangá e Joá:</b> casas amplas, muito verde e vistas para o mar e a pedra da Gávea.</li></ul>` },
    { id: "preparar-para-vender", cat: "Vender", titulo: "Como preparar seu imóvel para vender", resumo: "Documentos, pequenos reparos e fotos que aceleram a venda.", foto: "1600566753190-17f0baa2a6c3",
      body: `<ol><li><b>Separe a documentação:</b> matrícula atualizada, IPTU quitado e declaração de quitação do condomínio.</li>
      <li><b>Faça pequenos reparos:</b> pintura, vazamentos, tomadas e portas. Detalhes pesam na primeira impressão.</li>
      <li><b>Despersonalize:</b> menos objetos pessoais ajudam o comprador a se imaginar no imóvel.</li>
      <li><b>Fotos profissionais:</b> são o primeiro contato do comprador com o imóvel nos portais.</li>
      <li><b>Preço certo desde o início:</b> imóvel acima do mercado fica parado e perde força nos anúncios.</li></ol>` },
    { id: "preco-certo", cat: "Vender", titulo: "Como definir o preço certo", resumo: "Comparativos de m², estado de conservação e tempo de venda.", foto: "1600607687644-c7171b42498f",
      body: `<p>O preço certo vem da comparação com imóveis parecidos que foram vendidos recentemente, não só dos anunciados.</p>
      <ul><li><b>Preço por m²:</b> compare imóveis do mesmo prédio ou condomínio e da mesma rua.</li>
      <li><b>Diferenciais:</b> andar, vista, vagas, reforma e lazer do condomínio mudam o valor.</li>
      <li><b>Prazo:</b> quem precisa vender rápido deve anunciar mais perto do valor de mercado.</li></ul>
      <p>A Vitta Prime faz essa análise gratuitamente na avaliação do seu imóvel.</p>` },
    { id: "documentos-para-alugar", cat: "Alugar", titulo: "Documentos e garantias para alugar", resumo: "Fiador, seguro-fiança, caução: qual escolher.", foto: "1522708323590-d24dbb6b0267",
      body: `<p>Para alugar, o inquilino apresenta documento de identidade, CPF, comprovante de residência e de renda. A renda costuma ser de pelo menos três vezes o valor do aluguel.</p>
      <h3>Garantias mais comuns</h3><ul><li><b>Fiador:</b> pessoa com imóvel quitado que se responsabiliza pela dívida.</li>
      <li><b>Seguro-fiança:</b> contratado com uma seguradora, com pagamento mensal ou anual.</li>
      <li><b>Caução:</b> depósito em dinheiro de até três meses de aluguel, devolvido ao fim do contrato.</li>
      <li><b>Título de capitalização:</b> valor aplicado que fica bloqueado durante a locação.</li></ul>
      <p>A lei permite apenas uma garantia por contrato.</p>` },
    { id: "vistoria", cat: "Alugar", titulo: "Checklist da vistoria de entrada", resumo: "O que conferir antes de receber as chaves.", foto: "1493809842364-78817add7ffb",
      body: `<ul><li>Teste torneiras, chuveiros, descargas e ralos.</li><li>Ligue todas as tomadas, interruptores e o quadro de luz.</li>
      <li>Abra e feche portas, janelas e armários.</li><li>Procure manchas de umidade em tetos e paredes.</li>
      <li>Fotografe tudo com data e anexe ao laudo de vistoria.</li></ul>
      <p>O laudo assinado pelas duas partes é o que vale na devolução do imóvel.</p>` },
  ];
  const exploreTrack = $("#exploreTrack");
  function renderExplore(cat = "") {
    exploreTrack.innerHTML = GUIAS.filter((g) => !cat || g.cat === cat).map((g) => `
      <button type="button" class="explore-card" data-route="guia-${g.id}">
        <img src="${U(g.foto)}" alt="" loading="lazy" draggable="false">
        <span><small>${g.cat}</small><b>${g.titulo}</b><em>${g.resumo}</em><i>Ler guia →</i></span>
      </button>`).join("");
    exploreTrack.scrollLeft = 0;
    updateRail(exploreTrack);
  }
  $$("#exploreTabs button").forEach((b) => b.addEventListener("click", () => {
    $$("#exploreTabs button").forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-selected", String(x === b)); });
    renderExplore(b.dataset.cat);
  }));

  /* ---------- PÁGINAS SOBREPOSTAS (imóvel, guia, proprietário) ---------- */
  const sheet = $("#sheet"), sheetBody = $("#sheetBody"), sheetPanel = $(".sheet__panel", sheet);
  let lastFocus = null;
  const isRoute = (r) => /^(imovel-VP-\d+|guia-[a-z-]+|proprietario-[a-z]+)$/.test(r);

  function openRoute(route) {
    if (!isRoute(route)) return;
    try { history.pushState({ sheet: true }, "", "#" + route); } catch { location.hash = route; return; }
    showRoute(route);
  }
  function showRoute(route) {
    let html = "", crumb = "", narrow = false;
    if (route.startsWith("imovel-")) {
      const i = byId(route.slice(7));
      if (!i) return;
      html = detailHtml(i); crumb = `${TITLES[i.mode]} · ${i.bairro} · Cód. ${i.id}`;
    } else if (route.startsWith("guia-")) {
      const g = GUIAS.find((x) => x.id === route.slice(5));
      if (!g) return;
      html = guideHtml(g); crumb = `Explore com a Vitta Prime · ${g.cat}`; narrow = true;
    } else {
      const o = OWNER_PAGES[route.slice(13)];
      if (!o) return;
      html = ownerHtml(route.slice(13), o); crumb = "Para proprietários"; narrow = true;
    }
    if (sheet.hidden) lastFocus = document.activeElement;
    sheetBody.innerHTML = html;
    $("#sheetCrumb").textContent = crumb;
    sheetPanel.classList.toggle("sheet__panel--narrow", narrow);
    sheet.hidden = false;
    document.body.classList.add("sheet-open");
    sheetPanel.scrollTop = 0;
    sheetPanel.focus({ preventScroll: true });
    $$("[data-rail]", sheetBody).forEach(initRail);
    bindSheet(route);
  }
  function hideSheet() {
    if (sheet.hidden) return;
    sheet.hidden = true;
    document.body.classList.remove("sheet-open");
    sheetBody.innerHTML = "";
    lastFocus?.focus?.({ preventScroll: true });
  }
  function closeSheet(then) {
    const st = history.state;
    hideSheet();
    try {
      if (st && st.sheet) history.back();
      else history.replaceState(null, "", location.pathname + location.search);
    } catch {}
    if (then) setTimeout(then, 60);
  }
  addEventListener("popstate", () => { const r = location.hash.slice(1); isRoute(r) ? showRoute(r) : hideSheet(); });
  addEventListener("hashchange", () => { const r = location.hash.slice(1); if (isRoute(r)) showRoute(r); });
  sheet.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) { closeSheet(); return; }
    const a = e.target.closest('a[href^="#"]');
    if (a && !isRoute(a.getAttribute("href").slice(1))) {
      e.preventDefault();
      if (a.dataset.mode) setMode(a.dataset.mode);
      const target = $(a.getAttribute("href"));
      closeSheet(() => target?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }));
    }
  });
  addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!$("#lightbox").hidden) { $("#lightbox").hidden = true; return; }
    if (!sheet.hidden) closeSheet();
  });
  document.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]");
    if (o) { e.preventDefault(); openRoute("imovel-" + o.dataset.open); return; }
    const r = e.target.closest("[data-route]");
    if (r) openRoute(r.dataset.route);
  });
  // links do rodapé para páginas (#proprietario-...) abrem a página sobreposta
  $$('a[href^="#proprietario-"]').forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); openRoute(a.getAttribute("href").slice(1)); }));

  /* detalhe do imóvel */
  const DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  function nextDays() {
    const out = [];
    const d = new Date(); d.setHours(0, 0, 0, 0);
    while (out.length < 10) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) out.push(new Date(d)); }
    return out;
  }
  const SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
  function detailHtml(i) {
    const facts = [
      ["Área", i.plantas ? `${Math.min(...i.plantas.map((p) => p[1]))}–${Math.max(...i.plantas.map((p) => p[1]))} m²` : `${i.area} m²`],
      i.quartos ? ["Quartos", i.quartos] : null, i.suites ? ["Suítes", i.suites] : null,
      ["Banheiros", i.banheiros], ["Vagas", i.vagas],
      i.mode !== "aluguel" ? ["Preço/m²", brl(Math.round(i.preco / i.area))] : null,
    ].filter(Boolean);
    const costs = i.mode === "lancamento"
      ? `<dl class="costs"><div><dt>Fase</dt><dd>${i.stage}</dd></div><div><dt>Entrega prevista</dt><dd>${i.entrega}</dd></div></dl>`
      : `<dl class="costs">
          ${i.mode === "aluguel" ? `<div><dt>Aluguel</dt><dd>${brl(i.preco)}</dd></div>` : ""}
          <div><dt>Condomínio</dt><dd>${brl(i.condo)}</dd></div>
          <div><dt>IPTU (mensal)</dt><dd>${brl(i.iptu)}</dd></div>
          ${i.mode === "aluguel" ? `<div><dt><b>Total mensal</b></dt><dd>${brl(i.preco + i.condo + i.iptu)}</dd></div>` : ""}
        </dl>`;
    const plantas = i.plantas ? `
      <h3>Plantas e metragens</h3>
      <div class="table-wrap"><table class="plantas">
        <thead><tr><th>Tipologia</th><th>Área privativa</th><th>Suítes</th><th>Vagas</th><th>A partir de</th></tr></thead>
        <tbody>${i.plantas.map((p) => `<tr><td>${p[0]}</td><td>${p[1]} m²</td><td>${p[2] || "—"}</td><td>${p[3] || "—"}</td><td>${brl(p[4])}</td></tr>`).join("")}</tbody>
      </table></div>
      <h3>Andamento da obra</h3>
      <div class="obra"><div class="obra__bar"><i style="width:${i.obra}%"></i></div><small>${i.obra ? `${i.obra}% concluído` : "Obra ainda não iniciada"} · entrega prevista ${i.entrega}</small></div>` : "";
    const similares = IMOVEIS.filter((x) => x.mode === i.mode && x.id !== i.id)
      .sort((a, b) => (b.bairro === i.bairro) - (a.bairro === i.bairro) || a.destaque - b.destaque).slice(0, 6);
    return `
      <div class="gallery">${i.fotos.map((f, n) => `<button type="button" data-photo="${f.replace("w=1200", "w=2000")}" aria-label="Ampliar foto ${n + 1}"><img src="${f}" alt="" ${n ? 'loading="lazy"' : ""}></button>`).join("")}</div>
      <div class="detail">
        <div>
          <div class="detail__tags"><span class="tag tag--strong">${priceLabel(i) === "A partir de" ? "Lançamento" : priceLabel(i)}</span>${i.tag ? `<span class="tag">${i.tag}</span>` : ""}<span class="tag">${i.tipo}</span></div>
          <h2 id="sheetTitle">${i.titulo}</h2>
          <p class="detail__loc">${i.bairro}, Rio de Janeiro · endereço completo informado na visita</p>
          <dl class="facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
          <h3>Sobre o ${i.mode === "lancamento" ? "empreendimento" : "imóvel"}</h3>
          <p class="desc">${i.desc}</p>
          ${plantas}
          <h3>Características</h3>
          <ul class="chips">${i.caract.map((c) => `<li>${c}</li>`).join("")}</ul>
          <h3>${i.mode === "lancamento" ? "Lazer do empreendimento" : "Condomínio"}</h3>
          <ul class="chips">${i.lazer.map((c) => `<li>${c}</li>`).join("")}</ul>
          <h3>Localização</h3>
          <p class="desc">${i.bairro}. <button type="button" class="link-btn" data-showmap="${i.id}">Ver no mapa</button></p>
        </div>
        <aside class="aside-card">
          <div class="price"><small>${priceLabel(i)} · Cód. ${i.id}</small><strong>${brl(i.preco)}</strong>${i.mode === "aluguel" ? "<em>/mês</em>" : ""}</div>
          ${costs}
          <form class="visit" id="visitForm" novalidate>
            <h4>Agendar visita</h4>
            <div class="seg2" role="radiogroup" aria-label="Tipo de visita">
              <label><input type="radio" name="vTipo" value="Presencial" checked><span>Presencial</span></label>
              <label><input type="radio" name="vTipo" value="Por vídeo"><span>Por vídeo</span></label>
            </div>
            <div class="days" id="vDays">${nextDays().map((d, n) => `<button type="button" data-day="${d.toISOString().slice(0, 10)}" aria-pressed="${n === 0}"><small>${DIAS[d.getDay()]}</small><b>${String(d.getDate()).padStart(2, "0")}</b></button>`).join("")}</div>
            <div class="slots" id="vSlots"></div>
            <label class="input"><span>Nome</span><input id="vNome" type="text" required autocomplete="name"></label>
            <label class="input"><span>WhatsApp</span><input id="vFone" type="tel" required autocomplete="tel" placeholder="(21) 9 0000-0000"></label>
            <button type="submit" class="btn btn--navy btn--block">Agendar visita</button>
            <p class="form-ok" id="visitOk" hidden></p>
          </form>
          <a href="#contato" class="btn btn--accent btn--block" data-interest="Imóvel ${i.id}: ${i.titulo}">Falar com um corretor</a>
          <button type="button" class="link-btn" data-fav="${i.id}" aria-pressed="${favs.has(i.id)}">Salvar nos favoritos</button>
        </aside>
      </div>
      ${similares.length ? `<section class="similar"><div class="list-tools"><h3 style="margin:0;font:500 1.35rem/1.2 var(--f-display)">Você também pode gostar</h3></div>
        <div class="rail" data-rail><div class="rail__track">${similares.map((s) => `
          <button type="button" class="mini" data-open="${s.id}"><img src="${s.img}" alt="" loading="lazy" draggable="false"><span><small>${s.bairro}</small><b>${s.titulo}</b><em>${priceText(s)}</em></span></button>`).join("")}</div>
          <div class="list-tools"><div class="rail__progress" style="flex:1"><i></i></div><div class="rail__nav">
            <button type="button" class="rail__btn" data-dir="-1" aria-label="Anteriores"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>
            <button type="button" class="rail__btn" data-dir="1" aria-label="Próximos"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button></div></div></div></section>` : ""}`;
  }

  function guideHtml(g) {
    const ctas = {
      Comprar: ["Quer ajuda para encontrar o imóvel certo?", '<a href="#imoveis" class="btn btn--navy">Ver imóveis à venda</a>'],
      Vender: ["Descubra quanto vale o seu imóvel.", '<button type="button" class="btn btn--navy" data-route="proprietario-avaliar">Avaliar meu imóvel</button>'],
      Alugar: ["Procurando um imóvel para alugar?", '<a href="#imoveis" class="btn btn--navy" data-mode="aluguel">Ver imóveis para alugar</a>'],
    };
    const [txt, btn] = ctas[g.cat];
    return `<article class="article">
      <img class="article__hero" src="${U(g.foto)}" alt="">
      <p class="eyebrow">${g.cat}</p>
      <h2 id="sheetTitle">${g.titulo}</h2>
      ${g.body}
      <div class="article__cta"><p>${txt}</p>${btn}</div>
    </article>`;
  }

  /* páginas de proprietário */
  const OWNER_PAGES = {
    avaliar: { titulo: "Quanto vale o seu imóvel?", lead: "Faça uma estimativa agora e, se quiser, peça a avaliação completa, gratuita, com visita de um corretor.", calc: true, fin: "Avaliação" },
    vender: { titulo: "Venda seu imóvel com a Vitta Prime", lead: "Um corretor dedicado cuida de tudo, da avaliação à escritura.", fin: "Vender",
      passos: ["Avaliação gratuita com comparativos de mercado", "Fotos profissionais e descrição completa", "Divulgação no site, nas redes e nos principais portais", "Visitas acompanhadas e negociação de propostas", "Apoio jurídico e documental até a escritura"] },
    alugar: { titulo: "Alugue seu imóvel com segurança", lead: "Encontramos o inquilino certo e cuidamos do contrato e da vistoria.", fin: "Alugar",
      passos: ["Definição do valor de aluguel", "Divulgação e visitas acompanhadas", "Análise de cadastro e da garantia do inquilino", "Contrato e laudo de vistoria com fotos", "Opção de administração mensal do aluguel"] },
    administrar: { titulo: "Administração de aluguel", lead: "Você recebe o aluguel em dia e nós cuidamos do resto.", fin: "Administração",
      passos: ["Cobrança do aluguel e repasse mensal ao proprietário", "Pagamento de condomínio e IPTU, se você preferir", "Gestão de manutenções e orçamentos", "Reajuste anual e renovação de contrato", "Relatório mensal com extrato completo"] },
  };
  function ownerHtml(key, o) {
    const calc = o.calc ? `
      <form class="card-form" id="calcForm" novalidate>
        <div class="grid2">
          <label class="input"><span>Bairro</span>
            <select id="eBairro" required>
              <option value="">Selecione</option>
              <option value="16500">Barra da Tijuca</option><option value="17800">Jardim Oceânico</option>
              <option value="11200">Recreio dos Bandeirantes</option><option value="12500">Itanhangá</option>
              <option value="15000">Joá</option><option value="14200">Península</option>
            </select></label>
          <label class="input"><span>Tipo</span>
            <select id="eTipo"><option value="1">Apartamento</option><option value="1.12">Cobertura</option><option value="1.05">Casa em condomínio</option><option value="0.85">Sala comercial</option></select></label>
          <label class="input"><span>Área privativa (m²)</span><input id="eArea" type="number" inputmode="numeric" min="20" max="3000" placeholder="Ex.: 120" required></label>
          <label class="input"><span>Estado de conservação</span>
            <select id="eEstado"><option value="1.08">Reformado</option><option value="1" selected>Bom</option><option value="0.9">Precisa de reforma</option></select></label>
        </div>
        <button type="submit" class="btn btn--navy btn--block">Calcular estimativa</button>
        <div class="estimate" id="estimate" hidden><span>Faixa estimada</span><strong id="estValue"></strong><small id="estM2"></small></div>
        <p class="form-error" id="evalError" hidden>Selecione o bairro e informe a área para calcular.</p>
        <p class="note">Valores de m² de referência, apenas para demonstração.</p>
      </form>
      <h3 style="margin:2.5rem 0 1rem;font:500 1.35rem/1.2 var(--f-display)">Avaliação completa e gratuita</h3>` : `
      <ol class="article" style="margin:0 0 2rem">${o.passos.map((p) => `<li>${p}</li>`).join("")}</ol>`;
    return `<div class="article" style="max-width:720px">
      <p class="eyebrow">Para proprietários</p>
      <h2 id="sheetTitle">${o.titulo}</h2>
      <p class="lead" style="margin-bottom:2rem">${o.lead}</p>
      ${calc}
      <form class="card-form" id="ownerForm" novalidate>
        <div class="grid2">
          <label class="input"><span>Seu nome</span><input id="oNome" type="text" required autocomplete="name"></label>
          <label class="input"><span>WhatsApp</span><input id="oFone" type="tel" required autocomplete="tel" placeholder="(21) 9 0000-0000"></label>
          <label class="input"><span>Bairro do imóvel</span><input id="oBairro" type="text" required placeholder="Ex.: Barra da Tijuca"></label>
          <label class="input"><span>Tipo de imóvel</span>
            <select id="oTipo"><option>Apartamento</option><option>Cobertura</option><option>Casa em condomínio</option><option>Sala comercial</option><option>Terreno</option></select></label>
        </div>
        <button type="submit" class="btn btn--accent btn--block">${key === "avaliar" ? "Pedir avaliação gratuita" : "Quero ser contatado"}</button>
        <p class="form-ok" id="ownerOk" hidden></p>
      </form>
    </div>`;
  }

  function validate(ids) {
    let ok = true;
    ids.forEach((id) => {
      const el = $(id, sheetBody) || $(id);
      const bad = !el.value.trim();
      el.closest(".input").classList.toggle("is-invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) toast("Preencha os campos destacados.");
    return ok;
  }
  const firstName = (v) => v.trim().split(" ")[0];

  function bindSheet(route) {
    $$("[data-photo]", sheetBody).forEach((b) => b.addEventListener("click", () => {
      $("#lightboxImg").src = b.dataset.photo; $("#lightbox").hidden = false; $("#lightboxClose").focus();
    }));
    $$("[data-showmap]", sheetBody).forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.showmap;
      closeSheet(() => { $("#mapa").scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); mapApi.focus?.(id); });
    }));
    const visit = $("#visitForm", sheetBody);
    if (visit) {
      const i = byId(route.slice(7));
      let day = $("#vDays button", visit).dataset.day, slot = "";
      const renderSlots = () => {
        const sat = new Date(day + "T12:00:00").getDay() === 6;
        const opts = sat ? SLOTS.slice(0, 3) : SLOTS;
        if (!opts.includes(slot)) slot = "";
        $("#vSlots", visit).innerHTML = opts.map((s) => `<button type="button" data-slot="${s}" aria-pressed="${s === slot}">${s}</button>`).join("");
      };
      renderSlots();
      visit.addEventListener("click", (e) => {
        const d = e.target.closest("[data-day]"), s = e.target.closest("[data-slot]");
        if (d) { day = d.dataset.day; $$("[data-day]", visit).forEach((x) => x.setAttribute("aria-pressed", String(x === d))); renderSlots(); }
        if (s) { slot = s.dataset.slot; $$("[data-slot]", visit).forEach((x) => x.setAttribute("aria-pressed", String(x === s))); }
      });
      visit.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!slot) { toast("Escolha um horário para a visita."); return; }
        if (!validate(["#vNome", "#vFone"])) return;
        const d = new Date(day + "T12:00:00");
        const tipo = $("input[name=vTipo]:checked", visit).value.toLowerCase();
        $("#visitOk", visit).textContent = `Pedido de visita ${tipo} para ${DIAS[d.getDay()]}, ${d.toLocaleDateString("pt-BR")} às ${slot} enviado, ${firstName($("#vNome").value)}. Um corretor confirma pelo WhatsApp. (${i.id})`;
        $("#visitOk", visit).hidden = false;
      });
    }
    const calc = $("#calcForm", sheetBody);
    if (calc) calc.addEventListener("submit", (e) => {
      e.preventDefault();
      const m2 = Number($("#eBairro").value), area = Number($("#eArea").value);
      const ok = m2 > 0 && area >= 20;
      $("#eBairro").closest(".input").classList.toggle("is-invalid", !m2);
      $("#eArea").closest(".input").classList.toggle("is-invalid", !(area >= 20));
      $("#evalError").hidden = ok;
      if (!ok) { $("#estimate").hidden = true; return; }
      const base = m2 * Number($("#eTipo").value) * Number($("#eEstado").value);
      const mid = base * area, round = (n) => Math.round(n / 10000) * 10000;
      $("#estValue").textContent = `${brl(round(mid * 0.92))} – ${brl(round(mid * 1.08))}`;
      $("#estM2").textContent = `Referência de ${brl(Math.round(base))}/m² para ${$("#eBairro").selectedOptions[0].text}.`;
      $("#estimate").hidden = false;
      $("#oBairro").value = $("#eBairro").selectedOptions[0].text;
    });
    const owner = $("#ownerForm", sheetBody);
    if (owner) owner.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate(["#oNome", "#oFone", "#oBairro"])) return;
      $("#ownerOk").textContent = `Obrigado, ${firstName($("#oNome").value)}! Um corretor vai entrar em contato pelo WhatsApp informado.`;
      $("#ownerOk").hidden = false;
    });
  }
  $("#lightboxClose").addEventListener("click", () => ($("#lightbox").hidden = true));
  $("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") $("#lightbox").hidden = true; });

  /* ---------- Interesse → pré-preenche contato ---------- */
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-interest]");
    if (!el) return;
    const subj = $("#cAssunto");
    const txt = el.dataset.interest;
    const id = (txt.match(/VP-\d+/) || [])[0];
    const mode = id ? byId(id)?.mode : state.mode;
    subj.value = mode === "lancamento" ? "Lançamentos" : mode === "aluguel" ? "Alugar um imóvel" : "Comprar um imóvel";
    $("#cMsg").value = `Olá! Tenho interesse em: ${txt}.`;
  });

  /* ---------- CONTATO ---------- */
  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    ["#cNome", "#cFone"].forEach((id) => {
      const el = $(id), bad = !el.value.trim();
      el.closest(".input").classList.toggle("is-invalid", bad);
      if (bad) valid = false;
    });
    const ok = $("#contactOk");
    if (!valid) { ok.hidden = true; toast("Preencha os campos destacados."); return; }
    ok.textContent = `Recebemos sua mensagem, ${firstName($("#cNome").value)}. Um corretor responde em breve.`;
    ok.hidden = false;
    e.target.reset();
  });

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

  const mapApi = {};
  $$("[data-rail]").forEach(initRail);
  render();
  renderExplore();
  { const r = location.hash.slice(1); if (isRoute(r)) showRoute(r); }

  /* ---------- MAPA ---------- */
  // Escritório: posição provisória na Barra da Tijuca até a confirmação do endereço.
  const ESCRITORIO = { lat: -23.0003, lng: -43.3560, titulo: "Vitta Prime Imóveis", sub: "Barra da Tijuca · endereço a confirmar" };
  const mapEl = $("#map");
  const shortPrice = (i) => {
    if (i.mode === "aluguel") return `R$ ${(i.preco / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil`;
    const mi = i.preco / 1e6;
    return mi >= 1 ? `R$ ${mi.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mi` : `R$ ${Math.round(i.preco / 1000)} mil`;
  };
  const LOGO = '<svg viewBox="0 0 120 120"><rect x="6" y="6" width="108" height="108"/><path d="M28 34 L48 86 L68 34"/><path d="M62 86 L62 34 L80 34 Q94 34 94 48 Q94 62 80 62 L62 62"/></svg>';
  const mapState = { filter: "todos", active: null };

  if (!window.L || !mapEl) {
    if (mapEl) $("#mapFallback").hidden = false;
  } else {
    const bounds = L.latLngBounds([-23.06, -43.52], [-22.95, -43.25]);
    const map = L.map(mapEl, {
      scrollWheelZoom: false, minZoom: 12, maxZoom: 16, zoomSnap: 0.5,
      maxBounds: bounds, maxBoundsViscosity: 0.9,
    }).setView([-23.003, -43.37], 13);
    map.attributionControl.setPrefix(false);
    map.attributionControl.addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">colaboradores do OpenStreetMap</a>');

    // Mapa vetorial próprio (orla, lagoas, áreas verdes e vias principais); as cores vêm do CSS.
    if (window.VP_GEO) {
      L.geoJSON(window.VP_GEO, {
        interactive: false,
        style: (f) => ({ className: `g g-${f.properties.k}${f.properties.c ? " g-road-" + f.properties.c : ""}` }),
      }).addTo(map);
    }
    const LABELS = [
      ["Barra da Tijuca", -23.0045, -43.372, "hood"], ["Recreio dos Bandeirantes", -23.012, -43.465, "hood"],
      ["Jardim Oceânico", -23.004, -43.309, "hood"], ["Península", -22.9935, -43.345, "hood"],
      ["Itanhangá", -22.985, -43.307, "hood"], ["Joá", -23.0115, -43.288, "hood"],
      ["Lagoa da Tijuca", -22.9915, -43.330, "water"], ["Lagoa de Marapendi", -23.0105, -43.405, "water"],
      ["Oceano Atlântico", -23.035, -43.39, "sea"],
    ];
    LABELS.forEach(([t, lat, lng, k]) => L.marker([lat, lng], {
      icon: L.divIcon({ className: `maplabel maplabel--${k}`, html: `<span>${t}</span>`, iconSize: [0, 0] }),
      interactive: false, keyboard: false,
    }).addTo(map));
    // Zoom mínimo calculado para a área do mapa sempre preencher a tela (sem bordas vazias).
    const fitMinZoom = () => {
      map.invalidateSize();
      map.setMinZoom(Math.max(12, Math.ceil(map.getBoundsZoom(bounds, true) * 2) / 2));
    };
    const syncZoom = () => (mapEl.dataset.z = Math.floor(map.getZoom()));
    map.on("zoomend", syncZoom);
    addEventListener("resize", fitMinZoom);
    fitMinZoom(); syncZoom();
    // Roda do mouse só depois de clicar no mapa, para não prender a rolagem da página.
    map.on("click", () => map.scrollWheelZoom.enable());
    map.on("mouseout", () => map.scrollWheelZoom.disable());

    const markers = new Map();
    const popupHtml = (i) => `
      <div class="pop">
        <img src="${i.img}" alt="">
        <div>
          <small>${i.bairro} · ${i.tipo}</small>
          <b>${i.titulo}</b>
          <p>${i.area} m²${i.quartos ? ` · ${i.quartos} quartos` : ""} · ${i.vagas} ${i.vagas === 1 ? "vaga" : "vagas"}</p>
          <strong>${brl(i.preco)}${i.mode === "aluguel" ? "/mês" : ""}</strong>
          <a href="#imovel-${i.id}" data-open="${i.id}">Ver detalhes →</a>
        </div>
      </div>`;

    IMOVEIS.forEach((i) => {
      const icon = L.divIcon({ className: `pin pin--${i.mode}`, html: `<span>${shortPrice(i)}</span>`, iconSize: [0, 0] });
      const m = L.marker([i.lat, i.lng], { icon, title: i.titulo, riseOnHover: true })
        .bindPopup(popupHtml(i), { offset: [0, -30], maxWidth: 240, autoPanPadding: [20, 20] });
      m.on("popupopen", () => setActive(i.id, false));
      markers.set(i.id, m);
    });
    const office = L.marker([ESCRITORIO.lat, ESCRITORIO.lng], {
      icon: L.divIcon({ className: "pin pin--office", html: `<span>${LOGO}</span>`, iconSize: [0, 0] }),
      title: ESCRITORIO.titulo, zIndexOffset: 1000,
    }).bindPopup(`<div class="pop"><div><small>Escritório</small><b>${ESCRITORIO.titulo}</b><p>${ESCRITORIO.sub}</p><a href="#contato">Fale com um corretor →</a></div></div>`, { offset: [0, -34] })
      .addTo(map);
    office.on("popupopen", () => setActive("office", false));
    markers.set("office", office);

    function setActive(id, fly) {
      mapState.active = id;
      markers.forEach((m, k) => m.getElement()?.classList.toggle("is-active", k === id));
      $$("#mapList .mitem").forEach((b) => b.classList.toggle("is-active", b.dataset.id === id));
      const m = markers.get(id);
      if (fly && m) {
        map.flyTo(m.getLatLng(), Math.max(map.getZoom(), 14), { duration: reduced ? 0 : 0.8 });
        map.once("moveend", () => m.openPopup());
      }
      const li = $(`#mapList .mitem[data-id="${id}"]`);
      if (li && !fly) li.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
    }

    function renderMap() {
      const list = IMOVEIS.filter((i) => mapState.filter === "todos" || i.mode === mapState.filter);
      const shown = new Set(list.map((i) => i.id));
      IMOVEIS.forEach((i) => {
        const m = markers.get(i.id);
        if (shown.has(i.id)) m.addTo(map); else m.remove();
      });
      $("#mapCount").textContent = `${list.length} ${list.length === 1 ? "imóvel" : "imóveis"} no mapa`;
      $("#mapList").innerHTML =
        `<li><button type="button" class="mitem" data-id="office"><span class="mitem__logo">${LOGO}</span><span><small>Escritório</small><b>${ESCRITORIO.titulo}</b><em>${ESCRITORIO.sub}</em></span></button></li>` +
        list.map((i) => `<li><button type="button" class="mitem" data-id="${i.id}">
          <img src="${i.img}" alt="" loading="lazy">
          <span><small>${i.bairro}</small><b>${i.titulo}</b><em>${brl(i.preco)}${i.mode === "aluguel" ? "/mês" : ""}</em></span>
        </button></li>`).join("");
      const pts = list.map((i) => [i.lat, i.lng]).concat([[ESCRITORIO.lat, ESCRITORIO.lng]]);
      map.closePopup();
      map.flyToBounds(pts, { padding: [50, 50], maxZoom: 14, duration: reduced ? 0 : 0.6 });
    }

    $("#mapList").addEventListener("click", (e) => {
      const b = e.target.closest(".mitem");
      if (b) setActive(b.dataset.id, true);
    });
    $$("#mapTabs button").forEach((b) => b.addEventListener("click", () => {
      mapState.filter = b.dataset.map;
      $$("#mapTabs button").forEach((x) => {
        const on = x === b;
        x.classList.toggle("is-active", on);
        x.setAttribute("aria-selected", String(on));
      });
      renderMap();
    }));

    mapApi.focus = (id) => {
      if (mapState.filter !== "todos" && byId(id)?.mode !== mapState.filter) $('#mapTabs button[data-map="todos"]').click();
      setTimeout(() => setActive(id, true), 400);
    };
    renderMap();
    // O mapa fica fora da tela no carregamento; recalcula o tamanho quando aparece.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries, obs) => {
        if (entries[0].isIntersecting) { fitMinZoom(); renderMap(); obs.disconnect(); }
      }).observe(mapEl);
    }
  }
})();

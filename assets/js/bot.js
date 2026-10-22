/* =========================================================
   ASSISTENTE ARGENTO — chatbot de perguntas frequentes
   Funciona 100% no navegador: entende a pergunta por palavras-chave,
   sugere próximos assuntos, monta pedido de orçamento e passa para
   o WhatsApp quando precisa de um humano.
   ========================================================= */
(() => {
  const C = window.ARGENTO;
  const $ = (s) => document.querySelector(s);
  const norm = window.argentoNorm || ((s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""));
  const KB = window.KB, SOCIAL = window.KB_SOCIAL, ALL = [...KB, ...SOCIAL];
  const byId = Object.fromEntries(ALL.map((i) => [i.id, i]));
  const ans = (it) => (typeof it.a === "function" ? it.a() : it.a);

  const root = $("#bot"), panel = $("#botPanel"), fab = $("#botFab"), msgs = $("#botMsgs"), chips = $("#botChips"), form = $("#botForm"), input = $("#botInput"), hint = $("#botHint");
  const STORE = "argento-bot-v1";
  let history = [];  // {who, html}
  let flow = null;   // fluxo de orçamento em andamento
  let lastQuestion = "";

  const store = {
    get() { try { return JSON.parse(sessionStorage.getItem(STORE)) || null; } catch { return null; } },
    set(v) { try { sessionStorage.setItem(STORE, JSON.stringify(v)); } catch {} },
    clear() { try { sessionStorage.removeItem(STORE); } catch {} },
  };

  /* ---------------- render ---------------- */
  function bubble(who, html, save = true) {
    const el = document.createElement("div");
    el.className = `msg msg--${who}`;
    el.innerHTML = html;
    msgs.appendChild(el);
    window.argentoBind && window.argentoBind(el);
    el.querySelectorAll("[data-close]").forEach((a) => a.addEventListener("click", () => close()));
    msgs.scrollTop = msgs.scrollHeight;
    if (save) { history.push({ who, html }); store.set({ history }); }
    return el;
  }
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function setChips(list) {
    chips.innerHTML = "";
    list.forEach((c) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = c.label;
      b.addEventListener("click", () => c.run ? c.run() : ask(c.label, c.id));
      chips.appendChild(b);
    });
  }
  const chipsFor = (ids) => ids.filter((id) => byId[id]).map((id) => ({ id, label: byId[id].q || id }));
  const defaultChips = () => setChips([
    { label: "💰 Quero um orçamento", run: startQuote },
    ...chipsFor(["equipamentos", "regioes", "projeto", "frete", "desforma", "normas", "contato"]),
  ]);

  function botSay(html, chipIds, delay) {
    const typing = bubble("bot", "<span></span><span></span><span></span>", false);
    typing.classList.add("msg--typing");
    const wait = delay ?? Math.min(1100, 350 + html.replace(/<[^>]+>/g, "").length * 4);
    return new Promise((res) => setTimeout(() => {
      typing.remove();
      bubble("bot", html);
      if (chipIds) chipIds.length ? setChips(chipIds) : defaultChips();
      res();
    }, wait));
  }

  /* ---------------- NLU simples ---------------- */
  const STOP = new Set("a o os as um uma de do da dos das e em no na nos nas para pra por com que qual quais como se eu voces vcs voce vc tem ter é e me minha meu sobre isso essa esse ai aqui la".split(" "));
  function tokens(t) { return t.split(/[^a-z0-9]+/).filter((w) => w && !STOP.has(w)); }

  function score(text, toks, it) {
    let s = 0;
    for (const raw of it.k) {
      const k = norm(raw);
      if (k.includes(" ") || k.includes("-")) { if (text.includes(k)) s += 3 + k.split(/[\s-]/).length; }
      else if (toks.includes(k)) s += 3;
      else if (k.length >= 5 && toks.some((w) => w.length >= 4 && (w.startsWith(k.slice(0, -1)) || (w.length >= 6 && k.startsWith(w))))) s += 1.5;
    }
    if (it.q) { // bônus por semelhança com a pergunta
      const qt = tokens(norm(it.q));
      s += toks.filter((w) => w.length > 3 && qt.includes(w)).length * 0.8;
    }
    return s;
  }

  function match(q) {
    const text = " " + norm(q).replace(/[?!.,;:]/g, " ").replace(/\s+/g, " ") + " ";
    const toks = tokens(text);
    const ranked = ALL.map((it) => ({ it, s: score(text, toks, it) })).filter((r) => r.s > 0).sort((a, b) => b.s - a.s);
    // saudações só vencem se a frase for curta
    const top = ranked.find((r) => !SOCIAL.includes(r.it) || toks.length <= 4);
    return { top: top && top.s >= 2.5 ? top.it : null, ranked };
  }

  /* ---------------- conversa ---------------- */
  async function ask(text, forcedId) {
    text = text.trim();
    if (!text) return;
    bubble("user", esc(text));
    input.value = "";
    if (flow) return flow.step(text);
    lastQuestion = text;

    const it = forcedId ? byId[forcedId] : match(text).top;
    if (it) {
      if (it.action === "quote") {
        await botSay(ans(it), []);
        return startQuote(true);
      }
      return botSay(ans(it), chipsFor(it.go || []).concat([{ label: "💬 Falar com a equipe", run: handoff }]));
    }

    const { ranked } = match(text);
    const sug = ranked.filter((r) => byId[r.it.id].q).slice(0, 3).map((r) => r.it.id);
    await botSay(
      `Hmm, não tenho certeza se entendi. ${sug.length ? "Talvez você queira saber:" : "Posso te ajudar com orçamento, equipamentos, normas, prazos e entrega."}<br>` +
      `<a class="wa-btn" href="${window.argentoWa(`Olá! Tenho uma dúvida: ${text}`)}" target="_blank" rel="noopener">Perguntar à equipe no WhatsApp</a>`,
      sug.length ? chipsFor(sug).concat([{ label: "Ver todos os assuntos", run: menu }]) : []
    );
  }

  function menu() {
    botSay("Aqui estão os assuntos que eu domino. Toque em um:", [], 300).then(() =>
      setChips([{ label: "💰 Orçamento", run: startQuote }, ...chipsFor(KB.map((k) => k.id).filter((id) => id !== "orcamento"))])
    );
  }

  function handoff() {
    const txt = lastQuestion ? `Olá! Vim pelo site da Argento. Minha dúvida: ${lastQuestion}` : undefined;
    botSay(`Claro! Nossa equipe técnica responde pelo WhatsApp em horário comercial (${C.hours}).<br><a class="wa-btn" href="${window.argentoWa(txt)}" target="_blank" rel="noopener">Abrir WhatsApp</a>`, []);
  }

  /* ---------------- fluxo de orçamento ---------------- */
  function startQuote(skipIntro) {
    const data = {};
    const steps = [
      { key: "tipo", q: "Qual o <b>tipo de obra</b>?", opts: ["Residencial", "Comercial", "Pública", "Industrial", "Ponte/viaduto", "Recuperação estrutural"] },
      { key: "elemento", q: "O que precisa ser escorado?", opts: ["Laje maciça", "Laje nervurada", "Vigas", "Balanços", "Estrutura especial"] },
      { key: "area", q: "Qual a <b>área aproximada</b> por concretagem (m²)? Pode digitar só o número.", opts: ["Até 100 m²", "100–500 m²", "500–1.000 m²", "Mais de 1.000 m²"] },
      { key: "altura", q: "E o <b>pé-direito</b> (altura até a laje)?", opts: ["Até 3 m", "3 a 4,5 m", "4,5 a 8 m", "Mais de 8 m"] },
      { key: "cidade", q: "Em qual <b>cidade/UF</b> fica a obra?", opts: [] },
      { key: "inicio", q: "Quando pretende começar?", opts: ["Imediato", "Em até 30 dias", "1 a 3 meses", "Planejando"] },
      { key: "nome", q: "Para finalizar: qual o seu <b>nome</b> (e empresa, se quiser)?", opts: [] },
    ];
    let i = 0;
    const next = () => {
      const s = steps[i];
      botSay(s.q, [], 450).then(() => setChips(s.opts.map((o) => ({ label: o, run: () => ask(o) })).concat([{ label: "✕ Cancelar", run: cancel }])));
      input.placeholder = "Digite sua resposta…";
    };
    const cancel = () => { flow = null; input.placeholder = "Digite sua pergunta…"; bubble("user", "Cancelar"); botSay("Sem problemas! Se quiser, retomamos depois. Posso ajudar com outra coisa?"); };
    flow = {
      step(text) {
        if (/^(cancelar|sair|parar)$/i.test(norm(text))) { flow = null; input.placeholder = "Digite sua pergunta…"; return botSay("Ok, cancelei o orçamento. Posso ajudar com outra dúvida?"); }
        data[steps[i].key] = text;
        i++;
        if (i < steps.length) return next();
        flow = null;
        input.placeholder = "Digite sua pergunta…";
        const msg = [
          "Olá, Argento! Gostaria de um orçamento de escoramento (via assistente do site).",
          "",
          `• Nome: ${data.nome}`,
          `• Tipo de obra: ${data.tipo}`,
          `• Elemento: ${data.elemento}`,
          `• Área por concretagem: ${data.area}`,
          `• Pé-direito: ${data.altura}`,
          `• Local: ${data.cidade}`,
          `• Início: ${data.inicio}`,
        ].join("\n");
        botSay(
          `Perfeito, ${esc(data.nome.split(" ")[0])}! Resumo do pedido:<br><br>` +
          `🏗️ ${esc(data.tipo)} · ${esc(data.elemento)}<br>📐 ${esc(data.area)} · pé-direito ${esc(data.altura)}<br>📍 ${esc(data.cidade)} · início: ${esc(data.inicio)}<br><br>` +
          `Envie agora para a equipe técnica — se tiver plantas ou projeto, anexe na conversa. 👇<br>` +
          `<a class="wa-btn" href="${window.argentoWa(msg)}" target="_blank" rel="noopener">Enviar pedido no WhatsApp</a>`,
          chipsFor(["enviar_projeto", "prazo_locacao", "frete"])
        );
      },
    };
    if (skipIntro !== true) botSay("Vamos lá! São só 7 perguntas rápidas. 📋", [], 350).then(next);
    else next();
  }

  /* ---------------- abrir/fechar ---------------- */
  let greeted = false;
  function open(q) {
    hint.hidden = true;
    panel.hidden = false;
    root.classList.add("is-open");
    fab.setAttribute("aria-expanded", "true");
    fab.setAttribute("aria-label", "Fechar assistente virtual");
    if (!greeted) {
      greeted = true;
      const saved = store.get();
      if (saved && saved.history && saved.history.length) {
        history = saved.history;
        history.forEach((h) => bubble(h.who, h.html, false));
        defaultChips();
      } else {
        const h = new Date().getHours();
        const sauda = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
        botSay(`${sauda}! 👷 Sou o <b>assistente virtual da Argento Escoramentos</b>.<br>Pergunte o que quiser sobre escoramento, normas, prazos, entrega ou peça seu orçamento.`, [], 500);
      }
    }
    if (typeof q === "string" && q.trim()) setTimeout(() => ask(q), 600);
    setTimeout(() => input.focus({ preventScroll: true }), 50);
  }
  function close() {
    panel.hidden = true;
    root.classList.remove("is-open");
    fab.setAttribute("aria-expanded", "false");
    fab.setAttribute("aria-label", "Abrir assistente virtual");
  }
  function reset() {
    store.clear(); history = []; flow = null; msgs.innerHTML = ""; greeted = false; lastQuestion = "";
    open();
  }

  fab.addEventListener("click", () => (panel.hidden ? open() : close()));
  $("#botClose").addEventListener("click", close);
  $("#botReset").addEventListener("click", reset);
  form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden && $("#lightbox").hidden) close(); });
  document.querySelectorAll("[data-open-bot]").forEach((b) => b.addEventListener("click", () => open()));

  // balão de boas-vindas (uma vez por sessão)
  let hinted = false;
  try { hinted = sessionStorage.getItem("argento-hint") === "1"; } catch {}
  if (!hinted) setTimeout(() => { if (panel.hidden && !document.body.classList.contains("is-intro")) { hint.hidden = false; try { sessionStorage.setItem("argento-hint", "1"); } catch {} } }, 9000);
  hint.addEventListener("click", (e) => { if (e.target.closest(".bot__hint-x")) hint.hidden = true; else open(); });

  window.argentoBot = { open, close, ask };
})();

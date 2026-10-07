/* ARGENTO — Assistente digital
 * Responde perguntas frequentes com base apenas em informações confirmadas
 * e coleta dados de contato. Nunca responde questões técnicas de cálculo,
 * carga, dimensionamento, montagem ou responsabilidade técnica.
 */
(function () {
  "use strict";

  var cfg = window.ARGENTO_CONFIG || {};
  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var chat = $("#chat");
  if (!chat) return;
  var log = $("#chat-log");
  var chips = $("#chat-chips");
  var form = $("#chat-form");
  var input = $("#chat-input");
  var fab = $("#fab-chat");
  var ROOT = doc.body.getAttribute("data-root") || "";
  var QUOTE = ROOT ? ROOT + "index.html#orcamento" : "#orcamento";
  var PHONE = cfg.phone || "(21) 2516-2761";
  var TEL = "tel:" + (cfg.phoneHref || "+552125162761");
  var started = false;
  var lead = null; // estado da coleta de dados
  var pendingQuestion = "";

  function norm(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9@.\s]/g, " ").replace(/\s+/g, " ").trim();
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function has(t, words) { return words.some(function (w) { return t.indexOf(" " + w) !== -1; }); }

  /* ---------- Renderização ---------- */
  function scroll() { log.scrollTop = log.scrollHeight; }
  function user(text) {
    var m = doc.createElement("div");
    m.className = "msg msg--user";
    m.textContent = text;
    log.appendChild(m);
    scroll();
  }
  function bot(html, opts) {
    opts = opts || {};
    var typing = doc.createElement("div");
    typing.className = "msg msg--bot msg--typing";
    typing.setAttribute("aria-hidden", "true");
    typing.innerHTML = "<i></i><i></i><i></i>";
    log.appendChild(typing);
    scroll();
    var delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : Math.min(900, 280 + html.length * 2);
    return new Promise(function (res) {
      setTimeout(function () {
        typing.remove();
        var m = doc.createElement("div");
        m.className = "msg msg--bot" + (opts.guard ? " is-guard" : "");
        m.innerHTML = html;
        log.appendChild(m);
        setChips(opts.chips || []);
        scroll();
        res();
      }, delay);
    });
  }
  function setChips(list) {
    chips.innerHTML = "";
    list.forEach(function (c) {
      var b = doc.createElement("button");
      b.type = "button";
      b.textContent = c;
      b.addEventListener("click", function () { handle(c); });
      chips.appendChild(b);
    });
  }

  var MAIN = ["Quais soluções vocês oferecem?", "Quero um orçamento", "Posso enviar um projeto?", "Onde fica a ARGENTO?"];

  /* ---------- Base de respostas (somente conteúdo confirmado) ---------- */
  var TECH = ["carga", "capacidade", "suporta", "aguenta", "resist", "kg", "tonelad", "kn", "kgf", "calcul", "dimension", "espacamento", "espacar", "distancia entre", "quantas escoras", "quantidade de escoras", "quantos metros", "montagem", "montar", "desmont", "estrutural", "compativel", "compatibilidade", "art ", "anotacao de responsabilidade", "responsabilidade tecnica", "responsavel tecnico", "engenheiro responsavel", "flecha", "deform", "laudo", "projeto de escoramento", "travar quanto", "pressao do concreto", "altura maxima", "vao maximo", "pode usar em", "e seguro", "seguro usar"];

  var INTENTS = [
    { k: ["oi", "ola", "bom dia", "boa tarde", "boa noite", "e ai"], exact: true, r: function () {
      return bot("Olá! Sou o assistente digital da ARGENTO. Posso explicar nossas soluções, como solicitar orçamento ou registrar seu contato para a equipe.", { chips: MAIN });
    } },
    { k: ["obrigad", "valeu", "agradec"], r: function () {
      return bot("Por nada! Se precisar, estou por aqui. Para falar direto com a equipe: <a href=\"" + TEL + "\">" + PHONE + "</a>.", { chips: MAIN });
    } },
    { k: ["preco", "valor", "custo", "quanto custa", "quanto fica", "tabela", "diaria", "mensalidade"], r: function () {
      return bot("Os valores dependem do sistema, da quantidade, do período e das condições da obra — por isso não informamos preços aqui. Posso coletar alguns dados para a equipe preparar o orçamento?", { chips: ["Sim, quero orçamento", "Ver soluções"] });
    } },
    { k: ["orcamento", "cotacao", "cotar", "proposta", "quero orcamento", "sim quero"], r: function () { return startLead("orçamento"); } },
    { k: ["atendente", "humano", "pessoa", "vendedor", "consultor", "falar com alguem", "falar com a equipe", "comercial"], r: function () {
      return bot("Claro. Você pode ligar para <a href=\"" + TEL + "\">" + PHONE + "</a>" + (cfg.whatsapp ? " ou chamar no <a href=\"https://wa.me/" + cfg.whatsapp + "\" target=\"_blank\" rel=\"noopener\">WhatsApp</a>" : "") + ". Se preferir, deixo seus dados registrados para a equipe retornar.", { chips: ["Registrar meu contato", "Ver soluções"] });
    } },
    { k: ["registrar", "meu contato", "retornar", "me liga", "me ligue", "entrar em contato"], r: function () { return startLead("contato"); } },
    { k: ["deslizante"], r: function () {
      return bot("A <strong>fôrma deslizante</strong> é usada em estruturas verticais executadas de forma contínua — como reservatórios, silos, núcleos e pilares altos. A viabilidade depende do projeto, então o ideal é enviar as informações da obra para a equipe avaliar.", { chips: ["Quero um orçamento", "Posso enviar um projeto?", "Outras fôrmas"] });
    } },
    { k: ["cimbramento", "cimbre"], r: function () {
      return bot("O <strong>cimbramento</strong> é indicado para sustentar estruturas com maiores alturas, vãos ou cargas, como grandes vãos e obras de arte. A definição do sistema é feita pela equipe a partir do projeto.", { chips: ["Escoramento", "Quero um orçamento"] });
    } },
    { k: ["travamento", "travar", "prumo", "alinhamento"], r: function () {
      return bot("O <strong>travamento</strong> garante alinhamento, prumo e estabilidade das fôrmas durante a concretagem de pilares, vigas e paredes. Ele faz parte da linha de fôrmas da ARGENTO.", { chips: ["Fôrmas", "Quero um orçamento"] });
    } },
    { k: ["escora", "escoramento", "escorar", "laje", "viga"], r: function () {
      return bot("Os <strong>escoramentos</strong> dão suporte provisório às estruturas durante a execução — lajes, vigas e outros elementos. A ARGENTO trabalha com <strong>escoramento</strong> e <strong>cimbramento</strong>. <a href=\"" + ROOT + "solucoes/escoramentos.html\">Ver escoramentos →</a>", { chips: ["Quero um orçamento", "Que informações preciso enviar?", "Fôrmas", "Andaimes"] });
    } },
    { k: ["forma", "formas", "metalica", "pilar", "parede", "concreto", "outras formas"], r: function () {
      return bot("As <strong>fôrmas</strong> são usadas na execução de elementos estruturais em concreto. A ARGENTO trabalha com <strong>fôrma metálica</strong>, <strong>fôrma deslizante</strong> e <strong>travamento</strong>. <a href=\"" + ROOT + "solucoes/formas.html\">Ver fôrmas →</a>", { chips: ["Quero um orçamento", "Fôrma deslizante", "Escoramento", "Andaimes"] });
    } },
    { k: ["andaime", "tubular", "fachada", "altura para trabalhar", "acesso"], r: function () {
      return bot("Os <strong>andaimes</strong> oferecem acesso e posição de trabalho temporários — fachadas, reformas, manutenção e outras situações de obra. A ARGENTO trabalha com <strong>andaimes</strong> e <strong>tubular convencional</strong>. <a href=\"" + ROOT + "solucoes/andaimes.html\">Ver andaimes →</a>", { chips: ["Quero um orçamento", "Escoramento", "Fôrmas"] });
    } },
    { k: ["solucoes", "solucao", "produtos", "produto", "equipamentos", "equipamento", "linhas", "o que voces", "trabalham com", "oferecem", "ver solucoes", "servicos"], r: function () {
      return bot("A ARGENTO trabalha com sete linhas de equipamentos:<ul><li>Escoramento</li><li>Cimbramento</li><li>Travamento</li><li>Fôrma metálica</li><li>Fôrma deslizante</li><li>Andaimes</li><li>Tubular convencional</li></ul>Sobre qual delas você quer saber mais?", { chips: ["Escoramento", "Fôrmas", "Andaimes", "Não sei qual preciso"] });
    } },
    { k: ["nao sei", "qual preciso", "qual sistema", "qual solucao", "orientacao", "me ajuda a escolher", "indicar"], r: function () {
      return bot("Sem problema — é para isso que a equipe existe. Me conte o tipo de obra e o que precisa ser executado; registro as informações para que a equipe da ARGENTO avalie e indique o sistema.", { chips: ["Registrar meu contato", "Que informações preciso enviar?"] });
    } },
    { k: ["locacao", "aluguel", "alugar", "comprar", "compra", "venda", "vender"], r: function () {
      return bot("A locação de equipamentos para a construção civil é a atividade principal da ARGENTO. Para outras modalidades, a equipe esclarece caso a caso.", { chips: ["Quero um orçamento", "Ver soluções"] });
    } },
    { k: ["planta", "projeto", "arquivo", "anexo", "anexar", "dwg", "pdf", "foto", "enviar projeto", "mandar projeto"], r: function () {
      return bot("Sim! O <a href=\"" + QUOTE + "\" data-close-chat>formulário de orçamento</a> aceita planta, projeto e fotos (PDF, DWG, DXF ou imagens, até 10 MB cada). Arquivos ajudam a equipe a entender a obra.", { chips: ["Abrir formulário", "Que informações preciso enviar?"] });
    } },
    { k: ["abrir formulario", "formulario"], r: function () {
      close();
      location.href = QUOTE;
      return Promise.resolve();
    } },
    { k: ["informac", "o que preciso", "que dados", "o que enviar", "preciso enviar", "preciso informar"], r: function () {
      return bot("Para um orçamento mais preciso, ajuda ter:<ul><li>Tipo de obra e cidade</li><li>Etapa da obra e prazo</li><li>O que será executado (lajes, pilares, fachada…)</li><li>Planta, projeto ou fotos, se houver</li></ul>", { chips: ["Quero um orçamento", "Posso enviar um projeto?"] });
    } },
    { k: ["fora do rio", "outra cidade", "outro estado", "regiao", "regioes", "atendem", "atende em", "niteroi", "sao goncalo", "baixada", "sao paulo", "minas", "espirito santo", "interior"], r: function () {
      return bot("A ARGENTO tem sede no Rio de Janeiro. Para obras em outras cidades, informe a localização no pedido — a equipe avalia o atendimento caso a caso.", { chips: ["Quero um orçamento", "Registrar meu contato"] });
    } },
    { k: ["endereco", "onde fica", "onde voces", "localiza", "rua", "sede", "escritorio", "visitar"], r: function () {
      return bot("O endereço cadastral da ARGENTO é: Av. Marechal Floriano, 199, Grupo 605 — Centro, Rio de Janeiro/RJ, CEP 20080-005. Para atendimento, recomendamos contato prévio pelo telefone <a href=\"" + TEL + "\">" + PHONE + "</a>.", { chips: ["Quero um orçamento", "Ver soluções"] });
    } },
    { k: ["telefone", "contato", "ligar", "whatsapp", "zap", "email", "e mail"], r: function () {
      var parts = ["Telefone: <a href=\"" + TEL + "\">" + PHONE + "</a>"];
      if (cfg.whatsapp) parts.push("WhatsApp: <a href=\"https://wa.me/" + cfg.whatsapp + "\" target=\"_blank\" rel=\"noopener\">abrir conversa</a>");
      if (cfg.email) parts.push("E-mail: <a href=\"mailto:" + cfg.email + "\">" + esc(cfg.email) + "</a>");
      return bot(parts.join("<br>") + "<br>Se preferir, registro seus dados para a equipe retornar.", { chips: ["Registrar meu contato", "Quero um orçamento"] });
    } },
    { k: ["como funciona", "processo", "etapas", "passo a passo", "proximos passos"], r: function () {
      return bot("Funciona assim:<ul><li><strong>01</strong> Você conta sobre a obra</li><li><strong>02</strong> A equipe entende a necessidade</li><li><strong>03</strong> Define a solução adequada</li><li><strong>04</strong> Você recebe o orçamento</li></ul>", { chips: ["Quero um orçamento", "Que informações preciso enviar?"] });
    } },
    { k: ["empresa", "argento", "quem sao", "sobre", "historia", "desde quando", "fundad", "experiencia", "quanto tempo"], r: function () {
      return bot("A ARGENTO atua desde 2006 no Rio de Janeiro com escoramentos, fôrmas e andaimes para a construção civil, em sete linhas de equipamentos.", { chips: ["Ver soluções", "Quero um orçamento"] });
    } },
    { k: ["seguranca", "norma", "nr 18", "nr18", "nr 35", "nbr"], r: function () {
      return bot("Segurança começa no planejamento: escolher o sistema adequado e ter as informações completas da obra. Questões de dimensionamento e responsabilidade técnica são avaliadas pela equipe para cada projeto. Quer registrar os dados da obra?", { chips: ["Registrar meu contato", "Ver soluções"] });
    } },
    { k: ["prazo de resposta", "quando respondem", "demora", "retorno"], r: function () {
      return bot("A equipe retorna pelo contato informado assim que analisar a solicitação. Para algo urgente, ligue para <a href=\"" + TEL + "\">" + PHONE + "</a>.", { chips: ["Quero um orçamento"] });
    } }
  ];

  /* ---------- Coleta de lead ---------- */
  var STEPS = [
    { key: "nome", ask: "Para começar, qual é o seu nome?", validate: function (v) { return v.length >= 2 ? "" : "Pode me dizer seu nome?"; } },
    { key: "empresa", ask: "Qual é a empresa? (se não houver, toque em “Pular”)", chips: ["Pular"], optional: true },
    { key: "whatsapp", ask: "Qual é o seu WhatsApp com DDD?", validate: function (v) { return v.replace(/\D/g, "").length >= 10 ? "" : "Informe o número com DDD, por favor — ex.: (21) 99999-9999."; } },
    { key: "cidade", ask: "Em qual cidade fica a obra?", validate: function (v) { return v.length >= 2 ? "" : "Qual a cidade da obra?"; } },
    { key: "tipo_obra", ask: "Qual é o tipo de obra?", chips: ["Edifício residencial", "Edifício comercial", "Industrial", "Infraestrutura", "Reforma / manutenção", "Outro"] },
    { key: "necessidade", ask: "Qual é a necessidade principal?", chips: ["Escoramento", "Fôrmas", "Andaimes", "Ainda não sei"] },
    { key: "prazo", ask: "Para quando precisa do equipamento?", chips: ["Imediato (até 15 dias)", "Entre 15 e 30 dias", "De 1 a 3 meses", "Mais de 3 meses", "Ainda não definido"] }
  ];

  function startLead(reason, pre) {
    lead = { i: 0, data: {}, reason: reason };
    var intro = pre || "Perfeito. Vou fazer algumas perguntas rápidas para que a equipe da ARGENTO possa avaliar sua necessidade. Você pode digitar “cancelar” a qualquer momento.";
    return bot(intro).then(askStep);
  }
  function askStep() {
    var s = STEPS[lead.i];
    return bot(s.ask, { chips: s.chips || [] });
  }
  function leadInput(text) {
    var t = norm(text);
    if (t === "cancelar" || t === "parar" || t === "sair") {
      lead = null;
      return bot("Tudo bem, cancelei. Posso ajudar com outra coisa?", { chips: MAIN });
    }
    var s = STEPS[lead.i];
    var v = text.trim();
    if (s.optional && t === "pular") v = "";
    if (s.validate) {
      var err = s.validate(v);
      if (err) return bot(err, { chips: s.chips || [] });
    }
    lead.data[s.key] = v;
    lead.i++;
    if (lead.i < STEPS.length) return askStep();
    return finishLead();
  }
  function finishLead() {
    var d = lead.data;
    if (pendingQuestion) d.mensagem = "Pergunta no assistente: " + pendingQuestion;
    var api = window.ArgentoLead;
    var text = api ? api.summary(d, "assistente") : "";
    var done = lead;
    lead = null;
    pendingQuestion = "";
    var sendP = api && api.configured() ? api.send(d, [], "assistente") : Promise.resolve(false);
    return sendP.then(function (sent) {
      if (sent) {
        return bot("Obrigado, " + esc(d.nome.split(" ")[0]) + "! Suas informações foram enviadas para a equipe da ARGENTO, que vai retornar pelo WhatsApp informado.", { chips: ["Posso enviar um projeto?", "Ver soluções"] });
      }
      prefillForm(d);
      var wa = cfg.whatsapp ? "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(text) : "";
      var html = "Obrigado, " + esc(d.nome.split(" ")[0]) + ". Reuni suas informações:" +
        "<ul>" + ["tipo_obra", "necessidade", "cidade", "prazo"].map(function (k) { return d[k] ? "<li>" + esc(d[k]) + "</li>" : ""; }).join("") + "</ul>" +
        "Para concluir, " + (wa ? "<a href=\"" + wa + "\" target=\"_blank\" rel=\"noopener\">envie pelo WhatsApp</a>, " : "") +
        "ligue para <a href=\"" + TEL + "\">" + PHONE + "</a> ou <a href=\"" + QUOTE + "\" data-close-chat>finalize no formulário</a> — já deixei seus dados preenchidos e lá você pode anexar planta ou fotos.";
      return bot(html, { chips: ["Abrir formulário", "Ver soluções"] });
    });
  }
  function prefillForm(d) {
    try {
      var map = { "q-nome": d.nome, "q-empresa": d.empresa, "q-whats": d.whatsapp, "q-cidade": d.cidade, "q-prazo": d.prazo, "q-tipo": d.tipo_obra, "q-msg": d.mensagem };
      Object.keys(map).forEach(function (id) {
        var el = doc.getElementById(id);
        if (el && map[id] && !el.value) el.value = map[id];
      });
      var need = { "Escoramento": "Escoramento", "Fôrmas": "Fôrmas", "Andaimes": "Andaimes", "Ainda não sei": "Outro" }[d.necessidade];
      if (need) {
        var box = doc.querySelector('input[name="necessidade"][value="' + need + '"]');
        if (box) box.checked = true;
      }
      var ss = window.sessionStorage;
      if (ss) ss.setItem("argento-lead", JSON.stringify(d));
    } catch (e) {}
  }

  /* ---------- Roteamento ---------- */
  function handle(raw) {
    var text = String(raw).trim();
    if (!text) return;
    user(text);
    setChips([]);
    if (lead) return leadInput(text);
    var t = " " + norm(text) + " ";

    if (has(t, TECH) || /\d\s*(kg|t|kn|ton)\b/.test(t)) {
      pendingQuestion = text;
      return bot("Essa questão depende das características específicas da obra. Posso coletar algumas informações para que a equipe da ARGENTO avalie seu projeto.", { guard: true })
        .then(function () { return startLead("técnica", "Vamos lá — são poucas perguntas."); });
    }
    for (var i = 0; i < INTENTS.length; i++) {
      var it = INTENTS[i];
      var hit = it.exact
        ? it.k.some(function (w) { return norm(text) === w || norm(text).indexOf(w + " ") === 0; })
        : has(t, it.k);
      if (hit) return it.r(t);
    }
    pendingQuestion = text;
    return bot("Não tenho essa informação com segurança para responder aqui. Posso registrar sua pergunta e seu contato para a equipe da ARGENTO responder diretamente.", { chips: ["Registrar meu contato", "Ver soluções", "Falar com a equipe"] });
  }

  /* ---------- Abrir / fechar ---------- */
  function open() {
    chat.hidden = false;
    requestAnimationFrame(function () { chat.classList.add("is-open"); });
    fab.setAttribute("aria-expanded", "true");
    if (!started) {
      started = true;
      bot("Olá! Sou o assistente digital da ARGENTO. Posso explicar nossas soluções, como solicitar orçamento e registrar seu contato para a equipe.", { chips: MAIN });
    }
    setTimeout(function () { input.focus({ preventScroll: true }); }, 250);
  }
  function close() {
    chat.classList.remove("is-open");
    fab.setAttribute("aria-expanded", "false");
    setTimeout(function () { if (!chat.classList.contains("is-open")) chat.hidden = true; }, 400);
  }
  window.ArgentoChat = { open: open, close: close };

  fab.addEventListener("click", function () { chat.classList.contains("is-open") ? close() : open(); });
  chat.addEventListener("click", function (e) {
    if (e.target.closest("[data-close-chat]")) { close(); if (e.target.closest(".chat__close")) fab.focus(); }
  });
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && chat.classList.contains("is-open")) { close(); fab.focus(); }
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = input.value;
    input.value = "";
    handle(v);
  });

  // Ao chegar no formulário vindo de outra página após o assistente
  try {
    var saved = window.sessionStorage && window.sessionStorage.getItem("argento-lead");
    if (saved && doc.getElementById("quote-form")) prefillForm(JSON.parse(saved));
  } catch (e) {}
})();

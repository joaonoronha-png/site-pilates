/* =====================================================================
   CONCIERGE VIRTUAL REQUINTE & SABOR
   - Entende linguagem natural por palavras-chave da base de conhecimento
   - Responde em 3 níveis: confirmado · depende · não confirmado
   - Guarda o contexto (evento, data, local, convidados, serviço,
     restrições, nome) e nunca pergunta de novo o que já sabe
   - Conduz para o orçamento e termina no WhatsApp com tudo organizado
   Nenhuma resposta comercial fica aqui: tudo vem de data/knowledge-base.js
   ===================================================================== */
(function () {
  'use strict';
  var KB = window.RS_KB;
  var Lead = window.RSLead;
  var track = window.rsTrack || function () {};
  var mount = document.querySelector('[data-concierge]');
  if (!mount || !KB || !Lead) return;

  var STATE_KEY = 'rs_chat_v1';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ORDER = ['evento', 'data', 'local', 'convidados', 'servicos', 'restricoes', 'nome'];

  /* ------------------------------------------------------------------
     utilidades de texto
     ------------------------------------------------------------------ */
  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s\/]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function cap(s) { return s.replace(/(^|\s)(\S)/g, function (m, a, b) { return a + b.toUpperCase(); }); }
  function hasWord(text, kw) {
    var k = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // palavras curtas: palavra inteira; longas: aceita plural/variações no fim
    var re = kw.length <= 4 ? new RegExp('(^| )' + k + '( |$)') : new RegExp('(^| )' + k);
    return re.test(text);
  }

  /* ------------------------------------------------------------------
     dicionários para extração de dados
     ------------------------------------------------------------------ */
  var MONTHS = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  var MONTHS_PT = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  var EVENTS = [
    [/(^| )(festa infantil|aniversario infantil|festa de crianca|infantil)/, 'Festa infantil'],
    [/(^| )(15 anos|quinze anos|debutante|debut)/, 'Festa de 15 anos'],
    [/(^| )(casamento|casar|casando|caso em|vou me casar|noiva|noivo|noivos|matrimonio|renovacao de votos|renovar os votos)/, 'Casamento'],
    [/(^| )(noivado)/, 'Noivado'],
    [/(^| )(aniversario|niver|festa de \d{2} anos|meus \d{2} anos|\d{2} anos d[aeo])/, 'Aniversário'],
    [/(^| )(coffee break|coffee)( |$)/, 'Coffee break'],
    [/(^| )(corporativ|empresa|confraterniza|palestra|treinamento|congresso|workshop|evento da firma)/, 'Evento corporativo'],
    [/(^| )(cha de bebe|cha revelacao|cha de panela|cha bar|cha de)/, 'Chá'],
    [/(^| )(batizado)/, 'Batizado'],
    [/(^| )(formatura)/, 'Formatura'],
    [/(^| )bodas/, 'Bodas'],
    [/(^| )(evento social|confraternizacao familiar|festa)( |$)/, 'Outro evento social']
  ];

  var PLACES = {
    'barra da tijuca': 'Barra da Tijuca', 'barra': 'Barra da Tijuca', 'recreio': 'Recreio', 'jacarepagua': 'Jacarepaguá',
    'taquara': 'Taquara', 'freguesia': 'Freguesia', 'tijuca': 'Tijuca', 'copacabana': 'Copacabana', 'ipanema': 'Ipanema',
    'leblon': 'Leblon', 'botafogo': 'Botafogo', 'flamengo': 'Flamengo', 'laranjeiras': 'Laranjeiras', 'centro do rio': 'Centro',
    'lapa': 'Lapa', 'santa teresa': 'Santa Teresa', 'meier': 'Méier', 'madureira': 'Madureira', 'bento ribeiro': 'Bento Ribeiro',
    'marechal hermes': 'Marechal Hermes', 'campo grande': 'Campo Grande', 'bangu': 'Bangu', 'realengo': 'Realengo',
    'santa cruz': 'Santa Cruz', 'guaratiba': 'Guaratiba', 'vargem grande': 'Vargem Grande', 'vargem pequena': 'Vargem Pequena',
    'ilha do governador': 'Ilha do Governador', 'vila da penha': 'Vila da Penha', 'penha': 'Penha', 'iraja': 'Irajá',
    'vista alegre': 'Vista Alegre', 'olaria': 'Olaria', 'ramos': 'Ramos', 'bonsucesso': 'Bonsucesso', 'grajau': 'Grajaú',
    'vila isabel': 'Vila Isabel', 'maracana': 'Maracanã', 'sao cristovao': 'São Cristóvão', 'cascadura': 'Cascadura',
    'rocha miranda': 'Rocha Miranda', 'oswaldo cruz': 'Oswaldo Cruz', 'deodoro': 'Deodoro', 'sulacap': 'Sulacap',
    'valqueire': 'Vila Valqueire', 'pechincha': 'Pechincha', 'anil': 'Anil', 'curicica': 'Curicica',
    'niteroi': 'Niterói', 'sao goncalo': 'São Gonçalo', 'duque de caxias': 'Duque de Caxias', 'caxias': 'Duque de Caxias',
    'nova iguacu': 'Nova Iguaçu', 'nilopolis': 'Nilópolis', 'sao joao de meriti': 'São João de Meriti', 'belford roxo': 'Belford Roxo',
    'mesquita': 'Mesquita', 'queimados': 'Queimados', 'itaborai': 'Itaboraí', 'marica': 'Maricá', 'petropolis': 'Petrópolis',
    'teresopolis': 'Teresópolis', 'itaguai': 'Itaguaí', 'seropedica': 'Seropédica', 'mangaratiba': 'Mangaratiba',
    'angra': 'Angra dos Reis', 'buzios': 'Búzios', 'cabo frio': 'Cabo Frio', 'zona sul': 'Zona Sul', 'zona norte': 'Zona Norte',
    'zona oeste': 'Zona Oeste', 'baixada': 'Baixada Fluminense', 'regiao serrana': 'Região Serrana', 'regiao dos lagos': 'Região dos Lagos'
  };
  var PLACE_KEYS = Object.keys(PLACES).sort(function (a, b) { return b.length - a.length; });

  var SERVICES = [
    [/(^| )(buffet)( |$)/, 'Buffet para o evento'],
    [/(^| )(coffee break)/, 'Coffee break']
  ];

  var RESTRICTIONS = [
    [/(^| )vegetarian/, 'vegetariano'], [/(^| )vegan/, 'vegano'], [/(^| )(gluten|celiac)/, 'sem glúten'],
    [/(^| )lactose/, 'sem lactose'], [/(^| )alergi/, 'alergias'], [/(^| )diabet/, 'diabetes'],
    [/(^| )(kosher|halal|religios)/, 'restrição religiosa'], [/(^| )(sem carne|nao como carne)/, 'sem carne'],
    [/(^| )frutos do mar/, 'frutos do mar'], [/(^| )sem acucar/, 'sem açúcar']
  ];

  var NOT_NAMES = /^(noiv\w*|mae|pai|cerimonial\w*|assessor\w*|organizador\w*|responsavel|madrinha|padrinho|filh\w|cliente|interessad\w|eu|aqui|o|a|nao|sim|ok|oi|ola|prefiro|obrigad\w|valeu|talvez|depois|quero|tudo|nenhum\w*|nada|buffet|coffee|casamento|aniversario|evento|festa)$/;

  /* ------------------------------------------------------------------
     estado (persistido na sessão)
     ------------------------------------------------------------------ */
  var state = { leadMode: false, awaiting: null, asked: {}, skipped: {}, complete: false, log: '', opened: false };
  try { var saved = JSON.parse(sessionStorage.getItem(STATE_KEY)); if (saved) state = Object.assign(state, saved); } catch (e) { /* ok */ }
  function persist() {
    state.log = log ? log.innerHTML : state.log;
    try { sessionStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (e) { /* ok */ }
  }

  /* ------------------------------------------------------------------
     interface
     ------------------------------------------------------------------ */
  var ICON_WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2A9.7 9.7 0 0 0 3.6 16.8L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9z"/></svg>';
  mount.innerHTML =
    '<section class="concierge__panel" id="concierge-panel" role="dialog" aria-modal="false" aria-label="Concierge Virtual Requinte &amp; Sabor">' +
      '<header class="concierge__head">' +
        '<span class="concierge__avatar" aria-hidden="true">R<em>&amp;</em>S</span>' +
        '<span class="concierge__head-text"><strong>Concierge Requinte &amp; Sabor</strong><small>Assistente virtual · responde na hora</small></span>' +
        '<button class="concierge__close" type="button" aria-label="Fechar a concierge" data-c-close>×</button>' +
      '</header>' +
      '<button class="concierge__human" type="button" data-c-human>' + ICON_WA + 'Falar com a equipe</button>' +
      '<div class="concierge__log" role="log" aria-live="polite" aria-relevant="additions" data-c-log></div>' +
      '<div class="concierge__chips" data-c-chips></div>' +
      '<form class="concierge__form" data-c-form>' +
        '<label for="concierge-input" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Escreva sua mensagem</label>' +
        '<input class="concierge__input" id="concierge-input" type="text" autocomplete="off" placeholder="Escreva sua mensagem…" maxlength="400" data-c-input>' +
        '<button class="concierge__send" type="submit" aria-label="Enviar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20.5 21 12 3 3.5 3 10l12 2-12 2z"/></svg></button>' +
      '</form>' +
      '<p class="concierge__disclaimer">Assistente virtual. Preços, datas e condições são sempre confirmados pela equipe.</p>' +
    '</section>';

  var panel = mount.querySelector('.concierge__panel');
  var log = mount.querySelector('[data-c-log]');
  var chipsBox = mount.querySelector('[data-c-chips]');
  var input = mount.querySelector('[data-c-input]');
  var lastFocus = null;

  if (state.log) log.innerHTML = state.log;

  function scrollDown() { log.scrollTop = log.scrollHeight; }

  function addMsg(role, html) {
    var m = document.createElement('div');
    m.className = 'msg msg--' + role;
    m.innerHTML = html;
    log.appendChild(m);
    scrollDown();
    persist();
    return m;
  }

  var queue = Promise.resolve();
  function bot(html) {
    queue = queue.then(function () {
      return new Promise(function (resolve) {
        var t = document.createElement('div');
        t.className = 'msg msg--bot typing';
        t.innerHTML = '<i></i><i></i><i></i>';
        t.setAttribute('aria-hidden', 'true');
        log.appendChild(t); scrollDown();
        var plain = html.replace(/<[^>]+>/g, '');
        var delay = reduceMotion ? 120 : Math.min(1100, 380 + plain.length * 6);
        setTimeout(function () { t.remove(); addMsg('bot', html); resolve(); }, delay);
      });
    });
    return queue;
  }

  function setChips(list) {
    chipsBox.innerHTML = '';
    (list || []).forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'chip';
      b.textContent = c.label;
      if (c.action) b.setAttribute('data-action', c.action);
      else b.setAttribute('data-say', c.say || c.label);
      chipsBox.appendChild(b);
    });
    state.chips = list || [];
  }

  function summaryCard() {
    var rows = Lead.filled().filter(function (r) { return r[2] !== 'duvidas'; });
    if (!rows.length) return '';
    return '<dl class="msg__card">' + rows.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>';
  }
  function waButton(label, intro) {
    return '<a class="btn btn--wa" target="_blank" rel="noopener" data-c-wa="' + esc(intro || '') + '" href="' + Lead.waUrl(Lead.message(intro || undefined)) + '">' + esc(label) + '</a>';
  }

  /* ------------------------------------------------------------------
     entendimento
     ------------------------------------------------------------------ */
  function isQuestion(raw, t) {
    return /\?/.test(raw) || /^(voces|vcs|vc|voce|fazem|faz|atendem|atende|tem|tera|como|qual|quais|quanto|quantos|quantas|pode|podem|posso|existe|e possivel|da pra|consigo|aceitam|incluem|inclui|serve|servem|onde|quando|precisa|preciso saber|gostaria de saber|queria saber)( |$)/.test(t);
  }

  function matchTopics(t) {
    var scored = [];
    KB.topics.forEach(function (tp) {
      var score = 0;
      tp.keywords.forEach(function (kw) {
        if (hasWord(t, kw)) score += kw.split(' ').length * 2 + kw.length / 20;
      });
      if (score > 0) scored.push({ topic: tp, score: score });
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored;
  }

  function parseDate(t) {
    var m;
    if ((m = t.match(/(^| )(\d{1,2})\s*\/\s*(\d{1,2})(?:\s*\/\s*(\d{2,4}))?( |$)/))) {
      var d = +m[2], mo = +m[3];
      if (d >= 1 && d <= 31 && mo >= 1 && mo <= 12) {
        var y = m[4] ? (m[4].length === 2 ? '20' + m[4] : m[4]) : null;
        return ('0' + d).slice(-2) + '/' + ('0' + mo).slice(-2) + (y ? '/' + y : '');
      }
    }
    var mre = MONTHS.join('|');
    if ((m = t.match(new RegExp('(?:dia )?(\\d{1,2}) de (' + mre + ')(?: de (\\d{4}))?')))) {
      return m[1] + ' de ' + MONTHS_PT[MONTHS.indexOf(m[2])] + (m[3] ? ' de ' + m[3] : '');
    }
    if ((m = t.match(new RegExp('(^| )(' + mre + ')(?: de (\\d{4})| (\\d{4}))?( |$)')))) {
      // "marco" sozinho pode ser nome; só aceita com contexto de data
      if (m[2] === 'marco' && !/(em|de|para|pra|no mes de) marco/.test(t)) return null;
      return MONTHS_PT[MONTHS.indexOf(m[2])] + (m[3] || m[4] ? ' de ' + (m[3] || m[4]) : '');
    }
    if (/(ano que vem|proximo ano)/.test(t)) return 'ano que vem';
    if (/(mes que vem|proximo mes)/.test(t)) return 'mês que vem';
    if ((m = t.match(/(^| )(em|para|pra) (202\d|203\d)( |$)/))) return m[3];
    if (/(sem data|nao tenho data|nao tem data|data indefinida|nao sei a data|ainda nao defini a data|ainda sem data)/.test(t)) return 'A definir';
    return null;
  }

  function parseGuests(t, awaiting) {
    var m = t.match(/(\d{2,4})\s*(pessoas|convidados|convidadas|pax|lugares|participantes|adultos)/);
    if (m) return m[1];
    m = t.match(/(^| )(para|pra|uns|umas|cerca de|aproximadamente|em torno de|mais ou menos|quase|ate|por volta de) (\d{2,4})( |$)/);
    if (m && !/\/|de (janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)/.test(t.slice(m.index, m.index + 30))) {
      var n = +m[3];
      if (n >= 10 && n < 2020) return String(n);
    }
    if (/(^| )cem( |$)/.test(t)) return '100';
    if (awaiting === 'convidados') {
      var r = KB.quote.guestRanges.filter(function (g) { return norm(g) === t; })[0];
      if (r) return r;
      m = t.match(/(^| )(\d{2,4})( |$)/);
      if (m) return m[2];
    }
    return null;
  }

  function parsePlace(raw, t, awaiting, loose) {
    for (var i = 0; i < PLACE_KEYS.length; i++) {
      var k = PLACE_KEYS[i];
      if (new RegExp('(^| )' + k + '( |$)').test(t)) {
        // "barra" sozinha só vale com contexto de local
        if (k === 'barra' && !/(na|em|da|de|pra|para) barra/.test(t) && awaiting !== 'local') continue;
        return PLACES[k];
      }
    }
    var m = raw.match(/(?:vai ser|será|sera|vai acontecer|fica|local (?:é|e|será|sera))\s+(?:em|no|na|num|numa)\s+([^.,!?\n]{3,50})/i) ||
      raw.match(/(?:no espa[çc]o|no sal[ãa]o|na ch[áa]cara|no s[íi]tio|num s[íi]tio|numa ch[áa]cara|na casa de festas?)\s+([^.,!?\n]{3,50})/i);
    if (m && !/^(o |a )?(dia|data|mes|em \d)/i.test(m[1]) && !/\d+\s*(pessoas|convidados)/i.test(m[1])) return cap(m[1].trim());
    if (awaiting === 'local' && loose) {
      if (/(nao sei|ainda nao|nao defini|sem local|indefinido|procurando)/.test(t)) return 'A definir';
      var clean = raw.replace(/^(vai ser|será|sera|é|e|fica)\s+(em|no|na)?\s*/i, '').replace(/^(em|no|na)\s+/i, '').trim();
      if (clean.length >= 2 && clean.length <= 60 && !/\?/.test(clean)) return cap(clean.replace(/[.!]+$/, ''));
    }
    return null;
  }

  function parseName(raw, t, awaiting, loose) {
    var m = raw.match(/(?:meu nome [ée]|me chamo|aqui [ée] (?:o|a)|pode me chamar de)\s+([A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)?)/i);
    if (m && !NOT_NAMES.test(norm(m[1].split(' ')[0]))) return cap(m[1].toLowerCase());
    m = raw.match(/(?:^|\s)sou (?:o|a)\s+([A-Za-zÀ-ÿ]+)/i);
    if (m && !NOT_NAMES.test(norm(m[1]))) return cap(m[1].toLowerCase());
    if (loose && awaiting !== 'nome' && state.leadMode && !Lead.has('nome') && /^[A-ZÀ-Ý][a-zà-ÿ]+(\s[A-ZÀ-Ý][a-zà-ÿ]+)?$/.test(raw.trim()) && !NOT_NAMES.test(t.split(' ')[0]) && !PLACES[t]) return raw.trim();
    if (awaiting === 'nome' && loose) {
      var clean = raw.replace(/^(é|e|sou|eu sou|me chamo|meu nome é|meu nome e|oi|olá|ola)[,\s]+/i, '').replace(/[.!]+$/, '').trim();
      var words = clean.split(/\s+/);
      if (clean && !/\d/.test(clean) && words.length <= 4 && clean.length <= 40 && !NOT_NAMES.test(norm(words[0]))) return cap(clean.toLowerCase());
    }
    return null;
  }

  /* extrai tudo o que der da mensagem e grava no lead; devolve o que foi novo */
  function extract(raw, t, loose) {
    var got = {};
    var aw = state.awaiting;

    if (!Lead.has('evento') || aw === 'evento') {
      for (var i = 0; i < EVENTS.length; i++) if (EVENTS[i][0].test(t)) { got.evento = EVENTS[i][1]; break; }
      if (!got.evento && aw === 'evento') {
        var ev = KB.eventTypes.filter(function (e) { return norm(e.label) === t; })[0];
        if (ev) got.evento = ev.label;
      }
    }
    var d = parseDate(t);
    if (!d && aw === 'data' && /(nao sei|ainda nao|indefinid|sem data|nao tenho)/.test(t)) d = 'A definir';
    if (!d && aw === 'data' && loose && raw.length <= 40 && /\d/.test(raw)) d = raw.trim();
    if (d && (!Lead.has('data') || aw === 'data' || d !== 'A definir')) got.data = d;

    var g = parseGuests(t, aw);
    if (g) got.convidados = g;

    var p = parsePlace(raw, t, aw, loose && !got.evento && !got.data && !g);
    if (p && (aw === 'local' || p !== 'A definir')) got.local = p;

    var svcs = [];
    SERVICES.forEach(function (s) { if (s[0].test(t)) svcs.push(s[1]); });
    // "buffet" genérico só conta como serviço quando é a resposta ao que procura
    if (aw !== 'servicos') svcs = svcs.filter(function (s) { return s !== 'Buffet para o evento'; });
    if (!svcs.length && aw === 'servicos') {
      var ch = KB.services.filter(function (s) { return norm(s.label) === t; })[0];
      if (ch) svcs.push(ch.label);
      else if (/(nao sei|ainda nao|tanto faz|indecis|me ajud|sugest)/.test(t)) svcs.push(KB.quote.unsureOption);
    }
    if (svcs.length) got.servicos = svcs;

    var rs = [];
    RESTRICTIONS.forEach(function (r) { if (r[0].test(t)) rs.push(r[1]); });
    if (rs.length) got.restricoes = rs;
    else if (aw === 'restricoes') {
      if (/^(nao|n|nenhuma|nenhum|nada|sem restric|nao tem|tudo certo|ninguem|nao temos)/.test(t)) got.restricoes = ['nenhuma informada'];
      else if (loose && raw.length <= 200) got.observacoes = raw.trim();
    }

    var n = parseName(raw, t, aw, loose && !got.servicos && !got.evento && !got.local && !got.restricoes);
    if (n) got.nome = n;
    else if (aw === 'nome' && /^(nao|prefiro nao|nao quero|pular)/.test(t)) state.skipped.nome = true;

    // grava
    Object.keys(got).forEach(function (k) {
      if (k === 'servicos' || k === 'restricoes') got[k].forEach(function (v) { Lead.add(k, v); });
      else Lead.set(k, got[k]);
    });
    if (got.servicos) got.servicos.forEach(function (s) { track('service_interest', { service: s, source: 'chat' }); });
    return got;
  }

  function ackText(got) {
    var parts = [];
    if (got.evento) parts.push(got.evento.toLowerCase());
    if (got.data) parts.push(got.data === 'A definir' ? 'data ainda a definir' : (/^\d/.test(got.data) ? 'em ' + got.data : 'em ' + got.data));
    if (got.convidados) parts.push(/^\d+$/.test(got.convidados) ? got.convidados + ' convidados' : got.convidados.toLowerCase() + ' convidados');
    if (got.local) parts.push(got.local === 'A definir' ? 'local a definir' : got.local);
    if (got.servicos) parts.push(got.servicos.join(', ').toLowerCase());
    if (got.restricoes) parts.push('restrições: ' + got.restricoes.join(', '));
    if (!parts.length) return '';
    return 'Anotei: ' + parts.join(' · ') + '.';
  }

  /* ------------------------------------------------------------------
     condução do orçamento
     ------------------------------------------------------------------ */
  function nextSlot() {
    for (var i = 0; i < ORDER.length; i++) {
      var k = ORDER[i];
      if (state.skipped[k]) continue;
      if (k === 'restricoes' && (Lead.has('restricoes') || Lead.has('observacoes'))) continue;
      if (!Lead.has(k)) return k;
    }
    return null;
  }

  function question(slot) {
    var ev = Lead.get('evento');
    var evName = ev === 'Casamento' ? 'do casamento' : ev === 'Festa de 15 anos' ? 'da festa de 15 anos' : 'do evento';
    var eventChips = KB.eventTypes.filter(function (e) { return e.quote; }).map(function (e) { return { label: e.label }; });
    var map = {
      evento: ['Para começar: qual é o tipo de evento?', eventChips],
      data: ['Você já tem a data ' + evName + '?', [{ label: 'Ainda não tenho data', say: 'ainda não tenho data' }]],
      local: ['E onde vai ser a celebração? Pode ser o bairro, a cidade ou o nome do espaço.', [{ label: 'Ainda não defini', say: 'ainda não defini o local' }]],
      convidados: ['Quantos convidados, mais ou menos?', KB.quote.guestRanges.map(function (g) { return { label: g }; })],
      servicos: ['O que mais combina com o que você imagina?', KB.services.filter(function (s) { return s.quote; }).map(function (s) { return { label: s.label }; }).concat([{ label: KB.quote.unsureOption }])],
      restricoes: ['Algum convidado com restrição alimentar, ou alguma observação importante?', [{ label: 'Não, tudo certo', say: 'não' }]],
      nome: ['Perfeito! Para eu deixar tudo organizado para a equipe: qual é o seu nome?', []]
    };
    return map[slot];
  }

  function askNext(prefix) {
    var slot = nextSlot();
    if (!slot) return finishLead(prefix);
    state.asked[slot] = (state.asked[slot] || 0) + 1;
    if (state.asked[slot] > 2) { state.skipped[slot] = true; return askNext(prefix); }
    state.awaiting = slot;
    var q = question(slot);
    bot((prefix ? esc(prefix) + ' ' : '') + esc(q[0]));
    setChips(q[1].concat([{ label: 'Falar com a equipe', action: 'handoff' }]));
    persist();
  }

  function finishLead(prefix) {
    state.awaiting = null;
    var first = !state.complete;
    state.complete = true;
    var nome = Lead.get('nome');
    bot((prefix ? esc(prefix) + '<br><br>' : '') + 'Prontinho' + (nome ? ', ' + esc(nome) : '') + '! Seu pedido está praticamente pronto para a equipe da Requinte &amp; Sabor:' + summaryCard() +
      '<div class="msg__actions">' + waButton('Continuar pelo WhatsApp') + '</div>');
    setChips([{ label: 'Corrigir uma informação', action: 'fix' }, { label: 'Tenho outra dúvida', action: 'other' }]);
    if (first) track('chat_lead_complete', { evento: Lead.get('evento') });
    if (window.RSQuote) window.RSQuote.rebuild();
    persist();
  }

  /* ------------------------------------------------------------------
     respostas
     ------------------------------------------------------------------ */
  function topicReply(tp, raw) {
    var html, extra = '';
    if (tp.status === 'nao_confirmado') {
      Lead.add('duvidas', raw.length > 140 ? raw.slice(0, 140) + '…' : raw);
      var pre = '';
      if (tp.captureRestriction && Lead.has('restricoes')) pre = 'Anotei a restrição (' + esc(Lead.get('restricoes').join(', ')) + ') para a equipe. ';
      html = pre + esc(KB.messages.unconfirmed);
      extra = '<div class="msg__actions">' + waButton('Encaminhar pelo WhatsApp') + '</div>';
      track('chat_unconfirmed', { topic: tp.id });
    } else {
      html = esc(tp.answer);
      if (tp.offerMenu) extra = '<div class="msg__actions">' + '<a class="btn btn--ghost" target="_blank" rel="noopener" data-c-wa="' + esc(KB.whatsappTemplates.cardapio) + '" href="' + Lead.waUrl(Lead.message(KB.whatsappTemplates.cardapio)) + '">Pedir opções de cardápio</a></div>';
      track('chat_answer', { topic: tp.id, status: tp.status });
    }
    return html + extra;
  }

  function handle(raw) {
    var t = norm(raw);
    if (!t) return;
    var wasAwaiting = state.awaiting;
    var topics = matchTopics(t);
    var top = topics[0] && topics[0].score >= 2 ? topics[0].topic : null;
    var question_ = isQuestion(raw, t);

    // intenções rápidas
    if (/(falar com (alguem|atendente|humano|uma pessoa|a equipe|voces)|atendente|atendimento humano|pessoa real)/.test(t)) return handoff();
    if (/^(oi|ola|bom dia|boa tarde|boa noite|e ai|hey|hello|opa)( requinte| requinte e sabor| requinte sabor)?$/.test(t)) {
      bot('Olá! 😊 Como posso ajudar? Posso tirar dúvidas sobre os serviços ou preparar um pedido de orçamento para o seu evento.');
      return setChips(initialChips());
    }
    if (/^(obrigad|valeu|agradeco|brigad|muito obrigad)/.test(t)) {
      bot('Imagina! Foi um prazer ajudar. ' + (state.leadMode && !state.complete ? 'Quer continuar de onde paramos?' : 'Se precisar, é só chamar.'));
      return setChips(state.leadMode && !state.complete ? [{ label: 'Continuar', action: 'continue' }, { label: 'Falar com a equipe', action: 'handoff' }] : initialChips());
    }

    // "quero um orçamento" (sem perguntar preço) → vai direto para a condução
    if (top && top.id === 'preco' && !/(preco|valor|quanto|cust|por pessoa|por convidado|tabela)/.test(t)) {
      extract(raw, t, false);
      if (!state.leadMode) track('chat_lead_start', { via: 'texto' });
      state.leadMode = true;
      if (state.complete || !nextSlot()) return finishLead();
      return askNext(Lead.filled().length ? 'Ótimo! Já tenho algumas informações suas, então vamos só completar.' : 'Ótimo! Vou te fazer algumas perguntas rápidas e deixar seu pedido pronto para a equipe 😊');
    }

    var loose = !question_ && !top;
    var got = extract(raw, t, loose);
    var gotKeys = Object.keys(got).filter(function (k) { return k !== 'observacoes' || wasAwaiting === 'restricoes'; });
    var ack = ackText(got);

    // a mensagem respondeu ao que perguntamos?
    var answeredAwaiting = wasAwaiting && (got[wasAwaiting] || (wasAwaiting === 'restricoes' && got.observacoes));

    var leadTrigger = top && top.startsLead;
    var gaveInfo = gotKeys.some(function (k) { return ['evento', 'data', 'local', 'convidados'].indexOf(k) > -1; });
    if (leadTrigger || gaveInfo) {
      if (!state.leadMode) track('chat_lead_start', { via: top ? top.id : 'info' });
      state.leadMode = true;
    }

    // 1) é uma pergunta sobre um tópico → responde o tópico
    var eventTopicOnly = top && top.setsEvent && !question_;
    if (top && (question_ || !gotKeys.length) && !eventTopicOnly && !(answeredAwaiting && !question_)) {
      bot(topicReply(top, raw));
      if (state.leadMode && !state.complete) {
        if (top.askSlot && !Lead.has(top.askSlot)) { state.asked[top.askSlot] = 0; }
        askNext(ack ? 'Já ' + ack.charAt(0).toLowerCase() + ack.slice(1) : '');
      } else if (state.complete && gotKeys.length) {
        finishLead(ack);
      } else {
        setChips(top.status === 'nao_confirmado'
          ? [{ label: 'Quero um orçamento', action: 'start_quote' }, { label: 'Tenho outra dúvida', action: 'other' }]
          : [{ label: 'Quero um orçamento', action: 'start_quote' }, { label: 'Quais eventos vocês atendem?' }, { label: 'Tenho outra dúvida', action: 'other' }]);
      }
      return persist();
    }

    // 2) a pessoa deu informações (ou respondeu à pergunta)
    if (gotKeys.length) {
      var warm = '';
      if (got.evento === 'Casamento' && !state.congrats) { warm = 'Que notícia linda! 🤍 '; state.congrats = true; }
      if (state.complete) return finishLead(warm + ack);
      return askNext(warm + ack);
    }

    // a pessoa preferiu não responder → segue sem insistir
    if (wasAwaiting && state.skipped[wasAwaiting]) {
      if (state.complete || !nextSlot()) return finishLead('Tudo bem!');
      return askNext('Tudo bem!');
    }

    // 3) estávamos esperando uma resposta e não entendemos
    if (wasAwaiting) {
      var q = question(wasAwaiting);
      bot('Desculpe, não consegui entender. ' + esc(q[0]));
      setChips(q[1].concat([{ label: 'Pular esta pergunta', action: 'skip' }, { label: 'Falar com a equipe', action: 'handoff' }]));
      return persist();
    }

    // 4) não entendemos: guarda a dúvida para a equipe
    Lead.add('duvidas', raw.length > 140 ? raw.slice(0, 140) + '…' : raw);
    track('chat_fallback');
    bot(esc(KB.messages.fallback) + '<div class="msg__actions">' + waButton('Enviar minha pergunta à equipe') + '</div>');
    setChips(initialChips());
    persist();
  }

  function handoff() {
    track('chat_handoff', { filled: Lead.filled().length });
    var card = summaryCard();
    bot(esc(KB.messages.handoff) + card + '<div class="msg__actions">' + waButton('Abrir WhatsApp com minhas informações', Lead.filled().length ? null : KB.whatsappTemplates.default) + '</div>');
    setChips(state.leadMode && !state.complete ? [{ label: 'Continuar aqui', action: 'continue' }] : initialChips());
    persist();
  }

  function initialChips() {
    return [
      { label: 'Quero um orçamento', action: 'start_quote' },
      { label: 'Quais eventos vocês atendem?' },
      { label: 'Vocês fazem casamento?' },
      { label: 'Quero conhecer o cardápio' },
      { label: 'Tenho outra dúvida', action: 'other' }
    ];
  }

  function action(a) {
    if (a === 'start_quote') {
      addMsg('user', 'Quero um orçamento');
      if (!state.leadMode) track('chat_lead_start', { via: 'chip' });
      state.leadMode = true;
      if (state.complete) return finishLead();
      return askNext(Lead.filled().length ? 'Ótimo! Já tenho algumas informações suas, então vamos só completar.' : 'Ótimo! Vou te fazer algumas perguntas rápidas e deixar seu pedido pronto para a equipe 😊');
    }
    if (a === 'other') {
      addMsg('user', 'Tenho outra dúvida');
      state.awaiting = null;
      bot('Claro! Pode escrever sua pergunta do seu jeito — sobre cardápio, datas, pagamento, tipos de evento… Se eu não tiver a informação confirmada, levo sua dúvida para a equipe.');
      setChips([]);
      setTimeout(function () { input.focus(); }, 50);
      return persist();
    }
    if (a === 'handoff') { addMsg('user', 'Falar com a equipe'); return handoff(); }
    if (a === 'continue') { addMsg('user', 'Continuar'); return state.complete ? finishLead() : askNext(); }
    if (a === 'skip') {
      addMsg('user', 'Pular');
      if (state.awaiting) state.skipped[state.awaiting] = true;
      return askNext();
    }
    if (a === 'fix') {
      addMsg('user', 'Corrigir uma informação');
      bot('Sem problema. Escreva a informação correta — por exemplo “são 120 convidados” ou “vai ser em Niterói” — que eu atualizo o resumo.');
      state.awaiting = null;
      setChips([]);
      return persist();
    }
  }

  /* ------------------------------------------------------------------
     abrir / fechar
     ------------------------------------------------------------------ */
  function open(context) {
    if (mount.classList.contains('is-open')) return;
    lastFocus = document.activeElement;
    mount.classList.add('is-open');
    document.documentElement.classList.add('chat-open');
    if (window.matchMedia('(max-width: 959px)').matches) document.body.style.overflow = 'hidden';
    var ui = window.RSUI; var l = ui && ui.lenis && ui.lenis(); if (l && window.matchMedia('(max-width: 959px)').matches) l.stop();
    if (ui && ui.refreshDock) ui.refreshDock();
    track('chat_open', { context: context || 'launcher' });
    if (!log.children.length) {
      bot(esc(KB.messages.greeting));
      setChips(initialChips());
    } else if (state.chips) setChips(state.chips);
    setTimeout(function () { input.focus({ preventScroll: true }); scrollDown(); }, 350);
  }
  function close() {
    mount.classList.remove('is-open');
    document.documentElement.classList.remove('chat-open');
    document.body.style.overflow = '';
    var ui = window.RSUI; var l = ui && ui.lenis && ui.lenis(); if (l) l.start();
    if (ui && ui.refreshDock) ui.refreshDock();
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  mount.querySelector('[data-c-close]').addEventListener('click', close);
  mount.querySelector('[data-c-human]').addEventListener('click', function () { addMsg('user', 'Falar com a equipe'); handoff(); });
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  mount.querySelector('[data-c-form]').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value.trim();
    if (!v) return;
    input.value = '';
    addMsg('user', esc(v));
    setChips([]);
    handle(v);
  });
  chipsBox.addEventListener('click', function (e) {
    var b = e.target.closest('.chip');
    if (!b) return;
    if (b.hasAttribute('data-action')) { setChips([]); return action(b.getAttribute('data-action')); }
    var say = b.getAttribute('data-say');
    addMsg('user', esc(b.textContent));
    setChips([]);
    handle(say);
  });
  // botões de WhatsApp dentro das mensagens: sempre com os dados mais recentes
  log.addEventListener('click', function (e) {
    var a = e.target.closest('[data-c-wa]');
    if (!a) return;
    var intro = a.getAttribute('data-c-wa') || undefined;
    a.href = Lead.waUrl(Lead.message(intro));
    track('whatsapp_click', { context: 'chat' });
    track('chat_to_whatsapp', { filled: Lead.filled().length });
  });

  function ask(v) {
    v = String(v || '').trim();
    if (!v) return;
    addMsg('user', esc(v));
    setChips([]);
    handle(v);
  }

  window.RSConcierge = { open: open, close: close, handle: handle, ask: ask };
})();

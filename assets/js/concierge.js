/*
 * Concierge da Temporada — assistente virtual do site.
 *
 * Funciona 100% no navegador (motor local abaixo), lendo só data/site-data.js.
 * Se data/config.js tiver `aiEndpoint` (ex.: "/api/concierge"), as mensagens
 * vão para o backend com IA (api/concierge.mjs, Claude) e o motor local vira
 * a reserva automática caso a IA falhe ou demore.
 *
 * Nunca inventa preço, disponibilidade ou regra: o que não está na base vira
 * "a equipe confirma" e entra no resumo enviado ao WhatsApp.
 */
(function () {
  'use strict';
  var D = window.SITE_DATA, E = D.empresa, CFG = window.SITE_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var chat = $('#chat'), log = $('#chat-log'), form = $('#chat-form'), input = $('#chat-input'), chips = $('#chat-chips'), fab = $('#fab');
  if (!chat) return;
  var APP = function () { return window.APP; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var norm = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim(); };

  /* ---------- memória (compartilhada na sessão) ---------- */
  var mem = load() || { dest: '', guests: 0, kids: 0, pet: false, am: [], checkin: '', checkout: '', ocasiao: '', duvidas: [], lang: 'pt', sugeridos: [] };
  var history = [];
  function load() { try { return JSON.parse(sessionStorage.getItem('atrj-concierge')); } catch (e) { return null; } }
  function save() { try { sessionStorage.setItem('atrj-concierge', JSON.stringify(mem)); } catch (e) {} }

  /* ---------- entendimento ---------- */
  var NUM = { um: 1, uma: 1, dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9, dez: 10, onze: 11, doze: 12, treze: 13, catorze: 14, quatorze: 14,
    una: 1, uno: 1, cuatro: 4, siete: 7, ocho: 8, nueve: 9, diez: 10, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  var MESES = { janeiro: 1, jan: 1, fevereiro: 2, fev: 2, marco: 3, mar: 3, abril: 4, abr: 4, maio: 5, junho: 6, jun: 6, julho: 7, jul: 7, agosto: 8, ago: 8, setembro: 9, set: 9, outubro: 10, out: 10, novembro: 11, nov: 11, dezembro: 12, dez: 12,
    enero: 1, febrero: 2, marzo: 3, mayo: 5, junio: 6, julio: 7, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12 };
  var AM = [
    ['piscina', /piscina|pileta|pool|alberca/],
    ['pet', /\bpets?\b|cachorr|\bcao\b|caes|cadela|gato|animal|perr[oa]|mascota|\bdogs?\b/],
    ['garagem', /garagem|\bvaga\b|estacionamento|estacionar|\bcarro\b|cochera|parking/],
    ['peNaAreia', /frente (para |pro |ao |a )?(o )?mar|frente (para |a )?(a )?praia|pe na areia|beira[ -]mar|beachfront|frente al mar/],
    ['vistaMar', /vista (para |pro )?(o )?mar|vista mar|ocean view|sea view|vista al mar/],
    ['homeOffice', /home ?office|trabalh|remoto|escritorio em casa|notebook|work/],
    ['churrasqueira', /churras|parrilla|asado|bbq|barbecue/],
    ['academia', /academia|\bgym\b|gimnasio|malhar/],
    ['sauna', /sauna/],
    ['kitPraia', /kit praia|cadeira de praia|guarda[ -]?sol|sombrilla/],
    ['familia', /famili|crianca|filh[oa]s?|bebe|kids|ninos|children|nenem/]
  ];
  function detectLang(n) {
    if (/\b(hola|quiero|quisiera|playa|personas|gracias|departamento|depto|cuanto cuesta|pileta|tienen|precio|noches|nosotros|queremos ir)\b/.test(n)) return 'es';
    if (/\b(hello|hi there|want|beach|people|thanks|apartment|price|how much|nights|we are)\b/.test(n)) return 'en';
    return null;
  }
  function parseNumberBefore(n, words) {
    var re = new RegExp('(\\d{1,2}|' + Object.keys(NUM).join('|') + ')\\s+(?:' + words + ')');
    var m = n.match(re); if (!m) return 0;
    return /\d/.test(m[1]) ? parseInt(m[1], 10) : NUM[m[1]] || 0;
  }
  function iso(y, m, d) { return y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0'); }
  function yearFor(m, d) { var now = new Date(), y = now.getFullYear(); return new Date(y, m - 1, d) < new Date(now.getFullYear(), now.getMonth(), now.getDate()) ? y + 1 : y; }
  function parseDates(n) {
    var m = n.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\D+(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
    if (m) {
      var y1 = m[3] ? (m[3].length === 2 ? 2000 + +m[3] : +m[3]) : yearFor(+m[2], +m[1]);
      var y2 = m[6] ? (m[6].length === 2 ? 2000 + +m[6] : +m[6]) : (+m[5] < +m[2] ? y1 + 1 : y1);
      return [iso(y1, +m[2], +m[1]), iso(y2, +m[5], +m[4])];
    }
    // "de 10 a 15 de janeiro" / "del 3 al 8 de marzo"
    m = n.match(/(?:de|del|dia)?\s*(\d{1,2})\s*(?:a|ao|al|ate|-)\s*(\d{1,2})\s*de\s*([a-z]+)/);
    if (m && MESES[m[3]]) { var mo = MESES[m[3]], y = yearFor(mo, +m[1]); return [iso(y, mo, +m[1]), iso(y, mo, +m[2])]; }
    return null;
  }
  function parse(text) {
    var n = norm(text), got = {};
    var lang = detectLang(n); if (lang && mem.lang === 'pt') { mem.lang = lang; got.lang = lang; }
    if (/\bbarra\b|recreio|jardim oceanico|lucio costa/.test(n)) got.dest = 'barra';
    else if (/copa|copacabana|leme|zona sul|ipanema/.test(n)) got.dest = 'copacabana';
    else if (/angra|ilha grande|\bilhas?\b|islas?/.test(n)) got.dest = 'angra';
    var g = parseNumberBefore(n, 'pessoas|pessoa|hospedes|hospede|adultos|personas|people|pax|amigos|amigas|guests|adults');
    var k = parseNumberBefore(n, 'criancas|crianca|filhos|filhas|ninos|kids|children|bebes');
    if (!g) { var m = n.match(/somos (\d{1,2}|[a-z]+)|we are (\d{1,2}|[a-z]+)|para (\d{1,2})\b/); if (m) { var v = m[1] || m[2] || m[3]; g = /\d/.test(v) ? +v : NUM[v] || 0; } }
    if (!g && /\bdos (personas|adultos)/.test(n)) g = 2;
    if (!g && /\bcasal\b|\bpareja\b|\bcouple\b|lua de mel/.test(n)) g = 2;
    if (g || k) { got.guests = (g || mem.guests || 0) + (k && !/total/.test(n) ? k : 0); if (k) got.kids = k; }
    if (got.guests > 30) delete got.guests;
    var am = [];
    AM.forEach(function (a) { if (a[1].test(n)) am.push(a[0]); });
    if (/\bsem\b.*pet|nao (tem|vou com) pet/.test(n)) am = am.filter(function (x) { return x !== 'pet'; });
    if (am.length) got.am = am;
    var d = parseDates(n); if (d) { got.checkin = d[0]; got.checkout = d[1]; }
    if (/reveillon|ano novo|virada|new year|ano nuevo/.test(n)) got.ocasiao = 'Réveillon';
    else if (/carnaval|carnival/.test(n)) got.ocasiao = 'Carnaval';
    else if (/natal|navidad|christmas/.test(n)) got.ocasiao = 'Natal';
    else if (/feriado|feriadao/.test(n)) got.ocasiao = 'feriado';
    else if (/lua de mel|honeymoon|romantic|aniversario de casamento/.test(n)) got.ocasiao = 'viagem romântica';
    return { n: n, got: got };
  }
  function merge(got) {
    // destino novo = busca nova: as comodidades pedidas antes não valem mais
    if (got.dest && mem.dest && got.dest !== mem.dest) { mem.am = []; mem.sugeridos = []; }
    ['dest', 'guests', 'kids', 'checkin', 'checkout', 'ocasiao'].forEach(function (k) { if (got[k]) mem[k] = got[k]; });
    if (got.am) got.am.forEach(function (a) { if (mem.am.indexOf(a) < 0) mem.am.push(a); });
    if (got.am && got.am.indexOf('pet') > -1) mem.pet = true;
    save();
  }

  function faqMatch(n) {
    var best = null, score = 0;
    D.faq.forEach(function (f) {
      var s = 0;
      f.palavras.forEach(function (p) { if (n.indexOf(norm(p)) > -1) s += norm(p).length > 6 ? 2 : 1; });
      if (s > score) { score = s; best = f; }
    });
    return score ? best : null;
  }

  /* ---------- recomendação ---------- */
  function recommend() {
    var pool = D.imoveis.slice(), relaxed = [];
    var need = mem.guests || 1;
    var fits = function (i, am, dest) {
      if (dest && i.destino !== dest) return false;
      if (i.hospedes < need) return false;
      return am.every(function (a) { return i.comodidades.indexOf(a) > -1; });
    };
    var am = mem.am.slice(), dest = mem.dest;
    var list = pool.filter(function (i) { return fits(i, am, dest); });
    while (!list.length && am.length) { relaxed.push(am.pop()); list = pool.filter(function (i) { return fits(i, am, dest); }); }
    var otherDest = false;
    if (!list.length && dest) { list = pool.filter(function (i) { return fits(i, mem.am, ''); }); otherDest = list.length > 0; }
    list.sort(function (a, b) {
      var sa = mem.am.filter(function (x) { return a.comodidades.indexOf(x) > -1; }).length, sb = mem.am.filter(function (x) { return b.comodidades.indexOf(x) > -1; }).length;
      if (sb !== sa) return sb - sa;
      return parseFloat((b.nota || '0').replace(',', '.')) - parseFloat((a.nota || '0').replace(',', '.'));
    });
    return { list: list.slice(0, 3), total: list.length, relaxed: relaxed, otherDest: otherDest };
  }
  function nomeAm(k) { return (D.comodidades[k] || k).toLowerCase(); }
  function resumoBusca() {
    var p = [];
    if (mem.guests) p.push(mem.guests + (mem.guests === 1 ? ' pessoa' : ' pessoas') + (mem.kids ? ' (' + mem.kids + ' criança' + (mem.kids > 1 ? 's' : '') + ')' : ''));
    if (mem.dest) p.push(APP().destName[mem.dest]);
    if (mem.am.length) p.push(mem.am.map(nomeAm).join(', '));
    if (mem.checkin && mem.checkout) p.push(APP().fmtDate(mem.checkin) + ' a ' + APP().fmtDate(mem.checkout));
    else if (mem.ocasiao) p.push(mem.ocasiao);
    return p.join(' · ');
  }

  /* ---------- resposta local ---------- */
  function localReply(text) {
    var r = parse(text), n = r.n, got = r.got;
    merge(got);
    var out = { text: '', cards: [], actions: [], chips: [] };
    var hasCriteria = Object.keys(got).filter(function (k) { return k !== 'lang'; }).length > 0;
    var lead = '';
    if (got.lang === 'es') lead = '¡Hola! Respondo en portugués, pero entiendo español. ';
    if (got.lang === 'en') lead = 'Hi! I reply in Portuguese, but I understand English. ';

    if (/\b(atendente|humano|pessoa real|falar com alguem|whatsapp|zap|ligar|telefone)\b/.test(n)) {
      out.text = lead + 'Claro. Toque no botão abaixo: a conversa abre no WhatsApp ' + E.whatsappExibicao + ' com o resumo do que você me contou.';
      out.actions.push(handoffAction()); return out;
    }
    if (/^(ainda )?nao sei|^tanto faz|^qualquer/.test(n)) {
      out.text = 'Sem problema. Quando tiver as datas, é só me dizer. Enquanto isso, veja os imóveis e me pergunte o que quiser sobre eles.';
      out.chips = ['Ver imóveis', 'Aceita pet?', 'Horário de check-in']; return out;
    }
    if (/^(obrigad|valeu|gracias|thanks|thank you|perfeito|show|otimo|top)/.test(n)) {
      out.text = 'Por nada! Quando quiser, é só chamar a equipe no WhatsApp para fechar as datas.';
      out.actions.push(handoffAction()); return out;
    }
    if (/tenho (um|uma) (imovel|apartamento|ape|casa|flat|cobertura)|sou proprietari|meu (imovel|apartamento|ape)|administra(m|r)? (o )?meu|gestao (do|de) imove/.test(n)) {
      var own = D.faq.filter(function (f) { return f.id === 'proprietario'; })[0];
      out.text = lead + own.resposta + ' Fale com a equipe para uma avaliação do seu imóvel.';
      out.actions = [waAction('Falar sobre gestão', 'Olá! Tenho um imóvel e quero saber sobre a gestão para temporada do Grupo 3D.\n' + text.slice(0, 200))];
      out.chips = ['Anunciar meu imóvel'];
      APP().track('chat_owner'); return out;
    }
    var faq = faqMatch(n);
    var wantsHome = /quero|procuro|preciso|busco|teria|opcoes|opcao|apartamento|ape\b|apto|flat|casa|imovel|lugar|hospedagem|ficar|alugar|indica|recomend|sugest|departamento|depto|house|place|stay|mais barat|economic/.test(n);

    if (/mais barat|economic|barato|cheap|em conta/.test(n)) {
      out.text = lead + 'Os valores ainda não ficam públicos no site porque mudam com a data e a lotação. ' +
        'Me diga as datas e quantas pessoas que eu já deixo o pedido pronto para a equipe responder com o preço de cada opção.';
      var rec0 = recommend(); out.cards = rec0.list.map(function (i) { return i.slug; });
      out.actions.push(handoffAction('Quero saber o valor')); return out;
    }

    var novaBusca = got.dest || got.guests || got.checkin || got.ocasiao;
    if (faq && !(wantsHome && novaBusca) && !/^(oi|ola|bom dia|boa tarde|boa noite)\b/.test(n)) {
      out.text = lead + faq.resposta;
      if (faq.status === 'pendente') { mem.duvidas.push(faq.pergunta); save(); out.text += '\n\nEssa informação a equipe confirma no atendimento; já anotei sua dúvida no resumo.'; out.actions.push(handoffAction()); }
      if (faq.id === 'proprietario') out.actions = [waAction('Falar sobre gestão', 'Olá! Tenho um imóvel no Rio e quero saber sobre a gestão para temporada do Grupo 3D.')];
      if (faq.id === 'barco' || faq.id === 'criancas') out.cards = D.imoveis.filter(function (i) { return faq.id === 'barco' ? i.destino === 'angra' : i.comodidades.indexOf('familia') > -1; }).slice(0, 3).map(function (i) { return i.slug; });
      APP().track('chat_faq', { id: faq.id });
      return out;
    }

    if (hasCriteria || wantsHome) {
      var rec = recommend();
      APP().applyFilters({ dest: rec.otherDest ? '' : mem.dest, am: mem.am.filter(function (a) { return rec.relaxed.indexOf(a) < 0; }), guests: mem.guests || 2, checkin: mem.checkin, checkout: mem.checkout });
      if (!rec.list.length) {
        out.text = lead + 'Nenhum dos nossos imóveis recebe ' + mem.guests + ' pessoas de uma vez. O maior é a Casa Ponta da Cruz, em Angra, para até 14 hóspedes. Quer que a equipe veja uma combinação de imóveis?';
        out.actions.push(handoffAction()); return out;
      }
      var head = resumoBusca();
      out.text = lead + (head ? 'Para ' + head + ', ' : '') + (rec.list.length === 1 ? 'esta é a opção que combina:' : 'estas são as opções que mais combinam:');
      if (rec.relaxed.length) out.text = lead + 'Nenhum imóvel tem tudo junto (' + rec.relaxed.map(nomeAm).join(', ') + '). ' + (head ? 'Para ' + head + ', ' : '') + 'o mais próximo do que você pediu:';
      if (rec.otherDest) out.text = lead + 'Em ' + APP().destName[mem.dest] + ' não encontrei tudo isso, mas em outro destino tem:';
      out.cards = rec.list.map(function (i) { return i.slug; });
      mem.sugeridos = out.cards; save();
      var faltam = [];
      if (!mem.checkin && !mem.ocasiao) faltam.push('as datas');
      if (!mem.guests) faltam.push('quantas pessoas vão');
      if (!mem.dest) out.chips = ['Na Barra', 'Em Copacabana/Leme', 'Em Angra'];
      if (faltam.length) { out.text += '\n\nPara consultar a disponibilidade, me diga ' + faltam.join(' e ') + '.'; out.chips = out.chips.concat(faltam.indexOf('as datas') > -1 ? ['Réveillon', 'Carnaval', 'Ainda não sei'] : []); }
      out.actions.push(handoffAction('Consultar disponibilidade'));
      APP().track('chat_recommend', { n: rec.list.length });
      return out;
    }

    if (/^(oi|ola|bom dia|boa tarde|boa noite|hola|hello|hi|e ai)\b/.test(n)) {
      out.text = lead + 'Oi! Sou o concierge virtual. Conte para onde, quando e com quem você vem que eu indico o imóvel certo, ou tire qualquer dúvida sobre check-in, pets, garagem e regras.';
      out.chips = ['4 pessoas na Barra', 'Família com crianças', 'Casa em Angra para 10', 'Aceita pet?'];
      return out;
    }

    mem.duvidas.push(text.slice(0, 140)); save();
    APP().track('chat_unconfirmed');
    out.text = lead + 'Não tenho essa informação confirmada aqui. Anotei a sua pergunta e ela vai junto no resumo para a equipe responder no WhatsApp.';
    out.actions.push(handoffAction()); out.chips = ['Ver imóveis', 'Horário de check-in', 'Aceita pet?'];
    return out;
  }

  /* ---------- WhatsApp ---------- */
  function handoffText() {
    var p = ['Olá! Conversei com o assistente do site.'];
    var r = resumoBusca(); if (r) p.push('Procuro: ' + r + '.');
    if (mem.ocasiao && mem.checkin) p.push('Ocasião: ' + mem.ocasiao + '.');
    if (mem.pet) p.push('Vou levar pet.');
    if (mem.sugeridos.length) p.push('Imóveis que gostei: ' + mem.sugeridos.map(function (s) { return D.imoveis.filter(function (i) { return i.slug === s; })[0].nome; }).join('; ') + '.');
    if (mem.duvidas.length) p.push('Dúvidas: ' + mem.duvidas.slice(-4).join(' / '));
    p.push('Pode me ajudar com disponibilidade e valores?');
    return p.join('\n');
  }
  function handoffAction(label) { return { label: label || 'Falar com a equipe', href: APP().waLink(handoffText()) }; }
  function waAction(label, msg) { return { label: label, href: APP().waLink(msg) }; }

  /* ---------- interface ---------- */
  function bubble(cls, html) {
    var d = document.createElement('div'); d.className = 'msg ' + cls; d.innerHTML = html; log.appendChild(d);
    log.scrollTop = log.scrollHeight; return d;
  }
  function renderReply(out) {
    var html = esc(out.text);
    if (out.cards && out.cards.length) {
      html += '<div class="msg__cards">' + out.cards.map(function (slug) {
        var i = D.imoveis.filter(function (x) { return x.slug === slug; })[0]; if (!i) return '';
        var p = APP().img(i);
        return '<button type="button" class="mini" data-open="' + slug + '"><img src="' + p.src + '" alt="" loading="lazy"><span><strong>' + esc(i.nome) + '</strong><small>' +
          esc(APP().destName[i.destino]) + ' · até ' + i.hospedes + ' hóspedes' + (i.nota ? ' · ★ ' + i.nota : '') + '</small></span></button>';
      }).join('') + '</div>';
    }
    if (out.actions && out.actions.length) {
      html += '<div class="msg__actions">' + out.actions.map(function (a) {
        return '<a href="' + esc(a.href) + '" target="_blank" rel="noopener" data-chat-wa><svg aria-hidden="true"><use href="#i-wa"/></svg>' + esc(a.label) + '</a>';
      }).join('') + '</div>';
    }
    var b = bubble('msg--bot', html);
    Array.prototype.forEach.call(b.querySelectorAll('[data-open]'), function (x) {
      x.addEventListener('click', function () { APP().track('chat_open_property', { slug: x.dataset.open }); if (window.innerWidth < 520) close(); APP().openImovel(x.dataset.open); });
    });
    Array.prototype.forEach.call(b.querySelectorAll('[data-chat-wa]'), function (x) {
      x.addEventListener('click', function () { x.href = APP().waLink(handoffText()); APP().track('chat_to_whatsapp'); });
    });
    setChips(out.chips && out.chips.length ? out.chips : null);
    history.push({ role: 'assistant', content: out.text });
  }
  var DEFAULT_CHIPS = ['4 pessoas na Barra com piscina', 'Família com crianças', 'Casa em Angra para 10', 'Aceita pet?', 'Horário de check-in', 'Tenho um imóvel'];
  function setChips(list) {
    chips.innerHTML = (list || DEFAULT_CHIPS).map(function (c) { return '<button type="button">' + esc(c) + '</button>'; }).join('');
    Array.prototype.forEach.call(chips.querySelectorAll('button'), function (b) { b.addEventListener('click', function () { send(b.textContent); }); });
  }

  var busy = false;
  function send(text) {
    text = String(text || '').trim(); if (!text || busy) return;
    if (text === 'Ver imóveis') { if (window.innerWidth < 950) close(); APP().showResults(); return; }
    if (text === 'Anunciar meu imóvel') { close(); location.hash = 'anuncie'; return; }
    bubble('msg--user', esc(text));
    history.push({ role: 'user', content: text });
    busy = true;
    var typing = bubble('msg--bot msg--typing', '<i></i><i></i><i></i>');
    var finish = function (out) { typing.remove(); busy = false; renderReply(out); };
    if (CFG.aiEndpoint) {
      // IA (Claude) com o motor local como reserva
      var local = localReply(text);
      var ctrl = 'AbortController' in window ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 12000);
      fetch(CFG.aiEndpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctrl && ctrl.signal,
        body: JSON.stringify({ messages: history.slice(-10), memoria: { busca: resumoBusca(), duvidas: mem.duvidas.slice(-4) } })
      }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (j) {
          clearTimeout(timer);
          if (!j || typeof j.text !== 'string') throw new Error('formato');
          var cards = (j.imoveis || []).filter(function (s) { return D.imoveis.some(function (i) { return i.slug === s; }); }).slice(0, 3);
          if (cards.length) { mem.sugeridos = cards; save(); }
          finish({ text: j.text, cards: cards.length ? cards : local.cards, actions: j.handoff || local.actions.length ? [handoffAction()] : [], chips: local.chips });
        })
        .catch(function () { clearTimeout(timer); finish(local); });
    } else {
      setTimeout(function () { finish(localReply(text)); }, 450 + Math.min(700, text.length * 12));
    }
  }

  var greeted = false;
  function open(focusInput) {
    chat.hidden = false; fab.classList.add('chat-open');
    Array.prototype.forEach.call(document.querySelectorAll('[data-open-chat]'), function (b) { if (b.hasAttribute('aria-expanded')) b.setAttribute('aria-expanded', 'true'); });
    if (!greeted) {
      greeted = true;
      bubble('msg--bot', esc('Olá! Sou o concierge virtual da Aluguel Temporada RJ. Me conte como é a sua viagem (destino, datas e quantas pessoas) que eu indico o imóvel ideal. Também respondo dúvidas sobre check-in, pets, garagem e regras.'));
      setChips(null);
      APP().track('chat_open');
    }
    if (focusInput !== false && window.innerWidth > 520) input.focus();
  }
  function close() {
    chat.hidden = true; fab.classList.remove('chat-open');
    Array.prototype.forEach.call(document.querySelectorAll('[data-open-chat][aria-expanded]'), function (b) { b.setAttribute('aria-expanded', 'false'); });
  }
  document.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest('[data-open-chat]'); if (t) { e.preventDefault(); open(); } });
  Array.prototype.forEach.call(document.querySelectorAll('[data-close-chat]'), function (b) { b.addEventListener('click', close); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !chat.hidden && document.getElementById('sheet').hidden) close(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); var v = input.value; input.value = ''; send(v); });
  $('[data-handoff]').addEventListener('click', function (e) { e.currentTarget.href = APP().waLink(handoffText()); APP().track('chat_handoff'); });

  window.CONCIERGE = { open: open, close: close, ask: function (q) { open(false); send(q); }, _reply: localReply, _parse: parse, _mem: function () { return mem; }, _reset: function () { mem = { dest: '', guests: 0, kids: 0, pet: false, am: [], checkin: '', checkout: '', ocasiao: '', duvidas: [], lang: 'pt', sugeridos: [] }; history = []; save(); } };
})();

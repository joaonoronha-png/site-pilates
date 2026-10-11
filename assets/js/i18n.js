/* Aluguel Temporada RJ — idiomas (português, español, english)
 * O site é escrito em português. Para ES e EN, cada texto da página (inclusive o que
 * aparece depois: imóveis, dúvidas, assistente, mapa) é trocado pela tradução em
 * data/i18n.js. Textos com números ou nomes no meio usam as regras abaixo.
 * A escolha fica salva no navegador; trocar de idioma recarrega a página.
 */
(function () {
  'use strict';
  var LANGS = ['pt', 'es', 'en'];
  var saved = null;
  try { saved = localStorage.getItem('atrj-lang'); } catch (e) {}
  var nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'pt';
  var lang = LANGS.indexOf(saved) > -1 ? saved : /^es/i.test(nav) ? 'es' : /^en/i.test(nav) ? 'en' : 'pt';
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;

  var DICT = (window.I18N_DICT && window.I18N_DICT[lang]) || {};
  var norm = function (s) { return String(s).replace(/\s+/g, ' ').trim(); };

  // textos que dependem de números ou nomes: [regex, função que monta a tradução]
  var W = {
    es: { night: ['noche', 'noches'], guest: ['huésped', 'huéspedes'], person: ['persona', 'personas'], child: ['niño', 'niños'], prop: ['propiedad', 'propiedades'], acc: ['alojamiento', 'alojamientos'] },
    en: { night: ['night', 'nights'], guest: ['guest', 'guests'], person: ['person', 'people'], child: ['child', 'children'], prop: ['property', 'properties'], acc: ['stay', 'stays'] }
  }[lang];
  var pl = function (n, k) { return n + ' ' + W[k][Number(n) === 1 ? 0 : 1]; };
  var ES = lang === 'es';
  var RULES = lang === 'pt' ? [] : [
    [/^(\d+) noites? · (\d+) hóspede\(s\)$/, function (m) { return pl(m[1], 'night') + ' · ' + pl(m[2], 'guest'); }],
    [/^Este imóvel recebe até (\d+) hóspedes\.$/, function (m) { return ES ? 'Esta propiedad recibe hasta ' + m[1] + ' huéspedes.' : 'This property sleeps up to ' + m[1] + ' guests.'; }],
    [/^(\d+) imóve(?:l|is)$/, function (m) { return pl(m[1], 'prop'); }],
    [/^imóve(?:l|is)$/, function () { return ES ? 'propiedades' : 'properties'; }],
    [/^(\d+) imóveis: toque para aproximar$/, function (m) { return ES ? m[1] + ' propiedades: toca para acercar' : m[1] + ' properties: tap to zoom in'; }],
    [/^(\d+) acomodaç(?:ão|ões) em (.+)$/, function (m) { return pl(m[1], 'acc') + (ES ? ' en ' : ' in ') + t(m[2]); }],
    [/^Até (\d+) hóspedes(.*)$/, function (m) { return (ES ? 'Hasta ' + m[1] + ' huéspedes' : 'Up to ' + m[1] + ' guests') + m[2]; }],
    [/^Ampliar foto (\d+)$/, function (m) { return (ES ? 'Ampliar foto ' : 'Enlarge photo ') + m[1]; }],
    [/^\+(\d+) fotos?$/, function (m) { return '+' + m[1] + (ES ? (m[1] === '1' ? ' foto' : ' fotos') : (m[1] === '1' ? ' photo' : ' photos')); }],
    [/^(.+) — Aluguel Temporada RJ$/, function (m) { return t(m[1]) + ' — Aluguel Temporada RJ'; }],
    // assistente
    [/^Nenhum dos nossos imóveis recebe (\d+) pessoas de uma vez\.$/, function (m) { return ES ? 'Ninguna de nuestras propiedades recibe ' + m[1] + ' personas a la vez.' : 'None of our properties sleeps ' + m[1] + ' people at once.'; }],
    [/^Para (.+), (esta é a opção que combina:|estas são as opções que mais combinam:|o mais próximo do que você pediu:)$/, function (m) { return (ES ? 'Para ' : 'For ') + resumo(m[1]) + ', ' + t(m[2]); }],
    [/^Nenhum imóvel tem tudo junto \((.+)\)\.$/, function (m) { return (ES ? 'Ninguna propiedad tiene todo junto (' : 'No property has it all (') + list(m[1]) + ').'; }],
    [/^Em (.+) não encontrei tudo isso, mas em outro destino tem:$/, function (m) { return ES ? 'En ' + t(m[1]) + ' no encontré todo eso, pero en otro destino sí:' : 'I couldn\'t find all of that in ' + t(m[1]) + ', but another destination has it:'; }],
    [/^Para consultar a disponibilidade, me diga (.+)\.$/, function (m) {
      var p = m[1].split(' e ').map(function (x) { return x === 'as datas' ? (ES ? 'las fechas' : 'your dates') : (ES ? 'cuántas personas van' : 'how many people are coming'); });
      return (ES ? 'Para consultar la disponibilidad, dime ' : 'To check availability, tell me ') + p.join(ES ? ' y ' : ' and ') + '.';
    }],
    // mensagens de WhatsApp montadas no site
    [/^Olá! Vim pelo site e tenho interesse no imóvel "(.+)" \((.+)\)\.$/, function (m) { // o nome do imóvel fica em português para a equipe reconhecer
      return ES ? '¡Hola! Vengo del sitio web y me interesa la propiedad "' + m[1] + '" (' + t(m[2]) + ').' : 'Hi! I found you on the website and I\'m interested in "' + m[1] + '" (' + t(m[2]) + ').'; }],
    [/^Datas: (\S+) a (\S+) \((\d+) noites\)\.$/, function (m) { return (ES ? 'Fechas: ' + m[1] + ' al ' + m[2] : 'Dates: ' + m[1] + ' to ' + m[2]) + ' (' + pl(m[3], 'night') + ').'; }],
    [/^Hóspedes: (.+)\.$/, function (m) { return (ES ? 'Huéspedes: ' : 'Guests: ') + m[1] + '.'; }],
    [/^Data: (.+)\.$/, function (m) { return (ES ? 'Fecha: ' : 'Date: ') + (m[1] === 'a definir' ? (ES ? 'a definir' : 'to be decided') : m[1]) + '.'; }],
    [/^Pessoas: (.+)\.$/, function (m) { return (ES ? 'Personas: ' : 'People: ') + (m[1] === 'a definir' ? (ES ? 'a definir' : 'to be decided') : m[1]) + '.'; }],
    [/^Lancha: (.+)\.$/, function (m) { return (ES ? 'Lancha: ' : 'Boat: ') + t(m[1]) + '.'; }],
    [/^Roteiro: (.+)\.$/, function (m) { return (ES ? 'Ruta: ' : 'Route: ') + t(m[1]) + '.'; }],
    [/^Hospedagem: (.+)\.$/, function (m) { return (ES ? 'Alojamiento: ' : 'Stay: ') + t(m[1]) + '.'; }],
    [/^Procuro: (.+)\.$/, function (m) { return (ES ? 'Busco: ' : 'Looking for: ') + resumo(m[1]) + '.'; }],
    [/^Ocasião: (.+)\.$/, function (m) { return (ES ? 'Ocasión: ' : 'Occasion: ') + t(m[1]) + '.'; }],
    [/^Imóveis que gostei: (.+)\.$/, function (m) { return (ES ? 'Propiedades que me gustaron: ' : 'Properties I liked: ') + m[1] + '.'; }],
    [/^Dúvidas: (.+)$/, function (m) { return (ES ? 'Dudas: ' : 'Questions: ') + m[1]; }],
    [/^Quero saber sobre a lancha (.+) para passeio em Angra dos Reis: datas e valor\.$/, function (m) { return ES ? 'Quiero saber sobre la lancha ' + m[1] + ' para un paseo en Angra dos Reis: fechas y precio.' : 'I\'d like to know about the ' + m[1] + ' boat for a trip in Angra dos Reis: dates and price.'; }],
    [/^Quero fazer o roteiro (.+) de lancha em Angra dos Reis\.$/, function (m) { return ES ? 'Quiero hacer la ruta ' + t(m[1]) + ' en lancha en Angra dos Reis.' : 'I\'d like to do the ' + t(m[1]) + ' boat route in Angra dos Reis.'; }],
    [/^Nome: (.+)$/, function (m) { return (ES ? 'Nombre: ' : 'Name: ') + m[1]; }],
    [/^E-mail: (.+)$/, function (m) { return 'E-mail: ' + m[1]; }],
    [/^(Apartamento|Casa|Flat|Cobertura|Outro) em (.+)$/, function (m) { return t(m[1]) + (ES ? ' en ' : ' in ') + m[2]; }],
    [/^Anúncio\/fotos: (.+)$/, function (m) { return (ES ? 'Anuncio/fotos: ' : 'Listing/photos: ') + m[1]; }],
    [/^Observações: (.+)$/, function (m) { return (ES ? 'Observaciones: ' : 'Notes: ') + m[1]; }],
    [/^(\d+) quarto\(s\)$/, function (m) { return m[1] + (ES ? ' habitación(es)' : ' bedroom(s)'); }],
    [/^(\d+) banheiro\(s\)$/, function (m) { return m[1] + (ES ? ' baño(s)' : ' bathroom(s)'); }],
    [/^(\d+) vaga\(s\)$/, function (m) { return m[1] + (ES ? ' plaza(s) de garaje' : ' parking space(s)'); }],
    [/^(\d+) hóspedes$/, function (m) { return pl(m[1], 'guest'); }]
  ];
  // "4 pessoas (2 crianças) · Barra da Tijuca · piscina, vista para o mar · 10/01/2027 a 15/01/2027"
  function resumo(s) {
    return s.split(' · ').map(function (p) {
      var m = p.match(/^(\d+) pessoas?(?: \((\d+) crianças?\))?$/);
      if (m) return pl(m[1], 'person') + (m[2] ? ' (' + pl(m[2], 'child') + ')' : '');
      m = p.match(/^(\S+) a (\S+)$/);
      if (m && /\d/.test(m[1])) return m[1] + (ES ? ' al ' : ' to ') + m[2];
      return list(p);
    }).join(' · ');
  }
  function list(s) { return s.split(', ').map(function (x) { return t(x); }).join(', '); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function one(k) {
    if (Object.prototype.hasOwnProperty.call(DICT, k)) return DICT[k];
    for (var i = 0; i < RULES.length; i++) { var m = k.match(RULES[i][0]); if (m) return RULES[i][1](m); }
    // comodidade em minúsculas no meio da frase ("piscina")
    var c = cap(k);
    if (c !== k && Object.prototype.hasOwnProperty.call(DICT, c)) { var v = DICT[c]; return v.charAt(0).toLowerCase() + v.slice(1); }
    return null;
  }
  function t(s) {
    if (lang === 'pt' || s == null) return s;
    var str = String(s);
    if (str.indexOf('\n') > -1) return str.split('\n').map(t).join('\n');
    var lead = str.match(/^\s*/)[0], trail = str.match(/\s*$/)[0], k = norm(str);
    if (!k || !/[A-Za-zÀ-ú]/.test(k)) return str;
    var r = one(k);
    if (r == null) {
      // frase composta: traduz sentença por sentença
      var parts = k.replace(/([.!?:])\s+(?=[A-ZÀ-Ú¡¿"“(])/g, '$1\u0001').split('\u0001');
      if (parts.length > 1) {
        var any = false;
        parts = parts.map(function (p) { var x = one(p); if (x != null) { any = true; return x; } return p; });
        if (any) r = parts.join(' ');
      }
    }
    if (r == null && k.indexOf(' · ') > -1) {
      var bits = k.split(' · '), hit = false;
      bits = bits.map(function (b) { var x = one(b); if (x != null) { hit = true; return x; } return b; });
      if (hit) r = bits.join(' · ');
    }
    if (r == null && lang === 'en') r = k.replace(/\b([0-5]),(\d{2})\b/g, '$1.$2') === k ? null : k.replace(/\b([0-5]),(\d{2})\b/g, '$1.$2');
    return r == null ? str : lead + r + trail;
  }

  var ATTRS = ['placeholder', 'aria-label', 'alt', 'title'];
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, CODE: 1 };
  function node(n) {
    if (n.nodeType === 3) {
      var p = n.parentNode; if (!p || SKIP[p.nodeName] || (p.closest && p.closest('[data-no-i18n]'))) return;
      var v = t(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v;
    } else if (n.nodeType === 1) {
      if (SKIP[n.nodeName] || n.hasAttribute('data-no-i18n')) return;
      for (var i = 0; i < ATTRS.length; i++) { var a = n.getAttribute(ATTRS[i]); if (a) { var x = t(a); if (x !== a) n.setAttribute(ATTRS[i], x); } }
      if ((n.nodeName === 'INPUT' && (n.type === 'submit' || n.type === 'button')) && n.value) n.value = t(n.value);
    }
  }
  function apply(root) {
    if (lang === 'pt' || !root) return;
    node(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) node(n);
  }
  if (lang !== 'pt' && 'MutationObserver' in window) {
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        if (m.type === 'characterData') node(m.target);
        else if (m.type === 'attributes') node(m.target);
        else m.addedNodes.forEach(function (a) { if (a.nodeType === 1) apply(a); else node(a); });
      });
    }).observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }

  function set(l) {
    if (LANGS.indexOf(l) < 0 || l === lang) return;
    try { localStorage.setItem('atrj-lang', l); sessionStorage.setItem('atrj-intro', '1'); } catch (e) {}
    location.reload();
  }
  window.I18N = { lang: lang, t: t, apply: apply, set: set };

  // seletor de idioma no topo e no menu
  // o script fica no fim da página: o que já está na tela é traduzido antes do primeiro desenho
  apply(document.documentElement);
  function ui() {
    apply(document.documentElement);
    Array.prototype.forEach.call(document.querySelectorAll('[data-lang]'), function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
      b.addEventListener('click', function () { set(b.dataset.lang); });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-lang-current]'), function (e) { e.textContent = lang.toUpperCase(); });
    var box = document.querySelector('.lang'), tg = box && box.querySelector('.lang__btn');
    if (tg) {
      tg.addEventListener('click', function (e) { e.stopPropagation(); var o = !box.classList.contains('is-open'); box.classList.toggle('is-open', o); tg.setAttribute('aria-expanded', String(o)); });
      document.addEventListener('click', function () { box.classList.remove('is-open'); tg.setAttribute('aria-expanded', 'false'); });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ui); else ui();
})();

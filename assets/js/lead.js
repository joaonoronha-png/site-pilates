/* Lead compartilhado entre o Orçamento e a Concierge Virtual.
   O que o visitante conta em um lugar não precisa ser repetido no outro.
   Guardado apenas na sessão do navegador (sessionStorage). */
(function () {
  'use strict';
  var KB = window.MAPERSI_KB;
  var KEY = 'mapersi_lead_v1';
  var FIELDS = [
    ['evento', 'Evento'],
    ['data', 'Data'],
    ['local', 'Local'],
    ['convidados', 'Convidados'],
    ['servicos', 'Interesse'],
    ['restricoes', 'Restrições'],
    ['observacoes', 'Observações'],
    ['duvidas', 'Dúvidas para a equipe'],
    ['nome', 'Nome']
  ];

  var data = {};
  try { data = JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch (e) { data = {}; }

  var listeners = [];
  function save() {
    try { sessionStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* sem storage: segue em memória */ }
    listeners.forEach(function (fn) { fn(data); });
  }

  function isEmpty(v) { return v == null || v === '' || (Array.isArray(v) && !v.length); }

  var Lead = {
    fields: FIELDS,
    get: function (k) { return k ? data[k] : Object.assign({}, data); },
    set: function (k, v) {
      if (isEmpty(v)) delete data[k]; else data[k] = v;
      save();
    },
    add: function (k, v) {
      var arr = Array.isArray(data[k]) ? data[k] : (data[k] ? [data[k]] : []);
      if (arr.indexOf(v) === -1) arr.push(v);
      data[k] = arr; save();
    },
    has: function (k) { return !isEmpty(data[k]); },
    reset: function () { data = {}; save(); },
    onChange: function (fn) { listeners.push(fn); },
    filled: function () {
      return FIELDS.filter(function (f) { return !isEmpty(data[f[0]]); })
        .map(function (f) { var v = data[f[0]]; return [f[1], Array.isArray(v) ? v.join(', ') : v, f[0]]; });
    },

    /* Mensagem organizada para o WhatsApp */
    message: function (intro) {
      var rows = Lead.filled().filter(function (r) { return r[2] !== 'nome'; });
      var lines = [intro || KB.messages.waIntro];
      if (rows.length) {
        lines.push('');
        rows.forEach(function (r) { lines.push('• ' + r[0] + ': ' + r[1]); });
      }
      if (data.nome) { lines.push(''); lines.push('Meu nome é ' + data.nome + '.'); }
      return lines.join('\n');
    },

    waUrl: function (text) {
      return 'https://wa.me/' + KB.company.whatsapp.e164 + '?text=' + encodeURIComponent(text);
    }
  };

  window.MapersiLead = Lead;
})();

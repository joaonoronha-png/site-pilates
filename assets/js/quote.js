/* Orçamento interativo — uma pergunta por tela.
   As opções vêm da base de conhecimento (apenas serviços e eventos confirmados).
   As respostas são compartilhadas com a Concierge Virtual via MapersiLead. */
(function () {
  'use strict';
  var KB = window.MAPERSI_KB;
  var Lead = window.MapersiLead;
  var track = window.mapersiTrack || function () {};
  var root = document.querySelector('[data-quote]');
  if (!root || !KB || !Lead) return;
  var form = root.querySelector('[data-quote-form]');
  var bar = root.querySelector('[data-quote-bar]');
  var countEl = root.querySelector('[data-quote-count]');
  var totalEl = root.querySelector('[data-quote-total]');

  var eventOpts = KB.eventTypes.filter(function (e) { return e.quote; }).map(function (e) { return e.label; });
  var serviceOpts = KB.services.filter(function (s) { return s.quote; }).map(function (s) { return s.label; });
  serviceOpts.push(KB.quote.unsureOption);

  var steps = [
    { key: 'evento', type: 'radio', title: 'Qual é o seu evento?', options: eventOpts, grid: true },
    { key: 'data', type: 'date', title: 'Quando será?', help: 'Se ainda não tiver a data exata, tudo bem.', unsure: 'Ainda não tenho data definida' },
    { key: 'local', type: 'text', title: 'Onde será?', help: 'Bairro, cidade ou nome do espaço.', placeholder: 'Ex.: Barra da Tijuca, Rio de Janeiro', unsure: 'Ainda não defini o local' },
    { key: 'convidados', type: 'radio', title: 'Quantos convidados?', options: KB.quote.guestRanges, grid: true },
    { key: 'servicos', type: 'checkbox', title: 'O que você procura?', help: 'Pode escolher mais de uma opção.', options: serviceOpts, grid: true },
    { key: 'observacoes', type: 'textarea', title: 'Alguma observação ou restrição alimentar?', help: 'Opcional. Ex.: convidados vegetarianos, alergias, horário, estilo da festa.', optional: true, placeholder: 'Conte o que for importante para você' },
    { key: 'nome', type: 'name', title: 'Para finalizar, qual é o seu nome?', placeholder: 'Seu nome' }
  ];
  var current = 0, started = false;
  totalEl.textContent = steps.length;

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { if (attrs[k] != null) n.setAttribute(k, attrs[k]); });
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function slug(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-'); }

  function rangeFor(n) {
    n = parseInt(n, 10);
    if (isNaN(n)) return null;
    if (n <= 50) return KB.quote.guestRanges[0];
    if (n <= 100) return KB.quote.guestRanges[1];
    if (n <= 200) return KB.quote.guestRanges[2];
    return KB.quote.guestRanges[3];
  }

  function build() {
    form.innerHTML = '';
    steps.forEach(function (s, i) {
      var fs = el('fieldset', { class: 'q-step', 'data-step': i, 'aria-labelledby': 'q-t-' + i });
      fs.appendChild(el('legend', { class: 'q-title', id: 'q-t-' + i }, esc(s.title)));
      if (s.help) fs.appendChild(el('p', { class: 'q-help' }, esc(s.help)));
      var val = Lead.get(s.key);

      if (s.type === 'radio' || s.type === 'checkbox') {
        var wrap = el('div', { class: 'q-options' + (s.grid ? ' q-options--grid' : '') });
        var preset = s.key === 'convidados' && val && KB.quote.guestRanges.indexOf(val) === -1 ? rangeFor(val) : val;
        s.options.forEach(function (o) {
          var id = 'q-' + s.key + '-' + slug(o);
          var opt = el('div', { class: 'q-opt' });
          var input = el('input', { type: s.type, name: s.key, id: id, value: o });
          if ((Array.isArray(preset) && preset.indexOf(o) > -1) || preset === o) input.checked = true;
          opt.appendChild(input);
          opt.appendChild(el('label', { for: id }, esc(o)));
          wrap.appendChild(opt);
        });
        fs.appendChild(wrap);
      } else {
        var field = el('div', { class: 'q-field' });
        var input2;
        if (s.type === 'textarea') input2 = el('textarea', { class: 'q-input', id: 'q-' + s.key, name: s.key, placeholder: s.placeholder, rows: 4 });
        else if (s.type === 'date') input2 = el('input', { class: 'q-input', id: 'q-' + s.key, name: s.key, type: 'date', min: new Date().toISOString().slice(0, 10) });
        else input2 = el('input', { class: 'q-input', id: 'q-' + s.key, name: s.key, type: 'text', placeholder: s.placeholder, autocomplete: s.type === 'name' ? 'given-name' : 'off', maxlength: 120 });
        var lbl = el('label', { for: 'q-' + s.key, class: 'sr-only' }, esc(s.title));
        lbl.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)';
        field.appendChild(lbl);
        field.appendChild(input2);
        if (val && typeof val === 'string') {
          if (s.type === 'date' && /^\d{2}\/\d{2}\/\d{4}$/.test(val)) input2.value = val.split('/').reverse().join('-');
          else if (s.type !== 'date') input2.value = val;
        }
        fs.appendChild(field);
        if (s.unsure) {
          var cid = 'q-' + s.key + '-unsure';
          var chk = el('label', { class: 'q-check', for: cid });
          var cb = el('input', { type: 'checkbox', id: cid, 'data-unsure': '' });
          if (val && s.type === 'date' && !/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
            // data vinda do chat (ex.: "dezembro") — mantém como texto
            input2.type = 'text'; input2.value = val;
          }
          if (val === 'A definir') { cb.checked = true; input2.value = ''; input2.disabled = true; }
          chk.appendChild(cb);
          chk.appendChild(document.createTextNode(s.unsure));
          cb.addEventListener('change', function () { input2.disabled = cb.checked; if (cb.checked) input2.value = ''; });
          fs.appendChild(chk);
        }
      }
      fs.appendChild(el('p', { class: 'q-error', role: 'alert', 'aria-live': 'assertive' }));
      var nav = el('div', { class: 'q-nav' });
      var back = el('button', { type: 'button', class: 'q-back', 'data-back': '' }, '← Voltar');
      if (i === 0) back.hidden = true;
      nav.appendChild(back);
      var nextLabel = i === steps.length - 1 ? 'Ver resumo' : (s.optional ? 'Continuar' : 'Próximo');
      nav.appendChild(el('button', { type: 'submit', class: 'btn btn--primary' }, nextLabel));
      fs.appendChild(nav);
      form.appendChild(fs);
    });
    form.appendChild(el('div', { class: 'q-step q-final', 'data-step': steps.length, tabindex: '-1' }));
  }

  function readStep(i) {
    var s = steps[i];
    var fs = form.querySelector('[data-step="' + i + '"]');
    if (s.type === 'radio') {
      var c = fs.querySelector('input:checked');
      if (!c) return null;
      // preserva o número exato dito no chat se a faixa continuar a mesma
      var prev = Lead.get(s.key);
      if (s.key === 'convidados' && prev && rangeFor(prev) === c.value && /^\d+$/.test(String(prev))) return prev;
      return c.value;
    }
    if (s.type === 'checkbox') {
      var arr = Array.prototype.map.call(fs.querySelectorAll('input:checked'), function (x) { return x.value; });
      return arr.length ? arr : null;
    }
    var unsure = fs.querySelector('[data-unsure]');
    if (unsure && unsure.checked) return 'A definir';
    var inp = fs.querySelector('.q-input');
    var v = (inp.value || '').trim();
    if (!v) return s.optional ? '' : null;
    if (s.type === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v.split('-').reverse().join('/');
    return v;
  }

  function show(i, back) {
    var all = form.querySelectorAll('.q-step');
    Array.prototype.forEach.call(all, function (f) { f.classList.remove('is-active', 'is-back'); });
    var fs = form.querySelector('[data-step="' + i + '"]');
    fs.classList.add('is-active');
    if (back) fs.classList.add('is-back');
    current = i;
    var total = steps.length;
    countEl.textContent = Math.min(i + 1, total);
    root.style.setProperty('--progress', ((i + 1) / (total + 1)).toFixed(3));
    if (bar) bar.parentNode.style.setProperty('--progress', ((i + 1) / (total + 1)).toFixed(3));
    if (i === total) renderFinal();
  }

  function focusStep() {
    var fs = form.querySelector('.q-step.is-active');
    if (!fs) return;
    var f = fs.querySelector('.q-input:not([disabled]), input:checked, input, .btn');
    if (f) f.focus({ preventScroll: true });
  }

  function next() {
    var s = steps[current];
    var v = readStep(current);
    var err = form.querySelector('[data-step="' + current + '"] .q-error');
    if (v === null) {
      err.textContent = s.type === 'checkbox' ? 'Escolha pelo menos uma opção.' :
        s.type === 'radio' ? 'Escolha uma opção para continuar.' :
        s.type === 'name' ? 'Como podemos te chamar?' : 'Preencha ou marque a opção abaixo.';
      return;
    }
    err.textContent = '';
    if (s.key === 'servicos' && v.length > 1 && v.indexOf(KB.quote.unsureOption) > -1) v = v.filter(function (x) { return x !== KB.quote.unsureOption; });
    Lead.set(s.key, v);
    track('quote_step', { step: current + 1, field: s.key });
    if (s.key === 'servicos') v.forEach(function (sv) { track('service_interest', { service: sv, source: 'quote' }); });
    show(current + 1);
    focusStep();
  }

  function renderFinal() {
    var box = form.querySelector('.q-final');
    var rows = Lead.filled().filter(function (r) { return r[2] !== 'duvidas'; });
    box.innerHTML =
      '<p class="q-title">Tudo certo. Vamos conversar sobre seu evento?</p>' +
      '<p class="q-help">Revise o resumo. Ao continuar, o WhatsApp abre com a mensagem pronta para a equipe da Mapersí.</p>' +
      '<dl class="q-summary">' + rows.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>' +
      '<div class="q-final-actions">' +
      '<a class="btn btn--primary" target="_blank" rel="noopener" data-quote-wa href="' + Lead.waUrl(Lead.message()) + '">Continuar pelo WhatsApp</a>' +
      '<button class="btn btn--ghost" type="button" data-quote-edit>Editar respostas</button>' +
      '</div>' +
      '<p class="q-privacy">Suas respostas não são enviadas a nenhum servidor: elas seguem apenas na mensagem que você mandar pelo WhatsApp.</p>';
    track('quote_complete', { evento: Lead.get('evento'), convidados: Lead.get('convidados') });
    box.querySelector('[data-quote-wa]').addEventListener('click', function () {
      this.href = Lead.waUrl(Lead.message());
      track('whatsapp_click', { context: 'orcamento' });
      track('quote_whatsapp');
    });
    box.querySelector('[data-quote-edit]').addEventListener('click', function () { build(); show(0, true); focusStep(); });
    setTimeout(function () { box.focus({ preventScroll: true }); }, 50);
  }

  build();
  show(0);

  form.addEventListener('submit', function (e) { e.preventDefault(); next(); });
  form.addEventListener('click', function (e) {
    if (e.target.closest('[data-back]')) { show(Math.max(0, current - 1), true); focusStep(); }
  });
  form.addEventListener('change', function (e) {
    if (!started) { started = true; track('quote_start'); }
    var t = e.target;
    if (t.type === 'radio') setTimeout(next, 320); // avança sozinho ao escolher
    if (t.type === 'checkbox' && t.name === 'servicos') {
      // "Ainda não sei" é exclusivo
      var boxes = form.querySelectorAll('input[name="servicos"]');
      if (t.value === KB.quote.unsureOption && t.checked) Array.prototype.forEach.call(boxes, function (b) { if (b !== t) b.checked = false; });
      else if (t.checked) Array.prototype.forEach.call(boxes, function (b) { if (b.value === KB.quote.unsureOption) b.checked = false; });
    }
  });
  form.addEventListener('input', function () { if (!started) { started = true; track('quote_start'); } }, { once: true });

  // se a concierge coletar dados, o formulário reflete (sem perder a etapa atual)
  window.MapersiQuote = { rebuild: function () { var c = current; build(); show(Math.min(c, steps.length - 1)); } };
})();

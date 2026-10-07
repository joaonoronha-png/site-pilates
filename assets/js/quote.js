/* ARGENTO — orçamento inteligente e envio de leads */
(function () {
  "use strict";

  var cfg = window.ARGENTO_CONFIG || {};
  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var MAX_FILES = 5;
  var MAX_SIZE = 10 * 1024 * 1024;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* Monta um resumo legível do lead (usado no WhatsApp, cópia e e-mail). */
  function summary(data, origin) {
    var lines = ["Solicitação via site ARGENTO" + (origin ? " (" + origin + ")" : "")];
    var labels = {
      nome: "Nome", empresa: "Empresa", whatsapp: "WhatsApp", email: "E-mail",
      necessidade: "Necessidade", tipo_obra: "Tipo de obra", cidade: "Cidade",
      etapa: "Etapa", prazo: "Prazo", mensagem: "Detalhes", anexos: "Anexos"
    };
    Object.keys(labels).forEach(function (k) {
      if (data[k]) lines.push(labels[k] + ": " + data[k]);
    });
    return lines.join("\n");
  }

  /* Envia o lead para o endpoint configurado. Retorna Promise<boolean>. */
  function send(data, files, origin) {
    if (!cfg.leadEndpoint) return Promise.resolve(false);
    var fd = new FormData();
    Object.keys(data).forEach(function (k) { if (data[k]) fd.append(k, data[k]); });
    fd.append("origem", origin || "site");
    fd.append("_subject", "Novo pedido de orçamento — site ARGENTO");
    fd.append("resumo", summary(data, origin));
    (files || []).forEach(function (f) { fd.append("anexos", f, f.name); });
    return fetch(cfg.leadEndpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } })
      .then(function (r) { return r.ok; })
      .catch(function () { return false; });
  }

  /* Tela exibida após o pedido: confirma o envio ou, sem endpoint, oferece canais diretos. */
  function doneView(data, sent, files) {
    var text = summary(data, "formulário");
    var wa = cfg.whatsapp ? "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(text) : "";
    var mail = cfg.email ? "mailto:" + cfg.email + "?subject=" + encodeURIComponent("Pedido de orçamento — site") + "&body=" + encodeURIComponent(text) : "";
    var html = '<div class="form-done" tabindex="-1">';
    if (sent) {
      html += '<p class="eyebrow">Pedido enviado</p><h3>Recebemos sua solicitação.</h3>' +
        "<p>Obrigado, " + esc(data.nome.split(" ")[0]) + ". A equipe da ARGENTO vai analisar as informações e retornar pelo contato informado.</p>";
    } else {
      html += '<p class="eyebrow">Quase lá</p><h3>Finalize o contato com a equipe.</h3>' +
        "<p>Seu pedido está pronto. Para garantir o atendimento, envie o resumo abaixo por um dos canais diretos da ARGENTO" +
        (files && files.length ? " e tenha os anexos em mãos" : "") + ".</p>";
    }
    html += "<pre>" + esc(text) + "</pre><div class=\"actions\">";
    if (!sent) {
      if (wa) html += '<a class="btn" href="' + wa + '" target="_blank" rel="noopener">Enviar pelo WhatsApp</a>';
      if (mail) html += '<a class="btn' + (wa ? " btn--ghost" : "") + '" href="' + mail + '">Enviar por e-mail</a>';
      html += '<a class="btn' + (wa || mail ? " btn--ghost" : "") + '" href="tel:' + (cfg.phoneHref || "+552125162761") + '">Ligar ' + esc(cfg.phone || "(21) 2516-2761") + "</a>";
      html += '<button class="btn btn--ghost" type="button" data-copy>Copiar resumo</button>';
    }
    html += '<button class="btn btn--ghost" type="button" data-new>Novo pedido</button></div></div>';
    return html;
  }

  window.ArgentoLead = { send: send, summary: summary, doneView: doneView, configured: function () { return !!cfg.leadEndpoint; } };

  var form = $("#quote-form");
  if (!form) return;
  var wrap = $("#quote-wrap");
  var status = $("#form-status");
  var input = $("#q-files");
  var list = $("#file-list");
  var drop = $("#drop");
  var files = [];

  /* ---------- Anexos ---------- */
  function renderFiles() {
    list.innerHTML = files.map(function (f, i) {
      var kb = f.size > 1048576 ? (f.size / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(f.size / 1024)) + " KB";
      return "<li><span>" + esc(f.name) + " · " + kb + '</span><button type="button" data-rm="' + i + '" aria-label="Remover ' + esc(f.name) + '">remover</button></li>';
    }).join("");
  }
  function addFiles(fl) {
    var msg = "";
    Array.prototype.forEach.call(fl, function (f) {
      if (files.length >= MAX_FILES) { msg = "Limite de " + MAX_FILES + " arquivos."; return; }
      if (f.size > MAX_SIZE) { msg = "“" + f.name + "” ultrapassa 10 MB."; return; }
      files.push(f);
    });
    input.value = "";
    renderFiles();
    status.textContent = msg;
    status.classList.toggle("is-error", !!msg);
  }
  input.addEventListener("change", function () { addFiles(input.files); });
  list.addEventListener("click", function (e) {
    var b = e.target.closest("[data-rm]");
    if (!b) return;
    files.splice(parseInt(b.getAttribute("data-rm"), 10), 1);
    renderFiles();
  });
  ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("is-over"); }); });
  ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function () { drop.classList.remove("is-over"); }); });
  drop.addEventListener("drop", function (e) { e.preventDefault(); if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files); });

  /* ---------- Máscara de telefone ---------- */
  var tel = $("#q-whats");
  tel.addEventListener("input", function () {
    var d = tel.value.replace(/\D/g, "").slice(0, 11);
    var out = d;
    if (d.length > 2) out = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 7) out = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4);
    tel.value = out;
  });

  /* ---------- Validação ---------- */
  function setInvalid(el, bad) {
    var f = el.closest(".field");
    if (f) f.classList.toggle("is-invalid", bad);
    el.setAttribute("aria-invalid", bad ? "true" : "false");
  }
  function validate() {
    var ok = true, first = null;
    var checks = [
      ["#q-nome", function (v) { return v.trim().length >= 2; }],
      ["#q-whats", function (v) { return v.replace(/\D/g, "").length >= 10; }],
      ["#q-email", function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }],
      ["#q-tipo", function (v) { return !!v; }],
      ["#q-cidade", function (v) { return v.trim().length >= 2; }]
    ];
    checks.forEach(function (c) {
      var el = $(c[0]);
      var bad = !c[1](el.value);
      setInvalid(el, bad);
      if (bad) { ok = false; first = first || el; }
    });
    var needs = $$('input[name="necessidade"]:checked');
    var needField = $('input[name="necessidade"]').closest(".field");
    needField.classList.toggle("is-invalid", !needs.length);
    if (!needs.length) { ok = false; first = first || $('input[name="necessidade"]'); }
    var consent = $('input[name="consentimento"]');
    if (!consent.checked) { ok = false; first = first || consent; }
    return { ok: ok, first: first, consent: consent.checked };
  }
  $$("input, select, textarea", form).forEach(function (el) {
    el.addEventListener("blur", function () {
      var f = el.closest(".field");
      if (f && f.classList.contains("is-invalid")) validate();
    });
  });

  /* ---------- Envio ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form._gotcha && form._gotcha.value) return;
    var v = validate();
    if (!v.ok) {
      status.textContent = v.consent ? "Revise os campos destacados." : "Revise os campos destacados e confirme o consentimento de contato.";
      status.classList.add("is-error");
      if (v.first) v.first.focus();
      return;
    }
    var data = {
      nome: $("#q-nome").value.trim(),
      empresa: $("#q-empresa").value.trim(),
      whatsapp: $("#q-whats").value.trim(),
      email: $("#q-email").value.trim(),
      necessidade: $$('input[name="necessidade"]:checked').map(function (i) { return i.value; }).join(", "),
      tipo_obra: $("#q-tipo").value,
      cidade: $("#q-cidade").value.trim(),
      etapa: $("#q-etapa").value,
      prazo: $("#q-prazo").value,
      mensagem: $("#q-msg").value.trim(),
      anexos: files.map(function (f) { return f.name; }).join(", ")
    };
    var btn = $('button[type="submit"]', form);
    btn.disabled = true;
    status.classList.remove("is-error");
    status.textContent = cfg.leadEndpoint ? "Enviando…" : "";
    send(data, files, "formulário").then(function (sent) {
      btn.disabled = false;
      if (cfg.leadEndpoint && !sent) {
        status.textContent = "Não foi possível enviar agora. Tente novamente ou ligue para " + (cfg.phone || "(21) 2516-2761") + ".";
        status.classList.add("is-error");
        return;
      }
      form.hidden = true;
      var holder = doc.createElement("div");
      holder.innerHTML = doneView(data, sent, files);
      wrap.appendChild(holder);
      var panel = $(".form-done", holder);
      panel.focus();
      var copy = $("[data-copy]", holder);
      if (copy) copy.addEventListener("click", function () {
        var t = summary(data, "formulário");
        (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject())
          .then(function () { copy.textContent = "Resumo copiado"; })
          .catch(function () { copy.textContent = "Selecione e copie o texto acima"; });
      });
      $("[data-new]", holder).addEventListener("click", function () {
        holder.remove();
        form.reset();
        files = [];
        renderFiles();
        form.hidden = false;
        status.textContent = "";
        $("#q-nome").focus();
      });
    });
  });
})();

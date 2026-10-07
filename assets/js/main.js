/* ARGENTO — interações principais */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var isSmall = window.matchMedia("(max-width: 640px)").matches;
  var cfg = window.ARGENTO_CONFIG || {};
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  function store(kind) {
    try { return window[kind]; } catch (e) { return null; }
  }

  /* ---------- Intro ---------- */
  (function intro() {
    var el = $("#intro");
    if (!el) return;
    var ss = store("sessionStorage");
    var seen = false;
    try { seen = ss && ss.getItem("argento-intro") === "1"; } catch (e) {}
    if (reduce || seen || location.hash) return;
    el.hidden = false;
    root.style.overflow = "hidden";
    var total = isSmall ? 1900 : 2700;
    if (isSmall) el.classList.add("is-short");
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      el.classList.add("is-done");
      root.style.overflow = "";
      try { ss && ss.setItem("argento-intro", "1"); } catch (e) {}
      setTimeout(function () { el.hidden = true; }, 800);
    }
    setTimeout(finish, total);
    var skip = $("[data-intro-skip]", el);
    if (skip) skip.addEventListener("click", finish);
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape") finish(); }, { once: true });
  })();

  /* ---------- Ano no rodapé ---------- */
  $$("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });

  /* ---------- Header ---------- */
  var header = $("#header");
  var actionBar = $("#action-bar");
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle("is-solid", y > 40 || !$(".hero, .page-hero"));
      var goingDown = y > lastY && y > 400;
      header.classList.toggle("is-hidden", goingDown && !root.classList.contains("menu-open"));
    }
    if (actionBar) {
      var quote = $("#orcamento");
      var inQuote = false;
      if (quote) {
        var r = quote.getBoundingClientRect();
        inQuote = r.top < window.innerHeight * 0.6 && r.bottom > 0;
      }
      actionBar.classList.toggle("is-tucked", inQuote);
    }
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var toggle = $(".menu-toggle");
  var menu = $("#mobile-menu");
  function setMenu(open) {
    root.classList.toggle("menu-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    }
    doc.body.style.overflow = open ? "hidden" : "";
    if (open && menu) { var first = $("a", menu); if (first) first.focus(); }
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () { setMenu(!root.classList.contains("menu-open")); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("menu-open")) { setMenu(false); toggle.focus(); }
    });
  }

  /* ---------- Revelações no scroll ---------- */
  var builds = $$("[data-build]");
  builds.forEach(function (b) { b.classList.add("build", "is-armed"); });

  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var t = en.target;
        t.classList.add("is-in");
        if (t.hasAttribute("data-build")) { t.classList.add("is-built"); t.classList.remove("is-armed"); }
        if (t.hasAttribute("data-count") || t.querySelector("[data-count]")) countUp(t);
        io.unobserve(t);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    $$(".reveal, .mask-reveal, [data-inview], [data-build], .stat").forEach(function (n) { io.observe(n); });
  } else {
    $$(".reveal, .mask-reveal, [data-inview]").forEach(function (n) { n.classList.add("is-in"); });
    builds.forEach(function (b) { b.classList.add("is-built"); b.classList.remove("is-armed"); });
  }

  // Remontar o desenho ao passar o mouse (desktop)
  if (finePointer && !reduce) {
    $$(".sol[data-build]").forEach(function (card) {
      card.addEventListener("mouseenter", function () {
        card.classList.remove("is-built");
        card.classList.add("is-armed");
        // força reflow para reiniciar a transição
        void card.offsetWidth;
        requestAnimationFrame(function () {
          card.classList.remove("is-armed");
          card.classList.add("is-built");
        });
      });
    });
  }

  /* ---------- Contadores ---------- */
  function yearsSince(iso) {
    var d = new Date(iso + "T00:00:00");
    var now = new Date();
    var y = now.getFullYear() - d.getFullYear();
    if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) y--;
    return y;
  }
  $$("[data-years-since]").forEach(function (n) {
    var v = yearsSince(n.getAttribute("data-years-since"));
    n.setAttribute("data-count", v);
    n.textContent = v;
  });
  function countUp(scope) {
    var nodes = scope.hasAttribute("data-count") ? [scope] : $$("[data-count]", scope);
    nodes.forEach(function (n) {
      var target = parseInt(n.getAttribute("data-count"), 10);
      if (!target || reduce) return;
      var from = n.hasAttribute("data-plain") ? target - 40 : 0;
      var dur = 1400, t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var e = 1 - Math.pow(1 - p, 4);
        n.textContent = Math.round(from + (target - from) * e);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- Parallax discreto ---------- */
  var parallax = $$("[data-parallax]");
  if (parallax.length && !reduce && !isSmall) {
    var ticking = false;
    var update = function () {
      parallax.forEach(function (el) {
        var k = parseFloat(el.getAttribute("data-parallax")) || 0.1;
        var host = el.parentElement.getBoundingClientRect();
        if (host.bottom < 0 || host.top > window.innerHeight) return;
        var off = (host.top + host.height / 2 - window.innerHeight / 2) * -k;
        el.style.transform = "translate3d(0," + off.toFixed(1) + "px,0)";
      });
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- Brilho que segue o cursor nos cards ---------- */
  if (finePointer) {
    $$("[data-glow]").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---------- Mira técnica (desktop) ---------- */
  var ch = $(".crosshair");
  if (ch && finePointer && !reduce) {
    var h = $(".crosshair__h", ch), v = $(".crosshair__v", ch), lab = $(".crosshair__label", ch);
    $$("[data-crosshair]").forEach(function (zone) {
      zone.addEventListener("pointerenter", function () { ch.classList.add("is-on"); });
      zone.addEventListener("pointerleave", function () { ch.classList.remove("is-on"); });
      zone.addEventListener("pointermove", function (e) {
        h.style.top = e.clientY + "px";
        v.style.left = e.clientX + "px";
        lab.style.left = e.clientX + "px";
        lab.style.top = e.clientY + "px";
        var r = zone.getBoundingClientRect();
        lab.textContent = "X " + String(Math.round(e.clientX - r.left)).padStart(4, "0") +
          "  Y " + String(Math.round(e.clientY - r.top)).padStart(4, "0");
      });
    });
    $$("a, button", doc).forEach(function (n) {
      n.addEventListener("pointerenter", function () { if (n.closest("[data-crosshair]")) ch.classList.remove("is-on"); });
      n.addEventListener("pointerleave", function () { if (n.closest("[data-crosshair]")) ch.classList.add("is-on"); });
    });
  }

  /* ---------- Trilho estrutural de progresso ---------- */
  var rail = $(".rail");
  var sections = $$("[data-rail]");
  if (rail && sections.length && finePointer) {
    var fill = $(".rail__fill", rail);
    sections.forEach(function (s, i) {
      var node = doc.createElement("span");
      node.className = "rail__node";
      node.style.top = (i / (sections.length - 1)) * 100 + "%";
      rail.appendChild(node);
    });
    var navLinks = $$(".nav__list a");
    var railUpdate = function () {
      var first = sections[0].getBoundingClientRect().top + window.scrollY;
      var last = sections[sections.length - 1];
      var end = last.getBoundingClientRect().top + window.scrollY;
      var p = (window.scrollY + window.innerHeight * 0.5 - first) / (end - first);
      p = Math.max(0, Math.min(1, p));
      fill.style.transform = "scaleY(" + p.toFixed(3) + ")";
      rail.classList.toggle("is-on", window.scrollY > window.innerHeight * 0.6);
      var current = null;
      sections.forEach(function (s) {
        if (s.getBoundingClientRect().top < window.innerHeight * 0.4) current = s.id;
      });
      navLinks.forEach(function (a) {
        a.setAttribute("aria-current", a.getAttribute("href") === "#" + current ? "true" : "false");
      });
    };
    window.addEventListener("scroll", function () { requestAnimationFrame(railUpdate); }, { passive: true });
    railUpdate();
  }

  /* ---------- Encontre sua solução ---------- */
  var NEEDS = {
    escoramento: {
      title: "Escoramento",
      text: "Para lajes, vigas e elementos que precisam de suporte provisório até a estrutura atingir condição de se sustentar. Em alturas, vãos ou cargas maiores, o cimbramento entra em cena.",
      lines: ["Escoramento", "Cimbramento"],
      check: ["Planta de fôrmas ou projeto estrutural", "Pé-direito e espessura das lajes", "Área e número de pavimentos", "Data prevista de início e duração"],
      link: "solucoes/escoramentos.html",
      form: "Escoramento"
    },
    formas: {
      title: "Fôrmas",
      text: "Para moldar pilares, paredes, vigas e estruturas verticais em concreto. A fôrma metálica atende elementos repetitivos; a fôrma deslizante, estruturas altas executadas de forma contínua; o travamento garante alinhamento e prumo.",
      lines: ["Fôrma metálica", "Fôrma deslizante", "Travamento"],
      check: ["Projeto estrutural ou de fôrmas", "Tipo de elemento e dimensões principais", "Quantidade de repetições previstas", "Cronograma de concretagens"],
      link: "solucoes/formas.html",
      form: "Fôrmas"
    },
    andaimes: {
      title: "Andaimes",
      text: "Para acesso e trabalho temporário em altura: fachadas, alvenaria, revestimento, reformas e manutenção. A configuração depende da altura, da extensão e do tipo de serviço.",
      lines: ["Andaimes", "Tubular convencional"],
      check: ["Altura e extensão a atender", "Tipo de serviço a executar", "Condições de apoio no local", "Fotos da fachada ou do ambiente"],
      link: "solucoes/andaimes.html",
      form: "Andaimes"
    },
    orientacao: {
      title: "Orientação",
      text: "Sem problema. Descreva a obra e o que precisa ser executado — a equipe da ARGENTO avalia as informações e indica o sistema, ou a combinação de sistemas, mais adequado.",
      lines: ["Escoramento", "Cimbramento", "Travamento", "Fôrma metálica", "Fôrma deslizante", "Andaimes", "Tubular convencional"],
      check: ["Cidade e tipo de obra", "Etapa atual da obra", "Planta, projeto ou fotos (o que tiver)", "Prazo em que precisa do equipamento"],
      link: null,
      form: "Outro"
    }
  };
  var opts = $$(".opt[data-need]");
  var body = $("#finder-body");
  var prefix = (doc.body.getAttribute("data-root") || "");
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  opts.forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.getAttribute("data-need");
      var n = NEEDS[k];
      opts.forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
      body.innerHTML =
        '<p class="finder__label">Sua necessidade</p>' +
        "<h3>" + esc(n.title) + "</h3>" +
        "<p>" + esc(n.text) + "</p>" +
        '<div><p class="finder__label" style="margin-bottom:.75rem">Linhas relacionadas</p><ul class="finder__chips">' +
        n.lines.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul></div>" +
        '<div><p class="finder__label" style="margin-bottom:.75rem">Para um orçamento mais preciso, tenha em mãos</p><ul class="checklist">' +
        n.check.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul></div>" +
        '<div class="hero__cta"><a class="btn" href="#orcamento" data-prefill-need="' + esc(n.form) + '">Falar com a ARGENTO <span class="arrow" aria-hidden="true">→</span></a>' +
        (n.link ? '<a class="btn btn--ghost" href="' + prefix + n.link + '">Ver detalhes</a>' : "") + "</div>";
      body.classList.remove("is-swap");
      void body.offsetWidth;
      body.classList.add("is-swap");
    });
  });

  /* ---------- Pré-preenchimento do formulário ---------- */
  doc.addEventListener("click", function (e) {
    var a = e.target.closest("[data-prefill-need], [data-prefill-msg]");
    if (!a) return;
    var need = a.getAttribute("data-prefill-need");
    var msg = a.getAttribute("data-prefill-msg");
    if (need) {
      $$('input[name="necessidade"]').forEach(function (i) { if (i.value === need) i.checked = true; });
    }
    if (msg) {
      var ta = $("#q-msg");
      if (ta && !ta.value) ta.value = msg;
    }
  });

  // Pré-seleção vinda das páginas de solução: index.html?necessidade=Escoramento#orcamento
  try {
    var qp = new URLSearchParams(location.search).get("necessidade");
    if (qp) $$('input[name="necessidade"]').forEach(function (i) { if (i.value === qp) i.checked = true; });
  } catch (e) {}

  /* ---------- Canais confirmados (config) ---------- */
  var waLink = cfg.whatsapp ? "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(cfg.whatsappMessage || "") : "";
  var fab = $("#fab-wa");
  if (fab && waLink) { fab.href = waLink; fab.hidden = false; }
  var waSlot = $('[data-contact-slot="whatsapp"]');
  if (waSlot && waLink) {
    var wl = $("a", waSlot);
    wl.href = waLink;
    wl.textContent = cfg.whatsapp.replace(/^55(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3");
    waSlot.hidden = false;
  }
  var mailSlot = $('[data-contact-slot="email"]');
  if (mailSlot && cfg.email) {
    var ml = $("a", mailSlot);
    ml.href = "mailto:" + cfg.email;
    ml.textContent = cfg.email;
    mailSlot.hidden = false;
  }
  var social = $("[data-social]");
  if (social && cfg.social) {
    var names = { instagram: "Instagram", linkedin: "LinkedIn", facebook: "Facebook", youtube: "YouTube" };
    Object.keys(names).forEach(function (k) {
      if (cfg.social[k]) {
        var li = doc.createElement("li");
        li.innerHTML = '<a href="' + esc(cfg.social[k]) + '" target="_blank" rel="noopener">' + names[k] + "</a>";
        social.appendChild(li);
      }
    });
  }

  /* ---------- Cases (obras.json) ---------- */
  var casesEl = $("#cases");
  if (casesEl && window.fetch) {
    fetch(casesEl.getAttribute("data-src"), { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.obras || !data.obras.length) return;
        casesEl.innerHTML = data.obras.map(function (o) {
          return '<article class="case is-in reveal">' +
            '<div class="case__media">' + (o.imagem ? '<img src="' + esc(o.imagem) + '" alt="' + esc(o.imagemAlt || o.nome) + '" loading="lazy" decoding="async">' : "") + "</div>" +
            '<div class="case__body">' +
            '<p class="case__meta">' + esc([o.local, o.ano].filter(Boolean).join(" · ")) + "</p>" +
            "<h3>" + esc(o.nome) + "</h3>" +
            (o.cliente ? '<p class="case__meta">Cliente: ' + esc(o.cliente) + "</p>" : "") +
            '<dl class="dsr">' +
            (o.desafio ? "<div><dt>Desafio</dt><dd>" + esc(o.desafio) + "</dd></div>" : "") +
            (o.solucao ? "<div><dt>Solução</dt><dd>" + esc(o.solucao) + "</dd></div>" : "") +
            (o.resultado ? "<div><dt>Resultado</dt><dd>" + esc(o.resultado) + "</dd></div>" : "") +
            (o.sistemas && o.sistemas.length ? "<div><dt>Sistemas</dt><dd>" + o.sistemas.map(esc).join(" · ") + "</dd></div>" : "") +
            "</dl></div></article>";
        }).join("");
      })
      .catch(function () {});
  }

  /* ---------- Abrir assistente por botões ---------- */
  doc.addEventListener("click", function (e) {
    if (e.target.closest("[data-open-chat]") && window.ArgentoChat) { e.preventDefault(); window.ArgentoChat.open(); }
  });
})();

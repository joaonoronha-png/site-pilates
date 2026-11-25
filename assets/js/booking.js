/* Aluguel Temporada RJ — reserva direta (como no Airbnb)
 *
 * Calendário de disponibilidade, caixa de reserva do imóvel, página "Confirmar e reservar"
 * (#reservar/<imóvel>/<entrada>/<saída>/<hóspedes>) e área "Minhas reservas" (#minhas-reservas).
 *
 * Navegar e ver preços não pede conta: a conta só aparece na hora de reservar.
 *
 * MODO PRÉVIA (SITE_DATA.reserva.modo = 'previa'): login, disponibilidade e pagamento são
 * simulados neste navegador e a pré-reserva termina no WhatsApp. Quando as contas forem ligadas
 * (Supabase para login e reservas, Mercado Pago para o Pix), só os "adaptadores" AUTH, AGENDA e
 * PAGAMENTO abaixo mudam; as telas continuam as mesmas.
 */
(function () {
  'use strict';
  var D = window.SITE_DATA, E = D.empresa, CFG = D.reserva || { modo: 'previa' };
  var PREVIA = CFG.modo !== 'online';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var APP = function () { return window.APP; };
  var bySlug = {}; D.imoveis.forEach(function (i) { bySlug[i.slug] = i; });
  var lang = function () { return (window.I18N && I18N.lang) || 'pt'; };
  var locale = function () { return { pt: 'pt-BR', es: 'es', en: 'en-US' }[lang()]; };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- datas (sempre 'AAAA-MM-DD', sem fuso) ---------- */
  var DAY = 864e5;
  var toUTC = function (iso) { var p = iso.split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]); };
  var fromUTC = function (t) { return new Date(t).toISOString().slice(0, 10); };
  var addDays = function (iso, n) { return fromUTC(toUTC(iso) + n * DAY); };
  var diff = function (a, b) { return Math.round((toUTC(b) - toUTC(a)) / DAY); };
  var today = function () { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  var fmt = function (iso, o) { return new Intl.DateTimeFormat(locale(), Object.assign({ timeZone: 'UTC' }, o || { day: 'numeric', month: 'short' })).format(new Date(toUTC(iso))); };
  var cap = function (t) { return t.charAt(0).toUpperCase() + t.slice(1); };
  var money = function (v) { return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }); };
  var MIN = (E.condicoes && E.condicoes.minimoNoites) || 2;

  /* ---------- preços (tabela do cliente, sem as taxas do Airbnb) ----------
   * imovel.precos = { base: 450, periodos: [{ nome: 'Réveillon', de: '12-27', ate: '01-02', valor: 1200 }, ...] }
   * Enquanto a tabela não chega (precos ausente), o valor das diárias aparece "a confirmar". */
  function inPeriod(md, p) { return p.de <= p.ate ? md >= p.de && md <= p.ate : md >= p.de || md <= p.ate; }
  function nightly(i, iso) {
    var P = i.precos; if (!P) return null;
    var md = iso.slice(5), hit = (P.periodos || []).filter(function (p) { return inPeriod(md, p); })[0];
    return hit ? hit.valor : (P.base || null);
  }
  function quote(i, ci, co) {
    var n = diff(ci, co), sum = 0, known = true;
    for (var k = 0; k < n; k++) { var v = nightly(i, addDays(ci, k)); if (v == null) known = false; else sum += v; }
    var limpeza = /^Casa/.test(i.tipo) ? E.condicoes.limpeza.casa : E.condicoes.limpeza.apartamento;
    return { noites: n, diarias: known ? sum : null, media: known && n ? Math.round(sum / n) : null, limpeza: limpeza,
      total: known ? sum + limpeza : null, sinal: known ? Math.round((sum + limpeza) / 2) : null };
  }
  function fromPrice(i) {
    if (!i.precos) return null;
    var vals = [i.precos.base].concat((i.precos.periodos || []).map(function (p) { return p.valor; })).filter(Boolean);
    return vals.length ? Math.min.apply(null, vals) : null;
  }

  /* ---------- ADAPTADORES (prévia agora; Supabase/Mercado Pago depois) ---------- */
  // Disponibilidade: datas (noites) ocupadas. Online: lidas do calendário do Airbnb (iCal) pelo servidor.
  var AGENDA = {
    blocked: function (i) {
      var set = {};
      (i.bloqueios || []).forEach(function (r) { for (var d = r.de; d < r.ate; d = addDays(d, 1)) set[d] = 1; });
      reservas().forEach(function (r) { if (r.slug === i.slug && r.status !== 'cancelada') for (var d = r.ci; d < r.co; d = addDays(d, 1)) set[d] = 1; });
      return set;
    }
  };
  // Conta do hóspede. Online: Supabase Auth (Google ou código por e-mail).
  var AUTH = {
    user: function () { return store.get('atrj-user', null); },
    sendCode: function (email) { return Promise.resolve({ ok: true, previa: PREVIA }); },
    verify: function (email, code) {
      if (PREVIA && code !== '123456') return Promise.resolve({ ok: false });
      var u = Object.assign({}, store.get('atrj-profile-' + email, {}), { email: email });
      store.set('atrj-user', u); changed(); return Promise.resolve({ ok: true, user: u });
    },
    google: function () { return Promise.resolve({ ok: false, previa: true }); },
    saveProfile: function (p) { var u = Object.assign(AUTH.user() || {}, p); store.set('atrj-user', u); store.set('atrj-profile-' + u.email, p); },
    signOut: function () { store.set('atrj-user', null); changed(); }
  };
  function reservas() { return store.get('atrj-reservas', []); }
  function meus() { var u = AUTH.user(); return u ? reservas().filter(function (r) { return r.email === u.email; }).sort(function (a, b) { return a.ci < b.ci ? -1 : 1; }) : []; }
  // Pagamento do sinal. Online: Pix do Mercado Pago (QR Code com confirmação automática).
  var PAGAMENTO = {
    criar: function (r) {
      var list = reservas(); r.id = 'R' + Date.now().toString(36).toUpperCase(); r.criada = new Date().toISOString();
      r.status = 'pre-reserva'; list.push(r); store.set('atrj-reservas', list); return Promise.resolve(r);
    }
  };
  var listeners = [];
  function changed() { listeners.forEach(function (f) { try { f(); } catch (e) {} }); }

  /* ---------- calendário ---------- */
  // opts: { i, months, sel:{ci,co}, onChange(ci,co) }
  function Calendar(opts) {
    var el = document.createElement('div'); el.className = 'cal'; el.setAttribute('data-no-i18n', '');
    var blocked = AGENDA.blocked(opts.i), first = today();
    var view = (opts.sel.ci || first).slice(0, 7) + '-01', hover = null;
    var isBlocked = function (d) { return !!blocked[d]; };
    function rangeFree(a, b) { for (var d = a; d < b; d = addDays(d, 1)) if (isBlocked(d)) return false; return true; }
    function can(d) {
      var s = opts.sel;
      if (d < first) return false;
      if (s.ci && !s.co && d > s.ci) return diff(s.ci, d) >= MIN && rangeFree(s.ci, d);
      return !isBlocked(d) && !isBlocked(addDays(d, MIN - 1)) && rangeFree(d, addDays(d, MIN));
    }
    function month(ym) {
      var y = +ym.slice(0, 4), m = +ym.slice(5, 7) - 1;
      var start = new Date(Date.UTC(y, m, 1)).getUTCDay(), days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
      var wd = [], base = Date.UTC(2023, 0, 1); // domingo
      for (var k = 0; k < 7; k++) wd.push(new Intl.DateTimeFormat(locale(), { weekday: 'narrow', timeZone: 'UTC' }).format(new Date(base + k * DAY)));
      var h = '<div class="cal__m"><p class="cal__t">' + esc(cap(fmt(ym, { month: 'long', year: 'numeric' }))) + '</p><div class="cal__g" role="grid">' +
        wd.map(function (w) { return '<span class="cal__wd" aria-hidden="true">' + w + '</span>'; }).join('');
      for (var b = 0; b < start; b++) h += '<span></span>';
      var s = opts.sel, end = s.co || (s.ci && hover && hover > s.ci ? hover : null);
      for (var dd = 1; dd <= days; dd++) {
        var iso = ym.slice(0, 8) + String(dd).padStart(2, '0'), ok = can(iso), cls = ['cal__d'];
        if (iso === s.ci) cls.push('is-ci', end ? '' : 'is-solo'); if (iso === s.co) cls.push('is-co');
        if (s.ci && end && iso > s.ci && iso < end) cls.push('is-in');
        if (s.ci && !s.co && hover && iso === hover && ok) cls.push('is-hover');
        if (iso === first) cls.push('is-today'); if (isBlocked(iso) && iso >= first) cls.push('is-blocked');
        h += '<button type="button" class="' + cls.join(' ') + '" data-d="' + iso + '"' + (ok ? '' : ' disabled') + ' aria-label="' + esc(fmt(iso, { weekday: 'long', day: 'numeric', month: 'long' })) + '" aria-pressed="' + (iso === s.ci || iso === s.co) + '">' + dd + '</button>';
      }
      return h + '</div></div>';
    }
    function nextMonth(ym, n) { var y = +ym.slice(0, 4), m = +ym.slice(5, 7) - 1 + n; return new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 10); }
    function render() {
      var ms = [], n = opts.months || 1;
      for (var k = 0; k < n; k++) ms.push(month(nextMonth(view, k)));
      el.innerHTML = '<div class="cal__nav"><button type="button" data-cal="-1" aria-label="Mês anterior"' + (view.slice(0, 7) <= first.slice(0, 7) ? ' disabled' : '') + '><svg aria-hidden="true"><use href="#i-chev"/></svg></button>' +
        '<button type="button" data-cal="1" aria-label="Próximo mês"><svg aria-hidden="true"><use href="#i-chev"/></svg></button></div>' +
        '<div class="cal__ms cal__ms--' + n + '">' + ms.join('') + '</div>';
    }
    el.addEventListener('click', function (e) {
      var nav = e.target.closest('[data-cal]');
      if (nav) { view = nextMonth(view, Number(nav.dataset.cal)); render(); return; }
      var b = e.target.closest('[data-d]'); if (!b || b.disabled) return;
      var d = b.dataset.d, s = opts.sel;
      if (s.ci && !s.co && d > s.ci) opts.onChange(s.ci, d); else opts.onChange(d, null);
    });
    el.addEventListener('mouseover', function (e) {
      var b = e.target.closest('[data-d]'); var s = opts.sel;
      if (!b || !s.ci || s.co) return; if (hover !== b.dataset.d) { hover = b.dataset.d; render(); }
    });
    render();
    return { el: el, render: render, set: function (sel) { opts.sel = sel; if (sel.ci && (sel.ci < view || sel.ci >= nextMonth(view, opts.months || 1))) view = sel.ci.slice(0, 7) + '-01'; render(); } };
  }

  /* ---------- texto do período ---------- */
  function noitesTxt(n) { return n + (n === 1 ? ' noite' : ' noites'); }
  function periodo(ci, co) { return ci && co ? fmt(ci) + ' – ' + fmt(co) : ''; }

  /* ---------- caixa de reserva na página do imóvel ---------- */
  // box: <aside class="book">, cal: lugar do calendário grande (seção "Disponibilidade"), bar: barra fixa do celular
  function mountBox(i, box, calSlot, bar) {
    var st = APP().state, sel = { ci: null, co: null };
    if (st.checkin && st.checkout && st.checkin >= today()) { sel.ci = st.checkin; sel.co = st.checkout; }
    var guests = Math.min(Math.max(st.guests || 2, 1), i.hospedes);
    var minP = fromPrice(i);
    box.innerHTML =
      '<p class="book__price" data-bk-price></p>' +
      '<div class="bk"><button type="button" class="bk__f" data-bk-open><small>Check-in</small><b data-bk-ci></b></button>' +
      '<button type="button" class="bk__f" data-bk-open><small>Check-out</small><b data-bk-co></b></button>' +
      '<div class="bk__f bk__f--g"><small>Hóspedes</small><div class="bk__step"><button type="button" data-bk-g="-1" aria-label="Menos hóspedes">−</button><b data-bk-gn></b><button type="button" data-bk-g="1" aria-label="Mais hóspedes">+</button></div></div></div>' +
      '<div class="bk__pop" data-bk-pop hidden><div data-bk-cal></div><div class="bk__popf"><button type="button" class="linklike" data-bk-clear>Limpar datas</button><button type="button" class="btn btn--mar btn--sm" data-bk-close>Fechar</button></div></div>' +
      '<p class="book__warn" data-bk-warn hidden></p>' +
      '<button class="btn btn--sun" type="button" data-bk-go>Reservar</button>' +
      '<p class="bk__note">Você ainda não será cobrado</p>' +
      '<div class="bk__sum" data-bk-sum></div>' +
      '<ul class="book__terms"><li>Mínimo de ' + MIN + ' noites</li><li>' + esc(E.condicoes.pagamento) + ': ' + esc(E.condicoes.sinal) + '</li><li>' + esc(E.condicoes.cancelamento) + '</li></ul>' +
      '<p class="book__save"><svg aria-hidden="true"><use href="#i-tag"/></svg><span><b>Reserva direta, sem taxa do Airbnb.</b> Você paga menos reservando aqui com a gente.</span></p>' +
      '<p class="book__alt">Dúvidas sobre a reserva? <a href="#" data-wa-msg="' + esc('Olá! Tenho uma dúvida sobre a reserva do imóvel "' + i.nome + '".') + '" data-wa="book-help" target="_blank" rel="noopener">Fale com a equipe no WhatsApp</a></p>';

    var pop = $('[data-bk-pop]', box), small = Calendar({ i: i, months: 1, sel: sel, onChange: pick }), big = null;
    $('[data-bk-cal]', box).appendChild(small.el);
    if (calSlot) {
      big = Calendar({ i: i, months: window.innerWidth >= 700 ? 2 : 1, sel: sel, onChange: pick });
      calSlot.innerHTML = '<p class="bk-avail__h" data-bk-avail-h></p><p class="pdp__ref" data-bk-avail-s></p>'; calSlot.appendChild(big.el);
      var cl = document.createElement('button'); cl.type = 'button'; cl.className = 'linklike bk-avail__clear'; cl.textContent = 'Limpar datas';
      cl.addEventListener('click', function () { pick(null, null); }); calSlot.appendChild(cl);
    }
    function pick(ci, co) {
      sel.ci = ci; sel.co = co; st.checkin = ci || ''; st.checkout = co || '';
      small.set(sel); if (big) big.set(sel); paint();
      if (ci && co && !pop.hidden) setTimeout(function () { openPop(false); }, 250);
    }
    function openPop(on) { pop.hidden = !on; box.classList.toggle('is-picking', on); }
    function paint() {
      var q = sel.ci && sel.co ? quote(i, sel.ci, sel.co) : null;
      $('[data-bk-ci]', box).textContent = sel.ci ? fmt(sel.ci, { weekday: 'short', day: 'numeric', month: 'short' }) : 'Adicionar data';
      $('[data-bk-co]', box).textContent = sel.co ? fmt(sel.co, { weekday: 'short', day: 'numeric', month: 'short' }) : 'Adicionar data';
      $('[data-bk-gn]', box).textContent = guests + (guests === 1 ? ' hóspede' : ' hóspedes');
      $('[data-bk-g="-1"]', box).disabled = guests <= 1; $('[data-bk-g="1"]', box).disabled = guests >= i.hospedes;
      var price = q && q.media ? '<b>' + money(q.media) + '</b> <small>noite</small>' : minP ? '<span class="bk__from">A partir de</span> <b>' + money(minP) + '</b> <small>noite</small>' : 'Reserve direto';
      $('[data-bk-price]', box).innerHTML = price;
      $('[data-bk-go]', box).textContent = q ? 'Reservar' : 'Verificar disponibilidade';
      $('[data-bk-sum]', box).innerHTML = q ? summaryHTML(i, q) : '';
      if (calSlot) {
        $('[data-bk-avail-h]', calSlot).textContent = q ? noitesTxt(q.noites) + ' em ' + i.nome : sel.ci ? 'Selecione a data de check-out' : 'Selecione a data de check-in';
        $('[data-bk-avail-s]', calSlot).textContent = q ? periodo(sel.ci, sel.co) : 'Mínimo de ' + MIN + ' noites. Os dias riscados já estão ocupados.';
      }
      if (bar) bar.innerHTML = '<span class="bkbar"><b>' + (q && q.total ? money(q.total) : q ? noitesTxt(q.noites) : minP ? money(minP) + ' <small>noite</small>' : 'Reserve direto') + '</b><small>' + (q ? periodo(sel.ci, sel.co) : 'Sem taxa do Airbnb') + '</small></span>' +
        '<button class="btn btn--sun" type="button" data-bk-bar>' + (q ? 'Reservar' : 'Ver datas') + '</button>';
    }
    box.addEventListener('click', function (e) {
      if (e.target.closest('[data-bk-open]')) { openPop(pop.hidden); return; }
      if (e.target.closest('[data-bk-close]')) { openPop(false); return; }
      if (e.target.closest('[data-bk-clear]')) { pick(null, null); return; }
      var g = e.target.closest('[data-bk-g]');
      if (g) { guests = Math.max(1, Math.min(i.hospedes, guests + Number(g.dataset.bkG))); st.guests = guests; paint(); return; }
      if (e.target.closest('[data-bk-go]')) go();
    });
    if (bar) bar.addEventListener('click', function (e) {
      if (!e.target.closest('[data-bk-bar]')) return;
      if (sel.ci && sel.co) go(); else { (calSlot || box).scrollIntoView({ behavior: 'smooth', block: 'center' }); if (!calSlot) openPop(true); }
    });
    function go() {
      var warn = $('[data-bk-warn]', box);
      if (!sel.ci || !sel.co) { openPop(true); return; }
      warn.hidden = true;
      APP().track('booking_start', { slug: i.slug });
      location.hash = 'reservar/' + i.slug + '/' + sel.ci + '/' + sel.co + '/' + guests;
    }
    paint();
  }

  function summaryHTML(i, q) {
    var rows = q.diarias != null
      ? '<li><span>' + money(q.media) + ' × ' + noitesTxt(q.noites) + '</span><b>' + money(q.diarias) + '</b></li>'
      : '<li><span>Diárias (' + noitesTxt(q.noites) + ')</span><b>a confirmar</b></li>';
    rows += '<li><span>Taxa de limpeza</span><b>' + money(q.limpeza) + '</b></li>';
    rows += '<li class="is-save"><span>Taxa de serviço do Airbnb</span><b>R$ 0</b></li>';
    return '<ul class="bk__rows">' + rows + '</ul>' +
      '<p class="bk__total"><span>Total</span><b>' + (q.total != null ? money(q.total) : 'Confirmado pela equipe') + '</b></p>' +
      (q.sinal != null ? '<p class="bk__sinal">Sinal para reservar (50%): <b>' + money(q.sinal) + '</b></p>' : '<p class="bk__sinal">A equipe envia o valor das diárias para as suas datas.</p>');
  }

  /* ---------- login (mesmo bloco no checkout e em "Minhas reservas") ---------- */
  function loginHTML() {
    return '<div class="auth" data-auth>' +
      (PREVIA ? '<p class="auth__prev"><b>Prévia:</b> o login ainda não está ligado. Use o código <b>123456</b>. No site no ar, o código chega por e-mail.</p>' : '') +
      '<button type="button" class="auth__g" data-auth-google><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.8Z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.7V6.6H1.4a12 12 0 0 0 0 10.9l4-3.1Z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z"/></svg>Continuar com Google</button>' +
      '<p class="auth__or"><span>ou</span></p>' +
      '<form class="auth__f" data-auth-email novalidate><label>E-mail<input type="email" name="email" autocomplete="email" required placeholder="voce@email.com"></label>' +
      '<button class="btn btn--mar" type="submit">Continuar com e-mail</button></form>' +
      '<form class="auth__f" data-auth-code novalidate hidden><p class="auth__sent">Enviamos um código de 6 dígitos para <b data-auth-to></b>.</p>' +
      '<label>Código<input name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" required class="auth__code"></label>' +
      '<button class="btn btn--mar" type="submit">Entrar</button><button type="button" class="linklike" data-auth-back>Usar outro e-mail</button></form>' +
      '<p class="auth__err" data-auth-err role="alert" hidden></p>' +
      '<p class="auth__legal">Criar a conta é grátis. Você só precisa dela para reservar e acompanhar suas reservas.</p></div>';
  }
  function bindLogin(root, done) {
    var fe = $('[data-auth-email]', root), fc = $('[data-auth-code]', root), err = $('[data-auth-err]', root), email = '';
    var fail = function (m) { err.hidden = false; err.textContent = m; };
    $('[data-auth-google]', root).addEventListener('click', function () {
      AUTH.google().then(function (r) { if (!r.ok) { fail('O login com Google entra quando o site estiver no ar. Por enquanto, use o e-mail.'); fe.email.focus(); } });
    });
    fe.addEventListener('submit', function (e) {
      e.preventDefault(); err.hidden = true; email = fe.email.value.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { fail('Confira o e-mail.'); fe.email.focus(); return; }
      AUTH.sendCode(email).then(function () { fe.hidden = true; fc.hidden = false; $('[data-auth-to]', root).textContent = email; fc.code.focus(); });
    });
    fc.addEventListener('submit', function (e) {
      e.preventDefault(); err.hidden = true;
      AUTH.verify(email, fc.code.value.trim()).then(function (r) { if (!r.ok) { fail('Código incorreto. Confira e tente de novo.'); fc.code.select(); return; } APP().track('login'); done(r.user); });
    });
    $('[data-auth-back]', root).addEventListener('click', function () { fc.hidden = true; fe.hidden = false; err.hidden = true; fe.email.focus(); });
  }

  /* ---------- página "Confirmar e reservar" ---------- */
  function checkout(arg) {
    var root = $('#checkout-body'), p = arg.split('/'), i = bySlug[p[0]], ci = p[1], co = p[2], g = Math.max(1, Math.min(+p[3] || 1, i ? i.hospedes : 1));
    var valid = i && ci >= today() && co > ci && diff(ci, co) >= MIN;
    if (valid) { var bl = AGENDA.blocked(i); for (var d = ci; d < co; d = addDays(d, 1)) if (bl[d]) { valid = false; break; } }
    if (!valid) {
      root.innerHTML = '<div class="co__empty"><h1>Essas datas não estão disponíveis</h1><p>Escolha outras datas no calendário do imóvel.</p>' +
        (i ? '<a class="btn btn--mar" href="#imovel/' + i.slug + '">Voltar ao imóvel</a>' : '<a class="btn btn--mar" href="#destinos">Ver imóveis</a>') + '</div>';
      return;
    }
    var q = quote(i, ci, co), pic = APP().img(i);
    root.innerHTML =
      '<button type="button" class="back" data-co-back><svg aria-hidden="true"><use href="#i-arrow"/></svg>Voltar ao imóvel</button>' +
      '<h1 class="co__h">Confirmar e reservar</h1>' +
      (PREVIA ? '<p class="co__prev"><svg aria-hidden="true"><use href="#i-sparkle"/></svg><span><b>Prévia da reserva online.</b> O login e o pagamento ainda não estão ligados: no fim, sua pré-reserva vai pelo WhatsApp para a equipe confirmar.</span></p>' : '') +
      '<div class="co"><div class="co__main">' +
        '<section class="co__s"><h2>Sua viagem</h2><dl class="co__trip"><div><dt>Datas</dt><dd>' + esc(periodo(ci, co)) + ' · ' + noitesTxt(q.noites) + '</dd></div>' +
          '<div><dt>Hóspedes</dt><dd>' + g + (g === 1 ? ' hóspede' : ' hóspedes') + '</dd></div></dl>' +
          '<a class="linklike" href="#imovel/' + i.slug + '">Alterar datas ou hóspedes</a></section>' +
        '<section class="co__s" data-co-step="conta"><h2><span>1</span>Entre ou cadastre-se</h2><div data-co-auth></div></section>' +
        '<section class="co__s" data-co-step="dados"><h2><span>2</span>Seus dados</h2><div data-co-dados></div></section>' +
        '<section class="co__s" data-co-step="pagar"><h2><span>3</span>Pagamento</h2><div data-co-pagar></div></section>' +
      '</div>' +
      '<aside class="co__card"><div class="co__prop"><img src="' + pic.src + '" alt=""><div><small>' + esc(APP().destName[i.destino]) + '</small><b>' + esc(i.nome) + '</b>' +
        (i.nota ? '<span>★ ' + i.nota + ' (' + i.avaliacoes + ')</span>' : '') + '</div></div>' +
        '<h3>Detalhes do preço</h3>' + summaryHTML(i, q) +
        '<p class="book__save"><svg aria-hidden="true"><use href="#i-tag"/></svg><span><b>Reserva direta, sem taxa do Airbnb.</b> Você paga menos reservando aqui com a gente.</span></p>' +
      '</aside></div>';

    $('[data-co-back]', root).addEventListener('click', function () { if (history.length > 1) history.back(); else location.hash = 'imovel/' + i.slug; });
    function step() {
      var u = AUTH.user(), auth = $('[data-co-auth]', root), dados = $('[data-co-dados]', root), pagar = $('[data-co-pagar]', root);
      $$('[data-co-step]', root).forEach(function (s) { s.classList.remove('is-done', 'is-off'); });
      if (!u) {
        auth.innerHTML = loginHTML(); bindLogin(auth, function () { step(); });
        dados.innerHTML = '<p class="co__wait">Entre na sua conta para continuar.</p>'; pagar.innerHTML = '';
        $('[data-co-step="dados"]', root).classList.add('is-off'); $('[data-co-step="pagar"]', root).classList.add('is-off');
        return;
      }
      $('[data-co-step="conta"]', root).classList.add('is-done');
      auth.innerHTML = '<p class="co__who">Conectado como <b>' + esc(u.email) + '</b> <button type="button" class="linklike" data-co-out>Sair</button></p>';
      $('[data-co-out]', auth).addEventListener('click', function () { AUTH.signOut(); step(); });
      dados.innerHTML =
        '<form class="co__form" data-co-form novalidate>' +
          '<div class="co__row"><label>Nome *<input name="nome" required autocomplete="given-name" value="' + esc(u.nome || '') + '"></label>' +
          '<label>Sobrenome *<input name="sobrenome" required autocomplete="family-name" value="' + esc(u.sobrenome || '') + '"></label></div>' +
          '<div class="co__row"><label>WhatsApp (com DDI) *<input name="tel" type="tel" required autocomplete="tel" inputmode="tel" placeholder="+55 21 9…" value="' + esc(u.tel || '') + '"></label>' +
          '<label>País<input name="pais" autocomplete="country-name" value="' + esc(u.pais || '') + '"></label></div>' +
          '<div class="co__row"><label>Documento (CPF ou passaporte) *<input name="doc" required value="' + esc(u.doc || '') + '"></label>' +
          '<label>Previsão de chegada<select name="chegada"><option value="">Ainda não sei</option><option>14h às 17h</option><option>17h às 20h</option><option>20h às 23h</option></select></label></div>' +
          '<label>Mensagem para o anfitrião<textarea name="msg" rows="3" placeholder="Ex.: viajo com meu cachorro de pequeno porte; chegamos de carro"></textarea></label>' +
          '<label class="co__check"><input type="checkbox" name="aceite" required><span>Li e aceito as regras da casa e a política de cancelamento: ' + esc(E.condicoes.cancelamento) + '</span></label>' +
          '<p class="auth__err" data-co-err role="alert" hidden></p>' +
        '</form>';
      pagar.innerHTML =
        '<div class="co__pay"><div class="co__pix"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5.3 18.5a2.6 2.6 0 0 0 1.9-.8l2.7-2.7a.5.5 0 0 1 .7 0l2.8 2.7a2.6 2.6 0 0 0 1.9.8h.5l-3.5 3.5a2.8 2.8 0 0 1-4 0L4.8 18.5h.5Zm9.9-12.9a2.6 2.6 0 0 0-1.9.8l-2.7 2.7a.5.5 0 0 1-.7 0L7.1 6.4a2.6 2.6 0 0 0-1.9-.8h-.4L8.3 2a2.8 2.8 0 0 1 4 0l3.5 3.5h-.6Zm4.5 1.8 2.3 2.4a2.8 2.8 0 0 1 0 4l-2.3 2.3h-1.4a1.6 1.6 0 0 1-1.1-.5L14.3 13a1.4 1.4 0 0 0-2 0l-2.8 2.7a1.6 1.6 0 0 1-1.1.5H6.6L4.4 13.9a2.8 2.8 0 0 1 0-4l2.2-2.2h1.8c.4 0 .8.1 1.1.4l2.8 2.8a1.4 1.4 0 0 0 2 0L17.1 8a1.6 1.6 0 0 1 1.1-.5h1.5Z"/></svg>' +
          '<div><b>Pix</b><small>' + esc(E.condicoes.sinal) + '</small></div></div>' +
          (q.sinal != null ? '<p class="co__sinal">Sinal agora: <b>' + money(q.sinal) + '</b></p>' : '<p class="co__sinal">A equipe confirma o valor das diárias e envia o Pix do sinal.</p>') +
          (PREVIA ? '<p class="co__note">Na prévia, a pré-reserva é enviada pelo WhatsApp e a equipe responde com a confirmação e o Pix. Com o site no ar, o QR Code do Pix aparece aqui e a reserva confirma na hora.</p>' : '') +
          '<button class="btn btn--sun" type="button" data-co-go><svg aria-hidden="true"><use href="#i-wa"/></svg> ' + (PREVIA ? 'Enviar pré-reserva' : 'Pagar sinal com Pix') + '</button>' +
          '<a class="wa-open" data-co-open target="_blank" rel="noopener" hidden>Mensagem pronta: toque para abrir no WhatsApp →</a></div>';
      var f = $('[data-co-form]', dados), err = $('[data-co-err]', dados);
      f.addEventListener('input', function (e) { e.target.removeAttribute('aria-invalid'); err.hidden = true; });
      $('[data-co-go]', pagar).addEventListener('click', function () {
        var bad = ['nome', 'sobrenome', 'tel', 'doc'].filter(function (k) { f[k].removeAttribute('aria-invalid'); return !f[k].value.trim(); });
        if (!bad.length && f.tel.value.replace(/\D/g, '').length < 8) bad = ['tel'];
        bad.forEach(function (k) { f[k].setAttribute('aria-invalid', 'true'); });
        if (bad.length) { err.hidden = false; err.textContent = 'Preencha nome, sobrenome, WhatsApp e documento.'; f[bad[0]].focus(); return; }
        if (!f.aceite.checked) { err.hidden = false; err.textContent = 'Para reservar, aceite as regras da casa e a política de cancelamento.'; f.aceite.focus(); return; }
        err.hidden = true;
        var dadosH = { nome: f.nome.value.trim(), sobrenome: f.sobrenome.value.trim(), tel: f.tel.value.trim(), pais: f.pais.value.trim(), doc: f.doc.value.trim() };
        AUTH.saveProfile(dadosH);
        var r = Object.assign({ slug: i.slug, ci: ci, co: co, hospedes: g, email: u.email, chegada: f.chegada.value, msg: f.msg.value.trim(), total: q.total, sinal: q.sinal, limpeza: q.limpeza }, dadosH);
        PAGAMENTO.criar(r).then(function (res) {
          APP().track('booking_request', { slug: i.slug, noites: q.noites });
          var link = APP().waLink(msgReserva(i, res, q));
          APP().openWa(link, $('[data-co-open]', pagar));
          done(res, link);
        });
      });
    }
    function done(res, link) {
      $('.co__main', root).innerHTML =
        '<section class="co__s co__ok"><span class="co__okic" aria-hidden="true"><svg><use href="#i-check"/></svg></span><h2>Pré-reserva enviada!</h2>' +
        '<p>Código da reserva: <b>' + esc(res.id) + '</b></p>' +
        '<ol class="co__next"><li><b>A equipe confere a disponibilidade</b> e responde pelo WhatsApp (todos os dias, das 7h às 22h).</li>' +
        '<li><b>Você paga o sinal de 50% por Pix</b> para garantir as datas.</li>' +
        '<li><b>Os outros 50%</b> são pagos um dia antes da entrada.</li></ol>' +
        '<p class="co__acts"><a class="btn btn--sun" href="' + esc(link) + '" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg> Abrir conversa no WhatsApp</a>' +
        '<a class="btn btn--ghost" href="#minhas-reservas">Minhas reservas</a></p></section>';
      var main = $('.co__main', root); main.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    step();
  }

  function msgReserva(i, r, q) {
    var m = ['Olá! Fiz uma pré-reserva pelo site.', 'Código: ' + r.id + '.', 'Imóvel: "' + i.nome + '" (' + APP().destName[i.destino] + ').',
      'Datas: ' + APP().fmtDate(r.ci) + ' a ' + APP().fmtDate(r.co) + ' (' + q.noites + ' noites).', 'Hóspedes: ' + r.hospedes + '.',
      'Nome: ' + r.nome + ' ' + r.sobrenome, 'WhatsApp: ' + r.tel, 'Documento: ' + r.doc];
    if (r.pais) m.push('País: ' + r.pais);
    if (r.chegada) m.push('Chegada prevista: ' + r.chegada);
    if (r.msg) m.push('Mensagem: ' + r.msg);
    m.push(q.total != null ? 'Total: ' + money(q.total) + ' (sinal de ' + money(q.sinal) + ').' : 'Pode me confirmar o valor e enviar o Pix do sinal?');
    return m.join('\n');
  }

  /* ---------- "Minhas reservas" ---------- */
  var STATUS = { 'pre-reserva': ['Pré-reserva enviada', 'A equipe confirma pelo WhatsApp'], confirmada: ['Confirmada', 'Sinal pago'], cancelada: ['Cancelada', ''] };
  function conta() {
    var root = $('#conta-body'), u = AUTH.user();
    if (!u) {
      root.innerHTML = '<h1 class="co__h">Minhas reservas</h1><p class="phead__lead">Entre com o e-mail que você usou para reservar.</p><div class="conta__login" data-conta-auth></div>';
      $('[data-conta-auth]', root).innerHTML = loginHTML(); bindLogin($('[data-conta-auth]', root), function () { conta(); });
      return;
    }
    var list = meus(), hoje = today();
    var card = function (r) {
      var i = bySlug[r.slug]; if (!i) return '';
      var s = STATUS[r.status] || STATUS['pre-reserva'], pic = APP().img(i), passada = r.co < hoje;
      return '<article class="rv-card' + (passada ? ' is-past' : '') + '"><img src="' + pic.src + '" alt="" loading="lazy">' +
        '<div class="rv-card__b"><span class="rv-st rv-st--' + r.status + '">' + s[0] + '</span><h3>' + esc(i.nome) + '</h3>' +
        '<p>' + esc(periodo(r.ci, r.co)) + ' · ' + noitesTxt(diff(r.ci, r.co)) + ' · ' + r.hospedes + (r.hospedes === 1 ? ' hóspede' : ' hóspedes') + '</p>' +
        '<p class="rv-card__s">Código ' + esc(r.id) + (r.total != null ? ' · Total ' + money(r.total) : '') + (s[1] ? ' · ' + s[1] : '') + '</p>' +
        '<p class="rv-card__a"><a class="alem__act" href="#" data-wa-msg="' + esc('Olá! Quero falar sobre a minha reserva ' + r.id + ' (' + i.nome + ').') + '" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg>Falar sobre esta reserva</a>' +
        '<a class="alem__act alem__act--in" href="#imovel/' + i.slug + '">Ver o imóvel →</a></p></div></article>';
    };
    var prox = list.filter(function (r) { return r.co >= hoje; }), ant = list.filter(function (r) { return r.co < hoje; });
    root.innerHTML = '<div class="conta__head"><h1 class="co__h">Minhas reservas</h1><p class="co__who">Conectado como <b>' + esc(u.email) + '</b> <button type="button" class="linklike" data-conta-out>Sair</button></p></div>' +
      (PREVIA ? '<p class="co__prev"><svg aria-hidden="true"><use href="#i-sparkle"/></svg><span><b>Prévia:</b> as reservas ficam salvas só neste navegador até o site entrar no ar.</span></p>' : '') +
      (list.length ? (prox.length ? '<h2 class="conta__h2">Próximas viagens</h2><div class="rv-list">' + prox.map(card).join('') + '</div>' : '') +
        (ant.length ? '<h2 class="conta__h2">Viagens anteriores</h2><div class="rv-list">' + ant.map(card).join('') + '</div>' : '')
        : '<div class="co__empty"><h2>Você ainda não tem reservas</h2><p>Escolha um destino, veja as datas livres e reserve direto, sem taxa do Airbnb.</p><a class="btn btn--mar" href="#destinos">Ver destinos</a></div>');
    var out = $('[data-conta-out]', root); if (out) out.addEventListener('click', function () { AUTH.signOut(); conta(); });
    $$('[data-wa-msg]', root).forEach(function (a) { a.href = APP().waLink(a.getAttribute('data-wa-msg')); });
  }

  /* ---------- botão da conta no topo ---------- */
  function header() {
    var u = AUTH.user();
    $$('[data-acct]').forEach(function (b) {
      b.classList.toggle('is-in', !!u);
      var ini = u ? (u.nome || u.email).trim().charAt(0).toUpperCase() : '';
      var lbl = $('[data-acct-l]', b); if (lbl) lbl.textContent = u ? 'Minhas reservas' : 'Entrar';
      var av = $('[data-acct-av]', b); if (av) av.textContent = ini;
    });
  }
  listeners.push(header);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', header); else header();

  window.BOOKING = { mountBox: mountBox, checkout: checkout, conta: conta, quote: quote, _auth: AUTH };
})();

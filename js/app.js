/* ============ Vicente Prior — galeria ============ */
(() => {
  'use strict';

  /* ---- CONFIGURAÇÃO: troque pelos dados reais do ateliê ---- */
  const CONFIG = {
    whatsapp: '5500000000000',          // DDI + DDD + número, só dígitos
    email: 'contato@vicenteprior.com.br'
  };

  const OBRAS = window.OBRAS.slice().sort((a, b) => a.rank - b.rank);
  const byId = Object.fromEntries(OBRAS.map(o => [o.id, o]));
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const img = id => `assets/obras/${id}.jpg`;
  const thumb = id => `assets/obras/thumb/${id}.jpg`;
  const pad = n => String(n).padStart(2, '0');
  const nota = n => n.toFixed(1);
  const tier = o => o.nota >= 9.6 ? 'prima' : o.nota >= 9.3 ? 'destaque' : 'colecao';
  const tierLabel = { prima: 'Obra-prima', destaque: 'Destaque', colecao: 'Coleção' };
  const fmtBRL = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const wa = text => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const url = o => `${location.origin}${location.pathname}#obra-${o.id}`;
  const interestMsg = o => `Olá! Tenho interesse na obra Nº ${pad(o.rank)} "${o.titulo}" de Vicente Prior. Poderia me enviar valor e medidas? ${url(o)}`;

  const COLORS = {
    vermelhos: { label: 'Vermelhos', c: '#a8281e' },
    terrosos:  { label: 'Terrosos', c: '#8a5a3a' },
    dourados:  { label: 'Dourados', c: '#c49a3a' },
    azuis:     { label: 'Azuis', c: '#2c5a85' },
    verdes:    { label: 'Verdes', c: '#4f6d3a' },
    escuros:   { label: 'Escuros', c: '#26201c' },
    neutros:   { label: 'Neutros', c: '#c9c0b2' },
    multicor:  { label: 'Multicor', c: 'conic-gradient(#a8281e,#c49a3a,#4f6d3a,#2c5a85,#a8281e)' }
  };

  /* ---------- favoritos ---------- */
  let wish = [];
  try { wish = JSON.parse(localStorage.getItem('vp-wish') || '[]').filter(id => byId[id]); } catch (e) { wish = []; }
  const saveWish = () => { try { localStorage.setItem('vp-wish', JSON.stringify(wish)); } catch (e) {} };
  const isWished = id => wish.includes(id);
  function toggleWish(id) {
    const on = !isWished(id);
    wish = on ? [...wish, id] : wish.filter(x => x !== id);
    saveWish(); syncWish();
    toast(on ? `“${byId[id].titulo}” salva na sua seleção` : 'Removida da seleção');
  }
  function syncWish() {
    const b = $('#wishCount'); b.textContent = wish.length; b.classList.toggle('on', wish.length > 0);
    $$('.c-heart').forEach(h => { const on = isWished(h.dataset.id); h.classList.toggle('on', on); h.setAttribute('aria-pressed', on); });
    if (current) $('#vHeart').setAttribute('aria-pressed', isWished(current.id));
    renderWish();
  }
  function renderWish() {
    const list = $('#wishList');
    if (!wish.length) {
      list.innerHTML = '<p class="w-empty">Sua seleção está vazia. Toque no ♡ das obras que você gostar para compará-las e pedir valores de uma só vez.</p>';
      $('#wishSend').style.display = 'none'; return;
    }
    $('#wishSend').style.display = '';
    list.innerHTML = wish.map(id => { const o = byId[id]; return `
      <div class="w-item">
        <img src="${thumb(id)}" alt="${esc(o.titulo)}" data-open="${id}">
        <div><b>${esc(o.titulo)}</b><span>Nº ${pad(o.rank)} · nota ${nota(o.nota)}</span></div>
        <button data-unwish="${id}">Remover</button>
      </div>`; }).join('');
    const names = wish.map(id => `• Nº ${pad(byId[id].rank)} ${byId[id].titulo}`).join('\n');
    $('#wishSend').href = wa(`Olá! Gostaria de valores e medidas destas obras de Vicente Prior:\n${names}`);
  }

  /* ---------- toast ---------- */
  let tt;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2400); }

  /* ---------- HERO ---------- */
  function hero() {
    const o = OBRAS[0];
    $('#heroCanvas').innerHTML = `<img src="${img(o.id)}" alt="${esc(o.titulo)}, de Vicente Prior" fetchpriority="high" width="${o.w}" height="${o.h}">`;
    $('#heroCap').innerHTML = `<span><b>${esc(o.titulo)}</b><br>Nº 01 do ranking · Obra-prima</span><span class="score">NOTA ${nota(o.nota)}</span>`;
    $('#heroCanvas img').addEventListener('click', () => openViewer(o.id));
    const art = $('#heroArt'), cv = $('#heroCanvas');
    if (matchMedia('(hover:hover)').matches) {
      art.addEventListener('mousemove', e => {
        const r = art.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        cv.style.transform = `rotateY(${(x - .5) * 8}deg) rotateX(${(.5 - y) * 6}deg)`;
        cv.style.setProperty('--gx', x * 100 + '%'); cv.style.setProperty('--gy', y * 100 + '%');
      });
      art.addEventListener('mouseleave', () => cv.style.transform = '');
    }
    const items = OBRAS.slice(0, 20).map(o => `<span>${esc(o.titulo)} <small>Nº ${pad(o.rank)} · ${nota(o.nota)}</small></span>`).join('');
    $('#ticker').innerHTML = items + items;
  }

  /* ---------- TOP 3 ---------- */
  function podium() {
    $('#podium').innerHTML = OBRAS.slice(0, 3).map(o => `
      <article class="p-item" data-open="${o.id}" tabindex="0" role="button" aria-label="Abrir ${esc(o.titulo)}">
        <span class="p-num">${pad(o.rank)}</span>
        <div class="p-frame"><img src="${img(o.id)}" alt="${esc(o.titulo)}" loading="lazy" width="${o.w}" height="${o.h}"></div>
        <div class="p-cap"><h3>${esc(o.titulo)}</h3><span class="meta">Nota <b>${nota(o.nota)}</b></span></div>
      </article>`).join('');
    const room = $('#obras-primas'), spot = $('.spot', room);
    room.addEventListener('pointermove', e => {
      const r = room.getBoundingClientRect();
      spot.style.setProperty('--mx', e.clientX - r.left + 'px'); spot.style.setProperty('--my', e.clientY - r.top + 'px');
    });
    // em telas de toque, acende cada obra conforme entra na tela
    if (!matchMedia('(hover:hover)').matches) {
      const io = new IntersectionObserver(es => es.forEach(en => en.target.classList.toggle('lit', en.intersectionRatio > .4)), { threshold: [0, .4, 1] });
      $$('.p-item').forEach(p => io.observe(p));
    }
  }

  /* ---------- TOP 10 ---------- */
  function top10() {
    const rail = $('#rail');
    rail.innerHTML = OBRAS.slice(0, 10).map(o => `
      <article class="r-item" data-open="${o.id}" tabindex="0" role="button" aria-label="Nº ${o.rank}: ${esc(o.titulo)}">
        <span class="r-num" aria-hidden="true">${o.rank}</span>
        <div class="r-art"><img src="${thumb(o.id)}" alt="${esc(o.titulo)}" loading="lazy" draggable="false" width="${o.w}" height="${o.h}"></div>
        <div class="r-info"><b>${esc(o.titulo)}</b><span>${nota(o.nota)}</span></div>
      </article>`).join('');
    $$('[data-rail]').forEach(b => b.addEventListener('click', () => rail.scrollBy({ left: rail.clientWidth * .7 * +b.dataset.rail, behavior: 'smooth' })));
    // arrastar com mouse
    let down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
    window.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) { moved = true; rail.classList.add('drag'); } rail.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', () => { down = false; rail.classList.remove('drag'); });
    rail.addEventListener('click', e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  }

  /* ---------- COLEÇÃO ---------- */
  const state = { tier: 'all', color: null, shape: null, sort: 'rank' };
  function filters() {
    $('#colorFilter').innerHTML = Object.entries(COLORS).map(([k, v]) =>
      `<button class="sw" data-color="${k}" style="background:${v.c}" aria-label="${v.label}" aria-pressed="false"><span class="tip">${v.label}</span></button>`).join('');
    $('#filters').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.tier) { state.tier = b.dataset.tier; $$('[data-tier]').forEach(x => x.classList.toggle('on', x === b)); }
      if (b.dataset.color) { state.color = state.color === b.dataset.color ? null : b.dataset.color; $$('[data-color]').forEach(x => { const on = x.dataset.color === state.color; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); }); }
      if (b.dataset.shape) { state.shape = state.shape === b.dataset.shape ? null : b.dataset.shape; $$('[data-shape]').forEach(x => x.classList.toggle('on', x.dataset.shape === state.shape)); }
      renderGrid();
    });
    $('#sort').addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });
  }
  function renderGrid() {
    let list = OBRAS.filter(o =>
      (state.tier === 'all' || tier(o) === state.tier) &&
      (!state.color || o.cores.includes(state.color)) &&
      (!state.shape || o.formato === state.shape));
    const s = state.sort;
    if (s === 'az') list.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt'));
    if (s === 'za') list.sort((a, b) => b.titulo.localeCompare(a.titulo, 'pt'));
    if (s === 'rev') list.reverse();
    const featured = s === 'rank' && state.tier === 'all' && !state.color && !state.shape;
    $('#resultCount').textContent = `${list.length} ${list.length === 1 ? 'obra' : 'obras'}${featured ? ' · as mais bem avaliadas aparecem em destaque' : ''}`;
    if (!list.length) { $('#grid').innerHTML = '<p class="empty">Nenhuma obra com essa combinação. Tente outro filtro.</p>'; return; }
    $('#grid').innerHTML = list.map((o, i) => {
      const t = tier(o);
      // destaque visual proporcional à nota: top 3 grandes, top 10 médios
      const size = featured ? (o.rank <= 2 ? 'big' : o.rank <= 5 ? 'mid' : '') : '';
      const ar = `--ar:${size === 'big' ? '16/10' : size === 'mid' ? '5/4' : '1/1'}`;
      return `
      <article class="card ${size}" style="animation-delay:${Math.min(i, 12) * 40}ms;${ar}" data-open="${o.id}">
        <div class="c-frame">
          <img src="${size === 'big' ? img(o.id) : thumb(o.id)}" alt="${esc(o.titulo)}, pintura de Vicente Prior" loading="lazy" width="${o.w}" height="${o.h}">
          ${t !== 'colecao' ? `<span class="c-tag ${t}">${tierLabel[t]}</span>` : ''}
          <button class="c-heart ${isWished(o.id) ? 'on' : ''}" data-id="${o.id}" aria-label="Salvar ${esc(o.titulo)}" aria-pressed="${isWished(o.id)}">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>
          </button>
        </div>
        <div class="c-cap"><h3>${esc(o.titulo)}</h3><span class="rk">Nº ${pad(o.rank)}</span></div>
        <div class="c-sub"><span class="nota">${nota(o.nota)}</span><span>${o.preco ? fmtBRL(o.preco) : 'Sob consulta'}</span>
          <span class="c-dots">${o.paleta.slice(0, 4).map(c => `<i style="background:${c}"></i>`).join('')}</span></div>
      </article>`;
    }).join('');
  }

  /* ---------- VER NA PAREDE ---------- */
  const WALLS = ['#ece6dc', '#f7f5f0', '#d9cbb6', '#a9b3a1', '#6f7f8c', '#3f4a52', '#b8836a', '#2a2623'];
  let roomId = OBRAS[0].id;
  function wall() {
    $('#roomPick').innerHTML = OBRAS.map(o => `<option value="${o.id}">Nº ${pad(o.rank)} — ${esc(o.titulo)} (${nota(o.nota)})</option>`).join('');
    $('#formObra').innerHTML += OBRAS.map(o => `<option value="${o.id}">Nº ${pad(o.rank)} — ${esc(o.titulo)}</option>`).join('');
    $('#wallColors').innerHTML = WALLS.map((c, i) => `<button class="wc ${i ? '' : 'on'}" style="background:${c}" data-wall="${c}" aria-label="Parede ${c}"></button>`).join('');
    $('#wallColors').addEventListener('click', e => {
      const b = e.target.closest('[data-wall]'); if (!b) return;
      $('#roomWall').style.setProperty('--wall', b.dataset.wall);
      $$('.wc').forEach(x => x.classList.toggle('on', x === b));
    });
    $('#roomPick').addEventListener('change', e => setRoom(e.target.value));
    $('#roomSize').addEventListener('input', sizeRoom);
    window.addEventListener('resize', sizeRoom);
    $('#roomDetail').addEventListener('click', () => openViewer(roomId));
    setRoom(roomId);
  }
  function setRoom(id) {
    roomId = id; const o = byId[id], a = $('#roomArt');
    $('#roomPick').value = id;
    $('#roomInterest').href = wa(interestMsg(o));
    a.style.opacity = 0;
    setTimeout(() => { a.src = img(id); a.alt = `${o.titulo} simulada em uma sala`; a.dataset.ratio = o.w / o.h; sizeRoom(); a.style.opacity = 1; }, 200);
  }
  function sizeRoom() {
    const cm = +$('#roomSize').value, a = $('#roomArt'), sr = $('.room-sofa').getBoundingClientRect(), wr = $('#roomWall').getBoundingClientRect();
    $('#sizeOut').textContent = `${cm} cm`;
    const pxcm = sr.width / 210, ratio = +a.dataset.ratio || 1.5;
    const gap = 22 * pxcm;                                // ~22 cm acima do encosto
    const bottom = wr.bottom - sr.top + gap;              // distância da base da parede
    const maxH = wr.height - bottom - wr.height * .07;    // respiro no teto
    let w = cm * pxcm, h = w / ratio;
    if (h > maxH) { h = maxH; w = h * ratio; }
    Object.assign(a.style, { width: w + 'px', height: h + 'px', bottom: bottom + 'px' });
  }

  /* ---------- VISUALIZADOR ---------- */
  let current = null, lastFocus = null;
  function openViewer(id, push = true) {
    const o = byId[id]; if (!o) return;
    if (!current) lastFocus = document.activeElement;
    current = o;
    const v = $('#viewer'), im = $('#vImg');
    im.src = img(o.id); im.alt = `${o.titulo}, pintura de Vicente Prior`;
    im.style.animation = 'none'; void im.offsetWidth; im.style.animation = '';
    $('#vRank').textContent = `Nº ${pad(o.rank)} de ${OBRAS.length} no ranking`;
    $('#vTitle').textContent = o.titulo;
    $('#vMeta').textContent = `Vicente Prior · ${o.formato[0].toUpperCase() + o.formato.slice(1)} · ${o.cores.map(c => COLORS[c].label).join(', ')}`;
    $('#vNota').textContent = nota(o.nota);
    $('#vBar').style.width = '0';
    requestAnimationFrame(() => requestAnimationFrame(() => $('#vBar').style.width = `${(o.nota - 8) / 2 * 100}%`));
    $('#vTier').textContent = `${tierLabel[tier(o)]} · nota curatorial`;
    $('#vPalette').innerHTML = o.paleta.map(c => `<i style="background:${c}" title="${c}"></i>`).join('');
    $('#vDim').textContent = o.dimensoes || 'Sob consulta';
    $('#vPrice').innerHTML = o.preco ? `${fmtBRL(o.preco)}<small>ou parcelado no cartão</small>` : `Valor sob consulta<small>Resposta rápida pelo WhatsApp</small>`;
    $('#vBuy').href = wa(interestMsg(o));
    $('#vHeart').setAttribute('aria-pressed', isWished(o.id));
    $('#vLens').style.backgroundImage = `url(${img(o.id)})`;
    if (v.hidden) { v.hidden = false; document.body.style.overflow = 'hidden'; $('#vClose').focus(); }
    if (push) history.replaceState(null, '', `#obra-${o.id}`);
  }
  function closeViewer() {
    $('#viewer').hidden = true; document.body.style.overflow = ''; current = null;
    history.replaceState(null, '', location.pathname + location.search);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  function step(d) { const i = OBRAS.indexOf(current); openViewer(OBRAS[(i + d + OBRAS.length) % OBRAS.length].id); }
  function viewer() {
    $('#vClose').addEventListener('click', closeViewer);
    $('#vPrev').addEventListener('click', () => step(-1));
    $('#vNext').addEventListener('click', () => step(1));
    $('#vHeart').addEventListener('click', () => toggleWish(current.id));
    $('#vWall').addEventListener('click', () => { const id = current.id; closeViewer(); setRoom(id); $('#parede').scrollIntoView({ behavior: 'smooth' }); });
    $('#vShare').addEventListener('click', async () => {
      const u = url(current);
      try { if (navigator.share) await navigator.share({ title: current.titulo, url: u }); else { await navigator.clipboard.writeText(u); toast('Link copiado'); } } catch (e) {}
    });
    document.addEventListener('keydown', e => {
      if ($('#viewer').hidden) { if (e.key === 'Escape') closeWish(); return; }
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    });
    // lupa de textura
    const st = $('#vStage'), lens = $('#vLens'), im = $('#vImg'), Z = 2.6;
    st.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = im.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) { st.classList.remove('zoom'); return; }
      st.classList.add('zoom');
      const sr = st.getBoundingClientRect();
      lens.style.left = e.clientX - sr.left + 'px'; lens.style.top = e.clientY - sr.top + 'px';
      lens.style.backgroundSize = `${r.width * Z}px ${r.height * Z}px`;
      lens.style.backgroundPosition = `${-(x * Z - 110)}px ${-(y * Z - 110)}px`;
    });
    st.addEventListener('pointerleave', () => st.classList.remove('zoom'));
    // deslizar no celular
    let tx = null;
    st.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true });
    st.addEventListener('touchend', e => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); tx = null; });
  }

  /* ---------- gaveta de favoritos ---------- */
  function openWish() { $('#wish').hidden = false; $('#scrim').hidden = false; $('#wishClose').focus(); }
  function closeWish() { $('#wish').hidden = true; $('#scrim').hidden = true; }

  /* ---------- eventos globais ---------- */
  function global() {
    document.addEventListener('click', e => {
      const h = e.target.closest('.c-heart'); if (h) { e.stopPropagation(); toggleWish(h.dataset.id); return; }
      const u = e.target.closest('[data-unwish]'); if (u) { toggleWish(u.dataset.unwish); return; }
      const o = e.target.closest('[data-open]'); if (o) { if (!$('#wish').hidden) closeWish(); openViewer(o.dataset.open); }
    });
    document.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-open][role=button]')) { e.preventDefault(); openViewer(e.target.dataset.open); }
    });
    $('#openWish').addEventListener('click', openWish);
    $('#wishClose').addEventListener('click', closeWish);
    $('#scrim').addEventListener('click', closeWish);

    // menu mobile
    const nav = $('#nav'), mb = $('#menuBtn'), top = $('#topbar');
    const setMenu = open => { nav.classList.toggle('open', open); mb.setAttribute('aria-expanded', open); top.classList.toggle('menu-open', open); document.body.style.overflow = open ? 'hidden' : ''; };
    mb.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
    $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));

    // topo ao rolar + cor sobre seção escura
    const darks = $$('.dark-room, .contact, .footer');
    const onScroll = () => {
      top.classList.toggle('scrolled', scrollY > 30);
      const y = 40; top.classList.toggle('on-dark', darks.some(d => { const r = d.getBoundingClientRect(); return r.top <= y && r.bottom >= y; }));
      if (top.classList.contains('on-dark')) top.classList.remove('scrolled');
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    // link ativo
    const secs = $$('main section[id]');
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) $$('.nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(s => io.observe(s));


    // contato
    $('#waMain').href = wa('Olá! Vim pelo site e gostaria de conhecer as obras de Vicente Prior.');
    $('#contactForm').addEventListener('submit', e => {
      e.preventDefault();
      const f = new FormData(e.target), o = byId[f.get('obra')];
      const msg = `Olá! Sou ${f.get('nome')} (${f.get('contato')}).` + (o ? ` Tenho interesse na obra Nº ${pad(o.rank)} "${o.titulo}".` : '') + (f.get('msg') ? `\n${f.get('msg')}` : '');
      const a = $('#formSend'); a.href = wa(msg); a.hidden = false; a.focus();
      toast('Mensagem pronta: toque em “Abrir no WhatsApp”');
    });
    $('#year').textContent = new Date().getFullYear();

    // link direto para obra (#obra-07)
    const openFromHash = () => { const m = location.hash.match(/^#obra-(\d{2})$/); if (m && byId[m[1]]) openViewer(m[1], false); };
    addEventListener('hashchange', openFromHash); openFromHash();
  }

  hero(); podium(); top10(); filters(); renderGrid(); wall(); viewer(); global(); syncWish();
})();

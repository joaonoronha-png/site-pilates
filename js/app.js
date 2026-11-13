/* ============ Vicente Prior — galeria ============ */
(() => {
  'use strict';

  /* ---- CONFIGURAÇÃO: troque pelos dados reais do ateliê ---- */
  const CONFIG = {
    whatsapp: '5521993518769',          // DDI + DDD + número, só dígitos
    email: 'vicenteprior@gmail.com'
  };

  // Destaques escolhidos à mão (ids). Aparecem na sala escura e no topo da coleção; o resto segue o ranking.
  const DESTAQUES = ['06', '47', '61'];
  const OBRAS = window.OBRAS.slice().sort((a, b) => a.rank - b.rank);
  const FEATURED_FIRST = [...DESTAQUES.map(id => OBRAS.find(o => o.id === id)), ...OBRAS.filter(o => !DESTAQUES.includes(o.id))];
  const byId = Object.fromEntries(OBRAS.map(o => [o.id, o]));
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const img = id => `assets/obras/${id}.jpg`;
  const thumb = id => `assets/obras/thumb/${id}.jpg`;
  const pad = n => String(n).padStart(2, '0');
  const nota = n => n.toFixed(1);
  const fmtBRL = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const wa = text => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const url = o => `${location.origin}${location.pathname}#obra-${o.id}`;
  const negMsg = (o, offer) => `Olá! Gostaria de negociar o preço da obra "${o.titulo}" de Vicente Prior.` + (offer ? ` Minha oferta é de R$ ${offer}.` : ' Qual o valor e as medidas?') + ` ${url(o)}`;
  const negLink = (o, offer) => wa(negMsg(o, offer));
  const askLink = o => wa(`Olá, Vicente! Tenho uma dúvida sobre a obra "${o.titulo}": ${url(o)}`);
  const DESC = 'Obra feita artesanalmente por Vicente Prior. Cada camada de tinta, textura e raspagem é aplicada à mão, por isso não existe outra igual. Peça única, assinada pelo artista.';

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
    toast(on ? `♥ “${byId[id].titulo}” está nas suas favoritas` : 'Removida das favoritas');
    if (on) { const b = $('#openWish'); b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); }
    if (state.fav) renderGrid();
  }
  function syncWish() {
    const b = $('#wishCount'); b.textContent = wish.length; $('#openWish').classList.toggle('has', wish.length > 0);
    $('#favChipCount').textContent = wish.length; $('#menuFavCount').textContent = wish.length;
    $$('.c-heart').forEach(h => { const on = isWished(h.dataset.id); h.classList.toggle('on', on); h.setAttribute('aria-pressed', on); });
    if (current) setViewerHeart();
    renderWish();
  }
  function renderWish() {
    const list = $('#wishList');
    if (!wish.length) {
      list.innerHTML = `<div class="w-empty"><span class="w-empty-ico">♡</span><b>Nenhuma obra favoritada ainda</b><p>Toque no coração de qualquer obra para guardá-la aqui. Depois é só voltar, comparar com calma e negociar o preço de todas de uma vez.</p></div>`;
      $('#wishSend').hidden = true; $('#wishShow').hidden = true; return;
    }
    $('#wishSend').hidden = false; $('#wishShow').hidden = false;
    list.innerHTML = wish.map(id => { const o = byId[id]; return `
      <div class="w-item">
        <img src="${thumb(id)}" alt="${esc(o.titulo)}" data-open="${id}">
        <div><b>${esc(o.titulo)}</b><span>Feita à mão · peça única</span><span class="w-acts"><button data-open="${id}">Ver obra</button><button data-unwish="${id}">Remover</button></span></div>
      </div>`; }).join('');
    const names = wish.map(id => `• ${byId[id].titulo}`).join('\n');
    $('#wishSend').href = wa(`Olá! Gostaria de negociar o preço destas obras de Vicente Prior:\n${names}`);
  }

  const heartBtn = o => `<button class="c-heart ${isWished(o.id) ? 'on' : ''}" data-id="${o.id}" aria-label="Favoritar ${esc(o.titulo)}" aria-pressed="${isWished(o.id)}"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg></button>`;

  /* ---------- toast ---------- */
  let tt;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2400); }

  /* ---------- HERO ---------- */
  function hero() {
    const o = OBRAS[0];
    $('#heroCanvas').innerHTML = `<img src="${img(o.id)}" alt="${esc(o.titulo)}, de Vicente Prior" fetchpriority="high" width="${o.w}" height="${o.h}">`;
    $('#heroCap').innerHTML = `<span><b>${esc(o.titulo)}</b><br>Pintura feita à mão · peça única</span><span class="cap-acts">${heartBtn(o)}<button class="score" type="button" data-open="${o.id}">Ver obra e fazer oferta →</button></span>`;
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
  }

  /* ---------- TOP 3 ---------- */
  function podium() {
    $('#podium').innerHTML = FEATURED_FIRST.slice(0, 3).map(o => `
      <article class="p-item" data-open="${o.id}" tabindex="0" role="button" aria-label="Abrir ${esc(o.titulo)}">
        <div class="p-frame"><img src="${img(o.id)}" alt="${esc(o.titulo)}" loading="lazy" width="${o.w}" height="${o.h}"></div>
        <div class="p-cap"><h3>${esc(o.titulo)}</h3><span class="cap-acts"><span class="p-neg">Ver obra e fazer oferta →</span>${heartBtn(o)}</span></div>
      </article>`).join('');
    const room = $('#destaques'), spot = $('.spot', room);
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

  /* ---------- COLEÇÃO ---------- */
  const state = { color: null, shape: null, sort: 'rank', fav: false };
  function filters() {
    $('#colorFilter').innerHTML = Object.entries(COLORS).map(([k, v]) =>
      `<button class="sw" data-color="${k}" style="background:${v.c}" aria-label="${v.label}" aria-pressed="false"><span class="tip">${v.label}</span></button>`).join('');
    $('#filters').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.id === 'favFilter') setFav(!state.fav);
      if (b.dataset.color) { state.color = state.color === b.dataset.color ? null : b.dataset.color; $$('[data-color]').forEach(x => { const on = x.dataset.color === state.color; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); }); }
      if (b.dataset.shape) { state.shape = state.shape === b.dataset.shape ? null : b.dataset.shape; $$('[data-shape]').forEach(x => x.classList.toggle('on', x.dataset.shape === state.shape)); }
      renderGrid();
    });
    $('#sort').addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });
  }
  function renderGrid() {
    let list = FEATURED_FIRST.filter(o =>
      (!state.fav || isWished(o.id)) &&
      (!state.color || o.cores.includes(state.color)) &&
      (!state.shape || o.formato === state.shape));
    const s = state.sort;
    if (s === 'az') list.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt'));
    if (s === 'za') list.sort((a, b) => b.titulo.localeCompare(a.titulo, 'pt'));
    $('#resultCount').textContent = `${list.length} ${list.length === 1 ? 'obra' : 'obras'} · toque em qualquer obra para ver de perto, tirar dúvidas e fazer sua oferta`;
    if (!list.length) { $('#grid').innerHTML = state.fav && !wish.length ? '<p class="empty">Você ainda não favoritou nenhuma obra. Toque no ♡ de uma obra para guardá-la aqui.</p>' : '<p class="empty">Nenhuma obra com essa combinação. Tente outro filtro.</p>'; return; }
    $('#grid').innerHTML = list.map((o, i) => `
      <article class="card" style="animation-delay:${Math.min(i, 12) * 40}ms" data-open="${o.id}">
        <div class="c-frame">
          <span class="c-view"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M11 8.5v5M8.5 11h5"/></svg>Ver detalhes</span>
          <img src="${thumb(o.id)}" alt="${esc(o.titulo)}, pintura de Vicente Prior" loading="lazy" width="${o.w}" height="${o.h}">
        </div>
        <div class="c-cap"><h3>${esc(o.titulo)}</h3>${heartBtn(o)}</div>
        <div class="c-sub"><span>Feita à mão${o.pecas ? ` · ${o.pecas} telas` : ''} · ${o.preco ? fmtBRL(o.preco) : 'preço negociável'}</span>
          <span class="c-dots">${o.paleta.slice(0, 4).map(c => `<i style="background:${c}"></i>`).join('')}</span></div>
        <button class="c-neg" type="button">Ver obra e fazer oferta</button>
      </article>`).join('');
  }

  /* ---------- VER NA PAREDE (sala em escala real, unidades em cm) ---------- */
  const WALLS = [['Off-white', '#ece6dc'], ['Branco', '#f7f5f0'], ['Areia', '#d9cbb6'], ['Sálvia', '#a9b3a1'], ['Azul névoa', '#7d8d99'], ['Grafite', '#3f4a52'], ['Terracota', '#b8836a'], ['Noite', '#2a2623']];
  const FLOOR = 262, SOFA_TOP = 80;          // chão no y=262; encosto do sofá a 80 cm
  const MEDIDAS = () => FEATURED_FIRST.filter(o => o.medida);
  let roomId = (OBRAS.find(o => o.medida) || OBRAS[0]).id;
  const sizeOf = o => {
    const d0 = o.medida, m = d0 && String(d0).match(/(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)/i);
    if (m) return { w: parseFloat(m[1].replace(',', '.')), h: parseFloat(m[2].replace(',', '.')), real: true };
    return { w: 60, h: Math.round(60 / (o.w / o.h)), real: false };
  };
  const fmtCm = n => (n >= 100 ? (n / 100).toFixed(2).replace('.', ',') + ' m' : Math.round(n) + ' cm');
  function wall() {
    $('#formObra').innerHTML += OBRAS.map(o => `<option value="${o.id}">${esc(o.titulo)}</option>`).join('');
    $('#roomThumbs').innerHTML = MEDIDAS().map(o => `<button class="wp-t" data-room="${o.id}" title="${esc(o.titulo)}" aria-label="${esc(o.titulo)}"><img src="${thumb(o.id)}" alt="" loading="lazy"></button>`).join('');
    $('#roomThumbs').addEventListener('click', e => { const b = e.target.closest('[data-room]'); if (b) setRoom(b.dataset.room); });
    $('#wallColors').innerHTML = WALLS.map(([n, c], i) => `<button class="wc ${i ? '' : 'on'}" style="background:${c}" data-wall="${c}" data-name="${n}" aria-label="Parede ${n}" title="${n}"></button>`).join('');
    $('#wallColors').addEventListener('click', e => {
      const b = e.target.closest('[data-wall]'); if (!b) return;
      $('#scene').style.setProperty('--wall', b.dataset.wall);
      $('#scene').classList.toggle('dark-wall', ['#3f4a52', '#2a2623'].includes(b.dataset.wall));
      $('#wallName').textContent = b.dataset.name;
      $$('.wc').forEach(x => x.classList.toggle('on', x === b));
    });
    $('#roomDetail').addEventListener('click', () => openViewer(roomId));
    addEventListener('resize', fitScene);
    photoMode(); frameOpts();
    setRoom(roomId);
  }
  function fitScene() {
    const svg = $('#scene'), narrow = svg.parentElement.clientWidth < 560;
    const s = sizeOf(byId[roomId]), need = Math.max(s.w + 70, narrow ? 400 : 520);
    const vw = Math.min(520, need), vx = 260 - vw / 2;
    svg.setAttribute('viewBox', `${vx} 0 ${vw} 300`);
    svg.parentElement.style.aspectRatio = `${vw} / 300`;
  }
  function setRoom(id) {
    roomId = id; const o = byId[id], s = sizeOf(o);
    $$('.wp-t').forEach(b => b.classList.toggle('on', b.dataset.room === id));
    $('#roomInterest').href = negLink(o);
    $('#wpThumb').src = thumb(id); $('#wpTitle').textContent = o.titulo;
    $('#photoArtImg').src = img(id); photo.ratio = s.w / s.h; photo.sw = s.w; photo.sh = s.h; placePhotoArt();
    // altura: centro a 1,50 m do chão, sem encostar no sofá e sem passar do teto
    let c = Math.max(150, SOFA_TOP + 18 + s.h / 2);
    if (c + s.h / 2 > 250) c = Math.max(s.h / 2 + 2, 250 - s.h / 2);
    const x = 260 - s.w / 2, y = FLOOR - (c + s.h / 2);
    const im = $('#artImg'), art = $('#art');
    art.style.opacity = 0;
    setTimeout(() => {
      im.setAttribute('href', img(id));
      [im, $('#artEdge')].forEach(el => { el.setAttribute('x', x); el.setAttribute('y', y); el.setAttribute('width', s.w); el.setAttribute('height', s.h); });
      roomGeom = { x, y, w: s.w, h: s.h }; drawFrame();
      const sp = $('#artSpot'); sp.setAttribute('cy', y + s.h / 2); sp.setAttribute('rx', s.w * .75 + 50); sp.setAttribute('ry', s.h * .8 + 40);
      fitScene();
      art.style.opacity = 1;
    }, 180);
  }

  /* ---------- NA MINHA PAREDE (foto do visitante, fica só no aparelho) ---------- */
  /* molduras: fw = largura da moldura em cm; gap = respiro da caixa flutuante */
  const FRAMES = [
    { id: 'none', nome: 'Sem moldura', fw: 0 },
    { id: 'preta', nome: 'Preta fina', fw: 2.5, svg: 'frPreta', css: 'linear-gradient(135deg,#3a3a3a,#151515 50%,#2a2a2a)' },
    { id: 'branca', nome: 'Branca', fw: 3, svg: 'frBranca', css: 'linear-gradient(135deg,#fbfaf7,#ebe7df 50%,#f6f3ed)' },
    { id: 'carvalho', nome: 'Madeira clara', fw: 4, svg: 'frCarvalho', css: 'repeating-linear-gradient(100deg,rgba(90,60,30,.10) 0 2px,transparent 2px 7px),linear-gradient(110deg,#b48a58,#d9b788 30%,#b98f5c 55%,#d2ad7c 80%,#a97f4e)' },
    { id: 'nogueira', nome: 'Madeira escura', fw: 4.5, svg: 'frNogueira', css: 'repeating-linear-gradient(100deg,rgba(0,0,0,.14) 0 2px,transparent 2px 7px),linear-gradient(110deg,#3b2618,#6b4a32 35%,#45301f 60%,#62432c 85%,#3a2516)' },
    { id: 'dourada', nome: 'Dourada clássica', fw: 7, svg: 'frDourada', css: 'linear-gradient(135deg,#7a5a22,#e9cf7e 22%,#9c7530 45%,#f0d98c 70%,#7a5a22)', ornate: true },
    { id: 'caixa', nome: 'Caixa flutuante', fw: 3, gap: 1.2, svg: 'frCaixa', css: 'linear-gradient(135deg,#2b2b2b,#0e0e0e)' },
  ];
  let frame = FRAMES[0], roomGeom = null;
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, at) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); return e; };
  function drawFrame() {
    const g = $('#frameG'); if (!g || !roomGeom) return;
    g.replaceChildren();
    if (!frame.fw) return;
    const { x, y, w, h } = roomGeom, t = frame.fw + (frame.gap || 0);
    g.append(svgEl('rect', { x: x - t, y: y - t, width: w + 2 * t, height: h + 2 * t, fill: `url(#${frame.svg})`, stroke: '#000', 'stroke-opacity': .3, 'stroke-width': .35 }));
    g.append(svgEl('rect', { x: x - t + .6, y: y - t + .6, width: w + 2 * t - 1.2, height: h + 2 * t - 1.2, fill: 'none', stroke: '#fff', 'stroke-opacity': frame.id === 'branca' ? .9 : .22, 'stroke-width': .5 }));
    if (frame.ornate) {
      g.append(svgEl('rect', { x: x - t + 2.2, y: y - t + 2.2, width: w + 2 * t - 4.4, height: h + 2 * t - 4.4, fill: 'none', stroke: '#6b4e1c', 'stroke-opacity': .55, 'stroke-width': .9, 'stroke-dasharray': '1.2 .8' }));
      g.append(svgEl('rect', { x: x - 1.6, y: y - 1.6, width: w + 3.2, height: h + 3.2, fill: 'none', stroke: '#f3dc92', 'stroke-width': 1.2 }));
    }
    if (frame.gap) g.append(svgEl('rect', { x: x - frame.gap, y: y - frame.gap, width: w + 2 * frame.gap, height: h + 2 * frame.gap, fill: '#0b0b0b' }));
    g.append(svgEl('rect', { x: x - .3, y: y - .3, width: w + .6, height: h + .6, fill: 'none', stroke: '#000', 'stroke-opacity': .45, 'stroke-width': .5 }));
  }
  function setFrame(id) {
    frame = FRAMES.find(f => f.id === id) || FRAMES[0];
    $$('.wf').forEach(b => { const on = b.dataset.frame === frame.id; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    $('#frameName').textContent = frame.nome;
    drawFrame(); placePhotoArt();
  }
  function frameOpts() {
    $('#frameOpts').innerHTML = FRAMES.map(f => `<button class="wf ${f.id === 'none' ? 'on' : ''}" data-frame="${f.id}" aria-pressed="${f.id === 'none'}" title="${f.nome}">
      <span class="wf-prev wf-${f.id}" style="${f.css ? `background:${f.css}` : ''}"><i></i></span><small>${f.nome}</small></button>`).join('');
    $('#frameOpts').addEventListener('click', e => { const b = e.target.closest('[data-frame]'); if (b) setFrame(b.dataset.frame); });
  }
  const photo = { url: null, cx: .5, cy: .4, w: .35, ratio: 1.5, sw: 60, sh: 40, dist: 200, real: true, visCm: 0 };
  /* Escala real: a câmera principal do celular (1x, ~26 mm equivalente, sensor 4:3)
     enxerga ~67° no lado maior e ~53° no lado menor da foto. A largura de parede
     que cabe na foto = 2 · distância · tan(ângulo/2). */
  const FOV_LONG = 67.3, FOV_SHORT = 53.1;
  function visibleWidthCm() {
    const u = $('#userPhoto'); if (!u.naturalWidth) return 0;
    const landscape = u.naturalWidth >= u.naturalHeight;
    const fov = (landscape ? FOV_LONG : FOV_SHORT) * Math.PI / 180;
    return 2 * photo.dist * Math.tan(fov / 2);
  }
  function setDist(cm) {
    photo.dist = cm;
    $$('.dchip').forEach(b => b.classList.toggle('on', +b.dataset.dist === cm));
    $('#distTxt').textContent = cm === 150 ? '1,5 metro' : cm / 100 + ' metros';
    $('#stepsTxt').textContent = cm === 150 ? '2 passos largos' : cm === 200 ? '3 passos largos' : '4 passos largos';
    photo.visCm = visibleWidthCm(); photo.real = true; placePhotoArt();
  }
  function setReal() { photo.real = true; }
  function placePhotoArt() {
    const a = $('#photoArt'); if (!a) return;
    const tt = frame.fw + (frame.gap || 0);
    photo.real = true;
    if (photo.visCm) photo.w = (photo.sw + 2 * tt) / photo.visCm;
    photo.w = Math.min(1.4, Math.max(.03, photo.w));
    if (photo.url) setReal(photo.real);
    a.style.width = photo.w * 100 + '%';
    const t = frame.fw + (frame.gap || 0), tw = photo.sw + 2 * t, th = photo.sh + 2 * t;
    a.style.aspectRatio = `${tw} / ${th}`;
    a.style.padding = `${(t / tw) * photo.w * 100}%`;          // % do padding é relativo à largura da foto
    a.style.background = frame.css || 'none';
    a.dataset.frame = frame.id;
    a.style.setProperty('--gap', frame.gap ? `${(frame.gap / t) * 100}%` : '0');
    a.style.left = photo.cx * 100 + '%';
    a.style.top = photo.cy * 100 + '%';
  }
  function setMode(m) {
    const foto = m === 'foto';
    $$('.wt').forEach(b => { const on = b.dataset.mode === m; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    $('#salaMode').hidden = foto; $('#fotoMode').hidden = !foto;
    $('#wallFld').hidden = foto; $('#sizeFld').hidden = !foto || !photo.url;
    $('.wp-eyebrow').textContent = foto ? 'Na sua parede' : 'Na parede agora';
  }
  function photoMode() {
    $$('.wt').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
    $('#photoInput').addEventListener('change', e => {
      const f = e.target.files && e.target.files[0]; if (!f) return;
      if (!/^image\//.test(f.type)) { toast('Escolha um arquivo de imagem (foto).'); return; }
      if (photo.url) URL.revokeObjectURL(photo.url);
      photo.url = URL.createObjectURL(f);
      const u = $('#userPhoto');
      u.onload = () => {
        $('#photoEmpty').hidden = true; $('#photoStage').hidden = false; $('#photoCap').hidden = false; $('#sizeFld').hidden = false;
        Object.assign(photo, { cx: .5, cy: .42, real: true }); photo.visCm = visibleWidthCm(); placePhotoArt();
      };
      u.onerror = () => toast('Não foi possível abrir essa foto. Tente outra.');
      u.src = photo.url;
      e.target.value = '';
    });
    $$('.dchip').forEach(b => b.addEventListener('click', () => setDist(+b.dataset.dist)));
    // arrastar, redimensionar pelo canto e pinça com dois dedos
    const wrap = $('#photoWrap'), art = $('#photoArt'), pts = new Map();
    let drag = null;
    const rel = e => { const r = wrap.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, r }; };
    art.addEventListener('pointerdown', e => {
      e.preventDefault(); art.setPointerCapture(e.pointerId); pts.set(e.pointerId, e);
      const p = rel(e);
      drag = { mode: 'move', dx: p.x - photo.cx, dy: p.y - photo.cy };
      art.classList.add('active');
    });
    art.addEventListener('pointermove', e => {
      if (!drag || !pts.has(e.pointerId)) return;
      pts.set(e.pointerId, e);
      const p = rel(e);
      if (drag.mode === 'move') { photo.cx = Math.min(1, Math.max(0, p.x - drag.dx)); photo.cy = Math.min(1, Math.max(0, p.y - drag.dy)); }
      placePhotoArt();
    });
    const up = e => { pts.delete(e.pointerId); if (!pts.size) { drag = null; art.classList.remove('active'); } };
    art.addEventListener('pointerup', up); art.addEventListener('pointercancel', up);
    art.addEventListener('keydown', e => {
      const k = { ArrowLeft: [-.01, 0], ArrowRight: [.01, 0], ArrowUp: [0, -.01], ArrowDown: [0, .01] }[e.key];
      if (k) { e.preventDefault(); photo.cx += k[0]; photo.cy += k[1]; placePhotoArt(); }
    });
    art.tabIndex = 0;
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
    $('#vTitle').textContent = o.titulo;
    $('#vMeta').textContent = `Vicente Prior · ${o.formato[0].toUpperCase() + o.formato.slice(1)} · ${o.cores.map(c => COLORS[c].label).join(', ')}`;
    $('#vDesc').textContent = (o.descricao ? o.descricao + ' ' : '') + DESC;
    $('#vWall').hidden = !o.medida;
    $('#vDim').textContent = (() => { const m = o.medida && String(o.medida).match(/(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)/i); return m ? `${m[1]} × ${m[2]} cm (largura × altura)` : 'Sob consulta'; })();
    $('#vPecasRow').hidden = !o.pecas; $('#vPecas').textContent = o.pecas ? `${o.pecas} telas que formam uma só obra` : '';
    $('#vOffer').value = '';
    $('#vPalette').innerHTML = o.paleta.map(c => `<i style="background:${c}" title="${c}"></i>`).join('');
    $('#vPrice').innerHTML = o.preco ? `${fmtBRL(o.preco)}<small>Valor negociável direto com o artista</small>` : `Preço negociável<small>Todas as obras têm preço negociado direto com o artista</small>`;
    $('#vBuy').href = negLink(o);
    $('#vAsk').href = askLink(o);
    setViewerHeart();
    $('#vLens').style.backgroundImage = `url(${img(o.id)})`;
    if (v.hidden) { v.hidden = false; document.body.style.overflow = 'hidden'; $('#vClose').focus(); }
    if (push) history.replaceState(null, '', `#obra-${o.id}`);
  }
  function setViewerHeart() {
    const on = isWished(current.id);
    $('#vHeart').setAttribute('aria-pressed', on);
    $('#vHeartLabel').textContent = on ? 'Nas favoritas' : 'Favoritar';
  }
  function setFav(on) {
    state.fav = on;
    const c = $('#favFilter'); c.classList.toggle('on', on); c.setAttribute('aria-pressed', on);
    renderGrid();
  }
  function closeViewer() {
    $('#viewer').hidden = true; document.body.style.overflow = ''; current = null;
    history.replaceState(null, '', location.pathname + location.search);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  function step(d) { const L = FEATURED_FIRST, i = L.indexOf(current); openViewer(L[(i + d + L.length) % L.length].id); }
  function viewer() {
    $('#vClose').addEventListener('click', closeViewer);
    $('#vOffer').addEventListener('input', e => { const v = e.target.value.replace(/[^\d.,]/g, ''); e.target.value = v; $('#vBuy').href = negLink(current, v); });
    $('#vDeal').addEventListener('submit', e => { e.preventDefault(); $('#vBuy').click(); });
    $('#formOffer').addEventListener('input', e => { e.target.value = e.target.value.replace(/[^\d.,]/g, ''); });
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
    $('#wishShow').addEventListener('click', () => { closeWish(); setFav(true); $('#colecao').scrollIntoView({ behavior: 'smooth' }); });
    $('#wishClose').addEventListener('click', closeWish);
    $('#scrim').addEventListener('click', closeWish);

    // menu mobile
    const panel = $('#menuPanel'), mb = $('#menuBtn'), top = $('#topbar');
    const setMenu = open => {
      panel.hidden = !open; mb.setAttribute('aria-expanded', open);
      mb.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); $('.mb-label', mb).textContent = open ? 'Fechar' : 'Menu';
      top.classList.toggle('menu-open', open); document.body.style.overflow = open ? 'hidden' : '';
    };
    mb.addEventListener('click', () => setMenu(panel.hidden));
    $$('a', panel).forEach(a => a.addEventListener('click', () => setMenu(false)));
    $('#menuFav').addEventListener('click', () => { setMenu(false); openWish(); });
    $('#menuWa').href = wa('Olá, Vicente! Vim pelo site e tenho uma dúvida sobre as suas obras.');
    addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) setMenu(false); });
    addEventListener('resize', () => { if (innerWidth > 900 && !panel.hidden) setMenu(false); });

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
    $('#waMain').href = wa('Olá, Vicente! Vim pelo site e tenho uma dúvida sobre as suas obras.');
    $('#contactForm').addEventListener('submit', e => {
      e.preventDefault();
      const f = new FormData(e.target), o = byId[f.get('obra')];
      const offer = (f.get('oferta') || '').trim();
      const msg = `Olá! Sou ${f.get('nome')} (${f.get('contato')}).` + (o ? ` Gostaria de negociar o preço da obra "${o.titulo}".` : ' Gostaria de negociar o preço de uma obra.') + (offer ? ` Minha oferta é de R$ ${offer}.` : '') + (f.get('msg') ? `\n${f.get('msg')}` : '');
      const href = wa(msg), win = window.open(href, '_blank'); if (win) win.opener = null;
      if (!win) { const a = $('#formSend'); a.href = href; a.hidden = false; a.focus(); toast('Mensagem pronta: toque em “Abrir no WhatsApp”'); }
    });
    $('#year').textContent = new Date().getFullYear();

    // link direto para obra (#obra-07)
    const openFromHash = () => { const m = location.hash.match(/^#obra-(\d{2})$/); if (m && byId[m[1]]) openViewer(m[1], false); };
    addEventListener('hashchange', openFromHash); openFromHash();
  }

  /* ---------- abertura ---------- */
  function intro() {
    const el = $('#intro'); if (!el) return;
    let seen = false;
    try { seen = sessionStorage.getItem('vp-intro') === '1'; } catch (e) {}
    if (seen || location.hash.startsWith('#obra-') || matchMedia('(prefers-reduced-motion: reduce)').matches) { el.remove(); return; }
    document.body.classList.add('intro-on');
    let done = false;
    const end = () => {
      if (done) return; done = true;
      try { sessionStorage.setItem('vp-intro', '1'); } catch (e) {}
      el.classList.add('out'); document.body.classList.remove('intro-on');
      setTimeout(() => el.remove(), 900);
    };
    el.addEventListener('click', end);
    addEventListener('keydown', end, { once: true });
    setTimeout(end, 3400);
  }

  intro(); hero(); podium(); filters(); renderGrid(); wall(); viewer(); global(); syncWish();
})();

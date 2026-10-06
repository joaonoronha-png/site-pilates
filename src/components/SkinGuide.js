import { conditions, skinGuide } from '../data/site.js';
import { esc } from '../lib/html.js';

/** "Cuide da sua pele" — conteúdo educativo geral. */
export function renderSkinGuide() {
  return `<section class="section skin-guide" id="guia" aria-labelledby="guide-title">
  <div class="container">
    <div class="section-head split">
      <div>
        <p class="eyebrow reveal">Guia da pele</p>
        <h2 id="guide-title" class="h2 reveal">Cuide da sua pele <em>todos os dias.</em></h2>
      </div>
      <p class="section-intro reveal">Orientações gerais de saúde da pele, amplamente divulgadas em campanhas de prevenção. Conteúdo educativo — não substitui a avaliação de um dermatologista.</p>
    </div>
    <div class="guide-grid">
      ${skinGuide
        .map(
          (g) => `<article class="guide-card guide-${g.id} reveal">
          <p class="guide-kicker">${esc(g.kicker)}</p>
          <h3 class="h3">${esc(g.title)}</h3>
          <p class="guide-intro">${esc(g.intro)}</p>
          <ol class="guide-list">
            ${g.items.map(([k, t, d]) => `<li><span class="guide-k">${esc(k)}</span><span><strong>${esc(t)}</strong> — ${esc(d)}</span></li>`).join('')}
          </ol>
        </article>`,
        )
        .join('')}
    </div>
  </div>
</section>`;
}

/** Condições avaliadas pela dermatologia, com filtro por área. */
export function renderConditions({ dark = false } = {}) {
  const areas = [...new Set(conditions.map((c) => c.area))];
  return `<div class="conditions${dark ? ' is-dark' : ''}" data-conditions>
    <div class="conditions-head">
      <h3 class="h3">O que a dermatologia avalia</h3>
      <div class="conditions-filter" role="group" aria-label="Filtrar por área">
        <button type="button" class="chip is-active" data-cond="" aria-pressed="true">Todas</button>
        ${areas.map((a) => `<button type="button" class="chip" data-cond="${esc(a)}" aria-pressed="false">${esc(a)}</button>`).join('')}
      </div>
    </div>
    <ul class="conditions-list">
      ${conditions.map((c) => `<li class="condition" data-area="${esc(c.area)}"><span class="condition-area">${esc(c.area)}</span><strong>${esc(c.name)}</strong><span>${esc(c.text)}</span></li>`).join('')}
    </ul>
    <p class="note">Lista informativa sobre o campo da especialidade. A indicação de avaliação e tratamento é sempre feita em consulta — confirme com a equipe os atendimentos disponíveis na BCM.</p>
  </div>`;
}

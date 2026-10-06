import { faqCategories, faqs } from '../data/faq.js';
import { esc, icon } from '../lib/html.js';

const INITIAL = 8;

export const renderFaqItem = (f, i = 0) => `<div class="faq-item" id="faq-${f.id}" data-faq data-category="${esc(f.category)}"${i >= INITIAL ? ' data-faq-extra' : ''}>
  <h3 class="faq-q">
    <button type="button" aria-expanded="false" aria-controls="faq-a-${f.id}" id="faq-b-${f.id}">
      <span>${esc(f.q)}</span><span class="faq-icon" aria-hidden="true">${icon('plus')}</span>
    </button>
  </h3>
  <div class="faq-a" id="faq-a-${f.id}" role="region" aria-labelledby="faq-b-${f.id}">
    <div><p>${esc(f.a)}</p></div>
  </div>
</div>`;

/**
 * @param {{ categories?: string[], title?: string, compact?: boolean }} opts
 */
export function renderFAQ({ categories = faqCategories, title = 'Perguntas frequentes', compact = false } = {}) {
  const items = faqs.filter((f) => categories.includes(f.category));
  const cats = categories.filter((c) => items.some((f) => f.category === c));
  return `<section class="section faq" id="faq" aria-labelledby="faq-title">
  <div class="container faq-grid">
    <div class="faq-head">
      <p class="eyebrow reveal">FAQ</p>
      <h2 id="faq-title" class="h2 reveal">${esc(title)}</h2>
      <p class="section-intro reveal">${items.length} respostas baseadas nas informações oficiais da BCM.</p>
      <a class="faq-ask reveal" href="#assistente" data-assistant-open="">
        <span>Não encontrou sua resposta? <strong>Pergunte ao Assistente BCM</strong></span>${icon('arrow', 'btn-arrow')}
      </a>
    </div>
    <div class="faq-body" data-faq-root>
      <div class="faq-tools">
        <label class="faq-search">
          ${icon('search')}
          <span class="visually-hidden">Buscar nas perguntas frequentes</span>
          <input type="search" placeholder="Buscar nas perguntas…" data-faq-search autocomplete="off">
        </label>
        ${
          compact
            ? ''
            : `<div class="faq-cats" role="group" aria-label="Filtrar por categoria">
          <button type="button" class="chip is-active" data-faq-cat="" aria-pressed="true">Todas</button>
          ${cats.map((c) => `<button type="button" class="chip" data-faq-cat="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('')}
        </div>`
        }
      </div>
      <div class="faq-list">${items.map(renderFaqItem).join('')}</div>
      ${items.length > INITIAL ? `<button type="button" class="btn btn-ghost faq-more" data-faq-more>Ver todas as ${items.length} perguntas</button>` : ''}
      <p class="faq-empty" data-faq-empty hidden>Nenhuma pergunta encontrada. <button type="button" class="link" data-assistant-open="" data-faq-ask-query>Perguntar ao Assistente BCM →</button></p>
    </div>
  </div>
</section>`;
}

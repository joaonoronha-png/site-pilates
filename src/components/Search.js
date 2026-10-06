import { icon } from '../lib/html.js';

const EXAMPLES = [
  'Quais especialidades vocês oferecem?',
  'Quero conhecer os procedimentos',
  'Quero encontrar um médico',
  'Como faço para agendar?',
  'Onde fica a BCM?',
];

export function renderSearch() {
  return `<section class="section search-section" id="ajuda" aria-labelledby="ajuda-title">
  <div class="container narrow">
    <p class="eyebrow reveal">Busca inteligente</p>
    <h2 id="ajuda-title" class="h2 reveal">Como podemos ajudar?</h2>
    <form class="smart-search reveal" role="search" data-smart-search action="#faq">
      <label class="visually-hidden" for="smart-search-input">Buscar no site</label>
      ${icon('search', 'smart-search-icon')}
      <input id="smart-search-input" type="search" name="q" autocomplete="off" spellcheck="false"
        placeholder="Digite uma especialidade, procedimento ou dúvida…"
        aria-describedby="smart-search-hint" aria-controls="smart-search-results">
      <kbd class="smart-search-kbd" aria-hidden="true">/</kbd>
    </form>
    <p id="smart-search-hint" class="visually-hidden">Os resultados aparecem enquanto você digita.</p>
    <div class="smart-search-results" id="smart-search-results" aria-live="polite"></div>
    <ul class="chips reveal" aria-label="Exemplos de perguntas">
      ${EXAMPLES.map((e) => `<li><button type="button" class="chip" data-search-example>${e}</button></li>`).join('')}
    </ul>
  </div>
</section>`;
}

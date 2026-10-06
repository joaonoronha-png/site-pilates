import { clinic, imageCredit, images } from '../data/site.js';
import { esc, icon, picture } from '../lib/html.js';

const ITEMS = ['interior', 'exame', 'calma', 'consulta', 'ritual', 'cuidado'];

export function renderGallery() {
  return `<section class="section gallery-section" id="estrutura" aria-labelledby="gallery-title">
  <div class="container">
    <div class="section-head split">
      <div>
        <p class="eyebrow reveal">Estrutura</p>
        <h2 id="gallery-title" class="h2 reveal">Um espaço para o <em>cuidado.</em></h2>
      </div>
      <div class="structure-facts reveal">
        <p><strong>${esc(clinic.address.complement)}</strong> · ${esc(clinic.address.street)}, ${esc(clinic.address.district)}.</p>
        <p>Registrada para atividade médica ambulatorial com recursos para realização de procedimentos cirúrgicos.</p>
      </div>
    </div>
    <div class="gallery" data-gallery>
      ${ITEMS.map(
        (key, i) => `<button type="button" class="gallery-item g-${i + 1} reveal-clip" data-gallery-item="${i}" data-src="/img/${key}-1600.webp" data-alt="${esc(images[key].alt)}" aria-label="Ampliar imagem: ${esc(images[key].alt)}">
          ${picture(key, { sizes: i === 0 ? '(min-width: 960px) 60vw, 100vw' : '(min-width: 960px) 30vw, 50vw' })}
          <span class="gallery-zoom" aria-hidden="true">${icon('plus')}</span>
        </button>`,
      ).join('')}
    </div>
    <p class="note gallery-note">${esc(imageCredit)}</p>
  </div>
  <div class="lightbox" data-lightbox role="dialog" aria-modal="true" aria-label="Galeria ampliada" hidden>
    <button class="lightbox-close" type="button" data-lightbox-close aria-label="Fechar">${icon('close')}</button>
    <button class="lightbox-nav prev" type="button" data-lightbox-prev aria-label="Imagem anterior">${icon('chevronLeft')}</button>
    <figure class="lightbox-figure"><img data-lightbox-img alt=""><figcaption data-lightbox-caption></figcaption></figure>
    <button class="lightbox-nav next" type="button" data-lightbox-next aria-label="Próxima imagem">${icon('chevronRight')}</button>
  </div>
</section>`;
}

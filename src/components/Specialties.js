import { dermatologyAreas, specialties } from '../data/site.js';
import { esc, icon, picture } from '../lib/html.js';

/**
 * WOW 02 — explorador da dermatologia. A única especialidade confirmada é
 * Dermatologia; as "camadas" mostram o escopo geral da especialidade.
 */
export function renderSpecialties() {
  const spec = specialties[0];
  return `<section class="section specialties theme-dark" id="especialidades" aria-labelledby="spec-title">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow reveal">Especialidades</p>
      <h2 id="spec-title" class="h2 reveal">${esc(spec.name)}, <em>em todas as camadas.</em></h2>
      <p class="section-intro reveal">${esc(spec.description)}</p>
    </div>
    <div class="explorer reveal" data-explorer>
      <div class="explorer-tabs" role="tablist" aria-label="Áreas da dermatologia">
        ${dermatologyAreas
          .map(
            (a, i) => `<button class="explorer-tab" role="tab" id="tab-${a.id}" aria-controls="panel-${a.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-area="${a.id}">
            <span class="explorer-n">${a.index}</span><span class="explorer-label">${esc(a.label)}</span>${icon('arrow', 'explorer-arrow')}
          </button>`,
          )
          .join('')}
      </div>
      <div class="explorer-stage">
        ${dermatologyAreas
          .map(
            (a, i) => `<div class="explorer-panel${i === 0 ? ' is-active' : ''}" role="tabpanel" id="panel-${a.id}" aria-labelledby="tab-${a.id}"${i === 0 ? '' : ' hidden'}>
            <div class="explorer-media">${picture(a.image, { sizes: '(min-width: 960px) 45vw, 100vw' })}</div>
            <div class="explorer-text glass-dark">
              <h3 class="h4">${esc(a.title)}</h3>
              <p>${esc(a.text)}</p>
            </div>
          </div>`,
          )
          .join('')}
        <span class="img-note">Imagens ilustrativas</span>
      </div>
    </div>
    <div class="spec-footer reveal">
      <p class="note">Conteúdo informativo sobre o escopo da especialidade. Confirme com a equipe os atendimentos disponíveis na BCM.</p>
      <div class="spec-ctas">
        <a class="btn btn-light magnetic" href="#contato" data-assistant-open="agendar"><span>Agendar consulta</span>${icon('arrow', 'btn-arrow')}</a>
        <a class="btn btn-link btn-link-light" href="/${spec.slug}/"><span>Ver a especialidade</span>${icon('arrow', 'btn-arrow')}</a>
      </div>
    </div>
  </div>
</section>`;
}

import { differentials, journey } from '../data/site.js';
import { esc } from '../lib/html.js';

export function renderDifferentials() {
  return `<section class="section differentials" id="diferenciais" aria-labelledby="diff-title">
  <div class="container diff-grid">
    <div class="diff-head">
      <p class="eyebrow reveal">Diferenciais</p>
      <h2 id="diff-title" class="h2 reveal">Por que escolher <em>a BCM?</em></h2>
      <p class="section-intro reveal">Apenas o que pode ser comprovado.</p>
    </div>
    <ol class="diff-list">
      ${differentials
        .map(
          (d) => `<li class="diff-item reveal">
          <span class="diff-n">${d.n}</span>
          <div><h3 class="h3">${esc(d.title)}</h3><p>${esc(d.text)}</p></div>
        </li>`,
        )
        .join('')}
    </ol>
  </div>
</section>`;
}

/** Jornada do paciente — linha que se preenche com o scroll. */
export function renderExperience() {
  return `<section class="section experience theme-sand" id="experiencia" aria-labelledby="exp-title">
  <div class="container">
    <div class="section-head center">
      <p class="eyebrow reveal">Experiência do paciente</p>
      <h2 id="exp-title" class="h2 reveal">Do primeiro contato <em>ao acompanhamento.</em></h2>
    </div>
    <div class="timeline-wrap" data-timeline>
    <span class="timeline-track" aria-hidden="true"><span class="timeline-fill" data-timeline-fill></span></span>
    <ol class="timeline">
      ${journey
        .map(
          (j) => `<li class="timeline-step reveal">
          <span class="timeline-dot" aria-hidden="true"></span>
          <span class="timeline-n">${j.n}</span>
          <h3 class="h3">${esc(j.title)}</h3>
          <p>${esc(j.text)}</p>
        </li>`,
        )
        .join('')}
    </ol>
    </div>
  </div>
</section>`;
}

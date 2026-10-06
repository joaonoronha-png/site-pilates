import { services, whatsappLink } from '../data/site.js';
import { esc, icon, picture } from '../lib/html.js';

export const renderServiceCard = (s) => `<article class="service reveal">
  <div class="service-media img-zoom">${picture(s.image, { sizes: '(min-width: 960px) 30vw, 100vw' })}</div>
  <div class="service-body">
    <p class="service-cat">${esc(s.category)}</p>
    <h3 class="h3">${esc(s.title)}</h3>
    <p>${esc(s.description)}</p>
    <p class="service-ind"><strong>Indicação geral.</strong> ${esc(s.indication)}</p>
    <a class="btn btn-link" href="${whatsappLink(`Olá! Gostaria de informações sobre: ${s.title}.`)}" target="_blank" rel="noopener"><span>${esc(s.cta)}</span>${icon('arrow', 'btn-arrow')}</a>
  </div>
</article>`;

export function renderServices() {
  return `<section class="section services" id="servicos" aria-labelledby="services-title">
  <div class="container">
    <div class="section-head split">
      <div>
        <p class="eyebrow reveal">Serviços e procedimentos</p>
        <h2 id="services-title" class="h2 reveal">Do diagnóstico ao <em>acompanhamento.</em></h2>
      </div>
      <p class="section-intro reveal">Mostramos aqui apenas o que está confirmado nas fontes oficiais. Nenhum procedimento é indicado sem avaliação médica, e nenhum resultado é garantido.</p>
    </div>
    <div class="services-list">${services.map(renderServiceCard).join('')}</div>
  </div>
</section>`;
}

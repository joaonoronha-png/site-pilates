import { dermatologyAreas, doctors, services } from '../data/site.js';
import { esc, icon, picture } from '../lib/html.js';
import { renderDoctorCard } from './Doctors.js';
import { renderServiceCard } from './Services.js';
import { renderFAQ } from './FAQ.js';

export function renderSpecialtyPage(spec) {
  return `<main id="conteudo" class="page specialty-page">
  <section class="page-hero">
    <div class="container page-hero-grid">
      <div>
        <nav class="breadcrumb" aria-label="Você está em"><ol><li><a href="/">Início</a></li><li><a href="/#especialidades">Especialidades</a></li><li aria-current="page">${esc(spec.name)}</li></ol></nav>
        <p class="eyebrow reveal">Especialidade</p>
        <h1 class="display reveal">${esc(spec.name)}</h1>
        <p class="lead reveal">${esc(spec.description)}</p>
        <div class="hero-ctas reveal">
          <a class="btn btn-primary btn-lg magnetic" href="/#contato" data-assistant-open="agendar"><span>Agendar consulta</span>${icon('arrow', 'btn-arrow')}</a>
          <a class="btn btn-link" href="#profissionais"><span>Ver profissionais</span>${icon('arrowDown', 'btn-arrow')}</a>
        </div>
      </div>
      <figure class="page-hero-media reveal-clip">${picture(spec.image, { priority: true, sizes: '(min-width: 960px) 45vw, 100vw' })}<figcaption class="img-note">Imagem ilustrativa</figcaption></figure>
    </div>
  </section>

  <section class="section" aria-labelledby="areas-title">
    <div class="container">
      <div class="section-head"><p class="eyebrow reveal">Escopo da especialidade</p><h2 id="areas-title" class="h2 reveal">O que a dermatologia <em>cuida.</em></h2>
      <p class="section-intro reveal">Conteúdo informativo e geral. A indicação de qualquer avaliação ou tratamento é feita em consulta.</p></div>
      <div class="areas-grid">
        ${dermatologyAreas.map((a) => `<article class="area-card reveal"><span class="area-n">${a.index}</span><h3 class="h3">${esc(a.label)}</h3><p>${esc(a.text)}</p></article>`).join('')}
      </div>
    </div>
  </section>

  <section class="section services" aria-labelledby="sp-services">
    <div class="container">
      <div class="section-head"><p class="eyebrow reveal">Serviços</p><h2 id="sp-services" class="h2 reveal">Serviços <em>confirmados.</em></h2></div>
      <div class="services-list">${services.map(renderServiceCard).join('')}</div>
    </div>
  </section>

  <section class="section doctors" id="profissionais" aria-labelledby="sp-team">
    <div class="container">
      <div class="section-head"><p class="eyebrow reveal">Profissionais</p><h2 id="sp-team" class="h2 reveal">Dermatologistas da <em>BCM.</em></h2></div>
      <div class="doctor-grid">${doctors.filter((d) => d.specialty === spec.name).map(renderDoctorCard).join('')}</div>
    </div>
  </section>

  ${renderFAQ({ categories: ['Especialidades', 'Consultas', 'Procedimentos', 'Preparação'], title: 'Dúvidas sobre dermatologia', compact: true })}
</main>`;
}

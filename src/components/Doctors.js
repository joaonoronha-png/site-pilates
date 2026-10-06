import { doctors, specialties } from '../data/site.js';
import { esc, icon } from '../lib/html.js';

export const doctorPortrait = (d, cls = '') =>
  d.photo
    ? `<img class="portrait-round ${cls}" src="${d.photo}" width="385" height="385" alt="Retrato de ${esc(d.name)}" loading="lazy" decoding="async">`
    : `<span class="monogram ${cls}" role="img" aria-label="Monograma de ${esc(d.name)} (foto não disponível)"><span>${esc(d.initials)}</span></span>`;

export const renderDoctorCard = (d) => `<article class="doctor-card reveal" data-doctor data-specialty="${esc(d.specialty)}" data-name="${esc(`${d.name} ${d.fullName}`)}">
  <a class="doctor-link" href="/equipe/${d.slug}/">
    <div class="doctor-photo tilt-card">${doctorPortrait(d)}</div>
    <div class="doctor-body">
      <p class="doctor-role">${esc(d.role)}</p>
      <h3 class="h3 doctor-name">${esc(d.name)}</h3>
      <p class="doctor-focus">${esc(d.focus)}</p>
      <ul class="doctor-tags" aria-label="Áreas de destaque">${d.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      <p class="doctor-reg">${d.registrations.map(esc).join(' · ')}</p>
      <p class="doctor-summary">${esc(d.summary)}</p>
      <span class="btn btn-link"><span>Conhecer profissional</span>${icon('arrow', 'btn-arrow')}</span>
    </div>
  </a>
</article>`;

export function renderDoctors() {
  return `<section class="section doctors" id="equipe" aria-labelledby="team-title">
  <div class="container">
    <div class="section-head split">
      <div>
        <p class="eyebrow reveal">Equipe</p>
        <h2 id="team-title" class="h2 reveal">Conheça nossa <em>equipe.</em></h2>
      </div>
      <p class="section-intro reveal">Três dermatologistas especialistas pela SBD, sócias da BCM, com atuação docente no Instituto de Dermatologia Prof. Rubem David Azulay, da Santa Casa do Rio. Dados profissionais conforme fontes públicas oficiais.</p>
    </div>
    <div class="finder reveal" data-finder>
      <p class="finder-title">Encontre um especialista</p>
      <div class="finder-controls">
        <label class="field">
          <span class="field-label">Especialidade</span>
          <select data-finder-specialty>
            <option value="">Todas</option>
            ${specialties.map((s) => `<option value="${esc(s.name)}">${esc(s.name)}</option>`).join('')}
          </select>
        </label>
        <label class="field field-grow">
          <span class="field-label">Nome</span>
          <input type="search" placeholder="Buscar pelo nome" data-finder-name autocomplete="off">
        </label>
      </div>
      <p class="finder-count" data-finder-count aria-live="polite">${doctors.length} profissionais</p>
    </div>
    <div class="doctor-grid">${doctors.map(renderDoctorCard).join('')}</div>
    <p class="finder-empty" data-finder-empty hidden>Nenhum profissional encontrado com esses filtros.</p>
  </div>
</section>`;
}

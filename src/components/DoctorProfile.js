import { clinic, SOURCES, whatsappLink, telLink, addressLine } from '../data/site.js';
import { esc, icon } from '../lib/html.js';
import { doctorPortrait } from './Doctors.js';

const list = (items) => `<ul class="profile-list">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;

export function renderDoctorProfile(d) {
  const bcm = d.atBcmConfirmed
    ? `Atende na ${esc(clinic.name)} — ${esc(addressLine())}.`
    : `Consta como sócia da ${esc(clinic.name)} no registro público da empresa. Para saber a agenda desta profissional na unidade, fale com a equipe.`;
  return `<main id="conteudo" class="page profile">
  <div class="container">
    <nav class="breadcrumb" aria-label="Você está em">
      <ol><li><a href="/">Início</a></li><li><a href="/#equipe">Equipe</a></li><li aria-current="page">${esc(d.name)}</li></ol>
    </nav>
    <div class="profile-grid">
      <div class="profile-photo reveal-clip">${doctorPortrait(d)}</div>
      <div class="profile-main">
        <p class="eyebrow reveal">${esc(d.role)}</p>
        <h1 class="h1 reveal">${esc(d.name)}</h1>
        <p class="profile-fullname reveal">${esc(d.fullName)} · ${esc(d.focus)}</p>
        <ul class="badges reveal" aria-label="Registros profissionais">${d.registrations.map((r) => `<li class="badge">${esc(r)}</li>`).join('')}</ul>
        <p class="lead reveal">${esc(d.summary)}</p>
        <div class="profile-ctas reveal">
          <a class="btn btn-primary btn-lg magnetic" href="${whatsappLink(`Olá! Gostaria de agendar uma consulta com a ${d.name} na BCM Dermatologia.`)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>Agendar com a ${esc(d.name)}</span></a>
          <a class="btn btn-ghost" href="${telLink}">${icon('phone')}<span>${esc(clinic.phone.display)}</span></a>
        </div>
      </div>
    </div>

    <div class="profile-sections">
      <section class="profile-block reveal" aria-labelledby="p-areas"><h2 id="p-areas" class="h4">Especialidade e áreas de destaque</h2>${list([d.specialty, ...d.highlights])}</section>
      ${d.academic.length ? `<section class="profile-block reveal" aria-labelledby="p-acad"><h2 id="p-acad" class="h4">Ensino e pesquisa</h2>${list(d.academic)}</section>` : ''}
      ${d.education.length ? `<section class="profile-block reveal" aria-labelledby="p-edu"><h2 id="p-edu" class="h4">Formação</h2>${list(d.education)}</section>` : ''}
      ${d.memberships.length ? `<section class="profile-block reveal" aria-labelledby="p-mem"><h2 id="p-mem" class="h4">Associações e credenciais</h2>${list(d.memberships)}</section>` : ''}
      <section class="profile-block reveal" aria-labelledby="p-bcm"><h2 id="p-bcm" class="h4">Atendimento na BCM</h2><p>${bcm}</p>${d.otherLocations.length ? list(d.otherLocations) : ''}</section>
      <section class="profile-block reveal" aria-labelledby="p-services"><h2 id="p-services" class="h4">Serviços</h2><p>Consulta dermatológica. Procedimentos dependem de avaliação médica — confirme a disponibilidade com a equipe.</p></section>
      ${
        d.instagram || d.website
          ? `<section class="profile-block reveal" aria-labelledby="p-links"><h2 id="p-links" class="h4">Canais da profissional</h2><ul class="profile-list">
          ${d.website ? `<li><a href="${d.website}" target="_blank" rel="noopener">Site oficial ${icon('external')}</a></li>` : ''}
          ${d.instagram ? `<li><a href="https://www.instagram.com/${d.instagram}/" target="_blank" rel="noopener">Instagram @${esc(d.instagram)} ${icon('external')}</a></li>` : ''}
        </ul></section>`
          : ''
      }
      <section class="profile-block profile-sources reveal" aria-labelledby="p-src"><h2 id="p-src" class="h4">Fontes das informações</h2><ul class="profile-list">
        ${d.sources.map((k) => `<li><a href="${SOURCES[k].url}" target="_blank" rel="noopener">${esc(SOURCES[k].label)}</a></li>`).join('')}
      </ul><p class="note">Informações profissionais reproduzidas de fontes públicas. Encontrou algo desatualizado? Avise a equipe.</p></section>
    </div>
  </div>
</main>`;
}

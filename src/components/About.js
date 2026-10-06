import { clinic, doctors } from '../data/site.js';
import { esc, picture } from '../lib/html.js';

export function renderAbout() {
  const facts = [
    ['Especialidade', 'Dermatologia'],
    ['Equipe', `${doctors.length} dermatologistas sócias com RQE`],
    ['Endereço', `${clinic.address.street} · ${clinic.address.district}`],
    ['Horário', 'Seg a sex, 8h–20h · terças até 22h'],
  ];
  return `<section class="section about" id="a-bcm" aria-labelledby="about-title">
  <div class="container about-grid">
    <div class="about-year reveal" aria-hidden="true"><span class="about-year-label">Desde</span><span class="about-year-n" data-count="${clinic.foundedYear}">${clinic.foundedYear}</span></div>
    <div class="about-copy">
      <p class="eyebrow reveal">A BCM</p>
      <h2 id="about-title" class="h2 reveal">Uma clínica dedicada a uma única especialidade: <em>a sua pele.</em></h2>
      <p class="lead reveal">A ${esc(clinic.name)} reúne dermatologistas na Barra da Tijuca, no Rio de Janeiro. Desde 2018, a clínica concentra sua atuação na dermatologia — o cuidado médico da pele, dos cabelos, das unhas e das mucosas.</p>
      <dl class="facts reveal-stagger">
        ${facts.map(([k, v]) => `<div class="fact"><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}
      </dl>
    </div>
    <figure class="about-media reveal-clip">
      <div data-parallax="0.06">${picture('interior', { sizes: '(min-width: 960px) 40vw, 100vw' })}</div>
      <figcaption class="img-note">Imagem ilustrativa</figcaption>
    </figure>
  </div>
</section>`;
}

import { clinic } from '../data/site.js';
import { esc, icon, picture } from '../lib/html.js';

export function renderHero() {
  return `<section class="hero" id="inicio" aria-labelledby="hero-title">
  <div class="hero-bg" aria-hidden="true"><div class="hero-orb" data-cursor-orb></div></div>
  <div class="container hero-grid">
    <div class="hero-copy">
      <p class="eyebrow hero-in" style="--d:0">${esc(clinic.name)} · ${esc(clinic.address.district)}</p>
      <h1 id="hero-title" class="hero-title">
        <span class="line"><span class="hero-in" style="--d:1">Dermatologia especializada.</span></span>
        <span class="line"><em class="hero-in" style="--d:2">Cuidado em cada detalhe.</em></span>
      </h1>
      <p class="hero-sub hero-in" style="--d:3">Dermatologistas especialistas pela SBD, com atuação docente no Instituto de Dermatologia Prof. Azulay, em uma clínica dedicada à pele, aos cabelos e às unhas — na Av. das Américas.</p>
      <div class="hero-ctas hero-in" style="--d:4">
        <a class="btn btn-primary btn-lg magnetic" href="#contato" data-assistant-open="agendar"><span>Agende seu atendimento</span>${icon('arrow', 'btn-arrow')}</a>
        <a class="btn btn-link" href="#a-bcm"><span>Conheça a BCM</span>${icon('arrowDown', 'btn-arrow')}</a>
      </div>
      <ul class="hero-tags hero-in" style="--d:5" aria-label="Atributos">
        <li>Especialização</li><li>Dermatologia</li><li>Barra da Tijuca</li>
      </ul>
    </div>
    <div class="hero-visual hero-in" style="--d:2">
      <div class="hero-frame" data-tilt>
        <div class="hero-media" data-parallax="0.08">${picture('hero', { priority: true, sizes: '(min-width: 960px) 46vw, 100vw' })}</div>
        <span class="img-note">Imagem ilustrativa</span>
      </div>
      <div class="hero-status glass" data-open-status aria-live="polite">
        <span class="status-dot" aria-hidden="true"></span>
        <span class="status-text"><strong>Seg a sex · 8h–20h</strong><span>Terças até 22h</span></span>
      </div>
      <svg class="hero-layers" viewBox="0 0 200 120" aria-hidden="true" focusable="false">
        <path d="M5 40 C 55 15, 145 15, 195 40"/><path d="M5 70 C 55 45, 145 45, 195 70"/><path d="M25 100 C 70 80, 130 80, 175 100"/>
      </svg>
    </div>
  </div>
  <a class="scroll-cue" href="#ajuda" aria-label="Rolar para a busca"><span></span></a>
</section>`;
}

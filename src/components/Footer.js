import { clinic, nav, specialties, telLink, whatsappLink, addressLine } from '../data/site.js';
import { esc, icon, logo, picture } from '../lib/html.js';

export function renderCTA({ title = 'Seu cuidado começa com uma escolha.', text = 'Fale com a equipe da BCM e agende sua consulta com uma dermatologista.' } = {}) {
  return `<section class="cta-final theme-dark" aria-labelledby="cta-title">
  <div class="cta-media" data-parallax="0.1" aria-hidden="true">${picture('exame', { sizes: '100vw' })}</div>
  <div class="container cta-inner">
    <h2 id="cta-title" class="display reveal">${esc(title).replace(/(uma escolha\.)$/, '<em>$1</em>')}</h2>
    <p class="lead reveal">${esc(text)}</p>
    <div class="cta-buttons reveal">
      <a class="btn btn-light btn-lg magnetic" href="${whatsappLink('Olá! Gostaria de agendar um atendimento na BCM Dermatologia.')}" target="_blank" rel="noopener">${icon('whatsapp')}<span>Agendar atendimento</span></a>
      <a class="btn btn-link btn-link-light" href="${telLink}">${icon('phone')}<span>Falar com a BCM · ${esc(clinic.phone.display)}</span></a>
    </div>
  </div>
  <span class="img-note">Imagem ilustrativa</span>
</section>`;
}

export function renderFooter({ home = false } = {}) {
  const href = (id) => (home ? `#${id}` : `/#${id}`);
  const year = new Date().getFullYear();
  return `<footer class="site-footer theme-dark">
  <div class="container footer-grid">
    <div class="footer-brand">
      <a href="/" aria-label="${esc(clinic.name)} — página inicial">${logo('logo-light')}</a>
      <p>Clínica de dermatologia na Barra da Tijuca, Rio de Janeiro. Cuidado médico da pele, dos cabelos, das unhas e das mucosas.</p>
    </div>
    <nav aria-label="Rodapé — navegação">
      <p class="footer-title">Navegação</p>
      <ul>${nav.map((n) => `<li><a href="${href(n.id)}">${esc(n.label)}</a></li>`).join('')}</ul>
    </nav>
    <nav aria-label="Rodapé — especialidades">
      <p class="footer-title">Especialidades</p>
      <ul>${specialties.map((s) => `<li><a href="/${s.slug}/">${esc(s.name)}</a></li>`).join('')}</ul>
      <p class="footer-title">Equipe</p>
      <ul><li><a href="${href('equipe')}">Encontre um especialista</a></li></ul>
    </nav>
    <div>
      <p class="footer-title">Contato</p>
      <ul class="footer-contact">
        <li><a href="${telLink}">${icon('phone')}${esc(clinic.phone.display)}</a></li>
        <li><a href="${whatsappLink()}" target="_blank" rel="noopener">${icon('whatsapp')}${esc(clinic.whatsapp.display)}</a></li>
        <li><a href="${clinic.maps.link}" target="_blank" rel="noopener">${icon('pin')}<span>${esc(addressLine())}</span></a></li>
      </ul>
      <p class="footer-title">Redes</p>
      <ul><li><a href="https://www.instagram.com/dramarinabittencourt/" target="_blank" rel="noopener">Instagram · Dra. Marina Bittencourt</a></li></ul>
    </div>
  </div>
  <div class="container footer-bottom">
    <p>© ${year} ${esc(clinic.legalName)} · CNPJ ${esc(clinic.cnpj)}</p>
    <p class="footer-legal"><a href="/privacidade/">Política de privacidade</a><span aria-hidden="true">·</span><span>Conteúdo informativo; não substitui consulta médica.</span></p>
  </div>
</footer>`;
}

/** Botão fixo do Assistente BCM (o painel é carregado sob demanda). */
export const renderAssistantLauncher = () => `<button type="button" class="assistant-launcher" id="assistente" data-assistant-open="" aria-haspopup="dialog" aria-controls="assistant-panel" aria-expanded="false">
  <span class="assistant-launcher-glow" aria-hidden="true"></span>
  ${icon('sparkle')}<span class="assistant-launcher-label">Assistente BCM</span>
</button>`;

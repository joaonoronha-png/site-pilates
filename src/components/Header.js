import { nav, clinic, telLink, whatsappLink } from '../data/site.js';
import { esc, icon, logo, logoMark } from '../lib/html.js';

/** Abertura curta: marca desenha as camadas, nome aparece, overlay sai. */
export const renderIntro = () => `<div class="intro" aria-hidden="true">
  <div class="intro-inner">
    ${logoMark('intro-mark')}
    <span class="intro-name">BCM</span>
    <span class="intro-sub">Dermatologia Especializada</span>
  </div>
</div>`;

/**
 * @param {{ home?: boolean }} opts — na home os links são âncoras locais;
 * nas páginas internas apontam para a home.
 */
export function renderHeader({ home = false } = {}) {
  const href = (id) => (home ? `#${id}` : `/#${id}`);
  return `<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
<header class="site-header${home ? '' : ' is-solid is-static'}" data-header>
  <div class="container header-inner">
    <a href="${home ? '#inicio' : '/'}" class="header-logo" aria-label="${esc(clinic.name)} — página inicial">${logo()}</a>
    <nav class="main-nav" aria-label="Navegação principal">
      <ul>${nav.map((n) => `<li><a href="${href(n.id)}" data-nav="${n.id}">${esc(n.label)}</a></li>`).join('')}</ul>
    </nav>
    <div class="header-actions">
      <a class="btn btn-primary btn-sm magnetic" href="${href('contato')}" data-assistant-open="agendar">
        <span>Agendar atendimento</span>
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Abrir menu">
        <span class="menu-toggle-lines" aria-hidden="true"><span></span><span></span></span>
      </button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
  <nav class="container mobile-menu-inner" aria-label="Menu móvel">
    <ol class="mobile-nav">
      ${nav.map((n, i) => `<li style="--i:${i}"><a href="${href(n.id)}"><span class="mobile-nav-n">${String(i + 1).padStart(2, '0')}</span>${esc(n.label)}</a></li>`).join('')}
    </ol>
    <div class="mobile-menu-contact">
      <a class="btn btn-primary btn-block" href="${whatsappLink()}" target="_blank" rel="noopener">${icon('whatsapp')}<span>WhatsApp ${esc(clinic.whatsapp.display)}</span></a>
      <a class="btn btn-ghost btn-block" href="${telLink}">${icon('phone')}<span>Ligar ${esc(clinic.phone.display)}</span></a>
    </div>
  </nav>
</div>`;
}

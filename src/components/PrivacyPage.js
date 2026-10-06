import { clinic, telLink, whatsappLink } from '../data/site.js';
import { esc } from '../lib/html.js';

/**
 * Política de privacidade descrevendo apenas o que o site realmente faz.
 * Se novas funcionalidades forem adicionadas (formulários, analytics, IA
 * remota), esta página deve ser atualizada junto.
 */
export function renderPrivacyPage({ aiRemote = false } = {}) {
  return `<main id="conteudo" class="page legal">
  <div class="container narrow">
    <nav class="breadcrumb" aria-label="Você está em"><ol><li><a href="/">Início</a></li><li aria-current="page">Política de privacidade</li></ol></nav>
    <h1 class="h1">Política de privacidade</h1>
    <p class="lead">Como este site trata informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).</p>

    <h2 class="h4">1. Controlador</h2>
    <p>${esc(clinic.legalName)}, CNPJ ${esc(clinic.cnpj)}, com endereço na ${esc(clinic.address.street)}, ${esc(clinic.address.complement)}, ${esc(clinic.address.district)}, ${esc(clinic.address.city)} — ${esc(clinic.address.state)}.</p>

    <h2 class="h4">2. O que este site coleta</h2>
    <p>Este site <strong>não possui formulários</strong> e <strong>não coleta dados pessoais ou de saúde</strong> diretamente. Ele não utiliza cookies de rastreamento, publicidade ou ferramentas de análise de audiência.</p>

    <h2 class="h4">3. Armazenamento no seu navegador</h2>
    <p>Para melhorar a experiência, o site guarda no seu próprio navegador (armazenamento de sessão) apenas: se a animação de abertura já foi exibida e a conversa com o Assistente BCM durante a visita. Essas informações não são enviadas a nós e são apagadas ao fechar a aba.</p>

    <h2 class="h4">4. Assistente BCM</h2>
    ${
      aiRemote
        ? '<p>As mensagens digitadas no Assistente BCM são enviadas ao nosso servidor e a um provedor de inteligência artificial (Anthropic) exclusivamente para gerar a resposta, sem armazenamento pelo site. <strong>Não digite dados de saúde, documentos ou informações pessoais.</strong></p>'
        : '<p>O Assistente BCM funciona <strong>inteiramente no seu navegador</strong>, consultando uma base de informações oficiais da clínica. As mensagens não são enviadas a servidores. Mesmo assim, recomendamos não digitar dados de saúde ou informações pessoais.</p>'
    }
    <p>O assistente fornece informações gerais sobre a clínica e seus serviços e não substitui uma avaliação médica.</p>

    <h2 class="h4">5. Serviços de terceiros</h2>
    <p>Ao clicar em links de <strong>WhatsApp</strong>, <strong>Google Maps</strong>, <strong>Waze</strong> ou <strong>Instagram</strong>, você é direcionado a serviços de terceiros, sujeitos às respectivas políticas. O mapa interativo do Google só é carregado nesta página se você clicar em "Carregar mapa interativo". As mensagens pré-preenchidas do WhatsApp contêm apenas o assunto do contato — você pode editá-las antes de enviar.</p>

    <h2 class="h4">6. Seus direitos</h2>
    <p>Você pode solicitar informações, correção ou exclusão de dados pessoais tratados pela clínica, nos termos do art. 18 da LGPD, pelos canais: telefone <a href="${telLink}">${esc(clinic.phone.display)}</a> ou WhatsApp <a href="${whatsappLink('Olá! Tenho uma solicitação sobre meus dados pessoais (LGPD).')}" target="_blank" rel="noopener">${esc(clinic.whatsapp.display)}</a>.</p>

    <h2 class="h4">7. Atualizações</h2>
    <p>Esta política acompanha as funcionalidades do site e será atualizada sempre que elas mudarem.</p>
  </div>
</main>`;
}

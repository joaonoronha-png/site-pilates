/* ==========================================================================
   CONFIGURAÇÃO DO SITE — edite aqui, sem mexer no restante do código.
   ========================================================================== */
window.SITE_CONFIG = {
  // WhatsApp no formato internacional, só números (55 + DDD + número)
  whatsapp: '5521999811992',

  // Mensagem padrão ao abrir o WhatsApp pelo botão flutuante
  whatsappGreeting: 'Olá, Rebecca! Gostaria de conversar sobre meu evento.',

  email: 'gemaque.cerimonial@outlook.com',
  instagram: 'cerimonialistarebeccagemaque',

  /*
   * Envio do formulário.
   * Deixe vazio ('') para encaminhar a mensagem direto para o WhatsApp.
   * Para receber por e-mail/planilha, cole aqui a URL de um serviço
   * (ex.: Formspree, Getform, Make, Zapier, Google Apps Script).
   * O formulário envia um POST em JSON com os campos preenchidos.
   */
  formEndpoint: '',

  /*
   * Métricas (opcional). Preencha os IDs para ativar.
   * O evento "generate_lead" é disparado após o envio do formulário e
   * "contact_whatsapp" ao clicar em qualquer link de WhatsApp.
   */
  analytics: {
    ga4: '',        // ex.: 'G-XXXXXXXXXX'
    metaPixel: ''   // ex.: '123456789012345'
  }
};

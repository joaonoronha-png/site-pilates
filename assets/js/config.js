/*
 * ARGENTO — configuração central do site.
 *
 * Tudo o que depende de confirmação da empresa fica aqui.
 * Campos vazios ("") são tratados pelo site como "não confirmado" e não aparecem.
 */
window.ARGENTO_CONFIG = {
  // Telefone cadastral (Receita Federal).
  phone: "(21) 2516-2761",
  phoneHref: "+552125162761",

  // WhatsApp: SOMENTE preencher depois de confirmado pela ARGENTO.
  // Formato internacional sem símbolos. Ex.: "5521999999999"
  whatsapp: "",
  whatsappMessage:
    "Olá, conheci a ARGENTO pelo site e gostaria de conversar sobre uma necessidade da minha obra.",

  // E-mail comercial: preencher quando confirmado.
  email: "",

  // Endpoint que recebe os pedidos de orçamento e os leads do assistente
  // (multipart/form-data via POST). Funciona com Formspree, Web3Forms, Getform,
  // um webhook de CRM (RD Station, HubSpot, Pipedrive via Make/Zapier) ou API própria.
  // Enquanto vazio, o site mostra ao visitante o resumo do pedido e os canais
  // diretos de contato, sem fingir que o envio foi realizado.
  leadEndpoint: "",

  // Redes sociais: preencher apenas com perfis oficiais confirmados.
  social: {
    instagram: "",
    linkedin: "",
    facebook: "",
    youtube: ""
  }
};

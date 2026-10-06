/* =====================================================================
   REQUINTE & SABOR BUFFET — CONFIGURAÇÃO EDITÁVEL
   ---------------------------------------------------------------------
   Este é o ÚNICO arquivo que precisa ser alterado para os ajustes do dia
   a dia. Regra de ouro: só publique aqui informações confirmadas pela
   própria empresa. Nada de preços, pratos, números ou depoimentos
   inventados.
   ===================================================================== */
window.SITE_CONFIG = {

  /* WhatsApp no formato internacional, só números (55 + DDD + número). */
  whatsapp: '5521975143297',

  /* Mensagem automática usada nos botões de orçamento. */
  mensagemPadrao: 'Olá! Conheci a Requinte & Sabor pelo site e gostaria de solicitar um orçamento para meu evento.',

  /* HORÁRIO — dado encontrado em pesquisa, AINDA A CONFIRMAR com o cliente.
     Se mudar, altere aqui e também em "openingHoursSpecification" no
     <head> do index.html (dados estruturados para o Google). */
  horario: 'Todos os dias, das 8h às 20h',

  /* "Desde 1995 fazendo parte de histórias especiais."
     Só mude para true depois da confirmação direta com a empresa. */
  desde1995Confirmado: false,

  /* Enquanto as fotos provisórias (banco de imagens com licença livre)
     estiverem no site, mantenha true: exibe a legenda discreta
     "Imagem ilustrativa". Mude para false quando todas forem
     substituídas por fotos reais da Requinte & Sabor. */
  imagensIlustrativas: true,

  /* Link para as avaliações no Google. Ideal: trocar pelo link oficial
     do Perfil da Empresa (ex.: https://g.page/r/XXXX/review). */
  linkAvaliacoesGoogle: 'https://www.google.com/search?q=Requinte+%26+Sabor+Buffet+Rua+Pecegueiro+do+Amaral+280+Vargem+Pequena',

  /* AVALIAÇÕES REAIS (4 a 6). Copie trechos literais do Google, com o
     nome exatamente como aparece. Enquanto vazio, o carrossel não aparece.
     Exemplo:
     { texto: 'Trecho real da avaliação.', nome: 'Nome da pessoa', fonte: 'Google' },
  */
  avaliacoes: [],

  /* PORTFÓLIO — SOMENTE fotos reais de eventos da Requinte & Sabor (ou
     com autorização). Categorias sem fotos não aparecem. Se a lista
     estiver vazia, a seção inteira fica oculta.
     Categorias aceitas: 'Casamentos', '15 anos', 'Aniversários',
     'Corporativos', 'Gastronomia'.
     Exemplo:
     { src: 'assets/img/portfolio/casamento-01.webp', categoria: 'Casamentos',
       alt: 'Descrição objetiva da foto', largura: 1600, altura: 1067 },
  */
  portfolio: [],

  /* CARDÁPIO OFICIAL — preencher apenas com o cardápio fornecido pela
     empresa. Enquanto null, aparece só o convite "Converse com a gente".
     Exemplo:
     cardapio: {
       titulo: 'Sugestões de cardápio',
       secoes: [
         { nome: 'Entradas', itens: ['Item 1', 'Item 2'] },
         { nome: 'Sobremesas', itens: ['Item 1'] }
       ],
       observacao: 'Texto opcional confirmado pela empresa.'
     },
  */
  cardapio: null

  /* As perguntas frequentes e as respostas da assistente virtual ficam em
     data/knowledge-base.js (uma única fonte para FAQ, assistente e orçamento). */
};

/* MEDIÇÃO (opcional). Preencha para ativar Google Analytics 4 ou Tag Manager.
   Vazio = nenhuma ferramenta externa é carregada e não aparece aviso de cookies.
   Os eventos de conversão sempre vão para window.dataLayer. */
window.RS_CONFIG = {
  ga4Id: '',        // ex.: 'G-XXXXXXXXXX'
  gtmId: '',        // ex.: 'GTM-XXXXXXX'
  debugAnalytics: false
};

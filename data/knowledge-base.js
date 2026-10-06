/* =====================================================================
   REQUINTE & SABOR BUFFET — BASE DE CONHECIMENTO
   ---------------------------------------------------------------------
   ÚNICA fonte de informações comerciais do site. A Concierge Virtual,
   as Perguntas Frequentes e o Orçamento leem daqui.

   COMO ATUALIZAR (sem programar):
   1. Encontre o tópico (busque pelo "id" ou pelo título).
   2. Troque o "status":
        "confirmado"      → a assistente responde com o texto de "answer".
        "depende"         → responde "answer" e conduz para o orçamento.
        "nao_confirmado"  → diz que a equipe precisa confirmar e oferece
                            levar a dúvida para o WhatsApp.
   3. Escreva/ajuste o "answer" com a informação oficial.
   4. Salve. Para atualizar o FAQ no HTML (SEO), rode: node tools/build-faq.mjs

   "pending" = o que a empresa precisa informar para o tópico sair de
   "nao_confirmado". "evidence" = de onde veio a informação (não aparece).

   REGRA: nunca coloque aqui preço, prato, política, capacidade, região
   atendida ou tempo de mercado sem confirmação da própria empresa.
   ===================================================================== */

window.RS_KB = {
  meta: {
    updatedAt: "2026-10-06",
    researchSources: [
      "Briefing do projeto (endereço, WhatsApp, tipos de evento, formas de pagamento, nota 5,0 no Google)",
      "Instagram @requinteesaborbuffet indicado pelo responsável pelo projeto"
    ]
  },

  company: {
    name: "Requinte & Sabor Buffet",
    whatsapp: { e164: "5521975143297", display: "(21) 97514-3297" },
    instagram: { handle: "@requinteesaborbuffet", url: "https://www.instagram.com/requinteesaborbuffet/" },
    address: {
      street: "Rua Pecegueiro do Amaral, 280",
      neighborhood: "Vargem Pequena",
      city: "Rio de Janeiro",
      state: "RJ",
      postalCode: "22783-490",
      full: "Rua Pecegueiro do Amaral, 280 - Vargem Pequena, Rio de Janeiro - RJ, 22783-490"
    },
    googleRating: { value: "5,0" },
    // Horário encontrado em pesquisa — confirmar com o cliente.
    hours: "Todos os dias, das 8h às 20h",
    // "Desde 1995" ainda não confirmado: não usar.
    since: null
  },

  eventTypes: [
    { id: "casamento",   label: "Casamento",            quote: true },
    { id: "15anos",      label: "Festa de 15 anos",     quote: true },
    { id: "aniversario", label: "Aniversário",          quote: true },
    { id: "corporativo", label: "Evento corporativo",   quote: true },
    { id: "coffee",      label: "Coffee break",         quote: true },
    { id: "celebracao",  label: "Outra celebração",     quote: false }
  ],

  /* Somente serviços confirmados no briefing. */
  services: [
    { id: "buffet", label: "Buffet para o evento", status: "confirmado", quote: true },
    { id: "coffeebreak", label: "Coffee break", status: "confirmado", quote: true }
  ],

  quote: {
    guestRanges: ["Até 50", "50–100", "100–200", "Mais de 200"],
    unsureOption: "Ainda não sei"
  },

  messages: {
    unconfirmed: "Essa informação precisa ser confirmada diretamente com a equipe da Requinte & Sabor. Se quiser, encaminho sua dúvida pelo WhatsApp junto com o que você já me contou.",
    faqUnconfirmed: "Consulte a equipe para verificar as opções disponíveis para o seu evento.",
    handoff: "Claro. Levo para o WhatsApp também as informações que você já me contou, para você não precisar repetir.",
    greeting: "Olá! Sou a assistente virtual da Requinte & Sabor. Posso tirar suas dúvidas ou deixar seu pedido de orçamento pronto para a equipe.",
    fallback: "Não tenho certeza se entendi. Posso ajudar com orçamento e tipos de evento, ou guardar sua pergunta para a equipe responder pelo WhatsApp.",
    waIntro: "Olá! Conheci a Requinte & Sabor pelo site e gostaria de solicitar um orçamento para meu evento."
  },

  whatsappTemplates: {
    default: "Olá! Conheci a Requinte & Sabor pelo site e gostaria de solicitar um orçamento para meu evento.",
    cardapio: "Olá! Conheci a Requinte & Sabor pelo site e gostaria de conhecer as opções de cardápio para o meu evento.",
    data: "Olá! Conheci a Requinte & Sabor pelo site e gostaria de verificar a disponibilidade de uma data."
  },

  /* Avaliações reais do Google (trechos fiéis, com nome como aparece).
     Formato: { author: "Nome S.", text: "…", source: "Google" }  */
  reviews: [],

  topics: [
    /* ===== EVENTOS ===== */
    { id: "tipos_evento", category: "Eventos", title: "Tipos de evento", status: "confirmado",
      keywords: ["tipos de evento", "que eventos", "quais eventos", "que tipo de evento", "eventos voces fazem", "eventos atendem", "o que voces atendem"],
      answer: "A Requinte & Sabor atende casamentos, festas de 15 anos, aniversários, eventos corporativos, coffee breaks e outras celebrações especiais.",
      evidence: "Briefing." },

    { id: "casamento", category: "Eventos", title: "Casamentos", status: "confirmado",
      keywords: ["casamento", "casamentos", "casar", "noiva", "noivo", "noivos", "bodas", "renovacao de votos", "fazem casamento"],
      answer: "Sim! Casamentos estão entre os eventos atendidos pela Requinte & Sabor, com gastronomia e cuidado para acompanhar cada momento do dia.",
      startsLead: true, setsEvent: "Casamento", evidence: "Briefing." },

    { id: "aniversario", category: "Eventos", title: "Aniversários e 15 anos", status: "confirmado",
      keywords: ["aniversario", "15 anos", "quinze anos", "debutante", "niver", "festa de 40", "festa de 50", "festa de 60"],
      answer: "Sim. A Requinte & Sabor atende aniversários e festas de 15 anos.",
      startsLead: true, evidence: "Briefing." },

    { id: "corporativo", category: "Eventos", title: "Eventos corporativos e coffee break", status: "confirmado",
      keywords: ["corporativo", "empresa", "coffee break", "coffee", "confraternizacao", "evento da empresa", "palestra", "treinamento", "congresso", "workshop", "reuniao"],
      answer: "Sim. A Requinte & Sabor atende eventos corporativos e coffee breaks, com gastronomia e serviço para encontros profissionais.",
      startsLead: true, setsEvent: "Evento corporativo", evidence: "Briefing." },

    { id: "capacidade", category: "Eventos", title: "Número de convidados", status: "nao_confirmado",
      keywords: ["minimo", "maximo", "quantas pessoas", "quantidade minima", "quantidade de pessoas", "capacidade", "numero minimo", "poucos convidados", "evento pequeno", "evento grande"],
      answer: "", askSlot: "convidados",
      pending: "Informar se existe número mínimo/máximo de convidados." },

    { id: "regiao", category: "Eventos", title: "Regiões atendidas", status: "nao_confirmado",
      keywords: ["regiao", "regioes", "atendem em", "atende em", "atendem na", "atende na", "atendem no", "fora do rio", "zona sul", "zona norte", "niteroi", "baixada", "bairros", "vem ate", "vao ate", "atendem fora", "longe", "deslocamento"],
      answer: "", askSlot: "local",
      pending: "Informar regiões atendidas e se há taxa de deslocamento." },

    { id: "espaco", category: "Eventos", title: "Local / salão", status: "nao_confirmado",
      keywords: ["salao", "espaco proprio", "tem espaco", "voces tem local", "tem salao", "onde fazem a festa", "alugam espaco"],
      answer: "", pending: "Informar se a empresa possui ou indica espaço para eventos." },

    /* ===== GASTRONOMIA ===== */
    { id: "servicos", category: "Gastronomia", title: "Serviços", status: "confirmado",
      keywords: ["servicos", "quais sao os servicos", "o que voces fazem", "o que oferecem", "trabalham com"],
      answer: "A Requinte & Sabor trabalha com buffet e gastronomia para eventos — casamentos, 15 anos, aniversários, eventos corporativos, coffee breaks e outras celebrações.",
      evidence: "Briefing." },

    { id: "cardapio", category: "Gastronomia", title: "Cardápio", status: "depende",
      keywords: ["cardapio", "cardapios", "menu", "catalogo", "o que servem", "pratos", "comidas", "prato principal", "entrada", "entradas", "salgados", "sobremesa", "sobremesas", "doces"],
      answer: "O cardápio ainda não está publicado aqui no site. Para conhecer as opções para o seu evento, o melhor caminho é falar com a equipe — posso deixar seu pedido pronto para o WhatsApp.",
      offerMenu: true },

    { id: "personalizacao", category: "Gastronomia", title: "Personalização do cardápio", status: "nao_confirmado",
      keywords: ["personalizar", "personalizado", "personalizacao", "montar o cardapio", "escolher os pratos", "trocar item", "do meu jeito", "posso escolher"],
      answer: "", pending: "Informar se e como o cardápio pode ser personalizado." },

    { id: "menu_infantil", category: "Gastronomia", title: "Menu infantil", status: "nao_confirmado",
      keywords: ["menu infantil", "cardapio infantil", "comida de crianca", "criancas"],
      answer: "", pending: "Informar se existe cardápio para crianças." },

    { id: "restricoes", category: "Gastronomia", title: "Opções vegetarianas, veganas e restrições", status: "nao_confirmado",
      keywords: ["vegetariano", "vegetariana", "vegano", "vegana", "gluten", "celiaco", "lactose", "alergia", "alergico", "diabetes", "diabetico", "sem acucar", "kosher", "halal", "restricao", "restricoes", "intolerancia", "sem carne"],
      answer: "", captureRestriction: true,
      pending: "Informar quais restrições alimentares são atendidas." },

    { id: "degustacao", category: "Gastronomia", title: "Degustação", status: "nao_confirmado",
      keywords: ["degustacao", "degustar", "provar", "experimentar antes", "teste de cardapio"],
      answer: "", pending: "Informar se há degustação e como funciona." },

    /* ===== BEBIDAS ===== */
    { id: "bebidas", category: "Bebidas", title: "Bebidas", status: "nao_confirmado",
      keywords: ["bebida", "bebidas", "open bar", "drink", "drinks", "bartender", "agua", "refrigerante", "refri", "suco", "sucos", "cerveja", "vinho", "espumante", "champagne"],
      answer: "", pending: "Informar se a empresa fornece bebidas e quais." },

    /* ===== ESTRUTURA ===== */
    { id: "equipe", category: "Estrutura", title: "Equipe de serviço", status: "nao_confirmado",
      keywords: ["garcom", "garcons", "maitre", "cozinheiro", "chef", "equipe", "staff", "quem serve", "copeira"],
      answer: "", pending: "Informar composição da equipe de serviço incluída." },

    { id: "loucas", category: "Estrutura", title: "Louças, mobiliário e montagem", status: "nao_confirmado",
      keywords: ["louca", "loucas", "talher", "talheres", "copo", "copos", "taca", "tacas", "mesa", "mesas", "cadeira", "cadeiras", "mobiliario", "toalha", "montagem", "desmontagem", "decoracao"],
      answer: "", pending: "Informar o que está incluído (louças, mobiliário, montagem)." },

    /* ===== COMERCIAL ===== */
    { id: "preco", category: "Comercial", title: "Valores", status: "depende",
      keywords: ["preco", "precos", "valor", "valores", "quanto custa", "quanto fica", "quanto sai", "custo", "por pessoa", "por convidado", "orcamento", "cotacao", "tabela", "proposta"],
      answer: "Os valores não são publicados no site, porque dependem do tipo de evento, do número de convidados e do local. Mas posso deixar seu pedido praticamente pronto para a equipe enviar uma proposta.",
      startsLead: true },

    { id: "pagamento", category: "Comercial", title: "Formas de pagamento", status: "confirmado",
      keywords: ["pagamento", "pagar", "cartao", "credito", "debito", "aproximacao", "pix", "boleto", "parcelar", "parcelamento", "parcela", "forma de pagamento"],
      answer: "As formas de pagamento informadas são cartão de crédito, cartão de débito e pagamento por aproximação. Outras condições são combinadas diretamente com a equipe.",
      evidence: "Briefing (cadastro público)." },

    { id: "contrato", category: "Comercial", title: "Contrato e cancelamento", status: "nao_confirmado",
      keywords: ["contrato", "cancelar", "cancelamento", "desistir", "multa", "mudar a data", "remarcar", "adiar", "sinal"],
      answer: "", pending: "Informar regras de contrato, sinal e cancelamento." },

    { id: "pacotes", category: "Comercial", title: "Pacotes e promoções", status: "nao_confirmado",
      keywords: ["pacote", "pacotes", "combo", "promocao", "desconto"],
      answer: "", pending: "Informar se existem pacotes ou promoções." },

    /* ===== AGENDA ===== */
    { id: "disponibilidade", category: "Agenda", title: "Disponibilidade de data", status: "depende",
      keywords: ["disponivel", "disponibilidade", "tem data", "data livre", "agenda", "minha data", "data disponivel", "estao livres"],
      answer: "A agenda é confirmada diretamente pela equipe. Me conta a data que você tem em mente e eu já deixo anotado para a consulta.",
      faqAnswer: "A agenda é confirmada diretamente pela equipe. Informe a data no orçamento do site ou pelo WhatsApp (21) 97514-3297.",
      askSlot: "data", startsLead: true },

    { id: "antecedencia", category: "Agenda", title: "Antecedência", status: "nao_confirmado",
      keywords: ["antecedencia", "com quanto tempo", "quanto tempo antes", "prazo", "em cima da hora", "urgente"],
      answer: "", pending: "Informar antecedência recomendada para contratação." },

    /* ===== CONTATO ===== */
    { id: "contato", category: "Contato", title: "Contato", status: "confirmado",
      keywords: ["telefone", "whatsapp", "zap", "contato", "instagram", "falar com voces", "numero"],
      answer: "Você pode falar com a Requinte & Sabor pelo WhatsApp (21) 97514-3297 ou pelo Instagram @requinteesaborbuffet." },

    { id: "endereco", category: "Contato", title: "Endereço", status: "confirmado",
      keywords: ["endereco", "onde fica", "onde voces ficam", "localizacao", "vargem pequena", "como chegar", "pecegueiro"],
      answer: "A Requinte & Sabor fica na Rua Pecegueiro do Amaral, 280 — Vargem Pequena, Rio de Janeiro – RJ, CEP 22783-490." },

    { id: "horario", category: "Contato", title: "Horário de atendimento", status: "confirmado",
      keywords: ["horario", "horarios", "que horas abre", "que horas fecha", "funcionamento", "atendem sabado", "atendem domingo", "horario de atendimento"],
      answer: "O atendimento informado é todos os dias, das 8h às 20h." },

    { id: "avaliacoes", category: "Contato", title: "Avaliações", status: "confirmado",
      keywords: ["avaliacao", "avaliacoes", "nota", "google", "recomendam", "e bom", "sao bons", "confiavel", "depoimento", "depoimentos"],
      answer: "A Requinte & Sabor tem nota 5,0 no Google. As avaliações públicas destacam a qualidade da comida, a apresentação, a organização, o atendimento, o profissionalismo e a atenção aos detalhes." },

    { id: "historia", category: "Contato", title: "Tempo de mercado", status: "nao_confirmado",
      keywords: ["desde quando", "ha quanto tempo", "anos de mercado", "experiencia", "historia", "fundada", "quando comecou"],
      answer: "", pending: "Confirmar desde quando a empresa atua (há referência pública a 1995)." }
  ],

  /* Perguntas frequentes (a resposta vem do tópico indicado ou de "answer") */
  faq: [
    { q: "Quais tipos de eventos vocês atendem?", topic: "tipos_evento" },
    { q: "Como solicitar um orçamento?", status: "confirmado",
      answer: "Pelo orçamento interativo aqui do site, pela assistente virtual ou direto no WhatsApp (21) 97514-3297. Você informa tipo de evento, data, local e número de convidados, e a equipe prepara uma proposta." },
    { q: "Quais informações devo enviar para o orçamento?", status: "confirmado",
      answer: "Tipo de evento, data, número aproximado de convidados e local. Quanto mais detalhes você compartilhar, mais completa será a proposta." },
    { q: "Como verifico se minha data está disponível?", topic: "disponibilidade" },
    { q: "Quais formas de pagamento são aceitas?", topic: "pagamento" },
    { q: "Qual o número mínimo de convidados?", topic: "capacidade" },
    { q: "Vocês fornecem bebidas?", topic: "bebidas" },
    { q: "Possuem menu infantil?", topic: "menu_infantil" },
    { q: "Fazem degustação?", topic: "degustacao" },
    { q: "Quais regiões vocês atendem?", topic: "regiao" },
    { q: "Há opções vegetarianas ou veganas?", topic: "restricoes" }
  ]
};

/* =====================================================================
   MAPERSÍ BUFFET — BASE DE CONHECIMENTO
   ---------------------------------------------------------------------
   Este arquivo é a ÚNICA fonte de informações comerciais do site.
   O Concierge Virtual, as Perguntas Frequentes e o Orçamento leem daqui.

   COMO ATUALIZAR (sem programar):
   1. Encontre o tópico (busque pelo "id" ou pelo título).
   2. Troque o "status":
        "confirmado"      → a assistente responde com o texto de "answer".
        "depende"         → responde "answer" e pergunta detalhes do evento.
        "nao_confirmado"  → responde que a equipe precisa confirmar e
                            oferece levar a dúvida para o WhatsApp.
   3. Escreva/ajuste o "answer" com a informação oficial.
   4. Salve. Não é preciso mexer em nenhum outro arquivo.

   O campo "pending" explica o que a Mapersí precisa informar para o
   tópico deixar de ser "nao_confirmado". O campo "evidence" registra a
   fonte pública que sustenta a resposta (auditoria — não aparece no site).

   REGRA: nunca coloque aqui preço, política, capacidade, desconto ou
   serviço que não tenha sido confirmado pela própria Mapersí.
   ===================================================================== */

window.MAPERSI_KB = {
  meta: {
    updatedAt: "2026-10-06",
    researchSources: [
      "Instagram oficial @mapersibuffet (perfil, bio e 12 publicações mais recentes)",
      "Google Maps — ficha 'Mapersi buffet' (endereço, telefone, nota, categoria)",
      "Link oficial wa.me da bio do Instagram (identifica 'Mapersí buffet')"
    ]
  },

  /* ------------------------------------------------------------------
     DADOS DA EMPRESA (confirmados em pelo menos 2 fontes, salvo nota)
     ------------------------------------------------------------------ */
  company: {
    name: "Mapersí Buffet",
    tagline: "Buffet e Estações",
    instagram: { handle: "@mapersibuffet", url: "https://www.instagram.com/mapersibuffet/" },
    whatsapp: { e164: "5521993523937", display: "(21) 99352-3937" },
    phone: { e164: "+5521993523937", display: "(21) 99352-3937" },
    email: "contato@mapersi.com.br",           // fonte: bio do Instagram
    website: "https://mapersi.com.br/",          // fonte: bio + Google
    address: {
      street: "Rua Caiena",
      neighborhood: "Bento Ribeiro",
      city: "Rio de Janeiro",
      state: "RJ",
      postalCode: "21555-140",
      country: "BR",
      note: "Endereço da empresa. As festas publicadas aconteceram em espaços escolhidos pelos clientes."
    },
    geo: { lat: -22.8579875, lng: -43.3620758 },
    maps: {
      placeUrl: "https://maps.google.com/?cid=7569367235839115147",
      directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=-22.8579875,-43.3620758",
      wazeUrl: "https://waze.com/ul?ll=-22.8579875,-43.3620758&navigate=yes"
    },
    googleRating: { value: "5,0", numeric: 5.0, checkedAt: "2026-10-06" },
    // Descrição da própria empresa na ficha do Google: "Atua no Rio de Janeiro,
    // desde 2018, com eventos de médio a porte grande."
    since: 2018,
    people: [
      // A bio do Instagram exibe o nome abaixo com o emoji de cozinheira.
      // O cargo exato não foi publicado — confirmar antes de exibir no site.
      { name: "Thaiane Maciel", role: null, show: false }
    ],
    // Google exibia "terça-feira 08:00–18:00" em 06/10/2026. Os demais dias
    // não foram confirmados; por isso o horário NÃO é exibido no site.
    hours: null
  },

  /* ------------------------------------------------------------------
     TIPOS DE EVENTO (usados no orçamento e no chat)
     ------------------------------------------------------------------ */
  eventTypes: [
    { id: "casamento",   label: "Casamento",              status: "confirmado", quote: true,
      evidence: "Bio: 'Casamento'. Posts de casamentos (jun/2025, set/2025 e outros)." },
    { id: "15anos",      label: "Festa de 15 anos",        status: "confirmado", quote: true,
      evidence: "Post: 15 anos da Isabel — buffet, open bar e estações." },
    { id: "aniversario", label: "Aniversário",             status: "confirmado", quote: true,
      evidence: "Post: 40 anos da Thaty — cardápio premium." },
    { id: "corporativo", label: "Evento corporativo",      status: "confirmado", quote: true,
      evidence: "Bio: 'corporativos'. Post: coffee break para instituição de ensino (330+ pessoas)." },
    { id: "social",      label: "Outro evento social",     status: "confirmado", quote: true,
      evidence: "Bio: 'Social'. Post: renovação de votos." },
    { id: "infantil",    label: "Festa infantil",          status: "nao_confirmado", quote: false,
      pending: "Confirmar se a Mapersí atende festas infantis e se há menu infantil." }
  ],

  /* ------------------------------------------------------------------
     SERVIÇOS / EXPERIÊNCIAS
     show: aparece no site e no chat | quote: aparece no orçamento
     ------------------------------------------------------------------ */
  services: [
    { id: "buffet", label: "Buffet completo", status: "confirmado", show: true, quote: true,
      summary: "Entradas, pratos e serviço pensados para acompanhar a sua celebração do começo ao fim.",
      evidence: "Posts: 'Levamos nosso buffet'; 'Buffet: @mapersibuffet' em diversos casamentos e festas." },
    { id: "estacoes", label: "Estações gastronômicas", status: "confirmado", show: true, quote: true,
      summary: "Estações montadas no evento — como massas, fast food e cascata de chocolate.",
      evidence: "Nome do perfil: 'Buffet | Estações | Ilha gastronômica'. Posts: estação de massas, estação fast food, cascata de chocolate." },
    { id: "massas", label: "Estação de massas", status: "confirmado", show: true, quote: true,
      summary: "Massas finalizadas na hora, com molhos e acompanhamentos à escolha do convidado.",
      evidence: "Posts com carrinho Mapersí: penne, espaguete, molhos e acompanhamentos, cozinheiro preparando na hora." },
    { id: "entradas", label: "Entradas e finger food", status: "confirmado", show: true, quote: true,
      summary: "Entradinhas servidas pela equipe aos convidados.",
      evidence: "Post 40 anos: 'cardápio premium, com entradinhas'. Vídeos com equipe servindo tortinhas, pastéis e salgados." },
    { id: "bebidas", label: "Welcome drinks e open bar", status: "confirmado", show: true, quote: true,
      summary: "Recepção com welcome drinks e open bar com bartender.",
      evidence: "Post casamento jun/2025: 'entrada linda de welcome drinks'. Post 15 anos: 'Buffet, open bar e estações'." },
    { id: "coffeebreak", label: "Coffee break corporativo", status: "confirmado", show: true, quote: true,
      summary: "Coffee break para empresas e instituições — já realizado para mais de 330 pessoas.",
      evidence: "Post: coffee break para instituição de ensino, 'mais de 330 pessoas'." },
    { id: "ilha", label: "Ilha gastronômica", status: "confirmado", show: false, quote: false,
      summary: "Formato citado no perfil oficial. Detalhes a confirmar com a equipe.",
      evidence: "Nome do perfil no Instagram." },
    { id: "churrasco", label: "Churrasco", status: "nao_confirmado", show: false, quote: false,
      summary: "",
      pending: "Não encontramos publicação recente da Mapersí sobre churrasco. Se o serviço existir, mude status para 'confirmado' e show/quote para true." }
  ],

  /* ------------------------------------------------------------------
     OPÇÕES DO ORÇAMENTO
     ------------------------------------------------------------------ */
  quote: {
    guestRanges: ["Até 50", "50–100", "100–200", "Mais de 200"],
    unsureOption: "Ainda não sei"
  },

  /* ------------------------------------------------------------------
     MENSAGENS PADRÃO
     ------------------------------------------------------------------ */
  messages: {
    unconfirmed: "Essa informação precisa ser confirmada diretamente com a equipe da Mapersí. Se quiser, posso encaminhar sua dúvida pelo WhatsApp.",
    faqUnconfirmed: "Consulte nossa equipe para verificar as opções disponíveis para seu evento.",
    handoff: "Claro. Posso levar para o WhatsApp também as informações que você já me contou para você não precisar repetir tudo.",
    greeting: "Olá! 👋 Sou a assistente virtual da Mapersí. Posso tirar suas dúvidas ou ajudar a preparar um orçamento para seu evento.",
    fallback: "Não tenho certeza se entendi. Posso ajudar com orçamento, serviços e estações, ou guardar sua pergunta para a equipe responder pelo WhatsApp.",
    waIntro: "Olá, Mapersí! Conheci vocês pelo site e gostaria de solicitar um orçamento."
  },

  /* Mensagens de WhatsApp dos botões contextuais do site */
  whatsappTemplates: {
    default: "Olá, Mapersí! Conheci vocês pelo site e gostaria de falar com a equipe.",
    orcamento: "Olá, Mapersí! Conheci vocês pelo site e gostaria de solicitar um orçamento para meu evento.",
    casamento: "Olá, Mapersí! Conheci vocês pelo site e gostaria de solicitar um orçamento para meu casamento.",
    catalogo: "Olá, Mapersí! Conheci vocês pelo site e gostaria de receber o catálogo com as opções e valores.",
    estacoes: "Olá, Mapersí! Conheci vocês pelo site e gostaria de saber mais sobre as estações gastronômicas.",
    corporativo: "Olá, Mapersí! Conheci vocês pelo site e gostaria de um orçamento para um evento corporativo / coffee break.",
    data: "Olá, Mapersí! Conheci vocês pelo site e gostaria de verificar a disponibilidade de uma data."
  },

  /* ------------------------------------------------------------------
     REVIEWS — avaliações reais (Google). Copie somente com atribuição.
     Formato: { author: "Nome S.", text: "…", source: "Google", date: "2026-08" }
     Quando houver itens, o site exibe automaticamente o slider.
     Fonte: ficha "Mapersi buffet" no Google Maps (avaliações 5★, coletadas
     em 06/10/2026). Trechos fiéis, com abreviações de escrita expandidas
     ("tb" → "também"); nomes abreviados por privacidade.
     ------------------------------------------------------------------ */
  reviews: [
    { author: "Juliana B.", source: "Google", rating: 5,
      text: "Não teve uma pessoa que não comentou sobre a estação: o quanto a equipe trabalhou, atendeu bem e como tudo estava delicioso e fresco. Mesmo com a alta demanda, deram conta com muito profissionalismo." },
    { author: "Vandresa C.", source: "Google", rating: 5,
      text: "Nós AMAMOS o trabalho de vocês. Tudo muito gostoso e super bem apresentado. Todos os convidados elogiaram o buffet e muitos pediram o contato de vocês." },
    { author: "Robertha W.", source: "Google", rating: 5,
      text: "Participei de uns 4 eventos em que foi o buffet Mapersi, e eu só tenho elogios. Tudo muito bem servido, garçons educação e apresentação linda. Eu amei o cuidado deles." },
    { author: "Roberta A.", source: "Google", rating: 5,
      text: "Tudo maravilhoso, desde o atendimento inicial, comida, organização, o pós evento também! Tudo de muita qualidade, saboroso e bom gosto!" },
    { author: "Marcia R.", source: "Google", rating: 5,
      text: "A equipe é maravilhosa. Presta serviços de qualidade. E o que falar das comidinhas, petiscos? São bons demais. Os convidados ficam muito satisfeitos." },
    { author: "Marcela B.", source: "Google", rating: 5,
      text: "É com certeza o melhor buffet da região, qualidade, organização, amor… Tudo que uma boa festa precisa." }
  ],

  /* ------------------------------------------------------------------
     TÓPICOS DO CONCIERGE
     keywords: palavras/expressões (sem acento, minúsculas) que ativam o tópico
     ------------------------------------------------------------------ */
  topics: [
    /* ===== EVENTOS ===== */
    { id: "tipos_evento", category: "Eventos", title: "Tipos de evento", status: "confirmado",
      keywords: ["tipos de evento", "que eventos", "quais eventos", "que tipo de evento", "atendem que", "fazem que tipo", "eventos voces fazem", "eventos atendem"],
      answer: "A Mapersí atende casamentos, eventos corporativos e eventos sociais. Nas nossas redes você encontra casamentos, renovação de votos, festas de 15 anos, aniversários e coffee break corporativo.",
      evidence: "Bio do Instagram + publicações." },

    { id: "casamento", category: "Eventos", title: "Casamentos", status: "confirmado",
      keywords: ["casamento", "casamentos", "casar", "noiva", "noivo", "noivos", "bodas", "renovacao de votos", "fazem casamento"],
      answer: "Sim! Casamentos estão entre os eventos que a Mapersí mais realiza — de celebrações intimistas a casamentos com quase 200 convidados, com buffet, estações e welcome drinks.",
      startsLead: true, setsEvent: "Casamento",
      evidence: "Posts de casamento; caption 'quase 200 convidados'." },

    { id: "aniversario", category: "Eventos", title: "Aniversários e 15 anos", status: "confirmado",
      keywords: ["aniversario", "15 anos", "quinze anos", "debutante", "niver", "festa de 40", "festa de 50", "festa de 60", "bodas de"],
      answer: "Sim. A Mapersí já realizou festas de 15 anos e aniversários, inclusive com cardápio premium e itens escolhidos pelo cliente.",
      startsLead: true,
      evidence: "Posts: 15 anos da Isabel; 40 anos da Thaty." },

    { id: "corporativo", category: "Eventos", title: "Eventos corporativos", status: "confirmado",
      keywords: ["corporativo", "empresa", "coffee break", "coffee", "confraternizacao", "evento da empresa", "palestra", "treinamento", "congresso", "instituicao"],
      answer: "Sim. A Mapersí atende eventos corporativos — um dos mais recentes foi um coffee break para uma instituição de ensino, com mais de 330 pessoas.",
      startsLead: true, setsEvent: "Evento corporativo",
      evidence: "Post coffee break 330+ pessoas." },

    { id: "infantil", category: "Eventos", title: "Festa infantil / menu infantil", status: "nao_confirmado",
      keywords: ["infantil", "festa infantil", "menu infantil", "criancas", "crianca", "kids"],
      answer: "", pending: "Confirmar se atende festa infantil e se há menu infantil." },

    { id: "capacidade", category: "Eventos", title: "Quantidade de convidados", status: "depende",
      keywords: ["minimo", "maximo", "quantas pessoas", "quantidade minima", "quantidade de pessoas", "capacidade", "numero minimo", "poucos convidados", "evento pequeno", "evento grande"],
      answer: "Não há um mínimo ou máximo publicado — a Mapersí já fez de celebrações intimistas a um coffee break para mais de 330 pessoas. A equipe confirma o formato ideal para o seu número de convidados.",
      askSlot: "convidados",
      evidence: "Posts: casamento intimista; casamento ~200; coffee break 330+." },

    { id: "regiao", category: "Eventos", title: "Região atendida", status: "depende",
      keywords: ["regiao", "regioes", "atendem em", "atende em", "atendem na", "atende na", "atendem no", "fora do rio", "zona sul", "zona oeste", "zona norte", "niteroi", "baixada", "regiao atendida", "bairros", "vem ate", "vao ate", "atendem fora", "atende fora", "longe"],
      answer: "A Mapersí leva o buffet até o espaço do seu evento. A base fica em Bento Ribeiro, no Rio de Janeiro. A cobertura de cada região é confirmada pela equipe conforme o local.",
      askSlot: "local",
      pending: "Publicar a lista de regiões atendidas e se há taxa de deslocamento.",
      evidence: "Caption: 'Levamos nosso buffet'; eventos em espaços diferentes." },

    { id: "espaco", category: "Eventos", title: "Local / salão", status: "nao_confirmado",
      keywords: ["salao", "espaco proprio", "tem espaco", "local da festa", "voces tem local", "tem salao", "onde fazem a festa", "festa no endereco", "alugam espaco"],
      answer: "", pending: "Confirmar se a Mapersí possui ou indica espaço. As festas publicadas aconteceram em espaços escolhidos pelos clientes." },

    /* ===== GASTRONOMIA ===== */
    { id: "servicos", category: "Gastronomia", title: "Serviços", status: "confirmado",
      keywords: ["servicos", "quais sao os servicos", "o que voces fazem", "o que oferecem", "opcoes", "o que tem", "trabalham com"],
      answer: "A Mapersí trabalha com buffet completo, estações gastronômicas (como massas, fast food e cascata de chocolate), entradas servidas pela equipe, welcome drinks e open bar, e coffee break corporativo.",
      evidence: "Perfil + publicações." },

    { id: "cardapio", category: "Gastronomia", title: "Cardápios", status: "depende",
      keywords: ["cardapio", "cardapios", "menu", "catalogo", "o que servem", "pratos", "comidas", "conhecer os cardapios"],
      answer: "O cardápio é montado conforme o seu evento. A equipe envia pelo WhatsApp o catálogo com as opções e os valores. Nas nossas festas já passaram entradinhas, tortinhas, pastéis, salgados, pratos servidos em mini panelas, estação de massas, mini hambúrgueres e cascata de chocolate.",
      offerCatalog: true,
      evidence: "Caption: 'peça o catálogo com nossos valores'. Itens visíveis nos vídeos publicados." },

    { id: "personalizacao", category: "Gastronomia", title: "Personalização", status: "depende",
      keywords: ["personalizar", "personalizado", "personalizacao", "montar o cardapio", "escolher os pratos", "trocar item", "adaptar", "do meu jeito", "posso escolher"],
      answer: "Sim, é possível montar o cardápio com a equipe — em festas recentes, as entradinhas e comidas foram escolhidas a dedo pelo cliente. Os detalhes dependem do formato do seu evento.",
      startsLead: true,
      evidence: "Post 40 anos: 'comidas escolhidas a dedo pela cliente'." },

    { id: "massas", category: "Gastronomia", title: "Estação de massas", status: "confirmado",
      keywords: ["massa", "massas", "macarrao", "penne", "espaguete", "talharim", "molho", "estacao de massa", "estacao de massas"],
      answer: "Sim! A estação de massas da Mapersí é finalizada na hora no evento, com molhos e acompanhamentos para o convidado escolher.",
      setsService: "Estação de massas", startsLead: true,
      evidence: "Posts do carrinho de massas Mapersí." },

    { id: "estacoes", category: "Gastronomia", title: "Estações gastronômicas", status: "confirmado",
      keywords: ["estacao", "estacoes", "ilha gastronomica", "ilha", "cascata de chocolate", "fondue", "fast food", "hamburguer", "hamburgueres", "mini hamburguer", "milk shake", "milkshake"],
      answer: "A Mapersí tem diversas estações — já montamos estação de massas, estação fast food (com mini hambúrgueres e milk-shake) e cascata de chocolate. A equipe envia as opções disponíveis no catálogo.",
      setsService: "Estações gastronômicas", startsLead: true,
      evidence: "Posts: 'temos diversas estações', estação fast food, cascata de chocolate." },

    { id: "churrasco", category: "Gastronomia", title: "Churrasco", status: "nao_confirmado",
      keywords: ["churrasco", "churrasqueiro", "picanha", "carne na brasa", "espetinho"],
      answer: "", pending: "Confirmar se a Mapersí oferece churrasco." },

    { id: "entradas", category: "Gastronomia", title: "Entradas", status: "confirmado",
      keywords: ["entrada", "entradas", "entradinha", "entradinhas", "salgado", "salgados", "finger food", "canape", "canapes", "volante", "coxinha", "pastel", "tortinha"],
      answer: "Sim. Nas festas da Mapersí, a equipe serve entradinhas aos convidados — já passaram tortinhas, pastéis, coxinhas, croquetes e salgados em colherinhas. A seleção do seu evento é montada com a equipe.",
      setsService: "Entradas e finger food",
      evidence: "Vídeos publicados." },

    { id: "pratos", category: "Gastronomia", title: "Pratos principais", status: "depende",
      keywords: ["prato principal", "pratos principais", "jantar", "refeicao", "carne", "frango", "peixe", "arroz", "risoto", "mini panela", "panelinha"],
      answer: "Os pratos são definidos no cardápio do seu evento. Em festas recentes, por exemplo, a Mapersí serviu pratos em mini panelas de cobre. O catálogo completo vem pela equipe no WhatsApp.",
      offerCatalog: true,
      evidence: "Vídeos: mini panelas de cobre com carne e arroz." },

    { id: "sobremesas", category: "Gastronomia", title: "Sobremesas", status: "depende",
      keywords: ["sobremesa", "sobremesas", "doce", "doces", "bolo", "chocolate"],
      answer: "A cascata de chocolate é uma das estações já realizadas pela Mapersí. As demais opções de sobremesa fazem parte do catálogo enviado pela equipe.",
      pending: "Confirmar se doces finos e bolo fazem parte do serviço.",
      evidence: "Post casamento jun/2025: 'estação de cascata de chocolate'." },

    /* ===== RESTRIÇÕES ===== */
    { id: "restricoes", category: "Restrições", title: "Restrições alimentares", status: "nao_confirmado",
      keywords: ["vegetariano", "vegetariana", "vegano", "vegana", "gluten", "celiaco", "lactose", "alergia", "alergico", "alergica", "diabetes", "diabetico", "sem acucar", "kosher", "halal", "restricao", "restricoes", "intolerancia", "religiosa", "nao como carne", "sem carne", "frutos do mar"],
      answer: "", captureRestriction: true,
      pending: "Informar quais restrições a Mapersí atende (vegetariano, vegano, sem glúten, sem lactose, alergias, diabetes, religiosas)." },

    /* ===== DEGUSTAÇÃO ===== */
    { id: "degustacao", category: "Degustação", title: "Degustação", status: "nao_confirmado",
      keywords: ["degustacao", "degustar", "provar", "experimentar antes", "teste de cardapio"],
      answer: "", pending: "Informar se existe degustação, como funciona, valor, agendamento e quantas pessoas podem participar." },

    /* ===== BEBIDAS ===== */
    { id: "open_bar", category: "Bebidas", title: "Open bar e welcome drinks", status: "confirmado",
      keywords: ["open bar", "openbar", "drink", "drinks", "bartender", "barman", "welcome drink", "welcome drinks", "coquetel", "coqueteis", "caipirinha", "gin"],
      answer: "Sim. A Mapersí já realizou eventos com welcome drinks na recepção e open bar com bartender. O que entra no bar do seu evento é definido na proposta.",
      setsService: "Welcome drinks e open bar",
      evidence: "Posts: welcome drinks (casamento jun/2025); 'Buffet, open bar e estações' (15 anos)." },

    { id: "bebidas_incluidas", category: "Bebidas", title: "Bebidas incluídas", status: "nao_confirmado",
      keywords: ["bebida inclusa", "bebidas inclusas", "bebidas incluidas", "inclui bebida", "agua", "refrigerante", "refri", "suco", "sucos", "cerveja", "vinho", "vinhos", "espumante", "champagne", "bebidas"],
      answer: "", pending: "Informar quais bebidas estão incluídas em cada formato (água, refrigerante, sucos, cerveja, vinhos, espumantes)." },

    { id: "rolha", category: "Bebidas", title: "Taxa de rolha", status: "nao_confirmado",
      keywords: ["rolha", "taxa de rolha", "levar bebida", "posso levar bebida", "minha bebida"],
      answer: "", pending: "Informar política de bebidas trazidas pelo cliente / taxa de rolha." },

    /* ===== ESTRUTURA ===== */
    { id: "equipe", category: "Estrutura", title: "Equipe de serviço", status: "depende",
      keywords: ["garcom", "garcons", "garconete", "maitre", "cozinheiro", "cozinheira", "chef", "equipe", "staff", "atendimento no evento", "quem serve", "copeira"],
      answer: "Nos eventos publicados, a Mapersí trabalha com equipe de salão servindo os convidados, cozinheiro nas estações e bartender no bar. A composição da equipe para o seu evento é definida na proposta.",
      pending: "Detalhar quantos garçons por convidado, se há maître e o que está incluído.",
      evidence: "Vídeos com equipe uniformizada, cozinheiro na estação e bartender." },

    { id: "loucas", category: "Estrutura", title: "Louças, mobiliário e montagem", status: "nao_confirmado",
      keywords: ["louca", "loucas", "pratos e talheres", "talher", "talheres", "copo", "copos", "taca", "tacas", "mesa", "mesas", "cadeira", "cadeiras", "mobiliario", "toalha", "montagem", "desmontagem", "cozinha no local", "precisa de cozinha", "fogao"],
      answer: "", pending: "Informar se louças, talheres, taças, mobiliário, montagem/desmontagem estão incluídos e se é necessária cozinha no local." },

    /* ===== COMERCIAL ===== */
    { id: "preco", category: "Comercial", title: "Preço", status: "depende",
      keywords: ["preco", "precos", "valor", "valores", "quanto custa", "quanto fica", "quanto sai", "quanto e", "custo", "por pessoa", "por convidado", "orcamento", "cotacao", "tabela"],
      answer: "O valor depende das escolhas gastronômicas, do local e do formato do serviço. Mas posso deixar seu pedido praticamente pronto para a equipe 😊",
      startsLead: true, offerCatalog: true,
      evidence: "Preços não são publicados; catálogo com valores é enviado pela equipe." },

    { id: "pacotes", category: "Comercial", title: "Pacotes", status: "nao_confirmado",
      keywords: ["pacote", "pacotes", "combo", "promocao", "desconto", "promocoes"],
      answer: "", pending: "Informar se existem pacotes fechados e políticas de desconto." },

    { id: "pagamento", category: "Comercial", title: "Pagamento", status: "nao_confirmado",
      keywords: ["pagamento", "pagar", "parcelar", "parcelamento", "parcela", "parcelas", "cartao", "pix", "boleto", "sinal", "entrada do pagamento", "forma de pagamento"],
      answer: "", pending: "Informar formas de pagamento, parcelamento e sinal." },

    { id: "contrato", category: "Comercial", title: "Contrato e cancelamento", status: "nao_confirmado",
      keywords: ["contrato", "cancelar", "cancelamento", "desistir", "multa", "mudar a data", "mudanca de data", "remarcar", "adiar"],
      answer: "", pending: "Informar regras de contrato, cancelamento e mudança de data." },

    { id: "extras", category: "Comercial", title: "Convidados extras e hora extra", status: "nao_confirmado",
      keywords: ["convidado extra", "convidados extras", "hora extra", "horas extras", "duracao", "quantas horas", "tempo de servico", "horas de festa"],
      answer: "", pending: "Informar duração padrão do serviço, valor de hora extra e de convidados adicionais." },

    /* ===== AGENDA ===== */
    { id: "disponibilidade", category: "Agenda", title: "Disponibilidade de data", status: "depende",
      keywords: ["disponivel", "disponibilidade", "tem data", "data livre", "agenda", "minha data", "data disponivel", "voces estao livres", "ja tem evento"],
      answer: "A agenda é confirmada diretamente pela equipe. Me conta a data que você tem em mente e eu já deixo anotado para a consulta.",
      faqAnswer: "A agenda é confirmada diretamente pela equipe. Informe a data no orçamento aqui do site ou pelo WhatsApp e a Mapersí verifica para você.",
      askSlot: "data", startsLead: true },

    { id: "antecedencia", category: "Agenda", title: "Antecedência", status: "nao_confirmado",
      keywords: ["antecedencia", "com quanto tempo", "quanto tempo antes", "prazo", "em cima da hora", "urgente"],
      answer: "", pending: "Informar antecedência recomendada/mínima para contratação." },

    /* ===== CONTATO ===== */
    { id: "contato", category: "Contato", title: "Contato", status: "confirmado",
      keywords: ["telefone", "whatsapp", "zap", "contato", "email", "e-mail", "instagram", "falar com voces", "numero"],
      answer: "Você pode falar com a Mapersí pelo WhatsApp (21) 99352-3937, pelo e-mail contato@mapersi.com.br ou pelo Instagram @mapersibuffet." },

    { id: "endereco", category: "Contato", title: "Endereço", status: "confirmado",
      keywords: ["endereco", "onde fica", "onde voces ficam", "localizacao", "bento ribeiro", "como chegar", "rua caiena"],
      answer: "A Mapersí fica na Rua Caiena, Bento Ribeiro, Rio de Janeiro – RJ, CEP 21555-140. O buffet vai até o espaço escolhido para o seu evento." },

    { id: "horario", category: "Contato", title: "Horário de atendimento", status: "nao_confirmado",
      keywords: ["horario", "horarios", "que horas abre", "que horas fecha", "funcionamento", "atendem sabado", "atendem domingo", "horario de atendimento"],
      answer: "", pending: "Publicar horário de atendimento completo (seg–dom)." },

    { id: "avaliacoes", category: "Contato", title: "Avaliações", status: "confirmado",
      keywords: ["avaliacao", "avaliacoes", "nota", "google", "recomendam", "e bom", "sao bons", "confiavel", "depoimento", "depoimentos"],
      answer: "A Mapersí tem nota 5,0 no Google. Clientes destacam a comida, a apresentação e a equipe — uma delas escreveu: “Todos os convidados elogiaram o buffet e muitos pediram o contato de vocês.”" },

    { id: "historia", category: "Contato", title: "Tempo de mercado", status: "confirmado",
      keywords: ["desde quando", "quanto tempo", "ha quanto tempo", "anos de mercado", "experiencia", "historia", "fundada", "quando comecou"],
      answer: "Segundo a própria ficha da Mapersí no Google, a empresa atua no Rio de Janeiro desde 2018, com eventos de médio a grande porte — e os casamentos são o carro-chefe.",
      evidence: "Descrição da empresa na ficha do Google." }
  ],

  /* ------------------------------------------------------------------
     PERGUNTAS FREQUENTES (a resposta vem do tópico indicado)
     ------------------------------------------------------------------ */
  faq: [
    { q: "Que tipos de eventos a Mapersí atende?", topic: "tipos_evento" },
    { q: "Como solicito um orçamento?", answer: "Pelo orçamento interativo aqui no site ou direto no WhatsApp (21) 99352-3937. Você conta o tipo de evento, data, local e número de convidados, e a equipe envia a proposta e o catálogo com as opções.", status: "confirmado" },
    { q: "O cardápio pode ser personalizado?", topic: "personalizacao" },
    { q: "Existe degustação?", topic: "degustacao" },
    { q: "Vocês atendem restrições alimentares?", topic: "restricoes" },
    { q: "Bebidas estão incluídas?", topic: "bebidas_incluidas" },
    { q: "A equipe de serviço está incluída?", topic: "equipe" },
    { q: "Vocês atendem fora de Bento Ribeiro?", topic: "regiao" },
    { q: "Como verifico se minha data está disponível?", topic: "disponibilidade" }
  ]
};

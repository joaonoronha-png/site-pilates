/*
 * BASE DE DADOS DO SITE — Aluguel Temporada RJ
 * ------------------------------------------------------------------
 * Única fonte de informação do site: vitrine, mapa, página de cada imóvel,
 * FAQ e o assistente (local e com IA) leem tudo daqui.
 *
 * Origem dos dados (outubro/2026):
 *  - Instagram @_alugueltemporadarj (bio, legendas e artes publicadas)
 *  - Anúncios públicos no Airbnb do anfitrião Diogo (perfil 231257327)
 * Detalhes e pendências em docs/PESQUISA.md.
 *
 * Regras:
 *  - Campo null = informação ainda não confirmada. O site e o assistente
 *    dizem "a equipe confirma" em vez de inventar.
 *  - Preços NÃO são publicados até a empresa enviar a tabela oficial
 *    (preencha `diariaAPartir` em cada imóvel para exibir "a partir de").
 *  - Coordenadas dos imóveis são APROXIMADAS (as mesmas que o Airbnb exibe);
 *    o endereço exato é enviado só após a reserva.
 */
(function (root) {
  var SITE_DATA = {
    empresa: {
      nome: 'Aluguel Temporada RJ',
      operacao: 'Grupo 3D',
      slogan: 'Conforto, localização e praticidade',
      anfitriao: 'Diogo',
      instagram: '_alugueltemporadarj',
      whatsapp: '5521976331432',
      whatsappExibicao: '(21) 97633-1432',
      email: 'diogo@grupo3d.app.br',
      escritorio: {
        nome: 'Shopping Città America',
        endereco: 'Av. das Américas, 700 — Barra da Tijuca, Rio de Janeiro',
        lat: -23.0028,
        lng: -43.3212
      },
      horarioAtendimento: null,
      cnpj: null,
      // Números públicos do perfil de anfitrião no Airbnb
      airbnb: {
        perfil: 'https://www.airbnb.com.br/users/show/231257327',
        superhost: true,
        avaliacoes: 224,
        nota: '4,79',
        anosHospedando: 5,
        taxaResposta: '100%',
        tempoResposta: 'até 1 hora',
        verificadoDesde: 'outubro de 2020',
        // média dos anúncios com nota, ponderada pelo número de avaliações de cada um
        notas: {"limpeza": 4.7, "exatidao": 4.8, "checkin": 4.8, "comunicacao": 4.8, "localizacao": 5.0, "custoBeneficio": 4.7},
        distribuicao: [85, 11, 3, 1, 1],
        avaliacoesComNota: 192
      },
      // Serviços ao proprietário (post do Instagram de 11/05/2026)
      gestao: [
        'Gestão completa do imóvel',
        'Anúncios profissionais e otimizados',
        'Check-in e atendimento aos hóspedes',
        'Acompanhamento operacional',
        'Estratégia de preço',
        'Maximização da rentabilidade'
      ]
    },

    destinos: [
      {
        id: 'barra',
        nome: 'Barra da Tijuca',
        chamada: 'Orla larga, condomínios com lazer completo e a vida prática da Zona Oeste.',
        texto: 'A Avenida Lúcio Costa concentra prédios de frente para o mar, praia extensa e menos cheia que a Zona Sul, ótima para caminhar, pedalar e esportes na areia. Shoppings, mercados e restaurantes ficam a poucos minutos.',
        foto: 'assets/img/destinos/barra-orla',
        fotoAlt: 'Orla da Barra da Tijuca ao entardecer, com a Avenida Lúcio Costa e o mar',
        centro: [-23.0105, -43.345],
        zoom: 13
      },
      {
        id: 'copacabana',
        nome: 'Copacabana & Leme',
        chamada: 'O calçadão mais famoso do mundo, com o lado tranquilo do Leme.',
        texto: 'No Leme, a ponta mais calma de Copacabana, você tem padarias, mercados, farmácia, bares, restaurantes, ponto de táxi e bicicletas compartilhadas por perto, e a praia a poucos passos.',
        foto: 'assets/img/destinos/copacabana-calcadao',
        fotoAlt: 'Calçadão de Copacabana com o desenho de ondas em pedra portuguesa',
        centro: [-22.9640, -43.1730],
        zoom: 14
      },
      {
        id: 'angra',
        nome: 'Angra dos Reis',
        chamada: 'Casas em condomínio entre a mata e o mar, para reunir a família.',
        texto: 'Casas com quatro suítes em condomínio fechado com piscina, sauna e churrasqueira, acesso por terra e por mar. Embarcações para passeio e apoio de empregada podem ser contratados à parte.',
        foto: 'assets/img/destinos/angra-enseada',
        fotoAlt: 'Enseada de água verde-esmeralda cercada de mata atlântica em Angra dos Reis',
        centro: [-22.9663, -44.3330],
        zoom: 14
      }
    ],

    // Comodidades usadas nos filtros e no assistente
    comodidades: {
      vistaMar: 'Vista para o mar',
      peNaAreia: 'Frente para a praia',
      piscina: 'Piscina',
      garagem: 'Garagem',
      pet: 'Aceita pet',
      familia: 'Bom para famílias',
      homeOffice: 'Home office',
      arCondicionado: 'Ar-condicionado',
      wifi: 'Wi-Fi',
      lavaSeca: 'Lava e seca',
      academia: 'Academia',
      sauna: 'Sauna',
      churrasqueira: 'Churrasqueira',
      kitPraia: 'Kit praia',
      portaria24h: 'Portaria 24h',
      cozinha: 'Cozinha equipada'
    },

    imoveis: [
      {
        slug: 'pe-na-areia-posto-7',
        notas: {"limpeza": 4.8, "exatidao": 4.9, "checkin": 5.0, "comunicacao": 4.9, "localizacao": 4.9, "custoBeneficio": 4.8},
        distribuicao: [88, 6, 6, 0, 0],
        destaquesAirbnb: [{"titulo": "Self check-in", "texto": "Você faz o check-in com a equipe do prédio."}, {"titulo": "Aproveite para dar um mergulho", "texto": "Um dos poucos lugares da região com piscina."}, {"titulo": "Região bonita", "texto": "Os hóspedes adoram o lugar onde o imóvel fica."}],
        nome: 'Pé na Areia · Vista Mar',
        tituloAnuncio: 'Pé na Areia Barra da Tijuca Vista Mar!',
        destino: 'barra',
        bairro: 'Barra da Tijuca',
        referencia: 'Av. Lúcio Costa · região do Posto 7',
        tipo: 'Apartamento em condomínio',
        lat: -23.0099, lng: -43.3563,
        hospedes: 4, quartos: 1, camas: '1 cama queen + 1 sofá-cama de casal', banheiros: '2 banheiros e lavabo',
        nota: '4,82', avaliacoes: 17,
        destaque: 'Vista para o mar e a lagoa',
        resumo: 'Apartamento novo de frente para o mar, com suíte de cama queen, sala ampla com sofá-cama, cozinha completa e lavanderia com lava e seca. O condomínio tem piscina, sauna, academia, salão de jogos e portaria 24h.',
        descricao: [
          'Suíte com cama queen, roupa de cama de qualidade, ar-condicionado, armários planejados e vista para o mar e a lagoa.',
          'Sala ampla com vista panorâmica, sofá que vira cama de casal, Smart TV com streaming e ar-condicionado.',
          'Cozinha completa: geladeira, fogão, micro-ondas, air fryer, cafeteira e utensílios.',
          'Lavanderia com máquina lava e seca. Wi-Fi de alta velocidade.',
          'Vaga de garagem para 1 carro. Lazer do condomínio: piscina, sauna, academia e salão de jogos.'
        ],
        comodidades: ['vistaMar', 'peNaAreia', 'piscina', 'garagem', 'pet', 'familia', 'homeOffice', 'arCondicionado', 'wifi', 'lavaSeca', 'academia', 'sauna', 'portaria24h', 'cozinha', 'kitPraia'],
        regras: { checkin: '14h às 23h', checkout: 'até 11h', selfCheckin: 'com a equipe do prédio', pet: true, fumar: true, festas: null },
        fotos: [
          { src: 'assets/img/imoveis/golden-coast/varanda-mar', alt: 'Varanda envidraçada com poltronas e vista para o mar da Barra' },
          { src: 'assets/img/imoveis/golden-coast/sala-jantar', alt: 'Sala integrada com mesa de jantar redonda e cozinha azul ao fundo' },
          { src: 'assets/img/imoveis/golden-coast/vista-praia', alt: 'Vista do alto para a praia e o mar verde-azulado' },
          { src: 'assets/img/imoveis/golden-coast/quarto-vista', alt: 'Quarto com cama de casal e janela para os prédios da orla' },
          { src: 'assets/img/imoveis/golden-coast/sala-sofa', alt: 'Sofá bege com almofadas e quadros do Rio na parede' },
          { src: 'assets/img/imoveis/golden-coast/cozinha', alt: 'Cozinha com armários azul-petróleo, geladeira inox e cooktop' },
          { src: 'assets/img/imoveis/golden-coast/varanda-vista', alt: 'Varanda com vista para a orla e a lagoa' },
          { src: 'assets/img/imoveis/golden-coast/sofa-cama', alt: 'Sofá-cama aberto como cama de casal na sala' },
          { src: 'assets/img/imoveis/golden-coast/quarto-1', alt: 'Quarto com cama arrumada, ar-condicionado e TV' },
          { src: 'assets/img/imoveis/golden-coast/banheiro', alt: 'Banheiro com box de vidro e bancada de mármore' },
          { src: 'assets/img/imoveis/golden-coast/tv-painel', alt: 'Painel ripado com Smart TV e puffs' },
          { src: 'assets/img/imoveis/golden-coast/lava-e-seca', alt: 'Máquina lava e seca na lavanderia' }
        ],
        fotosProprias: true,
        airbnb: 'https://www.airbnb.com.br/rooms/1557376732602645344',
        diariaAPartir: null
      },
      {
        slug: 'posto-4-varanda',
        notas: {"limpeza": 4.7, "exatidao": 4.8, "checkin": 4.7, "comunicacao": 4.8, "localizacao": 5.0, "custoBeneficio": 4.6},
        distribuicao: [85, 10, 4, 0, 1],
        destaquesAirbnb: [{"titulo": "Self check-in", "texto": "Você faz o check-in com a equipe do prédio."}, {"titulo": "Região bonita", "texto": "Os hóspedes adoram o lugar onde o imóvel fica."}, {"titulo": "Espaço de trabalho exclusivo", "texto": "Um canto com mesa, ideal para trabalhar."}],
        nome: 'Posto 4 · Varanda envidraçada',
        tituloAnuncio: 'Pé na Areia | Vista Mar | Barra da Tijuca',
        destino: 'barra',
        bairro: 'Barra da Tijuca',
        referencia: 'Av. Lúcio Costa · Posto 4 · complexo Wyndham Rio Barra',
        tipo: 'Apartamento particular em complexo hoteleiro',
        lat: -23.0109, lng: -43.3270,
        hospedes: 4, quartos: 1, camas: '1 cama king + 1 sofá-cama', banheiros: '1 banheiro',
        nota: '4,77', avaliacoes: 73,
        destaque: 'Kit praia e limpeza diária',
        resumo: 'Quarto e sala renovado, com vista frontal para o mar, dentro do complexo do hotel Wyndham. Inclui serviço de praia, toalhas para a piscina, academia com professor e limpeza diária básica.',
        descricao: [
          'Quarto com cama king, luzes de leitura e Smart TV. Sala com sofá-cama e escrivaninha.',
          'Cozinha integrada e equipada. Wi-Fi, ar-condicionado e voltagem 220V.',
          'Varanda com fechamento em vidro, mesa com quatro cadeiras e varal.',
          'Serviço de praia incluído: cartão para retirar 2 cadeiras, 1 guarda-sol e toalhas.',
          'No prédio: restaurante Paris 6, pizzaria, cafeteria e academia com professor. Limpeza diária básica incluída.',
          'Apartamento residencial particular dentro do complexo do hotel; não é operado como quarto de hotel.'
        ],
        comodidades: ['vistaMar', 'peNaAreia', 'pet', 'familia', 'homeOffice', 'arCondicionado', 'wifi', 'academia', 'kitPraia', 'portaria24h', 'cozinha'],
        regras: { checkin: '14h às 23h', checkout: 'até 11h', selfCheckin: 'com a equipe do prédio', pet: true, fumar: true, festas: null },
        fotos: [
          { src: 'assets/img/imoveis/posto-4-varanda/varanda', alt: 'Varanda envidraçada com mesa posta e vista para o mar' },
          { src: 'assets/img/imoveis/posto-4-varanda/banheiro', alt: 'Banheiro com bancada iluminada e box de vidro' },
          { src: 'assets/img/imoveis/posto-4-varanda/box', alt: 'Box com chuveiro e iluminação embutida' },
          { src: 'assets/img/imoveis/posto-4-varanda/hidro', alt: 'Banheira de hidromassagem' },
          { src: 'assets/img/imoveis/posto-4-varanda/lavabo', alt: 'Bancada do banheiro com espelho' }
        ],
        fotosProprias: true,
        airbnb: 'https://www.airbnb.com.br/rooms/817955217293854228',
        diariaAPartir: null
      },
      {
        slug: 'posto-4-vista-frontal',
        notas: {"limpeza": 4.7, "exatidao": 4.8, "checkin": 4.9, "comunicacao": 4.8, "localizacao": 5.0, "custoBeneficio": 4.7},
        distribuicao: [85, 11, 2, 2, 0],
        destaquesAirbnb: [{"titulo": "Self check-in", "texto": "Você faz o check-in com a equipe do prédio."}, {"titulo": "Região bonita", "texto": "Os hóspedes adoram o lugar onde o imóvel fica."}, {"titulo": "Espaço de trabalho exclusivo", "texto": "Um canto com mesa, ideal para trabalhar."}],
        nome: 'Posto 4 · Vista frontal',
        tituloAnuncio: 'Pé na Areia | Vista Mar | Barra da Tijuca',
        destino: 'barra',
        bairro: 'Barra da Tijuca',
        referencia: 'Av. Lúcio Costa · Posto 4 · complexo Wyndham Rio Barra',
        tipo: 'Apartamento particular em complexo hoteleiro',
        lat: -23.0106, lng: -43.3276,
        hospedes: 4, quartos: 1, camas: '1 cama king + 1 sofá-cama', banheiros: '2 banheiros',
        nota: '4,79', avaliacoes: 53,
        destaque: 'Cama king e vista frontal',
        resumo: 'Quarto e sala espaçoso e renovado no mesmo complexo do Posto 4, com cama king, TV a cabo, sofá-cama e cozinha conjugada equipada. Serviço de praia e limpeza diária básica incluídos.',
        descricao: [
          'Quarto com cama king, luzes de leitura e TV a cabo.',
          'Sala com sofá-cama, escrivaninha e TV a cabo; cozinha conjugada inteiramente equipada.',
          'Wi-Fi gratuito, ar-condicionado e vista frontal para o mar. Voltagem 220V.',
          'Serviço de praia incluído: 2 cadeiras, 1 guarda-sol e toalhas, conforme o número de hóspedes.',
          'Academia com professor, restaurante Paris 6, pizzaria e cafeteria no próprio prédio.'
        ],
        comodidades: ['vistaMar', 'peNaAreia', 'pet', 'familia', 'homeOffice', 'arCondicionado', 'wifi', 'academia', 'kitPraia', 'portaria24h', 'cozinha', 'lavaSeca'],
        regras: { checkin: '14h às 23h', checkout: 'até 11h', selfCheckin: 'com a equipe do prédio', pet: true, fumar: true, festas: null },
        fotos: [
          { src: 'assets/img/imoveis/posto-4-vista-frontal/varanda', alt: 'Varanda envidraçada com mesa e vista para o mar da Barra' },
          { src: 'assets/img/imoveis/posto-4-vista-frontal/quarto', alt: 'Quarto com cama king, roupa de cama azul e quadros coloridos do Rio' },
          { src: 'assets/img/imoveis/posto-4-vista-frontal/quarto-cortina', alt: 'Quarto com cortinas e acesso à sala' },
          { src: 'assets/img/imoveis/posto-4-vista-frontal/closet', alt: 'Arara aberta e porta para o banheiro' },
          { src: 'assets/img/imoveis/posto-4-vista-frontal/quadros', alt: 'Quadros coloridos com o Cristo e o bondinho na cabeceira' }
        ],
        fotosProprias: true,
        airbnb: 'https://www.airbnb.com.br/rooms/1039367415458649056',
        diariaAPartir: null
      },
      {
        slug: 'flat-vista-mar',
        notas: {"limpeza": 5.0, "exatidao": 5.0, "checkin": 5.0, "comunicacao": 5.0, "localizacao": 4.7, "custoBeneficio": 4.7},
        distribuicao: [67, 33, 0, 0, 0],
        destaquesAirbnb: [{"titulo": "Self check-in", "texto": "Você faz o check-in com a equipe do prédio."}, {"titulo": "Aproveite para dar um mergulho", "texto": "Um dos poucos lugares da região com piscina."}, {"titulo": "Espaço de trabalho exclusivo", "texto": "Um canto com mesa, ideal para trabalhar."}],
        nome: 'Flat Vista Mar',
        tituloAnuncio: 'Flat Funcional e Seguro com Vista para o Mar',
        destino: 'barra',
        bairro: 'Barra da Tijuca',
        referencia: 'Orla da Barra da Tijuca',
        tipo: 'Flat em condomínio',
        lat: -23.0101, lng: -43.3281,
        hospedes: 4, quartos: 1, camas: '1 cama king + 1 sofá-cama', banheiros: '1 banheiro',
        nota: '4,67', avaliacoes: 3,
        destaque: 'Varanda de frente para o mar',
        resumo: 'Flat de frente para o mar pensado para lazer e trabalho: cama king, Smart TV giratória, ar-condicionado central e varanda com mesa. O condomínio tem piscina, academia, sauna, área kids e espaço pet.',
        descricao: [
          'Cama king e Smart TV giratória, que pode ser vista da cama ou da sala.',
          'Sofá-cama para receber até 4 pessoas. Ar-condicionado central com controle de temperatura.',
          'Varanda com vista para o mar e mesa para café ou trabalho.',
          'Cozinha compacta: frigobar, micro-ondas, air fryer, fogão elétrico de duas bocas, cafeteira e chaleira elétrica.',
          'Lazer: piscina, academia, sauna, área kids e espaço pet.'
        ],
        comodidades: ['vistaMar', 'peNaAreia', 'piscina', 'pet', 'familia', 'homeOffice', 'arCondicionado', 'academia', 'sauna', 'kitPraia', 'portaria24h', 'cozinha'],
        regras: { checkin: '14h às 23h', checkout: 'até 11h', selfCheckin: 'com a equipe do prédio', pet: true, fumar: true, festas: null },
        fotos: [
          { src: 'assets/img/imoveis/flat-vista-mar/varanda', alt: 'Varanda com mesa e cadeiras de frente para o mar e coqueiros' },
          { src: 'assets/img/imoveis/flat-vista-mar/quarto', alt: 'Cama king com cabideiro e espelho' },
          { src: 'assets/img/imoveis/flat-vista-mar/integrado', alt: 'Ambiente integrado com cama, sala e Smart TV' },
          { src: 'assets/img/imoveis/flat-vista-mar/sala', alt: 'Mesa de jantar e sala com TV giratória' },
          { src: 'assets/img/imoveis/flat-vista-mar/ar', alt: 'Cama king com ar-condicionado central' }
        ],
        fotosProprias: true,
        airbnb: 'https://www.airbnb.com.br/rooms/1652909773468714822',
        diariaAPartir: null
      },
      {
        slug: 'leme-copacabana',
        notas: {"limpeza": 5.0, "exatidao": 4.9, "checkin": 4.9, "comunicacao": 5.0, "localizacao": 5.0, "custoBeneficio": 5.0},
        distribuicao: [94, 6, 0, 0, 0],
        destaquesAirbnb: [{"titulo": "Região bonita", "texto": "Os hóspedes adoram o lugar onde o imóvel fica."}, {"titulo": "Espaço de trabalho exclusivo", "texto": "Um canto com mesa, ideal para trabalhar."}],
        nome: 'Leme · Copacabana',
        tituloAnuncio: 'Praia, lazer e charme Copacabana/Leme',
        destino: 'copacabana',
        bairro: 'Leme',
        referencia: 'Leme, a poucos passos das praias do Leme e de Copacabana',
        tipo: 'Apartamento',
        lat: -22.9623, lng: -43.1702,
        hospedes: 4, quartos: 1, camas: '1 cama de casal + 1 sofá-cama', banheiros: '1 banheiro',
        nota: '4,94', avaliacoes: 17,
        destaque: 'Nota mais alta: 4,94',
        resumo: 'Refúgio no Leme, ao lado de Copacabana: quarto com cama de casal, sala com sofá-cama e Smart TV, espaço para trabalhar e cozinha americana completa com lava e seca. Portaria 24h.',
        descricao: [
          'Quarto com cama de casal; sala aconchegante com sofá-cama, Smart TV, mesa de jantar e espaço de trabalho.',
          'Cozinha americana: geladeira, filtro de água, fogão 4 bocas com forno, micro-ondas, sanduicheira, liquidificador e espremedor.',
          'Máquina de lavar e secar, tanque e varal.',
          'Vizinhança com padarias, mercados, lavanderia, farmácia, bares, restaurantes, ponto de táxi e bicicletas compartilhadas.',
          'Portaria com porteiro 24 horas.'
        ],
        comodidades: ['pet', 'homeOffice', 'arCondicionado', 'wifi', 'lavaSeca', 'portaria24h', 'cozinha'],
        regras: { checkin: 'a partir das 14h', checkout: 'até 11h', selfCheckin: null, pet: true, fumar: false, festas: false },
        fotos: [
          { src: 'assets/img/imoveis/leme-copacabana/quarto-janela', alt: 'Quarto com cama de casal, toalhas e janela para o bairro' },
          { src: 'assets/img/imoveis/leme-copacabana/quarto', alt: 'Quarto com cama de casal e piso de madeira' },
          { src: 'assets/img/imoveis/leme-copacabana/cama', alt: 'Cama de casal com toalhas dobradas e quadros' },
          { src: 'assets/img/imoveis/leme-copacabana/armario', alt: 'Quarto com armário embutido' },
          { src: 'assets/img/imoveis/leme-copacabana/copacabana-palace', alt: 'Fachada do Copacabana Palace, no bairro' }
        ],
        fotosProprias: true,
        airbnb: 'https://www.airbnb.com.br/rooms/1498554057277095747',
        diariaAPartir: null
      },
      {
        slug: 'angra-ponta-da-cruz',
        notas: {"limpeza": 4.7, "exatidao": 4.7, "checkin": 4.7, "comunicacao": 4.8, "localizacao": 4.8, "custoBeneficio": 4.6},
        distribuicao: [79, 14, 3, 0, 3],
        destaquesAirbnb: [{"titulo": "Self check-in", "texto": "Você faz o check-in com a equipe do prédio."}, {"titulo": "Aproveite para dar um mergulho", "texto": "Um dos poucos lugares da região com piscina."}, {"titulo": "Localização nota máxima", "texto": "100% dos hóspedes nos últimos 12 meses deram 5 estrelas para a localização."}],
        nome: 'Casa Ponta da Cruz',
        tituloAnuncio: 'Casa Angra dos Reis Ponta da Cruz',
        destino: 'angra',
        bairro: 'Angra dos Reis',
        referencia: 'Ponta da Cruz · condomínio fechado com 12 casas',
        tipo: 'Casa em condomínio',
        lat: -22.9662, lng: -44.3328,
        hospedes: 14, quartos: 4, camas: '8 camas: queen, king, solteiro e beliches', banheiros: '5 banheiros',
        nota: '4,66', avaliacoes: 29,
        destaque: '4 suítes · até 14 hóspedes',
        resumo: 'Casa em condomínio fechado com 4 suítes climatizadas com Smart TV, cozinha equipada, sala com cervejeira e adega e varanda entre a floresta e o mar. Piscina, sauna e churrasqueira no condomínio.',
        descricao: [
          '4 suítes com ar-condicionado e Smart TV: 2 com cama queen e beliche, 2 com cama queen e cama de solteiro.',
          'Cozinha equipada; sala ampla com Smart TV, cervejeira e adega.',
          'Varanda com vista para a mata e o mar.',
          'Condomínio com 12 casas, piscina, sauna e churrasqueira; elevador ou escadas até a área de lazer.',
          'Acesso fácil por terra e por mar. Empregada e embarcações para passeio podem ser contratadas à parte.'
        ],
        comodidades: ['vistaMar', 'piscina', 'garagem', 'pet', 'familia', 'arCondicionado', 'sauna', 'churrasqueira', 'cozinha', 'kitPraia', 'lavaSeca'],
        regras: { checkin: 'a partir das 14h', checkout: 'até 11h', selfCheckin: 'com a equipe do condomínio', pet: true, fumar: true, festas: null },
        extras: ['Embarcações para locação', 'Empregada (à parte)'],
        fotos: [
          { src: 'assets/img/imoveis/angra-ponta-da-cruz/deck', alt: 'Deck com guarda-sol e espreguiçadeiras de frente para a piscina e o mar' },
          { src: 'assets/img/imoveis/angra-ponta-da-cruz/suite-beliche', alt: 'Suíte com cama de casal e beliche' },
          { src: 'assets/img/imoveis/angra-ponta-da-cruz/suite-solteiro', alt: 'Suíte com duas camas e ar-condicionado' },
          { src: 'assets/img/imoveis/angra-ponta-da-cruz/suite-varanda', alt: 'Suíte com cama de casal e porta para a varanda' },
          { src: 'assets/img/imoveis/angra-ponta-da-cruz/banheiro', alt: 'Banheiro com box de vidro' }
        ],
        fotosProprias: true,
        airbnb: 'https://www.airbnb.com.br/rooms/1048001493329016828',
        diariaAPartir: null
      },
      {
        slug: 'angra-paraiso',
        notas: null,
        distribuicao: null,
        destaquesAirbnb: [{"titulo": "Self check-in", "texto": "Você faz o check-in com a equipe do prédio."}, {"titulo": "Aproveite para dar um mergulho", "texto": "Um dos poucos lugares da região com piscina."}, {"titulo": "Espaço de trabalho exclusivo", "texto": "Um canto com mesa, ideal para trabalhar."}],
        nome: 'Paraíso em Angra',
        tituloAnuncio: 'Paraiso em Angra Casa na Praia com Vista Incrível',
        destino: 'angra',
        bairro: 'Angra dos Reis',
        referencia: 'Casa na praia em condomínio fechado',
        tipo: 'Casa em condomínio',
        lat: -22.9664, lng: -44.3331,
        hospedes: 10, quartos: 4, camas: 'Camas queen e de solteiro', banheiros: '4 banheiros',
        nota: null, avaliacoes: 1,
        destaque: 'Novidade · casa na praia',
        resumo: 'Casa na praia em condomínio fechado com 4 suítes climatizadas, cozinha equipada, sala com cervejeira e adega e varanda com vista. Condomínio com piscina, sauna e churrasqueira.',
        descricao: [
          '4 suítes com ar-condicionado e Smart TV: 2 com cama queen e 2 com cama queen e cama de solteiro.',
          'Cozinha equipada; sala ampla com Smart TV, cervejeira e adega.',
          'Varanda com integração entre a floresta e o mar.',
          'Condomínio com piscina, sauna e churrasqueira.',
          'Empregada e embarcações para passeio podem ser contratadas à parte.'
        ],
        comodidades: ['vistaMar', 'peNaAreia', 'piscina', 'garagem', 'pet', 'familia', 'arCondicionado', 'sauna', 'churrasqueira', 'cozinha', 'lavaSeca'],
        regras: { checkin: '14h às 23h', checkout: 'até 11h', selfCheckin: 'com a equipe do condomínio', pet: true, fumar: true, festas: null },
        extras: ['Embarcações para locação', 'Empregada (à parte)'],
        fotos: [
          { src: 'assets/img/imoveis/angra-paraiso/varanda', alt: 'Varanda com vista para a baía de Angra e as montanhas' },
          { src: 'assets/img/imoveis/angra-paraiso/sala', alt: 'Sala ampla integrada à cozinha com vista para o mar' },
          { src: 'assets/img/imoveis/angra-paraiso/jantar', alt: 'Mesa de jantar e sala de estar com piso de mármore' },
          { src: 'assets/img/imoveis/angra-paraiso/varanda-gourmet', alt: 'Varanda gourmet com poltronas e mata ao redor' },
          { src: 'assets/img/imoveis/angra-paraiso/estar', alt: 'Sala de estar com sofá grande e janelas para a baía' },
          { src: 'assets/img/imoveis/angra-paraiso/banheiro', alt: 'Banheiro com cuba de apoio e iluminação' }
        ],
        fotosProprias: true,
        airbnb: 'https://www.airbnb.com.br/rooms/1619235972857807274',
        diariaAPartir: null
      }
    ],

    // Avaliações reais (perfil público do anfitrião no Airbnb, set/2026)
    avaliacoes: [
      { nome: 'Matías', origem: 'Buenos Aires, Argentina', data: 'setembro de 2026', nota: 5, traduzido: 'espanhol',
        texto: 'Nós adoramos mesmo. O apartamento é moderno e exatamente como nas fotos. O Diogo estava sempre disposto a ajudar e respondeu prontamente a todas as perguntas. Localização à beira-mar e uma bela vista da varanda! A piscina é aquecida, dá para usar o ano todo. Voltaríamos sem dúvida!' },
      { nome: 'Michelle', origem: 'Brasil', data: 'setembro de 2026', nota: 5, traduzido: null,
        texto: 'Adorei a estadia! O apartamento é excelente, muito confortável, organizado e super bem equipado, com tudo o que precisamos para nos sentirmos em casa. A localização também é ótima, próxima a tudo: mercado, padaria, restaurantes e vários comércios.' },
      { nome: 'Cristian', origem: 'Santiago, Chile', data: 'setembro de 2026', nota: 5, traduzido: 'espanhol',
        texto: 'O apartamento corresponde totalmente ao que está descrito no anúncio. A localização é muito boa, a uma curta caminhada da praia, e a piscina é ótima, especialmente para quem vai com crianças. Tudo funcionando perfeitamente. Altamente recomendado.' },
      { nome: 'Oussama', origem: 'Nova York, EUA', data: 'setembro de 2026', nota: 5, traduzido: 'inglês',
        texto: 'Airbnb limpo e aconchegante. Recomendo muito se você quiser ter uma estadia agradável no Rio.' },
      { nome: 'Alexandre', origem: 'Florianópolis, Brasil', data: 'outubro de 2026', nota: 5, traduzido: null,
        texto: 'Bem legal, bem atenciosos.' }
    ],

    /*
     * FAQ e respostas do assistente.
     * status: 'confirmado' | 'depende' (varia por imóvel) | 'pendente' (a empresa precisa informar)
     */
    faq: [
      { id: 'reserva', status: 'confirmado', categoria: 'Reserva',
        pergunta: 'Como faço para reservar?',
        resposta: 'Escolha o imóvel, informe as datas e o número de hóspedes e toque em "Consultar disponibilidade". A conversa abre no WhatsApp (21) 97633-1432 com tudo preenchido, e a equipe confirma valores e disponibilidade. Todos os imóveis também podem ser reservados pelo Airbnb.',
        palavras: ['reservar', 'reserva', 'como alugar', 'como funciona', 'agendar', 'fechar'] },
      { id: 'disponibilidade', status: 'confirmado', categoria: 'Reserva',
        pergunta: 'Como sei se o imóvel está disponível nas minhas datas?',
        resposta: 'A disponibilidade muda todo dia. Envie as datas pelo botão de consulta do imóvel (vai pelo WhatsApp) ou confira o calendário no anúncio do Airbnb. O anfitrião responde em até 1 hora.',
        palavras: ['disponivel', 'disponibilidade', 'livre', 'vaga', 'tem data', 'calendario', 'ocupado'] },
      { id: 'precos', status: 'pendente', categoria: 'Valores',
        pergunta: 'Quanto custa a diária?',
        resposta: 'O valor depende do imóvel, da data e do número de hóspedes; feriados, Carnaval, Réveillon e alta temporada têm tarifa própria. Peça o orçamento das suas datas pelo WhatsApp que a equipe responde com o valor fechado.',
        palavras: ['preco', 'valor', 'quanto', 'diaria', 'custa', 'orcamento', 'barato', 'caro', 'tarifa'] },
      { id: 'checkin', status: 'confirmado', categoria: 'Estadia',
        pergunta: 'Qual o horário de check-in e check-out?',
        resposta: 'Check-in a partir das 14h (nos apartamentos da Barra, entre 14h e 23h) e check-out até as 11h. Nos prédios com portaria, o self check-in é feito com a equipe do edifício.',
        palavras: ['check-in', 'checkin', 'check in', 'entrada', 'checkout', 'check-out', 'saida', 'horario', 'chegar', 'chave', 'chaves'] },
      { id: 'pet', status: 'depende', categoria: 'Estadia',
        pergunta: 'Posso levar meu pet?',
        resposta: 'Sim, todos os anúncios atuais aceitam animais de estimação. Avise na reserva o porte e quantos pets vão, para a equipe confirmar as regras do condomínio.',
        palavras: ['pet', 'cachorro', 'cao', 'gato', 'animal', 'animais', 'perro', 'mascota', 'dog'] },
      { id: 'criancas', status: 'confirmado', categoria: 'Estadia',
        pergunta: 'É bom para viajar com crianças?',
        resposta: 'Sim. O Flat Vista Mar tem área kids no condomínio, o Pé na Areia (Posto 7) tem piscina, e as casas de Angra recebem até 14 pessoas com piscina e churrasqueira no condomínio. Bebês e crianças contam no total de hóspedes informado na reserva.',
        palavras: ['crianca', 'criancas', 'filho', 'filhos', 'bebe', 'familia', 'kids', 'infantil', 'ninos'] },
      { id: 'garagem', status: 'depende', categoria: 'Estadia',
        pergunta: 'Os imóveis têm garagem?',
        resposta: 'O Pé na Areia (Posto 7) tem 1 vaga de garagem e as casas de Angra têm estacionamento. Nos outros, pergunte à equipe sobre estacionamento no prédio ou nas proximidades.',
        palavras: ['garagem', 'vaga', 'estacionamento', 'estacionar', 'carro'] },
      { id: 'enxoval', status: 'depende', categoria: 'Estadia',
        pergunta: 'Tem roupa de cama e toalhas?',
        resposta: 'O Pé na Areia (Posto 7) inclui toalhas, lençóis, cobertores e travesseiros extras. Nos apartamentos do Posto 4 há cartão para retirar toalhas de piscina e o kit praia. Para os demais imóveis, a equipe confirma o enxoval na reserva.',
        palavras: ['roupa de cama', 'lencol', 'toalha', 'toalhas', 'enxoval', 'travesseiro', 'cobertor'] },
      { id: 'kitpraia', status: 'depende', categoria: 'Estadia',
        pergunta: 'Tem cadeira e guarda-sol de praia?',
        resposta: 'Nos dois apartamentos do Posto 4 o serviço de praia está incluído: 2 cadeiras, 1 guarda-sol e toalhas, conforme o número de hóspedes. Nos demais, confirme com a equipe.',
        palavras: ['cadeira', 'guarda-sol', 'guarda sol', 'kit praia', 'servico de praia', 'barraca'] },
      { id: 'wifi', status: 'confirmado', categoria: 'Estadia',
        pergunta: 'Tem Wi-Fi para trabalhar?',
        resposta: 'Sim. Os apartamentos têm Wi-Fi e espaço de trabalho; o Flat Vista Mar tem mesa na varanda de frente para o mar e o Leme tem área de home office na sala.',
        palavras: ['wifi', 'wi-fi', 'internet', 'home office', 'trabalhar', 'trabalho', 'remoto'] },
      { id: 'festas', status: 'depende', categoria: 'Regras',
        pergunta: 'Posso fazer festas ou receber visitas?',
        resposta: 'Festas e eventos não são permitidos no apartamento do Leme. Nos demais, visitas e eventos dependem das regras de cada condomínio: pergunte à equipe antes de reservar.',
        palavras: ['festa', 'festas', 'evento', 'visita', 'visitas', 'aniversario', 'som alto', 'barulho'] },
      { id: 'fumar', status: 'depende', categoria: 'Regras',
        pergunta: 'É permitido fumar?',
        resposta: 'No Leme é proibido fumar na unidade. Nos demais anúncios é permitido, de acordo com as regras do condomínio.',
        palavras: ['fumar', 'cigarro', 'fumante'] },
      { id: 'cancelamento', status: 'pendente', categoria: 'Valores',
        pergunta: 'Qual a política de cancelamento?',
        resposta: 'Pelo Airbnb vale a política escolhida no momento da reserva. Para reservas diretas, a equipe informa as condições de cancelamento junto com o orçamento.',
        palavras: ['cancelar', 'cancelamento', 'reembolso', 'desistir', 'devolucao'] },
      { id: 'pagamento', status: 'pendente', categoria: 'Valores',
        pergunta: 'Quais as formas de pagamento?',
        resposta: 'No Airbnb, o pagamento é feito pela plataforma. Para reservas diretas, a equipe informa as formas aceitas, sinal e caução, se houver, junto com o orçamento.',
        palavras: ['pagamento', 'pagar', 'pix', 'cartao', 'parcelar', 'sinal', 'caucao', 'deposito', 'taxa de limpeza', 'limpeza'] },
      { id: 'minimo', status: 'pendente', categoria: 'Valores',
        pergunta: 'Existe número mínimo de diárias?',
        resposta: 'O mínimo de noites varia por imóvel e por data (feriados e Réveillon costumam ter pacotes). Envie suas datas que a equipe confirma.',
        palavras: ['minimo', 'quantas noites', 'diarias minimas', 'uma noite', 'pacote'] },
      { id: 'longas', status: 'confirmado', categoria: 'Reserva',
        pergunta: 'Aceitam estadias longas?',
        resposta: 'Sim, os anúncios aceitam estadias de 28 dias ou mais, para quem vem trabalhar, estudar ou passar uma temporada.',
        palavras: ['mes', 'mensal', 'longa', 'longo prazo', 'temporada longa', '30 dias', '28 dias'] },
      { id: 'barco', status: 'depende', categoria: 'Passeios',
        pergunta: 'Tem passeio de barco em Angra?',
        resposta: 'Sim. Quem se hospeda nas casas de Angra pode contratar embarcações para passeio, com valor à parte. Peça as opções pelo WhatsApp.',
        palavras: ['barco', 'lancha', 'escuna', 'passeio de barco', 'ilha', 'ilhas', 'embarcacao'] },
      { id: 'cambio', status: 'confirmado', categoria: 'Passeios',
        pergunta: 'Vocês ajudam com passeios e câmbio?',
        resposta: 'O anfitrião também tem uma agência de turismo e câmbio na Barra da Tijuca. Peça indicações de passeios e cotação de câmbio pelo WhatsApp.',
        palavras: ['cambio', 'dolar', 'dolares', 'peso', 'pesos', 'euro', 'trocar dinheiro', 'turismo', 'agencia', 'passeio', 'passeios', 'tour', 'cristo', 'pao de acucar'] },
      { id: 'escritorio', status: 'confirmado', categoria: 'Atendimento',
        pergunta: 'Onde fica o escritório?',
        resposta: 'No Shopping Città America, Av. das Américas, 700, Barra da Tijuca. O atendimento é feito principalmente pelo WhatsApp (21) 97633-1432.',
        palavras: ['escritorio', 'endereco', 'onde fica', 'onde voces', 'citta', 'loja', 'atendimento presencial'] },
      { id: 'proprietario', status: 'confirmado', categoria: 'Proprietários',
        pergunta: 'Tenho um imóvel. Vocês administram?',
        resposta: 'Sim. O Grupo 3D faz a gestão completa de imóveis para temporada no Rio: preparação, anúncios profissionais, atendimento e check-in dos hóspedes, acompanhamento operacional e estratégia de preço.',
        palavras: ['proprietario', 'tenho um imovel', 'tenho um apartamento', 'meu imovel', 'meu apartamento', 'administrar', 'administracao', 'gestao', 'anunciar', 'renda', 'rentabilidade', 'investir'] }
    ]
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = SITE_DATA;
  else root.SITE_DATA = SITE_DATA;
})(typeof window !== 'undefined' ? window : globalThis);

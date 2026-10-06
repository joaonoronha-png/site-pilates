/**
 * Fonte única de verdade do site.
 *
 * Regra: só entram aqui informações confirmadas em fontes públicas, cada uma
 * com a referência em `sources`. O que não foi confirmado fica `null` e o site
 * (e o Assistente BCM) responde que a informação não está publicada, em vez
 * de supor. Para atualizar dados, edite somente este arquivo.
 */

export const SOURCES = {
  siteMarina: {
    label: 'Site oficial da Dra. Marina Bittencourt',
    url: 'https://dramarinabittencourt.com.br/',
  },
  googleListing: {
    label: 'Ficha pública "BCM Dermatologia Especializada" (Google / Waze)',
    url: 'https://www.waze.com/live-map/directions/br/rj/bcm-dermatologia-especializada?to=place.ChIJCzinkQrbmwARBV0U_F-tdX8',
  },
  cnpj: {
    label: 'Registro público do CNPJ 30.776.724/0001-92 (Receita Federal, via Econodata / Casa dos Dados)',
    url: 'https://www.econodata.com.br/consulta-empresa/30776724000192-bcm-dermatologia-ltda',
  },
  doctoraliaBruna: {
    label: 'Perfil público da Dra. Bruna Duque Estrada (Doctoralia)',
    url: 'https://www.doctoralia.com.br/bruna-duque-estrada-pinto-keddi/dermatologista/rio-de-janeiro',
  },
  doctoraliaMarina: {
    label: 'Perfil público da Dra. Marina Bittencourt (Doctoralia)',
    url: 'https://www.doctoralia.com.br/marina-bittencourt/dermatologista/rio-de-janeiro',
  },
  azulayDocentes: {
    label: 'Corpo docente do Instituto de Dermatologia Prof. Rubem David Azulay (Santa Casa do RJ)',
    url: 'https://santacasadermatoazulay.com.br/corpo-docente-2/',
  },
  trichologyClub: {
    label: 'Perfil docente da Dra. Bruna Duque Estrada (Trichology Club Academy)',
    url: 'https://trichologyclubacademy.eadplataforma.app/teacher/144',
  },
  consensoAlopecia: {
    label: 'II Consenso da SBD para o tratamento da alopecia areata — Anais Brasileiros de Dermatologia, 2025',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11962811/',
  },
  estudoVitiligo: {
    label: 'Pomada de tacrolimo 0,1% no tratamento de vitiligo: série de casos — Anais Brasileiros de Dermatologia, 2011',
    url: 'https://www.scielo.br/j/abd/a/3JwbDsRHkHfT8Z3Ry9X4CrR/?lang=pt',
  },
  doctoraliaCarla: {
    label: 'Listagem pública da Dra. Carla Helena Fontes Tamler (Doctoralia)',
    url: 'https://www.doctoralia.com.br/dermatologista/rio-de-janeiro/leblon?page=4',
  },
};

export const clinic = {
  name: 'BCM Dermatologia Especializada',
  shortName: 'BCM',
  legalName: 'BCM Dermatologia Ltda',
  cnpj: '30.776.724/0001-92',
  foundedYear: 2018,
  foundedDate: '2018-06-25',
  specialty: 'Dermatologia',
  address: {
    street: 'Av. das Américas, 2480',
    complement: 'Bloco 3, Sala S120',
    district: 'Barra da Tijuca',
    city: 'Rio de Janeiro',
    state: 'RJ',
    postalCode: '22640-101',
    country: 'BR',
  },
  phone: { display: '(21) 3549-0047', e164: '+552135490047' },
  // Publicado no site oficial da Dra. Marina Bittencourt, na seção da unidade BCM.
  whatsapp: { display: '(21) 97116-4164', number: '5521971164164' },
  email: null,
  instagram: null, // perfil institucional não localizado
  website: null,
  hours: [
    { day: 'Segunda-feira', short: 'Seg', schema: 'Monday', opens: '08:00', closes: '20:00' },
    { day: 'Terça-feira', short: 'Ter', schema: 'Tuesday', opens: '08:00', closes: '22:00' },
    { day: 'Quarta-feira', short: 'Qua', schema: 'Wednesday', opens: '08:00', closes: '20:00' },
    { day: 'Quinta-feira', short: 'Qui', schema: 'Thursday', opens: '08:00', closes: '20:00' },
    { day: 'Sexta-feira', short: 'Sex', schema: 'Friday', opens: '08:00', closes: '20:00' },
  ],
  hoursNote:
    'Horários conforme a ficha pública da clínica. Sábados, domingos e feriados não constam nas fontes públicas — confirme com a equipe.',
  insurance: null, // não confirmado publicamente
  maps: {
    link: 'https://www.google.com/maps/search/?api=1&query=BCM+Dermatologia+Especializada%2C+Av.+das+Am%C3%A9ricas+2480%2C+Barra+da+Tijuca%2C+Rio+de+Janeiro',
    embed: 'https://www.google.com/maps?q=Av.+das+Am%C3%A9ricas,+2480+-+Barra+da+Tijuca,+Rio+de+Janeiro+-+RJ,+22640-101&output=embed',
    waze: 'https://www.waze.com/live-map/directions/br/rj/bcm-dermatologia-especializada?to=place.ChIJCzinkQrbmwARBV0U_F-tdX8',
  },
  sources: ['siteMarina', 'googleListing', 'cnpj'],
};

export const addressLine = (a = clinic.address) =>
  `${a.street}, ${a.complement} — ${a.district}, ${a.city} — ${a.state}, ${a.postalCode}`;

/** "08:00" → "8h"; "22:30" → "22h30". */
export const fmtHour = (t) => `${parseInt(t, 10)}h${t.endsWith(':00') ? '' : t.slice(3)}`;

export const telLink = `tel:${clinic.phone.e164}`;

export const whatsappLink = (text = 'Olá! Vim pelo site da BCM Dermatologia e gostaria de mais informações.') =>
  `https://wa.me/${clinic.whatsapp.number}?text=${encodeURIComponent(text)}`;

/**
 * Profissionais. `atBcmConfirmed` indica se há fonte pública que vincula o
 * atendimento da profissional à unidade BCM; `partner` indica que consta como
 * sócia no registro público do CNPJ.
 */
export const doctors = [
  {
    slug: 'marina-bittencourt',
    name: 'Dra. Marina Bittencourt',
    fullName: 'Marina de Almeida Bittencourt',
    initials: 'MB',
    specialty: 'Dermatologia',
    role: 'Dermatologista · Sócia',
    focus: 'Dermatologia clínica e estética',
    registrations: ['CRM-RJ 52749591', 'CRM-SP 209.114', 'RQE 31826'],
    highlights: ['Dermatologia clínica', 'Dermatologia estética', 'Cosmiatria'],
    education: [
      'Graduação em Medicina — Universidade Federal do Rio de Janeiro (UFRJ)',
      'Dermatologia — Instituto de Dermatologia Prof. Azulay',
    ],
    memberships: [
      'Membro Titular da Sociedade Brasileira de Dermatologia (SBD)',
      'Membro do Grupo Brasileiro de Melanoma (GBM)',
    ],
    academic: ['Professora de Cosmiatria do Instituto de Dermatologia Prof. Azulay da Santa Casa da Misericórdia do Rio de Janeiro'],
    summary:
      'Dermatologista com atuação em dermatologia clínica e estética. Formada em Medicina pela UFRJ, com especialização no Instituto de Dermatologia Prof. Azulay, onde é professora de Cosmiatria. Membro Titular da SBD e membro do Grupo Brasileiro de Melanoma.',
    otherLocations: [
      'Também atende em São Paulo, na Clínica Adriana Vilarinho (Jardim Europa), conforme o seu site oficial.',
    ],
    photo: '/img/equipe-marina-bittencourt.webp',
    instagram: 'dramarinabittencourt',
    website: 'https://dramarinabittencourt.com.br/',
    atBcmConfirmed: true,
    partner: true,
    sources: ['siteMarina', 'doctoraliaMarina', 'cnpj'],
  },
  {
    slug: 'bruna-duque-estrada',
    name: 'Dra. Bruna Duque Estrada',
    fullName: 'Bruna Duque Estrada Pinto Keddi',
    initials: 'BD',
    specialty: 'Dermatologia',
    role: 'Dermatologista · Sócia',
    focus: 'Tricologia — cabelos e couro cabeludo',
    registrations: ['CRM-RJ 801313', 'RQE 24366'],
    highlights: ['Tricologia', 'Cabelos e couro cabeludo', 'Alopecias'],
    education: ['Pós-graduação em Dermatologia — Instituto de Dermatologia Prof. Rubem David Azulay (Santa Casa da Misericórdia do RJ)'],
    memberships: ['Especialista em Dermatologia pela Sociedade Brasileira de Dermatologia (SBD)'],
    academic: [
      'Coordenadora do ambulatório de Tricologia do Instituto de Dermatologia Prof. Rubem David Azulay — Santa Casa da Misericórdia do Rio de Janeiro',
      'Integra o corpo docente do Instituto de Dermatologia Prof. Rubem David Azulay',
      'Coautora do II Consenso da Sociedade Brasileira de Dermatologia para o tratamento da alopecia areata (Anais Brasileiros de Dermatologia, 2025)',
      'Docente da Trichology Club Academy',
    ],
    summary:
      'Dermatologista com foco em tricologia — o cuidado dos cabelos e do couro cabeludo. Coordena o ambulatório de Tricologia do Instituto de Dermatologia Prof. Rubem David Azulay, da Santa Casa do Rio, e é coautora do consenso da SBD sobre o tratamento da alopecia areata.',
    otherLocations: [],
    photo: null,
    instagram: null,
    website: null,
    atBcmConfirmed: false,
    partner: true,
    sources: ['doctoraliaBruna', 'trichologyClub', 'azulayDocentes', 'consensoAlopecia', 'estudoVitiligo', 'cnpj'],
  },
  {
    slug: 'carla-tamler',
    name: 'Dra. Carla Tamler',
    fullName: 'Carla Helena Tamler de Faria',
    initials: 'CT',
    specialty: 'Dermatologia',
    role: 'Dermatologista · Sócia',
    focus: 'Dermatologia clínica e ensino',
    registrations: ['CRM-RJ 777153', 'RQE 25014'],
    highlights: ['Dermatologia clínica', 'Ensino em dermatologia'],
    education: [],
    memberships: ['Especialista em Dermatologia pela Sociedade Brasileira de Dermatologia (SBD)'],
    academic: [
      'Integra o corpo docente do Instituto de Dermatologia Prof. Rubem David Azulay — Santa Casa da Misericórdia do Rio de Janeiro, onde atuou como preceptora',
      'Autora de estudo sobre o uso de tacrolimo 0,1% no tratamento do vitiligo (Anais Brasileiros de Dermatologia, 2011)',
    ],
    summary:
      'Dermatologista especialista pela SBD e integrante do corpo docente do Instituto de Dermatologia Prof. Rubem David Azulay, da Santa Casa do Rio, onde atuou como preceptora na formação de novos dermatologistas.',
    otherLocations: [],
    photo: null,
    instagram: null,
    website: null,
    atBcmConfirmed: false,
    partner: true,
    sources: ['doctoraliaCarla', 'azulayDocentes', 'estudoVitiligo', 'cnpj'],
  },
];

/** Especialidades confirmadas. Hoje: apenas Dermatologia. */
export const specialties = [
  {
    slug: 'dermatologia',
    name: 'Dermatologia',
    tagline: 'Pele, cabelos, unhas e mucosas.',
    description:
      'A dermatologia é a especialidade médica dedicada à prevenção, ao diagnóstico e ao tratamento das condições da pele, dos cabelos, das unhas e das mucosas. É a especialidade da BCM Dermatologia Especializada.',
    image: 'exame',
  },
];

/**
 * Áreas de atuação da especialidade (conteúdo educativo e geral, não lista de
 * serviços da BCM). Usado na seção interativa "Especialidades".
 */
export const dermatologyAreas = [
  {
    id: 'pele',
    label: 'Pele',
    index: '01',
    image: 'retrato',
    title: 'O maior órgão do corpo',
    text: 'A pele protege, regula temperatura e reflete a saúde como um todo. O dermatologista avalia manchas, sinais, lesões, inflamações e alterações de textura.',
  },
  {
    id: 'cabelos',
    label: 'Cabelos',
    index: '02',
    image: 'cabelos',
    title: 'Couro cabeludo e fios',
    text: 'Queda, afinamento e alterações do couro cabeludo também são cuidados pela dermatologia — a avaliação médica identifica causas e possibilidades de tratamento.',
  },
  {
    id: 'unhas',
    label: 'Unhas',
    index: '03',
    image: 'cuidado',
    title: 'Sinais que merecem atenção',
    text: 'Mudanças de cor, formato ou espessura das unhas podem ter diversas causas e fazem parte do campo de avaliação do dermatologista.',
  },
  {
    id: 'mucosas',
    label: 'Mucosas',
    index: '04',
    image: 'textura',
    title: 'Além da superfície',
    text: 'Lábios e outras mucosas também integram a especialidade. Qualquer alteração persistente deve ser avaliada em consulta.',
  },
];

/** Serviços confirmados. Nada além do que as fontes públicas sustentam. */
export const services = [
  {
    id: 'consulta',
    title: 'Consulta dermatológica',
    category: 'Consultas',
    image: 'consulta',
    description:
      'Avaliação clínica com dermatologista, para queixas da pele, cabelos, unhas e mucosas, prevenção e acompanhamento.',
    indication: 'Para quem deseja avaliar uma queixa, fazer acompanhamento ou prevenção dermatológica.',
    cta: 'Agendar consulta',
  },
  {
    id: 'procedimentos',
    title: 'Procedimentos em consultório',
    category: 'Procedimentos',
    image: 'precisao',
    description:
      'A BCM está registrada para atividade médica ambulatorial com recursos para realização de procedimentos cirúrgicos. A indicação de qualquer procedimento depende sempre de avaliação médica prévia.',
    indication: 'Quais procedimentos estão disponíveis na unidade deve ser confirmado diretamente com a equipe.',
    cta: 'Consultar disponibilidade',
  },
];

/** Diferenciais comprováveis. */
export const differentials = [
  {
    n: '01',
    title: 'Foco exclusivo em dermatologia',
    text: 'Uma clínica dedicada a uma única especialidade — pele, cabelos, unhas e mucosas.',
  },
  {
    n: '02',
    title: 'Especialistas pela SBD',
    text: 'As dermatologistas sócias possuem título de especialista pela Sociedade Brasileira de Dermatologia e Registro de Qualificação de Especialista (RQE).',
  },
  {
    n: '03',
    title: 'Ensino e pesquisa',
    text: 'Equipe com atuação docente no Instituto de Dermatologia Prof. Rubem David Azulay, da Santa Casa do Rio, e participação em consenso da SBD.',
  },
  {
    n: '04',
    title: 'Experiência complementar',
    text: 'Dermatologia clínica e estética, cosmiatria e tricologia — o cuidado dos cabelos e do couro cabeludo.',
  },
  {
    n: '05',
    title: 'Horário estendido',
    text: 'Atendimento das 8h às 20h de segunda a sexta, e até as 22h às terças-feiras.',
  },
  {
    n: '06',
    title: 'Na Barra da Tijuca, desde 2018',
    text: 'Na Av. das Américas, 2480, com contato direto por telefone e WhatsApp.',
  },
];

/**
 * Conteúdo educativo geral (orientações amplamente divulgadas em campanhas de
 * saúde da pele). Não descreve serviços da BCM nem substitui consulta.
 */
export const skinGuide = [
  {
    id: 'abcde',
    kicker: 'Autoexame',
    title: 'A regra do ABCDE das pintas',
    intro: 'Um guia simples para observar sinais e manchas. Qualquer alteração merece avaliação.',
    items: [
      ['A', 'Assimetria', 'uma metade diferente da outra'],
      ['B', 'Bordas', 'irregulares ou mal definidas'],
      ['C', 'Cor', 'mais de uma cor ou tons variados'],
      ['D', 'Diâmetro', 'maior que 6 mm'],
      ['E', 'Evolução', 'mudança de tamanho, forma, cor ou sintomas'],
    ],
  },
  {
    id: 'sol',
    kicker: 'Prevenção',
    title: 'Proteção solar no dia a dia',
    intro: 'Hábitos simples reduzem os danos causados pelo sol à pele.',
    items: [
      ['01', 'Horário', 'evite exposição prolongada entre 10h e 16h'],
      ['02', 'Fotoprotetor', 'use FPS 30 ou mais, em quantidade adequada'],
      ['03', 'Reaplicação', 'a cada 2 horas e após suor ou mergulho'],
      ['04', 'Barreiras físicas', 'chapéu, óculos escuros, roupas e sombra'],
    ],
  },
  {
    id: 'quando',
    kicker: 'Atenção',
    title: 'Quando procurar o dermatologista',
    intro: 'Alguns sinais indicam que é hora de uma avaliação.',
    items: [
      ['01', 'Pintas', 'que surgem, mudam ou coçam e sangram'],
      ['02', 'Feridas', 'que não cicatrizam em algumas semanas'],
      ['03', 'Cabelos', 'queda intensa, falhas ou afinamento persistente'],
      ['04', 'Manchas', 'que aparecem, crescem ou mudam de cor'],
      ['05', 'Unhas', 'alterações de cor, formato ou espessura'],
    ],
  },
];

/** Condições frequentemente avaliadas pela dermatologia (informativo). */
export const conditions = [
  { area: 'Pele', name: 'Acne', text: 'Cravos, espinhas e marcas, em adolescentes e adultos.' },
  { area: 'Pele', name: 'Manchas', text: 'Melasma, manchas solares e alterações de pigmentação.' },
  { area: 'Pele', name: 'Pintas e sinais', text: 'Avaliação e acompanhamento de lesões pigmentadas.' },
  { area: 'Pele', name: 'Câncer de pele', text: 'Prevenção, detecção precoce e acompanhamento.' },
  { area: 'Pele', name: 'Dermatites', text: 'Dermatite atópica, de contato e seborreica.' },
  { area: 'Pele', name: 'Psoríase', text: 'Doença inflamatória crônica da pele.' },
  { area: 'Pele', name: 'Vitiligo', text: 'Perda de pigmentação em áreas da pele.' },
  { area: 'Pele', name: 'Rosácea', text: 'Vermelhidão e sensibilidade no rosto.' },
  { area: 'Pele', name: 'Envelhecimento', text: 'Cuidados com a pele ao longo do tempo.' },
  { area: 'Pele', name: 'Verrugas', text: 'Lesões benignas causadas por vírus.' },
  { area: 'Pele', name: 'Hiperidrose', text: 'Suor excessivo nas mãos, pés ou axilas.' },
  { area: 'Cabelos', name: 'Queda de cabelo', text: 'Investigação das causas da queda.' },
  { area: 'Cabelos', name: 'Alopecias', text: 'Alopecia areata, androgenética e outras.' },
  { area: 'Cabelos', name: 'Couro cabeludo', text: 'Caspa, coceira, descamação e inflamação.' },
  { area: 'Unhas', name: 'Alterações das unhas', text: 'Micoses, manchas, fragilidade e deformidades.' },
  { area: 'Mucosas', name: 'Lábios e mucosas', text: 'Lesões e alterações persistentes.' },
];

export const journey = [
  {
    n: '01',
    title: 'Conheça',
    text: 'Explore a especialidade, a equipe e tire dúvidas aqui no site ou com o Assistente BCM.',
  },
  {
    n: '02',
    title: 'Agende',
    text: `Fale com a equipe por telefone ${clinic.phone.display} ou WhatsApp ${clinic.whatsapp.display}.`,
  },
  {
    n: '03',
    title: 'Seja atendido',
    text: 'Consulta com dermatologista na Av. das Américas, 2480 — Bloco 3, Sala S120.',
  },
  {
    n: '04',
    title: 'Continue seu cuidado',
    text: 'Retornos e acompanhamento seguem a orientação da sua médica — basta falar com a equipe.',
  },
];

/** Imagens: todas ilustrativas, licença Unsplash. Nenhuma retrata a BCM. */
export const images = {
  hero: { w: 1600, h: 2014, alt: 'Retrato de mulher sorrindo com a pele natural, em fundo claro' },
  interior: { w: 1600, h: 1078, alt: 'Ambiente clínico claro e contemporâneo, com planta e mobiliário minimalista' },
  exame: { w: 1600, h: 1064, alt: 'Profissional de luvas realizando avaliação da pele do rosto de uma paciente' },
  cuidado: { w: 1600, h: 1066, alt: 'Mãos entrelaçadas em gesto de cuidado e acolhimento' },
  textura: { w: 1600, h: 2400, alt: 'Frasco de creme branco sobre tecido macio, em luz suave' },
  cabelos: { w: 1600, h: 1068, alt: 'Mulher de costas com as mãos nos cabelos longos' },
  consulta: { w: 1600, h: 1042, alt: 'Médica conversando com paciente durante consulta' },
  ritual: { w: 1600, h: 1066, alt: 'Mãos aplicando gotas de um sérum, em fundo escuro' },
  calma: { w: 1600, h: 2400, alt: 'Composição minimalista em tons claros com toalha e objetos de cuidado' },
  retrato: { w: 1600, h: 2000, alt: 'Retrato de mulher com a pele natural em fundo rosado' },
  precisao: { w: 1600, h: 1066, alt: 'Estetoscópio sobre superfície clara, em preto e branco' },
};

export const imageCredit =
  'Imagens ilustrativas de banco de imagens (licença Unsplash). Não retratam as instalações, a equipe ou pacientes da BCM.';

export const nav = [
  { id: 'inicio', label: 'Início' },
  { id: 'a-bcm', label: 'A BCM' },
  { id: 'especialidades', label: 'Especialidades' },
  { id: 'equipe', label: 'Equipe' },
  { id: 'estrutura', label: 'Estrutura' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contato', label: 'Contato' },
];

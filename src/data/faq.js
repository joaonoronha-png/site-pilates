import { clinic, addressLine } from './site.js';

const tel = clinic.phone.display;
const wpp = clinic.whatsapp.display;
const confirm = `Essa informação não está publicada nas fontes oficiais. Confirme com a equipe pelo telefone ${tel} ou WhatsApp ${wpp}.`;

export const faqCategories = [
  'Sobre a BCM',
  'Especialidades',
  'Consultas',
  'Procedimentos',
  'Agendamento',
  'Horários',
  'Localização',
  'Convênios',
  'Preparação',
  'Atendimento',
  'Pós-atendimento',
];

/**
 * Cada pergunta tem `keywords` extras para a busca e o Assistente BCM.
 * `actions` indica botões que o assistente pode oferecer junto da resposta.
 */
export const faqs = [
  // Sobre a BCM
  {
    id: 'o-que-e-bcm',
    category: 'Sobre a BCM',
    q: 'O que é a BCM?',
    a: `A ${clinic.name} é uma clínica de dermatologia localizada na Barra da Tijuca, no Rio de Janeiro. A empresa (${clinic.legalName}) foi registrada em 2018.`,
    keywords: ['bcm', 'clinica', 'quem sao', 'empresa', 'sobre'],
  },
  {
    id: 'desde-quando',
    category: 'Sobre a BCM',
    q: 'Desde quando a BCM existe?',
    a: 'De acordo com o registro público do CNPJ, a BCM Dermatologia foi aberta em 25 de junho de 2018.',
    keywords: ['fundacao', 'ano', 'historia', 'quando abriu', 'tempo'],
  },
  {
    id: 'quem-sao-socias',
    category: 'Sobre a BCM',
    q: 'Quem são as médicas da BCM?',
    a: 'Constam como sócias da BCM Dermatologia as dermatologistas Dra. Marina Bittencourt (CRM-RJ 52749591, RQE 31826), Dra. Bruna Duque Estrada (CRM-RJ 801313, RQE 24366) e Dra. Carla Tamler (CRM-RJ 777153, RQE 25014). Para saber a agenda de cada profissional na unidade, fale com a equipe.',
    keywords: ['medicos', 'medicas', 'equipe', 'socias', 'dermatologistas', 'quem atende', 'doutora'],
    actions: ['team'],
  },
  {
    id: 'cnpj',
    category: 'Sobre a BCM',
    q: 'Qual é o CNPJ da BCM?',
    a: `${clinic.legalName} — CNPJ ${clinic.cnpj}.`,
    keywords: ['cnpj', 'razao social', 'nota fiscal'],
  },
  // Especialidades
  {
    id: 'especialidades',
    category: 'Especialidades',
    q: 'Quais especialidades a BCM oferece?',
    a: 'A BCM é uma clínica de dermatologia — a especialidade médica que cuida da pele, dos cabelos, das unhas e das mucosas. Não há registro público de outras especialidades na unidade.',
    keywords: ['especialidade', 'especialidades', 'areas', 'oferecem', 'tratam'],
  },
  {
    id: 'o-que-dermatologista-trata',
    category: 'Especialidades',
    q: 'O que o dermatologista avalia?',
    a: 'De forma geral, o dermatologista avalia condições da pele, dos cabelos, das unhas e das mucosas, além de orientar prevenção. A necessidade de cada avaliação ou tratamento é definida em consulta.',
    keywords: ['dermatologista', 'trata', 'avalia', 'cuida', 'pele', 'cabelo', 'unha'],
  },
  {
    id: 'rqe',
    category: 'Especialidades',
    q: 'As médicas são especialistas em dermatologia?',
    a: 'Sim. As três dermatologistas sócias são especialistas pela Sociedade Brasileira de Dermatologia e possuem RQE (Registro de Qualificação de Especialista). A Dra. Marina Bittencourt é Membro Titular da SBD.',
    keywords: ['especialista', 'rqe', 'titulo', 'sbd', 'qualificacao', 'formacao'],
  },
  {
    id: 'formacao-equipe',
    category: 'Especialidades',
    q: 'Qual é a formação da equipe?',
    a: 'As três sócias têm ligação com o Instituto de Dermatologia Prof. Rubem David Azulay, da Santa Casa do Rio: a Dra. Marina Bittencourt é professora de Cosmiatria, a Dra. Bruna Duque Estrada coordena o ambulatório de Tricologia e a Dra. Carla Tamler integra o corpo docente, onde atuou como preceptora.',
    keywords: ['formacao', 'experiencia', 'azulay', 'santa casa', 'professora', 'docente', 'curriculo'],
    actions: ['team'],
  },
  {
    id: 'cabelos-equipe',
    category: 'Especialidades',
    q: 'Há especialista em cabelos e couro cabeludo?',
    a: 'A Dra. Bruna Duque Estrada tem foco em tricologia — a área da dermatologia dedicada aos cabelos e ao couro cabeludo. Ela coordena o ambulatório de Tricologia do Instituto de Dermatologia Prof. Azulay e é coautora do consenso da SBD sobre o tratamento da alopecia areata. Confirme com a equipe a agenda dela na unidade.',
    keywords: ['cabelo', 'queda', 'calvicie', 'alopecia', 'tricologia', 'couro cabeludo', 'tricologista'],
    actions: ['whatsapp'],
  },
  {
    id: 'estetica-equipe',
    category: 'Especialidades',
    q: 'A BCM tem dermatologia estética?',
    a: 'A Dra. Marina Bittencourt atua em dermatologia clínica e estética e é professora de Cosmiatria no Instituto de Dermatologia Prof. Azulay. A lista de procedimentos estéticos disponíveis na unidade não é divulgada publicamente — confirme com a equipe.',
    keywords: ['estetica', 'cosmiatria', 'rejuvenescimento', 'beleza', 'envelhecimento'],
    actions: ['whatsapp'],
  },
  {
    id: 'condicoes',
    category: 'Especialidades',
    q: 'Quais condições o dermatologista avalia?',
    a: 'De forma geral: acne, manchas e melasma, pintas e sinais, prevenção do câncer de pele, dermatites, psoríase, vitiligo, rosácea, queda de cabelo e alopecias, alterações do couro cabeludo, das unhas e das mucosas. A indicação de tratamento é sempre feita em consulta.',
    keywords: ['condicoes', 'doencas', 'acne', 'manchas', 'melasma', 'psoriase', 'vitiligo', 'rosacea', 'dermatite'],
  },
  // Consultas
  {
    id: 'consulta-como-e',
    category: 'Consultas',
    q: 'Como funciona a consulta dermatológica?',
    a: 'Em linhas gerais, a consulta inclui conversa sobre a sua queixa e histórico, exame da pele, cabelos ou unhas conforme a necessidade, e orientação sobre os próximos passos. Detalhes específicos variam conforme a avaliação médica.',
    keywords: ['consulta', 'como funciona', 'avaliacao', 'primeira consulta'],
  },
  {
    id: 'valor-consulta',
    category: 'Consultas',
    q: 'Qual é o valor da consulta?',
    a: `Os valores não são divulgados publicamente. ${confirm}`,
    keywords: ['valor', 'preco', 'quanto custa', 'custo', 'pagamento', 'particular'],
    actions: ['whatsapp', 'phone'],
  },
  {
    id: 'consulta-online',
    category: 'Consultas',
    q: 'A BCM faz teleconsulta?',
    a: `Não há informação pública sobre teleconsulta na BCM. ${confirm}`,
    keywords: ['online', 'teleconsulta', 'telemedicina', 'video', 'remoto'],
  },
  {
    id: 'escolher-medica',
    category: 'Consultas',
    q: 'Posso escolher com qual médica serei atendido?',
    a: 'Você pode informar sua preferência ao agendar. A disponibilidade de cada profissional na unidade é confirmada pela equipe.',
    keywords: ['escolher', 'preferencia', 'medica especifica', 'marina', 'bruna', 'carla'],
    actions: ['whatsapp'],
  },
  // Procedimentos
  {
    id: 'procedimentos',
    category: 'Procedimentos',
    q: 'Quais procedimentos a BCM realiza?',
    a: `A BCM está registrada para atividade médica ambulatorial com recursos para realização de procedimentos cirúrgicos. A lista de procedimentos disponíveis não é divulgada publicamente — confirme com a equipe pelo telefone ${tel} ou WhatsApp ${wpp}. Qualquer procedimento depende de avaliação médica prévia.`,
    keywords: ['procedimento', 'procedimentos', 'cirurgia', 'botox', 'toxina', 'preenchimento', 'laser', 'peeling', 'biopsia', 'estetica', 'tratamento'],
    actions: ['whatsapp', 'phone'],
  },
  {
    id: 'resultado-garantido',
    category: 'Procedimentos',
    q: 'Vocês garantem resultados?',
    a: 'Não. Em medicina não há garantia de resultado: cada caso depende de avaliação individual, indicação médica e resposta de cada organismo.',
    keywords: ['garantia', 'resultado', 'funciona', 'garante', 'antes e depois'],
  },
  {
    id: 'indicacao-procedimento',
    category: 'Procedimentos',
    q: 'Posso agendar diretamente um procedimento?',
    a: 'A indicação de procedimentos é feita pela médica após avaliação. Ao entrar em contato, informe o que procura e a equipe orienta o melhor caminho.',
    keywords: ['agendar procedimento', 'direto', 'sem consulta'],
  },
  // Agendamento
  {
    id: 'como-agendar',
    category: 'Agendamento',
    q: 'Como faço para agendar?',
    a: `O agendamento é feito diretamente com a equipe, pelo telefone ${tel} ou pelo WhatsApp ${wpp}. O site não realiza agendamentos automáticos.`,
    keywords: ['agendar', 'marcar', 'agendamento', 'consulta', 'horario disponivel', 'vaga'],
    actions: ['whatsapp', 'phone'],
  },
  {
    id: 'agendar-online',
    category: 'Agendamento',
    q: 'Posso agendar pelo site?',
    a: `Ainda não. Pelo site você é direcionado ao WhatsApp ou telefone da clínica, onde a equipe confirma data e horário.`,
    keywords: ['site', 'online', 'agendar online', 'internet'],
    actions: ['whatsapp'],
  },
  {
    id: 'cancelar',
    category: 'Agendamento',
    q: 'Como remarcar ou cancelar?',
    a: `Fale com a equipe pelo telefone ${tel} ou WhatsApp ${wpp}, de preferência com antecedência.`,
    keywords: ['cancelar', 'remarcar', 'desmarcar', 'mudar horario', 'atraso'],
    actions: ['whatsapp', 'phone'],
  },
  // Horários
  {
    id: 'horario',
    category: 'Horários',
    q: 'Qual é o horário de funcionamento?',
    a: 'Segunda, quarta, quinta e sexta-feira, das 8h às 20h; terça-feira, das 8h às 22h — conforme a ficha pública da clínica.',
    keywords: ['horario', 'funcionamento', 'abre', 'fecha', 'hora', 'expediente', 'terca', 'noite'],
  },
  {
    id: 'sabado',
    category: 'Horários',
    q: 'Vocês atendem aos sábados?',
    a: `Atendimento aos sábados não consta nas fontes públicas. ${confirm}`,
    keywords: ['sabado', 'domingo', 'fim de semana', 'feriado'],
    actions: ['whatsapp', 'phone'],
  },
  // Localização
  {
    id: 'endereco',
    category: 'Localização',
    q: 'Onde fica a BCM?',
    a: `${addressLine()}.`,
    keywords: ['endereco', 'onde fica', 'localizacao', 'local', 'barra', 'americas', 'sala'],
    actions: ['map'],
  },
  {
    id: 'como-chegar',
    category: 'Localização',
    q: 'Como chegar?',
    a: 'A clínica fica na Av. das Américas, 2480, Bloco 3, Sala S120, na Barra da Tijuca. Use o botão "Abrir no Google Maps" ou o Waze para traçar a rota a partir de onde você estiver.',
    keywords: ['chegar', 'rota', 'caminho', 'como ir', 'waze', 'maps', 'transporte'],
    actions: ['map'],
  },
  {
    id: 'estacionamento',
    category: 'Localização',
    q: 'Há estacionamento?',
    a: `Não há informação pública sobre estacionamento. ${confirm}`,
    keywords: ['estacionamento', 'estacionar', 'carro', 'vaga', 'garagem'],
  },
  // Convênios
  {
    id: 'convenios',
    category: 'Convênios',
    q: 'A BCM aceita convênio?',
    a: `A BCM não divulga publicamente uma lista de convênios aceitos. ${confirm}`,
    keywords: ['convenio', 'plano', 'plano de saude', 'unimed', 'amil', 'bradesco', 'sulamerica', 'reembolso', 'aceita'],
    actions: ['whatsapp', 'phone'],
  },
  {
    id: 'reembolso',
    category: 'Convênios',
    q: 'Vocês emitem documentos para reembolso?',
    a: `${confirm}`,
    keywords: ['reembolso', 'recibo', 'nota', 'documento'],
  },
  // Preparação
  {
    id: 'o-que-levar',
    category: 'Preparação',
    q: 'O que levar na consulta?',
    a: 'Como orientação geral: documento com foto, exames anteriores relacionados à queixa e a lista de medicamentos e produtos que você usa. A equipe pode passar orientações específicas ao agendar.',
    keywords: ['levar', 'documento', 'exames', 'preparar', 'preparo'],
  },
  {
    id: 'maquiagem',
    category: 'Preparação',
    q: 'Preciso ir sem maquiagem ou esmalte?',
    a: 'Não há orientação oficial publicada pela clínica. Em geral, quando a queixa envolve o rosto ou as unhas, facilita a avaliação estar com a área limpa — confirme com a equipe ao agendar.',
    keywords: ['maquiagem', 'esmalte', 'unha', 'rosto', 'make'],
  },
  {
    id: 'antecedencia',
    category: 'Preparação',
    q: 'Com quanto tempo de antecedência devo chegar?',
    a: 'Recomenda-se chegar alguns minutos antes do horário para o cadastro. Confirme a orientação da recepção ao agendar.',
    keywords: ['antecedencia', 'chegar antes', 'atraso', 'pontualidade'],
  },
  // Atendimento
  {
    id: 'contato',
    category: 'Atendimento',
    q: 'Quais são os canais de contato?',
    a: `Telefone ${tel} e WhatsApp ${wpp}. Não há e-mail institucional publicado.`,
    keywords: ['contato', 'telefone', 'whatsapp', 'email', 'falar', 'ligar', 'numero'],
    actions: ['whatsapp', 'phone'],
  },
  {
    id: 'instagram',
    category: 'Atendimento',
    q: 'A BCM tem Instagram?',
    a: 'Não localizamos um perfil institucional da BCM. A Dra. Marina Bittencourt mantém o perfil profissional @dramarinabittencourt.',
    keywords: ['instagram', 'rede social', 'redes sociais', 'insta', 'facebook'],
  },
  {
    id: 'urgencia',
    category: 'Atendimento',
    q: 'A BCM atende urgências?',
    a: 'A BCM é uma clínica ambulatorial. Em caso de emergência, ligue para o SAMU (192) ou procure o pronto-socorro mais próximo.',
    keywords: ['urgencia', 'emergencia', 'pronto socorro', 'grave', 'socorro'],
  },
  {
    id: 'assistente-ia',
    category: 'Atendimento',
    q: 'O Assistente BCM pode dar diagnóstico?',
    a: 'Não. O Assistente BCM fornece informações gerais sobre a clínica e seus serviços e não substitui uma avaliação médica. Ele não diagnostica, não prescreve e não interpreta exames.',
    keywords: ['assistente', 'chat', 'diagnostico', 'robo', 'bot', 'ia'],
  },
  // Pós-atendimento
  {
    id: 'retorno',
    category: 'Pós-atendimento',
    q: 'Como funciona o retorno?',
    a: `A necessidade e o prazo de retorno são definidos pela médica. Para agendar, fale com a equipe pelo telefone ${tel} ou WhatsApp ${wpp}. Condições de retorno não são divulgadas publicamente.`,
    keywords: ['retorno', 'revisao', 'acompanhamento', 'volta'],
    actions: ['whatsapp'],
  },
  {
    id: 'duvida-pos',
    category: 'Pós-atendimento',
    q: 'Tive uma dúvida após a consulta. O que faço?',
    a: `Entre em contato com a equipe pelo WhatsApp ${wpp} ou telefone ${tel}. Se houver sinais de piora importante, procure atendimento médico imediato.`,
    keywords: ['duvida', 'depois', 'apos consulta', 'pos', 'reacao', 'piora'],
    actions: ['whatsapp', 'phone'],
  },
];

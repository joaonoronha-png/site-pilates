/**
 * Assistente BCM — motor local.
 *
 * Responde SOMENTE a partir dos dados oficiais (src/data). Não há modelo de IA
 * aqui: é uma combinação de intenções, fluxos guiados e busca na FAQ. Quando
 * nada corresponde, admite que não sabe e oferece a equipe.
 *
 * Funções puras (sem DOM) para poderem ser testadas em Node.
 */
import { clinic, doctors, specialties, addressLine, fmtHour } from '../data/site.js';
import { faqs } from '../data/faq.js';
import { normalize } from '../lib/text.js';
import { buildDocuments, createSearch } from '../lib/searchIndex.js';

export const DISCLAIMER =
  'O Assistente BCM fornece informações gerais sobre a clínica e seus serviços e não substitui uma avaliação médica.';

export const NOT_FOUND =
  'Não encontrei essa informação nas informações oficiais da BCM. Posso encaminhar você para a equipe.';

export const SUGGESTIONS = [
  'Quais especialidades vocês oferecem?',
  'Quero marcar uma consulta',
  'Quais médicos atendem?',
  'Vocês aceitam convênio?',
  'Qual o endereço?',
  'Vocês atendem sábado?',
];

const A = {
  whatsapp: (text) => ({ type: 'whatsapp', label: 'WhatsApp', text }),
  phone: () => ({ type: 'phone', label: `Ligar ${clinic.phone.display}` }),
  map: () => ({ type: 'map', label: 'Abrir no Google Maps' }),
  team: () => ({ type: 'handoff', label: 'Falar com a equipe' }),
  link: (label, href) => ({ type: 'link', label, href }),
  choice: (label, value) => ({ type: 'choice', label, value }),
};

const actionsFromFaq = (f) =>
  (f.actions || []).map((k) => (k === 'team' ? A.link('Ver equipe', '/#equipe') : A[k]?.())).filter(Boolean);

// ---------- detecção ----------

const has = (text, ...terms) => {
  const t = ` ${normalize(text)} `;
  return terms.some((term) => t.includes(term));
};

const EMERGENCY = [' emergencia', ' urgencia', ' urgente', 'falta de ar', 'nao consigo respirar', 'sangramento', 'sangrando', 'desmai', 'inchaco na garganta', 'anafila', 'queimadura grave', 'febre alta'];
const MEDICAL = [
  ' diagnostic', ' remedio', ' medicament', ' dose', ' dosagem', ' posso usar', ' posso tomar', ' posso passar', ' pomada', ' receita', ' prescrev',
  ' e cancer', ' cancer', ' e grave', ' o que eu tenho', ' o que pode ser', ' que creme', ' qual creme', ' qual pomada', ' qual remedio',
  ' meu exame', ' resultado do exame', ' interpretar', ' sintoma', ' coceira', ' cocando', ' alergia', ' ferida', ' caroco', ' mancha', ' pinta', ' verruga',
  ' acne', ' espinha', ' queda de cabelo', ' caindo', ' micose', ' psoriase', ' dermatite', ' rosacea', ' melasma', ' vitiligo', ' herpes', ' antibiotic', ' corticoide', ' isotretinoina', ' roacutan',
];
const BOOKING = [' agend', ' marcar', ' marco uma', ' marca uma', ' vaga', ' horario disponivel', ' quero uma consulta', ' quero consulta', ' preciso de uma consulta', ' gostaria de uma consulta'];
const HANDOFF = [' falar com alguem', ' falar com uma pessoa', ' atendente', ' humano', ' pessoa real', ' falar com a equipe', ' recepcao', ' secretaria', ' falar com voces', ' quero falar'];

const DOCTOR_KEYS = {
  'marina-bittencourt': [' marina', ' bittencourt'],
  'bruna-duque-estrada': [' bruna', ' duque', ' keddi'],
  'carla-tamler': [' carla', ' tamler'],
};

const findDoctor = (text) => doctors.find((d) => has(text, ...DOCTOR_KEYS[d.slug]));

// ---------- respostas ----------

const hoursText = () =>
  `${clinic.hours.map((h) => `${h.day}: ${fmtHour(h.opens)} às ${fmtHour(h.closes)}`).join('\n')}\n\n${clinic.hoursNote}`;

const doctorText = (d) =>
  `${d.name} (${d.fullName}) — dermatologista, ${d.registrations.join(', ')}. Foco: ${d.focus.toLowerCase()}.${d.academic.length ? `\n${d.academic[0]}.` : ''}${d.education.length ? `\nFormação: ${d.education.join('; ')}.` : ''}${
    d.memberships.length ? `\n${d.memberships.join('; ')}.` : ''
  }${d.atBcmConfirmed ? `\nAtende na BCM, na ${clinic.address.street}.` : '\nConsta como sócia da BCM; a agenda na unidade é confirmada pela equipe.'}`;

const bookingStart = () => ({
  text: 'Claro. Qual especialidade você procura?',
  actions: specialties.map((s) => A.choice(s.name, `booking:specialty:${s.slug}`)),
  state: { flow: 'booking', step: 'specialty' },
});

const bookingDoctor = (spec) => ({
  text: `${spec.name}, perfeito. Tem preferência por alguma profissional?`,
  actions: [
    ...doctors.filter((d) => d.specialty === spec.name).map((d) => A.choice(d.name, `booking:doctor:${d.slug}`)),
    A.choice('Sem preferência', 'booking:doctor:any'),
  ],
  state: { flow: 'booking', step: 'doctor', specialty: spec.slug },
});

const bookingChannel = (state, doctorSlug) => {
  const spec = specialties.find((s) => s.slug === state.specialty) || specialties[0];
  const d = doctors.find((x) => x.slug === doctorSlug);
  const msg = `Olá! Vim pelo site e gostaria de agendar uma consulta de ${spec.name}${d ? ` com a ${d.name}` : ''} na BCM Dermatologia.`;
  return {
    text: `Como prefere continuar? O agendamento é confirmado diretamente pela equipe da BCM${d && !d.atBcmConfirmed ? `, que também informa a agenda da ${d.name} na unidade` : ''}.`,
    actions: [A.whatsapp(msg), A.phone()],
    note: 'Pelo WhatsApp, a mensagem já vai preenchida — você pode editá-la antes de enviar.',
    state: {},
  };
};

function handleChoice(value, state) {
  const [flow, step, arg] = value.split(':');
  if (flow !== 'booking') return null;
  if (step === 'start') return bookingStart();
  if (step === 'specialty') return bookingDoctor(specialties.find((s) => s.slug === arg) || specialties[0]);
  if (step === 'doctor') return bookingChannel(state, arg === 'any' ? null : arg);
  return null;
}

const faqSearch = createSearch(buildDocuments().filter((d) => d.faqId));

/**
 * @param {string} input   texto digitado ou valor de um botão (`choice`)
 * @param {object} state   estado do fluxo guiado
 * @returns {{ text: string, actions?: object[], note?: string, state: object, source?: string, matched: boolean }}
 */
export function respond(input, state = {}) {
  const out = (r, matched = true) => ({ actions: [], state: {}, ...r, matched });

  if (input.startsWith('booking:')) {
    const r = handleChoice(input, state);
    if (r) return out(r);
  }

  const text = ` ${normalize(input)} `;
  if (!text.trim()) return out({ text: 'Pode escrever sua dúvida? Estou aqui para ajudar.' });

  // 1. Emergência: sempre primeiro.
  if (has(text, ...EMERGENCY) && !has(text, ' atende urgencia', ' atendem urgencia', ' atende emergencia', ' atendem emergencia')) {
    return out({
      text: 'Se for uma emergência, ligue agora para o SAMU (192) ou procure o pronto-socorro mais próximo. A BCM é uma clínica ambulatorial e não atende emergências.',
      actions: [A.link('Ligar 192 (SAMU)', 'tel:192')],
    });
  }

  // 2. Perguntas médicas específicas: só informação geral + avaliação.
  if (has(text, ...MEDICAL) && has(text, ...BOOKING)) {
    return out({ ...bookingStart(), note: 'Não consigo avaliar sintomas por aqui, mas a dermatologista avalia tudo em consulta.' });
  }
  if (has(text, ...MEDICAL)) {
    const hair = has(text, ' cabelo', ' queda', ' calvicie', ' alopecia', ' couro cabeludo', ' caindo');
    return out({
      text: 'Não consigo avaliar sintomas, indicar medicamentos ou doses, nem interpretar exames — isso depende de uma avaliação médica. De forma geral, alterações da pele, dos cabelos, das unhas e das mucosas são avaliadas pelo dermatologista em consulta. Posso ajudar você a agendar?',
      actions: [A.choice('Quero agendar', 'booking:start'), A.team()],
      note: hair
        ? 'Na equipe, a Dra. Bruna Duque Estrada tem foco em tricologia (cabelos e couro cabeludo). Confirme a agenda dela com a equipe.'
        : 'Se os sintomas forem intensos ou piorarem rapidamente, procure atendimento médico imediato.',
    });
  }

  // 3. Pedido de contato humano.
  if (has(text, ...HANDOFF)) {
    return out({
      text: `Claro! A equipe da BCM atende pelo WhatsApp ${clinic.whatsapp.display} e pelo telefone ${clinic.phone.display}.`,
      actions: [A.whatsapp(), A.phone()],
    });
  }

  // 4. Profissional citada pelo nome.
  const doc = findDoctor(text);
  if (doc) {
    return out({
      text: doctorText(doc),
      actions: [A.link('Ver perfil', `/equipe/${doc.slug}/`), A.choice(`Agendar com a ${doc.name}`, `booking:doctor:${doc.slug}`)],
      state: { flow: 'booking', specialty: 'dermatologia' },
    });
  }

  // 5. Intenções diretas.
  if (has(text, ...BOOKING)) return out(bookingStart());
  if (has(text, ' sabado', ' domingo', ' fim de semana', ' feriado')) {
    return out({ text: `Atendimento aos sábados, domingos e feriados não consta nas fontes públicas da BCM. Os horários publicados são:\n${hoursText()}`, actions: [A.whatsapp(), A.phone()] });
  }
  if (has(text, ' horario', ' funcionamento', ' abre', ' fecha', ' aberto', ' que horas', ' expediente')) {
    return out({ text: hoursText(), source: 'Horários' });
  }
  if (has(text, ' convenio', ' plano de saude', ' plano', ' unimed', ' amil', ' bradesco', ' sulamerica', ' reembolso', ' particular')) {
    const f = faqs.find((x) => x.id === 'convenios');
    return out({ text: f.a, actions: actionsFromFaq(f), source: 'FAQ · Convênios' });
  }
  if (has(text, ' endereco', ' onde fica', ' onde voces ficam', ' localizacao', ' como chegar', ' chegar', ' rota', ' mapa', ' local')) {
    return out({ text: `Estamos na ${addressLine()}.`, actions: [A.map(), A.link('Abrir no Waze', clinic.maps.waze)], source: 'Localização' });
  }
  if (has(text, ' whatsapp', ' zap', ' wpp')) {
    return out({ text: `O WhatsApp da BCM é ${clinic.whatsapp.display}.`, actions: [A.whatsapp()] });
  }
  if (has(text, ' telefone', ' ligar', ' numero', ' contato', ' email', ' e mail')) {
    return out({
      text: `Telefone: ${clinic.phone.display}\nWhatsApp: ${clinic.whatsapp.display}${has(text, ' email', ' e mail') ? '\nNão há e-mail institucional publicado.' : ''}`,
      actions: [A.phone(), A.whatsapp()],
    });
  }
  if (has(text, ' formacao', ' curriculo', ' experiencia da equipe', ' onde estudaram', ' qualificacao')) {
    const f = faqs.find((x) => x.id === 'formacao-equipe');
    return out({ text: f.a, actions: [A.link('Conhecer a equipe', '/#equipe')], source: 'FAQ · Especialidades' });
  }
  if (has(text, ' medic', ' doutora', ' doutor', ' dra ', ' equipe', ' profissiona', ' dermatologista', ' quem atende')) {
    return out({
      text: `Constam como sócias da BCM as dermatologistas:\n${doctors.map((d) => `• ${d.name} — ${d.registrations.join(', ')}`).join('\n')}\n\nA agenda de cada profissional na unidade é confirmada pela equipe.`,
      actions: [A.link('Conhecer a equipe', '/#equipe'), A.choice('Quero agendar', 'booking:start')],
      source: 'Equipe',
    });
  }
  if (has(text, ' especialidade', ' especialidades', ' areas', ' o que voces tratam')) {
    const f = faqs.find((x) => x.id === 'especialidades');
    return out({ text: f.a, actions: [A.link('Ver Dermatologia', '/dermatologia/')], source: 'FAQ · Especialidades' });
  }
  if (has(text, ' procedimento', ' botox', ' toxina', ' preenchimento', ' laser', ' peeling', ' biopsia', ' cirurgi', ' estetic', ' harmoniza', ' bioestimulador', ' microagulhamento', ' tratamento')) {
    const f = faqs.find((x) => x.id === 'procedimentos');
    return out({ text: f.a, actions: actionsFromFaq(f), source: 'FAQ · Procedimentos' });
  }
  if (has(text, ' valor', ' preco', ' quanto custa', ' custo')) {
    const f = faqs.find((x) => x.id === 'valor-consulta');
    return out({ text: f.a, actions: actionsFromFaq(f), source: 'FAQ · Consultas' });
  }
  if (has(text, ' oi ', ' ola', ' bom dia', ' boa tarde', ' boa noite', ' tudo bem')) {
    return out({ text: 'Olá! Sou o Assistente BCM. Posso ajudar com especialidades, equipe, horários, localização, contato e agendamento.', actions: SUGGESTIONS.slice(0, 3).map((s) => A.choice(s, s)) });
  }
  if (has(text, ' obrigad', ' valeu', ' agradeco')) {
    return out({ text: 'Por nada! Se precisar, é só chamar.' });
  }

  // 6. Base da FAQ.
  const [best] = faqSearch(input, { limit: 1, minScore: 2.2, prefixMin: 5 });
  if (best) {
    const f = faqs.find((x) => x.id === best.doc.faqId);
    return out({ text: f.a, actions: actionsFromFaq(f), source: `FAQ · ${f.category}` });
  }

  // 7. Não sabe: não inventa.
  return out({ text: NOT_FOUND, actions: [A.team()] }, false);
}

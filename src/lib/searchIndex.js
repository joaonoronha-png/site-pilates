import { clinic, doctors, services, specialties, dermatologyAreas, differentials, addressLine } from '../data/site.js';
import { faqs } from '../data/faq.js';
import { tokenize, normalize } from './text.js';

/** Documentos pesquisáveis do site — tudo vem dos dados oficiais. */
export function buildDocuments() {
  const docs = [
    {
      type: 'Seção', title: 'A BCM', href: '/#a-bcm',
      text: `${clinic.name} clínica dermatologia Barra da Tijuca desde 2018 sobre história`,
    },
    {
      type: 'Contato', title: 'Agendar atendimento', href: '/#contato',
      text: `agendar marcar consulta agendamento telefone ${clinic.phone.display} whatsapp ${clinic.whatsapp.display}`,
    },
    {
      type: 'Localização', title: 'Endereço e como chegar', href: '/#contato',
      text: `${addressLine()} endereço onde fica como chegar mapa google maps waze localização`,
    },
    {
      type: 'Horários', title: 'Horário de funcionamento', href: '/#contato',
      text: `horário funcionamento segunda terça quarta quinta sexta 8h 20h 22h abre fecha ${clinic.hoursNote}`,
    },
    {
      type: 'Seção', title: 'Encontre um especialista', href: '/#equipe',
      text: 'equipe médicos médicas dermatologistas especialista encontrar profissional',
    },
    {
      type: 'Seção', title: 'Estrutura', href: '/#estrutura',
      text: 'estrutura galeria ambiente clínica sala bloco 3 procedimentos ambulatorial',
    },
  ];
  for (const s of specialties)
    docs.push({ type: 'Especialidade', title: s.name, href: `/${s.slug}/`, text: `${s.name} ${s.tagline} ${s.description} especialidade` });
  for (const a of dermatologyAreas)
    docs.push({ type: 'Dermatologia', title: `Dermatologia · ${a.label}`, href: '/#especialidades', text: `${a.label} ${a.title} ${a.text}` });
  for (const s of services)
    docs.push({ type: 'Serviço', title: s.title, href: '/#servicos', text: `${s.title} ${s.description} ${s.indication} ${s.category}` });
  for (const d of doctors)
    docs.push({
      type: 'Profissional', title: d.name, href: `/equipe/${d.slug}/`,
      text: `${d.name} ${d.fullName} ${d.specialty} dermatologista médica ${d.registrations.join(' ')} ${d.education.join(' ')} ${d.memberships.join(' ')}`,
    });
  for (const d of differentials)
    docs.push({ type: 'Diferencial', title: d.title, href: '/#diferenciais', text: `${d.title} ${d.text}` });
  for (const f of faqs)
    docs.push({ type: `FAQ · ${f.category}`, title: f.q, href: `/#faq-${f.id}`, text: `${f.q} ${f.q} ${f.a} ${(f.keywords || []).join(' ')}`, faqId: f.id, answer: f.a });
  return docs.map((d) => ({ ...d, tokens: tokenize(`${d.title} ${d.text}`) }));
}

/**
 * Pontuação BM25 simplificada com correspondência por prefixo
 * (para funcionar enquanto a pessoa ainda está digitando).
 */
export function createSearch(docs = buildDocuments()) {
  const N = docs.length;
  const avg = docs.reduce((n, d) => n + d.tokens.length, 0) / N;
  const df = new Map();
  for (const d of docs) for (const t of new Set(d.tokens)) df.set(t, (df.get(t) || 0) + 1);

  return function search(query, { limit = 6, minScore = 0.6 } = {}) {
    const q = tokenize(query);
    if (!q.length) return [];
    const scored = docs.map((d) => {
      let score = 0;
      for (const term of q) {
        let tf = 0;
        let matched = null;
        for (const t of d.tokens) {
          if (t === term) { tf += 1; matched = t; }
          else if (term.length >= 3 && t.startsWith(term)) { tf += 0.7; matched = matched || t; }
        }
        if (!tf) continue;
        const idf = Math.log(1 + (N - (df.get(matched) || 1) + 0.5) / ((df.get(matched) || 1) + 0.5));
        score += idf * ((tf * 2.2) / (tf + 1.2 * (0.25 + 0.75 * (d.tokens.length / avg))));
      }
      if (normalize(d.title).includes(normalize(query))) score += 2;
      return { doc: d, score };
    });
    return scored.filter((s) => s.score >= minScore).sort((a, b) => b.score - a.score).slice(0, limit);
  };
}

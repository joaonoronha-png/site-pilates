const STOP = new Set(
  'a o e de da do das dos em no na nos nas um uma uns umas para por com sem que se os as ao aos à às é eu me meu minha voce vocês voces vcs vc tem ter qual quais como onde quando porque pra pro sobre mais muito isso esse essa este esta ou ja já ser sao são foi ha há gostaria queria quero preciso posso pode podem faz fazem fazer'.split(' '),
);

export const normalize = (s = '') =>
  String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Radical simples: remove plurais e algumas terminações comuns em português. */
export const stem = (w) => w.replace(/(oes|aes|ais|eis)$/, 'a').replace(/(s|es)$/, '').replace(/(mente)$/, '');

export const tokenize = (s) =>
  normalize(s)
    .split(' ')
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map(stem);

/** Retorna true se algum termo (já normalizado) aparece no texto. */
export const hasAny = (text, terms) => {
  const t = ` ${normalize(text)} `;
  return terms.some((term) => t.includes(` ${term}`) );
};

#!/usr/bin/env node
/* Gera index.html a partir de src/index.html.
   - {{pic:nome|alt|sizes|classe|lazy|atributos-extra}} → <picture> AVIF/WebP responsivo
   - {{faq}}       → perguntas frequentes (da base de conhecimento)
   - {{schema}}    → JSON-LD LocalBusiness + FAQPage (dados da base)
   - {{instagram}} → composição editorial das publicações do Instagram
   - {{year}}      → ano atual
   Uso: node tools/build.mjs */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const ctx = { window: {} };
vm.runInNewContext(read('data/knowledge-base.js'), ctx);
const KB = ctx.window.MAPERSI_KB;
const images = JSON.parse(read('assets/media/images.json'));
const igImages = JSON.parse(read('assets/media/ig-images.json'));

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function picture(name, { alt = '', sizes = '100vw', cls = '', loading = 'lazy', extra = '', dir = 'img', meta = images } = {}) {
  const m = meta[name];
  if (!m) throw new Error(`Imagem não encontrada: ${name}`);
  const widths = m.widths;
  const max = widths[widths.length - 1];
  const h = Math.round(m.h * max / m.w);
  const set = (ext) => widths.map((w) => `assets/media/${dir}/${name}-${w}.${ext} ${w}w`).join(', ');
  const priority = loading === 'eager' ? ' fetchpriority="high"' : '';
  return `<picture${extra ? ' ' + extra : ''}><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img src="assets/media/${dir}/${name}-${widths[0]}.webp" width="${max}" height="${h}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''} loading="${loading}" decoding="async"${priority} style="background-color:${m.color}"></picture>`;
}

function faqAnswer(item) {
  if (item.answer) return { text: item.answer, status: item.status || 'confirmado' };
  const t = KB.topics.find((x) => x.id === item.topic);
  if (!t) throw new Error(`Tópico do FAQ não encontrado: ${item.topic}`);
  if (t.status === 'nao_confirmado') return { text: KB.messages.faqUnconfirmed, status: t.status };
  return { text: t.faqAnswer || t.answer, status: t.status };
}

const faqItems = KB.faq.map((f) => ({ q: f.q, ...faqAnswer(f) }));
const faqHtml = faqItems.map((f, i) => `
          <details class="faq__item" data-reveal${i === 0 ? ' open' : ''}>
            <summary><span>${esc(f.q)}</span><i aria-hidden="true"></i></summary>
            <div class="faq__answer"><p>${esc(f.text)}</p>${f.status === 'nao_confirmado' ? '<button class="link-arrow" type="button" data-chat-open data-chat-context="faq_item">Perguntar à equipe</button>' : ''}</div>
          </details>`).join('');

const c = KB.company;
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LocalBusiness', 'FoodEstablishment'],
      '@id': 'https://mapersi.com.br/#empresa',
      name: c.name,
      alternateName: 'Mapersi buffet',
      description: 'Buffet para casamentos, festas e eventos corporativos no Rio de Janeiro, com estações gastronômicas, estação de massas, entradas servidas, welcome drinks e open bar.',
      url: 'https://mapersi.com.br/',
      image: 'https://mapersi.com.br/assets/media/og-mapersi.jpg',
      logo: 'https://mapersi.com.br/assets/media/icon-192.png',
      telephone: c.phone.e164,
      email: c.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: c.address.street,
        addressLocality: 'Rio de Janeiro',
        addressRegion: c.address.state,
        postalCode: c.address.postalCode,
        addressCountry: c.address.country
      },
      geo: { '@type': 'GeoCoordinates', latitude: c.geo.lat, longitude: c.geo.lng },
      hasMap: c.maps.placeUrl,
      sameAs: [c.instagram.url],
      servesCuisine: 'Brasileira',
      areaServed: { '@type': 'City', name: 'Rio de Janeiro' },
      makesOffer: KB.services.filter((s) => s.show).map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.label, description: s.summary }
      }))
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.text } }))
    }
  ]
};
// Observação: a nota 5,0 do Google não entra como aggregateRating no schema,
// pois o Google não aceita avaliações de terceiros autodeclaradas.

/* ---------- portfólio: um card por evento real ---------- */
const cases = [
  { cat: 'casamento', tag: 'Casamento', title: 'Letícia & Bruno', text: 'Quase 200 convidados. Buffet, cascata de chocolate e welcome drinks.',
    items: [['p-leticia-casal', 'Os noivos na cerimônia ao ar livre'], ['copper', 'Pratos servidos em mini panelas de cobre'], ['pastryboard', 'Folhados servidos em tábua aos convidados']] },
  { cat: 'casamento', tag: 'Casamento', title: 'Vinicius & Thaís', text: 'Uma celebração intimista, com entradinhas servidas à mesa.',
    items: [['bridegarden', 'Entrada da noiva no jardim'], ['tartlets', 'Tortinhas gratinadas'], ['sweetshelf', 'Recepção com flores e doces'], ['waitress', 'Equipe servindo os convidados']] },
  { cat: 'festa', tag: '15 anos', title: '15 anos da Isabel', text: 'Buffet, open bar e estações em uma noite à luz de velas.',
    items: [['candles', 'Mesa com velas flutuantes e flores amarelas'], ['bluetable', 'Mesa posta com guardanapos azuis'], ['p-isabel-servico', 'Salgados servidos aos convidados'], ['team', 'Equipe alinhando detalhes com os anfitriões']] },
  { cat: 'festa', tag: 'Aniversário', title: '40 anos da Thaty', text: 'Cardápio premium, com entradinhas escolhidas a dedo pela cliente.',
    items: [['tables40', 'Salão com mesas decoradas em laranja e rosa'], ['crabtartlets', 'Barquetes recheadas'], ['serving40', 'Entradinhas servidas à mesa'], ['p-thaty-servico', 'Equipe servindo os convidados'], ['p-thaty-convidados', 'Convidados aproveitando o cardápio']] },
  { cat: 'corporativo', tag: 'Corporativo', title: 'Coffee break para 330+ pessoas', text: 'Instituição de ensino: organização para um grande público.',
    items: [['coffeetable', 'Mesa de coffee break montada'], ['p-coffee-pessoas', 'Participantes se servindo'], ['coffeecrowd', 'Coffee break em andamento'], ['cookies', 'Biscoitos em suporte de madeira']] },
  { cat: 'casamento', tag: 'Renovação de votos', title: 'Renovação de votos', text: 'Buffet e estações em uma cerimônia no bosque.',
    items: [['renovacao-altar', 'Casal no altar ao ar livre'], ['p-renov-estacao', 'Estação montada com acompanhamentos'], ['p-renov-coxinhas', 'Salgados servidos em suporte']] }
];
const portfolioHtml = cases.map((c, i) => {
  const data = c.items.map(([n, cap]) => ({ src: `assets/media/img/${n}-${images[n].widths.at(-1)}.webp`, cap: `${c.title} — ${cap}`, alt: cap }));
  return `<article class="case" data-cat="${c.cat}" data-reveal>
            <button class="case__open" type="button" data-case='${esc(JSON.stringify(data))}' aria-label="Ver fotos: ${esc(c.title)}">
              <span class="case__media">${picture(c.items[0][0], { alt: c.items[0][1], sizes: '(min-width: 960px) 30vw, (min-width: 640px) 45vw, 92vw' })}<span class="case__count">${c.items.length} fotos</span></span>
            </button>
            <p class="case__tag">${esc(c.tag)}</p>
            <h3 class="case__title">${esc(c.title)}</h3>
            <p class="case__text">${esc(c.text)}</p>
          </article>`;
}).join('\n          ');

/* ---------- avaliações reais (base de conhecimento) ---------- */
const reviewsHtml = KB.reviews.map((r, i) => `<figure class="rv__slide${i === 0 ? ' is-active' : ''}" role="group" aria-roledescription="avaliação" aria-label="${i + 1} de ${KB.reviews.length}"${i ? ' aria-hidden="true"' : ''}>
                  <blockquote>“${esc(r.text)}”</blockquote>
                  <figcaption><span class="stars" aria-label="${r.rating} de 5 estrelas">${'★'.repeat(r.rating)}</span> ${esc(r.author)} · ${esc(r.source)}</figcaption>
                </figure>`).join('\n                ');

/* ---------- Instagram: duas faixas em rotação, sentidos opostos ---------- */
const row1 = ['DO6gTxAETTb_cover', 'DdRm5OIxqgj_cover', 'DcJ1H8Hv8L-_cover', 'DLQ9Sfytqw2_cover', 'DcuEvizBV3Y_cover', 'DdHTk2RxJdu_cover', 'DdDC9HZxpAT_cover', 'DdPhZiIvIhF_cover'];
const row2 = ['spoons', 'pastelrack', 'croquettes', 'slider', 'penne', 'chefcart', 'sweetslilies', 'cookies', 'copperrice', 'bartender'];
const tile = (n, ig) => `<a class="insta__tile" href="https://www.instagram.com/mapersibuffet/" target="_blank" rel="noopener" tabindex="-1" data-track="instagram_click" data-track-label="faixa">${picture(n, { alt: '', sizes: '220px', dir: ig ? 'ig' : 'img', meta: ig ? igImages : images })}</a>`;
const rowHtml = (list, ig, dir) => `<div class="insta__row insta__row--${dir}" aria-hidden="true"><div class="insta__track">${[...list, ...list].map((n) => tile(n, ig)).join('')}</div></div>`;
const instaRows = rowHtml(row1, true, 'left') + '\n        ' + rowHtml(row2, false, 'right');

let html = read('src/index.html');
html = html.replace(/\{\{pic:([^}]+)\}\}/g, (_, args) => {
  const [name, alt = '', sizes = '100vw', cls = '', loading = 'lazy', extra = ''] = args.split('|');
  return picture(name.trim(), { alt, sizes: sizes || '100vw', cls, loading: loading || 'lazy', extra });
});
html = html
  .replace('{{faq}}', faqHtml)
  .replace('{{schema}}', JSON.stringify(schema))
  .replace('{{portfolio}}', portfolioHtml)
  .replace('{{reviews}}', reviewsHtml)
  .replace('{{instarows}}', instaRows)
  .replace('{{year}}', String(new Date().getFullYear()));

const left = html.match(/\{\{[^}]+\}\}/g);
if (left) throw new Error('Tokens não substituídos: ' + left.join(', '));
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log('index.html gerado (' + (html.length / 1024).toFixed(1) + ' KB)');

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

const igPosts = [
  { sc: 'DO6gTxAETTb', kind: 'reel', cap: 'Renovação de votos — buffet e estações', size: 'l' },
  { sc: 'DdRm5OIxqgj', kind: 'reel', cap: 'Nossas estações', size: 'm', off: 1 },
  { sc: 'DcJ1H8Hv8L-', kind: 'reel', cap: '40 anos da Thaty — cardápio premium', size: 's' },
  { sc: 'DLQ9Sfytqw2', kind: 'reel', cap: 'Casamento Letícia e Bruno — quase 200 convidados', size: 'l', off: 2 },
  { sc: 'DcuEvizBV3Y', kind: 'reel', cap: 'Coffee break para mais de 330 pessoas', size: 'm' },
  { sc: 'DdHTk2RxJdu', kind: 'reel', cap: '15 anos da Isabel — buffet, open bar e estações', size: 's', off: 1 },
  { sc: 'DdDC9HZxpAT', kind: 'reel', cap: 'Casamento — experiência gastronômica', size: 'm' }
];
const igHtml = igPosts.map((p) => {
  const url = `https://www.instagram.com/${p.kind === 'reel' ? 'reel' : 'p'}/${p.sc}/`;
  return `<a class="insta__post insta__post--${p.size}${p.off ? ' insta__post--off' + p.off : ''}" href="${url}" target="_blank" rel="noopener" data-track="instagram_click" data-track-label="post" data-reveal>
          ${picture(p.sc + '_cover', { alt: p.cap, sizes: '(min-width: 960px) 18vw, 44vw', dir: 'ig', meta: igImages })}
          <span class="insta__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
          <span class="insta__cap">${esc(p.cap)}</span>
        </a>`;
}).join('\n        ');

let html = read('src/index.html');
html = html.replace(/\{\{pic:([^}]+)\}\}/g, (_, args) => {
  const [name, alt = '', sizes = '100vw', cls = '', loading = 'lazy', extra = ''] = args.split('|');
  return picture(name.trim(), { alt, sizes: sizes || '100vw', cls, loading: loading || 'lazy', extra });
});
html = html
  .replace('{{faq}}', faqHtml)
  .replace('{{schema}}', JSON.stringify(schema))
  .replace('{{instagram}}', igHtml)
  .replace('{{year}}', String(new Date().getFullYear()));

const left = html.match(/\{\{[^}]+\}\}/g);
if (left) throw new Error('Tokens não substituídos: ' + left.join(', '));
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log('index.html gerado (' + (html.length / 1024).toFixed(1) + ' KB)');

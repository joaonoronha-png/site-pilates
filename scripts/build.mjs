/**
 * Build do site By Dani Decora.
 *
 *  src/            → código-fonte (HTML com <x-img>, CSS, JS, fontes, fotos originais)
 *  dist/           → site pronto para publicação (pode ser enviado a qualquer hospedagem estática)
 *
 * O que este script faz:
 *  1. Gera versões otimizadas (AVIF, WebP e JPG) em várias larguras de cada foto listada em IMAGES.
 *  2. Troca cada <x-img name="..."> dos HTMLs por um <picture> responsivo completo.
 *  3. Resolve parciais ({{> nome}}) e variáveis ({{site}}, {{year}}, {{full:nome}} …).
 *  4. Copia CSS, JS, fontes e arquivos estáticos.
 *
 * Uso:  npm run build            (tudo)
 *       npm run build:html       (só HTML/CSS/JS, reaproveitando as imagens já geradas)
 */
import { readFile, writeFile, mkdir, readdir, cp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const IMG_OUT = path.join(DIST, 'assets', 'img');
const SKIP_IMAGES = process.argv.includes('--skip-images');

// Domínio provisório — troque pelo domínio definitivo antes de publicar (ou use SITE_URL=... npm run build).
const SITE_URL = (process.env.SITE_URL || 'https://www.bydanidecora.com.br').replace(/\/$/, '');

// Contato oficial usado em todos os botões de WhatsApp do site.
const WHATSAPP = '5521995188453';
const WHATSAPP_MSG = 'Olá! Conheci o trabalho da By Dani pelo site e gostaria de conversar sobre a decoração do meu evento.';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WHATSAPP_MSG)}`;

const WIDTHS = [480, 800, 1200, 1600, 2000];

/**
 * Fotos do site. Para substituir uma foto, basta trocar o arquivo em src/assets/originals
 * (mantendo o nome) e rodar `npm run build`. Para recortes de detalhe, `crop` usa frações
 * da imagem original: { left, top, width, height } entre 0 e 1.
 */
const IMAGES = [
  { name: 'cha-revelacao', src: 'cha-revelacao.png' },
  { name: 'festa-sininho', src: 'festa-sininho.jpg' },
  { name: 'flor-de-baloes', src: 'flor-de-baloes.jpg' },
  { name: 'happy-birthday-lilas', src: 'happy-birthday-lilas.jpg' },
  { name: 'divertida-mente', src: 'divertida-mente.jpg' },
  { name: 'divertida-mente-bolo', src: 'divertida-mente-bolo.jpg' },

  // Recortes de detalhe (mesmas fotografias reais, enquadramentos diferentes)
  { name: 'detalhe-baloes-champagne', src: 'cha-revelacao.png', crop: { left: 0.08, top: 0.015, width: 0.58, height: 0.42 } },
  { name: 'detalhe-ursinho', src: 'cha-revelacao.png', crop: { left: 0.14, top: 0.6, width: 0.42, height: 0.39 } },
  { name: 'detalhe-boy-or-girl', src: 'cha-revelacao.png', crop: { left: 0.63, top: 0.12, width: 0.36, height: 0.36 } },
  { name: 'detalhe-flor', src: 'flor-de-baloes.jpg', crop: { left: 0.19, top: 0, width: 0.58, height: 0.44 } },
  { name: 'detalhe-tucano', src: 'flor-de-baloes.jpg', crop: { left: 0.56, top: 0.28, width: 0.3, height: 0.3 } },
  { name: 'detalhe-guirlanda', src: 'divertida-mente.jpg', crop: { left: 0, top: 0.13, width: 1, height: 0.28 } },
  { name: 'cta-flor', src: 'flor-de-baloes.jpg', crop: { left: 0, top: 0.08, width: 1, height: 0.62 } },
];

const log = (...a) => console.log('›', ...a);

async function buildImages() {
  await mkdir(IMG_OUT, { recursive: true });
  const manifest = {};
  for (const img of IMAGES) {
    const file = path.join(SRC, 'assets', 'originals', img.src);
    let pipeline = sharp(file).rotate();
    const meta = await sharp(file).rotate().metadata();
    if (img.crop) {
      const c = img.crop;
      pipeline = pipeline.extract({
        left: Math.round(c.left * meta.width),
        top: Math.round(c.top * meta.height),
        width: Math.round(c.width * meta.width),
        height: Math.round(c.height * meta.height),
      });
    }
    const base = await pipeline.toBuffer({ resolveWithObject: true });
    const { width, height } = base.info;
    const widths = WIDTHS.filter((w) => w < width);
    if (!widths.length || widths[widths.length - 1] < width) widths.push(width);

    const { dominant } = await sharp(base.data).stats();
    const color = `rgb(${dominant.r} ${dominant.g} ${dominant.b})`;

    for (const w of widths) {
      const resized = sharp(base.data).resize({ width: w, withoutEnlargement: true });
      await Promise.all([
        resized.clone().avif({ quality: 52, effort: 4 }).toFile(path.join(IMG_OUT, `${img.name}-${w}.avif`)),
        resized.clone().webp({ quality: 74, effort: 6 }).toFile(path.join(IMG_OUT, `${img.name}-${w}.webp`)),
        resized.clone().jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(path.join(IMG_OUT, `${img.name}-${w}.jpg`)),
      ]);
    }
    manifest[img.name] = { width, height, widths, color };
    log(`imagem ${img.name} (${width}×${height}) → ${widths.join(', ')}`);
  }
  await writeFile(path.join(IMG_OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  return manifest;
}

async function buildOgImage(manifest) {
  // Colagem 1200×630 com três fotografias reais, usada ao compartilhar o link.
  const names = ['festa-sininho', 'cha-revelacao', 'divertida-mente'];
  const tiles = await Promise.all(
    names.map((n) =>
      sharp(path.join(IMG_OUT, `${n}-${manifest[n].widths.at(-1)}.jpg`))
        .resize(396, 630, { fit: 'cover', position: 'attention' })
        .toBuffer(),
    ),
  );
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#f6f1e9' } })
    .composite(tiles.map((input, i) => ({ input, left: i * 402, top: 0 })))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(DIST, 'og-image.jpg'));
  log('og-image.jpg');
}

// ---------- HTML ----------

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}(?:="([^"]*)")?(?=[\\s>/])`));
  return m ? (m[1] ?? true) : undefined;
};

const url = (name, w, ext) => `/assets/img/${name}-${w}.${ext}`;
const srcset = (name, m, ext) => m.widths.map((w) => `${url(name, w, ext)} ${w}w`).join(', ');

function renderPicture(tag, manifest) {
  const name = attr(tag, 'name');
  const m = manifest[name];
  if (!m) throw new Error(`Imagem desconhecida em <x-img>: ${name}`);
  const alt = attr(tag, 'alt') ?? '';
  const sizes = attr(tag, 'sizes') || '100vw';
  const cls = attr(tag, 'class');
  const eager = attr(tag, 'eager') !== undefined;
  const mobileHide = attr(tag, 'hide-below'); // ex.: hide-below="768" evita download no celular
  const fallbackW = m.widths.find((w) => w >= 800) ?? m.widths.at(-1);
  const blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const data = [...tag.matchAll(/\s(data-[\w-]+)(?:="([^"]*)")?/g)].map(([, k, v]) => (v === undefined ? ` ${k}` : ` ${k}="${v}"`)).join('');
  return [
    `<picture${cls ? ` class="${cls}"` : ''}${data} style="--ph:${m.color}">`,
    mobileHide ? `<source media="(max-width: ${Number(mobileHide) - 1}px)" srcset="${blank}">` : '',
    `<source type="image/avif" srcset="${srcset(name, m, 'avif')}" sizes="${sizes}">`,
    `<source type="image/webp" srcset="${srcset(name, m, 'webp')}" sizes="${sizes}">`,
    `<img src="${url(name, fallbackW, 'jpg')}" srcset="${srcset(name, m, 'jpg')}" sizes="${sizes}" width="${m.width}" height="${m.height}" alt="${alt}"`,
    eager ? ` loading="eager" fetchpriority="high"` : ` loading="lazy"`,
    ` decoding="async">`,
    `</picture>`,
  ].join('');
}

async function loadPartials() {
  const dir = path.join(SRC, 'partials');
  const partials = {};
  if (!existsSync(dir)) return partials;
  for (const f of await readdir(dir)) {
    if (f.endsWith('.html')) partials[f.replace(/\.html$/, '')] = await readFile(path.join(dir, f), 'utf8');
  }
  return partials;
}

function renderHtml(html, manifest, partials) {
  // Parciais (permite parciais aninhadas)
  for (let i = 0; i < 3; i++) {
    html = html.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, n) => {
      if (!(n in partials)) throw new Error(`Parcial não encontrada: ${n}`);
      return partials[n];
    });
  }
  html = html.replace(/<x-img\b[^>]*>(?:<\/x-img>)?/g, (tag) => renderPicture(tag, manifest));
  html = html
    .replace(/\{\{site\}\}/g, SITE_URL)
    .replace(/\{\{wa\}\}/g, WHATSAPP_URL.replace(/&/g, '&amp;'))
    .replace(/\{\{wa-number\}\}/g, WHATSAPP)
    .replace(/\{\{year\}\}/g, String(new Date().getFullYear()))
    .replace(/\{\{full:([\w-]+)\}\}/g, (_, n) => url(n, manifest[n].widths.at(-1), 'webp'))
    .replace(/\{\{w:([\w-]+)\}\}/g, (_, n) => manifest[n].width)
    .replace(/\{\{h:([\w-]+)\}\}/g, (_, n) => manifest[n].height)
    .replace(/\{\{srcset:([\w-]+):(\w+)\}\}/g, (_, n, ext) => srcset(n, manifest[n], ext));
  const left = html.match(/\{\{[^}]*\}\}/);
  if (left) throw new Error(`Variável não resolvida: ${left[0]}`);
  return html;
}

async function walk(dir, base = dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full, base)));
    else out.push(path.relative(base, full));
  }
  return out;
}

async function main() {
  const t0 = Date.now();
  let manifest;
  const manifestFile = path.join(IMG_OUT, 'manifest.json');
  if (SKIP_IMAGES && existsSync(manifestFile)) {
    manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
  } else {
    await rm(DIST, { recursive: true, force: true });
    manifest = await buildImages();
    await buildOgImage(manifest);
  }

  // Estáticos
  for (const d of ['css', 'js', 'fonts']) {
    await cp(path.join(SRC, 'assets', d), path.join(DIST, 'assets', d), { recursive: true });
  }
  const pub = path.join(SRC, 'public');
  if (existsSync(pub)) await cp(pub, DIST, { recursive: true });

  // Páginas
  const partials = await loadPartials();
  const pagesDir = path.join(SRC, 'pages');
  for (const rel of await walk(pagesDir)) {
    if (!rel.endsWith('.html')) continue;
    const html = renderHtml(await readFile(path.join(pagesDir, rel), 'utf8'), manifest, partials);
    const out = path.join(DIST, rel);
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, html);
    log(`página ${rel}`);
  }

  // Arquivos que dependem do domínio
  for (const f of ['robots.txt', 'sitemap.xml']) {
    const p = path.join(DIST, f);
    if (existsSync(p)) await writeFile(p, (await readFile(p, 'utf8')).replaceAll('{{site}}', SITE_URL));
  }

  const size = (await walk(DIST)).length;
  log(`pronto em ${((Date.now() - t0) / 1000).toFixed(1)}s — ${size} arquivos em dist/ (${SITE_URL})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

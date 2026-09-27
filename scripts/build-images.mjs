/**
 * Tratamento das fotos do site By Dani Decora.
 *
 *   assets/originals/  → fotos originais (troque aqui pelas fotos oficiais, mantendo os nomes)
 *   assets/img/        → versões tratadas usadas pelo site (WebP)
 *
 * As fotos públicas disponíveis hoje são pequenas (480–1440 px). Por isso cada uma é
 * ampliada até 2× com Lanczos, ganha nitidez leve e um ajuste suave de cor. Com as fotos
 * originais em alta resolução, o script apenas redimensiona e comprime.
 *
 * Uso: npm run images
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'assets', 'originals');
const OUT = path.join(ROOT, 'assets', 'img');

// Fotos inteiras
const PHOTOS = [
  ['cha-revelacao', 'cha-revelacao.png'],
  ['festa-sininho', 'festa-sininho.jpg'],
  ['flor-de-baloes', 'flor-de-baloes.jpg'],
  ['happy-birthday-lilas', 'happy-birthday-lilas.jpg'],
  ['divertida-mente', 'divertida-mente.jpg'],
  ['divertida-mente-bolo', 'divertida-mente-bolo.jpg'],

  // Fotos de banco provisórias (CC0 — domínio público). Créditos em assets/originals/CREDITOS-BANCO.json.
  // Substituir pelas fotos da By Dani Decora antes de publicar.
  ['banco-bolo-casamento', 'banco-bolo-casamento.jpg'],
  ['banco-recepcao', 'banco-recepcao.jpg'],
  ['banco-guirlanda-baloes', 'banco-guirlanda-baloes.jpg'],
  ['banco-mesa-posta', 'banco-mesa-posta.jpg'],
  ['banco-bolo-macarons', 'banco-bolo-macarons.jpg'],
  ['banco-painel-floral', 'banco-painel-floral.jpg'],
  ['banco-baloes-dourados', 'banco-baloes-dourados.jpg'],
  ['banco-hortensias', 'banco-hortensias.jpg'],
  ['banco-rosas-brancas', 'banco-rosas-brancas.jpg'],
  ['banco-velas', 'banco-velas.jpg'],
  ['banco-baloes-pb', 'banco-baloes-pb.jpg'],
];

// Recortes de detalhe: frações da imagem original { left, top, width, height }
const CROPS = [
  ['detalhe-baloes', 'cha-revelacao.png', { left: 0.08, top: 0.015, width: 0.58, height: 0.42 }],
  ['detalhe-ursinho', 'cha-revelacao.png', { left: 0.14, top: 0.6, width: 0.42, height: 0.39 }],
  ['detalhe-boy-or-girl', 'cha-revelacao.png', { left: 0.63, top: 0.12, width: 0.36, height: 0.36 }],
  ['detalhe-flor', 'flor-de-baloes.jpg', { left: 0.19, top: 0, width: 0.58, height: 0.44 }],
  ['detalhe-tucano', 'flor-de-baloes.jpg', { left: 0.56, top: 0.28, width: 0.3, height: 0.3 }],
  ['detalhe-guirlanda', 'divertida-mente.jpg', { left: 0, top: 0.13, width: 1, height: 0.28 }],
  ['detalhe-guirlanda-2', 'divertida-mente-bolo.jpg', { left: 0, top: 0.0, width: 1, height: 0.24 }],
  ['detalhe-bolo', 'divertida-mente-bolo.jpg', { left: 0, top: 0.4, width: 1, height: 0.5 }],
  ['detalhe-arco-lilas', 'happy-birthday-lilas.jpg', { left: 0, top: 0.02, width: 1, height: 0.5 }],
];

const MIN_WIDTH = 1100; // largura mínima desejada para fotos inteiras
const MAX_SCALE = 2;

function enhance(img, width, targetMin) {
  const scale = Math.min(MAX_SCALE, Math.max(1, targetMin / width));
  return img
    .resize({ width: Math.round(width * scale), kernel: 'lanczos3' })
    .modulate({ brightness: 1.02, saturation: 1.05 })
    .linear(1.05, -5)
    .sharpen({ sigma: scale > 1.2 ? 0.9 : 0.6, m1: 0.5, m2: 2.2 });
}

async function save(pipeline, name, smWidth = 640) {
  const buf = await pipeline.toBuffer();
  const meta = await sharp(buf).metadata();
  await sharp(buf).webp({ quality: 82, smartSubsample: true, effort: 5 }).toFile(path.join(OUT, `${name}.webp`));
  await sharp(buf).resize({ width: Math.min(smWidth, meta.width) }).webp({ quality: 80, effort: 5 }).toFile(path.join(OUT, `${name}-sm.webp`));
  return { width: meta.width, height: meta.height };
}

async function buildMap() {
  // Mapa estático estilizado (OpenStreetMap), sem iframe — leve e funciona em qualquer lugar.
  const lat = -22.9846921, lon = -43.3592578, z = 16, T = 256;
  const n = 2 ** z;
  const fx = ((lon + 180) / 360) * n;
  const fy = ((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * n;
  const make = async (W, H, file, offsetX = 0) => {
    const cx = fx * T + offsetX, cy = fy * T;
    const x0 = Math.floor((cx - W / 2) / T), x1 = Math.floor((cx + W / 2) / T);
    const y0 = Math.floor((cy - H / 2) / T), y1 = Math.floor((cy + H / 2) / T);
    const tiles = [];
    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) {
        const res = await fetch(`https://tile.openstreetmap.org/${z}/${x}/${y}.png`, { headers: { 'User-Agent': 'ByDaniDecoraSite/1.0 (site institucional)' } });
        if (!res.ok) throw new Error(`tile ${x},${y}: ${res.status}`);
        tiles.push({ input: Buffer.from(await res.arrayBuffer()), left: (x - x0) * T, top: (y - y0) * T });
      }
    }
    const canvasW = (x1 - x0 + 1) * T, canvasH = (y1 - y0 + 1) * T;
    const full = await sharp({ create: { width: canvasW, height: canvasH, channels: 3, background: '#eee' } }).composite(tiles).png().toBuffer();
    const left = Math.round(cx - W / 2 - x0 * T), top = Math.round(cy - H / 2 - y0 * T);
    await sharp(full)
      .extract({ left, top, width: W, height: H })
      .modulate({ saturation: 0 })
      .tint({ r: 205, g: 182, b: 150 })
      .linear(0.9, 22)
      .webp({ quality: 78 })
      .toFile(path.join(OUT, file));
  };
  await make(900, 900, 'mapa-barra.webp');
  await make(1800, 1000, 'mapa-barra-desktop.webp', -216); // marcador a 62% da largura
}

async function buildOg() {
  const pick = ['festa-sininho', 'cha-revelacao', 'divertida-mente'];
  const tiles = await Promise.all(pick.map((n) => sharp(path.join(OUT, `${n}.webp`)).resize(380, 560, { fit: 'cover', position: 'attention' }).toBuffer()));
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#1f1714"/></svg>`);
  await sharp(svg)
    .composite(tiles.map((input, i) => ({ input, left: 30 + i * 390, top: 35 })))
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(ROOT, 'og-image.jpg'));
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const manifest = {};
  for (const [name, file] of PHOTOS) {
    const src = sharp(path.join(SRC, file)).rotate();
    const { width } = await src.metadata();
    const pipe = width > 1600 ? src.resize({ width: 1600 }).sharpen({ sigma: 0.5 }) : enhance(src, width, MIN_WIDTH);
    manifest[name] = await save(pipe, name);
    console.log('›', name, manifest[name]);
  }
  for (const [name, file, c] of CROPS) {
    const src = sharp(path.join(SRC, file)).rotate();
    const m = await sharp(path.join(SRC, file)).metadata();
    const box = { left: Math.round(c.left * m.width), top: Math.round(c.top * m.height), width: Math.round(c.width * m.width), height: Math.round(c.height * m.height) };
    const cropped = sharp(await src.extract(box).toBuffer());
    manifest[name] = await save(enhance(cropped, box.width, 900), name, 560);
    console.log('›', name, manifest[name]);
  }
  await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  await buildOg();
  console.log('› og-image.jpg');
  if (!process.argv.includes('--no-map')) {
    await buildMap();
    console.log('› mapa');
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

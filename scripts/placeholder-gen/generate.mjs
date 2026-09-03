import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', '..', 'assets', 'img', 'photos');
const HTML = 'file://' + join(__dirname, 'placeholder.html');
const EXEC = process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium';

const photos = [
  { file: '01-hero.jpg', num: '01', label: 'HERO', title: 'Pilates Tatiana Nobre', palette: 'a', motif: 'arc', w: 1600, h: 2000 },
  { file: '02-tatiana.jpg', num: '02', label: 'TATIANA', title: 'A instrutora', palette: 'b', motif: 'figure', w: 1200, h: 1500 },
  { file: '03-tatiana-aula.jpg', num: '03', label: 'TATIANA EM AULA', title: 'Em movimento', palette: 'a', motif: 'figure', w: 1400, h: 1750 },
  { file: '04-studio.jpg', num: '04', label: 'STUDIO', title: 'O espaço', palette: 'c', motif: 'wave', w: 1600, h: 1067 },
  { file: '05-equipamentos.jpg', num: '05', label: 'EQUIPAMENTOS', title: 'Reformer', palette: 'd', motif: 'arc', w: 1400, h: 1400 },
  { file: '06-detalhe-ambiente.jpg', num: '06', label: 'DETALHE DO AMBIENTE', title: 'Detalhes', palette: 'b', motif: 'leaf', w: 1200, h: 1500 },
  { file: '07-movimento.jpg', num: '07', label: 'MOVIMENTO / AULA', title: 'Movimento', palette: 'a', motif: 'wave', w: 1600, h: 1067 },
  { file: '08-galeria.jpg', num: '08', label: 'GALERIA', title: 'Por aqui', palette: 'c', motif: 'arc', w: 1200, h: 1500 },
  { file: '09-galeria.jpg', num: '09', label: 'GALERIA', title: 'Por aqui', palette: 'd', motif: 'wave', w: 1600, h: 1067 },
  { file: '10-galeria.jpg', num: '10', label: 'GALERIA', title: 'Por aqui', palette: 'b', motif: 'leaf', w: 1200, h: 1500 },
  { file: '11-galeria.jpg', num: '11', label: 'GALERIA', title: 'Por aqui', palette: 'a', motif: 'figure', w: 1400, h: 1050 },
  { file: '12-galeria.jpg', num: '12', label: 'GALERIA', title: 'Por aqui', palette: 'c', motif: 'wave', w: 1200, h: 1500 },
  { file: '13-galeria.jpg', num: '13', label: 'GALERIA', title: 'Por aqui', palette: 'd', motif: 'arc', w: 1600, h: 1067 },
  { file: '14-cta-final.jpg', num: '14', label: 'CTA FINAL', title: 'Seu próximo movimento', palette: 'b', motif: 'figure', w: 1920, h: 1200 },
  { file: 'og-cover.jpg', num: 'OG', label: 'OPEN GRAPH', title: 'Pilates Tatiana Nobre', palette: 'a', motif: 'arc', w: 1200, h: 630 },
];

const browser = await chromium.launch({ headless: true, executablePath: EXEC });

for (const p of photos) {
  const page = await browser.newPage({ viewport: { width: p.w, height: p.h }, deviceScaleFactor: 1 });
  const qs = new URLSearchParams({
    num: p.num, label: p.label, title: p.title, palette: p.palette, motif: p.motif,
  });
  await page.goto(`${HTML}?${qs.toString()}`);
  await page.waitForTimeout(80);
  const outPath = join(OUT_DIR, p.file);
  await page.screenshot({ path: outPath, type: 'jpeg', quality: 82 });
  await page.close();
  console.log('generated', p.file, `${p.w}x${p.h}`);
}

await browser.close();
console.log('done');

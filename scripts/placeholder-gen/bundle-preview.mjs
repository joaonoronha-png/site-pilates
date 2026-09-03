import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const outPath = process.argv[2] || '/tmp/pilates-preview.html';

let html = readFileSync(join(root, 'index.html'), 'utf8');
const css = readFileSync(join(root, 'assets', 'css', 'styles.css'), 'utf8');
const js = readFileSync(join(root, 'assets', 'js', 'main.js'), 'utf8');

// Replace the <video> (too large to inline as base64 without blowing the Artifact size cap) with a static fallback using its poster image.
// Must run before the image-inlining step below so the fallback's <img> also gets base64-inlined.
html = html.replace(
  /<video[\s\S]*?<\/video>/,
  `<div class="video-fallback">
        <img src="/assets/img/photos/15-video-poster.jpg" alt="Prévia do vídeo" />
        <p>O vídeo completo toca no site publicado.<br>Aqui na pré-visualização, o arquivo é grande demais para caber neste bundle.</p>
      </div>`
);

// Inline images as base64 data URIs
html = html.replace(/src="\/assets\/img\/photos\/([^"]+)"/g, (m, file) => {
  const buf = readFileSync(join(root, 'assets', 'img', 'photos', file));
  return `src="data:image/jpeg;base64,${buf.toString('base64')}"`;
});

// Drop favicon/manifest links (not needed in preview, avoid broken relative refs)
html = html.replace(/<link rel="icon"[^>]*>\s*/g, '');
html = html.replace(/<link rel="apple-touch-icon"[^>]*>\s*/g, '');
html = html.replace(/<link rel="manifest"[^>]*>\s*/g, '');
html = html.replace(/<link rel="canonical"[^>]*>\s*/g, '');
html = html.replace(/<meta property="og:[^"]*"[^>]*>\s*/g, '');
html = html.replace(/<meta name="twitter:[^"]*"[^>]*>\s*/g, '');
html = html.replace(/<meta name="theme-color"[^>]*>\s*/g, '');

// Replace the external stylesheet link with inline <style>
html = html.replace(
  /<link rel="stylesheet" href="\/assets\/css\/styles\.css" \/>/,
  `<style>\n${css}\n</style>`
);

// Replace the external script with inline <script>
html = html.replace(
  /<script src="\/assets\/js\/main\.js" defer><\/script>/,
  `<script>\n${js}\n</script>`
);

// Replace the live Google Maps iframe (blocked by the Artifact viewer's CSP) with a static fallback note
html = html.replace(
  /<iframe[\s\S]*?title="Mapa de localização do Pilates Tatiana Nobre">\s*<\/iframe>/,
  `<div class="map-fallback">
        <p>O mapa interativo aparece no site publicado.<br>Aqui na pré-visualização, use os botões ao lado para abrir no Google Maps.</p>
      </div>`
);

// Strip <!doctype>, <html>, <head>...</head>, <body> wrapper tags (Artifact provides its own skeleton)
html = html.replace(/^<!doctype html>\s*/i, '');
html = html.replace(/<html[^>]*>\s*/i, '');
html = html.replace(/<\/html>\s*$/i, '');
const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
const headInner = headMatch ? headMatch[1] : '';
// Keep: title, google fonts preconnect/link, inlined <style>, JSON-LD script. Drop meta viewport/charset (artifact sets its own) but keep them anyway is harmless; simplest: keep everything from head except charset/viewport meta (artifact already sets these).
const cleanedHead = headInner
  .replace(/<meta charset="UTF-8" \/>\s*/i, '')
  .replace(/<meta name="viewport"[^>]*>\s*/i, '')
  .replace(/<meta name="description"[^>]*>\s*/i, '')
  .replace(/<meta name="keywords"[^>]*>\s*/i, '');
html = html.replace(/<head>[\s\S]*?<\/head>\s*/i, cleanedHead + '\n');
html = html.replace(/<body>\s*/i, '');
html = html.replace(/<\/body>\s*$/i, '');

// Add a small CSS rule for the map fallback box, plus a tiny top banner noting this is a preview bundle
html = html.replace(
  '</style>',
  `
.map-fallback { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; padding: 2rem; background: var(--c-bg-alt); }
.map-fallback p { max-width: 40ch; text-align:center; color: var(--c-ink-soft); font-size:.95rem; }
.video-fallback { position: relative; width: 100%; height: 100%; }
.video-fallback img { width: 100%; height: 100%; object-fit: cover; display: block; opacity: .5; }
.video-fallback p { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; text-align: center; padding: 2rem; margin: 0; color: #fff; font-size: .9rem; background: rgba(20,15,10,.35); }
</style>`
);

writeFileSync(outPath, html);
console.log('bundled ->', outPath, `(${(html.length / 1024).toFixed(0)} KB)`);

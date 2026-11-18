// Builds one self-contained HTML file (no doctype/head) for the claude.ai artifact preview.
import fs from 'node:fs'
const dir = new URL('../dist/', import.meta.url)
const html = fs.readFileSync(new URL('index.html', dir), 'utf8')
const css = fs.readFileSync(new URL(html.match(/href="\.\/(assets\/[^"]+\.css)"/)[1], dir), 'utf8')
const js = fs.readFileSync(new URL(html.match(/src="\.\/(assets\/[^"]+\.js)"/)[1], dir), 'utf8').replaceAll('</script', '<\\/script')
const fonts = [...html.matchAll(/<link[^>]+fonts\.(googleapis|gstatic)[^>]*>/g)].map((m) => m[0]).join('\n')
const out = `<title>Agenda por voz</title>
${fonts}
<style>${css}</style>
<div id="root"></div>
<script type="module">${js}</script>
`
fs.mkdirSync(new URL('../artifact/', import.meta.url), { recursive: true })
fs.writeFileSync(new URL('../artifact/agenda.html', import.meta.url), out)
console.log('ok', out.length)

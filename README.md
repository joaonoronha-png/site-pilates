# Vprior Artes — site da galeria de Vicente Prior

Site estático (HTML + CSS + JavaScript, sem instalação nem build) para vender as pinturas originais de Vicente Prior.

## Como abrir
- Abra `index.html` no navegador, ou sirva a pasta: `python3 -m http.server` e acesse http://localhost:8000.
- Para publicar, envie a pasta inteira para uma hospedagem estática (Netlify, Vercel, GitHub Pages, Hostinger…).

## Onde editar
- **Contato:** `js/app.js` → `CONFIG.whatsapp` (DDI+DDD+número, só dígitos) e `CONFIG.email`.
- **Obras:** `js/obras.js`, uma linha por obra:
  - `titulo` — nome da obra
  - `medida` — largura x altura em cm (ex.: `"150 x 85"`); é a medida real usada na ficha e no simulador
  - `rank` — ordem na coleção (menor aparece primeiro)
  - `cores`, `formato` — usados nos filtros
  - `descricao` (opcional) — texto extra da obra; `pecas` (opcional) — nº de telas
- **Destaques (sala escura):** `js/app.js` → `const DESTAQUES = ['06', '47', '61']` (ids das obras).
- **Fotos:** `assets/obras/ID.jpg` (1600 px) e `assets/obras/thumb/ID.jpg` (720 px), na proporção da medida real.
- **Logo:** `assets/marca/vprior-300.png` (topo do site) e `assets/marca/vprior.png` (original, fundo transparente).
- **Textos** do artista, garantias e "como adquirir": `index.html`.

## Para adicionar uma obra
1. Recorte a foto só com a tela, na proporção da medida (largura ÷ altura).
2. Salve como `assets/obras/NN.jpg` e uma cópia menor em `assets/obras/thumb/NN.jpg`.
3. Acrescente uma linha em `js/obras.js` com `id: "NN"`, `titulo`, `medida`, `rank`, `cores` e `formato`.

## O que o site tem
Abertura animada · topo com logo · obra principal · sala escura com 3 destaques · coleção com filtros (cor, formato, favoritas) ·
ficha da obra com lupa, medidas, oferta e dúvidas pelo WhatsApp · favoritas salvas no aparelho ·
"Veja na sua parede" (sala em escala real ou foto da parede do cliente, tamanho real fixo, 7 molduras) ·
artista · garantias (Pix) · como adquirir · contato com formulário de oferta · menu de celular.

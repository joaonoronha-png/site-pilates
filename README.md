# Vicente Prior — site da galeria

Site estático (HTML + CSS + JS, sem build) para venda das pinturas originais de Vicente Prior.

## Como abrir
Abra `index.html` no navegador, ou sirva a pasta: `python3 -m http.server` e acesse http://localhost:8000.
Para publicar, envie a pasta inteira para qualquer hospedagem estática (Netlify, Vercel, GitHub Pages, Hostinger…).

## Antes de publicar — edite
- `js/app.js` → `CONFIG.whatsapp` (DDI+DDD+número, só dígitos) e `CONFIG.email`.
- `js/obras.js` → para cada obra, preencha `preco` (ex.: `4800`) e `dimensoes` (ex.: `"100 x 70 cm"`).
  Enquanto estiverem `null`, o site mostra "Sob consulta".
- Textos do artista e garantias (envio, pagamento via Pix) em `index.html`.

## Estrutura
- `assets/obras/NN.jpg` — obras recortadas (sem fundo/bordas), 1600px. `assets/obras/thumb/` — 720px.
- `js/obras.js` — dados gerados do ranking `vprior_ranking_40_atualizado.xlsx` (posição, título, nota, cores, formato).
- Seções: Hero (obra nº 1), Sala escura (top 3), Top 10, Coleção com filtros (categoria, cor, formato, ordenação),
  Ver na parede (simulador), Artista, Garantias, Como comprar, Contato (WhatsApp), lista de desejos e visualizador com lupa.

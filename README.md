# Aline Lima — Estética Personalizada

Site institucional de uma página para a Aline Lima (@alinelimaestetica),
esteticista na Barra da Tijuca, Rio de Janeiro. Objetivo: causar uma ótima
primeira impressão e converter visitas em agendamentos pelo WhatsApp.

## Stack

HTML + CSS + JavaScript puros (sem build step), para ficar leve, rápido e
fácil de publicar em qualquer host estático (GitHub Pages, Netlify, Vercel,
etc.).

- `index.html` — estrutura e conteúdo de todas as seções
- `css/style.css` — direção visual (paleta, tipografia, layout, animações)
- `js/main.js` — microinterações: menu mobile, header retrátil, reveal
  on-scroll, botão flutuante do WhatsApp e contadores animados
- `assets/` — pasta para fotos e vídeos reais (ver `assets/README.md`)

## Rodar localmente

Qualquer servidor estático funciona, por exemplo:

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000
```

## Direção de conteúdo

Textos e números (ano de início de atuação — 2002, nota 5,0 no Google,
166 avaliações, endereço, telefone e horários) foram fornecidos pela cliente
e devem ser reconfirmados periodicamente, já que Instagram e o site anterior
retornaram bloqueios (HTTP 429/503) durante a pesquisa automatizada e não
puderam ser usados como fonte ao vivo no momento da criação deste site.
Nenhum procedimento, preço, equipamento ou depoimento foi inventado — o que
não pôde ser confirmado publicamente não aparece no site.

## Próximo passo

Adicionar as fotos e vídeos reais da Aline (ver instruções detalhadas em
[`assets/README.md`](assets/README.md)) para substituir os placeholders
visuais atualmente usados no lugar das imagens.

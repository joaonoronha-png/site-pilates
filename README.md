# Argento Escoramentos — site institucional

Site estático (HTML + CSS + JS puro, sem build). Basta abrir `index.html` ou publicar a pasta no GitHub Pages / Netlify / Vercel.

## O que tem
- **Intro animada** (logo montando + contagem) com botão **"Pular intro"** (também pula com Esc/Enter).
- **Hero** com fotos reais das obras, parallax e números.
- **Soluções** em grade *bento*.
- **Raio-X do escoramento**: diagrama interativo que se monta ao rolar e explica cada peça.
- **Obras**: galeria filtrável por estado + lightbox (setas, teclado, swipe).
- **Processo** em 6 etapas com linha de progresso.
- **Simulador de orçamento**: estimativa preliminar de peças e envio pronto pelo WhatsApp ou e-mail.
- **FAQ** com busca.
- **Assistente virtual (chatbot)** com ~40 assuntos, sugestões, fluxo de orçamento guiado e repasse para o WhatsApp.
- **Contato + mapa interativo** (Leaflet) com a sede e todas as obras.

## Onde editar
| O quê | Arquivo |
|---|---|
| WhatsApp, telefone, e-mail, endereço, horário, coordenadas da sede | `assets/js/config.js` |
| Obras (nome, cidade, fotos, coordenadas) | `assets/js/data.js` → `OBRAS` |
| Perguntas e respostas do bot e do FAQ | `assets/js/data.js` → `KB` |
| Fotos | `assets/img/obras/` |

> Contato comercial: Bibiana Lemos Mendes Vassallo (Gestora Comercial) · WhatsApp/telefone (21) 99973-2284.
> ⚠️ Ainda provisórios em `config.js`: **e-mail**, **endereço da sede** (e coordenadas do mapa) e **horário**.

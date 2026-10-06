# Mapersí Buffet — site

Site institucional e de conversão da **Mapersí Buffet** (Rio de Janeiro): buffet, estações gastronômicas e open bar para casamentos, festas e eventos corporativos.

Estático, sem framework e sem servidor: HTML + CSS + JavaScript puro (~70 KB de HTML, JS próprio sem dependências além do Lenis para rolagem suave). Pode ser publicado em qualquer hospedagem (Netlify, Vercel, Cloudflare Pages, GitHub Pages, hospedagem compartilhada).

## Ver localmente

```bash
python3 -m http.server 8080
# abrir http://localhost:8080
```

## Estrutura

```
index.html               ← gerado (não editar à mão)
src/index.html           ← template da página
tools/build.mjs          ← gera index.html (imagens responsivas, FAQ, schema, Instagram)
tools/convert_images.py  ← gera AVIF/WebP a partir de fotos novas
data/knowledge-base.js   ← BASE DE CONHECIMENTO (chat, FAQ, orçamento)
data/config.js           ← IDs de medição (GA4/GTM) — vazio por padrão
assets/css/main.css
assets/js/main.js        ← animações, galeria, menu, mapa, WhatsApp
assets/js/quote.js       ← orçamento interativo
assets/js/chat.js        ← Concierge Virtual
assets/js/lead.js        ← memória compartilhada orçamento ↔ chat
assets/js/analytics.js   ← eventos de conversão (dataLayer)
assets/js/map.js         ← mapa interativo "Onde estamos" (Leaflet + dados OSM locais)
data/map-data.js         ← ruas, trilhos, praças e estações do entorno (OpenStreetMap, ODbL)
assets/media/            ← fotos e vídeos reais do Instagram @mapersibuffet
docs/PESQUISA.md         ← o que foi confirmado, fontes e pendências
docs/MIDIA.md            ← origem de cada foto/vídeo
```

Depois de editar `src/index.html` ou a base de conhecimento (FAQ/schema), rode:

```bash
node tools/build.mjs
```

## Base de conhecimento (para a Mapersí completar)

`data/knowledge-base.js` é a única fonte de informação comercial. Cada tópico tem um `status`:

| status | o que a assistente faz |
|---|---|
| `confirmado` | responde com o texto de `answer` |
| `depende` | responde `answer` e conduz para coletar os dados do evento |
| `nao_confirmado` | diz que a equipe precisa confirmar e oferece levar a dúvida ao WhatsApp |

Para liberar uma resposta: preencha `answer`, troque o `status` e salve. O FAQ usa os mesmos tópicos (rode o build para atualizar o HTML). A lista do que falta está em `docs/PESQUISA.md`.

Serviços (`services`) e tipos de evento (`eventTypes`) têm `show`/`quote` para aparecer ou não no chat e no orçamento — ex.: o churrasco está cadastrado, mas desligado até ser confirmado.
Avaliações do Google entram em `reviews` e ativam o slider automaticamente.

## Concierge Virtual

- Entende linguagem natural por palavras-chave (sem acento, com variações)
- Guarda o contexto: “Vou casar em dezembro” → “São 150 pessoas” → “Vai ser na Barra” vira *Casamento · dezembro · 150 · Barra da Tijuca*, sem repetir perguntas
- Conduz o orçamento (data → local → convidados → serviço → restrições → nome) e termina no WhatsApp com a mensagem organizada
- “Falar com a equipe” fica sempre visível e leva tudo o que já foi dito
- Perguntas sem resposta confirmada viram “Dúvidas para a equipe” na mensagem do WhatsApp
- Compartilha a memória com o orçamento do site (o que foi dito em um aparece no outro)

## Medição (LGPD)

Nenhuma ferramenta de terceiros carrega por padrão. Os eventos vão para `window.dataLayer`:

`whatsapp_click` (com `context`), `quote_cta_click`, `quote_start`, `quote_step`, `quote_complete`, `quote_whatsapp`, `chat_open`, `chat_lead_start`, `chat_lead_complete`, `chat_handoff`, `chat_to_whatsapp`, `chat_unconfirmed` (mostra quais dúvidas a base ainda não cobre), `service_view`, `service_interest`, `portfolio_view`, `portfolio_open`, `portfolio_filter`, `review_nav`, `instagram_click`, `directions_click`, `map_load`, `map_pin_click`, `map_unlock`, `address_copy`, `catalog_request`, `feedback_video_play`, `google_rating_click`.

Para ativar GA4 ou GTM, preencha `data/config.js`; o site passa a mostrar um aviso de cookies e só carrega a ferramenta após o aceite.

## Performance e acessibilidade

- Imagens AVIF + WebP responsivas com `srcset`, `loading="lazy"` e cor de fundo enquanto carregam
- Vídeos H.264 comprimidos, sem áudio, `preload` mínimo; tocam só quando visíveis; pausados com “economia de dados” ou movimento reduzido
- Mapa interativo próprio: Leaflet com dados do OpenStreetMap salvos no site, carregado só quando a seção se aproxima; sem cookies nem chamadas a terceiros
- `prefers-reduced-motion` desativa animações, parallax e vídeo automático
- Navegação por teclado, foco visível, `skip link`, rótulos em todos os controles, alvos de toque ≥ 44 px

## Antes de publicar

1. Confirmar com a Mapersí a autorização de uso das fotos/vídeos (clientes e fotógrafos) — ver `docs/MIDIA.md`
2. Preencher as pendências da base de conhecimento — ver `docs/PESQUISA.md`
3. Substituir o wordmark pelo logo vetorial oficial, se houver
4. Ajustar o domínio em `canonical`, `og:url`, `sitemap.xml` e `robots.txt` caso não seja `mapersi.com.br`

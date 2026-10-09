# Aluguel Temporada RJ — site

Site da **Aluguel Temporada RJ** (Instagram [@_alugueltemporadarj](https://www.instagram.com/_alugueltemporadarj/), operação **Grupo 3D**): aluguel por temporada na Barra da Tijuca, em Copacabana/Leme e em Angra dos Reis.

Site estático (HTML + CSS + JS puro, sem build). Publica em qualquer hospedagem (Vercel, Netlify, Cloudflare Pages, GitHub Pages, hospedagem comum).

```bash
python3 -m http.server 8080   # abrir http://localhost:8080
```

## O que tem no site

| Recurso | Como funciona |
|---|---|
| **Intro animada** | Ondas do calçadão de Copacabana desenhadas na tela + logotipo. Aparece 1× por sessão, tem botão "Pular" e versão curta com movimento reduzido. |
| **Página inicial enxuta** | Destinos primeiro (3 blocos com foto e "Ver imóveis"), Quem somos, avaliações reais em carrossel, chamada para o Além das chaves, faixa para proprietários e dúvidas só com busca (sem resultado → assistente). |
| **Páginas por endereço** | `#destino/barra`, `#destino/copacabana`, `#destino/angra` (imóveis + mapa), `#alem-das-chaves/<regiao>` (serviços por região, de `alem` em `data/site-data.js`) e `#anuncie` (formulário do proprietário → WhatsApp ou e-mail). Funciona sem servidor. |
| **Página de cada imóvel** | Abre em `#imovel/<slug>` (link compartilhável): galeria com lightbox, descrição, comodidades, regras, mapa da região e consulta de datas que abre o WhatsApp com a mensagem pronta. Link para o anúncio no Airbnb. |
| **Mapa interativo** | MapLibre + OpenFreeMap (sem chave): os 7 imóveis (área aproximada) + escritório "3D" pulsante, mostra só os imóveis do destino aberto, pinos com casinha e nota. |
| **Botões redondos fixos** | Mesmo padrão dos sites anteriores: **Assistente (IA)**, **Mapa/rotas** (menu Google Maps, Mapas do iPhone, Waze e Uber até o escritório) e **WhatsApp** com anel pulsante. |
| **Concierge virtual (bot/agente de IA)** | Entende linguagem natural em português, espanhol e inglês, guarda o contexto (destino, pessoas, datas, comodidades, Réveillon/Carnaval), recomenda imóveis reais, responde dúvidas do FAQ e entrega tudo resumido no WhatsApp. Nunca inventa preço/disponibilidade. |
| Conteúdo | Tudo alimentado por `data/site-data.js`. |

Referências de mercado usadas: Airbnb (barra de busca, mapa + lista, página do imóvel com galeria 1+4 e caixa de reserva fixa), Booking/Vrbo (filtros por comodidade e regras claras), Housi/Charlie e Plum Guide (curadoria e tom de hospitalidade), onefinestay (serviços além das chaves).

## Estrutura

```
index.html                 página
privacidade.html           política de privacidade
data/site-data.js          ← BASE ÚNICA: empresa, imóveis, destinos, avaliações, FAQ
data/config.js             ← liga a IA (aiEndpoint)
assets/css/main.css
assets/js/main.js          intro, páginas (#destino, #alem-das-chaves, #anuncie), página do imóvel, busca de dúvidas, formulário do proprietário
assets/js/map.js           mapa interativo (MapLibre + OpenFreeMap)
assets/js/concierge.js     assistente virtual (motor local + IA opcional)
assets/vendor/maplibre/    MapLibre GL 4.7.1 (licença BSD-3, LICENSE.txt)
assets/img/                fotos (WebP em 2 tamanhos)
api/concierge.mjs          backend opcional com IA (Claude) para a Vercel
docs/PESQUISA.md           o que foi confirmado, fontes e pendências
docs/MIDIA.md              origem e licença de cada foto
```

## Como atualizar

Tudo está em **`data/site-data.js`** (vitrine, mapa, página do imóvel, FAQ e assistente leem o mesmo arquivo):

- **Preço:** preencha `diariaAPartir` (ex.: `'450'`) no imóvel → aparece "A partir de R$ 450 por noite".
- **Fotos de um imóvel:** salve `nome-720.webp` e `nome-1080.webp` em `assets/img/imoveis/<pasta>/` e liste em `fotos: [{ src: 'assets/img/imoveis/<pasta>/nome', alt: '...' }]`. Se a lista ficar vazia, o site usa uma foto da região com o selo "Foto da região".
- **Novo imóvel:** copie um bloco de `imoveis`, troque `slug`, dados e coordenadas aproximadas.
- **FAQ:** cada item tem `status` (`confirmado`, `depende`, `pendente`). Itens `pendente` mostram o selo "confirmado no atendimento" e o assistente anota a dúvida para a equipe.

## Ligar a IA de verdade (opcional)

O assistente já funciona sem servidor. Para respostas geradas por IA (Claude, da Anthropic):

1. Publique na **Vercel** (a pasta `api/` vira função serverless).
2. Em *Settings → Environment Variables*, crie `ANTHROPIC_API_KEY` (opcional: `CONCIERGE_MODEL`, padrão `claude-opus-5-5`).
3. Em `data/config.js`, defina `aiEndpoint: '/api/concierge'`.

O backend só recebe a base oficial do site, responde em JSON estruturado, nunca informa preço ou disponibilidade e marca quando deve passar para o WhatsApp. Se a IA falhar ou passar de 12 s, o site responde com o motor local automaticamente.

## Medição

Eventos vão para `window.dataLayer` (prontos para GA4/GTM, nenhum script de terceiros carregado): `whatsapp_click`, `booking_whatsapp`, `lead_whatsapp`, `property_view`, `search`, `smart_search`, `filter`, `chat_open`, `chat_recommend`, `chat_faq`, `chat_owner`, `chat_unconfirmed`, `chat_to_whatsapp`, `chat_handoff`, `routes_open`, `directions_click`, `map_load`, `map_pin_click`.

## Acessibilidade e desempenho

Imagens WebP responsivas com `srcset` e `loading="lazy"`; mapa carregado só quando a seção se aproxima; `prefers-reduced-motion` respeitado; navegação por teclado (Esc fecha página do imóvel, assistente, galeria e menu de rotas; foco preso no modal); alvos de toque ≥ 44 px; sem rolagem horizontal em 390 px.

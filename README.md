# Requinte & Sabor Buffet — site institucional

Site de página única, focado em **pedidos de orçamento pelo WhatsApp**, para a
Requinte & Sabor Buffet (Rua Pecegueiro do Amaral, 280 — Vargem Pequena, Rio de Janeiro).

HTML, CSS e JavaScript puros, no mesmo padrão dos projetos anteriores (base: Mapersí Buffet):
intro de abertura, **Concierge Virtual** (assistente que entende linguagem natural), **orçamento
interativo** passo a passo, FAQ com campo de busca, botões flutuantes, menu lateral, rolagem
suave (Lenis) e medição de conversões. Sem framework e sem servidor.
Basta publicar a pasta em qualquer hospedagem estática (Netlify, Vercel, GitHub Pages,
Hostinger etc.).

> ⚠ **Antes de publicar**, leia [`docs/PENDENCIAS.md`](docs/PENDENCIAS.md) e
> [`docs/IMAGENS.md`](docs/IMAGENS.md). As fotos atuais são provisórias e vários dados
> aguardam confirmação do cliente.

## Ver localmente

```sh
python3 -m http.server 8080
# abrir http://localhost:8080
```

## Estrutura

```
index.html                 página (conteúdo, SEO, dados estruturados)
404.html                   página de erro
robots.txt · sitemap.xml · site.webmanifest
assets/css/style.css       estilos (tokens de cor/tipografia no topo)
data/knowledge-base.js     ← BASE DE CONHECIMENTO (assistente, FAQ e orçamento)
assets/js/config.js        ← dados visuais (horário, "desde 1995", fotos, portfólio, cardápio, GA4/GTM)
assets/js/main.js          interações (intro, Lenis, animações, galeria, botões flutuantes)
assets/js/chat.js          Concierge Virtual
assets/js/quote.js         orçamento interativo (uma pergunta por tela)
assets/js/lead.js          memória compartilhada orçamento ↔ assistente
assets/js/analytics.js     eventos de conversão (dataLayer) + aviso de cookies
assets/vendor/lenis.min.js rolagem suave
tools/build-faq.mjs        regenera o FAQ do HTML a partir da base de conhecimento
assets/fonts/              Cormorant Garamond + Manrope (auto-hospedadas, licença OFL)
assets/img/provisorias/    fotos provisórias em AVIF/WebP (480–1800 px)
scripts/definir-dominio.sh troca o domínio provisório
scripts/otimizar-fotos.sh  gera AVIF/WebP das fotos reais
docs/                      pendências e mapa de imagens
```

## Base de conhecimento — `data/knowledge-base.js`

Única fonte de informação comercial. Cada tópico tem um `status`:

| status | o que a assistente faz |
|---|---|
| `confirmado` | responde com o texto de `answer` |
| `depende` | responde `answer` e conduz para o orçamento |
| `nao_confirmado` | diz que a equipe precisa confirmar e oferece levar a dúvida ao WhatsApp |

Para liberar uma resposta: preencha `answer`, troque o `status` e rode `node tools/build-faq.mjs`
(atualiza o FAQ do HTML e os dados estruturados). Hoje estão como `nao_confirmado`: número mínimo de
convidados, regiões atendidas, bebidas, menu infantil, degustação, restrições alimentares,
personalização, equipe, louças/montagem, contrato, pacotes, antecedência e tempo de mercado.

## Concierge Virtual

- Entende linguagem natural por palavras-chave (sem acento, com variações)
- Guarda o contexto: “Vou casar em maio” → “São 150 pessoas” → “Vai ser no Recreio”
- Conduz o orçamento (evento → data → local → convidados → interesse → restrições → nome) e termina no WhatsApp com a mensagem organizada
- “Falar com a equipe” fica sempre visível e leva tudo o que já foi dito
- Perguntas sem resposta confirmada viram “Dúvidas para a equipe” na mensagem do WhatsApp
- Compartilha a memória com o orçamento do site
- Não inventa: preços, datas e condições são sempre confirmados pela equipe

## Medição (LGPD)

Nenhuma ferramenta de terceiros carrega por padrão. Eventos em `window.dataLayer`: `whatsapp_click`,
`quote_cta_click`, `quote_start`, `quote_step`, `quote_complete`, `quote_whatsapp`, `chat_open`,
`chat_lead_start`, `chat_lead_complete`, `chat_handoff`, `chat_to_whatsapp`, `chat_unconfirmed`,
`faq_search`, `faq_open`, `instagram_click`, `directions_click`, `routes_open`, `address_copy`,
`map_load`, `menu_open`. Para GA4/GTM, preencha `RS_CONFIG` em `assets/js/config.js` (aparece o aviso de cookies).

## Edições do dia a dia — `assets/js/config.js`

| Quero… | Campo |
|---|---|
| Mudar o horário | `horario` (e também `openingHoursSpecification` no `index.html`) |
| Mostrar "Desde 1995" | `desde1995Confirmado: true` |
| Publicar depoimentos reais | `avaliacoes: [{ texto, nome, fonte }]` |
| Ativar o portfólio | `portfolio: [{ src, categoria, alt, largura, altura }]` — só fotos reais |
| Publicar o cardápio | `cardapio: { titulo, secoes: [{ nome, itens }] }` |
| Tirar o selo "Imagem ilustrativa" | `imagensIlustrativas: false` (só depois de trocar todas as fotos) |

Seções e itens sem dados confirmados ficam **ocultos** automaticamente.

## Jornada da página

Desejo (hero) → Sobre → Tipos de evento → Gastronomia → Experiência (storytelling
no scroll) → Prova social + diferenciais → Portfólio (quando houver fotos reais) →
Como funciona → Formulário de orçamento → FAQ → Contato.

## WhatsApp

- Botões flutuantes redondos: Como chegar (Google Maps, Mapas do iPhone, Waze), assistente e WhatsApp.
- Se a pessoa já respondeu algo no orçamento ou na assistente, os botões de WhatsApp levam essas informações junto.
- Todos os CTAs principais abrem `wa.me/5521975143297` com a mensagem:
  *"Olá! Conheci a Requinte & Sabor pelo site e gostaria de solicitar um orçamento para meu evento."*
- Os links "Planejar meu casamento" etc. levam ao orçamento interativo com o tipo de evento já escolhido.
- Nada é enviado a servidor: as respostas seguem apenas na mensagem que a pessoa manda pelo WhatsApp.

## SEO local

- `title`, `meta description`, canonical, Open Graph/Twitter, H1 com marca + cidade.
- H2/rodapé com termos como buffet para casamento, 15 anos, aniversário, corporativo,
  coffee break, Rio de Janeiro, Vargem Pequena, Zona Oeste.
- JSON-LD: `LocalBusiness`/`FoodEstablishment`, `WebSite`, `FAQPage` (só respostas confirmadas).
  Não há `aggregateRating` (contagem de avaliações não confirmada).
- Âncoras amigáveis: `#casamentos`, `#15-anos`, `#aniversarios`, `#corporativos`,
  `#coffee-break`, `#gastronomia`, `#orcamento`, `#contato`…
- Após definir o domínio: `sh scripts/definir-dominio.sh www.seudominio.com.br`
  e enviar o `sitemap.xml` no Google Search Console.

## Desempenho e acessibilidade

- Imagens AVIF + WebP com `srcset`/`sizes`, `width`/`height` (sem CLS) e `loading="lazy"`.
- Só a primeira imagem do hero é pré-carregada; fontes auto-hospedadas com `font-display: swap`.
- Mapa do Google carregado apenas quando o visitante clica (não pesa no carregamento).
- Animações respeitam `prefers-reduced-motion`; sem JavaScript o conteúdo continua visível.
- Link "Pular para o conteúdo", foco visível, lightbox com teclado (← → Esc) e gesto de arrastar.

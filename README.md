# Requinte & Sabor Buffet — site institucional

Site de página única, focado em **pedidos de orçamento pelo WhatsApp**, para a
Requinte & Sabor Buffet (Rua Pecegueiro do Amaral, 280 — Vargem Pequena, Rio de Janeiro).

HTML, CSS e JavaScript puros: sem build, sem framework, sem dependências externas.
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
assets/js/config.js        ← DADOS EDITÁVEIS (horário, avaliações, portfólio, cardápio, FAQ)
assets/js/main.js          interações
assets/fonts/              Cormorant Garamond + Manrope (auto-hospedadas, licença OFL)
assets/img/provisorias/    fotos provisórias em AVIF/WebP (480–1800 px)
scripts/definir-dominio.sh troca o domínio provisório
scripts/otimizar-fotos.sh  gera AVIF/WebP das fotos reais
docs/                      pendências e mapa de imagens
```

## Edições do dia a dia — `assets/js/config.js`

| Quero… | Campo |
|---|---|
| Mudar o horário | `horario` (e também `openingHoursSpecification` no `index.html`) |
| Mostrar "Desde 1995" | `desde1995Confirmado: true` |
| Publicar depoimentos reais | `avaliacoes: [{ texto, nome, fonte }]` |
| Ativar o portfólio | `portfolio: [{ src, categoria, alt, largura, altura }]` — só fotos reais |
| Publicar o cardápio | `cardapio: { titulo, secoes: [{ nome, itens }] }` |
| Responder uma pergunta do FAQ | preencher `resposta` em `faqPendentes` |
| Tirar o selo "Imagem ilustrativa" | `imagensIlustrativas: false` (só depois de trocar todas as fotos) |

Seções e itens sem dados confirmados ficam **ocultos** automaticamente.

## Jornada da página

Desejo (hero) → Sobre → Tipos de evento → Gastronomia → Experiência (storytelling
no scroll) → Prova social + diferenciais → Portfólio (quando houver fotos reais) →
Como funciona → Formulário de orçamento → FAQ → Contato.

## WhatsApp

- Todos os CTAs principais abrem `wa.me/5521975143297` com a mensagem:
  *"Olá! Conheci a Requinte & Sabor pelo site e gostaria de solicitar um orçamento para meu evento."*
- Os links "Planejar meu casamento" etc. levam ao formulário com o tipo de evento já selecionado.
- O formulário não envia dados a servidor: monta a mensagem com as respostas e abre o WhatsApp.
- Botão flutuante discreto aparece depois do hero e some no formulário/contato.

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

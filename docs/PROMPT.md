# Prompt — Site Mapersí Buffet

Cole o texto abaixo na ferramenta (Lovable, Bolt, Cursor, Claude Code…) junto com o arquivo `mapersi-buffet-site.zip`.

---

Você vai publicar e manter o site da **Mapersí Buffet** (Rio de Janeiro). O projeto completo está no arquivo `mapersi-buffet-site.zip` anexado. É um site estático pronto (HTML + CSS + JavaScript puro, sem framework). **Preserve exatamente o design, os textos, as fotos, as animações e o comportamento.** Não reescreva em outro framework, a não ser que eu peça.

## O que fazer agora
1. Importe todos os arquivos do zip mantendo a estrutura de pastas.
2. Publique a pasta raiz como site estático. A página principal é `index.html`; existe também `privacidade.html`.
3. Configure o domínio `mapersi.com.br` (as tags `canonical`, `og:url`, `sitemap.xml` e `robots.txt` já apontam para ele).
4. Não adicione bibliotecas, rastreadores ou CDNs novos. Tudo que o site usa já está em `assets/vendor/` (Lenis e Leaflet) e as fontes vêm do Google Fonts (Fraunces, Jost, IBM Plex Mono).

## Como o projeto funciona
- `src/index.html` é o template. `index.html` é **gerado** por `node tools/build.mjs` (gera as imagens responsivas AVIF/WebP, o FAQ, o schema JSON-LD, o portfólio, as avaliações e as faixas do Instagram). Ao mudar a página, edite `src/index.html` e rode o build — nunca edite só o `index.html`.
- `data/knowledge-base.js` é a **única fonte de informações comerciais**: serviços, tipos de evento, avaliações, FAQ e as respostas da Concierge Virtual. Cada tópico tem `status`:
  - `confirmado` → a assistente responde com o texto;
  - `depende` → responde e conduz para coletar dados do evento;
  - `nao_confirmado` → diz que a equipe precisa confirmar e oferece levar a dúvida ao WhatsApp.
- `assets/js/chat.js` é a Concierge Virtual (sem IA externa): entende linguagem natural por palavras-chave, guarda o contexto (evento, data, local, convidados, serviço, restrições, nome), conduz o orçamento e termina no WhatsApp com a mensagem organizada.
- `assets/js/quote.js` é o orçamento em etapas (uma pergunta por tela; a opção "Outro" abre campo para escrever). Ele compartilha os dados com a Concierge via `assets/js/lead.js`.
- `assets/js/map.js` + `data/map-data.js` é o mapa interativo próprio (Leaflet com dados do OpenStreetMap salvos no site — não usa Google Maps nem cookies).
- `assets/js/analytics.js` envia eventos de conversão para `window.dataLayer`. GA4/GTM só carregam se preenchidos em `data/config.js`, e somente após o aceite no aviso de cookies (LGPD).

## Regras que não podem ser quebradas
- **Não invente informações**: preço, cardápio, capacidade, política, desconto, forma de pagamento, prazo, disponibilidade, equipe, prêmios ou depoimentos. O que não estiver confirmado continua como `nao_confirmado` na base.
- Use somente fotos reais da Mapersí (Instagram @mapersibuffet e site oficial). Nunca use banco de imagens ou fotos de concorrentes.
- As avaliações exibidas são reais (Google, nota 5,0) e estão em `reviews` na base. Não use os depoimentos de modelo do site antigo.
- Mantenha acessibilidade (foco visível, rótulos, `prefers-reduced-motion`), desempenho (imagens responsivas, vídeos sem áudio carregados só quando visíveis) e o layout mobile.

## Dados oficiais (já no site)
- Mapersí Buffet — Buffet e Estações. Buffet volante em todo o estado do Rio de Janeiro, desde 2018.
- Rua Caiena, Bento Ribeiro, Rio de Janeiro – RJ, CEP 21555-140.
- WhatsApp/telefone: (21) 99352-3937 · E-mail: contato@mapersi.com.br · Instagram: @mapersibuffet.
- Serviços: buffet completo; estações (massas, risotos, crepes, fast food, cascata de chocolate); entradas e ilhas gastronômicas; welcome drinks e open bar; coffee break corporativo; festas infantis com opção de take-away.
- Clientes e parceiros: Fiocruz, SENAI, Hospital Carlos Chagas, Estasa, Cartão de Todos, Colégio Sagrado Coração de Maria.

## Pendências para completar com a Mapersí
A lista está em `docs/PESQUISA.md` (degustação, restrições alimentares, bebidas incluídas, pagamento, contrato, horário, logo vetorial, fotos em alta resolução, autorização de uso das imagens). Quando a Mapersí enviar uma informação, atualize o tópico em `data/knowledge-base.js` (troque o `status` e escreva o `answer`) e rode `node tools/build.mjs`.

## Seções da página (nesta ordem)
Hero com vídeo · Manifesto · Experiências gastronômicas · Gastronomia (carrossel) · Portfólio (6 eventos reais com filtros e fotos) · Como funciona · Avaliações (6 em rotação + vídeo) · Momento de impacto · Orçamento interativo · Instagram (@mapersibuffet + duas faixas de fotos em sentidos opostos) · CTA final · Onde estamos (mapa interativo) · Perguntas frequentes · Clientes & parceiros · Rodapé. Menu lateral à direita e botões flutuantes redondos (Como chegar, Concierge, WhatsApp).

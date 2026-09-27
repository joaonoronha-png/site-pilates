# By Dani Decora — site institucional

Site da **By Dani Decora**, decoração de festas e eventos no Rio de Janeiro (Barra da Tijuca).
Site estático, rápido e sem framework: HTML, CSS e um JavaScript pequeno, sem dependências.

- `dist/` → **site pronto para publicar**: pode ir para qualquer hospedagem estática (Netlify, Vercel, Cloudflare Pages, Hostinger…).
- `src/` → código-fonte (páginas, parciais, CSS, JS, fontes e fotos originais).
- `scripts/build.mjs` → gera o `dist/`.

## Como rodar

```bash
npm install
npm run build        # gera imagens otimizadas + páginas em dist/
npm run build:html   # mais rápido: só páginas/CSS/JS, reaproveitando as imagens
npm run serve        # abre em http://localhost:4173
```

Antes de publicar, defina o domínio definitivo (usado em canonical, Open Graph, sitemap e robots):

```bash
SITE_URL=https://www.seudominio.com.br npm run build
```

> O domínio `https://www.bydanidecora.com.br`, usado por padrão, é **provisório** e ainda não foi confirmado.

## Trocar ou adicionar fotos

As fotos atuais são **fotos reais da By Dani Decora, publicadas no perfil da empresa no Google Maps**. Elas têm resolução
baixa (são fotos de celular reenviadas), então o ideal é trocá-las pelos arquivos originais em alta resolução.

1. Coloque o arquivo em `src/assets/originals/`, **com o mesmo nome** da foto que vai substituir (por exemplo `festa-sininho.jpg`).
2. Rode `npm run build`. O script gera AVIF, WebP e JPG em várias larguras, e o HTML passa a usar as novas versões automaticamente.

Para uma foto **nova**, registre-a na lista `IMAGES` em `scripts/build.mjs` e use-a no HTML com:

```html
<x-img name="nome-da-foto" alt="Descrição da imagem" sizes="(min-width: 768px) 50vw, 100vw"></x-img>
```

No build, essa tag vira um `<picture>` responsivo completo. Para acrescentar um projeto ao portfólio, copie um bloco
`gallery__item` em `src/pages/index.html` (ali há comentários explicando cada passo).

## Conteúdo — o que foi verificado

| Informação | Fonte |
|---|---|
| Endereço, telefone/WhatsApp e categoria | Perfil da empresa no Google Maps |
| Instagram **@bydanidecora** | Link publicado no próprio perfil do Google |
| Nota 5,0 com 13 avaliações e os 3 depoimentos exibidos | Avaliações públicas no Google Maps (texto mantido como no original, com trechos marcados com […]) |
| Decoração de Natal e "decoração afetiva" | Avaliação de cliente e resposta da proprietária no Google |
| Chá revelação, aniversários, festas infantis, balões | Fotos e avaliações públicas |

**Não foram incluídos** (por falta de confirmação): horário de funcionamento, e-mail, preços, números de eventos, anos de
mercado e biografia. As áreas que dependem disso estão marcadas no HTML com comentários:

- **Foto e biografia da Dani** → seção "Sobre" (`src/pages/index.html`).
- **Razão social/CNPJ** e revisão jurídica → `politica-de-privacidade` e `termos-de-uso`.

## Como funciona

- **WhatsApp**: todos os botões abrem `wa.me/5521995188453` com a mensagem pré-preenchida. O formulário de orçamento
  não envia nada para servidor: ele organiza as respostas em uma mensagem e abre o WhatsApp.
  Para mudar o número ou a mensagem, edite `WHATSAPP` e `WHATSAPP_MSG` em `scripts/build.mjs`.
- **Desempenho**: fontes hospedadas no próprio site (sem Google Fonts), imagens AVIF/WebP responsivas com lazy loading,
  preload apenas da imagem principal, JS com `defer`. A primeira carga no celular fica em torno de 140 KB.
- **Acessibilidade**: link "pular para o conteúdo", foco visível, menu e lightbox navegáveis por teclado (Esc e setas),
  labels em todos os campos, mensagens de erro anunciadas e suporte a `prefers-reduced-motion`.
- **SEO**: title/description, Open Graph com imagem, dados estruturados `LocalBusiness`, hierarquia H1/H2/H3,
  `sitemap.xml`, `robots.txt` e URLs amigáveis (`/politica-de-privacidade/`, `/termos-de-uso/`).

# By Dani Decora — site institucional

Site da **By Dani Decora**, decoração de festas e eventos no Rio de Janeiro (Barra da Tijuca).
Site estático: `index.html` + `assets/`, pronto para qualquer hospedagem (Netlify, Vercel, Cloudflare Pages, Hostinger…).

- Visual editorial com o **arco** (o formato dos painéis de festa) como moldura das fotos.
- Animações com GSAP, ScrollTrigger, SplitText e Lenis (carregados por CDN). Sem essas bibliotecas, o site continua completo e legível.
- Tela de abertura, slideshow no hero, frase que acende palavra por palavra, portfólio horizontal, carrosséis arrastáveis, galeria ampliada, cursor personalizado, mapa estilizado e botões flutuantes de WhatsApp e rotas.
- Respeita `prefers-reduced-motion`, funciona por teclado e foi testado de 390 px a 1440 px.

## Estrutura

```
index.html                  página principal
assets/css/site.css         estilos
assets/js/site.js           interações (configuração do WhatsApp no topo)
assets/originals/           fotos originais — troque aqui
assets/img/                 fotos tratadas e mapa (gerados pelo script)
politica-de-privacidade/    página legal
termos-de-uso/              página legal
scripts/build-images.mjs    tratamento das fotos
```

## Rodar localmente

```bash
npm install
npm run serve        # http://localhost:4173
```

## Fotos

- **Portfólio e faixa de detalhes:** fotos reais da By Dani Decora, do perfil público no Google. Cada festa aparece uma única vez.
- **Início, serviços, sobre e convite final:** fotos de banco **provisórias**, com licença CC0 (domínio público, uso comercial
  permitido), do diretório de fotos do WordPress. Créditos em `assets/originals/CREDITOS-BANCO.json`. Os arquivos começam
  com `banco-`. Elas não aparecem como projetos da empresa e devem ser trocadas por fotos da By Dani antes de publicar.

- **Vídeo (seção Em movimento):** montagem vertical com clipes do [Mixkit](https://mixkit.co/license/) (uso comercial livre,
  sem crédito obrigatório), gerada por `npm run video`. Provisório: substitua `assets/video/em-movimento.mp4` por um vídeo
  gravado nas festas da By Dani.
- **Regra do site:** cada imagem aparece uma única vez (as duas versões de cada serviço são para desktop e celular).

## Trocar as fotos

As fotos reais disponíveis hoje são pequenas (480–1440 px).
O script amplia cada uma até 2× com Lanczos, aplica nitidez leve e ajusta a cor, mas o ideal é usar os originais.

1. Coloque os arquivos originais em `assets/originals/` com os mesmos nomes (`cha-revelacao.png`, `festa-sininho.jpg`…).
2. Rode `npm run images`. As versões em `assets/img/` são regeneradas, e o site passa a usá-las.

Para fotos novas, adicione-as nas listas `PHOTOS`/`CROPS` do script e use `assets/img/<nome>.webp` no HTML.
Antes de publicar, peça à empresa **autorização de uso** das imagens.

## Conteúdo — o que foi verificado

| Informação | Fonte |
|---|---|
| Endereço (CEO Corporate Executive Offices, Bloco 3 – sala 402), WhatsApp e categoria | Google Maps, diretório do CEO e Portal do Casamento |
| Instagram **@bydanidecora** | Link no perfil do Google e botão do Portal do Casamento (ambos para `instagram.com/bydanidecora`) |
| Nota 5,0, 13 avaliações e os 8 depoimentos | Avaliações públicas do Google (texto original; trechos omitidos marcados com […]) |
| Casamentos, festas infantis, festas e eventos, balões, maternidade | Diretório do CEO, Portal do Casamento, fotos e avaliações |
| Entrada acessível e "empresa de empreendedoras" | Atributos do perfil do Google |

**Não incluído** por falta de confirmação: horário, e-mail, preços, formas de pagamento, número de eventos, ano de
fundação, equipe e biografia. Pendências marcadas no HTML com comentários: foto e biografia da Dani (seção Sobre),
razão social/CNPJ e revisão jurídica das páginas legais. O domínio `bydanidecora.com.br` usado em canonical, Open Graph e
sitemap é **provisório**.

## Avaliações do Google automáticas (Lovable)

O site já está preparado para atualizar sozinho a **nota**, o **total de avaliações** e acrescentar **avaliações novas** ao
carrossel. Enquanto a integração não estiver ativa, ele mostra os dados fixos da página (5,0 · 13 avaliações).

Como funciona: a função `supabase/functions/google-reviews` consulta a API oficial do Google (Places API) e guarda o
resultado por 24 h; o site lê essa função. A chave do Google fica só no servidor, nunca no código do site.

1. **Google Cloud** (console.cloud.google.com): crie um projeto, ative o faturamento e a **Places API (New)**, e gere uma
   **chave de API** (em "Restrições", limite a chave à Places API). O Google cobra por uso, mas oferece uma cota gratuita
   mensal. Com o cache de 24 h, a expectativa é ficar dentro dela; confira os valores atuais no painel do Google.
2. **Lovable**: ative o backend (Lovable Cloud, que usa Supabase) e adicione o segredo `GOOGLE_PLACES_API_KEY` com a chave.
   Opcional: `GOOGLE_PLACE_ID` (sem ele, a função encontra a empresa pelo nome e endereço).
3. Crie a Edge Function **google-reviews** com o conteúdo de `supabase/functions/google-reviews/index.ts` (se o projeto
   estiver sincronizado com este repositório pelo GitHub, ela já vem junto). Ela é pública (`verify_jwt = false` em
   `supabase/config.toml`).
4. Copie a URL da função (algo como `https://SEU-PROJETO.supabase.co/functions/v1/google-reviews`) e cole em
   `index.html`, na linha `<meta name="bd-reviews-endpoint" content="">`.

Observações: a API do Google devolve no máximo as **5 avaliações** mais relevantes por consulta (a nota e o total são
sempre os atuais). Avaliações que já estão no site não são duplicadas. Os nomes dos menus do Lovable e do Google Cloud
podem mudar com o tempo.

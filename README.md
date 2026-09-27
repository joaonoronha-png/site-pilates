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

## Trocar as fotos

As fotos atuais são **provisórias**: vêm do perfil público da empresa no Google e são pequenas (480–1440 px).
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

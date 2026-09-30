# Carrione Festas — site

Site de uma página para a **Carrione Festas** (decoração de festas, buffet e Pegue e Monte no Rio de Janeiro).
O objetivo principal é gerar pedidos de orçamento pelo WhatsApp.

HTML, CSS e JavaScript puros, sem etapa de build. Para publicar, envie a pasta inteira para qualquer hospedagem estática
(Netlify, Vercel, GitHub Pages, Hostinger etc.). Para ver localmente, rode `python3 -m http.server` e abra `http://localhost:8000`.

## Intro

Na primeira visita da sessão aparece uma abertura curta (logo + "Decoração · Buffet · Pegue e Monte", ~2 s) que se abre
revelando a foto principal. Clicar pula a intro. Ela não aparece de novo na mesma sessão nem para quem ativou "reduzir movimento".

## Recursos visuais

- Abertura com 4 fotos reais em rotação (zoom lento, indicadores clicáveis).
- Carrossel giratório de duas faixas no bloco do Instagram (pausa ao passar o mouse; cada foto leva ao perfil).
- Mapa da área atendida: município do Rio contornado (limite oficial do OpenStreetMap), regiões marcadas,
  zoom (+/−, duplo clique) e arrastar; no celular o mapa é arrastável para os lados. Arquivo local, sem chave de API.
- Botão redondo de mapa (como nos outros sites) acima do WhatsApp: abre Google Maps, Apple Maps, Waze ou o mapa do site.
  [PENDENTE] Sem endereço público, os apps mostram "Rio de Janeiro, RJ". Preencha `ENDERECO` no `main.js`
  e o botão passa a traçar rota até o endereço.
- GSAP + ScrollTrigger (parallax, zoom do mapa, faixa de temas que acelera com a rolagem) e Lenis (rolagem suave no desktop).
  São carregados depois da página; se o CDN falhar, o site continua funcionando com animações simples.
- Formulário "Monte seu pedido" no final (mesmo modelo do By Dani Decora): nome, WhatsApp, serviços, tipo de festa, tema,
  data, bairro, convidados e mensagem. Ao enviar, mostra um resumo e abre o WhatsApp com a mensagem pronta.
  Nada é salvo ou enviado pelo site. Os links "Prefere responder umas perguntas?" dos serviços já marcam o serviço no formulário.
  Os Google Forms do Linktree deixaram de aparecer no site; o formulário próprio os substitui.
- Barra de progresso de leitura, galeria com filtros e ampliação, botão flutuante de WhatsApp.

## Estrutura

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Todas as seções, SEO (title, description, Open Graph, schema LocalBusiness) |
| `assets/css/style.css` | Visual, responsividade e animações |
| `assets/js/fotos.js` | **Fotos do site** (único arquivo a editar para colocar as imagens) |
| `assets/js/main.js` | WhatsApp, galeria com filtros, lightbox, animações, menu |
| `assets/fotos/` | Pasta para as fotos reais |

## Fontes das informações

Tudo o que aparece no site foi conferido no Linktree oficial (`linktr.ee/carrionefestas`):

- WhatsApp: +55 21 99987-4670
- E-mail: carrionefernanda@gmail.com
- Instagram: **@carrione_festas** (é o perfil para onde o Linktree aponta)
- Facebook: facebook.com/profile.php?id=100067659618283
- Serviços: Decoração de Festas, Pegue e Monte, Buffet
- Formulários de orçamento (Google Forms) para decoração e para buffet
- Temas com álbuns no Facebook: Bailarina, Flamengo, Mickey Safari, Moana Baby, Patrulha Canina, Princesas Disney, Princesa e o Sapo
- Área: Rio de Janeiro ("Decoradora de festas - RJ")

## Conteúdo pendente

Os itens abaixo estão marcados com `[PENDENTE]` no código:

1. **Mais fotos / fotos do Instagram.** As 32 fotos atuais vêm dos álbuns públicos da página da Carrione no Facebook
   (os mesmos do Linktree). O Instagram bloqueia download sem login; para usar fotos de lá, basta salvá-las em
   `assets/fotos/` e registrar em `assets/js/fotos.js`. Não há fotos de buffet publicadas; o bloco Buffet usa uma foto de doces da decoração.
2. **Depoimentos.** Não foram encontradas avaliações públicas verificáveis, então a seção não existe.
   Quando houver (Google, Facebook), inclua primeiro nome, nota e plataforma.
3. **Pegue e Monte.** O texto usa só a definição da modalidade. Faltam confirmar temas/kits, retirada e devolução, prazos e condições.
4. **Buffet.** Cardápios, itens inclusos e capacidade não são públicos e não foram inseridos.
5. **Domínio.** Preencher `canonical` e `og:url` no `index.html` e trocar os caminhos de `og:image`/schema por URLs absolutas.
6. **Endereço.** Não é público e não foi incluído.

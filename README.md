# Carrione Festas — site

Site de uma página para a **Carrione Festas** (decoração de festas, buffet e Pegue e Monte no Rio de Janeiro).
O objetivo principal é gerar pedidos de orçamento pelo WhatsApp.

HTML, CSS e JavaScript puros, sem etapa de build. Para publicar, envie a pasta inteira para qualquer hospedagem estática
(Netlify, Vercel, GitHub Pages, Hostinger etc.). Para ver localmente, rode `python3 -m http.server` e abra `http://localhost:8000`.

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

1. **Fotos reais.** Instagram e Facebook exigem login para baixar imagens, então nenhuma foto foi incluída.
   Enquanto faltarem, o site mostra fundos nas cores de cada tema, e cada tema do portfólio leva ao álbum oficial no Facebook.
   Veja `assets/js/fotos.js`.
2. **Depoimentos.** Não foram encontradas avaliações públicas verificáveis, então a seção não existe.
   Quando houver (Google, Facebook), inclua primeiro nome, nota e plataforma.
3. **Pegue e Monte.** O texto usa só a definição da modalidade. Faltam confirmar temas/kits, retirada e devolução, prazos e condições.
4. **Buffet.** Cardápios, itens inclusos e capacidade não são públicos e não foram inseridos.
5. **Domínio.** Preencher `canonical` e `og:url` no `index.html` e trocar os caminhos de `og:image`/schema por URLs absolutas.
6. **Endereço.** Não é público e não foi incluído.

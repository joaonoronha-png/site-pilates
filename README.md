# Rebecca Gemaque — Assessoria & Cerimonial

Site estático em HTML, CSS e JavaScript, sem etapa de build.
Pode ser hospedado em qualquer lugar: Netlify, Vercel, GitHub Pages, Hostinger, etc.

```
index.html                    página principal
politica-de-privacidade.html
eventos/modelo.html           modelo para páginas individuais de eventos
assets/css/style.css          design system (cores, tipografia, componentes)
assets/js/config.js           ⚙️ configurações editáveis (WhatsApp, formulário, métricas)
assets/js/main.js             interações e animações
assets/js/vendor/             GSAP 3.13 (+ScrollTrigger, SplitText) e Lenis 1.3, hospedados no próprio site
assets/img/fotos/             fotos do site (WebP)
robots.txt · sitemap.xml
```

Para visualizar localmente: `npx http-server .` e abra http://localhost:8080

---

## O que o site faz

| Recurso | Onde |
|---|---|
| Tela de abertura com o nome surgindo letra por letra (só na 1ª visita da sessão) | topo |
| Slideshow automático no topo, com 5 fotos, barras de progresso e legenda do casal. No celular, deslizar troca a foto | Hero |
| Faixa de categorias em movimento contínuo | abaixo do Hero |
| Títulos que entram linha por linha e frases que se acendem palavra por palavra conforme a rolagem | todas as seções |
| Menu em tela cheia, com prévia de foto ao passar o mouse | botão "Menu" |
| Rolagem suave (Lenis), barra de progresso da leitura e cabeçalho que se esconde ao descer e volta ao subir | global |
| Foto da modalidade que acompanha a rolagem | Assessoria |
| Portfólio em rolagem horizontal fixa no computador e em deslize no celular, com ampliação ao clicar | Portfólio |
| Depoimentos que passam sozinhos. Pausam ao tocar ou passar o mouse e podem ser arrastados | Depoimentos |
| Carrossel do Instagram girando sem parar em duas faixas. Dá para segurar e arrastar, com inércia | Instagram |
| Botões magnéticos e cursor personalizado ("Ver" e "Arraste") | computador |
| Rodapé com letreiro gigante animado | Rodapé |

Tudo isso se desliga automaticamente para quem ativa "reduzir movimento" no sistema.
Se as bibliotecas não carregarem, o site continua completo e legível, apenas sem as animações.

## Fotos

As fotos vieram do site antigo da Rebecca (Alboom): são 22 álbuns de eventos que ela acompanhou.
Os nomes dos casais e dos locais nas legendas foram tirados desses mesmos álbuns.

- `hero-1…5`: slideshow do topo (Teka & Filipe, Samara & Igor, Monique & Michel, Linda & Fábio, Luiza & Tiago)
- `portfolio-01…10`: portfólio
- `casamentos`, `destination`, `mini-wedding`, `15-anos`, `celebracoes`, `eventos`: mosaico de experiências
- `detalhe-01…12`: carrossel do Instagram

**Antes de publicar:**
- Peça os originais em alta resolução. As versões atuais têm no máximo 1200px, e o ideal para o topo é 2400px.
- Confirme a autorização dos casais e dos fotógrafos. Algumas fotos têm marca-d'água (ex.: *Cristiane Mattos*, *Talita Raiff*, *Caio Gomes*).
- A foto de "Destination weddings" é uma vista para o mar num making of. Troque por um destination real quando houver.
- A de "Eventos corporativos" é da feira *Planejamento Ideal*.

Para trocar uma foto, substitua o arquivo `.webp` mantendo o nome, ou edite o `src` e o `alt` no `index.html`.
O enquadramento de cada foto é ajustado pelo `style="--pos: 50% 40%"` (horizontal e vertical).

## Textos e dados

Todos os textos estão no `index.html`, organizados por seção.

- **Depoimentos:** 7 avaliações 5 estrelas do Google, escolhidas pela empresa. Só aparece entre aspas o texto literal da cliente; o restante é resumo (marcado como "Destaques" ou "Resumo da avaliação"). Para usar o texto completo de Vanessa Santanna e A.N., cole as palavras delas no `index.html`.
- **Faixa de autoridade:** Google 5,0 · 79 avaliações (confirmado pela empresa) e Casamentos.com.br 5,0 · 15 avaliações · 100% de recomendação (conferido em set/2026).
  "Casamentos Awards 2022" continua com * até ser confirmado.
- **Preços:** valores de referência do briefing. O próprio Casamentos.com.br indica "a partir de R$ 4.000".
- **Domínio:** troque `https://www.rebeccagemaque.com.br/` pelo domínio real em `index.html`, `robots.txt` e `sitemap.xml`.
- **Política de Privacidade:** revise o texto com apoio jurídico.

## Formulário

Sem configuração, o formulário valida os campos e monta a mensagem completa para o **WhatsApp** (21) 99981-1992.
Para também receber por e-mail ou planilha, cole a URL de um serviço (Formspree, Make, Zapier, Google Apps Script…) em `formEndpoint`, no arquivo `assets/js/config.js`.

## Métricas

Preencha `analytics.ga4` e/ou `analytics.metaPixel` em `assets/js/config.js`. O site dispara os eventos `generate_lead` (envio do formulário) e `contact_whatsapp` (clique no WhatsApp), que também chegam ao `window.dataLayer` para uso com o Google Tag Manager.

## Páginas de eventos

1. Duplique `eventos/modelo.html` (ex.: `eventos/luiza-e-tiago.html`) e preencha.
2. No portfólio do `index.html`, informe `data-href="eventos/luiza-e-tiago.html"`. O lightbox passa a mostrar "Ver história completa".
3. Remova o `noindex` da nova página e adicione a URL ao `sitemap.xml`.

## Paleta

| Token | Cor | Uso |
|---|---|---|
| `--ivory` | #F7F3ED | fundo principal |
| `--off` | #FCFAF7 | seções de respiro, formulário |
| `--sand` | #DED3C5 | destaques sobre escuro |
| `--taupe` | #B9AA9B | linhas, números |
| `--brown` | #403731 | itálicos, labels |
| `--graphite` / `--ink-deep` | #292623 / #1E1B19 | texto, seções escuras |
| `--champ` | #B99B72 | acento: linhas, progresso, detalhes |

Tipografia: **Cormorant Garamond** (títulos) + **Manrope** (textos e interface).

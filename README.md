# Rebecca Gemaque — Assessoria & Cerimonial

Site institucional estático (HTML + CSS + JS puro, sem build e sem dependências).
Pode ser hospedado em qualquer lugar: Netlify, Vercel, GitHub Pages, Hostinger, etc.

```
index.html                  página principal (todas as seções)
politica-de-privacidade.html
eventos/modelo.html         modelo para páginas individuais de eventos
assets/css/style.css        design system (cores, tipografia, componentes)
assets/js/config.js         ⚙️ configurações editáveis (WhatsApp, formulário, métricas)
assets/js/main.js           interações
assets/img/                 favicon, ícone iOS, imagem de compartilhamento (OG)
robots.txt · sitemap.xml
```

Para visualizar localmente: `npx http-server .` e abra http://localhost:8080

---

## Como trocar as fotos

Todos os espaços de imagem são placeholders identificados, por exemplo `[FOTO HERO]`, `[FOTO REBECCA]` ou `[FOTO PORTFÓLIO 03]`.
Para substituir, basta colocar um `<img>` **dentro** do elemento `.ph`. O placeholder some sozinho.

```html
<figure class="ph tone-2" data-ph="FOTO REBECCA">
  <img src="assets/img/rebecca.webp" alt="Rebecca Gemaque sorrindo durante uma cerimônia" loading="lazy">
</figure>
```

Recomendações:
- Use **WebP ou AVIF**, com cerca de 2400px de largura para imagens full-width e 1400px para as demais.
- Sempre escreva um `alt` descritivo. Em imagens decorativas, use `alt=""`.
- Mantenha `loading="lazy"` em todas as fotos, **exceto** na do Hero, que deve usar `fetchpriority="high"`.
- Para imagens responsivas, use `<picture>` ou `srcset` normalmente. Os dois funcionam dentro de `.ph`.
- No portfólio, `data-full="caminho-grande.webp"` no `<img>` faz o lightbox carregar uma versão maior.

**Vídeo no Hero:** há um bloco comentado em `index.html` (seção HERO) pronto para um vídeo curto em loop, sem som.

**Parallax:** as imagens com `data-parallax="0.05"` se movem levemente no scroll. Para desativar em uma imagem, remova o atributo.

## Textos

Todos os textos estão diretamente no `index.html`, organizados por seção e marcados com comentários
(`<!-- 7. SOBRE REBECCA -->`, `<!-- 9. MODALIDADES -->`, etc.).

### ⚠️ Antes de publicar
- [ ] **Depoimentos:** substituir `[DEPOIMENTO REAL 01…04]` somente por avaliações reais e autorizadas. Para ter mais depoimentos, duplique um `<li class="quote">`.
- [ ] **Faixa de autoridade:** confirmar 5,0 no Google / 79 avaliações / 100% de recomendação / Casamentos Awards 2022. Depois, remova os asteriscos e a nota.
- [ ] **Preços:** confirmar os valores de referência das modalidades.
- [ ] **Portfólio:** trocar "Nome do casal" e "Local · Ano" (atributos `data-title` e `data-meta` e a legenda visível).
- [ ] **Domínio:** trocar `https://www.rebeccagemaque.com.br/` pelo domínio real em `index.html` (canonical, Open Graph, JSON-LD), `robots.txt` e `sitemap.xml`.
- [ ] **Política de Privacidade:** revisar o texto com apoio jurídico.
- [ ] Revisar as respostas do FAQ com a equipe.

## Formulário

Sem configuração, o formulário valida os campos e monta uma mensagem completa para o **WhatsApp** (21) 99981-1992.
A pessoa conclui o envio com um toque em "Continuar no WhatsApp".

Para também receber os dados por e-mail ou em planilha, cole a URL de um serviço (Formspree, Getform, Make, Zapier, Google Apps Script…)
em `formEndpoint`, no arquivo `assets/js/config.js`. O site envia um POST em JSON.

## Métricas (Google Analytics 4 / Meta Pixel)

Preencha `analytics.ga4` e/ou `analytics.metaPixel` em `assets/js/config.js`. Os scripts só carregam quando há ID configurado.
Eventos já disparados:
- `generate_lead`: envio do formulário (Lead no Pixel);
- `contact_whatsapp`: clique em qualquer link de WhatsApp (Contact no Pixel).

Os eventos também vão para `window.dataLayer`, o que deixa tudo pronto para o Google Tag Manager.

## Páginas de eventos (futuro)

1. Duplique `eventos/modelo.html` (ex.: `eventos/ana-e-pedro.html`) e preencha.
2. No portfólio do `index.html`, informe `data-href="eventos/ana-e-pedro.html"` no item. O lightbox passa a mostrar "Ver história completa".
3. Remova o `noindex` da nova página e adicione a URL ao `sitemap.xml`.

## Paleta

| Token | Cor | Uso |
|---|---|---|
| `--ivory` | #F7F3ED | fundo principal |
| `--off` | #FCFAF7 | seções de respiro, formulário |
| `--sand` | #DED3C5 | destaques sobre escuro |
| `--taupe` | #B9AA9B | linhas, números |
| `--brown` | #403731 | itálicos, labels |
| `--graphite` | #292623 | texto, faixas escuras |
| `--champ` | #B99B72 | acento: só em linhas, ícones e hover |

Tipografia: **Cormorant Garamond** (títulos) + **Manrope** (textos e interface).

## Acessibilidade e performance
- HTML semântico, link "pular para o conteúdo", foco visível, `aria-*` no menu, lightbox, slider e formulário.
- `prefers-reduced-motion` desliga animações, parallax e contadores.
- Nenhuma biblioteca externa: todo o JS e o CSS são próprios, e as animações usam apenas `transform` e `opacity`.

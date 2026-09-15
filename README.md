# Dona Help Rio Barra — Proposta de Site Premium

Site estático (HTML/CSS/JS, sem build) desenvolvido como proposta de reformulação
digital para a **Dona Help Rio Barra**, unidade de limpeza profissional na
Barra da Tijuca, Rio de Janeiro.

Para visualizar: abra `index.html` no navegador, ou sirva a pasta com qualquer
servidor estático (`python3 -m http.server`, `npx serve`, etc.).

## O que está pronto

- Estrutura completa de uma landing page premium e orientada à conversão:
  hero, posicionamento ("tempo"), serviços, antes/depois interativo (drag),
  destaque pós-obra, como funciona, confiança, avaliações, seção emocional
  ("o tempo que volta"), empresas, Instagram, localização/SEO local e CTA final.
- Design system próprio em `assets/css/style.css` (paleta verde-mata + marfim +
  latão, tipografia Fraunces/Inter), sem parecer template genérico de empresa
  de limpeza.
- Interações em `assets/js/main.js`: menu mobile, header dinâmico, reveal on
  scroll, slider de antes/depois acessível (mouse, touch e teclado), barra de
  progresso do "como funciona", geração automática do link de WhatsApp.
- Todos os CTAs apontam para o WhatsApp oficial `(21) 97460-1698` com a
  mensagem pré-preenchida pedida no briefing.
- SEO técnico: title/description únicos, Open Graph, `LocalBusiness` JSON-LD,
  `robots.txt`, `sitemap.xml`, HTML semântico, `alt`/labels acessíveis,
  `prefers-reduced-motion` respeitado.
- Mobile-first, sem bibliotecas pesadas (nenhum framework JS, apenas 1 fonte
  do Google Fonts).

## O que precisa ser substituído antes de publicar (IMPORTANTE)

Esta é uma proposta de **estrutura, design e experiência** — não um site já
abastecido com ativos finais, porque parte do material pedido no briefing não
pôde ser obtida de forma confiável pelas ferramentas de pesquisa disponíveis
nesta sessão:

1. **Fotografias reais.** O Instagram oficial da unidade (confirmado:
   `@donahelpriobarra`) bloqueou acesso automatizado (HTTP 429) e o domínio
   próprio da unidade não foi localizado. Por isso, todo espaço de foto no
   site é um **placeholder visual** (gradiente com legenda, ex. `data-label`
   nos elementos `.photo`) indicando exatamente qual foto real deve entrar
   ali — nunca uma foto genérica de banco de imagens fingindo ser da Dona
   Help. Basta substituir cada `<div class="photo" data-label="...">` por uma
   `<img>` real mantendo a mesma proporção.
2. **Antes/depois.** O componente interativo (arrastar para comparar) está
   100% funcional, mas com placeholders — é necessário substituir pelos pares
   de imagens reais e comprovadamente do mesmo ambiente, obtidos com a
   unidade.
3. **Avaliações do Google.** A pesquisa inicial do usuário apontou
   aproximadamente 4,9★ e 130+ avaliações, mas não foi possível reconfirmar
   esse número em tempo real nem extrair depoimentos reais (sem acesso à API
   do Google Maps). O site já traz a seção pronta, com nota visível de que os
   números e depoimentos devem ser conferidos e inseridos antes da
   publicação — nenhum depoimento foi inventado.
4. **Paleta de marca oficial.** Não foi possível confirmar os códigos de cor
   exatos da identidade visual da Dona Help (nem no site da franquia, nem via
   busca). A paleta usada (verde-mata `#1F3A2C`, marfim `#F6F2EA`, latão
   `#B08D46`) é uma interpretação premium alinhada ao posicionamento da marca
   — ajustar as variáveis no topo de `assets/css/style.css` caso a marca tenha
   um manual de identidade visual oficial.
5. **Endereço.** Usado o endereço mais recente informado: Av. Evandro Lins e
   Silva, 840, sala 411, Barra da Tijuca, CEP 22631-470. O endereço antigo
   (Av. das Américas, 4200) foi propositalmente descartado, conforme
   instrução — recomenda-se confirmar o endereço vigente no Google Business
   antes de publicar.
6. **Bairros atendidos.** Não foi possível confirmar oficialmente quais
   bairros além da Barra da Tijuca são atendidos pela unidade; a seção de
   localização foi deixada conservadora ("Barra da Tijuca" + "regiões
   próximas sob consulta") para não presumir cobertura não confirmada.
7. **Domínio.** O site referencia `donahelpriobarra.com.br` (canonical, OG,
   schema) como sugestão de domínio próprio da unidade — ajustar para o
   domínio real que for definido.

## Fontes usadas na pesquisa

- Instagram oficial confirmado: `instagram.com/donahelpriobarra`
- Site institucional da rede: `donahelpbr.com.br` (histórico da marca,
  diferenciais de rede como Web Help, fragrância exclusiva, garantia de
  substituição, sem multa de cancelamento)
- Dados fornecidos diretamente pelo usuário (WhatsApp, CNPJ, endereço atual,
  lista de serviços) — usados como ponto de partida, não reinventados.

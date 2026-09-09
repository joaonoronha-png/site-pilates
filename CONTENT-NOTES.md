# Notas de conteúdo — pesquisa e status

## O que foi pesquisado

Antes de construir o site, tentei pesquisar o conteúdo público de
`@naeljrbarberstudio` no Instagram, o perfil `@naeljuniorr`, e a ficha do
Google (avaliações) para a Nael Jr Barber Studio, usando busca na web e
requisições diretas às páginas.

## Resultado da pesquisa

- **Instagram**: as requisições diretas ao perfil e à página de localização
  (`instagram.com/explore/locations/247216152670155/nael-jr-barber-studio/`)
  foram bloqueadas (HTTP 429 / conteúdo protegido por login, renderizado via
  JS). Não foi possível ler bio, legendas, Reels, destaques ou baixar
  fotos/vídeos reais.
- **Google Maps / avaliações individuais**: a ficha é renderizada
  inteiramente via JavaScript no lado do cliente; não retornou texto
  utilizável (nome, avaliações, horários) pelas ferramentas disponíveis
  nesta sessão.
- **Busca na web**: os resultados para termos como "Nael Jr Barber Studio
  reviews" e variações trouxeram, majoritariamente, barbearias homônimas
  sem relação alguma com o negócio (ex.: "Nael's Hair Works" em Gillingham,
  Reino Unido; "barber.nael" também no Reino Unido). Esse conteúdo foi
  **descartado integralmente** — não foi usado em nenhum texto do site,
  para evitar misturar informações de outro negócio com a marca real.
- Foi possível confirmar, via busca, apenas o endereço já fornecido
  (Vogue Square, sala 553) e a existência da página de localização da marca
  no Instagram — nada além disso.

## Consequência para o site

Seguindo a regra "não inventar", o site foi construído **somente** com os
dados que você confirmou (marca, endereço, telefone, Instagram, nota do
Google 5,0/+150 avaliações, horários de terça a sábado, e a lista de
serviços já identificada). Nenhum preço, depoimento individual, biografia
ou métrica adicional foi criado.

Onde o conteúdo real não pôde ser obtido, o site usa:

- **Preços**: não exibidos. A seção de Serviços mostra apenas
  "Valores e disponibilidade pelo WhatsApp." com um único CTA.
- **Avaliações**: nenhum depoimento individual foi inventado. A seção
  mostra somente a nota agregada (★★★★★ 5,0 · +150 avaliações) e um link
  para "Ver avaliações no Google".
- **Fotos e vídeo**: todos os espaços de mídia (`hero`, trabalhos, Nael,
  Studio) são *media slots* com fallback automático — se o arquivo real
  não existir em `assets/img/` ou `assets/video/`, aparece um placeholder
  editorial com o rótulo do que precisa ser inserido (ex.: "Foto real —
  melhor trabalho"). Assim que os arquivos reais forem adicionados com os
  nomes exatos (ver `assets/img/README.md` e `assets/video/README.md`), o
  placeholder desaparece sem precisar tocar em código.

## Próximo passo recomendado

Para fechar o site, alguém com acesso ao Instagram/Google da barbearia
precisa:
1. Baixar 8–10 fotos reais (capa, trabalhos, Nael, ambiente) e o melhor
   Reel do espaço, e salvá-los com os nomes indicados nos READMEs de
   `assets/img/` e `assets/video/`.
2. Confirmar, se existirem, preços atuais publicados (print de Reel/arte/
   destaque) para eu adicionar na seção de Serviços.
3. Copiar 2–3 avaliações reais e curtas do Google (com nome do cliente) se
   quiser substituir o bloco de nota agregada por depoimentos.

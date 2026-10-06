# Imagens do site

## Situação atual: todas as fotos são PROVISÓRIAS

Não foi encontrada nenhuma fotografia própria da Requinte & Sabor Buffet disponível
publicamente com autorização de uso. Por isso, o layout foi montado com imagens de
banco de imagens **Unsplash** (licença Unsplash: uso comercial gratuito, sem
necessidade de atribuição). Elas servem apenas para mostrar a composição visual.

- Nenhuma foto vem dos sites usados como referência (Bisutti, Mont Blanc, Tartarone, Carmelita).
- Enquanto `imagensIlustrativas: true` em `assets/js/config.js`, cada foto exibe a
  legenda discreta **"Imagem ilustrativa"** e o rodapé informa "Imagens ilustrativas".
- O **Portfólio** ("Histórias que já tivemos o prazer de servir") fica **oculto**
  até receber fotos reais — usar banco de imagens ali seria enganoso.

## Antes da publicação definitiva

1. Pedir ao cliente fotos reais (ou autorizadas) de eventos, pratos, montagem, equipe e convidados.
2. Substituir cada provisória mantendo o mesmo nome (`scripts/otimizar-fotos.sh`).
3. Atualizar os textos `alt` no `index.html`.
4. Quando não restar nenhuma provisória, mudar `imagensIlustrativas` para `false`.
5. Regerar `assets/img/og-image.jpg` (1200×630) com uma foto real.

## Mapa das provisórias (origem: images.unsplash.com)

| Arquivo | Onde aparece | ID Unsplash |
|---|---|---|
| hero-mesa-posta | Hero (1º quadro) e orçamento | photo-1522413452208-996ff3f3e740 |
| hero-mesa-servida | Hero (2º quadro), "Atendimento", imagem de compartilhamento | photo-1414235077428-338989a2e8c0 |
| hero-brinde | Hero (3º quadro) | photo-1527529482837-4698179dc6ce |
| sobre-mesa-longa | Sobre | photo-1511795409834-ef04bbd61622 |
| gastro-detalhe-aliancas | Sobre (detalhe), "Atenção aos detalhes" | photo-1515934751635-c81c6bc9a2d8 |
| evento-casamento | Eventos — Casamentos | photo-1519741497674-611481863552 |
| evento-15-anos | Eventos — 15 anos | photo-1505236858219-8359eb29e329 |
| evento-aniversario | Eventos — Aniversários | photo-1558636508-e0db3814bd1d |
| evento-corporativo | Eventos — Corporativos | photo-1511578314322-379afb476865 |
| evento-coffee-break | Eventos — Coffee breaks | photo-1495474472287-4d71bcdd2085 |
| evento-celebracao | Eventos — Celebrações | photo-1530023367847-a683933f4172 |
| gastro-prato-principal | Galeria gastronomia, "Gastronomia" | photo-1467003909585-2f8a72700288 |
| gastro-sobremesa | Galeria gastronomia, "Apresentação" | photo-1488477181946-6428a0291777 |
| gastro-prato-autoral | Galeria gastronomia | photo-1478145046317-39f10e56b5e9 |
| gastro-pratos-servidos | Galeria gastronomia | photo-1504674900247-0877df9cc836 |
| gastro-taca-sobremesa | Galeria gastronomia | photo-1563805042-7684c019e1cb |
| gastro-entrada | Galeria gastronomia | photo-1482049016688-2d3e1b311543 |
| gastro-mesa-compartilhada | Tela cheia "Sabor que se vê" | photo-1515669097368-22e68427d265 |
| historia-preparacao | Experiência 01 | photo-1551218808-94e220e084d2 |
| historia-montagem | Experiência 02, "Organização" | photo-1519225421980-715cb0215aed |
| historia-gastronomia | Experiência 03 | photo-1577219491135-ce391730fb2c |
| historia-servico | Experiência 04, "Profissionalismo" | photo-1555244162-803834f70033 |
| historia-celebracao | Experiência 05 | photo-1510812431401-41d2bd2722f3 |

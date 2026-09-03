# Como trocar as fotos do site

Todas as fotografias do site estão em `assets/img/photos/` e são **placeholders temporários** (arte minimalista com o nome da foto escrita nela) até você enviar as fotos reais.

## Passo a passo

1. Prepare a foto real (formato `.jpg`, já cortada/orientada como preferir).
2. Renomeie o arquivo **exatamente** como o nome do placeholder que ele vai substituir (veja a tabela abaixo).
3. Copie o arquivo para dentro de `assets/img/photos/`, substituindo o antigo.
4. Pronto — não é preciso mexer em nenhum código. O site já aponta para esse nome de arquivo.

Se preferir, me envie as fotos numeradas (ex.: "essa é a FOTO 01") e eu faço a troca para você.

## Tabela de fotos

| Arquivo | Onde aparece | Orientação sugerida |
|---|---|---|
| `01-hero.jpg` | Topo do site (Hero) | Vertical (retrato), foco no ambiente ou em movimento |
| `02-tatiana.jpg` | Seção "Sobre" | Vertical (retrato), Tatiana |
| `03-tatiana-aula.jpg` | Seção "Experiência do studio" | Vertical, Tatiana conduzindo uma aula |
| `04-studio.jpg` | Seção "Experiência do studio" | Horizontal, vista geral do studio |
| `05-equipamentos.jpg` | Seção "Experiência do studio" | Quadrada, equipamentos (reformer etc.) |
| `06-detalhe-ambiente.jpg` | Seção "Experiência do studio" | Vertical, detalhe do ambiente |
| `07-movimento.jpg` | Início da Galeria | Horizontal, aula em movimento |
| `08-galeria.jpg` a `13-galeria.jpg` | Galeria + Instagram | Mistura de vertical e horizontal |
| `14-cta-final.jpg` | Última seção (chamada final) | Horizontal larga, ambiente ou movimento |
| `og-cover.jpg` | Pré-visualização ao compartilhar o link (WhatsApp, redes sociais) | Horizontal, 1200×630px |

## Dicas rápidas

- Fotos mais nítidas e bem iluminadas fazem muita diferença no resultado — evite fotos escuras ou tremidas.
- Não é necessário redimensionar com precisão: o site corta a imagem automaticamente para caber no espaço (`object-fit: cover`), mas evite fotos muito pequenas (menos de 800px de largura).
- Se uma foto ficar cortada de um jeito que não gostou, me avise — dá pra ajustar o ponto de foco do recorte no código.

## Regenerar os placeholders (uso interno / desenvolvimento)

Os placeholders atuais foram gerados automaticamente a partir de `scripts/placeholder-gen/placeholder.html` usando Playwright. Só é necessário rodar isso de novo se quiser recriar os placeholders (por exemplo, para uma foto que ainda não tem substituta definitiva):

```bash
npm i -D playwright-core
node scripts/placeholder-gen/generate.mjs
```

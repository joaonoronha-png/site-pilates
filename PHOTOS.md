# Como trocar as fotos do site

Todas as fotografias do site estão em `assets/img/photos/`. Seis delas já são fotos reais (retiradas do Instagram @pilatestatiananobre); o restante ainda são **placeholders temporários** (arte minimalista com o nome da foto escrita nela) até você enviar as fotos reais.

## Passo a passo

1. Prepare a foto real (formato `.jpg`, já cortada/orientada como preferir).
2. Renomeie o arquivo **exatamente** como o nome do placeholder que ele vai substituir (veja a tabela abaixo).
3. Copie o arquivo para dentro de `assets/img/photos/`, substituindo o antigo.
4. Pronto — não é preciso mexer em nenhum código. O site já aponta para esse nome de arquivo.

Se preferir, me envie as fotos numeradas (ex.: "essa é a FOTO 01") e eu faço a troca para você.

## Tabela de fotos

| Arquivo | Onde aparece | Orientação sugerida | Status |
|---|---|---|---|
| `01-hero.jpg` | Topo do site (Hero) | Vertical (retrato), foco no ambiente ou em movimento | Placeholder |
| `02-tatiana.jpg` | Seção "Sobre" | Vertical (retrato), Tatiana | ✅ Real (frame de Reel do Instagram) |
| `03-tatiana-aula.jpg` | Seção "Experiência do studio" | Vertical, Tatiana conduzindo uma aula | ✅ Real (Instagram) |
| `04-studio.jpg` | Seção "Experiência do studio" | Horizontal, vista geral do studio | Placeholder |
| `05-equipamentos.jpg` | Seção "Experiência do studio" | Quadrada, equipamentos (reformer etc.) | ✅ Real (Instagram) |
| `06-detalhe-ambiente.jpg` | Seção "Experiência do studio" | Vertical, detalhe do ambiente | ✅ Real (Instagram) |
| `07-movimento.jpg` | Início da Galeria | Vertical, aula em movimento | ✅ Real (Instagram) |
| `08-galeria.jpg` | Galeria + Instagram | Vertical | ✅ Real (Instagram) |
| `09-galeria.jpg` | Galeria | Horizontal | Placeholder |
| `10-galeria.jpg` | Galeria + Instagram | Vertical | ✅ Real (Instagram) |
| `11-galeria.jpg` | Galeria + Instagram | Vertical | ✅ Real (Instagram) |
| `12-galeria.jpg`, `13-galeria.jpg` | Galeria | Mistura de vertical e horizontal | Placeholder |
| `14-cta-final.jpg` | Última seção (chamada final) | Horizontal larga, ambiente ou movimento | Placeholder |
| `og-cover.jpg` | Pré-visualização ao compartilhar o link (WhatsApp, redes sociais) | Horizontal, 1200×630px | Placeholder |

As 6 fotos reais vieram de posts públicos do Instagram @pilatestatiananobre (o mesmo perfil do studio) — duas outras fotos de posts antigos foram descartadas por trazerem máscara de proteção (época de pandemia), o que dataria o site incorretamente. Se quiser trocar qualquer uma dessas 6 por uma foto mais recente ou diferente, é só seguir o passo a passo acima normalmente.

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

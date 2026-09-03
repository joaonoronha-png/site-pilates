# Como trocar as fotos do site

Todas as fotografias do site estão em `assets/img/photos/`. São 8 fotos reais, vindas do Instagram @pilatestatiananobre, cada uma usada uma única vez no site (a mesma foto pode reaparecer também na vitrine "Instagram" lá embaixo, que existe justamente para mostrar de novo as fotos recentes — isso é esperado). Se quiser trocar qualquer uma por uma foto diferente, é só seguir o passo a passo abaixo.

## Passo a passo

1. Prepare a foto real (formato `.jpg`, já cortada/orientada como preferir).
2. Renomeie o arquivo **exatamente** como o nome do placeholder que ele vai substituir (veja a tabela abaixo).
3. Copie o arquivo para dentro de `assets/img/photos/`, substituindo o antigo.
4. Pronto — não é preciso mexer em nenhum código. O site já aponta para esse nome de arquivo.

Se preferir, me envie as fotos numeradas (ex.: "essa é a FOTO 01") e eu faço a troca para você.

## Tabela de fotos

| Arquivo | Onde aparece | Orientação sugerida | Status |
|---|---|---|---|
| `01-hero.jpg` | Topo do site (Hero) | Vertical (retrato), foco no ambiente ou em movimento | ✅ Real (Instagram) |
| `02-tatiana.jpg` | Seção "Sobre" | Vertical (retrato), Tatiana | ✅ Real (frame de Reel do Instagram) |
| `03-tatiana-aula.jpg` | Seção "Experiência do studio" + Instagram | Vertical, Tatiana conduzindo uma aula | ✅ Real (Instagram) |
| `04-studio.jpg` | Seção "Experiência do studio" + Instagram | Horizontal, vista geral do studio | ✅ Real (Instagram) |
| `05-equipamentos.jpg` | Seção "Experiência do studio" + Instagram | Quadrada, equipamentos (reformer etc.) | ✅ Real (Instagram) |
| `07-movimento.jpg` | Galeria + Instagram | Vertical, aula em movimento | ✅ Real (Instagram) |
| `08-galeria.jpg` | Galeria + Instagram | Vertical | ✅ Real (Instagram) |
| `11-galeria.jpg` | Galeria + Instagram | Vertical | ✅ Real (Instagram) |
| `og-cover.jpg` | Pré-visualização ao compartilhar o link (WhatsApp, redes sociais) | Horizontal, 1200×630px | ✅ Real (recorte da mesma foto de `02-tatiana.jpg`) |

Todas as fotos vieram de posts públicos do Instagram @pilatestatiananobre (o mesmo perfil do studio) — algumas fotos enviadas foram descartadas: duas por trazerem máscara de proteção (época de pandemia, o que dataria o site incorretamente) e uma por mostrar uma segunda pessoa não identificada. No total restaram 8 fotos distintas, e cada uma é usada **uma única vez** no site (a vitrine "Instagram" no fim da página reaproveita essas mesmas 8 fotos de propósito, para simular um feed de posts recentes — assim como um perfil real do Instagram mostraria as mesmas fotos que já aparecem no site). Antes desta revisão, o site tinha 14 espaços de foto mas só 8 fotos reais disponíveis — o que forçava recortes repetidos da mesma imagem em vários lugares (por exemplo, a mesma pose aparecia no Hero e de novo, bem apertada, na Galeria). Removemos esses espaços redundantes para que nenhuma foto se repita com um recorte diferente — se quiser mais variedade na Galeria ou no Instagram, é só me enviar fotos novas.

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

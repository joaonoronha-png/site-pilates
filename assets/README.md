# Guia de imagens e vídeos

O site já está com toda a estrutura, textos e animações prontos. Os únicos
itens que faltam são os arquivos reais de foto/vídeo da Aline — hoje eles
aparecem como placeholders com textura (gradiente terracota/carvão) no lugar
exato onde a imagem real deve entrar. Basta salvar os arquivos com os nomes
abaixo dentro de `assets/images/` e `assets/video/` que eles substituem o
placeholder automaticamente (não precisa mexer no HTML/CSS).

## Vídeos (`assets/video/`)

| Arquivo | Onde aparece | Sugestão |
|---|---|---|
| `hero-loop.mp4` | Fundo da seção principal (topo do site) | Vídeo horizontal, em loop, sem áudio necessário. Cena do espaço ou de um atendimento, ritmo calmo. 15–30s bastam. |
| `feature-loop.mp4` | Seção "Um ambiente feito para o cuidado" | Reel ou vídeo do espaço/detalhe de procedimento. Pode ser vertical ou horizontal (o vídeo preenche a área com `object-fit: cover`). |

Formato recomendado: MP4 (H.264), leve (idealmente < 8MB cada) para não pesar
o carregamento. Adicionar sempre um `poster` (imagem de capa) correspondente
em `assets/images/hero-poster.jpg` e `assets/images/feature-poster.jpg`.

## Imagens (`assets/images/`)

| Arquivo | Onde aparece | Proporção sugerida |
|---|---|---|
| `hero-poster.jpg` | Capa do vídeo principal (enquanto carrega) | 16:9 ou mais larga |
| `feature-poster.jpg` | Capa do vídeo da seção "espaço" | 16:9 |
| `about-aline.jpg` | Retrato da Aline na seção "Sobre" | 4:5 (vertical) |
| `service-limpeza-pele.jpg` | Card "Limpeza de pele premium" | 4:3 |
| `service-facial.jpg` | Card "Estética facial" | 4:3 |
| `service-corporal.jpg` | Card "Estética corporal" | 4:3 |
| `service-drenagem.jpg` | Card "Drenagem linfática" | 4:3 |
| `service-massagem.jpg` | Card "Massagem relaxante" | 4:3 |
| `gallery-1.jpg` … `gallery-6.jpg` | Grade "No Instagram" | mistura de verticais e quadradas, como no feed |

> As fotos do Instagram (@alinelimaestetica) usadas aqui devem ser as próprias
> publicações da Aline. Baixe apenas o que ela puder ceder/autorizar
> diretamente (ela tem acesso a todos os arquivos originais, em qualidade
> maior do que o Instagram entrega). Não é recomendado copiar imagens
> diretamente da plataforma sem autorização explícita da autora do conteúdo.

## Como plugar no código

Depois de salvar os arquivos com os nomes acima, é só:
1. Trocar cada `<div class="img-placeholder" ...>` pela tag `<img src="assets/images/NOME-DO-ARQUIVO.jpg" alt="...">` correspondente no `index.html`.
2. Fazer o mesmo para os dois `<video>` (já estão com o `<source>` apontando para os nomes certos em `assets/video/` — só falta os arquivos existirem).

Se preferir, me avise quando as fotos/vídeos estiverem na pasta que eu faço
essa troca para você.

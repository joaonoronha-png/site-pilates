# Imagens do site

## Já usadas (fotos reais enviadas pela cliente)

| Arquivo | Onde aparece |
|---|---|
| `images/hero-facial-vapor.jpg` | Fundo da seção principal (topo do site) + card "Limpeza de pele premium" + galeria |
| `images/about-aline.jpg` | Retrato da Aline na seção "Sobre" |
| `images/espaco-sala-atendimento.jpg` | Seção "Um ambiente feito para o cuidado" + card "Estética corporal" + galeria |
| `images/resultado-antes-depois.jpg` | Seção "Resultados reais" + card "Estética facial" |
| `images/recepcao-espaco.jpg` | Galeria (item vertical em destaque) |

## Ainda faltam (placeholders com textura terracota no lugar)

| Onde | Sugestão |
|---|---|
| Card "Drenagem linfática" | Foto de uma sessão de drenagem, se houver |
| Card "Massagem relaxante" | Foto do ambiente ou de uma massagem em andamento |
| 3 posições na galeria "No Instagram" | Fotos/prints adicionais do feed @alinelimaestetica (ideal: uma vertical, duas quadradas) |

Assim que novas fotos chegarem, é só salvar em `assets/images/` e trocar o
`<div class="img-placeholder" ...>` correspondente por
`<img src="assets/images/NOME.jpg" alt="...">` no `index.html` — a
estrutura de CSS já está pronta para os dois casos.

## Vídeo (opcional, upgrade futuro)

O hero e a seção "O espaço" hoje usam fotos estáticas (funcionam bem e
carregam rápido). Se a Aline quiser ceder um Reel/vídeo vertical do espaço
ou de um atendimento, dá para trocar por vídeo em loop nesses dois pontos
para ainda mais movimento — é só avisar que eu faço a troca.

## Boas práticas ao adicionar novas fotos

- Priorize sempre material real da Aline/do espaço em vez de banco de imagens.
- Prefira arquivos já otimizados (algumas centenas de KB, não múltiplos MB) para o site continuar rápido.
- Fotos do Instagram devem ser as próprias publicações da Aline, cedidas por ela em qualidade original — evite baixar diretamente da plataforma sem autorização.

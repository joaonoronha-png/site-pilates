# Guia de fotos e vídeo — Hope Studio

O site já está pronto, com 10 espaços reservados para mídia real. Cada um
tem um código (ex.: `trabalho-1`) marcado no próprio site — é só abrir
`index.html` no navegador, ver o texto cinza dentro do retângulo
tracejado, e você já sabe qual código é qual.

**Como enviar:** pode mandar as fotos aos poucos, na ordem que for
pegando no Instagram, dizendo o código de cada uma (ex.: "essa aqui é a
`trabalho-3`"). Não precisa acertar a proporção exata — mando em boa
resolução (a maior que tiver) e eu ajusto o enquadramento no site.

---

## 1. Hero — abertura (`hero`)

- **Onde:** primeira coisa que aparece ao abrir o site, tela cheia.
- **Formato:** paisagem (horizontal), bem larga. Pode ser foto ou vídeo curto.
- **O que precisa ter:** a foto/vídeo mais impactante que existir —
  ambiente amplo do studio, ou um corte/barba finalizado muito bem
  iluminado. Evite uma foto com o assunto principal bem no centro-baixo
  da imagem, porque o texto "HOPE STUDIO" fica por cima dessa região.
- **Dica:** se dois candidatos forem parecidos, prefira o que tiver menos
  gente/objetos "poluindo" a parte de baixo da imagem.

## 2. Trabalhos — 5 fotos (seção "Seu estilo começa aqui")

| Código | Formato | O que mostrar |
|---|---|---|
| `trabalho-1` | Horizontal, grande | O melhor trabalho pronto que vocês têm — a foto "capa" dessa seção. |
| `trabalho-2` | Vertical | Um corte finalizado, close, vertical. |
| `trabalho-3` | Quadrada/horizontal | Um detalhe: acabamento, risco, degradê, navalha. |
| `trabalho-4` | Quadrada | Um profissional em ação, cortando/fazendo a barba de alguém. |
| `trabalho-5` | Horizontal ampla | Resultado final — funciona bem uma foto com o cliente/corte centralizado e algum espaço nas laterais (ela também aparece bem larga no computador). |

## 3. A identidade Hope (`identidade`)

- **Formato:** vertical (retrato).
- **O que mostrar:** algo que represente a marca — um profissional
  atendendo com atenção, ou um ângulo bonito do ambiente. Fica ao lado do
  texto sobre "Sua identidade, seu estilo."

## 4. Por dentro da Hope — o espaço (seção "Por dentro da Hope")

| Código | Formato | O que mostrar |
|---|---|---|
| `espaco-video` | Vertical (Reel, 9:16) | O melhor Reel que mostrar o interior de verdade: cadeiras, bancadas, iluminação, materiais, organização. Esse é o vídeo principal da seção. |
| `espaco-ambiente-1` | Quadrada/vertical | Uma foto do ambiente — cadeiras ou bancada. |
| `espaco-ambiente-2` | Quadrada/vertical | Outra foto do ambiente — um detalhe de iluminação, acabamento ou material. |

Para o vídeo: baixe o Reel em boa qualidade e me envie o arquivo (ou me
diga o link do post caso eu consiga acessar). Ele entra sem tocar áudio
sozinho — a pessoa clica para dar play.

## Opcional: logo

Se a Hope Studio tiver um arquivo de logo oficial (SVG ou PNG,
fundo transparente), pode mandar também — hoje o cabeçalho e o rodapé
usam "HOPE STUDIO" em texto, e dá para trocar pelo logo real.

---

Depois que as fotos chegarem, atualizo `index.html` trocando cada
`<div class="real-media" data-photo="...">` pela `<img>`/`<video>`
correspondente, com `loading="lazy"` já preparado para performance.

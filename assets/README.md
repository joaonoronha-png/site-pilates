# Imagens e vídeos do site

## Fotos reais já usadas (uma vez cada, sem repetição)

| Arquivo | Onde aparece (único lugar) |
|---|---|
| `images/hero-facial-vapor.jpg` | Fundo da seção principal (topo do site) |
| `images/about-aline.jpg` | Retrato da Aline na seção "Sobre" |
| `images/resultado-antes-depois.jpg` | Seção "Resultados reais" |
| `images/espaco-sala-atendimento.jpg` | Seção "Um ambiente feito para o cuidado" |
| `images/recepcao-espaco.jpg` | Galeria (item vertical em destaque) |
| `images/detalhe-roller-jade.jpg` | Card "Massagem relaxante" |
| `images/estetica-facial-mascara.jpg` | Card "Estética facial" (recortado de print de post do Instagram) |
| `images/led-terapia-luz.jpg` | Galeria (recortado de print de post do Instagram) |
| `images/mascara-algas.jpg` | Galeria, item vertical (recortado de print de post do Instagram) |
| `images/limpeza-pele-espatula.jpg` | Card "Limpeza de pele premium" (recortado de print de post do Instagram) |
| `images/estetica-corporal-resultado.jpg` | Card "Estética corporal" (recortado de print de post do Instagram) |
| `images/massagem-pedras.jpg` | Galeria (recortado de print de post do Instagram) |
| `images/led-azul.jpg` | Galeria (recortado de print de post do Instagram) |

Cada foto aparece em um único ponto do site agora — antes algumas se repetiam
em 2–3 lugares (hero também no card de serviço e na galeria, por exemplo) e
isso foi corrigido.

## Vídeo

A seção **"Vídeo"** (entre "O Espaço" e "Localização") agora usa o
arquivo real `video/espaco-atendimento.mp4` enviado pela Aline: toca em
loop, sem som por padrão (autoplay do navegador exige isso), com um
botão para ativar o áudio.

## O que ainda falta

| Onde | O que precisa |
|---|---|
| Seção "Avaliações" (7 cards) | **7 avaliações reais do Google**, com texto e nome de quem avaliou. Não consegui puxar automaticamente (Google Maps bloqueia raspagem). Mande prints da aba de avaliações do perfil do Google da Aline — leio o texto direto de lá, igual fiz com os posts do Instagram. |
| Card "Drenagem linfática" | Foto de uma sessão de drenagem, se houver |
| 1 posição na galeria "No Instagram" | Foto adicional do feed |

## Como plugar novo material

Salvar o(s) arquivo(s) em `assets/images/` (fotos) ou `assets/video/`
(vídeos) e avisar — eu faço a troca no `index.html` mantendo tudo sem
repetição.

## Boas práticas

- Priorize sempre material real da Aline/do espaço em vez de banco de imagens.
- Evite usar a mesma foto em mais de um ponto do site.
- Vídeo: sempre o arquivo .mp4 original enviado direto pela Aline.

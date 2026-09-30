# Dra. Carol Haneda — Estética e Harmonização

Site institucional de uma página para a Dra. Carol Haneda (@carolhanedaestetica),
biomédica esteta em Bauru – SP. Segue a mesma base do site da Aline Lima
(HTML + CSS + JS puros, sem build), com direção visual adaptada à identidade
real da clínica: paredes brancas com boiserie, móveis rosé e o monograma CH dourado.

## Estrutura

- `index.html` — conteúdo de todas as seções
- `css/style.css` — paleta marfim / rosé / ouro velho, tipografia Cormorant Garamond + Manrope
- `js/main.js` — menu mobile, header retrátil, reveal on-scroll, contadores, carrossel de avaliações e botão flutuante do WhatsApp
- `assets/images/` — fotos reais (ver tabela abaixo)

Rodar localmente: `python3 -m http.server 8000` e abrir http://localhost:8000

## Skills de design aplicadas

Refinado com as skills do branch `claude/instalar-skill-uiux-pro-max-mnz4y9`:

- **ui-ux-pro-max** — design system gerado para "clínica de estética / harmonização / luxo".
  A paleta sugerida (rosa/lilás genérico) foi descartada em favor da identidade real da
  clínica; aplicadas as regras de UX: contraste ≥ 4.5:1, alvos de toque ≥ 44 px, foco
  visível, `prefers-reduced-motion`, imagens com `width/height` + `loading="lazy"`,
  depoimentos acessíveis.
- **impeccable** (craft-floor + detector) — removidos eyebrows acima de títulos, números
  01–09, grid de cards iguais, bloco de estatísticas, texto em gradiente, estrelas em
  Unicode (agora SVG), marquee infinito, bolinha pulsante, textura invisível e excesso de
  travessões; ouro de texto/botões escurecido para passar contraste; mapa em iframe
  trocado por mapa estático com pin da marca. Alertas restantes do detector: fundo creme
  (é a identidade da clínica) e falso-positivos de padding/contraste sobre foto.

## Recursos iguais ao site da Aline (a pedido)

- **Antes/depois com slider de arrastar** (mouse, dedo e setas do teclado).
- **Avaliações em rotação contínua** — arrastáveis com o dedo, pausam com o mouse em cima.
- **Galeria do Instagram em rotação** — mesmo ritmo da Aline (ciclo de 5 s), arrastável.

Esses três pontos seguem o pedido do cliente mesmo onde o impeccable recomendaria o
contrário (ele desaconselha faixas em rotação infinita); com "reduzir movimento" ativado
no aparelho, as rotações param.

## Seções

Abertura (monograma CH dourado + nome, ~3 s; toca 1x por sessão, pula com um toque,
desligada para quem prefere menos movimento) → Hero → Sobre → Procedimentos (lista editorial Rosto / Pele & corpo) → Resultado (antes/depois) → Experiência (estacionamento,
menu, cadeira de massagem, buquê) → "Fada da harmonização" → Avaliações → Momentos
(Carol Haneda Experience 2026, Clube do Botox, Toque de Fada) → Cursos para profissionais
→ Instagram (galeria em rotação) → Localização.

## Fotos (cada uma usada uma única vez)

| Arquivo | Onde aparece | Origem |
|---|---|---|
| `hero-consulta-carol.jpg` | Fundo do hero | Matéria Social Bauru (Toque de Fada, 2024) |
| `sobre-carol-haneda.jpg` | Retrato da seção Sobre | Foto de perfil do canal do YouTube |
| `atendimento-harmonizacao.jpg` | Abertura de Procedimentos | Matéria JCNET/Sampi (2023) |
| `resultado-labios-antes.jpg`, `resultado-labios-depois.jpg` | Slider de antes/depois (arrastar) | Foto do perfil no Google (via Telu), dividida ao meio |
| `espaco-sala-consulta.jpg` | Experiência | Fotos do perfil no Google (via Telu) |
| `experiencia-menu-cafe.jpg` | Experiência | Fotos do perfil no Google (via Telu) |
| `carol-editorial.jpg` | Faixa "Fada da harmonização" | Foto de perfil do TikTok |
| `carol-haneda-experience-2026.jpg` | Momentos | Matéria Social Bauru (maio/2026) — foto @anderson_photografia |
| `cursos-carol-rinomodelacao.jpg` | Cursos | Capa do curso na Hotmart (recortada) |
| `galeria-carol-*.jpg` (6) | Galeria do Instagram em rotação | Retratos recortados das capas dos vídeos do YouTube dela (baixa resolução — trocar por posts originais do Instagram quando ela enviar) |

O Instagram bloqueou acesso automatizado (HTTP 429), então as fotos vieram das
outras redes/perfis públicos dela. Ideal substituir por originais em alta
resolução enviados pela clínica, principalmente a do Sobre (900 px) e a dos Cursos (pequena).

## Dados — o que confirmar com a cliente

- **Horários**: não publicados de propósito (fontes divergentes). O site diz
  "com hora marcada — consulte pelo WhatsApp".
- **Avaliações**: textos reais de avaliações públicas do Google, sem nome
  (as fontes não traziam o nome das autoras) — assinadas como "Paciente · Google".
- **Nota 4,9 / 206 avaliações** e **9 anos na área** (matéria de maio/2026) — atualizar periodicamente.
- CRBM 51120 conforme perfil da Hotmart.
- Bairro/CEP: listagens do Google indicam Jardim Planalto, 17012-450; uma matéria
  de 2024 fala em Jardim Aeroporto — por isso o site mostra só rua, número e cidade.
- Nenhum preço, equipamento ou depoimento foi inventado.

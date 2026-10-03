# Dra. Julia Batalha — Harmonização Facial

Site institucional de uma página para a Dra. Julia Batalha (@drajuliabatalha),
harmonização facial na Barra da Tijuca, Rio de Janeiro. Mesma base dos sites da
Aline Lima e da Carol Haneda (HTML + CSS + JS puros, sem build). A direção visual
é nova: areia, nude, cacau e terracota-rosé, com as fontes Fraunces e Jost.

Para rodar localmente: `python3 -m http.server 8000` e abrir http://localhost:8000

## Estrutura

- `index.html`: todas as seções
- `css/style.css`: tokens de cor, tipografia, abertura e layout
- `js/main.js`: abertura pulável, menu mobile, header ao rolar, reveals e a faixa de avaliações (arrastável, pausa com o mouse em cima)
- `assets/images/`: imagens (ver tabela abaixo)

## Abertura (intro)

Fundo marfim. O contorno do rosto, o eixo central e os terços faciais se desenham
em linha terracota fina, que é a "régua" da harmonização. Depois o monograma
**JB** aparece sobre as linhas, que se apagam, e entram "JULIA BATALHA" e
*Harmonização facial*. Por fim, a tela sobe como uma cortina e o hero entra em
cascata. O contorno oval volta no hero, desenhado em volta do retrato.
A abertura dura cerca de 3 s, é feita só com CSS, toca uma vez por sessão, pode
ser pulada com um toque ou uma tecla e não aparece para quem ativou "reduzir
movimento" no aparelho.

## Seções

Abertura → Hero (retrato em arco + 5,0 no Google) → Abordagem ("Naturalidade
como assinatura" + 3 princípios) → Procedimentos (os 3 confirmados, cada um com
link direto para o WhatsApp) → Cuidado (antes / durante / depois) → Faixa "Mais
você. Nunca outra pessoa." → Avaliações (faixa em rotação) → Estrutura
(estacionamento, hora marcada, pagamentos, espaço inclusivo) → Dúvidas →
Instagram → Localização (mapa estático com pin JB, horários, Google Maps e Waze)
→ Rodapé com CTA.

## Skills aplicadas

- **ui-ux-pro-max**: gerei o design system para "clínica de estética / harmonização".
  A paleta sugerida (ciano/verde) foi descartada porque não combina com a marca.
  Mantive as regras de UX: contraste ≥ 4.5:1, alvos de toque ≥ 44 px, foco
  visível, `prefers-reduced-motion`, imagens com `width/height` e `loading="lazy"`.
- **impeccable (craft-floor)**: sem eyebrows, sem numeração 01/02/03, sem grade
  de cards iguais como estrutura, sem texto em gradiente, ícones e estrelas em
  SVG, seleção de texto, cursor e scrollbar na paleta, e um único momento de
  movimento autoral (a abertura).

## ⚠️ O que trocar/confirmar antes de publicar

**Fotos (o mais importante).** O Instagram bloqueou o acesso automatizado (HTTP 429)
e não existem fotos públicas da Julia em outras fontes. Por isso, todas as imagens
atuais são **fotos de banco de imagens livres (Unsplash)**, usadas só para criar o
clima. **Nenhuma delas é a Julia nem foi tirada no consultório.** Peça à cliente:

| Arquivo atual | Onde aparece | Trocar por |
|---|---|---|
| `hero-retrato-natural.jpg` | Hero (arco) | Retrato da Julia ou resultado de paciente (vertical 4:5) |
| *(monograma JB)* | Abordagem | Foto da Julia: troque o `.monogram-frame` por um `<img>` |
| `procedimento-harmonizacao.jpg` | Procedimentos | Julia atendendo (horizontal) |
| `cuidado-pos.jpg` | Cuidado | Bastidores do atendimento |
| `naturalidade.jpg` | Faixa "Mais você" | Foto editorial da Julia ou de resultado |
| `detalhe-serum.jpg` | Estrutura | Foto do consultório ou da recepção |
| `mapa-clinica.jpg` | Localização | Já é real: tiles © OpenStreetMap |

Créditos (Unsplash, licença livre para uso comercial), IDs das fotos:
1531746020798-e6953c6e8e04, 1552693673-1bf958298935, 1512290923902-8a9f81dc236c,
1509967419530-da38b4704bc6, 1617897903246-719242758050.

Quando a cliente enviar fotos de antes e depois, dá para reativar o slider de
arrastar do site da Carol/Aline: o código está no branch `claude/carol-haneda-estetica-site`.

**Avaliações.** Não consegui o texto literal das 25 avaliações. Por isso, os cards
mostram os **temas que mais aparecem nelas** (resultado natural, segurança, suporte
no pós, cuidado em cada etapa, profissionalismo e ambiente), e não citações. Nenhum
depoimento foi inventado. Para usar trechos reais, troque o `<p>` de cada
`.review-card` pelo texto da avaliação (há um comentário no HTML explicando como).

**Endereço.** A sua pesquisa indica o **nº 1405**, mas a Rede Harmonização Facial
mostra **nº 1455**. O site exibe 1405. Confirme com a cliente. Os botões "Abrir no
Google Maps" e "Google Maps" buscam pelo nome do perfil, então funcionam com
qualquer um dos dois números.

**Coordenadas** (-22.9653, -43.3871): estimadas a partir do pin do Google Maps, ao
lado da Praça Sukyo Mahikari, na Cidade Jardim. São usadas no mapa e no Waze.

**Não publicado de propósito**, porque não há fonte confiável: formação, registro
profissional (CRO/CRM), especializações, preços e outros procedimentos além dos três
confirmados.

## Dados usados (todos confirmados)

- WhatsApp (21) 97309-8600 → `https://wa.me/5521973098600`
- Instagram @drajuliabatalha
- Google: 5,0 ★, 25 avaliações
- Horários: segunda a sexta, das 8h às 21h; sábado, das 8h às 17h; domingo fechado
- Procedimentos: harmonização facial, rinomodelação e toxina botulínica
- Rede Harmonização Facial: agendamento obrigatório, planejamento, estacionamento
  no local, crédito, débito e aproximação, ambiente acolhedor para a comunidade
  LGBTQ+ e seguro para pessoas trans

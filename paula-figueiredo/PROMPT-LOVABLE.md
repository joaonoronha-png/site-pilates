Crie um site one-page premium, editorial e emocional para **PAULA FIGUEIREDO — CERIMONIAL & DECORAÇÃO DE EVENTOS**: assessoria, cerimonial e decoração de casamentos no Recreio dos Bandeirantes, Rio de Janeiro. O site deve reproduzir fielmente a referência descrita abaixo.

As fotos, o vídeo e os mapas estão anexados nesta mensagem com os nomes de arquivo indicados:
- fotos em `public/fotos/`
- vídeo em `public/video/`
- mapas em `public/mapa/`

Não invente dados. Use apenas os textos, números e nomes que estão aqui.

## Stack e bibliotecas
- React + Vite + TypeScript + Tailwind.
- Instale `gsap` (use `ScrollTrigger` e `SplitText`, gratuitos desde a v3.13) e `lenis` para a rolagem suave. Sincronize o Lenis com o ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` e `gsap.ticker`).
- Fontes do Google:
  - **Playfair Display** (400/500, com itálico) nos títulos. Não existe peso 300: use 400 com `letter-spacing -0.02em`.
  - **Jost** (300–600) nos textos e na interface.
- Mobile-first, sem rolagem horizontal da página, HTML semântico e acessível.
- Respeite `prefers-reduced-motion`: nesse caso, sem tela de abertura, sem rolagem suave, sem autoplay e sem animações de rolagem.
- Se o GSAP falhar, todo o conteúdo continua visível.

## Identidade visual
As cores vêm do logotipo: creme, listras areia e texto marrom-dourado. Use estes tokens no Tailwind:

| Token | Cor | Uso |
|---|---|---|
| ivory | `#F5F0E6` | fundo principal |
| off | `#FBF8F1` | seções de respiro, cards, formulário |
| sand | `#E4D7BD` | destaques sobre escuro |
| taupe | `#BFAE8E` | linhas e números |
| brown | `#5A4632` | itálicos e labels |
| graphite | `#2A2520` | texto, botão do mapa |
| ink | `#201C18` | seções escuras |
| champagne | `#A88B55` | acento: linhas finas, progresso, números, detalhes |
| texto secundário | `#6E5E4C` | textos de apoio |
| linhas | `rgba(90,70,50,.16)` | linhas finas |

Regras de estilo:
- **Títulos** em Playfair 400, grandes, com `text-wrap: balance`. A segunda parte de cada título fica em *itálico* brown (sand sobre fundo escuro).
- **Eyebrows**: texto 11px em caixa alta, `letter-spacing .3em`, precedido por uma linha champagne de 32px.
- **Botões** em pílula (`border-radius: 999px`), texto 11px em caixa alta, `letter-spacing .22em`. No hover, um preenchimento sobe de baixo para cima e a seta "→" anda 4px.
- **Links** com sublinhado animado que cresce da esquerda.
- **Listras do logo** como assinatura visual:
  - Faixa de 6px no topo dos cards de Investimento e do mapa: `repeating-linear-gradient(90deg, sand 0 18px, off 18px 30px)`.
  - Listras bem sutis (7% de champagne) na faixa em movimento.
- **Espaço negativo**: seções com `padding-block` de `clamp(6rem, 13vw, 11rem)`.
- Nada de corações, ornamentos, rosa clichê ou excesso de dourado. Nada de cards genéricos iguais.
- Se uma foto não carregar, mostre um degradê `#9c8c78 → #3a3129` com "Paula Figueiredo" em itálico no centro.

## Elementos globais
1. **Tela de abertura**, só na primeira visita da sessão (controle via `sessionStorage`). Adicione um failsafe que a remove após 6s.
   - Fundo ink com "Paula Figueiredo" em Playfair, com as letras subindo de uma máscara uma a uma (SplitText chars).
   - Abaixo, "CERIMONIAL & DECORAÇÃO" em champagne e uma barra fina champagne que se preenche.
   - No final, a tela sobe como uma cortina (`clip-path`) e dispara a entrada do Hero. Duração total ≈ 3s.
2. **Header fixo**.
   - À esquerda, o logo textual: "PAULA FIGUEIREDO" em Playfair caixa alta, `letter-spacing .12em`, e abaixo "CERIMONIAL & DECORAÇÃO" pequeno.
   - À direita, o botão pílula "SOLICITAR PROPOSTA" (oculto abaixo de 600px) e o botão "MENU" com um ícone de duas linhas dentro de um círculo.
   - Começa transparente, com texto claro sobre o Hero. Ao rolar, ganha fundo ivory translúcido com blur e texto escuro.
   - Esconde ao rolar para baixo e reaparece ao rolar para cima.
3. **Menu em tela cheia**, com fundo ink, abrindo como uma cortina de cima para baixo.
   - 7 links grandes em Playfair, numerados 01–07 em champagne: Início, Paula, Serviços, Casamentos reais, Investimento, Depoimentos, Contato. Os links sobem em sequência; no hover, ficam em itálico e deslizam.
   - No desktop, uma foto à direita troca conforme o link em foco: hero-1, paula, servico-decoracao, casal-01, casal-03, casal-09, cta.
   - No rodapé do menu:
     - WhatsApp (21) 98997-8296
     - E-mail paulafigueiredodecor@gmail.com
     - "Onde estamos: Rua Guilherme Baptista, 782 · Recreio" (leva a `#localizacao`)
     - Botão "Solicitar proposta"
   - O botão MENU vira "FECHAR" com um X, e a tecla Esc fecha o menu.
4. **Barra de progresso** de leitura: 2px champagne no topo da página.
5. **Dois botões flutuantes redondos** no canto inferior direito, empilhados (52px, sombra suave, `env(safe-area-inset-*)`). Eles somem quando o menu está aberto.
   - **Mapa** (em cima): fundo graphite, ícone de pin champagne em traço, tooltip "Como chegar" no hover (só em mouse).
     - Ao clicar, abre acima dele um **cartão "COMO CHEGAR"**: 210px de largura, fundo off, borda fina, raio de 18px, sombra. A animação é fade + scale a partir do canto inferior direito.
     - O cartão tem 3 opções. Cada uma tem um ícone redondo de 30px e 46px de altura mínima:
       - **Apple Maps**: ícone preto `#1d1d1f` com a maçã branca. Link: `https://maps.apple.com/?daddr=Rua+Guilherme+Baptista%2C+782+-+Recreio+dos+Bandeirantes%2C+Rio+de+Janeiro+-+RJ%2C+22790-160&dirflg=d`
       - **Waze**: ícone azul `#33ccff` com o fantasminha do Waze branco. Link: `https://waze.com/ul?ll=-23.0140487%2C-43.4582149&navigate=yes`
       - **Google Maps**: ícone branco com pin vermelho `#ea4335`. Link: `https://www.google.com/maps/dir/?api=1&destination=Rua+Guilherme+Baptista%2C+782+-+Recreio+dos+Bandeirantes%2C+Rio+de+Janeiro+-+RJ%2C+22790-160`
     - Fecha ao clicar fora, ao rolar, com Esc ou ao escolher uma opção. Use `aria-expanded` e `role="menu"`. Enquanto o cartão está aberto, o botão fica brown.
   - **WhatsApp** (embaixo): verde `#25D366`, ícone branco e um anel verde pulsando. Link: `https://wa.me/5521989978296?text=Olá, Paula! Gostaria de conversar sobre o meu casamento.`
6. **Cursor personalizado** (só em mouse): um ponto champagne que segue o mouse com atraso. Cresce sobre links, mostra "Ver" sobre as fotos da galeria e "Arraste" sobre os carrosséis.
7. **Botões magnéticos**: o botão acompanha levemente o mouse (`gsap.quickTo`).

## Seções (na ordem)

### 1. Hero (`#inicio`), 100svh, fundo escuro
- **Slideshow automático** com 5 fotos em tela cheia:
  - Crossfade de 1.8s e zoom lento (scale 1.12 → 1.02). Cada foto fica 6.5s.
  - Fotos e legendas:
    - `hero-1.webp` "Thaissa & Matheus · Casa do Alto" (object-position 50% 55%)
    - `hero-2.webp` "Júlia & Roberto · Petrópolis" (50% 45%)
    - `hero-3.webp` "Decoração · Galeria Jardim"
    - `hero-4.webp` "Thaissa & Matheus · Casa do Alto" (50% 25%)
    - `hero-5.webp` "Júlia & Roberto · Petrópolis" (50% 40%)
  - No rodapé do Hero: "01 / 05 | NOME DO CASAL" à esquerda e 5 barrinhas de progresso à direita. A barra ativa se preenche, e clicar numa barra leva à foto correspondente.
  - No celular, deslizar troca a foto. O slideshow pausa quando sai da tela.
- **Véu**: degradê escuro da esquerda (desktop) e de baixo (mobile), só o necessário para a legibilidade. O texto não pode cobrir rostos.
- **Conteúdo**, alinhado à esquerda, embaixo:
  - Linha pequena "PAULA FIGUEIREDO — CERIMONIAL & DECORAÇÃO DE EVENTOS" em sand.
  - H1 "Você vive o casamento. *A gente cuida do caminho até ele.*", com o itálico em sand. Tamanho `clamp(2.6rem, 6.2vw, 6rem)`, máximo de 16ch.
  - Texto: "Assessoria, cerimonial e decoração de casamentos no Rio de Janeiro, com organização, agilidade e a leveza que o grande dia merece."
  - Botões:
    - "PLANEJE SEU CASAMENTO COMIGO →", claro, leva a `#proposta`.
    - "VER CASAMENTOS REAIS", contorno claro, leva a `#casamentos-reais`.
- **Animações**:
  - Entrada: as linhas do H1 sobem de uma máscara com stagger; depois entram o texto, os botões e a legenda.
  - Ao rolar, o conteúdo sobe e esmaece (scrub).
  - No desktop, indicador vertical "DESCUBRA" à direita, com uma linha animada.

### 2. Faixa em movimento
Fundo ink com listras sutis e texto em Playfair itálico sand, rolando infinitamente para a esquerda (≈40s). Itens separados por pequenos círculos champagne: Assessoria · Cerimonial · Decoração · Cerimônias religiosas · Casamentos ao ar livre · Búzios · Angra dos Reis · Petrópolis · Casamentos à distância · De 50 a mais de 500 convidados.

### 3. Manifesto (fundo off, centralizado)
- Frase grande: "Seja qual for o estilo do seu casamento, *o grande dia merece ser leve.*" **Cada palavra acende** de opacidade 0.14 para 1 conforme a rolagem (SplitText words + scrub).
- Depois, uma linha vertical champagne que cresce e o texto: "Organizar um casamento envolve centenas de decisões. O nosso trabalho é transformar cada uma delas em um caminho claro, com planejamento, fornecedores de confiança e alguém ao seu lado do primeiro encontro ao último convidado."

### 4. Sobre (`#paula`), layout assimétrico
- **À esquerda**, duas fotos, ambas com parallax leve e revelação em cortina:
  - `paula.webp` em 4:5 (alt: "Paula Figueiredo no Solar Real, com o Pão de Açúcar ao fundo", object-position 38% 30%).
  - Sobreposta no canto inferior direito, `bastidores.webp` em 3:4, com contorno ivory de 12px.
  - Legenda vertical "BASTIDORES · GALERIA JARDIM".
- **À direita**:
  - Eyebrow "O BRAÇO DIREITO DOS CASAIS". H2 "Prazer, *Paula.*"
  - Parágrafo 1: "Paula Figueiredo é o verdadeiro braço direito dos casais no casamento. Seja qual for o estilo da celebração, ela alia seus conhecimentos e sua experiência ao cerimonial, facilitando cada etapa e tornando o grande dia inesquecível para todos que vivem esse momento."
  - Parágrafo 2: "Desde 2010 dedicada a casamentos inesquecíveis, e com mais de 110 casais atendidos só pelo Casamentos.com.br, ela trabalha de um jeito leve e organizado: entender o que é prioridade para vocês, respeitar o orçamento e conduzir o planejamento com uma planilha clara do evento."
  - Citação em Playfair itálico brown, com uma borda champagne à esquerda: “Amo cada bate-papo, cada minuto das reuniões, e o grande dia então nem se fala.” Assinatura: "PAULA FIGUEIREDO".
  - Lista em itálico entre linhas finas: "i. Assessoria · ii. Cerimonial · iii. Decoração".
  - Link "CONHEÇA A FORMA DE TRABALHAR →" para `#como-funciona`.

### 5. Frase de impacto (fundo off, centralizado)
"No dia do casamento, a única preocupação de vocês deve ser a noiva mais linda e o noivo mais radiante." com as palavras acendendo na rolagem, seguida de "*O resto é com a gente.*" em itálico enorme. Uma linha champagne desce até a próxima seção.

### 6. Serviços (`#servicos`)
- Eyebrow "SERVIÇOS". H2 "Do primeiro sim *ao último convidado.*" Subtítulo: "Assessoria, cerimonial e decoração podem ser contratados em conjunto, com uma única equipe cuidando de tudo."
- **Desktop**:
  - À esquerda, uma foto sticky em 4:5 que troca com efeito de cortina conforme o serviço em foco (por hover ou rolagem): `servico-assessoria.webp`, `servico-cerimonial.webp`, `servico-decoracao.webp`, `servico-fornecedores.webp`.
  - À direita, uma lista editorial com linhas finas. A linha inferior do item ativo se preenche de champagne, e o número grande (taupe → champagne) destaca o item ativo.
- **Itens** (cada um com o link "SOLICITAR →" para `#proposta`):
  - **01 Assessoria**: "Organização do casamento do início ao fim: definição do estilo, planejamento dos detalhes e condução das decisões, sempre alinhados às prioridades e ao orçamento do casal."
  - **02 Cerimonial**: "No grande dia, a equipe conduz o cronograma, a cerimônia e os fornecedores, para que vocês só precisem viver o momento."
  - **03 Decoração**: "Ambientação da cerimônia e da festa com a identidade do casal, contratada sozinha ou junto com a assessoria."
  - **04 Planejamento & fornecedores**: "Indicação de fornecedores com ótimo custo-benefício e uma planilha organizada do evento, construída a partir das reuniões com vocês."

### 7. Para todos os casamentos (fundo off)
- Eyebrow "PARA TODOS OS CASAMENTOS". H2 "Do íntimo *ao grandioso.*"
- 4 colunas no desktop e 2 no mobile, separadas por linhas finas. Número grande em Playfair e, abaixo, "CONVIDADOS" pequeno em caixa alta:
  - **<100**
  - **100–300**
  - **300–500**
  - **+500**
- Abaixo, "CERIMÔNIAS" e uma lista em itálico separada por "·" champagne: Religiosas · Ao ar livre · De outras religiões além da católica · Civis e simbólicas.

### 8. Como funciona (`#como-funciona`)
- Fundo em degradê off → #F1EBE2.
- **Título sticky à esquerda**: eyebrow "COMO FUNCIONA", H2 "O caminho *até o sim.*" e o texto "Seis etapas, uma equipe e nenhuma decisão tomada sozinha."
- **À direita**, uma linha vertical que se preenche de champagne com a rolagem, e 6 etapas com bolinhas que acendem (as etapas inativas ficam com opacidade 0.35):
  - 01 **Primeiro contato**: "Uma conversa pelo WhatsApp ou pelo formulário. Respondemos normalmente em até 24 horas."
  - 02 **Entendendo vocês**: "Reuniões para conhecer a história do casal, o estilo desejado, as prioridades e o orçamento."
  - 03 **Planejamento**: "Tudo vira uma planilha organizada do evento: etapas, prazos, decisões e detalhes em um só lugar."
  - 04 **Fornecedores**: "Indicação de fornecedores de confiança, com excelente custo-benefício, e acompanhamento de cada contrato."
  - 05 **Organização**: "Cronograma, decoração e cerimônia ajustados em conjunto até o último detalhe."
  - 06 **O grande dia**: "A equipe conduz os bastidores, os fornecedores e os imprevistos." e, em itálico grande, "*Vocês só vivem.*"

### 9. Casamentos reais (`#casamentos-reais`), fundo ink
- **Cabeçalho**: eyebrow "CASAMENTOS REAIS", H2 "Histórias que *ajudamos a escrever.*" Ao lado, o contador "01 / 10" e a dica "ROLE PARA VER" (desktop) ou "DESLIZE PARA VER" (mobile).
- **Desktop: rolagem horizontal fixa.** A seção fica presa (ScrollTrigger pin + scrub) e a rolagem vertical move a faixa para a esquerda. As fotos se movem levemente dentro das molduras (`containerAnimation`).
- **Mobile**: faixa com swipe e scroll-snap.
- **Fotos**: 10 verticais em 4:5, alternando alturas (uma sim, uma não deslocada para baixo). A legenda mostra o nome em Playfair itálico e o local em caixa alta pequena:
  1. `casal-01.webp` Thaissa & Matheus · Casa do Alto
  2. `casal-02.webp` Júlia & Roberto · Petrópolis
  3. `casal-03.webp` Pamela · Galeria Jardim
  4. `casal-04.webp` Isabela & Caio · Casamento
  5. `casal-05.webp` Thaissa & Matheus · Casa do Alto
  6. `casal-06.webp` Júlia & Roberto · Petrópolis
  7. `casal-07.webp` Pamela · Galeria Jardim
  8. `casal-08.webp` Isabela & Caio · Casamento
  9. `casal-09.webp` Thaissa & Matheus · Casa do Alto
  10. `casal-10.webp` Pamela · Galeria Jardim
- **Último item**: "Mais casamentos *reais.*" com uma lista entre linhas finas, nome em itálico à esquerda e detalhe pequeno à direita:
  - Thaissa & Matheus · Casa do Alto · ago 2026
  - Patrícia & Lucas · Além do Sonho
  - Camila & Luiz · dez 2025
  - Suzanne & Brunno · 81 fotos
  - Isabela & Danilo · 68 fotos
  - Abaixo da lista, o botão "VER NO INSTAGRAM ↗".
- **Lightbox**: clicar numa foto abre um lightbox escuro com a imagem inteira, nome, local, contador "03 / 10", setas, navegação por teclado (←/→/Esc) e swipe. Prepare cada item para ter, opcionalmente, um link "Ver história completa".

### 10. Longe de casa
- **À esquerda**: o vídeo vertical `decoracao-camila-luiz.mp4` (poster `video-poster.webp`) com `autoplay muted loop playsinline`. Proporção 9:14, até 480px de largura, revelação em cortina.
  - Legenda em pílula escura translúcida sobre o vídeo: "Camila & Luiz · decoração e cerimonial".
- **À direita**:
  - Eyebrow "LONGE DE CASA". H2 "Na praia, na serra, *com vista para o Rio.*"
  - Texto: "Já acompanhamos casamentos em Búzios, Angra dos Reis e Petrópolis, e casais que organizaram tudo morando longe do Rio, com reuniões online e a planilha do evento compartilhada."
  - Pílulas com contorno e texto em itálico: Búzios · Angra dos Reis · Petrópolis · Organização à distância.
  - Nota pequena: "Condições e logística conversadas caso a caso."

### 11. Momento cinematográfico
Foto `momento.webp` em tela cheia (92svh), com parallax e véu radial escuro. Texto centralizado em Playfair, com as linhas subindo ao entrar na tela: "Casamento organizado em três meses." e, em itálico sand, "*Com calma, com tudo no lugar, com a gente ao lado.*"

### 12. Investimento (`#investimento`)
- Fundo em degradê ivory → #EFE7D8.
- **À esquerda**: eyebrow "INVESTIMENTO", H2 "Cada casamento *é único.*" e o texto "Por isso, cada proposta é feita sob medida, a partir do que vocês imaginam para o grande dia."
- **À direita, um card**: fundo off, borda fina, sombra longa e a faixa listrada do logo no topo.
  - "CERIMONIAL E ASSESSORIA" em caixa alta brown.
  - "A PARTIR DE" pequeno e, embaixo, **R$ 6.500** em Playfair enorme.
  - Uma lista com traço champagne antes de cada item:
    - Pagamento flexível, combinado conforme a disponibilidade financeira do casal
    - Quitação até 15 dias antes do evento
    - Assessoria e decoração podem ser contratadas em conjunto
  - Botão escuro de largura total: "SOLICITAR PROPOSTA PERSONALIZADA →".

### 13. Depoimentos (`#depoimentos`)
- Eyebrow "DEPOIMENTOS". H2 "75 casais, *nota 5,0.*"
- **Faixa em rotação contínua e lenta, infinita** (≈0.32px por frame, para a esquerda), ocupando toda a largura da tela.
  - Os cards são duplicados para o loop não ter emenda.
  - No mouse, a faixa desacelera no hover.
  - Dá para **arrastar com o mouse ou com o dedo**:
    - O cartão acompanha o dedo 1:1.
    - Ao soltar, continua com inércia e desacelera suavemente até voltar à velocidade normal.
    - No celular, detecte a direção do gesto: arraste horizontal move a faixa (com `preventDefault` no `touchmove`, listener `passive:false`); arraste vertical rola a página normalmente.
    - Use `touch-action: pan-y` e desative `user-select` e o arrasto nativo de imagens.
- **Cards**: `min(82vw, 400px)` de largura, fundo off e borda fina.
  - No topo, o título da avaliação em caixa alta champagne pequena.
  - Aspas grandes champagne e a frase em Playfair.
  - No rodapé: avatar redondo graphite com a inicial em itálico, nome em caixa alta, a origem e ★★★★★ champagne.
- **Avaliações** (textos literais do Casamentos.com.br):
  1. "MEU CASAMENTO ORGANIZADO EM 3 MESES": “Ela é uma excelente profissional, muito prática, ágil e rápida para resolver as coisas.” Narriman · Casamentos.com.br · ago 2026
  2. "A ESCOLHA PERFEITA": “Ter a Paula e toda a sua equipe ao nosso lado foi essencial para que nosso casamento acontecesse exatamente como planejamos.” Isabela · Casamentos.com.br · ago 2026
  3. "PERFEITA": “A Paula foi a minha cerimonialista e foi simplesmente impecável. Desde o início, conduziu tudo com muito profissionalismo.” Ana · Casamentos.com.br · jul 2026
  4. "NOSSO PORTO SEGURO NA ORGANIZAÇÃO DO CASAMENTO!": “Contratar a Paulinha foi a melhor decisão que tomamos! Organizar um casamento exige muito.” Paula · Casamentos.com.br · abr 2026
  5. "MELHOR ESCOLHA QUE EU FIZ PARA O MEU CASAMENTO!": “A Paula foi atenciosa desde o primeiro contato.” Fernanda · Casamentos.com.br · jun 2022
- **Resumos**: estes cards NÃO têm aspas grandes. O label é "RESUMO DA AVALIAÇÃO" e o texto fica em itálico brown:
  6. "“Fada madrinha de casamentos”: orientação do início ao fim e uma equipe que resolve imprevistos com discrição." Stephanie · Casamentos.com.br · jul 2026
  7. "“Planejei meu casamento de forma leve graças à Paulinha!”: cada casal é tratado como único, com calma até nos imprevistos do dia." Taline · Casamentos.com.br · jul 2026
- **Instagram**: este card tem o label "PELO INSTAGRAM" e ♥ no lugar das estrelas:
  8. “Meu sonho se realizou graças ao trabalho e empenho dessa mulher maravilhosa. Me ouviu, me entendeu e foi muito paciente quanto às minhas 1000 mudanças de ideias.” Pamela · Galeria Jardim · Instagram

### 14. Números e prêmios (fundo graphite)
- 4 colunas no desktop e 2 no mobile, separadas por linhas finas.
- Números grandes em Playfair que contam de 0 até o valor quando entram na tela. Em cada coluna: o número, um label em caixa alta sand e um texto pequeno taupe:
  - **+110** · CASAIS · *via Casamentos.com.br*
  - **5,0★** · NOTA MÉDIA · 75 avaliações
  - **100%** · RECOMENDAM · dos casais
  - **2018–2026** · CASAMENTOS AWARDS · vencedora consecutiva (o traço em champagne)
- Nota: "Dados do perfil de Paula Figueiredo no Casamentos.com.br, set/2026. Resposta normalmente em até 24 horas."

### 15. Instagram
- Eyebrow "INSTAGRAM · 7.600 SEGUIDORES". H2 "Cada detalhe, *pensado com vocês.*" Botão com contorno "@paulafigueiredoeventosrj ↗".
- **Duas faixas de fotos verticais em rotação contínua e infinita**:
  - Faixa 1: vai para a esquerda, velocidade 0.5, fotos `detalhe-01` a `detalhe-06`.
  - Faixa 2: vai para a direita, velocidade 0.4, fotos `detalhe-07` a `detalhe-12`.
- Mesmo motor e mesmo arraste com inércia dos depoimentos.
- Altura das fotos: `clamp(180px, 26vw, 320px)`, cantos com 3px de raio.

### 16. FAQ (`#faq`), fundo off
- **Título sticky à esquerda**: eyebrow "PERGUNTAS FREQUENTES", H2 "Antes de *começarmos…*" e "Ficou alguma dúvida? Fale com a Paula" (link para o WhatsApp).
- **Accordion** com abertura suave, "+" champagne que vira "−" e linhas finas:
  - **Quanto custa a assessoria e o cerimonial?** O cerimonial e a assessoria partem de R$ 6.500. Como cada casamento é único, o valor final depende do formato, do número de convidados e dos serviços contratados. Solicite uma proposta personalizada.
  - **Como funciona o pagamento?** O pagamento é flexível e combinado conforme a disponibilidade financeira do casal, devendo estar quitado até 15 dias antes do evento.
  - **Vocês atendem casamentos de qualquer tamanho?** Sim. Atendemos casamentos com menos de 100 convidados, de 100 a 300, de 300 a 500 e com mais de 500 convidados.
  - **Que tipos de cerimônia vocês acompanham?** Cerimônias religiosas e ao ar livre, incluindo casamentos de religiões além da católica.
  - **Dá para organizar o casamento morando longe do Rio?** Sim. Já acompanhamos casais que organizaram tudo à distância, além de casamentos em Búzios e Angra dos Reis. Conte para a Paula onde vocês estão e onde sonham casar.
  - **Vocês indicam fornecedores?** Sim. A assessoria inclui a indicação de fornecedores com ótimo custo-benefício e o acompanhamento do planejamento em uma planilha organizada do evento.
  - **Com quanto tempo de antecedência devo contratar?** Quanto antes, mais opções de datas e fornecedores. Mas já houve casamento organizado em cerca de três meses. Conte a sua data e avaliamos juntos.

### 17. CTA final (fundo ink com `cta.webp` e parallax)
Centralizado:
- Eyebrow "O PRIMEIRO PASSO".
- H2 enorme "Vamos planejar *o seu casamento?*"
- "Conte a sua data e o que vocês imaginam. A Paula responde normalmente em até 24 horas."
- Botão claro "PLANEJE SEU CASAMENTO COMIGO →", que leva a `#proposta`.

### 18. Contato + formulário (`#contato`; o formulário tem o id `proposta`)
- **À esquerda**:
  - Eyebrow "CONTATO". H2 "Conte como vocês *imaginam o grande dia.*"
  - "Atendimento de segunda a sábado, das 9h às 20h."
  - Contatos, cada um com label pequeno e valor em Playfair:
    - WhatsApp (21) 98997-8296
    - E-mail paulafigueiredodecor@gmail.com
    - Instagram @paulafigueiredoeventosrj
  - Endereço: "Paula Figueiredo Cerimonial e Decoração de Eventos · Rua Guilherme Baptista, 782 — Recreio dos Bandeirantes · Rio de Janeiro – RJ · CEP 22790-160 · ver no mapa" (o link leva a `#localizacao`).
- **À direita**: o formulário, num painel off com sombra suave. Os campos têm só a linha inferior e labels pequenos em caixa alta:
  - Nomes do casal*
  - WhatsApp*, com máscara (21) 90000-0000
  - E-mail*
  - Cerimônia* (select): Religiosa, Ao ar livre, Civil / simbólica, Outra religião, Ainda não sabemos
  - Data prevista (texto livre, ex.: "12/10/2027 ou out/2027")
  - Local do casamento (placeholder "Cidade, espaço ou ainda em definição")
  - Convidados (select): Menos de 100, 100 a 300, 300 a 500, Mais de 500
  - Serviços de interesse, em pílulas: Assessoria + cerimonial / + Decoração / Só decoração / Ainda não sei (padrão)
  - Textarea "Conte um pouco sobre o casamento que vocês imaginam."
  - Campo honeypot anti-spam escondido
  - Texto: "Ao enviar, vocês concordam com o uso dos dados apenas para retorno do contato."
  - Botão escuro "QUERO PLANEJAR MEU CASAMENTO →"
- Validação com mensagens amigáveis em português.
- **Ao enviar**:
  - O formulário é trocado por um painel "OBRIGADA · O caminho até o sim *começa agora.*", com o texto "Para concluir, envie a mensagem para a Paula pelo WhatsApp. Ela já está pronta." e o botão "CONTINUAR NO WHATSAPP →".
  - O link do botão é `https://wa.me/5521989978296?text=` com a mensagem montada: "Olá, Paula! Somos {nomes}. / Cerimônia / Data prevista / Local / Convidados / Serviços de interesse / Sobre o casamento / Contato: {whatsapp} · {email}".
  - Crie uma constante opcional `FORM_ENDPOINT`: se estiver preenchida, o site faz um POST em JSON antes de mostrar o painel.
  - Dispare `dataLayer.push({event:'generate_lead'})`.

### 19. Onde estamos (`#localizacao`)
- **Mapa estático** `mapa/mapa-recreio.webp` (mobile) e `mapa/mapa-recreio-desktop.webp` (a partir de 900px, via `<picture>`). O mapa ocupa toda a largura:
  - Altura: `clamp(360px, 62vh, 640px)` no mobile e `min(78vh, 720px)` no desktop.
  - Filtro `sepia(.35) saturate(.8) contrast(.95)`.
  - Degradês ivory nas bordas, para o mapa se fundir com a página.
- **Pin**: gota graphite (50% 50% 50% 0, girada −45°) com "PF" em sand e um pulso champagne embaixo.
  - Posição: centro do mapa no mobile; `left: 62%` no desktop.
  - Crédito pequeno: "© colaboradores do OpenStreetMap".
- **Botão "Ver mapa interativo"**, em pílula clara no canto superior direito. Ao clicar, troca a imagem por um iframe do Google Maps: `https://www.google.com/maps?q=Rua%20Guilherme%20Baptista%2C%20782%20-%20Recreio%20dos%20Bandeirantes%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2022790-160&z=16&output=embed`
- **Card sobre o mapa**: à esquerda e centralizado na vertical no desktop; no mobile, sobe 7rem sobre o mapa. Fundo off, faixa listrada no topo e sombra.
  - Eyebrow "ONDE ESTAMOS". Título "Recreio dos *Bandeirantes.*"
  - Endereço em Playfair: "Rua Guilherme Baptista, 782 / Recreio dos Bandeirantes / Rio de Janeiro – RJ · CEP 22790-160".
  - "Atendimento de segunda a sábado, das 9h às 20h, com horário marcado."
  - Botões:
    - "ABRIR NO GOOGLE MAPS ↗" (escuro)
    - "IR COM WAZE ↗" (contorno)
    - "APPLE MAPS ↗" (contorno)
    - Use os mesmos links do botão flutuante.

### 20. Rodapé (fundo ink)
- Frase "Você vive o casamento. *A gente cuida do caminho até ele.*" (itálico champagne) com o botão "SOLICITAR PROPOSTA".
- Links em duas colunas:
  - Sobre, Serviços, Casamentos reais, Investimento, Contato, Localização
  - WhatsApp, Casamentos.com.br, Instagram, Facebook, E-mail
- Letreiro gigante "Paula Figueiredo" em Playfair, ocupando a largura (`clamp(1.8rem, 7.4vw, 8.8rem)`), com as letras subindo ao entrar.
- "© {ano atual} Paula Figueiredo Cerimonial e Decoração de Eventos · Recreio dos Bandeirantes — Rio de Janeiro/RJ".
- Créditos pequenos: "Fotos: @clavello (Thaissa & Matheus), @bernardozirkheuer (Pamela), @jourbenifotografia (retrato), @werneckfotografia (vídeo Camila & Luiz) e demais fotógrafos dos casamentos".

## Animações de rolagem (GSAP)
- **Títulos marcados**: as linhas sobem de uma máscara (SplitText lines + mask) com stagger ao entrar na tela, uma única vez.
- **Blocos de texto**: fade + translateY de 40px, com `ScrollTrigger.batch`.
- **Imagens**: revelação em cortina de baixo para cima (`clip-path inset(100% 0 0 0)` → 0), com a imagem desfazendo um zoom de 1.3.
- **Parallax** sutil (±6–12%) nas fotos marcadas.
- **Ease**: sempre "expo.out" ou "power3.out", sem exagero. O luxo vem da composição e do ritmo.

## Links e dados
- WhatsApp: https://wa.me/5521989978296 (21) 98997-8296
- E-mail: paulafigueiredodecor@gmail.com
- Instagram: https://www.instagram.com/paulafigueiredoeventosrj/
- Casamentos.com.br: https://www.casamentos.com.br/cerimonialista/paula-figueiredo--e125875
- Facebook: https://www.facebook.com/paulafigueiredoeventos/
- Endereço: Rua Guilherme Baptista, 782 — Recreio dos Bandeirantes, Rio de Janeiro – RJ, CEP 22790-160 (lat −23.0140487, lng −43.4582149)
- Todos os links externos com `target="_blank" rel="noopener noreferrer"`.
- **SEO**:
  - Título: "Paula Figueiredo | Cerimonial, Assessoria e Decoração de Casamentos no Rio de Janeiro".
  - Meta description: "Cerimonial, assessoria e decoração de casamentos no Recreio dos Bandeirantes, Rio de Janeiro. Nota 5,0 em 75 avaliações, mais de 110 casais e Casamentos Awards de 2018 a 2026."
  - Open Graph com a frase "Você vive o casamento. A gente cuida do caminho até ele."
  - JSON-LD `ProfessionalService` com endereço, geo, `priceRange` "A partir de R$ 6.500", `aggregateRating` 5.0 / 75 e `sameAs` (Instagram, Casamentos.com.br, Facebook).

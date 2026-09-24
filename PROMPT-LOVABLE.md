Crie um site one-page premium, editorial e emocional para **REBECCA GEMAQUE — ASSESSORIA & CERIMONIAL** (assessoria e cerimonial de casamentos no Rio de Janeiro). Ele deve reproduzir fielmente o site de referência descrito abaixo. As fotos estão anexadas nesta mensagem, com os nomes de arquivo indicados. Coloque todas em `public/fotos/` mantendo esses nomes.

## Stack e bibliotecas
- React + Vite + TypeScript + Tailwind.
- Instale `gsap` (use `ScrollTrigger` e `SplitText`, gratuitos desde a v3.13) e `lenis` para rolagem suave. Sincronize o Lenis com o ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` e `gsap.ticker`).
- Fontes do Google: **Cormorant Garamond** (300/400/500, com itálico) nos títulos e **Manrope** (300–600) nos textos e na interface.
- Mobile-first, sem rolagem horizontal da página, HTML semântico e acessível.
- Respeite `prefers-reduced-motion`: sem tela de abertura, sem rolagem suave, sem autoplay e sem animações de rolagem.
- Se o GSAP falhar, todo o conteúdo precisa continuar visível.

## Identidade visual
Paleta (use como tokens do Tailwind):
- ivory `#F7F3ED` (fundo principal)
- off `#FCFAF7` (seções de respiro)
- sand `#DED3C5` (destaques sobre escuro)
- taupe `#B9AA9B`
- brown `#403731` (itálicos e labels)
- graphite `#292623` (texto)
- ink `#1E1B19` (seções escuras)
- champagne `#B99B72` (acento: só em linhas finas, barras de progresso, números e detalhes)
- texto secundário `#6B5F55`

Regras de estilo:
- Títulos grandes em Cormorant peso 300, com `letter-spacing -0.015em` e `text-wrap: balance`. A segunda parte de cada título fica em *itálico* na cor brown (sand sobre fundo escuro).
- "Eyebrows": texto 11px, caixa alta, `letter-spacing .3em`, precedido por uma linha champagne de 32px.
- Botões em pílula (`border-radius: 999px`), texto 11px em caixa alta com `letter-spacing .22em`. No hover, um preenchimento sobe de baixo para cima e a seta "→" anda 4px.
- Links com sublinhado animado que cresce da esquerda.
- Muito espaço negativo: seções com `padding-block` de clamp(6rem, 13vw, 11rem).
- Nada de corações, ornamentos, rosa clichê ou excesso de dourado. Nada de cards genéricos iguais.

## Elementos globais
1. **Tela de abertura** (só na primeira visita da sessão, via `sessionStorage`). Fundo ink com "REBECCA GEMAQUE" em Cormorant caixa alta, letras subindo de uma máscara uma a uma (SplitText chars). Abaixo, "ASSESSORIA & CERIMONIAL" em champagne e uma barra fina champagne que se preenche. Depois, a tela sobe como uma cortina (`clip-path`) e dispara a entrada do Hero. Duração total ≈ 3s.
2. **Header fixo**. À esquerda, logo textual: "REBECCA GEMAQUE" em Cormorant caixa alta com espaçamento largo e, abaixo, "ASSESSORIA & CERIMONIAL" pequeno. À direita, o botão pílula "SOLICITAR PROPOSTA" (oculto abaixo de 600px) e o botão "MENU" com um ícone de duas linhas dentro de um círculo. Começa transparente com texto claro sobre o Hero. Ao rolar, ganha fundo ivory translúcido com blur e texto escuro. Esconde ao rolar para baixo e reaparece ao rolar para cima.
3. **Menu em tela cheia** (fundo ink, abre com cortina de cima para baixo). Tem 7 links grandes em Cormorant, numerados 01–07 em champagne: Início, Rebecca, Assessoria, Experiências, Portfólio, Depoimentos, Contato. Os links sobem em sequência. No hover ficam em itálico e deslizam. No desktop, à direita, uma foto troca conforme o link em foco (hero-1, rebecca, assessoria-completa, casamentos, portfolio-01, hero-4, cta). No rodapé do menu: WhatsApp, Instagram, e-mail e o botão "Solicitar proposta". O botão MENU vira "FECHAR" com um X. Esc fecha o menu.
4. **Barra de progresso** de leitura com 2px champagne no topo da página.
5. **Botão flutuante de WhatsApp**: círculo graphite no canto inferior direito, com um anel champagne pulsando. Aparece depois do Hero e some quando o formulário está visível.
6. **Cursor personalizado** (só em mouse): ponto champagne que segue o mouse com atraso. Cresce sobre links, mostra "Ver" sobre as fotos do portfólio e "Arraste" sobre os carrosséis.
7. **Botões magnéticos**: o botão acompanha levemente o mouse (`gsap.quickTo`).

## Seções (na ordem)

### 1. Hero (`#inicio`), 100svh, fundo escuro
- **Slideshow automático** com 5 fotos em tela cheia, crossfade de 1.8s e zoom lento (scale 1.12 → 1.02). Cada foto fica 6.5s. Legendas:
  - `hero-1.webp` "Teka & Filipe" (object-position 72% 30%)
  - `hero-2.webp` "Samara & Igor · Espaço Realizar"
  - `hero-3.webp` "Monique & Michel · Jardim do Casarão"
  - `hero-4.webp` "Linda & Fábio · Palladium"
  - `hero-5.webp` "Luiza & Tiago · Sítio Vale do Ipê"
- No rodapé do Hero: "01 / 05 | NOME DO CASAL" à esquerda e 5 barrinhas de progresso à direita (a ativa se preenche; clicar leva à foto). No celular, deslizar troca a foto. O slideshow pausa fora da tela.
- Véu: degradê escuro da esquerda (desktop) e de baixo (mobile), só o necessário para legibilidade.
- Conteúdo alinhado à esquerda, embaixo:
  - Linha pequena "REBECCA GEMAQUE — ASSESSORIA & CERIMONIAL" em sand.
  - H1: "Enquanto cuidamos de cada detalhe, *você vive cada momento.*" (itálico em sand, clamp(2.8rem, 7vw, 6.8rem)).
  - Texto: "Assessoria e cerimonial para celebrações que merecem ser vividas com presença, tranquilidade e emoção."
  - Botões "PLANEJE SEU EVENTO →" (claro, leva a `#proposta`) e "CONHEÇA NOSSO TRABALHO" (contorno claro, leva a `#portfolio`).
- Entrada: linhas do H1 sobem de uma máscara com stagger, e em seguida texto, botões e legenda.
- Ao rolar, o conteúdo sobe e esmaece (scrub).
- No desktop, indicador vertical "DESCUBRA" à direita, com uma linha animada.

### 2. Faixa em movimento
Fundo ink com texto em Cormorant itálico sand, rolando infinitamente para a esquerda (≈40s). Itens separados por pequenos círculos champagne: Casamentos · Mini weddings · Destination weddings · 15 anos · Cerimônias simbólicas · Casamentos homoafetivos · Casamentos militares · Renovação de votos · Eventos corporativos.

### 3. Manifesto (fundo off, centralizado)
"Há momentos que acontecem *uma única vez.* Por isso, cada detalhe importa." Frase grande em que **cada palavra acende** de opacidade 0.14 para 1 conforme a rolagem (SplitText words + scrub). Depois, uma linha vertical champagne que cresce e o texto: "Planejar um evento vai muito além de organizar fornecedores e horários. É criar as condições para que você esteja presente justamente no momento que imaginou durante tanto tempo."

### 4. Sobre (`#rebecca`), layout assimétrico
- À esquerda, `rebecca.webp` em 4:5 e, sobreposta no canto inferior direito, `rebecca-bastidores.webp` em 3:4, com contorno ivory de 12px. As duas têm parallax leve e revelação em cortina. Legenda vertical "BASTIDORES · KAREN & PATRICK".
- À direita:
  - Eyebrow "POR TRÁS DE CADA DETALHE".
  - H2 "Prazer, *Rebecca.*"
  - Parágrafo 1: "Rebecca Gemaque atua como assessora, cerimonialista e mestre de cerimônias, conduzindo eventos com planejamento, proximidade e atenção aos detalhes."
  - Parágrafo 2: "Sua atuação busca permitir que clientes e famílias vivam a celebração com tranquilidade enquanto toda a operação acontece nos bastidores: de cerimônias religiosas e simbólicas a mini weddings, casamentos homoafetivos e militares, 15 anos e renovações de votos."
  - Lista em itálico entre linhas finas: "i. Assessora · ii. Cerimonialista · iii. Mestre de cerimônias".
  - Link "CONHEÇA NOSSA FORMA DE TRABALHAR →" para `#como-funciona`.

### 5. Frase de impacto (fundo off, centralizado)
"Você não deveria passar o seu grande dia preocupada com o que está acontecendo nos bastidores." (palavras acendendo no scroll), seguida de "*Você deveria estar vivendo.*" em itálico enorme. Uma linha champagne desce até a próxima seção.

### 6. Assessoria (`#assessoria`)
- Eyebrow "ASSESSORIA". H2 "Do primeiro planejamento *ao último abraço da noite.*" Subtítulo "Escolha o acompanhamento que faz sentido para o momento em que seu evento está."
- Desktop: à esquerda, uma foto sticky em 4:5 que troca com uma cortina conforme a modalidade em foco (hover ou rolagem): `assessoria-completa.webp`, `assessoria-parcial.webp`, `assessoria-final.webp`. À direita, uma lista editorial com linhas finas. A linha inferior de cada item se preenche de champagne quando ativa, e o número grande (Cormorant 300, taupe → champagne) destaca o item ativo.
  - **01 Assessoria completa**: "Planejamento e acompanhamento desde os preparativos até a realização do evento." A partir de **R$ 6.500***
  - **02 Assessoria parcial**: "Para quem já iniciou os preparativos e deseja apoio profissional para organizar as próximas decisões e conduzir o processo." A partir de **R$ 5.500***
  - **03 Assessoria final**: "Para quem já organizou grande parte do evento e deseja segurança, coordenação e acompanhamento profissional na etapa final." A partir de **R$ 4.000***
  - Cada item tem o link "SAIBA MAIS →", que rola até o formulário e já marca a modalidade.
- Nota: "*Valores de referência sujeitos à confirmação e atualização."

### 7. Experiências (`#experiencias`)
H2 "Cada celebração tem *a sua própria história.*" Mosaico de fotos com proporções diferentes (desktop em grid de 12 colunas; mobile em 2 colunas). Cada foto tem legenda sobreposta embaixo (número pequeno + nome em Cormorant), revelação em cortina e zoom de 5% no hover:
1. Casamentos: `casamentos.webp` (maior, 7 colunas × 4 linhas)
2. Destination weddings: `destination.webp`
3. Mini & micro weddings: `mini-wedding.webp`
4. 15 anos: `15-anos.webp`
5. Bodas & celebrações: `celebracoes.webp`
6. Eventos corporativos: `eventos.webp`

Abaixo, "TAMBÉM ACOMPANHAMOS" e uma lista em itálico separada por "·" champagne: Casamentos na praia, Casamentos no campo, Cerimônias civis, Cerimônias religiosas, Cerimônias simbólicas, Casamentos homoafetivos, Casamentos militares, Elopement weddings, Renovação de votos, Noivados, Aniversários, Feiras e eventos personalizados.

### 8. Como funciona (`#como-funciona`)
Fundo em degradê off → #F1EBE2. Título sticky à esquerda: "Até o *grande dia.*" e "Uma travessia feita em conjunto, com clareza em cada etapa." À direita, uma linha vertical que se preenche de champagne com a rolagem, e 5 etapas com bolinhas que acendem (etapas inativas ficam com opacidade 0.35):
- 01 **Nos conhecemos**: "Tudo começa entendendo sua história, seu evento e aquilo que realmente importa para você."
- 02 **Planejamos**: "Organizamos etapas, prioridades, fornecedores e decisões."
- 03 **Construímos**: "Cada escolha começa a formar a experiência imaginada."
- 04 **Coordenamos**: "Cronograma, fornecedores e detalhes passam a trabalhar em conjunto."
- 05 **Você vive**: "No grande dia, nossa equipe cuida dos bastidores." e, em itálico grande, "*Você vive o momento.*"

### 9. Portfólio (`#portfolio`), fundo ink
- H2 "Histórias que já tivemos *o privilégio de acompanhar.*" com contador "01 / 10" e "ROLE PARA VER" (desktop) ou "DESLIZE PARA VER" (mobile).
- **Desktop: rolagem horizontal fixa** (a seção é pinada e a rolagem vertical move a faixa para a esquerda, com ScrollTrigger pin + scrub). As fotos se movem levemente dentro das molduras (`containerAnimation`). **Mobile:** faixa com swipe e scroll-snap.
- Fotos alternando verticais (4:5) e horizontais (3:2), algumas deslocadas para baixo. A legenda mostra o nome do casal em Cormorant itálico e o local em caixa alta pequena:
  1. `portfolio-01.webp` Luiza & Tiago · Sítio Vale do Ipê (H)
  2. `portfolio-02.webp` Monique & Michel · Jardim do Casarão (V)
  3. `portfolio-03.webp` Eduarda · 15 anos (V)
  4. `portfolio-04.webp` Linda & Fábio · Palladium (H)
  5. `portfolio-05.webp` Amanda & Rodrigo · Spazzio 420 (V)
  6. `portfolio-06.webp` Karen & Patrick · Paróquia São Benedito (V)
  7. `portfolio-07.webp` Teka & Filipe · Casamento (V)
  8. `portfolio-08.webp` Tainá & Marcele · Mini wedding (H)
  9. `portfolio-09.webp` Tayrine & Hugo · Casa Bougainville (V)
  10. `portfolio-10.webp` Juliana & Pedro · Iris Supreme (H)
- Último item: "Mais histórias *no Instagram.*" com o botão "VER MAIS CELEBRAÇÕES ↗", que leva ao Instagram.
- Clicar numa foto abre um **lightbox** escuro, com a imagem inteira, nome, local, contador "03 / 10", setas, teclado (←/→/Esc) e swipe.
- Prepare cada item para ter opcionalmente um link "Ver história completa" (futuras páginas de evento).

### 10. Momento cinematográfico
Foto `momento.webp` em tela cheia (92svh) com parallax e véu radial escuro. Texto centralizado em Cormorant: "Os detalhes passam." e, em itálico sand, "*A sensação de ter vivido aquele momento fica.*" (linhas sobem ao entrar).

### 11. Depoimentos (`#depoimentos`)
- H2 "Depois da festa, *ficam as histórias.*" com setas ← → à direita.
- **Carrossel automático**: avança a cada 6.5s com uma barra de progresso champagne embaixo. Pausa no hover ou no toque e retoma depois. Dá para arrastar com o mouse ou deslizar no celular (scroll-snap). Mostra 2,5 cards no desktop e 1 no mobile.
- Cada card tem fundo off e borda fina. Os que têm frase literal mostram aspas grandes champagne, a frase em Cormorant e, abaixo, "DESTAQUES DA AVALIAÇÃO" com o resumo. No rodapé: avatar redondo graphite com a inicial em itálico, nome em caixa alta, "Avaliação no Google" e ★★★★★ champagne.
  1. Louise Favilla: “Um dos melhores acertos do nosso casamento!!!” Destaques: Planejamento à distância, dedicação, profissionalismo e uma equipe que fez até as ideias mais diferentes acontecerem.
  2. Karyna Emilia: “O trabalho da Rebecca é perfeito.” Destaques: Atenção aos detalhes, organização do cronograma e indicação de profissionais de confiança.
  3. Larissa Lari: “A melhor cerimonialista do mundo — e sua equipe também!” Destaques: Atendimento, atenção e execução impecável do evento.
  4. Vanessa Santanna: SEM aspas, com o label "RESUMO DA AVALIAÇÃO" e o texto em itálico brown: Contratou a assessoria completa: a equipe superou as expectativas na organização e na coordenação dos fornecedores, e no dia ela pôde simplesmente aproveitar o casamento.
  5. I.B.: “Nossa fada madrinha.” Destaques: Confiança, apoio durante todo o planejamento e soluções para cada imprevisto.
  6. Q.S.: “Uma realizadora de sonhos.” Destaques: Atenção aos detalhes, paciência e um evento adaptado ao estilo do casal.
  7. A.N.: SEM aspas, "RESUMO DA AVALIAÇÃO": Não precisou se preocupar com nada: a Rebecca cuidou da relação com fornecedores, convidados e casa de festas.

### 12. Faixa de autoridade (fundo graphite, 4 colunas no desktop e 2 no mobile)
Números grandes em Cormorant que contam de 0 até o valor ao entrar na tela, separados por linhas finas:
- **5,0★** · NO GOOGLE · 79 avaliações
- **5,0★** · CASAMENTOS.COM.BR · 15 avaliações
- **100%** · DE RECOMENDAÇÃO · Casamentos.com.br
- **2022** · CASAMENTOS AWARDS* · Casamentos.com.br

Nota: "*Informação fornecida pela empresa, a confirmar antes da publicação."

### 13. Instagram (`#instagram`)
- Eyebrow "@cerimonialistarebeccagemaque". H2 "Momentos, bastidores *e histórias reais.*" Botão "ACOMPANHE NO INSTAGRAM ↗".
- **Duas faixas de fotos em rotação automática contínua e infinita**: a de cima para a esquerda, a de baixo para a direita (mais lenta).
  - O usuário pode **segurar e arrastar** (mouse ou dedo), com inércia ao soltar, e depois a faixa volta à velocidade normal.
  - No mouse, desacelera até parar no hover.
  - No celular, o arraste horizontal não pode bloquear a rolagem vertical da página (`touch-action: pan-y` e detecção da direção).
  - Altura das fotos: clamp(180px, 26vw, 320px), cantos com 3px de raio.
  - Faixa 1: detalhe-01 (vertical), 02, 05, 06, 09, 10.
  - Faixa 2: detalhe-12, 04, 08, 11, 03, 07.

### 14. FAQ (`#faq`), fundo off
Título sticky à esquerda: "Antes de *começarmos…*" e "Não encontrou sua dúvida? Fale com a equipe" (link para o WhatsApp). Accordion com abertura suave, "+" champagne que vira "−" e linhas finas:
- **Com quanto tempo de antecedência devo contratar a assessoria?** Depende do tipo, do porte e da data do seu evento. De modo geral, começar cedo amplia as opções de datas e fornecedores. Conte para a equipe quando e como você imagina a celebração, e indicaremos o melhor momento para iniciar.
- **Qual a diferença entre assessoria completa, parcial e final?** (as três descrições da seção Assessoria)
- **Vocês atendem eventos fora do Rio de Janeiro?** Nossa base é o Rio de Janeiro e a Grande Rio. Para eventos em outras cidades ou destinos, fale com a equipe informando o local e a data, e avaliamos a disponibilidade para o seu caso.
- **Vocês ajudam na escolha de fornecedores?** A organização de fornecedores faz parte do planejamento. O nível de envolvimento em cada escolha varia de acordo com a modalidade contratada. Na primeira conversa explicamos como funciona para o seu evento.
- **Vocês trabalham com destination wedding?** Sim, destination weddings estão entre as experiências que acompanhamos. Como cada destino tem sua própria logística, as condições são conversadas caso a caso com a equipe.
- **Existe limite de convidados?** Acompanhamos desde elopements e mini weddings até grandes celebrações. Informe o número aproximado de convidados no formulário para que a equipe possa orientar você sobre a estrutura ideal.
- **Como funciona a primeira conversa?** Tudo começa entendendo sua história, seu evento e aquilo que realmente importa para você. Preencha o formulário abaixo ou chame no WhatsApp, e a equipe entra em contato para combinar esse primeiro encontro.

### 15. CTA final (fundo ink com `cta.webp` a 50% de opacidade e parallax)
Centralizado: eyebrow "O PRIMEIRO PASSO", H2 enorme "O seu evento começa *muito antes do grande dia.*", "*E talvez ele possa começar aqui.*" em itálico sand e o botão claro "QUERO CONTAR MINHA HISTÓRIA →" (leva a `#proposta`).

### 16. Contato + formulário (`#contato`, o formulário tem id `proposta`)
- **À esquerda:**
  - H2 "Vamos conversar sobre o evento que você está *imaginando?*"
  - "Conte um pouco sobre a sua celebração. A equipe responde pessoalmente."
  - WhatsApp (21) 99981-1992, E-mail gemaque.cerimonial@outlook.com e Instagram @cerimonialistarebeccagemaque, com o label pequeno e o valor em Cormorant.
  - Endereço discreto: "Rebecca Gemaque Assessoria e Cerimonial · Rio de Janeiro e Grande Rio — RJ · Rua José Roberto, 17 · Higienópolis · CEP 21050-490".
- **À direita:** formulário num painel off com sombra suave. Campos com linha inferior apenas e labels em caixa alta pequena:
  - Nome*, WhatsApp* (máscara (21) 90000-0000), E-mail*
  - Tipo de evento* (select: Casamento, Mini / micro wedding, Destination wedding, Elopement wedding, 15 anos, Bodas / renovação de votos, Noivado, Aniversário, Evento corporativo, Outro)
  - Data prevista (texto livre, ex.: "12/10/2027 ou out/2027"), Local do evento, Nº aproximado de convidados
  - Modalidade de interesse: pílulas Completa / Parcial / Final / Ainda não sei (padrão)
  - Textarea "Conte um pouco sobre o evento que você está imaginando."
  - Campo honeypot anti-spam escondido
  - Consentimento com link para a Política de Privacidade
  - Botão "QUERO PLANEJAR MEU EVENTO →"
- Validação com mensagens amigáveis em português.
- **Ao enviar:** troca o formulário por um painel "OBRIGADA · Sua história *começou a ser contada.*" com o botão "CONTINUAR NO WHATSAPP →". O link é `https://wa.me/5521999811992?text=` com a mensagem montada: "Olá, Rebecca! Meu nome é {nome}. / Tipo de evento / Data prevista / Local / Convidados / Modalidade de interesse / Sobre o evento / Contato: {whatsapp} · {email}".
- Deixe uma constante `FORM_ENDPOINT` opcional: se preenchida, faz um POST em JSON antes de mostrar o painel.
- Dispare `dataLayer.push({event:'generate_lead'})`.

### 17. Rodapé (fundo ink)
- Frase "Enquanto cuidamos de cada detalhe, *você vive cada momento.*" (itálico champagne) com o botão "SOLICITAR PROPOSTA".
- Links: Sobre, Assessoria, Portfólio, Depoimentos, Contato | Instagram, WhatsApp, Casamentos.com.br, E-mail.
- Letreiro gigante "REBECCA GEMAQUE" em Cormorant 300, caixa alta, ocupando a largura, com as letras subindo ao entrar.
- "© {ano atual} Rebecca Gemaque Assessoria e Cerimonial · Rio de Janeiro — RJ" e o link "Política de Privacidade" (crie a rota `/politica-de-privacidade` com um texto simples de LGPD).

## Animações de rolagem (GSAP)
- Títulos marcados: as linhas sobem de uma máscara (SplitText lines + mask) com stagger ao entrar na tela (uma vez).
- Blocos de texto: fade + translateY 40px, com ScrollTrigger.batch.
- Imagens: revelação em cortina de baixo para cima (`clip-path inset(100% 0 0 0)` → 0) com a imagem desfazendo um zoom de 1.3.
- Parallax sutil (±6%) nas fotos marcadas.
- Tudo com ease "expo.out" ou "power3.out", sem exagero. O luxo vem da composição e do ritmo.

## Links e dados
- WhatsApp: https://wa.me/5521999811992
- Instagram: https://www.instagram.com/cerimonialistarebeccagemaque/
- Casamentos.com.br: https://www.casamentos.com.br/cerimonialista/rebecca-gemaque-assessoria-e-cerimonial--e228552
- Todos os links externos com `target="_blank" rel="noopener noreferrer"`.
- SEO: título "Rebecca Gemaque | Assessoria e Cerimonial no Rio de Janeiro", meta description, Open Graph e JSON-LD `ProfessionalService` com `aggregateRating` 5.0 / 79.

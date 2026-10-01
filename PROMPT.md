# Prompt — Site Graal Marcenaria

Crie um site institucional de página única (one-page) para a **Graal Marcenaria**, uma marcenaria de móveis planejados e sob medida no Rio de Janeiro. Use HTML, CSS e JavaScript puros, sem frameworks e sem etapa de build, prontos para hospedagem estática. Todo o texto deve estar em português do Brasil.

## Dados da empresa

- **Nome:** Graal Marcenaria
- **Segmento:** marcenaria, móveis planejados e sob medida
- **Endereço:** Rua Maria Luíza Pitanga, 45, Loja E — Joá, Rio de Janeiro – RJ, CEP 22611-190 (próximo à Ponte da Joatinga)
- **WhatsApp/telefone:** (21) 99868-0606 → `https://wa.me/5521998680606`
- **Google:** nota 5,0 com 49 avaliações
- **Horário:** seg a sex 9h–21h · sábado 10h–16h · domingo fechado
- **Ambientes atendidos:** cozinhas, closets e armários, quartos, salas, painéis, banheiros, home office, móveis sob medida

## Estilo

Sofisticado, minimalista e arquitetônico. Fotografias grandes, muito espaço em branco, tons naturais de madeira, tipografia elegante e animações discretas.

- **Cores:** papel `#f6f3ee`, branco quente `#fcfbf8`, linho `#ebe5dc`, carvão `#1d1b18`, cinza-texto `#6f685f`, madeira `#9a6a3f`, carvalho `#c9a77f`.
- **Fontes (Google Fonts):** *Instrument Serif* para títulos, com palavras de destaque em itálico na cor madeira, e *Manrope* para textos. Rótulos de seção em caixa alta, espaçados, com um pequeno quadrado na cor madeira antes do texto.
- **Detalhes:** linhas finas de 1px como divisórias, botões retos (sem arredondamento) com preenchimento que desliza ao passar o mouse, easing `cubic-bezier(.22,1,.36,1)`.
- **Logo:** a palavra "GRAAL" em caixa alta bem espaçada, com "MARCENARIA" pequeno embaixo, e um ícone em traço que lembra a planta de um armário (um quadrado com divisões internas).

## Estrutura (em ordem)

1. **Intro / carregamento:** fundo carvão. O ícone do logo se desenha em traço dourado, "GRAAL" sobe letra por letra e aparece "Marcenaria sob medida" em itálico. Embaixo, um contador de 0 a 100% com barra de progresso, que só chega a 100 quando a foto da capa carregou. Para sair, a tela se abre como **duas portas de armário** (com textura sutil de veio de madeira e puxadores) e a foto da capa entra com um zoom suave.
2. **Cabeçalho fixo:** transparente sobre a capa e com fundo claro desfocado ao rolar; some ao rolar para baixo e volta ao rolar para cima. Links: Projetos, Ambientes, Sobre, Processo, Avaliações, Contato, mais um botão "Orçamento" (WhatsApp). No celular, menu hambúrguer em tela cheia com os links numerados.
3. **Início (hero):** tela cheia com 3 fotos que se alternam com efeito Ken Burns, linhas verticais finas de grade sobre a imagem e o título grande "Móveis feitos para o *seu* espaço.". Subtítulo: "Projetos planejados que unem desenho, madeira e precisão — do primeiro esboço à montagem final." Botões "Solicite seu orçamento" (WhatsApp) e "Ver projetos". Selo "5,0 ★★★★★ 49 avaliações no Google" e contador de slides "01 / 03".
4. **Manifesto:** frase grande em serifa ("Cada centímetro pensado. Cada encaixe, preciso. Criamos *mobiliário sob medida*…") e três números: 5,0 (nota no Google), 49 (avaliações) e 100% (projetos personalizados), com contagem animada.
5. **Projetos:** portfólio em mosaico (blocos largos, altos e normais), com filtros Todos / Cozinhas / Salas / Quartos / Closets / Banheiros. Ao passar o mouse aparecem o nome e a categoria; ao clicar, a foto amplia, com navegação por setas, teclado e deslize.
6. **Ambientes:** lista grande e numerada (01–08) com o nome do ambiente em serifa e uma descrição curta. No desktop, uma foto do ambiente acompanha o cursor. Cada item abre o WhatsApp com a mensagem "Olá! Gostaria de um orçamento para [AMBIENTE]."
7. **Faixa de imagem:** foto de oficina/ferramentas em parallax com a frase "Feito à mão, *pensado para durar.*"
8. **Sobre:** foto de marceneiro trabalhando a madeira e o texto "Ofício, desenho *e cuidado.*", com três valores: Sob medida, Acabamento e Atendimento.
9. **Processo (fundo escuro):** título fixo à esquerda com foto de projetista desenhando, e 5 etapas à direita: Conversa & briefing → Medição no local → Projeto & orçamento → Produção → Montagem & entrega.
10. **Avaliações:** título "Quem fez, *recomenda.*" com um selo do Google (logo G, 5,0, estrelas, "49 avaliações no Google", link para o perfil). **Carrossel giratório** de cartões de avaliação (3 por vez no desktop, 2 no tablet, 1 no celular), com estrelas, texto, avatar com a inicial, nome e "Avaliação no Google · há X tempo". Troca automática a cada 6s com barra de progresso, setas redondas, bolinhas, arrastar/deslizar, pausa ao passar o mouse, e só começa quando a seção aparece na tela. **Use apenas avaliações reais do Google**, guardadas em um array `AVALIACOES` no JS; itens sem texto aparecem como espaço reservado tracejado.
11. **Contato & orçamento:** "Vamos desenhar *o seu projeto?*", com WhatsApp, endereço e horário à esquerda e um formulário à direita (Nome*, Ambiente*, Bairro, Prazo, Detalhes, com rótulos flutuantes). Ao enviar, o formulário abre o WhatsApp com a mensagem formatada:
    ```
    Olá, Graal Marcenaria! Meu nome é {nome}.
    Gostaria de um orçamento:

    • Ambiente: …
    • Bairro: …
    • Prazo: …
    • Detalhes: …
    ```
12. **Mapa:** **não use iframe do Google Maps**, porque ele aparece em branco em vários ambientes. Use uma imagem estática local do OpenStreetMap (região Joá/Barrinha, zoom 17, tons de papel/sépia), com um pin escuro com o ícone da Graal que cai com animação e pulsa, e a etiqueta "Graal Marcenaria". Por cima vai um cartão branco "Nossa loja" com endereço, horários e os botões **Google Maps** e **Waze**. Clicar no mapa abre o Google Maps. Inclua o crédito "© OpenStreetMap".
13. **Rodapé:** "GRAAL" gigante, colunas Navegue / Visite / Fale e "Topo ↑".
14. **Botões flutuantes no canto inferior direito**, aparecendo após rolar a página: um **botão redondo de mapa** (escuro, abre a rota no Google Maps, com a dica "Como chegar" ao passar o mouse) e, abaixo dele, o botão redondo verde do **WhatsApp** com um anel pulsante.

## Comportamento e qualidade

- As seções revelam o conteúdo ao rolar: textos sobem com fade e fotos são reveladas por uma "cortina" com a imagem desfazendo um zoom. Use `IntersectionObserver` e não use `clip-path` no próprio elemento observado.
- O link ativo do menu acompanha a seção visível.
- Responsivo, sem rolagem horizontal, testado em 390px e 1440px.
- Respeite `prefers-reduced-motion`.
- Acessibilidade: textos alternativos nas fotos, `aria-label` nos botões de ícone, foco visível, Esc fecha o menu e a galeria.
- SEO: `title` e `meta description`, Open Graph e JSON-LD `HomeAndConstructionBusiness` com endereço, telefone, horário e `aggregateRating` (5.0 / 49).
- Todos os links de WhatsApp são gerados a partir de uma constante `WHATSAPP = "5521998680606"`.

## Arquivos

```
index.html
assets/css/style.css
assets/js/main.js
assets/img/  (hero-1..3, proj-*, amb-*, artesanal, oficina, proc-projeto, mapa.jpg, favicon.svg)
```

## Fotos

Prefira as fotos reais dos projetos da Graal. Enquanto não houver, use fotos livres do Unsplash de interiores com madeira (cozinhas com ilha, painéis ripados, closets, gabinetes de banheiro suspensos, quartos, marceneiro trabalhando, ferramentas na parede, projetista desenhando).

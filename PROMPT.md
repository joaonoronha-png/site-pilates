# Prompt — Site da Argento Escoramentos

Use este prompt para recriar, continuar ou ajustar o site em outra ferramenta (Claude, ChatGPT, Lovable, Cursor, v0 etc.). Ele descreve o site **exatamente como está** neste pacote. Se a ferramenta aceitar arquivos, envie junto o `.zip` com o código.

---

## Prompt

Crie um site institucional de uma página para a **Argento Escoramentos**, empresa do Rio de Janeiro especializada em **escoramento metálico para estruturas de concreto**: escoras reguláveis, torres de escoramento, vigas, forcados, projeto de escoramento, entrega, apoio à montagem e retirada. Atende edifícios, obras públicas, indústria e infraestrutura (viadutos, pontes e recuperação estrutural). Todo o texto é em **português do Brasil**.

**Tecnologia:** HTML + CSS + JavaScript puro, sem framework e sem etapa de build. Arquivos: `index.html`, `assets/css/style.css`, `assets/js/config.js` (dados de contato), `assets/js/data.js` (obras, perguntas do bot), `assets/js/main.js` (interações), `assets/js/bot.js` (assistente). Única biblioteca externa: **Leaflet 1.9.4** (unpkg). Fontes do Google: **Archivo** (eixo de largura `wdth`, usado nos títulos condensados) e **JetBrains Mono** (rótulos técnicos). Deve funcionar abrindo o `index.html` direto e no GitHub Pages.

### Identidade visual
- **Logo:** hexágono amarelo com o ícone de um **forcado** (cabeçal em "U" de escora) em traço azul-petróleo, e ao lado "ARGENTO" com uma barra e "escoramentos" embaixo. Está em SVG em `assets/img/logo.svg` e `logo-full.svg`.
- **Cores:** fundo escuro `#0b2229` (ink), azul-petróleo `#164b57` / `#1f6272`, amarelo `#fee45b` (destaques e botões principais), papel `#f4f2ec` e areia `#e9e5db` nas seções claras.
- **Tipografia:** títulos grandes, pesados e condensados (Archivo 800–900, largura ~80–90). Rótulos em monoespaçada, em caixa alta, com espaçamento entre letras.
- **Motivos gráficos:** hexágonos (selos, marcadores do mapa, avatares), grade de "planta técnica" ao fundo, linhas amarelas.
- As seções alternam fundo claro e escuro. O site precisa funcionar bem no celular, sem rolagem horizontal, e respeitar `prefers-reduced-motion`.

### Estrutura, de cima para baixo
1. **Intro animada com botão "Pular intro →"** (também pula com Esc ou Enter). Fundo escuro com grade em movimento; o hexágono do logo se desenha, o forcado se monta peça por peça, as letras de "ARGENTO" sobem, aparecem a barra amarela e "escoramentos", a frase "Sustentamos a estrutura. Você constrói o futuro." e um contador de 0 a 100% "carregando estrutura". Duas placas fecham a tela e se abrem revelando o site.
2. **Topo fixo** com o logo e os links Soluções, Como funciona, Obras, Processo, Dúvidas e Contato, mais o botão amarelo "Solicitar orçamento". O topo fica **sempre parado**: não some ao rolar. No celular o fundo é sólido, sem desfoque, para a rolagem não engasgar. Barra fina amarela de progresso da leitura no alto da página.
3. **Menu do celular** (botão ☰): lista compacta em cartões, cada um com ícone amarelo e seta (Soluções, Como funciona, Obras, Processo, Dúvidas, Contato). O item da seção atual fica destacado. No rodapé do menu: botões "Fazer orçamento" e "WhatsApp" e o contato da gestora comercial.
4. **Capa (hero):** rótulo "Escoramento metálico · Engenharia · Obras de concreto"; título "Sustentamos a **estrutura.**" com "Você constrói o futuro." em fonte fina; texto curto; botões "Simular meu orçamento →" e "Ver obras realizadas"; atalho em pílula "★ Obra em destaque · Hospital Barra D'Or · Barra da Tijuca". À direita, três fotos de obras em estilo polaroide que se mexem com o mouse, um selo "Projeto · Entrega · Montagem · Retirada" e o desenho de uma torre de escoramento ao fundo. **Sem números/estatísticas na capa.**
5. **Faixa amarela rolando** com os nomes das obras (a primeira é ★ Hospital Barra D'Or).
6. **01 — Soluções:** **carrossel lateral** (arrastar para o lado, com setas e marcadores) de 6 cartões iguais em que a **foto real ocupa o cartão inteiro**, com um degradê escuro embaixo e, por cima, o selo hexagonal amarelo com a letra, o título e o texto em branco. Ordem: A Escoramento de lajes · B Torres de escoramento · C Projeto de escoramento (cita a ABNT NBR 15696) · D Vigas e pilares · E Infraestrutura & recuperação estrutural · F Logística, montagem e retirada (com o link "Ver o processo →" em amarelo). Desktop mostra 3 por vez, tablet 2 e celular ~1,2.
7. **02 — Raio-X do escoramento:** faixa escura com o título "Entenda, peça por peça, o que segura uma laje.", uma frase curta e o botão amarelo **"Ver o raio-X →"**. O botão abre uma **tela própria** (como a do orçamento) com o diagrama SVG interativo de uma laje escorada que **se monta ao abrir** (escoras sobem, depois forcados, vigas, barrotes e a laje) e 7 pontos numerados clicáveis (laje, barrotes, vigas, forcado, escora, contraventamento, base). Cada ponto destaca a peça e mostra num painel a explicação e uma dica técnica, com setas e marcadores.
8. **03 — Obras:**
   - Bloco "★ Obra em destaque" do **Hospital Barra D'Or** (Barra da Tijuca, RJ, segmento Saúde): texto, três pontos (cargas elevadas, entreforros técnicos, cronograma sem folga) e o botão "Ver no mapa". A imagem é uma **vista aérea por satélite** do prédio, com contorno amarelo e crédito "Esri, Maxar". Quando houver fotos reais em `DESTAQUE.fotos`, o bloco vira uma galeria.
   - Galeria em mosaico com **filtro por estado** (Todas, RJ, MG, MT, DF). Cada obra abre um **lightbox** com setas, teclado, deslizar no celular e miniaturas.
   - Obras: FAETEC (RJ), Tribunal de Justiça (MG), Residencial Epic Tower (Sorriso/MT), Escola Técnica Paranoá (DF), SESC Rio das Ostras (RJ), SESC Itaperuna (RJ), Recuperação Estrutural de Viaduto (RJ), Escola Saquarema (RJ) e Centro de Convenções (RJ).
9. **04 — Processo:** "Seis etapas. Zero improviso." Linha do tempo vertical cuja linha amarela se preenche com a rolagem: conversa e levantamento → projeto de escoramento → proposta clara → entrega programada → montagem e acompanhamento → desforma e retirada. Abaixo, quatro pilares: Segurança normativa (NBR 15696, NR-18, NR-35), Ritmo da obra, Engenharia de verdade e Gente que atende.
10. **05 — Orçamento:** faixa escura só com "Venha fazer seu **orçamento.**" e um botão grande "Fazer meu orçamento →". O botão abre uma **tela própria de orçamento** (janela por cima do site, tela cheia no celular) com:
    - tipo de obra (opções clicáveis);
    - o que vai ser escorado (múltipla escolha);
    - controles deslizantes de área por concretagem (m²) e pé-direito (m);
    - cidade/UF, previsão de início, nome, empresa e "já tenho projeto";
    - estimativa preliminar de peças: escoras ≈ área÷1,8 a área÷1,0; se o pé-direito passar de 4,5 m, módulos de torre ≈ área÷4 a área÷2,25.

    Envio pelo WhatsApp com a mensagem pronta (e link de reserva caso o WhatsApp não abra sozinho) ou por e-mail. Todos os links "#orcamento" do site abrem essa tela.
11. **06 — Dúvidas:** faixa clara só com "Ficou com **alguma dúvida?**", a frase "Nosso atendente virtual responde na hora, a qualquer momento." e um botão **"Falar com o nosso atendente virtual →"** que abre o assistente.
12. **07 — Contato + mapa interativo:**
    - Cartão em destaque da **Bibiana Lemos Mendes Vassallo — Gestora Comercial — (21) 99973-2284**, com botões WhatsApp e Ligar. Cartões de e-mail e endereço com horário.
    - **Mapa Leaflet somente em satélite** (Esri World Imagery + rótulos World_Boundaries_and_Places + ruas World_Transportation a partir do zoom 12), zoom até 18. Filtros Sede, Obras e Ver tudo.
    - Marcadores hexagonais amarelos: a sede com o logo, cada obra com a sigla do estado e o Barra D'Or com ★.
    - Balões com foto, nome e os botões "Ver galeria", **"Ver de perto"** (voa até o local no zoom 17) e **"Como chegar"**. Obras sem endereço público confirmado são marcadas `aprox: true` em `data.js`: o pino fica no centro da cidade, o balão mostra "Localização aproximada (cidade)" e só tem "Ver galeria".
    - Localizações confirmadas: Hospital Barra D'Or (`-22.98446, -43.36282`, ao lado do Via Parque) e Escola Técnica do Paranoá (`-15.7808, -47.7849`, ao lado do Estádio JK). As demais são aproximadas.
    - Botão amarelo "Como chegar ↗" no canto do mapa.
13. **Rodapé** com logo, links, contato da gestora, WhatsApp e endereço.

### Elementos fixos na tela
- **Três botões redondos** empilhados no canto inferior direito:
  1. **Mapa** (azul-petróleo): rola até o mapa, aproxima na **sede** e abre o balão dela.
  2. **WhatsApp** (verde): abre a conversa com "Olá, Bibiana! Vim pelo site da Argento Escoramentos e gostaria de mais informações."
  3. **Assistente** (amarelo): abre o chatbot e vira "X" quando aberto. Com o bot aberto, os botões de mapa e WhatsApp somem. Os três também somem com o menu do celular aberto.
- **"Como chegar"** (balões do mapa e botão do mapa): abre uma janela com o nome do local e 4 opções, **Uber, Mapas do iPhone, Waze e Google Maps**, cada uma com a rota até aquele local. No celular a janela sobe de baixo da tela.
- **Assistente virtual (chatbot) "Assistente Argento"**, que funciona 100% no navegador, sem API:
  - Base de ~35 assuntos em `data.js`: o que é escoramento, diferença para fôrma e andaime, metálico × madeira, equipamentos, torres, capacidade de carga, espaçamento, laje nervurada, viadutos e recuperação, projeto e ART, normas (NBR 15696, NR-18, NR-35, NBR 6118), segurança, inspeção, desforma, reescoramento, orçamento, o que enviar, aluguel, prazo de locação, frete, montagem, documentos, pagamento, devolução, avarias, obras públicas, urgência, visita técnica, sustentabilidade, chuva, regiões, obras, Hospital Barra D'Or, endereço, contato, horário, trabalhe conosco e referências de clientes, além de saudações e agradecimentos.
  - Entende texto sem acento, abreviações ("vcs", "pra") e apóstrofos ("Barra D'Or"). A pontuação usa palavras-chave e frases, com radical para plurais e conjugações.
  - Sugere próximos assuntos em botões. Tem um **fluxo de orçamento guiado** (7 perguntas) que monta a mensagem para o WhatsApp.
  - Quando não entende, oferece sugestões e o WhatsApp. Guarda a conversa na sessão e mostra um balão de boas-vindas uma vez por sessão.

### Dados (editáveis em `assets/js/config.js`)
- WhatsApp e telefone: **(21) 99973-2284** (`5521999732284`).
- Contato: **Bibiana Lemos Mendes Vassallo**, **Gestora Comercial**.
- Pendentes (provisórios): **e-mail** (`contato@argentoescoramentos.com.br`), **endereço da sede** e coordenadas do pino (hoje no centro do Rio), **horário** (Seg. a sex., 8h às 18h · Sáb., 8h às 12h).
- Hospital Barra D'Or (unidade nova, ao lado do Via Parque): coordenadas `-22.98446, -43.36282`.

### Regras de conteúdo
- Não inventar números da empresa (anos, obras, clientes). Não usar fotos de terceiros sem licença.
- A seção de avaliações foi removida. Se voltar, usar só depoimentos reais de clientes, com autorização; nunca textos inventados.

---

## Pendências antes de publicar
1. Endereço real da sede (atualiza contato, rodapé, bot, pino do mapa, botão redondo de mapa e "Como chegar").
2. E-mail real e horário de atendimento.
3. Endereços das obras sem localização confirmada (FAETEC, TJ-MG, Epic Tower, SESC Rio das Ostras, SESC Itaperuna, viaduto, escola de Saquarema e centro de convenções), para tirar o "aproximada" dos pinos.
4. Fotos reais do Hospital Barra D'Or (de preferência a fachada e o escoramento durante a obra), para trocar a vista aérea.
5. Fotos originais das obras em alta resolução, se existirem (as atuais vieram do Canva, com ~700 px).

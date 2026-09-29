# Prompt — Site R1 Centro de Estética Automotiva

Use este prompt para recriar, editar ou evoluir o site (em outra IA, com um desenvolvedor ou numa nova conversa). Ele descreve o site **exatamente como foi entregue**, com todas as informações já confirmadas.

---

## PROMPT

Crie um site de uma página (HTML + CSS + JS puro, sem framework), extremamente moderno, tecnológico e premium, para a empresa **R1 Centro de Estética Automotiva**. O site não pode parecer um lava-jato genérico: deve parecer uma estética automotiva especializada, com visual de carro premium, performance e precisão. Foco: **FOTOS + SERVIÇOS + CONFIANÇA + WHATSAPP**.

### Informações confirmadas (usar exatamente assim)

- **Nome:** R1 Centro de Estética Automotiva
- **Endereço:** Estrada do Cabuçu, 471, Loja C — Campo Grande, Rio de Janeiro/RJ — CEP 23052-230
- **Coordenadas:** -22.9073778, -43.5528746
- **Google Place ID:** ChIJv-fsUDrhmwARVOgA3B7kG3Y
- **WhatsApp / telefone:** (21) 97123-2300 → https://wa.me/5521971232300
- **E-mail:** r1.eautomotiva@gmail.com
- **Instagram:** @r1estetica — https://www.instagram.com/r1estetica/
- **Facebook:** https://www.facebook.com/R1cesteticaautomotiva/
- **Avaliação Google:** 4,9 ★ — 73 avaliações
- **Horário:** segunda a sexta 08:00–17:00 · sábado 08:00–14:00 · domingo fechado
- **Mensagem automática do WhatsApp:** "Olá! Encontrei a R1 Centro de Estética Automotiva pelo site e gostaria de solicitar um orçamento."
- **Preços:** não há tabela pública → sempre "Consulte o valor pelo WhatsApp". Nunca inventar preços.

### Regra fundamental

Não inventar informações, serviços, preços, números, depoimentos ou fotos. Usar somente fotos reais publicadas pela R1. Se não houver confirmação, não publicar como fato.

### Identidade visual

- Cores: preto `#0a0b0d`, grafite `#111317` / `#181b20`, branco `#f2f3f5`, cinza metálico (gradiente branco → `#8d939c`), destaque vermelho `#e10600` usado com moderação.
- Fontes (Google Fonts): **Archivo** (títulos, peso 800–900, largo), **Inter** (texto), **JetBrains Mono** (rótulos técnicos / HUD).
- Elementos tecnológicos discretos: grid de fundo, cantos de HUD nas fotos, linha de scanner, retícula, rótulos em mono (`// 01 — SEÇÃO`), coordenadas, indicador "REC", barra de carregamento.
- Microinterações: animações de entrada ao rolar (reveal), parallax suave, hover com zoom nas fotos, linha vermelha que cresce no hover, botões com brilho deslizante.
- Respeitar `prefers-reduced-motion`.

### Estrutura (em ordem)

1. **Intro (1× por sessão, pulável):** tela preta com grid, HUD nos cantos (`SYS://R1-DETAIL`, coordenadas 22°54′27″S 43°33′10″W, `CAMPO GRANDE · RJ`), logs que mudam ("INICIANDO SISTEMA", "ANALISANDO PINTURA", "CALIBRANDO BRILHO", "APLICANDO PROTEÇÃO", "PRONTO"), anel giratório, logo **R1** em itálico, "ESTÉTICA AUTOMOTIVA" letra a letra e barra de 0–100%. Acima do logo: **foto real de uma BMW M5 preta, de frente (fundo removido), com os faróis de LED em "L" acendendo e apagando** (padrão de lampejo: apaga 0,5s → acende 0,55s → apaga 0,16s → acende 0,95s → apaga 0,4s, repetindo; acende rápido e apaga com leve decaimento), reflexo no chão, brilho azulado e reflexo horizontal de lente. Placa do carro com "R1". Duração ≈ 4,5s; sai abrindo em dois painéis com um flash vermelho.
2. **Menu fixo:** logo R1 + "Centro de Estética Automotiva"; links Serviços, Trabalhos, Resultados, Avaliações, Como funciona, Localização; botão vermelho "Orçamento"; menu hambúrguer no celular.
3. **Hero:** foto real do polimento de um Toyota Corolla como fundo (escurecida, com parallax). Título **"SEU CARRO MERECE MAIS."** (segunda parte vazada/outline), subtítulo "Estética automotiva, cuidado e acabamento em cada detalhe.", botões **SOLICITAR ORÇAMENTO** (WhatsApp) e **VER NOSSOS TRABALHOS**. Mini-indicadores: 4,9 ★, 73 avaliações, status "Aberto agora / Fechado · abre…" calculado no fuso de Brasília. À direita (desktop), foto real de instalação de PPF num quadro HUD com inclinação 3D ao mover o mouse.
4. **Impacto:** **"CADA DETALHE IMPORTA."** + texto curto sobre cuidar do veículo e entregar acabamento de alto nível. Faixa rolando com os serviços.
5. **Números:** 4,9 ★★★★★ (avaliação dos clientes) · +70 (73 avaliações no Google) · CAMPO GRANDE (Rio de Janeiro · Zona Oeste). Nenhum outro número.
6. **Serviços — título "Alguns de nossos serviços."** (rótulo: "// 02 — Serviços · Estética automotiva em Campo Grande, RJ"). **Somente listagem, sem imagens nem ícones**: lista numerada em 2 colunas (1 no celular), cada item com número, nome, descrição curta e link "Solicitar orçamento →" que abre o WhatsApp com mensagem citando o serviço:
   1. Polimento — restaura o brilho e a profundidade da pintura, com isolamento de borrachas e frisos.
   2. Vitrificação de pintura — camada de proteção que preserva brilho e cor; a R1 trabalha com produtos Nasiol.
   3. PPF — Paint Protection Film, filme transparente contra riscos, impactos e desgaste.
   4. Insulfilm e películas — inclui nano cerâmica Window Blue e nano carbono.
   5. Envelopamento
   6. Higienização — bancos, teto e carpetes, removendo sujeira e mau cheiro.
   7. Limpeza de motor
   8. Martelinho de ouro — amassados leves sem precisar de pintura.
   9. Pintura — citada por clientes nas avaliações do Google.
   10. Lavagem
   Abaixo: "PREÇOS — Consulte o valor pelo WhatsApp — o orçamento depende do veículo e do serviço."
7. **Nossos trabalhos (portfólio):** galeria premium com cards de tamanhos diferentes, zoom no hover, lightbox em tela cheia (setas, teclado, swipe) e filtros (Todos, Proteção, Películas, Polimento, A loja). Fotos reais: Toyota Corolla (polimento, grande), PPF (vertical), Nissan Kicks (película, vertical), BMW X1 (vitrificação, vertical), Equipe R1 polindo na loja (grande), película no vidro traseiro (vertical), fachada da loja (largura total). Nota: "Fotos publicadas pela própria R1 · mais trabalhos no Instagram @r1estetica".
8. **Resultados R1** (não há fotos reais de antes/depois, então não criar comparação falsa): vitrine com uma foto grande em quadro HUD + seletor com 3 trabalhos — Toyota Corolla (Polimento), BMW X1 (Vitrificação de pintura), Nissan Kicks (Insulfilm / película). Texto: "Ainda não publicamos fotos de antes e depois. Quando houver, esta seção mostrará a comparação lado a lado."
9. **Avaliações:** 4,9 gigante + "+70 avaliações. Clientes satisfeitos." + link "Ver as 73 avaliações no Google" (https://search.google.com/local/reviews?placeid=ChIJv-fsUDrhmwARVOgA3B7kG3Y). Carrossel contínuo e arrastável com avaliações reais do Google (texto verdadeiro, nome abreviado):
   - **Rodrigo M.** (Pintura): "Serviço impecável! Fiz a pintura completa do meu carro e o resultado superou todas as expectativas. O acabamento ficou perfeito, sem marcas ou variações de cor, devolvendo o brilho de carro zero. Profissionais extremamente caprichosos e técnicos."
   - **Monica R.:** "Excelente! Super indico! Muito atencioso, cuidadoso, comprometido com horário. Entregou exatamente o que foi combinado. Voltarei pra fazer outros serviços e já estou indicando pra amigos e família."
   - **Carlos Alberto S.** (Película): "[…] fez a instalação da película nano cerâmica Window Blue, a qual ficou perfeito. […] O produto é excelente, mas a instalação e o atendimento são ímpar. Recomendo de olhos vendados."
   - **Felipe S.:** "Atendimento extremamente profissional e atencioso. Execução de todos os serviços com qualidade conforme prometido. Difícil encontrar essa atenção em nossa região."
   - **Vargassurf H.:** "Fui fazer um serviço ao lado da R1 e acabei conhecendo a loja. Recebi orientações do serviço com excelente e acabei contratando. O resultado final foi nota 1000. Desde já agradeço e indico."
   - Card final: "+68 avaliações — Veja todas as 73 avaliações no Google →"
10. **Como funciona:** 01 Entre em contato (Fale com a equipe pelo WhatsApp) · 02 Avaliação (Entenda o serviço adequado para o veículo) · 03 Serviço (A equipe realiza o trabalho contratado) · 04 Entrega (Seu veículo pronto).
11. **Acompanhe nossos trabalhos (Instagram @r1estetica):** carrossel contínuo e arrastável de fotos reais levando ao Instagram + botão "VER INSTAGRAM →".
12. **Onde estamos:** endereço, tabela de horários (destacando o dia de hoje), status aberto/fechado, telefone, botões "Como chegar" e "Ver no Google Maps". Mapa interativo escuro (Leaflet com tiles locais do OpenStreetMap, filtro invertido) com pino vermelho pulsante e botão "Abrir no Google Maps ↗". **Sem foto da fachada nesta seção.**
13. **CTA final:** "SEU CARRO ESTÁ PRONTO PARA UM NOVO NÍVEL?" + "Fale com a R1 Centro de Estética Automotiva e solicite seu orçamento." + botão grande "FALAR NO WHATSAPP →".
14. **Rodapé:** logo, endereço + CEP, horários, WhatsApp, Instagram, Facebook, créditos das fotos.
15. **Botões flutuantes (sempre visíveis):** WhatsApp verde ("Solicitar orçamento →") e botão de rota que abre menu com Google Maps, Mapas (iPhone), Waze e Uber.

### Mobile

Totalmente responsivo: menu simples, WhatsApp sempre acessível, imagens grandes, textos curtos, botões grandes, animações leves e sem rolagem horizontal.

### SEO local

- `<title>`: "R1 Centro de Estética Automotiva | Estética automotiva em Campo Grande, RJ"
- Meta description: "Estética automotiva em Campo Grande, Rio de Janeiro: polimento, vitrificação de pintura, PPF, insulfilm e películas, envelopamento, higienização e martelinho de ouro. Nota 4,9 no Google. Orçamento pelo WhatsApp."
- Palavras-chave: estética automotiva Campo Grande RJ, estética automotiva Campo Grande Rio de Janeiro, detailing Campo Grande RJ, polimento automotivo Campo Grande, pintura automotiva Campo Grande, película automotiva Campo Grande, insulfilm Campo Grande, vitrificação de pintura Campo Grande, PPF Campo Grande.
- Open Graph, meta geo (BR-RJ), um único H1, H2 por seção, `alt` descritivo em todas as fotos.
- JSON-LD `AutomotiveBusiness` com endereço, geo, horários, telefone, e-mail, `aggregateRating` (4.9 / 73), lista de serviços e `sameAs` (Instagram e Facebook).

### Créditos obrigatórios (rodapé)

- Fotos dos trabalhos: publicadas pela própria R1 (perfil do Google).
- Foto da abertura: BMW M5 Competition, por **Tokumeigakarinoaoshima** (Wikimedia Commons), licença **CC BY-SA 4.0** — editada (fundo removido, tratamento de cor e efeito de luz); a versão editada segue sob a mesma licença. Imagem ilustrativa, sem vínculo com a BMW.
- Mapa: © OpenStreetMap.

---

## Estrutura dos arquivos (no .zip)

```
r1-estetica-automotiva/
├── index.html              ← página completa (conteúdo, SEO, JSON-LD)
├── styles.css              ← todo o visual
├── script.js               ← intro, faróis, galeria, lightbox, mapa, carrosséis, status aberto/fechado, WhatsApp
└── assets/
    ├── img/                ← fotos reais da R1 (+ versões -sm para celular), imagens da intro BMW, og-image
    ├── map/                ← tiles do mapa (OpenStreetMap)
    └── vendor/leaflet/     ← biblioteca do mapa
```

**Para publicar:** envie a pasta inteira para qualquer hospedagem estática (Hostinger, Netlify, Vercel, GitHub Pages, cPanel etc.). Abra `index.html` a partir de um servidor (não pelo `file://`) para o mapa e as fotos funcionarem.

**Para editar rapidamente:**
- Número do WhatsApp e mensagem padrão: início do `script.js` (`WA_NUMBER`, `WA_DEFAULT_MSG`).
- Horários do status aberto/fechado: `HOURS` no `script.js` (minutos desde meia-noite).
- Fotos da galeria: lista `WORKS` no `script.js`.
- Serviços: bloco `<ul class="svc-list">` no `index.html`.

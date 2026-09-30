# Prompt — Site Dra. Carol Haneda · Estética e Harmonização

Use este prompt para recriar, editar ou evoluir o site (em outra IA como Lovable, com um desenvolvedor ou numa nova conversa). Ele descreve o site **exatamente como foi entregue**, com todas as informações já confirmadas. As fotos estão no ZIP (`assets/images/`) — anexe-as junto com o prompt, mantendo os nomes de arquivo.

---

## PROMPT

Crie um site institucional de uma página (HTML + CSS + JavaScript puro, sem framework e sem build) para a **Dra. Carol Haneda — Estética e Harmonização**, clínica de harmonização facial e corporal em Bauru – SP. O visual deve ser editorial, sofisticado e acolhedor, fiel à identidade real da clínica: paredes brancas com boiserie, móveis rosé e o monograma **CH** em dourado. Objetivo: transmitir resultado natural + experiência premium e converter visitas em agendamentos pelo WhatsApp.

### Informações confirmadas (usar exatamente assim)

- **Nome:** Dra. Carol Haneda — Estética e Harmonização (nome civil: Caroline Haneda Xavier)
- **Profissão:** biomédica esteta, mentora e professora · **CRBM 51120**
- **Formação:** formação técnica em estética, graduação em biomedicina, pós-graduação em Estética Avançada, especializações nacionais e internacionais, residência na Itália; atualizações em Miami, Paris, Itália e Mônaco
- **Tempo de atuação:** 9 anos (matéria de maio/2026)
- **Endereço:** Rua Eduardo Vergueiro de Lorena, 5-5 — Bauru, SP (não exibir bairro/CEP: as fontes divergem entre Jardim Planalto e Jardim Aeroporto; no schema usar CEP 17012-450)
- **Coordenadas (perfil do Google):** -22.3396267, -49.0532042
- **WhatsApp / telefone:** (14) 99815-5786 → https://wa.me/5514998155786
- **Mensagem padrão do WhatsApp:** "Olá, Dra. Carol! Vim pelo site e gostaria de agendar uma avaliação."
- **Instagram:** @carolhanedaestetica — https://www.instagram.com/carolhanedaestetica/
- **Cursos (Hotmart):** https://hotmart.com/pt-br/marketplace/especialista/caroline-haneda-xavier/D8PB62HJ8Q
- **Avaliação Google:** 4,9 ★ — 206 avaliações
- **Horário:** NÃO publicar (fontes divergentes). Usar: "Com hora marcada. Consulte dias e horários disponíveis pelo WhatsApp."
- **Apelido de marca:** "fada da harmonização" (bio do TikTok)

### Regra fundamental

Não inventar informações, procedimentos, preços, números, depoimentos ou fotos. Usar somente fotos reais da Carol/da clínica (as do ZIP). Avaliações: apenas trechos reais do Google, assinados "Paciente · Google" (as fontes não trazem os nomes).

### Identidade visual

- **Cores (tokens CSS):** marfim `#f7f1ec` (fundo), marfim-alto `#fdfaf7` (cards/realces), rosé `#ecdcd4` (seções de destaque), rosé-suave `#f3e7e1`, tinta `#2a2124` (texto e seções escuras), tinta-suave `#5a4a4f` (texto secundário), ouro `#a8844f` (só decorativo: monograma, linhas, ícones), ouro-texto `#7a5b30` (texto dourado e botões — passa 4.5:1), ouro-texto-escuro `#634823` (hover), ouro-claro `#d9c29a` (dourado sobre fundo escuro).
- **Fontes (Google Fonts):** **Cormorant Garamond** (títulos, 400–600 + itálico) e **Manrope** (texto e interface, 300–700).
- Botões em pílula, altura mínima 48px; primário em ouro-texto com texto marfim; secundário com borda fina.
- Contraste mínimo 4.5:1 em todo texto, foco visível (outline dourado), alvos de toque ≥ 44px, seleção de texto e scrollbar na paleta.
- Ícones sempre em SVG (estrelas, setas, ícones da experiência) — nada de emoji ou caracteres Unicode como ícone.
- Sem "eyebrows" (rótulos pequenos acima dos títulos), sem numeração 01/02/03, sem texto em gradiente.
- Respeitar `prefers-reduced-motion` (sem abertura, sem rotações, sem reveals). Sem JS, todo o conteúdo continua visível.

### Estrutura (em ordem)

1. **Abertura (1× por sessão, pulável com toque/tecla, ≈3 s, CSS puro):** fundo marfim; "C" entra da esquerda e "H" da direita em dourado sólido (Cormorant, ~9rem) com leve desfoque → nitidez; linha dourada fina cresce do centro; "CAROL HANEDA" em caixa alta com espaçamento que se fecha; "Estética e Harmonização" pequeno em ouro-texto. Depois a tela sobe como cortina e o hero entra em cascata (título, subtítulo, botões, nota) com a foto de fundo reduzindo de 1.08 para 1.
2. **Menu fixo:** monograma CH em círculo + "Carol Haneda / ESTÉTICA E HARMONIZAÇÃO"; links Sobre, Procedimentos, Experiência, Avaliações, Instagram, Localização; botão "Agendar" (WhatsApp). Transparente sobre o hero, vira marfim translúcido ao rolar. Hambúrguer no celular.
3. **Hero (100svh):** foto `hero-consulta-carol.jpg` (Carol em consulta com paciente, mostrando tablet) escurecida por gradiente. Título **"Beleza *natural*, cuidado do início ao fim."** (natural em itálico ouro-claro). Subtítulo: "Harmonização facial e corporal em Bauru, com técnica, ética e olhar personalizado, numa clínica pensada para que você se sinta cuidada em cada detalhe." Botões **Agendar avaliação no WhatsApp** e **Ver procedimentos**. Linha com 5 estrelas SVG + "4,9 no Google · 206 avaliações".
4. **Sobre:** foto `sobre-carol-haneda.jpg` em moldura em arco (topo arredondado) com contorno dourado deslocado atrás. Título "Dra. Carol Haneda", frase em itálico "Biomédica esteta, mentora e professora. Há 9 anos transformando autoestima com resultados de verdade e naturalidade.", dois parágrafos (formação + conduta ética: "indicar apenas o que é seguro e realmente necessário") e 3 selos: CRBM 51120 · Pós em Estética Avançada · Residência na Itália.
5. **Procedimentos — "Harmonização facial e corporal":** texto "Cada tratamento começa por uma avaliação individual. A proposta é realçar os seus traços com elegância, nunca transformar você em outra pessoa." + foto `atendimento-harmonizacao.jpg`. Lista editorial em 2 colunas (1 no celular), cada item com nome em serif à esquerda e descrição à direita, separados por linhas finas — **sem cards**:
   - **Rosto:** Toxina botulínica · Bioestimuladores & Sculptra · Preenchimentos (lábios, contornos e rinomodelação) · Full Face
   - **Pele & corpo:** Ultraformer · Laser Lavieen · Harmonização corporal (flacidez, celulite, gordura localizada) · Depilação
   - Faixa final: "**Não sabe por onde começar?** Agende uma avaliação e a Dra. Carol monta com você o plano ideal para o seu momento." + botão "Conversar no WhatsApp".
6. **Resultado real (fundo rosé):** "Resultado real: elegante e natural." + "Preenchimento labial realizado na clínica: mais hidratação, contorno e volume, respeitando a anatomia de cada paciente. Arraste para comparar." + aviso "Os resultados variam de pessoa para pessoa…". **Slider de antes/depois de arrastar** (mouse, dedo e setas do teclado), com `resultado-labios-antes.jpg` e `resultado-labios-depois.jpg`, tags "ANTES"/"DEPOIS", linha branca e alça circular com setas; largura máx. 320px (260px no celular), proporção 645/958.
7. **Experiência — "Cada detalhe foi pensado para você":** grade com foto alta `espaco-sala-consulta.jpg` (legenda "Sala de consulta"), lista com ícones SVG em círculo — Estacionamento exclusivo · Menu para pacientes · Cadeira de massagem na recepção · Um buquê para celebrar (pacientes do Full Face saem com flores) — e foto `experiencia-menu-cafe.jpg` (legenda "Menu da recepção").
8. **Faixa "fada da harmonização" (tela cheia):** foto `carol-editorial.jpg` com scrim lateral; título "A “fada da harmonização”, com olhar para o mundo." + texto sobre residência na Itália e atualizações em Miami, Paris e Mônaco.
9. **Avaliações (fundo tinta):** "O que dizem as pacientes" + "Trechos de avaliações públicas deixadas no perfil da clínica no Google." + bloco "4,9" grande em itálico ouro-claro, 5 estrelas SVG, "206 avaliações no Google". **Faixa em rotação contínua (46 s por ciclo), arrastável com o dedo e pausando com o mouse em cima**, com fade nas bordas. 6 avaliações reais:
   - "A clínica é linda, a profissional muito atenciosa e ética na hora da consulta, oferece para as pacientes o que acha seguro e necessário! Resultados elegantes e naturais."
   - "A Dra. Carol é uma excelente profissional, me passou muita confiança e o resultado não poderia ser outro: amei minha harmonização facial."
   - "A clínica é maravilhosa, tem estacionamento exclusivo! Menu especial para os clientes e as pacientes ganham buquê de flores após fazer o Full Face."
   - "Atendimento maravilhoso! A Dra. Carol é super atenciosa e cuidadosa, além do espaço ser lindo e super confortável!"
   - "É a melhor clínica de estética e harmonização facial de Bauru! Os produtos são de altíssima qualidade!"
   - "Você é recebido com uma experiência incrível do início ao fim! Cadeira de massagem, menu para os pacientes e um resultado incrível quando termina o procedimento."
   - Botão "Ver todas as avaliações no Google".
10. **Momentos — "Muito além da clínica":** foto `carol-haneda-experience-2026.jpg` (legenda "Carol Haneda Experience · 2026") + 3 itens com linha fina: **Carol Haneda Experience** (2026, "Mais um ano celebrando histórias": aniversário da clínica com gastronomia, música ao vivo e experiências sensoriais) · **Clube do Botox Experience** (encontros exclusivos para as pacientes do clube) · **Toque de Fada** (ação que presenteou mulheres com transformação de autoestima, em parceria com outras profissionais de Bauru).
11. **Para profissionais — "Para profissionais: cursos e mentoria com a Dra. Carol":** foto `cursos-carol-rinomodelacao.jpg` em arco, texto sobre curso de rinomodelação e materiais sobre intercorrências em preenchimento; botões "Conhecer os cursos" (Hotmart) e "Falar sobre mentoria" (WhatsApp com mensagem para profissionais).
12. **Instagram (fundo rosé):** título "@carolhanedaestetica" em itálico + "Bastidores, resultados, dicas e os momentos especiais da clínica no Instagram. Acompanhe de perto." **Galeria em rotação contínua (ciclo de 5 s), arrastável**, cards 4:5 de 260px (200px no celular), com as 6 fotos `galeria-carol-*.jpg` + botão "Seguir no Instagram".
13. **Localização — "Onde encontrar a clínica":** Endereço (com "Estacionamento exclusivo para pacientes"), Atendimento (com hora marcada), Contato (telefone e Instagram sublinhados), botões "Agendar agora" e "Traçar rota" (Google Maps). Ao lado, **mapa estático real** (`mapa-clinica.jpg`, tiles OpenStreetMap suavizados para a paleta), com **pin escuro com "CH" dourado** exatamente no centro (coordenadas do Google), chip "Abrir no Google Maps →" e crédito "© OpenStreetMap". O mapa inteiro é um link para o Google Maps. **Sem iframe.**
14. **Rodapé (fundo tinta):** monograma + nome, links das seções, Instagram e WhatsApp, e "© [ano] Dra. Carol Haneda Estética e Harmonização · Biomédica esteta · CRBM 51120. Rua Eduardo Vergueiro de Lorena, 5-5, Bauru, SP."
15. **Botão flutuante do WhatsApp** (verde, canto inferior direito), aparece depois de rolar 300px.

### Movimento

- Um único momento autoral forte: a abertura. No resto, reveals discretos ao rolar (opacidade + 16px; nas fotos, um `clip-path` que se abre de baixo), hover com zoom leve nas fotos e no mapa.
- As duas faixas em rotação (avaliações e Instagram) medem a distância exata até os itens duplicados para o loop não "pular", e o arraste devolve a animação do ponto certo.

### Mobile

Totalmente responsivo (375 → 1440px): menu lateral, WhatsApp sempre acessível, colunas empilhadas, sem rolagem horizontal.

### SEO

- `<title>`: "Dra. Carol Haneda | Estética e Harmonização — Bauru, SP"
- Meta description: "Dra. Carol Haneda, biomédica esteta em Bauru: harmonização facial e corporal, toxina botulínica, bioestimuladores, preenchimentos, Full Face, Ultraformer e laser, com resultados naturais e uma experiência pensada do início ao fim."
- Open Graph com a foto do hero; JSON-LD `BeautySalon` com endereço, telefone, Instagram e `aggregateRating` 4.9 / 206.

---

## Pendências para confirmar com a cliente

- Horários de atendimento (não publicados por divergência entre fontes).
- Fotos em alta resolução: retrato do Sobre, foto dos Cursos e as 6 da galeria (hoje recortadas das capas do YouTube, baixa resolução) — idealmente os posts originais do Instagram.
- Nota e total de avaliações do Google (atualizar periodicamente).

# Pesquisa OSINT — VOOGA FITNESS BARRA

Pesquisa realizada em 15/09/2026, exclusivamente com fontes públicas (WebSearch, WebFetch, acesso direto via curl a páginas públicas). Nenhuma informação foi inventada; tudo abaixo está atribuído a uma fonte específica. A seção final lista o que não pôde ser confirmado.

---

## Fatos confirmados

| Dado | Valor confirmado | Fonte |
|---|---|---|
| Nome do estabelecimento | Vooga Fitness Barra | Dados estruturados (JSON-LD `SportsActivityLocation`) da página do parceiro no Wellhub: https://wellhub.com/pt-br/search/partners/vooga-fitness-barra-barra-da-tijuca/ |
| Endereço completo | Av. Gen. Guedes da Fontoura, 800 - g - Barra da Tijuca, Rio de Janeiro - RJ, 22621-243, Brasil | Wellhub (JSON-LD + texto da página) |
| Coordenadas geográficas | lat -23.012429, lon -43.3058853 | Dados internos (JSON embutido) da página do Wellhub |
| Telefone/WhatsApp | +55 21 99545-7197 (mesmo número informado: (21) 99545-7197) | Trecho indexado no Google via WebSearch, associado à página do Wellhub/ClassPass para "Vooga Fitness Barra" |
| Horário — Seg a Sex | 05:45 – 21:30 | HTML da página do Wellhub (bloco de horário de funcionamento, 5 entradas idênticas para os dias úteis) |
| Horário — Sábado | 07:15 – 11:45 | HTML da página do Wellhub |
| Horário — Domingo | Sem horário listado (compatível com "fechado") | HTML da página do Wellhub |
| Modalidades/atividades | Abdominais funcionais, Core 360, Fortalecimento, Glúteos e pernas, Mobilidade, Musculação, Perda de peso, Personal trainer (levantamento de peso), Pesos livres, Treino de core | Meta description da página do Wellhub: "Acessar academia Vooga Fitness Barra - Barra da Tijuca. Aulas de Abdominais funcionais, Core 360, Fortalecimento, Glúteos e pernas, Mobilidade, Musculação, Perda de peso, Personal trainer - Levantamento de peso, Pesos livres, Treino de core." |
| Comodidades | Ar condicionado, Armário, Chuveiro, Toalha, Vestiário, Wi‑Fi | HTML da página do Wellhub (lista de amenities) |
| Presença em agregadores | Listada no Wellhub (Gympass) e no ClassPass, ambos como unidade própria "Vooga Fitness Barra" | https://wellhub.com/pt-br/search/partners/vooga-fitness-barra-barra-da-tijuca/ ; https://classpass.pt/studios/vooga-fitness-barra-rio-de-janeiro (título indexado, conteúdo bloqueado por Cloudflare no acesso direto) |
| Plano de acesso via Wellhub | Diamond+, a partir de R$ 779,99/mês | HTML da página do Wellhub |
| Instagram | Perfil @voogabarra existe (https://www.instagram.com/voogabarra/) — confirmado apenas pela existência/indexação do handle, ver limitações abaixo | Resultados de WebSearch citando "voogabarra" como Instagram da Vooga Fitness Barra |
| Marca-mãe / rede | "Vooga Fitness" é descrita como marca com múltiplas unidades — pelo menos duas confirmadas: Recreio dos Bandeirantes (unidade original/matriz, Rua Alberto Cavalcanti/Cavalcante, 64) e Barra da Tijuca (Av. Gen. Guedes da Fontoura, 800) | Site oficial https://voogafitness.com.br/sobre (unidade Recreio); Wellhub e Gurupass (duas fichas distintas: "Vooga Fitness" no Recreio e "Vooga Fitness Barra" na Barra) |
| CNPJs relacionados à marca (nenhum confirmado como o da unidade Barra) | "Vooga Fitness Empresa Ltda", CNPJ 40.812.523/0001-57, aberta em 11/02/2021, sede em Av. das Américas, 15455, Recreio dos Bandeirantes. "Vooga Fitness Franqueadora Ltda", CNPJ 52.717.065/0001-56, aberta em 30/10/2023 (sugere modelo de franquia) | Econodata: econodata.com.br/consulta-empresa/40812523000157 e /52717065000156; Casa dos Dados: casadosdados.com.br/solucao/cnpj/vooga-fitness-empresa-ltda-40812523000157 (snippet indexado) |

---

## Identidade visual observada

Com base no logotipo e em 3 fotos reais do interior da unidade Barra, obtidos da galeria pública da ficha do parceiro no Wellhub (ver seção de fotos):

- **Logotipo:** wordmark em caixa alta, branco sobre fundo preto. A palavra "VOOGA" usa um "O" duplo estilizado, com contorno tipo pílula/anel (lembra um disco de anilha/barbell), criando uma leve textura de "olhos" ou halteres na tipografia. Abaixo, "FITNESS" em letras menores e bem espaçadas (letter-spacing largo), e, ainda abaixo, "BARRA" no mesmo estilo — identificando especificamente a unidade. Fonte: `vooga-barra-logo-wellhub.png` (arquivo original nomeado "VOOGALOGOBASICA" no CDN do Gympass/Wellhub).
- **Paleta de cores dominante:** preto e branco como base da marca (logo); nos ambientes internos aparecem tons terrosos/quentes de madeira clara (ripado de madeira natural tipo carvalho claro) combinados com parede em textura de tijolinho/pedra cinza-chumbo (quase preta), pontos de acabamento em azul-marinho (poltrona de estofado) e iluminação quente (pendente redondo dourado/latão). Resultado: paleta "boutique/lounge" — preto, branco, madeira clara e cinza-chumbo, com acento em azul-marinho e luz quente.
- **Estilo fotográfico:** fotos de ambiente interno, enquadramento próximo/lateral, iluminação ambiente quente (spots e pendente), sem pessoas, valorizando texturas (madeira, tijolinho) e o letreiro físico da marca na parede — estética de estúdio boutique, não de academia tradicional grande.
- **Elemento de marca física:** letreiro 3D "VOOGA FITNESS" em letras brancas soltas, instalado sobre parede de tijolinho cinza-escuro na recepção/entrada.
- **Merchandising de marca:** toalhas dobradas em tecido cru/off-white com estampa preta "VOOGA FITNESS", organizadas em nichos de madeira — reforça a paleta preto/branco/madeira também nos itens de uso do cliente.

Fonte de todas as observações visuais: fotos reais baixadas da galeria pública do parceiro "Vooga Fitness Barra" no Wellhub (detalhado abaixo).

---

## Fotos obtidas

Todas as imagens abaixo foram baixadas diretamente do CDN oficial de parceiros do Wellhub/Gympass (`images.partners.gympass.com`), a partir da ficha específica da unidade **Vooga Fitness Barra** (confirmado pelo texto alternativo "...da galeria do parceiro Vooga Fitness Barra" embutido na própria página). Duas imagens duplicadas da galeria (mesmo conteúdo, hashes idênticos) foram descartadas.

| Arquivo salvo | URL de origem | Descrição do conteúdo |
|---|---|---|
| `/home/user/site-pilates/research/images/vooga-barra-logo-wellhub.png` | https://images.partners.gympass.com/image/partners/v1_6PeE_4vYKNP-rJ0ienn3Ww/lg_44eab6b4-a195-47a7-8238-4b91c827dbc3_VOOGALOGOBASICA.pdf1.pdf.png | Logotipo oficial "VOOGA FITNESS BARRA", branco sobre fundo preto (arte "básica" da marca) |
| `/home/user/site-pilates/research/images/vooga-barra-parede-logo-recepcao-wellhub.jpg` | https://images.partners.gympass.com/image/partners/v1_6PeE_4vYKNP-rJ0ienn3Ww/lg_a7f32b3f-e423-4817-9d1f-fe9acb127367_46d3acbf95ec49b59918d1d9a2f7650e.JPG | Parede de recepção/entrada: letreiro físico "VOOGA FITNESS" em letras brancas 3D sobre tijolinho cinza-escuro, painel de madeira ripada, iluminação quente, equipamentos ao fundo |
| `/home/user/site-pilates/research/images/vooga-barra-poltrona-lounge-wellhub.jpg` | https://images.partners.gympass.com/image/partners/v1_6PeE_4vYKNP-rJ0ienn3Ww/lg_6946211f-6a45-459e-8544-7dc66db755b2_46d3acbf95ec49b59918d1d9a2f7650e1.JPG | Canto lounge: poltrona estofada azul-marinho com apoio/bandeja de madeira, parede de tijolinho, equipamentos de musculação (estação de cabos) ao fundo |
| `/home/user/site-pilates/research/images/vooga-barra-prateleira-toalhas-wellhub.jpg` | https://images.partners.gympass.com/image/partners/v1_6PeE_4vYKNP-rJ0ienn3Ww/lg_c66faab9-db71-4ef4-b248-80ffeca6d579_a81deb974bcd43aca110f9e68ef21277.JPG | Nicho de madeira com toalhas dobradas estampadas "VOOGA FITNESS", cafeteira Nespresso, planta, display digital ao fundo — área de conveniência/recepção |

Observação: a página do Wellhub referenciava 5 posições de galeria, mas 2 pares eram exatamente a mesma imagem (mesmo hash MD5), por isso restaram 3 fotos de ambiente únicas + 1 logo.

---

## Avaliações reais coletadas

**Nenhuma avaliação pública verificável foi encontrada para a unidade Vooga Fitness Barra especificamente.**

- No **ClassPass** (classpass.pt/studios/vooga-fitness-barra-rio-de-janeiro), o resumo indexado no Google indica explicitamente que o studio **"não foi avaliado ainda"** ("has not yet been reviewed"). O acesso direto à página foi bloqueado por proteção Cloudflare ("Just a moment...", HTTP 403), então não foi possível confirmar visualmente, mas a ausência de avaliações é o que consta no conteúdo indexado.
- No **Wellhub**, a página do parceiro não exibe nota média nem contagem de avaliações no HTML capturado.
- Não foi possível acessar o Google Maps/Google Business da unidade (buscas não retornaram uma ficha do Google Maps específica com nota/avaliações; ver seção "Não confirmado").
- Não foram encontradas avaliações no Reclame Aqui, Facebook ou outros diretórios especificamente para a unidade Barra.

Portanto, **nenhum depoimento de cliente real e verificável pôde ser citado**. Qualquer depoimento no site institucional deverá ser fictício/placeholder e sinalizado como tal, ou substituído por uma chamada para avaliações futuras.

---

## Equipe/profissionais

**Nenhum nome de profissional foi confirmado oficialmente para a unidade Vooga Fitness Barra especificamente.**

Para referência (NÃO aplicar à unidade Barra sem confirmação adicional): o site institucional da marca (voogafitness.com.br/sobre) cita, em relação à unidade do **Recreio dos Bandeirantes**:
- **Leandro de Andrade** — Gestor Técnico, Personal Trainer e Nutricionista Esportivo, 20+ anos como Educador Físico, 10 anos como Nutricionista, Head Coach de CrossFit desde 2012.
- **Thiago Villaça** — Gestor Operacional, formado em Educação Física (UNESA), MBA em Gestão Empresarial (FGV), 15+ anos em fitness e gestão, autor de três livros.

Fonte: https://voogafitness.com.br/sobre — mas essa página descreve a unidade do Recreio ("Rua Alberto Cavalcanti, 64"), não a unidade da Barra. Não há confirmação pública de que esses profissionais atuem também na unidade Barra.

---

## Serviços/modalidades confirmados

Confirmados via meta description oficial da ficha "Vooga Fitness Barra" no Wellhub (texto exato):
"Aulas de Abdominais funcionais, Core 360, Fortalecimento, Glúteos e pernas, Mobilidade, Musculação, Perda de peso, Personal trainer - Levantamento de peso, Pesos livres, Treino de core."

Isso é consistente com a lista de atividades já fornecida (musculação, treinamento funcional, personal trainer, fortalecimento, mobilidade, treino de força, core, glúteos e pernas, pesos livres, emagrecimento).

---

## Frases/copy oficiais da marca

**Específicas da ficha "Vooga Fitness Barra" (Wellhub, texto verbatim exibido na página do parceiro):**
> "Av. Gen. Guedes da Fontoura, 800, a Vooga Fitness é uma academia boutique que oferece treinamento de musculação personalizado. Com atendimento individualizado, treinos inteligentes e um ambiente reservado, focamos no seu bem-estar, performance e qualidade de vida, sem lotação ou distrações. É necessário agendamento para participar das atividades."

**Da marca "Vooga Fitness" em geral (site institucional voogafitness.com.br — podem ou não ser usadas para a unidade Barra, mas são copy oficial da marca-mãe):**
- "A primeira Griffe Fitness do Brasil"
- "Bem-vindo ao Vooga! A primeira Griffe Fitness do Brasil"
- "Vem ser Vooga!"
- "A sua segunda casa"
- "Mais do que um Studio, somos um Estilo de Vida"
- "AQUI OS RESULTADOS SÃO REAIS! VOCÊ ESTÁ PRONTO(A)?"
- "Um estúdio de luxo criado para atender pessoas exigentes" (trecho indexado do Google associado ao Facebook/site oficial da marca)

Fonte: https://voogafitness.com.br/ e https://voogafitness.com.br/sobre (WebFetch); frase final via snippet indexado no WebSearch.

---

## Não confirmado / não encontrado

Itens pedidos que **não puderam ser verificados** com fonte pública confiável, listados para uso de placeholder ou "consulte pelo WhatsApp" no site final:

1. **Bio exata do Instagram @voogabarra** — o perfil existe (confirmado indiretamente por menções indexadas e pelo link fornecido), mas o conteúdo (bio, número de seguidores, número de posts, fotos de posts) **não pôde ser acessado**: o Instagram devolveu redirecionamento para tela de login tanto via WebFetch quanto via requisição direta (curl) e via a API pública `web_profile_info` (HTTP 401, "Aguarde alguns minutos antes de tentar novamente", `require_login: true`). Tentativa via navegador automatizado (Playwright/Chromium) também falhou: o Chromium headless não conseguiu validar o certificado do proxy de rede do ambiente (erro `ERR_CERT_AUTHORITY_INVALID`), e não havia ferramenta `certutil`/NSS instalável no ambiente para registrar o CA corretamente a tempo (tentativa de instalação via apt falhou por indisponibilidade do pacote no mirror configurado). **Nenhuma foto do Instagram foi obtida** — as fotos usadas neste relatório vêm do Wellhub, não do Instagram.
2. **Ficha do Google Maps/Google Business da unidade Barra** — não foi localizada uma ficha específica do Google Maps com nota média, número de avaliações ou reviews de texto. Buscas retornaram apenas resultados genéricos de "Barra da Tijuca" no Google Maps, não uma ficha de negócio (Place) da Vooga Fitness Barra.
3. **Avaliações de clientes reais (texto + autor)** — não encontradas em nenhuma plataforma (ClassPass confirma explicitamente que não há avaliações ainda; Wellhub não expõe avaliações; Google Maps não localizado; Reclame Aqui sem registro).
4. **Razão social "Vitalis Gym Saúde e Performance Ltda"** — não encontrada em nenhuma base de CNPJ pública consultada (Econodata, Casa dos Dados, cnpj.biz, Nacional Consultas). As entidades jurídicas ligadas ao nome "Vooga Fitness" localizadas publicamente são "Vooga Fitness Empresa Ltda" (CNPJ 40.812.523/0001-57, sede no Recreio) e "Vooga Fitness Franqueadora Ltda" (CNPJ 52.717.065/0001-56). Isso não prova que a razão social informada esteja errada — a unidade Barra pode ser operada por uma franqueada com CNPJ próprio não indexado nas buscas realizadas —, mas **não há confirmação pública** dela. Recomenda-se tratar essa razão social como não verificada e, se for usada no site/contrato, confirmar diretamente com o cliente (ex.: contrato social ou CNPJ da nota fiscal).
5. **Equipe/profissionais específicos da unidade Barra** (personal trainers, nutricionista, gerente local) — nenhum nome encontrado associado publicamente a essa unidade especificamente.
6. **TikTok e Facebook oficiais da unidade Barra** — só foram localizados o TikTok (@voogafitness) e o Facebook (facebook.com/voogafitness) da marca/unidade Recreio; não há confirmação de perfis próprios da unidade Barra nessas redes.
7. **App "VOOGA TRAINER" (Google Play, com.vooga.app)** — apareceu em resultados de busca, mas o acesso direto à ficha retornou HTTP 404 no momento da pesquisa; não foi possível confirmar detalhes ou relação direta com a unidade Barra.
8. **Website institucional próprio da unidade Barra** — não existe; o domínio oficial da marca (voogafitness.com.br) só documenta a unidade do Recreio. Não foi encontrado nenhum domínio próprio para "Vooga Fitness Barra" — isto reforça a necessidade/oportunidade do site institucional que está sendo produzido.

---

## Resumo prático para quem for montar o site

- Pode usar com confiança: endereço, telefone/WhatsApp, horários, lista de modalidades e a frase oficial de posicionamento do Wellhub — todos verificados.
- Pode usar como referência de identidade visual: as 4 imagens salvas em `/home/user/site-pilates/research/images/` (logo + 3 fotos de ambiente), com atribuição ao Wellhub/Gympass caso seja necessário justificar a origem.
- Deve usar placeholder / "consulte no WhatsApp": depoimentos de clientes, nota do Google, nomes da equipe local, fotos adicionais de posts do Instagram, e a razão social exata (a informada não foi confirmada publicamente).

# Pesquisa — ARGENTO Escoramentos | Fôrmas | Andaimes

Registro do que foi pesquisado, do que foi confirmado e do que **não** foi encontrado.
Data da pesquisa: outubro de 2026.

## 1. Informações confirmadas (usadas no site)

| Informação | Valor | Fonte |
|---|---|---|
| Razão social | Equipamentos Argento Brasileiros Locação de Bens Móveis Ltda. | Receita Federal (BrasilAPI, CNPJ 08311194000158) |
| Nome fantasia (Receita) | Equipamentos Argento Brasileiros. | Receita Federal |
| CNPJ | 08.311.194/0001-58, matriz, situação **ativa** | Receita Federal |
| Início das atividades | 20/09/2006 | Receita Federal |
| Atividade principal (CNAE 7739-0/99) | Aluguel de outras máquinas e equipamentos comerciais e industriais, sem operador | Receita Federal |
| Atividade secundária (CNAE 4669-9/99) | Comércio atacadista de outras máquinas e equipamentos; partes e peças | Receita Federal |
| Endereço cadastral | Av. Marechal Floriano, 199, Grupo 605 — Centro — Rio de Janeiro/RJ — CEP 20080-005 | Receita Federal |
| Telefone cadastral | (21) 2516-2761 | Receita Federal |
| Sócios | Bibiana Lemos Mendes Vassallo (sócia-administradora) e German Alfredo Vassallo (sócio), ambos desde 20/09/2006 | Receita Federal |
| Linhas de equipamentos | Escoramento · Cimbramento · Travamento · Fôrma metálica · Fôrma deslizante · Andaimes · Tubular convencional | Perfil público de German A. Vassallo no LinkedIn (br.linkedin.com/in/germanvassallo): “Diretor Proprietário · ARGENTO Escoramentos. Trabalhamos com as seguintes linhas de equipamentos: …” |
| Nome comercial usado no LinkedIn | “ARGENTO Escoramento / Fôrmas / Andaimes” e “ARGENTO Escoramentos” | LinkedIn (German, Bibiana e um engenheiro civil da equipe) |
| German A. Vassallo | Diretor proprietário; formação: Universidad Tecnológica Nacional (UTN); Rio de Janeiro | LinkedIn (trecho público indexado) |
| Bibiana Mendes | Diretora comercial na ARGENTO Escoramentos | LinkedIn (trecho público indexado) |
| Equipe técnica | Perfil de engenheiro civil com experiência em “ARGENTO Escoramento / Fôrmas / Andaimes” | LinkedIn (trecho público indexado) |

> O site menciona “profissionais com formação em engenharia” com base nesses perfis.
> **Confirmar com a ARGENTO** antes da publicação.

## 2. Informações encontradas, mas NÃO usadas

| Informação | Motivo |
|---|---|
| Av. das Américas, 700, Bl. 1, sl. 210 — Barra da Tijuca; tel. (21) 3152-0145 | Aparece apenas em guia telefônico não verificado (guiatelefone.com, hagah). Diverge do cadastro da Receita; possivelmente endereço antigo. Confirmar. |
| Fax (21) 2253-5165 | Consta na Receita como fax; não usado. |

## 3. Não encontrado (o site deixa espaço preparado)

- Site oficial antigo ou domínio próprio (testados: argento.com.br — pertence a outra empresa —, argentoescoramentos.com.br, argentobr.com.br, equipamentosargento.com.br; sem resposta).
- Página de empresa no LinkedIn, Instagram, Facebook ou YouTube oficiais.
- WhatsApp e e-mail comerciais.
- Fotografias ou vídeos de obras, equipamentos, equipe ou instalações da ARGENTO.
  O LinkedIn bloqueia acesso automatizado (HTTP 999) e o Instagram retornou limite de requisições (HTTP 429);
  as publicações de German não puderam ser lidas.
- Obras, clientes, projetos, certificações, região de atendimento, capacidades e especificações técnicas.
- Logotipo oficial e cores da marca.

## 4. Benchmark de mercado (referência estratégica, sem cópia)

Empresas analisadas: PERI, Doka, ULMA Construction, SH, ROHR e Orguel.

Padrões observados e como foram aplicados:

| Padrão do setor | Aplicação no site da ARGENTO |
|---|---|
| Menu enxuto: Produtos/Soluções, Projetos, Empresa, Contato + CTA de orçamento sempre visível | Menu com 7 itens + “Solicitar orçamento” fixo; barra de ação fixa no celular |
| Soluções organizadas por tipo de produto (fôrmas, escoramentos, andaimes) e por aplicação | Três frentes (Escoramentos, Fôrmas, Andaimes) + seção de Aplicações |
| Páginas de sistema com aplicações típicas | Páginas `solucoes/*.html` com cada linha confirmada |
| Cases no formato desafio → solução → resultado | Estrutura pronta em `assets/data/obras.json` |
| Engenharia/serviços técnicos como diferencial | Seção Engenharia baseada no processo de atendimento, sem prometer serviços não confirmados |
| Segurança como pilar institucional | Seção própria com princípios e normas de referência do setor (sem alegar certificação) |
| Formulário de orçamento com anexos | Formulário em etapas com anexos (PDF, DWG, DXF, imagens) |

Diferenciação: identidade grafite/prata (de “argento”, prata em italiano) com acento laranja de sinalização,
linguagem de desenho técnico, desenhos SVG próprios e animações de montagem das estruturas.

## 5. Imagens

Não foi encontrada nenhuma fotografia pública que se possa atribuir com segurança à ARGENTO.
Por isso o site usa:

1. **Imagens ilustrativas** de licença livre (Wikimedia Commons), todas marcadas na tela com o selo
   “Imagem ilustrativa” e creditadas em `creditos.html` / `docs/creditos-imagens.json`.
   Critério de curadoria: somente fotos de autores individuais ou domínio público, **sem equipamentos ou
   marcas de concorrentes visíveis** (verificado com ampliação de cada imagem). Foram descartadas fotos publicadas por fabricantes de fôrmas
   (STALFORM, Wall-Ties & Forms, Bitschnau) e fotos com vigas ou painéis identificáveis de outras marcas.
2. **Desenhos técnicos SVG** próprios (gerados por `tools/svg.py`), sem escala e sem especificações.

| Arquivo | Uso | Autor | Licença |
|---|---|---|---|
| edificio-alto | Hero, imagem de compartilhamento | Marek Ślusarczyk (Tupungato) | CC BY 3.0 |
| andaime-tubular | Seção Empresa, fundo da seção Engenharia | OathOn | CC0 |
| escoras-detalhe | Aplicações, página Escoramentos | Leo Miregalitheo | CC BY-SA 4.0 |
| reforma-fachada | Aplicações, página Andaimes | Odara Santos | CC0 |

Na revisão final foram **removidas** três imagens inicialmente selecionadas, porque, ampliadas, mostravam
marcas de terceiros: vigas de madeira **Doka H20** (escoramento de laje), pisos de andaime **Layher**
(fachada) e vigas com a marca **Skanska** (cimbramento de ponte). Pequenos elementos identificáveis
(logotipo de um elevador de obra e uma inscrição em uma escora) foram desfocados.

Organização prevista para fotos reais (`assets/img/`): `hero/`, `escoramentos/`, `formas/`, `andaimes/`,
`obras/`, `empresa/`, `engenharia/`, `equipe/`, `galeria/`.

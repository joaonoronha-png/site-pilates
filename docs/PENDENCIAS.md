# Pendências de confirmação com o cliente

Regra do projeto: **nada sobre a empresa é publicado sem confirmação.** Abaixo, tudo
que está preparado no site, mas aguarda validação.

| Item | Situação no site | Onde editar |
|---|---|---|
| Horário (todos os dias, 8h–20h) | Exibido como "Atendimento", dado encontrado em pesquisa | `config.js` → `horario` **e** `index.html` → `openingHoursSpecification` |
| "Desde 1995" | **Oculto** | `config.js` → `desde1995Confirmado: true` |
| Número de avaliações (40 ou 48?) | **Não exibido** — só "5,0 no Google" | Não adicionar sem conferir no Perfil da Empresa |
| Depoimentos reais (4 a 6) | Carrossel **oculto** até ser preenchido | `config.js` → `avaliacoes` |
| Link oficial das avaliações | Usa busca do Google com nome + endereço | `config.js` → `linkAvaliacoesGoogle` |
| Fotos reais | Todas provisórias, com selo "Imagem ilustrativa" | ver `docs/IMAGENS.md` |
| Portfólio | **Oculto** (sem fotos reais) | `config.js` → `portfolio` |
| Cardápio oficial | **Não exibido**; aparece convite para conversar | `config.js` → `cardapio` |
| FAQ: mínimo de convidados, bebidas, menu infantil, degustação, regiões atendidas, opções vegetarianas/veganas | **Ocultas** até terem resposta | `config.js` → `faqPendentes` |
| Instagram | **@requinteesaborbuffet**, indicado pelo responsável pelo projeto; incluído no contato, menu móvel, rodapé e `sameAs`. Existe também @requinteesaborbuffetrj (provavelmente antigo): confirmar com o cliente | `index.html` |
| Fotos do Instagram | Não baixadas: o Instagram exige login. Pedir os arquivos originais ao cliente (melhor resolução) e confirmar a autorização de fotos de convidados/fotógrafos | `docs/IMAGENS.md` |
| Domínio | Provisório `dominio-a-definir.com.br` | `sh scripts/definir-dominio.sh www.dominio.com.br` |
| Formas de pagamento | Somente no FAQ (crédito, débito, aproximação) | `index.html` (FAQ + JSON-LD) |

## O que NÃO foi publicado (de propósito)

Preços, pratos, quantidade de eventos, número de clientes, capacidade, equipe,
parceiros, prêmios, fornecedores, estrutura, áreas atendidas, estatísticas,
tempo de mercado e qualquer depoimento.

## Atenção a homônimos

Existem outras empresas com nomes parecidos ("Requinte Centro Gastronômico",
"Buffet Sabor e Requinte" de São Carlos/SP etc.). O domínio requinte.com.br é de
outra empresa. Só usar informações que batam com: Rua Pecegueiro do Amaral, 280 —
Vargem Pequena, RJ — WhatsApp (21) 97514-3297.

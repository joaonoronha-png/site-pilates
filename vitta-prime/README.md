# Vitta Prime Imóveis — site

Site estático (HTML + CSS + JS, sem build). Abra `index.html` ou publique a pasta em qualquer host estático.

## Estrutura da página
1. Intro animada → 2. Busca (hero) + atalhos → 3. Imóveis (carrossel horizontal com abas Comprar / Alugar / Lançamentos) →
4. Explore com a Vitta Prime (guias) → 5. Quem somos (regiões clicáveis filtram o carrossel) → 6. Caixa "Para proprietários" →
7. Contato → 8. Mapa interativo

Cada imóvel, guia e opção de proprietário abre uma página sobreposta com endereço próprio
(`#imovel-VP-1024`, `#guia-financiamento`, `#proprietario-avaliar`), que funciona com o botão Voltar do navegador.

## Mapa
- Leaflet 1.9.4 (cdnjs) com mapa vetorial próprio em `map-data.js`, gerado de dados do OpenStreetMap (ODbL, atribuição no mapa). Não usa tiles nem chave de API.
- Coordenadas dos imóveis: campos `lat`/`lng` em `IMOVEIS` (`script.js`). Escritório: constante `ESCRITORIO` (posição provisória).

## Antes de apresentar ao cliente, substituir
- **Logo**: redesenhada em vetor a partir do perfil @vittaprimeimoveis (`img/logo.svg`). Se a empresa tiver o arquivo original, substituir.
- **Fotos**: `img/insta/` são recortes dos posts do Instagram @vittaprimeimoveis (baixa resolução, ~400 px). Pedir os arquivos originais à empresa. As demais vêm do Unsplash, só para ilustrar.
- **Imóveis**: lista `IMOVEIS` em `script.js` (dados ilustrativos).
- **Lançamento "Orla Prime"**: em `index.html`, ilustrativo.
- **Equipe**: a lista de sócios foi removida. Se a empresa quiser, criar a seção "Nossa equipe" com fotos, cargos, CRECI e bio.
- **Contato**: endereço (Av. das Américas, 8585 · Lojas SS 2201 e 2202) e WhatsApp (21) 99843-3127 tirados do Instagram. Falta o CRECI.
- **Avaliação**: valores de m² por bairro nos `<option value>` do formulário de avaliação.
- **Formulários**: hoje só exibem confirmação na tela; ligar a WhatsApp/e-mail/CRM.

## Assistente (chat) e Perguntas frequentes
- `chat.js`: botão "Tire suas dúvidas" (canto inferior esquerdo) e a seção "Perguntas frequentes" usam a mesma base `KB`. Na seção, cada tema abre o assistente com as perguntas daquele tema.
- O assistente entende variações e erros de digitação, busca imóveis do site ("tem cobertura na Barra?"), calcula o ITBI ("ITBI de 2 milhões")
  e passa para o WhatsApp quando não sabe. Não é IA generativa: só responde com os textos revisados da base.
- Para ligar uma IA generativa no futuro, defina `window.VP_AI = async (pergunta, historico) => "resposta"` chamando um backend próprio
  (nunca coloque a chave de API no navegador). Ela só é usada quando a base não tem resposta.
- Revisar com a Vitta Prime: horário de atendimento, política de carta de crédito/consórcio e percentuais de corretagem.

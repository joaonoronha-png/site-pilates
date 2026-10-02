# Vitta Prime Imóveis — site

Site estático (HTML + CSS + JS, sem build). Abra `index.html` ou publique a pasta em qualquer host estático.

## Estrutura da página
1. Intro animada → 2. Busca (hero) + atalhos → 3. Imóveis (carrossel horizontal com abas Comprar / Alugar / Lançamentos) →
4. Lançamento em destaque → 5. Bairros → 6. Explore com a Vitta Prime (guias) → 7. Sobre → 8. Caixa "Para proprietários" →
9. Contato → 10. Mapa interativo

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
- **Contato**: endereço (Av. das Américas, 8585 · Lojas SS 2201 e 2202) e WhatsApp (21) 99843-3127 tirados do Instagram. Falta o CRECI.
- **Avaliação**: valores de m² por bairro nos `<option value>` do formulário de avaliação.
- **Formulários**: hoje só exibem confirmação na tela; ligar a WhatsApp/e-mail/CRM.

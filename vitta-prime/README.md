# Vitta Prime Imóveis — site

Site estático (HTML + CSS + JS, sem build). Abra `index.html` ou publique a pasta em qualquer host estático.

## Estrutura da página
1. Intro animada → 2. Busca (hero) + atalhos → 3. Imóveis → 4. Lançamentos → 5. Bairros →
6. Proprietários (avaliação + anuncie) → 7. Sobre (serviços, valores, sócios) → 8. Contato → 9. Mapa interativo

## Mapa
- Leaflet 1.9.4 (cdnjs) com mapa vetorial próprio em `map-data.js`, gerado de dados do OpenStreetMap (ODbL, atribuição no mapa). Não usa tiles nem chave de API.
- Coordenadas dos imóveis: campos `lat`/`lng` em `IMOVEIS` (`script.js`). Escritório: constante `ESCRITORIO` (posição provisória).

## Antes de apresentar ao cliente, substituir
- **Fotos**: todas são de banco de imagens (Unsplash) e servem só para ilustrar. Não foi encontrado Instagram oficial confirmado da Vitta Prime; troque pelas fotos autorizadas da empresa.
- **Imóveis**: lista `IMOVEIS` em `script.js` (dados ilustrativos).
- **Lançamento "Orla Prime"**: em `index.html`, ilustrativo.
- **Contato**: WhatsApp, endereço completo, CRECI e CNPJ (marcados "a confirmar").
- **Avaliação**: valores de m² por bairro nos `<option value>` do formulário de avaliação.
- **Formulários**: hoje só exibem confirmação na tela; ligar a WhatsApp/e-mail/CRM.

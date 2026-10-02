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
- **Logo**: a atual é provisória (monograma VP). Substituir pela logo original da Vitta Prime.
- **Fotos**: todas são de banco de imagens (Unsplash) e servem só para ilustrar. Não foi encontrado Instagram oficial confirmado da Vitta Prime; troque pelas fotos autorizadas da empresa.
- **Imóveis**: lista `IMOVEIS` em `script.js` (dados ilustrativos).
- **Lançamento "Orla Prime"**: em `index.html`, ilustrativo.
- **Contato**: WhatsApp, endereço completo, CRECI e CNPJ (marcados "a confirmar").
- **Avaliação**: valores de m² por bairro nos `<option value>` do formulário de avaliação.
- **Formulários**: hoje só exibem confirmação na tela; ligar a WhatsApp/e-mail/CRM.

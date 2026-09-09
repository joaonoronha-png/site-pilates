# Hope Studio — site one-page

Site institucional da **Hope Studio** (barbearia — Downtown, Barra da Tijuca).
Arquivo estático, sem build: `index.html` + `css/style.css` + `js/main.js`.

Para visualizar: abra `index.html` no navegador, ou sirva a pasta com
qualquer servidor estático (`npx serve .`, `python3 -m http.server`, etc.).

## Como visualizar

```
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Proveniência dos dados (o que é real x o que falta confirmar)

Antes de desenvolver, foi feita uma etapa de pesquisa sobre a marca real
(Instagram @hopestudio_oficial, Google, Facebook, plataformas de
agendamento). As ferramentas de pesquisa disponíveis não conseguem
renderizar conteúdo dinâmico do Instagram/Facebook/Google Maps (bio,
destaques, fotos, vídeos e avaliações individuais exigem JavaScript e/ou
login), então parte da pesquisa retornou bloqueada (HTTP 429/403) ou
apenas trechos indexados por buscadores. Por isso o site segue a regra
do briefing — **na dúvida, omitir/placeholder em vez de inventar**.

### Confirmado (usado no site)

| Dado | Valor | Fonte |
|---|---|---|
| Nome da marca | Hope Studio | Instagram @hopestudio_oficial |
| Slogan | "Sua identidade, seu estilo." | Legenda real de post do Instagram (post de contagem regressiva de inauguração) |
| Tag da marca | #ItsHope / "It's Hope." | Legenda real de post do Instagram |
| Local | Dentro do Shopping Downtown, Barra da Tijuca | Posts do Instagram marcando @downtownrj |
| Endereço | Av. das Américas, 500, Bloco 4, Sala 206, Barra da Tijuca – RJ, CEP 22640-100 | Fornecido pelo solicitante |
| Nota Google | ★★★★★ 5,0 — 192 avaliações | Fornecido pelo solicitante |
| Contexto da marca | Estúdio recém-inaugurado (posts de contagem regressiva datados de março/2026) | Instagram — por isso o site não menciona ano de fundação, número de clientes ou história, que não podem ser confirmados |
| "Clube Hope" | Existe um serviço de assinatura de cortes/barba com esse nome | Legenda real indexada: "Entre para o Clube Hope e tenha cortes e barbas ilimitadas..." — termos e preço da assinatura não confirmados, por isso aparece como "Consulte" |

### Não confirmado (ver placeholders no código)

- **Fotos e vídeo reais** — não foi possível baixar/acessar mídia do
  Instagram (feed, Reels, carrosséis) através das ferramentas de
  pesquisa disponíveis nesta sessão. Os 10 espaços de mídia do site
  (`data-photo="hero"`, `trabalho-1`…`trabalho-5`, `identidade`,
  `espaco-video`, `espaco-ambiente-1`, `espaco-ambiente-2`) estão
  marcados com placeholders — **ver `FOTOS.md` para a especificação
  exata de formato e conteúdo de cada um**. Basta substituir o `<div
  class="real-media">` correspondente por um `<img>`/`<video>` real.
- **Telefone / canal de agendamento** — há duas fontes públicas
  divergentes (Google Maps: +55 21 96550-2413; diretório do Downtown:
  +55 21 97994-4216) e não foi possível confirmar qual está em uso
  atualmente na bio do Instagram (acesso bloqueado). Por isso nenhum
  número foi escolhido arbitrariamente: todos os botões "Agendar"
  apontam para o perfil do Instagram (`js/main.js`, constante
  `BOOKING_URL`), onde o link/telefone correto está sempre na bio.
  Assim que confirmado, atualize essa única constante.
- **Horários de funcionamento** — fontes públicas divergem; não
  exibido no site (link para o Instagram no lugar).
- **Avaliações individuais** — não foi possível recuperar com
  confiança o texto de avaliações reais e seus autores. A seção
  "Avaliações" mostra apenas o agregado confirmado (5,0 / 192) com
  link para o Google, conforme a regra do briefing para esse cenário.
- **Preços de serviços** — nenhum preço pôde ser validado com
  SERVIÇO | PREÇO | FONTE | DATA confiáveis; por isso a seção de
  serviços usa "Consulte" em vez de valores.

## Checklist antes de publicar

- [ ] Confirmar o canal de agendamento atual (telefone/link na bio do
      Instagram) e atualizar `BOOKING_URL` em `js/main.js`.
- [ ] Substituir os 10 placeholders `.real-media` por fotos/vídeo reais
      — ver `FOTOS.md` para o que cada um precisa mostrar.
- [ ] Confirmar horários e, se desejar, adicioná-los à seção de
      localização.
- [ ] Se preços/serviços forem confirmados, atualizar `.price-list` em
      `index.html`.
- [ ] Se 2–3 avaliações reais forem confirmadas (texto + nome), trocar
      a seção de avaliações agregada por essas citações.

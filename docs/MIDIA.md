# Mídia — origem de cada foto e vídeo

Todo o material visual vem das publicações do Instagram oficial **@mapersibuffet**. Nenhuma imagem de banco ou de concorrente foi usada.
As fotos são frames extraídos dos Reels (por isso ~720 px de largura) e foram convertidas para AVIF + WebP em dois tamanhos.

> **Direitos de uso:** antes de publicar, confirmar com a Mapersí a autorização de uso das imagens dos clientes que aparecem nos vídeos e dos fotógrafos creditados nas publicações (ex.: @srcorporationoficial, @nathalia.incena).

| Arquivo (`assets/media/…`) | Publicação de origem | Momento |
|---|---|---|
| `video/hero-reel.mp4` | Montagem de 6 trechos: DcOiHecxZDs, DdRm5OIxqgj, DLQ9Sfytqw2, DdDC9HZxpAT, DOTkmeqkT4q | colherinhas, estação de massas, mini panelas, drink flambado, tortinhas, pastéis |
| `video/momento.mp4` | DdDC9HZxpAT, DOTkmeqkT4q, DdHTk2RxJdu | casamento, entrada da noiva, 15 anos |
| `video/feedback-noivos.mp4` | [DdFJPKvBM7g](https://www.instagram.com/reel/DdFJPKvBM7g/) | “Feedback que amamos” (com áudio) |
| `video/g-massas.mp4` | [DdRm5OIxqgj](https://www.instagram.com/reel/DdRm5OIxqgj/) | estação de massas |
| `video/g-drinks.mp4` | [DdDC9HZxpAT](https://www.instagram.com/reel/DdDC9HZxpAT/) | bartender |
| `video/g-pasteis.mp4` | [DcOiHecxZDs](https://www.instagram.com/reel/DcOiHecxZDs/) | pastéis no varal |
| `img/copper`, `img/pastryboard` | [DLQ9Sfytqw2](https://www.instagram.com/reel/DLQ9Sfytqw2/) | Casamento Letícia e Bruno (jun/2025) |
| `img/tartlets`, `img/sweetshelf`, `img/waitress`, `img/bridegarden` | [DOTkmeqkT4q](https://www.instagram.com/reel/DOTkmeqkT4q/) | Casamento Vinicius e Thaís |
| `img/renovacao-altar` | [DO6gTxAETTb](https://www.instagram.com/reel/DO6gTxAETTb/) | Renovação de votos |
| `img/crabtartlets`, `img/tables40`, `img/serving40` | [DcJ1H8Hv8L-](https://www.instagram.com/reel/DcJ1H8Hv8L-/) | 40 anos da Thaty |
| `img/spoons`, `img/pastelrack`, `img/croquettes` | [DcOiHecxZDs](https://www.instagram.com/reel/DcOiHecxZDs/) | Apresentação do buffet |
| `img/coffeetable`, `img/coffeecrowd`, `img/cookies` | [DcuEvizBV3Y](https://www.instagram.com/reel/DcuEvizBV3Y/) | Coffee break 330+ pessoas |
| `img/sweetslilies`, `img/bartender` | [DdDC9HZxpAT](https://www.instagram.com/reel/DdDC9HZxpAT/) | Casamento (@_llayss) |
| `img/copperrice`, `img/feedback-poster` | [DdFJPKvBM7g](https://www.instagram.com/reel/DdFJPKvBM7g/) | Feedback de noivos |
| `img/team`, `img/bluetable`, `img/candles` | [DdHTk2RxJdu](https://www.instagram.com/reel/DdHTk2RxJdu/) | 15 anos da Isabel |
| `img/slider` | [DdPhZiIvIhF](https://www.instagram.com/reel/DdPhZiIvIhF/) | Estação fast food |
| `img/chefcart`, `img/penne` | [DdRm5OIxqgj](https://www.instagram.com/reel/DdRm5OIxqgj/) | Estações |
| `img/massas-foto-0…4`, `og-mapersi.jpg` | [Dc0wLhSERLl](https://www.instagram.com/p/Dc0wLhSERLl/) | Carrossel da estação de massas (foto profissional) |
| `img/p-leticia-casal` | DLQ9Sfytqw2 | Portfólio — Letícia & Bruno |
| `img/p-renov-estacao`, `img/p-renov-coxinhas` | DO6gTxAETTb | Portfólio — Renovação de votos |
| `img/p-isabel-servico` | DdHTk2RxJdu | Portfólio — 15 anos da Isabel |
| `img/p-thaty-convidados`, `img/p-thaty-servico` | DcJ1H8Hv8L- | Portfólio — 40 anos da Thaty |
| `img/p-coffee-pessoas` | DcuEvizBV3Y | Portfólio — Coffee break |
| `ig/*_cover` | capas das publicações | faixas em rotação da seção Instagram |
| `apple-touch-icon.png`, `icon-192.png`, `favicon-32.png` | foto de perfil (logo) | ícones |

## Para trocar ou adicionar fotos

1. Coloque o original em uma pasta e gere as versões com o script de conversão (AVIF/WebP 480 px + tamanho original, máx. 1080 px), mantendo o nome-base.
2. Atualize `assets/media/images.json` (largura, altura, tamanhos, cor de fundo).
3. Use `{{pic:nome|texto alternativo|sizes|classe}}` em `src/index.html` e rode `node tools/build.mjs`.

Prioridade de substituição quando houver fotos em alta: hero (still), manifesto, CTA final (`massas-foto-0` é ampliada para tela cheia).

# ARGENTO — Escoramentos | Fôrmas | Andaimes

Site institucional da ARGENTO (Rio de Janeiro, desde 2006).
HTML, CSS e JavaScript puros: sem build obrigatório, sem dependências e hospedável em qualquer servidor
estático (Netlify, Vercel, Cloudflare Pages, GitHub Pages, hospedagem comum).

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Estrutura

```
index.html                  Página principal (intro, hero, empresa, soluções, encontre sua solução,
                            diferenciais, aplicações, projetos, engenharia, segurança, como funciona,
                            orçamento, FAQ, contato)
solucoes/                   Escoramentos, Fôrmas e Andaimes
privacidade.html            Política de Privacidade / LGPD
creditos.html               Créditos das imagens ilustrativas
404.html
assets/css/main.css         Sistema visual completo
assets/js/config.js         ← CONFIGURAÇÃO (WhatsApp, e-mail, redes, envio de leads)
assets/js/main.js           Intro, menu, animações, ferramenta “O que sua obra precisa?”
assets/js/quote.js          Formulário de orçamento, anexos e envio
assets/js/assistant.js      Assistente digital “Fale com a ARGENTO”
assets/data/obras.json      ← OBRAS / CASES (vazio até haver obras reais)
assets/img/conceitual/      Imagens ilustrativas (AVIF/WebP), a substituir por fotos reais
tools/svg.py                Gera os desenhos técnicos SVG e injeta nos HTML
tools/pages.py              Gera as páginas internas a partir de partes compartilhadas
docs/PESQUISA.md            O que foi pesquisado, confirmado e o que falta
```

Depois de editar `tools/pages.py` ou `tools/svg.py`:

```bash
python3 tools/pages.py && python3 tools/svg.py
```

## Antes de publicar — checklist

1. **Domínio**: o site usa `https://www.argentoescoramentos.com.br` como domínio provisório em
   canonical, Open Graph, Schema.org, `sitemap.xml` e `robots.txt`. Substitua pelo domínio real
   (busca e substituição em todo o projeto).
2. **Envio de leads** (`assets/js/config.js` → `leadEndpoint`): configure um endpoint que receba
   `multipart/form-data` (Formspree, Web3Forms, Getform, webhook de CRM via Make/Zapier ou API própria).
   Sem endpoint, o site **não finge** que enviou: mostra ao visitante o resumo do pedido e os canais diretos
   (telefone, WhatsApp/e-mail quando configurados).
3. **WhatsApp**: preencher `whatsapp` somente após confirmação. O botão flutuante, o card de contato
   e os atalhos do assistente aparecem automaticamente.
4. **E-mail e redes sociais**: preencher apenas com canais oficiais confirmados.
5. **Fotos reais**: substituir as imagens ilustrativas (selo “Imagem ilustrativa”) por fotos de obras e
   equipamentos da ARGENTO. Gere AVIF/WebP em 560, 960 e 1920 px; ao trocar, remova o selo e atualize
   `creditos.html`.
6. **Obras**: preencher `assets/data/obras.json` seguindo o modelo (desafio → solução → resultado).
   Cliente apenas se for público e autorizado.
7. **Logotipo e cor**: se houver logotipo oficial, substitua a marca em `tools/svg.py` (`mark()`),
   `assets/img/favicon.svg`, `assets/img/logo-argento.svg` e os ícones PNG; ajuste `--signal` em
   `main.css` para a cor da marca.

## Confirmar com a ARGENTO

- Se o endereço da Av. Marechal Floriano é usado para atendimento (o site o apresenta como
  “endereço cadastral”, sem mapa).
- Região de atendimento (o site diz apenas que a sede é no Rio de Janeiro e que outras cidades são avaliadas).
- Serviços técnicos efetivamente oferecidos (projeto/dimensionamento de escoramento, acompanhamento,
  assistência técnica, logística, BIM/Revit). Nenhum deles é prometido no site até ser confirmado.
- Menção a “profissionais com formação em engenharia” (seção Engenharia), baseada em perfis do LinkedIn.
- Nomes e cargos da direção exibidos na seção Empresa (German A. Vassallo, Diretor; Bibiana Mendes,
  Diretora comercial).
- Endereço/telefone da Barra da Tijuca encontrado em guia telefônico (não usado).

## Assistente digital

Funciona no navegador, sem IA externa: responde apenas com o conteúdo confirmado do site e coleta
nome, empresa, WhatsApp, cidade, tipo de obra, necessidade e prazo. Perguntas sobre carga, cálculo,
dimensionamento, montagem, segurança estrutural, compatibilidade ou responsabilidade técnica recebem a
resposta padrão e iniciam a coleta de dados:

> “Essa questão depende das características específicas da obra. Posso coletar algumas informações
> para que a equipe da ARGENTO avalie seu projeto.”

Os leads do assistente usam o mesmo `leadEndpoint` do formulário (campo `origem = assistente`).

## Qualidade

- Mobile first: menu em tela cheia, barra fixa “Ligar / Orçamento”, assistente em tela cheia, formulário em uma coluna.
- `prefers-reduced-motion`: intro, parallax e animações desativados.
- Intro exibida uma vez por sessão, encurtada no celular, com botão “Pular” e tecla Esc.
- Imagens AVIF/WebP com `srcset`, carregamento lento abaixo da dobra, hero com `fetchpriority="high"`.
- HTML semântico, foco visível, labels, navegação por teclado, textos alternativos.
- SEO: títulos e descrições por página, Open Graph, Schema.org (`LocalBusiness`, `Service`,
  `BreadcrumbList`), `sitemap.xml`, `robots.txt`.

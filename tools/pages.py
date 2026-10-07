#!/usr/bin/env python3
"""Gera as páginas internas (soluções, privacidade, créditos, 404) com
cabeçalho, rodapé, assistente e botões compartilhados.

Uso: python3 tools/pages.py && python3 tools/svg.py
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://www.argentoescoramentos.com.br"


def head(title, desc, path, r, extra=""):
    return f"""<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="canonical" href="{SITE}/{path}">
  <meta name="theme-color" content="#0d0f12">
  <meta name="format-detection" content="telephone=no">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="ARGENTO — Escoramentos | Fôrmas | Andaimes">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:url" content="{SITE}/{path}">
  <meta property="og:image" content="{SITE}/assets/img/og-argento.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="{r}assets/img/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="{r}assets/img/apple-touch-icon.png">
  <link rel="manifest" href="{r}site.webmanifest">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="{r}assets/css/main.css">{extra}
  <script>document.documentElement.classList.add('js');</script>
  <script src="{r}assets/js/config.js" defer></script>
  <script src="{r}assets/js/main.js" defer></script>
  <script src="{r}assets/js/quote.js" defer></script>
  <script src="{r}assets/js/assistant.js" defer></script>
</head>
<body data-root="{r}">
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
"""


def header(r):
    h = f"{r}index.html"
    return f"""
  <header class="header" id="header">
    <div class="wrap header__inner">
      <a class="brand" href="{h}" aria-label="ARGENTO — página inicial">
        <!--svg:mark--><!--/svg:mark-->
        <span class="brand__text">
          <span class="brand__name">ARGENTO</span>
          <span class="brand__sub">Escoramentos · Fôrmas · Andaimes</span>
        </span>
      </a>
      <nav class="nav" aria-label="Principal">
        <ul class="nav__list">
          <li><a href="{h}#empresa">Empresa</a></li>
          <li><a href="{r}solucoes/escoramentos.html">Escoramentos</a></li>
          <li><a href="{r}solucoes/formas.html">Fôrmas</a></li>
          <li><a href="{r}solucoes/andaimes.html">Andaimes</a></li>
          <li><a href="{h}#engenharia">Engenharia</a></li>
          <li><a href="{h}#seguranca">Segurança</a></li>
          <li><a href="{h}#contato">Contato</a></li>
        </ul>
        <a class="btn" href="{h}#orcamento">Solicitar orçamento</a>
      </nav>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Abrir menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <div class="mobile-menu" id="mobile-menu" aria-label="Menu">
    <ul class="mobile-menu__list">
      <li><a href="{h}"><small>00</small>Início</a></li>
      <li><a href="{h}#empresa"><small>01</small>Empresa</a></li>
      <li><a href="{r}solucoes/escoramentos.html"><small>02</small>Escoramentos</a></li>
      <li><a href="{r}solucoes/formas.html"><small>03</small>Fôrmas</a></li>
      <li><a href="{r}solucoes/andaimes.html"><small>04</small>Andaimes</a></li>
      <li><a href="{h}#engenharia"><small>05</small>Engenharia</a></li>
      <li><a href="{h}#faq"><small>06</small>Dúvidas</a></li>
      <li><a href="{h}#contato"><small>07</small>Contato</a></li>
    </ul>
    <div class="mobile-menu__foot">
      <a class="btn btn--block" href="{h}#orcamento">Solicitar orçamento <span class="arrow" aria-hidden="true">→</span></a>
      <p>Telefone: <a href="tel:+552125162761">(21) 2516-2761</a></p>
    </div>
  </div>
"""


def footer(r):
    h = f"{r}index.html"
    return f"""
  <footer class="footer">
    <div class="wrap">
      <div class="footer__top">
        <div class="footer__brand">
          <a class="brand" href="{h}" aria-label="ARGENTO — página inicial">
            <!--svg:mark--><!--/svg:mark-->
            <span class="brand__text"><span class="brand__name">ARGENTO</span></span>
          </a>
          <p>Escoramentos • Fôrmas • Andaimes</p>
        </div>
        <div class="footer__cols">
          <div>
            <h3>Navegação</h3>
            <ul>
              <li><a href="{h}#empresa">Empresa</a></li>
              <li><a href="{h}#solucoes">Soluções</a></li>
              <li><a href="{h}#aplicacoes">Aplicações</a></li>
              <li><a href="{h}#projetos">Projetos</a></li>
              <li><a href="{h}#engenharia">Engenharia</a></li>
              <li><a href="{h}#seguranca">Segurança</a></li>
              <li><a href="{h}#faq">FAQ</a></li>
              <li><a href="{h}#contato">Contato</a></li>
            </ul>
          </div>
          <div>
            <h3>Soluções</h3>
            <ul>
              <li><a href="{r}solucoes/escoramentos.html">Escoramentos</a></li>
              <li><a href="{r}solucoes/formas.html">Fôrmas</a></li>
              <li><a href="{r}solucoes/andaimes.html">Andaimes</a></li>
            </ul>
          </div>
          <div>
            <h3>Legal</h3>
            <ul>
              <li><a href="{r}privacidade.html">Política de Privacidade</a></li>
              <li><a href="{r}privacidade.html#lgpd">LGPD</a></li>
              <li><a href="{r}creditos.html">Créditos de imagens</a></li>
            </ul>
            <ul data-social style="margin-top:1rem"></ul>
          </div>
        </div>
      </div>
      <div class="footer__legal">
        <p>Equipamentos Argento Brasileiros Locação de Bens Móveis Ltda. · CNPJ 08.311.194/0001-58<br>Av. Marechal Floriano, 199, Grupo 605 · Centro · Rio de Janeiro — RJ · CEP 20080-005</p>
        <p>© <span data-year>2026</span> ARGENTO. Todos os direitos reservados.</p>
      </div>
      <div class="footer__wordmark" aria-hidden="true">ARGENTO</div>
    </div>
  </footer>

  <div class="action-bar" id="action-bar">
    <a href="tel:+552125162761">
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>
      Ligar
    </a>
    <a class="is-primary" href="{h}#orcamento">Orçamento →</a>
  </div>

  <div class="floaters">
    <a class="fab fab--wa" id="fab-wa" href="#" target="_blank" rel="noopener" hidden aria-label="Conversar pelo WhatsApp">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.4-.3z"/></svg>
      <span class="fab__label">WhatsApp</span>
    </a>
    <button class="fab" id="fab-chat" type="button" aria-controls="chat" aria-expanded="false">
      <span class="fab__dot" aria-hidden="true"></span>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M4 5h16v11H11l-5 4v-4H4z"/><path stroke="currentColor" stroke-width="1.6" d="M8 10h8M8 13h5"/></svg>
      <span class="fab__label">Fale com a ARGENTO</span>
    </button>
  </div>

  <section class="chat" id="chat" role="dialog" aria-modal="false" aria-labelledby="chat-title" hidden>
    <header class="chat__head">
      <div class="chat__who">
        <!--svg:mark--><!--/svg:mark-->
        <div><strong id="chat-title">Fale com a ARGENTO</strong><small>Assistente digital</small></div>
      </div>
      <button class="chat__close" type="button" data-close-chat aria-label="Fechar assistente">×</button>
    </header>
    <div class="chat__log" id="chat-log" role="log" aria-live="polite"></div>
    <div class="chat__chips" id="chat-chips"></div>
    <form class="chat__form" id="chat-form" autocomplete="off">
      <label class="sr-only" for="chat-input">Digite sua mensagem</label>
      <input id="chat-input" placeholder="Digite sua pergunta…" maxlength="500">
      <button type="submit">Enviar</button>
    </form>
  </section>
</body>
</html>
"""


def picture(name, alt, w, h, sizes="100vw", eager=False):
    b = f"assets/img/conceitual/{name}"
    load = 'fetchpriority="high"' if eager else 'loading="lazy"'
    return (
        f'<picture><source type="image/avif" srcset="../{b}-960.avif 960w, ../{b}-1920.avif 1920w" sizes="{sizes}">'
        f'<source type="image/webp" srcset="../{b}-960.webp 960w, ../{b}-1920.webp 1920w" sizes="{sizes}">'
        f'<img src="../{b}-1920.webp" alt="{alt}" width="{w}" height="{h}" {load} decoding="async"></picture>'
    )


# --------------------------------------------------------------------------- soluções
SOLUTIONS = {
    "escoramentos": {
        "title": "Escoramentos",
        "seo": "Escoramento e cimbramento no Rio de Janeiro | ARGENTO",
        "desc": "Escoramento e cimbramento para lajes, vigas e estruturas de concreto. ARGENTO, no Rio de Janeiro desde 2006. Solicite orçamento.",
        "lead": "Sistemas destinados ao suporte provisório das estruturas durante a execução — da laje convencional às situações com maiores alturas, vãos ou cargas.",
        "num": "01",
        "img": ("escoras-detalhe", "Escoras metálicas reguláveis agrupadas em suporte de transporte", 1920, 1044),
        "need": "Escoramento",
        "systems": [
            {
                "name": "Escoramento",
                "svg": "escoramento",
                "text": "Suporte provisório para lajes, vigas e demais elementos de concreto durante a concretagem e a cura, até que a estrutura alcance condição de se sustentar.",
                "when": ["Lajes e vigas de concreto moldado no local", "Edificações residenciais, comerciais e industriais", "Execução pavimento a pavimento"],
            },
            {
                "name": "Cimbramento",
                "svg": "torre",
                "text": "Estruturas de suporte para situações que exigem maior capacidade: grandes alturas, vãos amplos ou cargas elevadas.",
                "when": ["Pés-direitos elevados e grandes vãos", "Obras de arte e infraestrutura", "Estruturas especiais"],
            },
        ],
        "info": ["Planta de fôrmas ou projeto estrutural", "Pé-direito e espessura das lajes", "Área e número de pavimentos", "Data prevista de início e duração da etapa"],
    },
    "formas": {
        "title": "Fôrmas",
        "seo": "Fôrma metálica e fôrma deslizante para concreto | ARGENTO",
        "desc": "Fôrma metálica, fôrma deslizante e travamento para execução de elementos estruturais em concreto. ARGENTO, Rio de Janeiro. Solicite orçamento.",
        "lead": "Soluções destinadas à execução de elementos estruturais em concreto, com geometria definida, alinhamento e prumo.",
        "num": "02",
        "img": None,
        "need": "Fôrmas",
        "systems": [
            {
                "name": "Fôrma metálica",
                "svg": "formas",
                "text": "Painéis metálicos para moldar pilares, paredes, vigas e outros elementos de concreto — especialmente indicados quando há repetição de peças ao longo da obra.",
                "when": ["Pilares, paredes e vigas", "Elementos com geometria repetitiva", "Obras com sequência de concretagens"],
            },
            {
                "name": "Fôrma deslizante",
                "svg": "deslizante",
                "text": "Sistema para estruturas verticais executadas de forma contínua, em que a fôrma avança conforme a concretagem progride.",
                "when": ["Reservatórios e silos", "Núcleos e caixas de elevador", "Pilares e estruturas altas de seção constante"],
            },
            {
                "name": "Travamento",
                "svg": "travamento",
                "text": "Elementos que garantem alinhamento, prumo e estabilidade das fôrmas durante a concretagem, resistindo à pressão do concreto fresco.",
                "when": ["Fôrmas de pilares, vigas e paredes", "Alinhamento e prumo durante a concretagem", "Complemento aos sistemas de fôrma"],
            },
        ],
        "info": ["Projeto estrutural ou de fôrmas", "Tipo de elemento e dimensões principais", "Quantidade de repetições previstas", "Cronograma de concretagens"],
    },
    "andaimes": {
        "title": "Andaimes",
        "seo": "Andaimes e andaime tubular no Rio de Janeiro | ARGENTO",
        "desc": "Andaimes e andaime tubular convencional para fachadas, reformas, manutenção e obras. ARGENTO, Rio de Janeiro, desde 2006. Solicite orçamento.",
        "lead": "Soluções de acesso e trabalho temporário para diferentes situações de obra — de fachadas e reformas a ambientes com geometria irregular.",
        "num": "03",
        "img": ("reforma-fachada", "Andaime montado junto à fachada de um prédio em reforma", 1920, 1440),
        "need": "Andaimes",
        "systems": [
            {
                "name": "Andaimes",
                "svg": "andaimes",
                "text": "Estruturas de acesso e posição de trabalho em altura, montadas em módulos conforme a altura e a extensão a atender.",
                "when": ["Fachadas, alvenaria e revestimento", "Reformas e recuperação de fachadas", "Manutenção predial e industrial"],
            },
            {
                "name": "Tubular convencional",
                "svg": "tubular",
                "text": "Sistema de tubos e conexões que se adapta a geometrias variadas e a situações em que a montagem modular não se encaixa.",
                "when": ["Geometrias irregulares e interferências", "Ambientes industriais", "Estruturas de acesso sob medida"],
            },
        ],
        "info": ["Altura e extensão a atender", "Tipo de serviço a executar", "Condições de apoio no local", "Fotos da fachada ou do ambiente"],
    },
}


def solution_page(key):
    s = SOLUTIONS[key]
    r = "../"
    path = f"solucoes/{key}.html"
    crumbs_ld = json.dumps({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Início", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": "Soluções", "item": f"{SITE}/#solucoes"},
            {"@type": "ListItem", "position": 3, "name": s["title"], "item": f"{SITE}/{path}"},
        ],
    }, ensure_ascii=False)
    service_ld = json.dumps({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": s["title"],
        "serviceType": ", ".join(x["name"] for x in s["systems"]),
        "description": s["lead"],
        "provider": {"@id": f"{SITE}/#empresa", "@type": "LocalBusiness", "name": "ARGENTO", "telephone": "+55-21-2516-2761"},
        "areaServed": {"@type": "City", "name": "Rio de Janeiro"},
    }, ensure_ascii=False)
    extra = f'\n  <script type="application/ld+json">{crumbs_ld}</script>\n  <script type="application/ld+json">{service_ld}</script>'
    out = head(s["seo"], s["desc"], path, r, extra) + header(r)
    media = ""
    if s["img"]:
        n, alt, w, h = s["img"]
        media = f'<div class="page-hero__media" data-parallax="0.15">{picture(n, alt, w, h, eager=True)}</div><span class="img-note">Imagem ilustrativa</span>'
    out += f"""
  <main id="conteudo">
    <section class="page-hero" data-crosshair>
      {media}
      <div class="hero__grid blueprint" aria-hidden="true"></div>
      <div class="wrap">
        <nav class="crumbs" aria-label="Você está em"><a href="../index.html">Início</a><span aria-hidden="true">/</span><a href="../index.html#solucoes">Soluções</a><span aria-hidden="true">/</span><span aria-current="page">{s["title"]}</span></nav>
        <h1>{s["title"]}</h1>
        <p>{s["lead"]}</p>
        <div class="hero__cta" style="margin-top:2rem">
          <a class="btn" href="../index.html?necessidade={s["need"]}#orcamento">Solicitar orçamento <span class="arrow" aria-hidden="true">→</span></a>
          <a class="btn btn--ghost" href="#sistemas">Ver sistemas</a>
        </div>
        <ul class="hero__lines" style="margin-top:2.5rem" aria-label="Linhas">{"".join(f"<li>{x['name']}</li>" for x in s["systems"])}</ul>
      </div>
    </section>

    <section class="section blueprint-light" id="sistemas" aria-label="Sistemas">
      <div class="wrap">
        <div class="systems">
"""
    for i, x in enumerate(s["systems"], 1):
        out += f"""          <article class="system">
            <div class="system__art reveal" data-build aria-hidden="true"><div class="blueprint"></div><span class="tag">{s["num"]}.{i} · {x["name"]}</span><!--svg:{x["svg"]}--><!--/svg:{x["svg"]}--></div>
            <div class="system__body">
              <span class="n reveal">{s["num"]}.{i}</span>
              <h2 class="reveal" style="--d:1">{x["name"]}</h2>
              <p class="reveal" style="--d:2">{x["text"]}</p>
              <div class="reveal" style="--d:3">
                <p class="eyebrow" style="margin-bottom:1rem">Aplicações típicas</p>
                <ul>{"".join(f"<li>{w}</li>" for w in x["when"])}</ul>
              </div>
            </div>
          </article>
"""
    out += f"""        </div>
        <p class="notice reveal" style="margin-top:clamp(3rem,2rem + 3vw,5rem)">Esta página descreve aplicações típicas de cada sistema. Especificações, capacidades e compatibilidade com a sua obra são definidas pela equipe da ARGENTO a partir do projeto.</p>
      </div>
    </section>

    <section class="section is-dark" aria-labelledby="info-title">
      <div class="wrap finder" style="align-items:center">
        <div>
          <p class="eyebrow reveal"><b>{s["num"]}</b> Orçamento</p>
          <h2 id="info-title" class="reveal" style="--d:1;font-size:var(--fs-2xl);font-variation-settings:'wdth' 86;margin-top:1.25rem">Precisa de {s["title"].lower()}?</h2>
          <p class="reveal" style="--d:2;margin-top:1.25rem;color:var(--silver)">Envie as informações da obra. A equipe analisa e indica o sistema adequado.</p>
          <div class="hero__cta reveal" style="--d:3;margin-top:2rem">
            <a class="btn" href="../index.html?necessidade={s["need"]}#orcamento">Solicitar orçamento <span class="arrow" aria-hidden="true">→</span></a>
            <button class="btn btn--ghost" type="button" data-open-chat>Tirar uma dúvida</button>
          </div>
        </div>
        <div class="finder__panel reveal" style="--d:1;min-height:0">
          <div class="blueprint" aria-hidden="true"></div>
          <div class="finder__body">
            <p class="finder__label">Para um orçamento mais preciso, tenha em mãos</p>
            <ul class="checklist">{"".join(f"<li>{w}</li>" for w in s["info"])}</ul>
            <p style="font-size:var(--fs-sm)">Planta, projeto ou fotos podem ser anexados no formulário (PDF, DWG, DXF ou imagens).</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section is-ink" aria-label="Outras soluções" style="padding-block:clamp(3rem,2rem + 3vw,5rem)">
      <div class="wrap">
        <p class="eyebrow" style="margin-bottom:1.5rem">Outras soluções</p>
        <div class="other-sol">
"""
    for k2, s2 in SOLUTIONS.items():
        if k2 != key:
            out += f'          <a href="{k2}.html"><span>{s2["title"]}</span><span>{s2["num"]} →</span></a>\n'
    out += """        </div>
      </div>
    </section>
  </main>
"""
    out += footer(r)
    (ROOT / path).write_text(out, encoding="utf-8")
    print("gerado:", path)


# --------------------------------------------------------------------------- privacidade
def privacy():
    r = ""
    out = head("Política de Privacidade | ARGENTO", "Como a ARGENTO trata os dados pessoais enviados pelo site, em conformidade com a LGPD (Lei nº 13.709/2018).", "privacidade.html", r) + header(r)
    out += """
  <main id="conteudo">
    <section class="page-hero">
      <div class="hero__grid blueprint" aria-hidden="true"></div>
      <div class="wrap">
        <nav class="crumbs" aria-label="Você está em"><a href="index.html">Início</a><span aria-hidden="true">/</span><span aria-current="page">Privacidade</span></nav>
        <h1>Política de Privacidade</h1>
        <p>Como tratamos os dados pessoais enviados por este site, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).</p>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="prose">
          <h2>1. Quem é o controlador</h2>
          <p>Equipamentos Argento Brasileiros Locação de Bens Móveis Ltda. (ARGENTO), CNPJ 08.311.194/0001-58, com endereço cadastral na Av. Marechal Floriano, 199, Grupo 605, Centro, Rio de Janeiro — RJ, CEP 20080-005. Telefone: (21) 2516-2761.</p>

          <h2>2. Quais dados coletamos</h2>
          <p>Apenas os dados que você informa voluntariamente no formulário de orçamento ou no assistente digital:</p>
          <ul>
            <li>Nome, empresa, WhatsApp/telefone e e-mail;</li>
            <li>Informações sobre a obra: tipo, cidade, etapa, prazo e descrição da necessidade;</li>
            <li>Arquivos anexados, como plantas, projetos e fotos.</li>
          </ul>
          <p>Não solicitamos dados sensíveis. Pedimos que os arquivos enviados não contenham dados pessoais de terceiros além do necessário.</p>

          <h2>3. Para que usamos</h2>
          <ul>
            <li>Responder à sua solicitação e elaborar orçamento;</li>
            <li>Entrar em contato sobre a necessidade informada;</li>
            <li>Cumprir obrigações legais, quando aplicável.</li>
          </ul>
          <p>Não vendemos nem cedemos seus dados para fins de publicidade de terceiros.</p>

          <h2 id="lgpd">4. Bases legais (LGPD)</h2>
          <p>O tratamento se apoia no consentimento do titular (art. 7º, I) e na execução de procedimentos preliminares relacionados a contrato a pedido do titular (art. 7º, V).</p>

          <h2>5. Compartilhamento</h2>
          <p>Os dados podem ser processados por fornecedores que viabilizam o recebimento dos formulários e a comunicação (por exemplo, serviços de formulário, e-mail ou CRM), sempre limitados à finalidade descrita. As fontes tipográficas do site são carregadas a partir do Google Fonts, o que envolve o envio do endereço IP do navegador ao Google.</p>

          <h2>6. Armazenamento e retenção</h2>
          <p>Os dados são mantidos pelo tempo necessário para atender à solicitação e à eventual relação comercial, ou pelo prazo exigido em lei. Depois disso, são eliminados ou anonimizados.</p>

          <h2>7. Cookies e armazenamento local</h2>
          <p>Este site não utiliza cookies de rastreamento ou publicidade. Usa apenas o armazenamento da sessão do navegador para lembrar se a animação de abertura já foi exibida e para manter preenchidos os dados que você informou no assistente. Essas informações ficam no seu navegador e são apagadas ao fechar a sessão.</p>

          <h2>8. Seus direitos</h2>
          <p>Você pode solicitar, a qualquer momento: confirmação e acesso aos dados, correção, anonimização, bloqueio ou eliminação, portabilidade, informação sobre compartilhamento e revogação do consentimento (art. 18 da LGPD). Para exercer seus direitos, entre em contato pelo telefone (21) 2516-2761<span data-privacy-email></span>.</p>

          <h2>9. Segurança</h2>
          <p>Adotamos medidas técnicas e administrativas razoáveis para proteger os dados contra acesso não autorizado, perda ou alteração.</p>

          <h2>10. Atualizações</h2>
          <p>Esta política pode ser atualizada. A versão vigente é sempre a publicada nesta página.</p>
          <p><small>Última atualização: outubro de 2026.</small></p>
        </div>
      </div>
    </section>
  </main>
  <script>
    document.addEventListener("DOMContentLoaded", function () {
      var c = window.ARGENTO_CONFIG || {}, n = document.querySelector("[data-privacy-email]");
      if (c.email && n) n.innerHTML = ' ou pelo e-mail <a href="mailto:' + c.email + '">' + c.email + "</a>";
    });
  </script>
"""
    out += footer(r)
    (ROOT / "privacidade.html").write_text(out, encoding="utf-8")
    print("gerado: privacidade.html")


# --------------------------------------------------------------------------- créditos
def credits():
    r = ""
    data = json.loads((ROOT / "docs" / "creditos-imagens.json").read_text(encoding="utf-8"))
    lic_url = {
        "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/deed.pt-br",
        "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/deed.pt-br",
        "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/deed.pt-br",
        "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/deed.pt-br",
        "CC0": "https://creativecommons.org/publicdomain/zero/1.0/deed.pt-br",
    }
    items = ""
    for c in data:
        t = c["title"].replace("File:", "")
        lu = lic_url.get(c["license"], "#")
        items += (
            f'<li><strong>{t}</strong><span>Autor: {c["author"]} · Licença: <a href="{lu}" target="_blank" rel="noopener">{c["license"]}</a> · '
            f'<a href="{c["source"]}" target="_blank" rel="noopener">Fonte (Wikimedia Commons)</a></span>'
            f"<span>Uso no site: imagem ilustrativa, convertida para tons de grafite e redimensionada.</span></li>"
        )
    out = head("Créditos de imagens | ARGENTO", "Créditos e licenças das imagens ilustrativas utilizadas no site da ARGENTO.", "creditos.html", r) + header(r)
    out += f"""
  <main id="conteudo">
    <section class="page-hero">
      <div class="hero__grid blueprint" aria-hidden="true"></div>
      <div class="wrap">
        <nav class="crumbs" aria-label="Você está em"><a href="index.html">Início</a><span aria-hidden="true">/</span><span aria-current="page">Créditos</span></nav>
        <h1>Créditos de imagens</h1>
        <p>As fotografias marcadas como “Imagem ilustrativa” são de bancos de imagens livres e não retratam obras ou equipamentos da ARGENTO. Elas serão substituídas por registros reais das obras atendidas.</p>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <ul class="credits">{items}</ul>
        <p class="notice" style="margin-top:2rem">Os desenhos técnicos do site são esquemas ilustrativos, sem escala, e não representam especificações de equipamentos.</p>
      </div>
    </section>
  </main>
"""
    out += footer(r)
    (ROOT / "creditos.html").write_text(out, encoding="utf-8")
    print("gerado: creditos.html")


# --------------------------------------------------------------------------- 404
def notfound():
    r = "/"
    out = head("Página não encontrada | ARGENTO", "A página procurada não foi encontrada.", "404.html", r) + header(r)
    out += """
  <main id="conteudo">
    <section class="page-hero" style="min-height:100svh;display:grid;align-items:center">
      <div class="hero__grid blueprint" aria-hidden="true"></div>
      <div class="wrap">
        <p class="eyebrow"><b>404</b> Página não encontrada</p>
        <h1>Esta estrutura não está aqui.</h1>
        <p>O endereço pode ter mudado. Volte ao início ou fale com a equipe.</p>
        <div class="hero__cta" style="margin-top:2rem">
          <a class="btn" href="/index.html">Voltar ao início <span class="arrow" aria-hidden="true">→</span></a>
          <a class="btn btn--ghost" href="/index.html#orcamento">Solicitar orçamento</a>
        </div>
      </div>
    </section>
  </main>
"""
    out += footer(r).replace('<div class="footer__wordmark" aria-hidden="true">ARGENTO</div>', "")
    (ROOT / "404.html").write_text(out.replace('<meta name="description"', '<meta name="robots" content="noindex">\n  <meta name="description"'), encoding="utf-8")
    print("gerado: 404.html")


if __name__ == "__main__":
    for k in SOLUTIONS:
        solution_page(k)
    privacy()
    credits()
    notfound()

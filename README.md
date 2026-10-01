# Graal Marcenaria — site

Site institucional de página única para a **Graal Marcenaria** (móveis planejados e sob medida, Joá, Rio de Janeiro).

HTML, CSS e JavaScript puros, sem etapa de build. Para ver localmente:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

Para publicar, envie a pasta inteira para qualquer hospedagem estática (Netlify, Vercel, GitHub Pages, Hostinger etc.).

## Estrutura

Início → Projetos (portfólio com filtros e galeria ampliada) → Ambientes → Sobre → Processo → Avaliações → Contato/Orçamento.

O CTA principal abre o WhatsApp **(21) 99868-0606** com a mensagem pronta. O formulário de orçamento monta a mensagem a partir dos campos (nome, ambiente, bairro, prazo, detalhes).

```
index.html
assets/css/style.css
assets/js/main.js        ← número do WhatsApp na constante WHATSAPP
assets/img/              ← fotos
```

## Antes de publicar

- **Fotos:** as imagens atuais são de banco livre (Unsplash, licença gratuita para uso comercial) e servem como substitutas. O ideal é trocar pelas fotos reais dos projetos da Graal, mantendo os mesmos nomes de arquivo em `assets/img/` (`hero-1..3`, `proj-*`, `amb-*`, `artesanal`, `oficina`, `proc-projeto`).
- **Categorias de ambientes** (cozinhas, closets, quartos, salas, painéis, banheiros, home office, sob medida): confirmar com a empresa.
- **Dados confirmados no perfil comercial:** endereço Rua Maria Luíza Pitanga, 45, Loja E — Joá, CEP 22611-190; WhatsApp (21) 99868-0606; nota 5,0 com 49 avaliações no Google; horário seg–sex 9h–21h, sáb 10h–16h. Se a nota ou o número de avaliações mudarem, atualize no `index.html` (busque por "49" e "5,0").
- **Instagram:** nenhum perfil foi encontrado; se existir, dá para incluir no rodapé.

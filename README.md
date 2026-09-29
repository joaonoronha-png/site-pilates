# MG Estética Automotiva — site

Site estático (HTML + CSS + JS, sem build) da MG Estética Automotiva, Cavalcanti — Rio de Janeiro/RJ.

## Rodar localmente

Abra `index.html` no navegador, ou sirva a pasta:

```bash
python3 -m http.server 8000
```

## Estrutura

- `index.html` — conteúdo, SEO local e dados estruturados (schema.org)
- `styles.css` — visual (paleta preta/grafite, detalhes em vermelho)
- `script.js` — WhatsApp com mensagem automática, galeria + filtros + tela cheia, comparador durante/depois, status "aberto agora"
- `assets/img/` — fotos reais publicadas no Instagram oficial [@_mg_estetica_automotiva](https://www.instagram.com/_mg_estetica_automotiva/) (versão `-sm` = miniatura)
- `briefing-imagens.md` — regras de uso de imagens

## Onde editar

- Telefone/WhatsApp: `WA_NUMBER` em `script.js` (os links `data-wa` são reescritos automaticamente)
- Fotos da galeria: lista `WORKS` em `script.js`
- Horário: tabela em `index.html` e `HOURS` em `script.js`

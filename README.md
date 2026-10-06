# BCM Dermatologia Especializada — site institucional

Site institucional premium da **BCM Dermatologia Especializada** (Barra da Tijuca, Rio de Janeiro): páginas pré-renderizadas, busca no conteúdo, explorador interativo da especialidade, perfis das médicas, FAQ com busca e o **Assistente BCM**.

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:5173
npm test           # testes do motor do Assistente BCM
npm run build      # gera dist/ (HTML estático pré-renderizado)
npm run preview    # serve o build
```

---

## 1. Resultado da pesquisa

> **Atenção ao nome:** não encontramos nenhuma empresa chamada "BCM **Medicina** Especializada". A correspondência confirmada é **BCM Dermatologia Especializada**, e o site usa esse nome. Se o cliente for outra empresa, os dados em `src/data/` precisam ser substituídos.

### Dados confirmados

| Informação | Valor | Fonte |
|---|---|---|
| Nome | BCM Dermatologia Especializada | Site da Dra. Marina Bittencourt; ficha pública Google/Waze |
| Razão social / CNPJ | BCM Dermatologia Ltda · 30.776.724/0001-92 · aberta em 25/06/2018 | Registro público da Receita (Econodata / Casa dos Dados) |
| Endereço | Av. das Américas, 2480, Bloco 3, Sala S120 — Barra da Tijuca, RJ, 22640-101 | Site da Dra. Marina; Google/Waze |
| Telefone | (21) 3549-0047 | Site da Dra. Marina; Google/Waze |
| WhatsApp | (21) 97116-4164 | Site da Dra. Marina (seção da unidade BCM) |
| Horário | Seg, qua, qui e sex 8h–20h; ter 8h–22h | Ficha pública Google/Waze |
| Atividade | Atividade médica ambulatorial com recursos para realização de procedimentos cirúrgicos (CNAE principal) | Registro do CNPJ |
| Sócias | Marina de Almeida Bittencourt; Bruna Duque Estrada Pinto Keddi; Carla Helena Tamler de Faria | Registro do CNPJ |

### Profissionais

| Profissional | Registros | Vínculo com a BCM | Fonte |
|---|---|---|---|
| Dra. Marina Bittencourt | CRM-RJ 52749591 · CRM-SP 209.114 · RQE 31826 · Medicina UFRJ · Dermatologia Inst. Prof. Azulay · Membro Titular SBD · Membro GBM | **Atende na BCM** (site oficial) + sócia | dramarinabittencourt.com.br |
| Dra. Bruna Duque Estrada | CRM-RJ 801313 · RQE 24366 | Sócia (CNPJ); o perfil público lista atendimento em outra clínica (Leblon) | Doctoralia |
| Dra. Carla Tamler | CRM-RJ 777153 · RQE 25014 | Sócia (CNPJ); o perfil público lista atendimento em outra clínica (Leblon) | Doctoralia |

### Não encontrado (o site diz isso abertamente, sem inventar)

- Instagram, Facebook ou site **institucional** da BCM (só o perfil profissional @dramarinabittencourt).
- E-mail, convênios, valores, lista de procedimentos, atendimento aos sábados, estacionamento, teleconsulta.
- **Fotos reais da clínica** (fachada, recepção, consultórios) acessíveis publicamente. Os perfis do Google Maps e do Instagram não puderam ser consultados automaticamente.
- Logo e identidade visual oficiais. Foi criada uma **identidade provisória** (símbolo com três arcos, as camadas da pele, mais a tipografia), fácil de substituir em `src/lib/html.js` (`logoMark`/`logo`) e `public/favicon.svg`.

### Itens para a BCM confirmar antes de publicar

1. **Diretor(a) técnico(a)**: pelas regras de publicidade médica do CFM, o site da clínica deve exibir nome, CRM e RQE do(a) diretor(a) técnico(a). A informação não é pública. Adicione em `src/data/site.js` e no rodapé.
2. Se a **Dra. Bruna** e a **Dra. Carla** atendem na unidade da Barra (hoje o site diz apenas "sócia" e orienta a confirmar a agenda com a equipe).
3. Vínculo do registro **CRM 777153** com a sócia "Carla Helena Tamler de Faria": a Doctoralia lista "Carla Helena Fontes Tamler". A correspondência é muito provável, mas é uma inferência.
4. Autorização de uso da foto da Dra. Marina (retirada do site oficial dela) e fotos das outras médicas.
5. Convênios, procedimentos, sábado, e-mail e Instagram institucional, se existirem. Basta preencher em `src/data/site.js` e `src/data/faq.js`; o site e o assistente se atualizam juntos.
6. Fotos oficiais da clínica, para substituir as ilustrativas (ver seção 3).

---

## 2. Arquitetura

```
index.html, dermatologia/, equipe/<slug>/, privacidade/   ← "cascas" HTML (preenchidas no build)
src/
  data/site.js        ← FONTE ÚNICA DE VERDADE (com fontes de cada dado)
  data/faq.js         ← 33 perguntas em 11 categorias
  pages.js            ← composição das páginas + SEO (meta, OG, Schema.org)
  components/         ← Header, Hero, Search, About, Specialties, Services, Doctors,
                        DoctorProfile, SpecialtyPage, Differentials (+Experience), Gallery,
                        FAQ, Location (+Instagram), Footer (+CTA), PrivacyPage
  client/             ← interações no navegador (motion, header, seções)
  assistant/engine.js ← motor do Assistente BCM (puro, testado)
  assistant/Assistant.js ← interface (carregada sob demanda)
  lib/                ← HTML seguro, imagens responsivas, busca (BM25), texto
  styles/             ← tokens, layout, seções, páginas, assistente
api/assistant.js      ← backend opcional com IA (serverless)
tests/                ← testes do assistente (node:test)
```

- **Pré-renderização:** os componentes são funções puras que retornam HTML. Um plugin do Vite (`vite.config.js`) as executa no build, então cada página chega pronta (SEO, acessibilidade, sem flash de conteúdo). O JS só adiciona interação.
- **Sem framework e quase sem dependências:** Vite (build), fontes auto-hospedadas (@fontsource) e o SDK da Anthropic (somente no backend opcional). JS inicial em torno de 10 kB gzip; o assistente e o índice de busca são carregados sob demanda.

## 3. Imagens

| Imagem | Origem |
|---|---|
| Foto da Dra. Marina Bittencourt | Site oficial dela (confirmar autorização) |
| Todas as demais | **Ilustrativas**, Unsplash (Licença Unsplash, uso comercial permitido), em AVIF/WebP 800/1600 px |

Nenhuma imagem ilustrativa é apresentada como sendo da BCM: todas trazem o selo "Imagem ilustrativa", e a galeria tem um aviso explícito. Para trocar pelas fotos oficiais, substitua os arquivos em `public/img/<chave>-{800,1600}.{avif,webp}` e ajuste `alt`/dimensões em `images` (`src/data/site.js`).

## 4. Assistente BCM

- **Modo atual: local.** Não há IA conectada, e a interface diz isso ("Respostas guiadas pelas informações oficiais da BCM"). O motor combina intenções, fluxo guiado de agendamento (especialidade → profissional → WhatsApp/telefone) e busca na FAQ. Quando não sabe, responde: *"Não encontrei essa informação nas informações oficiais da BCM. Posso encaminhar você para a equipe."*
- **Segurança médica:** emergência → SAMU 192; sintomas, remédios, doses, exames → não avalia e recomenda consulta. Aviso fixo no painel.
- **Ações reais apenas:** WhatsApp com mensagem pré-preenchida (editável), ligação, Google Maps/Waze e links internos. Não há agendamento simulado nem formulário fictício.
- **Ativar IA real (Claude):** publique `api/assistant.js` como função serverless (ex.: Vercel), defina `ANTHROPIC_API_KEY` **no servidor** e faça o build com `VITE_ASSISTANT_ENDPOINT=/api/assistant`. Regras locais (emergência, agendamento) continuam valendo antes da IA, e a política de privacidade é gerada automaticamente com a seção correspondente.

## 5. SEO, LGPD, acessibilidade e performance

- `title`, `description`, Open Graph, `geo.*`, Schema.org `MedicalClinic` (endereço, telefone, horários, CNPJ), `FAQPage`, `MedicalWebPage` e `Person` por profissional. Defina `SITE_URL` no build para gerar `canonical`, `og:url`/`og:image` absolutos e `sitemap.xml`.
- LGPD: sem formulários, sem cookies de rastreamento nem analytics. Fontes auto-hospedadas (sem Google Fonts). O mapa do Google só carrega após clique. O histórico do assistente fica apenas no armazenamento da sessão. A política de privacidade em `/privacidade/` descreve exatamente essas funcionalidades.
- Acessibilidade: HTML semântico, skip link, foco visível, tabs/acordeão/lightbox com teclado, `aria-live`, `prefers-reduced-motion`. O axe-core (WCAG 2 A/AA + boas práticas) retornou **0 violações** em todas as páginas.
- Responsivo de 360 px a 1920 px, verificado sem rolagem horizontal.

## 6. Auditoria final

| Item | Status |
|---|---|
| Conteúdo verdadeiro | Somente dados com fonte. Lacunas são declaradas, e há pendências na seção 1 |
| Imagens | Foto real da Dra. Marina; demais ilustrativas, licenciadas e sinalizadas |
| Contatos | `tel:`, `wa.me` e links do Maps/Waze testados no navegador |
| Assistente | 10 testes automatizados (agendamento, dados, segurança, fallback) |
| Mobile | Menu fullscreen, assistente em tela cheia, sem overflow |
| Placeholders | Nenhum texto fictício. A identidade visual é provisória (sinalizada acima) |

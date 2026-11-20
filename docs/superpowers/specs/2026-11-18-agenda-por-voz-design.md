# Agenda por voz ("Jarvis" do pai) — desenho

Data: 2026-11-18

## Intenção e o porquê

O pai do João quer uma IA que organize a agenda dele e estava prestes a contratar
uma empresa para isso. A ideia é construir antes: ele usa o nosso produto, e
depois o João pode vender o mesmo serviço para outras pessoas.

O que o pai precisa: **falar** com o celular para marcar, mudar, cancelar e
consultar compromissos; **ser avisado** antes de cada compromisso do jeito que
preferir; e ter um **site com a agenda inteira organizada**. Referência de
sensação: o vídeo do "Jarvis" (TikTok @pelainteligencia), em que a IA dá bom
dia, fala o clima, os compromissos de amanhã e oferece ajuda ("quer que eu
prepare a pauta?").

## Objetivos

1. **Falar sem abrir o app**: "E aí Siri, agenda" → ele fala o pedido → a IA
   executa e **responde em voz**. Funciona com a tela bloqueada.
2. **Falar dentro do app**: botão grande de microfone que faz a mesma coisa.
3. **Comandos em linguagem natural (pt-BR)**: marcar ("marca dentista sexta às
   10h"), mudar ("muda o compromisso do dia 20 às 13h para as 15h"), cancelar,
   consultar ("o que eu tenho amanhã?"), lembrete solto ("me lembra às 18h de
   ligar pro Carlos").
4. **Lembretes que insistem até ele confirmar**:
   - X minutos antes (padrão 30): notificação no iPhone com "Vi ✓".
   - Sem confirmação em 5 min: notificação de novo.
   - Ainda sem confirmação em mais 5 min: **ligação** com voz falando o
     compromisso, "aperte 1 para confirmar".
   - Confirmou em qualquer canal → os outros param.
   - Tempos e canais ajustáveis no geral e por compromisso (ex.: importante →
     já liga).
5. **Site com a agenda**: visão de dia, semana e lista; criar, editar e apagar
   também pelo toque; cada compromisso mostra "confirmado às 13h32" ou
   "não visto".
6. **Agenda aparece no Calendário do iPhone**: link de assinatura (feed .ics)
   que o Calendário assina, somente leitura.
7. **Bom dia**: resumo do dia falado quando ele pede ("bom dia" / "como está meu
   dia?"): compromissos de hoje, os de amanhã e o clima da cidade dele.

## Fora do escopo agora (não-objetivos)

- **WhatsApp**: fica para uma segunda fase, depois de o João conversar com o pai.
  O desenho já deixa o "canal de aviso" plugável para receber o WhatsApp depois.
- App nativo na App Store.
- Escuta contínua ("palavra de ativação" sempre ligada) — impossível no iPhone
  para apps de terceiros.
- Notícias no bom dia, preparar pauta de reunião e outras "ajudas proativas" —
  boas ideias do vídeo, ficam para depois do básico funcionar.
- Painel de vendas/cobrança para outros clientes.

## Anti-objetivos (seria fracasso mesmo funcionando)

- Ele precisar de mais de **um comando ou um toque** para falar com a IA.
- A IA **marcar errado sem avisar** (data/hora erradas). Toda ação é repetida
  em voz ("Marquei dentista sexta, dia 20, às 10h") e pedidos ambíguos geram
  uma pergunta de volta, nunca um palpite silencioso.
- Ele **perder um compromisso** porque o aviso falhou em silêncio.
- Ser complicado de configurar para ele: a instalação é feita pelo João, uma vez.

## Restrições

- Celular do pai: **iPhone**. Fuso: America/Sao_Paulo. Idioma: pt-BR.
- App web instalado na Tela de Início (PWA). No iPhone, notificações de site só
  funcionam com o app instalado assim (iOS 16.4+), e **não ficam presas na
  tela** nem têm botões de ação — por isso a insistência é feita por repetição +
  ligação, e o "Vi ✓" é tocar na notificação e confirmar na tela que abre.
- Celular só lê notificação em voz alta com fone/CarPlay; por isso a ligação é o
  canal de voz garantido.
- Custos mensais esperados baixos (hospedagem no plano gratuito/barato, IA por
  uso, ligações em centavos).
- Desde o início, **um usuário = uma conta separada** (dados isolados), para
  dar para vender a outras pessoas depois sem refazer. No começo só existe a
  conta do pai (e a do João para testes).

## Abordagens consideradas

| | Como | Troca |
|---|---|---|
| **A — escolhida** | App web instalado no iPhone + Atalho da Siri + notificações web + ligação | Rápido, sem Mac nem App Store, atualiza na hora, fácil de vender. Notificação não fica presa (resolvido com repetição + ligação). |
| B | App nativo de iPhone | Siri e alertas mais fortes, mas exige Mac, conta Apple (US$ 99/ano), revisão da App Store e muito mais tempo. Fica para o futuro se o produto pegar. |
| C | Calendário da Apple + IA por cima | Mais simples, mas sem insistência até confirmar, sem ligação e sem produto próprio. Aproveitamos só a ideia de aparecer no Calendário (feed .ics). |

O João escolheu a **A**.

## Como funciona (o que foi decidido)

### Peças
1. **App web (PWA)** — site responsivo, instalável, com tela da agenda, botão de
   microfone, configurações de aviso e login.
2. **Servidor + banco** — guarda usuários, compromissos, preferências de aviso
   e o histórico de cada aviso (enviado, confirmado).
3. **Cérebro (IA)** — recebe o texto do pedido, entende a intenção, executa na
   agenda por meio de ferramentas (criar/mudar/cancelar/listar) e devolve uma
   frase curta para ser falada.
4. **Agendador de avisos** — roda a cada minuto, vê o que precisa ser avisado,
   manda notificação, repete, e escala para ligação.
5. **Atalho da Siri** — atalho do app Atalhos que: escuta (Ditar Texto) → envia
   o texto ao servidor com a chave pessoal dele → recebe a resposta → fala
   (Falar Texto). Distribuído por link do iCloud; João instala no celular do pai.

### Fluxo de voz
- **Pela Siri**: "E aí Siri, agenda" → ditado → servidor → resposta falada.
  Se a IA precisar de esclarecimento, a resposta é a pergunta, e o atalho
  escuta de novo (até 3 rodadas).
- **No app**: botão de microfone usa o reconhecimento de voz do Safari; a
  resposta é falada pela voz do próprio iPhone. Se o reconhecimento do Safari
  não estiver disponível, o botão abre o ditado do teclado (sempre há campo de
  texto como alternativa).

### Confirmação
- Notificação → toca → abre a tela do compromisso com botão grande "Vi ✓".
- Ligação → "aperte 1 para confirmar".
- Dizer à IA "ok, vi" logo após um aviso também confirma.

### Login
- Por link enviado por e-mail (sem senha). Uma vez logado no celular, fica
  logado. O Atalho da Siri usa uma chave pessoal gerada no app (pode ser
  revogada).

## Escolhas técnicas (decisões do Claude, podem ser corrigidas)

- **Next.js (TypeScript) hospedado na Vercel** — site + servidor no mesmo
  projeto, deploy simples.
- **Supabase** (Postgres + login por e-mail) — banco com isolamento por usuário.
- **Claude (API da Anthropic)** com uso de ferramentas para o cérebro.
- **Web Push** (VAPID) para notificações no iPhone.
- **Twilio** para ligações com voz em português e "aperte 1".
- **Agendador**: tarefa agendada a cada minuto (Vercel Cron ou Supabase
  pg_cron) — o plano define qual, conforme o limite do plano gratuito.
- **Clima**: Open-Meteo (gratuito, sem chave).
- Feed .ics com endereço secreto por usuário.

## Decisões tomadas na revisão (do Claude, podem ser corrigidas)

- **Bom dia automático**: além de pedir, uma notificação opcional às 7h com o
  resumo do dia em texto; tocar nela abre o app e fala o resumo. Horário
  ajustável, pode ser desligada.
- **Horário de silêncio**: a ligação só é feita entre 7h e 22h, exceto para
  compromissos marcados como importantes. Notificações seguem normais.
- **Compartilhamento**: na v1 cada agenda é vista só pelo dono. O João acessa
  como administrador para dar suporte. Compartilhar com secretária/família fica
  para depois.
- **Repetição de aviso**: no máximo 2 notificações + 1 ligação por compromisso;
  se nada for confirmado, fica "não visto" no site.

## Deixado para quem constrói

- Estrutura de pastas, nomes de tabelas, bibliotecas de UI.
- Texto exato das falas e das notificações (curto, educado, tratando por
  "você", em pt-BR).
- Visual do site (limpo, letras grandes, pensado para uso no celular).
- Estratégia de testes.

## Voz do Jarvis (decidido em 2026-11-20)

- Estilo inspirado no Jarvis do cinema, **sem copiar a voz de nenhuma pessoa real** (nada de clonar o ator ou o dublador).
- Perfil: masculina, grave, calma, educada, ritmo um pouco mais lento; trata por "senhor" ("Pronto, senhor João.").
- Versão final: voz de IA da **ElevenLabs** (biblioteca de vozes em português), escolhida por esse perfil; chave guardada no servidor, nunca no app.
  Ajustes oferecem 3–4 vozes desse perfil com botão "Ouvir".
- Prévia: voz masculina do próprio aparelho (Felipe no iPhone), tom mais grave (pitch 0,85) e velocidade 0,96.

# Prompts para o Lovable — Jarvis

Mande **um de cada vez**. Só mande o próximo depois de testar o anterior.
Se puder, anexe junto do Prompt 1 os prints da pasta `docs/preview/` (login, hoje, agenda, assistente, aviso).

---

## Prompt 1 — App, login Microsoft e agenda do Outlook

Crie um app web chamado **Jarvis**: um assistente de agenda por voz, em português do Brasil, para um empresário do ramo imobiliário. Ele usa o **Outlook (Microsoft 365 da empresa)** como agenda. O Jarvis não tem agenda própria: lê e grava direto no calendário do Outlook dele.

**Precisa funcionar no celular (iPhone, instalado na tela de início) e no computador (navegador).**
Faça como PWA: manifest com nome "Jarvis", ícone de uma esfera de luz verde-esmeralda brilhante sobre fundo verde bem escuro, tela cheia (`display: standalone`).

**Visual** (siga os prints anexados):
- Fundo cinza-esverdeado bem claro (#eef2f1), cartões brancos com borda suave, cor principal verde-esmeralda escuro (#0f4a3f), brilho verde-água (#35c9a6), laranja para destaque e importante (#e99a2c).
- Títulos com a fonte **Sora**, texto com **Inter**. Letras grandes e fáceis de ler.
- Telas de login, boas-vindas e assistente com fundo escuro (#071311) e uma **esfera de luz animada** no centro (gradiente verde-água, brilho, "respira" devagar, pulsa quando ouve e quando fala).
- Barra inferior flutuante com: Hoje · botão redondo de microfone no centro · Agenda. Engrenagem no topo para Ajustes.
- Animações suaves e rápidas (entrada em cascata, botões que afundam ao tocar, janelas que sobem de baixo). Respeite "reduzir movimento".

**Login:** só "**Entrar com Microsoft**", com a conta do e-mail da empresa. Pede permissão de ler e escrever o calendário e ler os contatos (Microsoft Graph: `Calendars.ReadWrite`, `Contacts.Read`, `User.Read`, `offline_access`). Ele faz login uma vez e fica conectado. Guarde o refresh token no servidor para o app funcionar em segundo plano.
Se eu precisar registrar o app no portal do Microsoft Entra (Azure), me explique o passo a passo em português.

**Primeira vez (boas-vindas):** pergunta "Como devo te chamar?", a cidade (para o clima) e o nome do assistente (padrão "Jarvis"). Depois ele se apresenta falando: "Olá, senhor [nome]. Eu sou o Jarvis, seu assistente pessoal…".

**Tela Hoje:**
- Cartão escuro no topo com data, "Bom dia/Boa tarde/Boa noite, senhor [nome]", clima (Open-Meteo, sem chave) e botão "Ouvir meu dia", que lê o resumo em voz alta.
- Cartão "Próximo" com o próximo compromisso e quanto falta ("em 35 min").
- Linha do tempo do dia, com uma linha laranja marcando a hora atual.

**Tela Agenda:** calendário do mês com bolinhas nos dias com compromisso. Embaixo, o dia escolhido em **grade de horários** (blocos do tamanho da duração; compromissos no mesmo horário ficam lado a lado), com opção de ver em lista. Tocar num horário vazio cria um compromisso.

**Compromisso (editar/criar):** título, data, hora, duração, local (com botão "Mapa"), participantes (contatos do Outlook), telefone (com botões Ligar e WhatsApp), importante (sim/não), aviso (na hora, 10, 15, 30 min, 1h, 2h) e repetir. Tudo salvo no Outlook.

**Assistente por voz** (botão do microfone):
- Usa o reconhecimento de voz do navegador em pt-BR. Se não houver, mostra um campo de texto (o microfone do teclado do iPhone funciona ali).
- Mande o texto para uma IA com ferramentas (function calling) que mexem no Outlook: criar, mudar, cancelar, listar, "estou livre?", copiar compromissos. Fuso America/Sao_Paulo.
- Precisa entender, por exemplo:
  - "marca reunião com o Paulo terça às 10h e manda o convite": cria o evento com o Paulo como participante, e o Outlook envia o convite;
  - vários de uma vez: "segunda 9h visita no Ed. Solar, terça 14h contrato com o Paulo";
  - "toda terceira quinta do mês, reunião com os gerentes": evento recorrente;
  - "muda a reunião de sexta para as 15h", "cancela o dentista" (pede confirmação antes de cancelar);
  - "me avisa 10 minutos antes", que muda o aviso daquele compromisso;
  - "o que eu tenho amanhã?", "estou livre quinta às 15h?".
- Respostas **curtas, formais e faladas em voz alta**, tratando por "senhor". Exemplo: "Pronto, senhor Sanderson. Marquei a reunião com o Paulo para terça, às 10 horas, e mandei o convite. Vou te avisar 30 minutos antes."
- Fale os horários por extenso ("10 horas", "13 e 30"). Se faltar informação, pergunte ("Que horas?") e continue escutando. Se houver choque de horário, avise.
- Não mostre na tela o que o usuário falou, só a resposta.
- Depois de toda ação, mostre um botão "Desfazer".

**Ajustes:** nome, cidade, nome do assistente, letra grande, tempo de aviso padrão e sair da conta.

---

## Prompt 2 — Avisos e notificações no celular

Agora adicione os avisos, que precisam funcionar **com o app fechado e o celular bloqueado**:

- **Web Push** (chaves VAPID), compatível com o iPhone quando o app está instalado na tela de início (iOS 16.4+). Peça permissão de notificação na primeira vez, com uma explicação simples.
- Uma **tarefa agendada no servidor que roda a cada minuto** lê os próximos eventos do Outlook de cada usuário e envia o aviso no tempo certo (o aviso do compromisso ou o padrão dos Ajustes). Vale para todos os eventos, inclusive os criados direto no Outlook.
- Texto do aviso: "Daqui a 30 minutos: Reunião com o Paulo, às 10h, no Escritório". Ao tocar, abre uma tela grande com o botão "**Vi, obrigado**" e o botão "Lembrar de novo em 5 minutos".
- **Insistência:** se ele não confirmar, repete a notificação depois de X minutos (ajustável em Ajustes, padrão 5). Grave quando ele confirmou ("visto às 9h32") e mostre isso no compromisso.
- **Resumo do dia:** no horário escolhido em Ajustes (padrão 7h, pode desligar), manda a notificação "Bom dia, senhor Sanderson. Hoje o senhor tem 3 compromissos…". Ao tocar, abre o app e o assistente lê o resumo em voz alta.
- Toque um som curto antes de o app falar um aviso, quando estiver aberto.

---

## Prompt 3 — Confirmação para clientes (WhatsApp e e-mail)

Adicione a confirmação para os clientes:

- Comando por voz: "confirma a visita de amanhã com o Paulo".
- O assistente procura o Paulo nos **contatos do Outlook** (Microsoft Graph). Se houver mais de um, pergunta qual. Se o contato não tiver celular, pergunta o número e salva no contato.
- Monta a mensagem: "Olá Paulo, tudo bem? Confirmando nossa visita amanhã, quinta, às 10h, na Rua das Acácias, 120. Até lá! — Sanderson".
- **WhatsApp:** abre o WhatsApp com a conversa do Paulo e o texto pronto (link `https://wa.me/55NUMERO?text=...`); ele só toca em enviar.
- **E-mail:** envia automaticamente pelo Outlook dele (Microsoft Graph, `Mail.Send`) e mostra "E-mail de confirmação enviado ao Paulo".
- No compromisso, mostre o que já foi confirmado e por qual canal.

---

## Fases seguintes (não mande ainda)

- **Voz do Jarvis "Faber":** a voz escolhida é a Piper pt_BR "faber", com efeito (mais grave, eco leve). Precisa de um servidor pequeno com Python. Amostras e ajustes do efeito estão em `docs/vozes/` e no documento do projeto.
- **Resumo de reuniões:** gravar a reunião, transcrever e entregar resumo, decisões e tarefas.
- **Atalho "Jarvis" sem abrir o app:** Atalho da Siri + Atalhos Vocais do iPhone, chamando uma rota do servidor.

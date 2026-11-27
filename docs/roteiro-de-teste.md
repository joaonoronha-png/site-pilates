# Jarvis: roteiro de teste antes da apresentação (cerca de 10 minutos)

**Onde:** no computador do Sanderson, logado em **https://jarvis-agenda-7k3q.lovable.app**.
Deixe o **Outlook aberto em outra aba** para conferir.

Em cada passo, marque ✅ se deu certo ou ❌ se deu errado. Se der ❌, tire um print e mande para o Claude.

---

## 1. Entrada
- [ ] Abrir o link: aparece a esfera e depois a agenda, **sem voltar para o login**.
- [ ] Aparecem **só os compromissos reais** dele (nada de "apto 302" ou "Carlos" de exemplo).

## 2. Agenda no computador
- [ ] A aba **Agenda** mostra a **semana na horizontal** (segunda a sexta), como no Outlook.
- [ ] Os compromissos batem com os do Outlook (mesmo dia e horário).
- [ ] As setas trocam de semana, e o botão "Hoje" volta para a semana atual.
- [ ] Clicar num compromisso abre os detalhes ao lado.

## 3. Assistente (microfone)
Na primeira vez, o navegador pede permissão para usar o microfone: clique em **Permitir**.
Fale **devagar e com pausas**, do jeito normal dele.

| Diga | O que deve acontecer |
|---|---|
| "Amigo, tudo bem?" | Responde de forma educada e curta, sem erro. |
| "O que eu tenho amanhã?" | Lista os compromissos de amanhã, falando. |
| "Marca uma reunião de teste amanhã às 7 da manhã" | Confirma e **aparece no Outlook** amanhã às 7h. |
| "Muda a reunião de teste para as 8" | Ajusta, e no Outlook passa para as 8h. |
| "Me avisa 10 minutos antes da reunião de teste" | Confirma o aviso de 10 minutos. |
| "Passa tudo de amanhã para o dia 29" | Se o dia 29 cair num domingo, ele **pergunta** se não é segunda, dia 30. Responda **"não, deixa"**. |
| "Confirma com o Matheus Fernandes a reunião de teste" | Acha o contato e pergunta "WhatsApp ou e-mail?". Escolha **WhatsApp**: abre a conversa com a mensagem pronta. **Não envie.** |
| "Cancela a reunião de teste" | **Pede confirmação.** Diga "pode". Some do Outlook. |

- [ ] Durante as pausas na fala, ele **não corta** antes de terminar.
- [ ] O botão **"Pronto"** envia na hora.
- [ ] O botão **"Desfazer"** desfaz a última ação.

## 4. Celular (iPhone)
- [ ] Abrir o link no Safari, tocar em **Compartilhar › Adicionar à Tela de Início** e abrir pelo ícone.
- [ ] Entrar com a Microsoft e ver a mesma agenda.
- [ ] Testar uma frase no microfone.

---

**Atenção:** apague a "reunião de teste" no fim, se ela não tiver sido cancelada no passo 3.

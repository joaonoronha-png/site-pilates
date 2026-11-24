# Jarvis: passo a passo para ligar no Outlook

**App publicado:** https://jarvis-agenda-7k3q.lovable.app
**Projeto no Lovable:** https://lovable.dev/projects/c266b37f-af69-4458-9816-49e165d5c259

O botão "Entrar com Microsoft" fica apagado até o Passo 3. É normal.

---

## Passo 1 · João (antes do dia na empresa)

Dar ao Matheus acesso ao projeto, sem passar a senha:

1. Entrar no **lovable.dev** com a conta dele.
2. Ir em **Settings › Members** (ou **Workspace › People**) › **Invite**.
3. Colocar o e-mail do Matheus e enviar o convite.

## Passo 2 · Matheus (antes do dia na empresa)

1. Abrir o convite que chegou no e-mail e **criar a sua conta no Lovable**. É grátis.
2. Conferir se você consegue abrir o projeto **Jarvis** (link acima).

---

## Passo 3 · Na empresa, com a TI

1. Mostrar à TI o arquivo **checklist-ti.md**.
2. A TI faz os passos no computador dela e te passa **3 códigos**:
   - ID do locatário (Tenant ID)
   - ID do aplicativo (Client ID)
   - Valor do segredo do cliente

## Passo 4 · Colocar os códigos no Lovable

Em qualquer computador:

1. Abrir **lovable.dev**, entrar na sua conta e abrir o projeto **Jarvis**.
2. Ir na **engrenagem (Project Settings) › Secrets**.
3. Adicionar estes 4 itens, com o nome **exatamente** assim:

| Nome | Valor |
|---|---|
| `MS_TENANT_ID` | ID do locatário (código 1) |
| `MS_CLIENT_ID` | ID do aplicativo (código 2) |
| `MS_CLIENT_SECRET` | Valor do segredo (código 3) |
| `ALLOWED_EMAILS` | o e-mail da empresa do Sanderson |

Os códigos não vão em WhatsApp, e-mail nem chat. Digite direto no Lovable.

## Passo 5 · O Sanderson entra (no computador)

1. Abrir **https://jarvis-agenda-7k3q.lovable.app**
2. Clicar em **Entrar com Microsoft**, entrar com o e-mail e a senha da empresa e clicar em **Aceitar** nas permissões.
3. Preencher a tela de boas-vindas (nome e cidade).

## Passo 6 · Testar

1. No Jarvis, criar uma reunião: falando ("marca reunião amanhã às 10h") ou pelo **+ Novo**.
2. Abrir o **Outlook** e conferir se a reunião apareceu.
3. Criar uma reunião direto no Outlook e conferir se ela aparece no Jarvis.

## Passo 7 · No iPhone do Sanderson

1. Abrir o link no **Safari**.
2. Tocar em **Compartilhar › Adicionar à Tela de Início**.
3. Abrir o ícone do **Jarvis** e fazer o mesmo login.

---

**Se algo der errado:** tire um print da tela e mande no chat do Claude.

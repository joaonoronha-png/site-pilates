# Jarvis: o que a TI precisa fazer (uns 10 minutos)

O **Jarvis** é um assistente de agenda por voz do Sanderson. Ele lê e grava compromissos **no calendário do Outlook dele**,
envia os convites de reunião e procura os contatos. Para isso, precisa de um registro de aplicativo no Microsoft Entra ID da empresa.

## Passo a passo (Microsoft Entra admin center)

1. Acesse **entra.microsoft.com** com uma conta de administrador.
2. **Identidade › Aplicativos › Registros de aplicativo › Novo registro**
   - Nome: **Jarvis**
   - Tipos de conta: **Somente contas deste diretório organizacional** (um locatário)
   - URI de redirecionamento: plataforma **Web**, endereço: **________________________**
     (é a "Callback URL" que aparece no Lovable/Supabase, na configuração do login Microsoft/Azure)
3. No app criado, abra **Permissões de API › Adicionar permissão › Microsoft Graph › Permissões delegadas** e marque:
   - `User.Read`
   - `offline_access`
   - `Calendars.ReadWrite`
   - `Contacts.Read`
   - `Mail.Send` (para enviar e-mails de confirmação aos clientes)
4. Clique em **Conceder consentimento de administrador para [empresa]**.
5. **Certificados e segredos › Novo segredo do cliente**. Validade de 24 meses. **Copie o "Valor" na hora**, porque ele só aparece uma vez.

## Entregar para quem está configurando o Jarvis

| O quê | Onde fica |
|---|---|
| ID do locatário (Tenant ID) | Visão geral do app |
| ID do aplicativo (Client ID) | Visão geral do app |
| Valor do segredo do cliente | Passo 5 |

Esses códigos vão **somente** na configuração do login Microsoft do Lovable/Supabase.
**Não mande por WhatsApp nem por e-mail.** Digite direto no Lovable, ali na hora.

## Segurança

- As permissões são **delegadas**: o app só acessa a agenda, os contatos e os e-mails **de quem fizer login nele**, e só enquanto estiver logado.
- Dá para revogar a qualquer momento: Entra › Aplicativos empresariais › Jarvis › Excluir, ou removendo o segredo.

## Teste depois de configurar

1. O Sanderson abre o Jarvis no computador e no celular e toca em **Entrar com Microsoft**.
2. Ele fala: "marca reunião amanhã às 10h".
3. Confirme que o compromisso apareceu no **Outlook**.

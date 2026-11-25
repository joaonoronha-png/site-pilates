# Reserva direta pelo site

## Etapa 1 — telas (pronto, em modo prévia)

`assets/js/booking.js` monta:

- **Calendário de disponibilidade** na página de cada imóvel (2 meses no computador, 1 no celular), com mínimo de noites e dias ocupados riscados.
- **Caixa de reserva**: datas, hóspedes, resumo de valores (diárias da tabela, limpeza, "taxa do Airbnb R$ 0"), barra fixa no celular.
- **Confirmar e reservar** (`#reservar/...`): 1) entrar ou cadastrar (Google ou código por e-mail), 2) dados do hóspede, 3) pagamento do sinal (Pix 50%).
- **Minhas reservas** (`#minhas-reservas`): próximas e anteriores, com status.
- Botão **Entrar / Minhas reservas** no topo e no menu.

Ver imóveis e preços não pede conta: a conta só aparece na hora de reservar.

No **modo prévia** (`SITE_DATA.reserva.modo = 'previa'`), três "adaptadores" simulam o servidor:

| Adaptador | Prévia (hoje) | Online (etapa 2) |
|---|---|---|
| `AUTH` | código de teste 123456, conta salva no navegador | Supabase Auth (Google e código por e-mail) |
| `AGENDA` | `bloqueios` do imóvel + reservas feitas neste navegador | calendário do Airbnb (iCal) lido pelo servidor + reservas do site |
| `PAGAMENTO` | pré-reserva enviada pelo WhatsApp | Pix do Mercado Pago (QR Code, confirmação automática) |

As telas não mudam quando os adaptadores forem trocados.

## Dados que faltam do cliente

- `precos` de cada imóvel (diária sem taxas, por período):
  `precos: { base: 450, periodos: [{ nome: 'Réveillon', de: '12-27', ate: '01-02', valor: 1200 }] }`
- Link de exportação do calendário (iCal) de cada anúncio do Airbnb.
- CNPJ e conta no Mercado Pago no nome da empresa.

## Etapa 2 — ligar as contas (a fazer junto com o cliente)

1. Criar no e-mail do cliente: Vercel (hospedagem), Supabase (contas e reservas), Mercado Pago (Pix).
2. Supabase: tabelas `reservas` e `perfis`, login por Google e por código de e-mail.
3. Funções no servidor (`api/`): ler os calendários do Airbnb, exportar o calendário do site para o Airbnb importar, criar o Pix do sinal e receber a confirmação do Mercado Pago, mandar o Pix dos 50% restantes um dia antes.
4. Painel do dono: reservas, bloqueio de datas e preços.
5. Termos de uso e política de privacidade (LGPD).
6. Apontar o domínio para a Vercel (TI do cliente) e testar com reservas de mentira antes de abrir.

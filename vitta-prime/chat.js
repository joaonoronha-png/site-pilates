/* Assistente Vitta Prime
   Responde perguntas frequentes a partir de uma base revisada (KB abaixo), busca imóveis do site
   e calcula o ITBI. Não usa IA generativa: as respostas são sempre as textos aprovados aqui.
   Para ligar uma IA generativa no futuro, implemente window.VP_AI = async (pergunta, historico) => "resposta"
   (por exemplo chamando um backend próprio); ela será usada só quando a base não tiver resposta. */
(() => {
  const WA = "5521998433127";
  const WA_FMT = "(21) 99843-3127";
  const ENDERECO = "Av. das Américas, 8585 · Lojas SS 2201 e 2202 · Barra da Tijuca, Rio de Janeiro";

  /* ---------- base de conhecimento ---------- */
  // k: palavras-chave extras (sinônimos, termos que as pessoas usam). a: resposta. act: botões de ação.
  const KB = [
    // Atendimento
    { cat: "Atendimento", q: "Como falo com um corretor?", k: "corretor falar atendente humano pessoa contato atendimento especialista ligar telefone whatsapp zap numero",
      a: `Você pode falar direto com um especialista pelo WhatsApp <b>${WA_FMT}</b>. Se preferir, deixe seus dados no formulário de contato que retornamos ainda hoje.`,
      act: [["Abrir WhatsApp", "wa"], ["Formulário de contato", "scroll:contato"]] },
    { cat: "Atendimento", q: "Onde fica a Vitta Prime?", k: "endereco onde fica localizacao escritorio loja sede chegar mapa rota waze uber google maps",
      a: `Nosso escritório fica na <b>${ENDERECO}</b>. Posso abrir a rota no Waze, Google Maps, Mapas do iPhone ou Uber.`,
      act: [["Como chegar", "routes"], ["Ver no mapa", "map:office"]] },
    { cat: "Atendimento", q: "Qual o horário de atendimento?", k: "horario funcionamento abre fecha atende sabado domingo feriado hora",
      a: `Mande uma mensagem no WhatsApp <b>${WA_FMT}</b> e combinamos o melhor horário para você, inclusive para visitas.`,
      act: [["Abrir WhatsApp", "wa"]] },
    { cat: "Atendimento", q: "A Vitta Prime tem Instagram?", k: "instagram rede social redes sociais perfil arroba",
      a: `Sim! Siga <b>@vittaprimeimoveis</b> no Instagram para ver os imóveis e novidades.`,
      act: [["Abrir Instagram", "url:https://www.instagram.com/vittaprimeimoveis/"]] },
    { cat: "Atendimento", q: "Quem é a Vitta Prime?", k: "quem somos empresa imobiliaria historia sobre especialidade alto padrao fundada",
      a: `A Vitta Prime é uma imobiliária da Barra da Tijuca especializada em <b>imóveis de alto padrão</b>. Trabalhamos com venda, locação, administração e avaliação de imóveis na Barra, Jardim Oceânico, Península, Recreio, Itanhangá e Joá.`,
      act: [["Conhecer a Vitta Prime", "scroll:sobre"]] },
    { cat: "Atendimento", q: "Em quais bairros vocês atuam?", k: "bairro bairros regiao regioes atuam atendem zona oeste barra recreio peninsula joa itanhanga jardim oceanico",
      a: `Atuamos principalmente na Barra da Tijuca, Jardim Oceânico, Península, Recreio dos Bandeirantes, Itanhangá e Joá. Se o seu imóvel ou a sua busca for em outra região, fale com a gente.`,
      act: [["Ver imóveis no mapa", "scroll:mapa"]] },
    { cat: "Atendimento", q: "Como evitar golpes?", k: "golpe fraude falso seguranca boleto pix confiavel deposito antecipado",
      a: `Algumas regras de ouro: <b>nunca pague nada para reservar visita</b>, confirme os dados da imobiliária (CNPJ 66.200.706/0001-05) antes de qualquer pagamento e desconfie de preços muito abaixo do mercado. Na dúvida, confirme pelo nosso WhatsApp oficial <b>${WA_FMT}</b>.`,
      act: [["Confirmar no WhatsApp", "wa"]] },
    { cat: "Atendimento", q: "Como vocês usam meus dados?", k: "dados lgpd privacidade informacoes pessoais cadastro",
      a: `Os dados que você informa nos formulários são usados apenas para entrarmos em contato sobre o seu pedido, conforme a LGPD. Você pode pedir a exclusão a qualquer momento pelo WhatsApp.` },

    // Visitas
    { cat: "Visitas", q: "Como agendar uma visita?", k: "agendar visita visitar conhecer marcar ver imovel pessoalmente horario agendamento",
      a: `Abra o imóvel que você gostou e use o <b>Agendar visita</b>: escolha o dia, o horário e se prefere visita presencial ou por vídeo. Um corretor confirma pelo WhatsApp.`,
      act: [["Ver imóveis", "scroll:imoveis"]] },
    { cat: "Visitas", q: "Que documento levar na visita?", k: "documento levar visita rg cnh identidade",
      a: `Leve um documento original com foto, como RG ou CNH. O corretor encontra você no imóvel.` },
    { cat: "Visitas", q: "Posso cancelar ou remarcar uma visita?", k: "cancelar remarcar reagendar mudar desmarcar visita",
      a: `Pode, sim. Avise o corretor pelo WhatsApp <b>${WA_FMT}</b> e escolhemos outro horário.`,
      act: [["Abrir WhatsApp", "wa"]] },
    { cat: "Visitas", q: "Posso fazer visita por vídeo?", k: "video chamada videochamada online remota longe distancia",
      a: `Sim. No agendamento, escolha <b>Por vídeo</b>: o corretor mostra o imóvel ao vivo por videochamada.` },

    // Compra
    { cat: "Comprar", q: "Quais são as etapas para comprar um imóvel?", k: "etapas passo processo como comprar comprar imovel primeiro imovel compra",
      a: `Em resumo: 1) definir o orçamento total; 2) visitar e comparar; 3) fazer a proposta por escrito; 4) analisar documentos do imóvel e do vendedor; 5) assinar o contrato e pagar o sinal; 6) financiamento, se houver; 7) pagar o ITBI, fazer a escritura e registrar no cartório.`,
      act: [["Ler o guia completo", "route:guia-comprar-passo-a-passo"]] },
    { cat: "Comprar", q: "Qual a diferença entre imóvel pronto e na planta?", k: "diferenca pronto planta lancamento construcao novo usado",
      a: `O <b>pronto</b> já está construído e você pode se mudar logo após a compra. O <b>na planta</b> ainda está em obra: costuma ter preço e condições melhores, mas você espera a entrega.`,
      act: [["Ver lançamentos", "list:lancamento"]] },
    { cat: "Comprar", q: "Quais documentos preciso para comprar?", k: "documentos documentacao papel papelada comprar compra necessarios comprador",
      a: `Do comprador: RG e CPF, comprovante de estado civil, comprovante de residência e comprovantes de renda (se houver financiamento). Do imóvel e do vendedor: matrícula atualizada, certidões negativas e declaração de quitação do condomínio e do IPTU. Nós conferimos tudo para você.`,
      act: [["Falar com um corretor", "wa"]] },
    { cat: "Comprar", q: "Como sei quanto posso investir?", k: "quanto posso investir pagar orcamento potencial compra renda valor maximo cabe bolso",
      a: `Some o valor que você tem para entrada com o crédito que o banco aprova (que depende da sua renda; a parcela costuma ficar em até 30% dela). Não esqueça de reservar de 4% a 5% para ITBI e cartório. Um corretor pode fazer essa conta com você.`,
      act: [["Simular com um corretor", "wa"], ["Guia de financiamento", "route:guia-financiamento"]] },
    { cat: "Comprar", q: "Qual a diferença entre valor do imóvel, entrada, financiamento e saldo devedor?", k: "entrada saldo devedor valor financiado diferenca termos",
      a: `<b>Valor do imóvel</b> é o preço negociado. <b>Entrada</b> é a parte paga com recursos próprios. <b>Valor financiado</b> é o que o banco empresta. <b>Saldo devedor</b> é quanto ainda falta pagar ao banco a cada momento.` },
    { cat: "Comprar", q: "Posso somar a renda da família?", k: "somar renda familia conjuge casal composicao renda",
      a: `Sim. Os bancos aceitam compor renda com cônjuge, parentes ou até amigos, desde que todos entrem no contrato do financiamento.` },
    { cat: "Comprar", q: "Quanto é a corretagem?", k: "corretagem comissao honorarios taxa corretor quem paga",
      a: `A comissão de corretagem normalmente é paga pelo vendedor. No mercado, costuma ficar entre 4% e 6% do valor de venda, conforme o combinado em contrato.` },
    { cat: "Comprar", q: "Quais custos tenho além do preço?", k: "custos taxas despesas alem preco cartorio escritura registro impostos",
      a: `Os principais são o <b>ITBI</b> (no Rio, 3% do valor), a <b>escritura</b> no Cartório de Notas e o <b>registro</b> no Registro de Imóveis. Com financiamento, há também a taxa de avaliação do banco. Reserve de 4% a 5% do valor. Me diga o valor do imóvel que eu calculo o ITBI.`,
      act: [["Ler o guia de custos", "route:guia-custos-da-compra"]] },
    { cat: "Comprar", q: "O que é o ITBI?", k: "itbi imposto transmissao bens imoveis",
      a: `É o Imposto sobre Transmissão de Bens Imóveis, cobrado pela prefeitura na compra. No Rio de Janeiro a alíquota é de <b>3%</b> sobre o valor do imóvel e ele é pago antes da escritura. Quer que eu calcule? Escreva, por exemplo: "ITBI de 2 milhões".` },
    { cat: "Comprar", q: "O que é IPCA e INCC?", k: "ipca incc indice inflacao correcao reajuste parcelas obra",
      a: `O <b>IPCA</b> é o índice oficial de inflação do Brasil. O <b>INCC</b> mede a variação dos custos da construção e costuma corrigir as parcelas de imóveis na planta durante a obra.` },
    { cat: "Comprar", q: "Quando recebo as chaves?", k: "chaves receber entrega mudar mudanca",
      a: `No imóvel pronto, as chaves são entregues após a escritura e o pagamento, conforme o contrato. Na planta, a construtora entrega depois da conclusão da obra, da vistoria e da assinatura do termo de entrega.` },

    // Financiamento
    { cat: "Financiamento", q: "Como funciona o financiamento?", k: "financiamento financiar banco credito imobiliario emprestimo parcelas juros prazo",
      a: `É uma compra a longo prazo: o banco paga o vendedor e você devolve em parcelas com juros, com o próprio imóvel como garantia. Os bancos costumam financiar até 70% a 80% do valor, e o restante é a entrada.`,
      act: [["Guia de financiamento", "route:guia-financiamento"]] },
    { cat: "Financiamento", q: "Qual a diferença entre SAC e Price?", k: "sac price tabela amortizacao parcelas decrescentes fixas",
      a: `No <b>SAC</b> as parcelas começam mais altas e diminuem, e você paga menos juros no total. Na <b>Price</b> as parcelas são fixas no começo, mais fáceis de encaixar no orçamento, mas com mais juros no total.` },
    { cat: "Financiamento", q: "Posso usar o FGTS?", k: "fgts fundo garantia usar saldo",
      a: `Pode, na entrada ou para amortizar o financiamento, desde que o imóvel seja residencial, para sua moradia, e você cumpra as regras da Caixa (como não ter outro imóvel na mesma cidade).` },
    { cat: "Financiamento", q: "Quanto tempo demora a aprovação do crédito?", k: "aprovacao credito analise demora prazo tempo banco aprovar",
      a: `Com a documentação completa, a análise costuma levar de alguns dias a poucas semanas, dependendo do banco. Ter os documentos em ordem e o nome sem restrições acelera bastante.` },
    { cat: "Financiamento", q: "Meu crédito foi negado. E agora?", k: "credito negado reprovado recusado score restricao nome sujo",
      a: `Dá para tentar outro banco, compor renda com outra pessoa, aumentar a entrada ou considerar um consórcio. Um corretor pode avaliar o melhor caminho com você.`,
      act: [["Falar com um corretor", "wa"]] },
    { cat: "Financiamento", q: "O que é consórcio e carta de crédito?", k: "consorcio carta credito sorteio lance contemplado",
      a: `No consórcio, um grupo paga parcelas mensais e, a cada mês, alguns participantes são contemplados por sorteio ou lance com uma <b>carta de crédito</b>, usada para comprar o imóvel. A carta pode entrar como parte do pagamento; confirme as condições com um corretor.` },
    { cat: "Financiamento", q: "O que acontece se eu atrasar o financiamento?", k: "atrasar atraso parcela inadimplente nao pagar financiamento leilao",
      a: `O atraso gera multa e juros e pode negativar o nome. Em atrasos longos, o banco pode retomar e leiloar o imóvel. Procure o banco o quanto antes para renegociar.` },

    // Planta / lançamentos
    { cat: "Lançamentos", q: "O que é um imóvel na planta?", k: "planta lancamento pre lancamento construcao obra empreendimento novo",
      a: `É o imóvel vendido antes ou durante a construção. A vantagem é pagar a entrada parcelada durante a obra e receber um imóvel novo, às vezes com opção de personalizar acabamentos.`,
      act: [["Ver lançamentos", "list:lancamento"]] },
    { cat: "Lançamentos", q: "Quanto tempo demora uma obra?", k: "tempo obra demora ficar pronto prazo entrega construcao",
      a: `Em geral, de 2 a 3 anos a partir do início da obra. Cada lançamento informa a data prevista de entrega, que aparece na página do empreendimento.` },
    { cat: "Lançamentos", q: "Como funciona o pagamento na planta?", k: "pagamento planta entrada parcelada parcelas obra chaves saldo",
      a: `Normalmente há um sinal, parcelas mensais e intermediárias durante a obra (corrigidas pelo INCC) e o saldo na entrega das chaves, pago à vista ou com financiamento bancário.` },
    { cat: "Lançamentos", q: "Posso personalizar o imóvel na planta?", k: "personalizar mudar planta alterar reformar acabamento obra construtora",
      a: `Muitas construtoras oferecem opções de planta e acabamento. Mudanças fora do padrão só com autorização expressa da construtora ou incorporadora.` },
    { cat: "Lançamentos", q: "Posso visitar a obra?", k: "visitar obra canteiro acompanhar construcao",
      a: `Sim, com agendamento prévio e quando não houver risco à segurança. Algumas construtoras também fazem visitas programadas para os compradores.` },
    { cat: "Lançamentos", q: "O que é a vistoria de entrega?", k: "vistoria entrega defeito conferir imovel novo",
      a: `É a visita antes de receber as chaves para conferir se o imóvel está de acordo com o contratado e anotar defeitos que a construtora precisa corrigir.`,
      act: [["Checklist de vistoria", "route:guia-vistoria"]] },
    { cat: "Lançamentos", q: "Posso revender um imóvel na planta?", k: "revender vender planta cessao direitos repasse",
      a: `Pode, a qualquer momento, por meio de cessão de direitos. Normalmente é preciso a anuência da incorporadora, que pode cobrar uma taxa.` },

    // Aluguel
    { cat: "Alugar", q: "Quais documentos preciso para alugar?", k: "documentos alugar aluguel locacao inquilino cadastro ficha papelada",
      a: `RG e CPF, comprovante de residência e comprovante de renda. A renda costuma ser de pelo menos 3 vezes o valor do aluguel. Também é preciso escolher uma garantia.`,
      act: [["Guia de documentos e garantias", "route:guia-documentos-para-alugar"]] },
    { cat: "Alugar", q: "Quais garantias são aceitas?", k: "garantia fiador seguro fianca caucao titulo capitalizacao",
      a: `As mais comuns são <b>fiador</b>, <b>seguro-fiança</b>, <b>caução</b> (até 3 meses de aluguel) e <b>título de capitalização</b>. A lei permite só uma garantia por contrato.` },
    { cat: "Alugar", q: "Quem paga condomínio e IPTU no aluguel?", k: "quem paga condominio iptu inquilino proprietario despesas extraordinarias",
      a: `O inquilino paga o condomínio do dia a dia. As despesas extraordinárias (como obras estruturais e fundo de reserva) são do proprietário. O IPTU normalmente é repassado ao inquilino, conforme o contrato.` },
    { cat: "Alugar", q: "Como funciona o reajuste do aluguel?", k: "reajuste aumento aluguel indice igpm ipca anual",
      a: `O aluguel é reajustado uma vez por ano, pelo índice definido no contrato (normalmente IPCA ou IGP-M).` },
    { cat: "Alugar", q: "Qual a multa se eu sair antes do fim do contrato?", k: "multa rescisao sair antes quebrar contrato devolver imovel",
      a: `A multa é a prevista no contrato, cobrada de forma proporcional ao tempo que falta. Em contratos de 30 meses, costuma ser de 3 aluguéis, reduzida conforme o tempo já cumprido. Em transferência de emprego para outra cidade, a lei isenta a multa (com aviso de 30 dias).` },
    { cat: "Alugar", q: "Quanto tempo dura um contrato de aluguel?", k: "duracao prazo contrato aluguel meses 30",
      a: `O mais comum para imóvel residencial é 30 meses. Prazos menores são possíveis, mas mudam as regras de retomada do imóvel pelo proprietário.` },
    { cat: "Alugar", q: "Como funciona a vistoria do aluguel?", k: "vistoria aluguel entrada saida laudo fotos",
      a: `Na entrada fazemos um laudo com fotos de todo o imóvel, assinado pelas duas partes. Na saída, o imóvel é comparado com esse laudo.`,
      act: [["Checklist de vistoria", "route:guia-vistoria"]] },

    // Proprietários
    { cat: "Proprietários", q: "Como anuncio meu imóvel?", k: "anunciar anuncio vender meu imovel colocar venda divulgar captar proprietario",
      a: `Preencha o pedido em <b>Quero vender meu imóvel</b> ou <b>Quero alugar meu imóvel</b>. Um corretor visita, avalia, faz fotos profissionais e divulga no site, nas redes e nos principais portais.`,
      act: [["Quero vender", "route:proprietario-vender"], ["Quero alugar", "route:proprietario-alugar"]] },
    { cat: "Proprietários", q: "Quanto vale meu imóvel?", k: "quanto vale avaliar avaliacao preco meu imovel valor mercado estimativa",
      a: `Você pode fazer uma estimativa na hora na nossa calculadora e pedir a avaliação completa, que é gratuita, com visita de um corretor e comparativos de mercado.`,
      act: [["Avaliar meu imóvel", "route:proprietario-avaliar"]] },
    { cat: "Proprietários", q: "O que é a administração de aluguel?", k: "administracao administrar aluguel gestao repasse cobranca manutencao",
      a: `Nós cuidamos de tudo: cobrança do aluguel, repasse mensal, pagamento de condomínio e IPTU se você preferir, manutenções, reajuste e renovação de contrato, com relatório mensal.`,
      act: [["Saber mais", "route:proprietario-administrar"]] },
    { cat: "Proprietários", q: "É melhor vender ou alugar?", k: "melhor vender ou alugar investimento renda decidir",
      a: `Depende do seu objetivo: vender libera o capital para outro investimento; alugar gera renda mensal e mantém o patrimônio. Uma avaliação do imóvel ajuda a comparar as duas opções.`,
      act: [["Avaliar meu imóvel", "route:proprietario-avaliar"]] },
    { cat: "Proprietários", q: "Que documentos preciso para vender?", k: "documentos vender venda vendedor proprietario certidoes matricula",
      a: `Matrícula atualizada do imóvel, IPTU quitado, declaração de quitação do condomínio, documentos pessoais e certidões negativas. Ajudamos a reunir tudo.`,
      act: [["Guia: preparar para vender", "route:guia-preparar-para-vender"]] },
  ];

  /* ---------- texto: normalização e semelhança ---------- */
  const STOP = new Set("a o as os um uma uns umas de da do das dos e em no na nos nas para pra por com como que qual quais quanto quantos quanta eu meu minha meus minhas voce voces vcs vc se sobre ao aos ser ter tem tenho posso pode preciso fazer faz e é ou mais muito ja isso esse essa este esta la aqui ai oi ola gostaria queria quero saber me nao sim bom boa dia tarde noite".split(" "));
  const SYN = { zap: "whatsapp", whats: "whatsapp", wpp: "whatsapp", fone: "telefone", cel: "telefone", celular: "telefone",
    ap: "apartamento", apto: "apartamento", apartamentos: "apartamento", cob: "cobertura", casas: "casa",
    alugar: "aluguel", locar: "aluguel", locacao: "aluguel", alugo: "aluguel", comprar: "compra", compro: "compra",
    financiar: "financiamento", financiado: "financiamento", lancamentos: "lancamento", planta: "lancamento",
    comissao: "corretagem", endereco: "endereco", localizacao: "endereco", vender: "venda", vendo: "venda" };
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const stem = (w) => w.length > 4 ? w.replace(/(coes|cao|mente|oes|ais|eis|res|s)$/, "") : w;
  const tokens = (s) => norm(s).split(" ").filter((w) => w && !STOP.has(w)).map((w) => stem(SYN[w] || w));
  // distância de edição limitada para tolerar erros de digitação
  const near = (a, b) => {
    if (a === b) return true;
    if (Math.abs(a.length - b.length) > 1 || a.length < 5) return false;
    if (a.length === b.length) { // letras trocadas de lugar ("financiamneto")
      const d = [...a].map((c, i) => (c !== b[i] ? i : -1)).filter((i) => i >= 0);
      if (d.length === 2 && d[1] === d[0] + 1 && a[d[0]] === b[d[1]] && a[d[1]] === b[d[0]]) return true;
    }
    let i = 0, j = 0, edits = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++edits > 1) return false;
      if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
    }
    return edits + (a.length - i) + (b.length - j) <= 1;
  };
  KB.forEach((e) => {
    e.tq = tokens(e.q);
    e.tk = new Set([...e.tq, ...tokens(e.k)]);
  });
  // vocabulário do assunto (imóveis). A pergunta precisa ter ao menos um destes termos para ser respondida.
  const DOMAIN = new Set(tokens(`imovel imoveis casa apartamento cobertura sala terreno lote condominio aluguel locacao compra venda vender
    vitta prime imobiliaria corretor corretagem visita visitar documento documentos contrato escritura cartorio registro matricula certidao
    itbi iptu fgts financiamento banco credito consorcio carta entrada parcela juros sac price ipca incc igpm reajuste multa rescisao
    garantia fiador caucao seguro inquilino proprietario anunciar anuncio avaliar avaliacao administracao administrar planta lancamento
    obra construtora incorporadora entrega chave chaves vistoria endereco whatsapp telefone instagram horario atendimento golpe fraude lgpd
    bairro bairros barra recreio peninsula joa itanhanga oceanico tijuca preco valor metro quarto quartos suite vaga piscina morar mudar
    investir investimento renda empresa escritorio mapa rota chegar waze uber localizacao agendar especialista`));
  const inDomain = (text) => tokens(text).some((w) => DOMAIN.has(w) || (w.length >= 6 && [...DOMAIN].some((d) => near(w, d))));
  const RUDE = /\b(porra|caralho|merda|bosta|puta|fdp|idiota|burro|otario|vsf|vtnc|pqp)\b/;
  const OFF_TOPIC = {
    a: "Sou o assistente da <b>Vitta Prime Imóveis</b> e respondo apenas sobre o nosso trabalho: compra, venda e aluguel de imóveis de alto padrão, financiamento, lançamentos, visitas e administração na Barra e região. Posso ajudar com alguma dessas dúvidas?",
    chips: true,
  };
  function rank(text) {
    const t = tokens(text);
    if (!t.length) return [];
    return KB.map((e) => {
      let s = 0, inQ = 0;
      t.forEach((w) => {
        if (e.tk.has(w)) { const q = e.tq.includes(w); s += q ? 2 : 1.4; if (q) inQ++; }
        else if ([...e.tk].some((k) => near(w, k) || (w.length > 5 && k.startsWith(w.slice(0, 5))))) s += 0.8;
      });
      // normaliza pelo tamanho da pergunta e dá preferência à resposta cuja pergunta foi mais coberta
      return { e, s: s / (1 + 0.3 * (t.length - 1)) + (s ? 0.6 * inQ / e.tq.length : 0) };
    }).filter((r) => r.s > 0).sort((a, b) => b.s - a.s);
  }

  /* ---------- intenções especiais ---------- */
  const BAIRROS = { "barra": "Barra da Tijuca", "jardim oceanico": "Jardim Oceânico", "peninsula": "Península", "recreio": "Recreio dos Bandeirantes", "itanhanga": "Itanhangá", "joa": "Joá" };
  const TIPOS = { "cobertura": "Cobertura", "casa": "Casa em condomínio", "apartamento": "Apartamento", "apto": "Apartamento", "sala": "Sala comercial", "comercial": "Sala comercial" };

  function parseMoney(n) {
    const m = n.match(/(\d+(?:[.,]\d+)*)\s*(milhoes|milhao|mil|mi|k)?/);
    if (!m) return 0;
    let v = m[1];
    if (m[2]) v = v.replace(/\./g, "").replace(",", ".");
    else v = v.replace(/[.,](?=\d{3}(\D|$))/g, "").replace(",", ".");
    let num = parseFloat(v);
    if (m[2] && (m[2].startsWith("milh") || m[2] === "mi")) num *= 1e6;
    else if (m[2] === "mil" || m[2] === "k") num *= 1e3;
    return num;
  }

  const pick = (q) => { const e = KB.find((x) => x.q === q); return { a: e.a, act: e.act }; };
  function special(text) {
    const n = norm(text);
    const VP = window.VP;
    // cálculo de ITBI
    if (/\bitbi\b/.test(n) && /\d/.test(n)) {
      const raw = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const v = parseMoney(raw.slice(raw.search(/\d/)));
      if (v >= 10000) return { a: `Para um imóvel de <b>${VP.brl(v)}</b>, o ITBI no Rio (3%) fica em <b>${VP.brl(v * 0.03)}</b>. Somando escritura e registro, reserve cerca de <b>${VP.brl(v * 0.04)}</b> a <b>${VP.brl(v * 0.05)}</b>.`,
        act: [["Guia de custos da compra", "route:guia-custos-da-compra"]] };
    }
    // saudação / agradecimento
    if (/^(oi|ola|bom dia|boa tarde|boa noite|e ai|hello|hi)\b/.test(n) && n.split(" ").length <= 4) return { a: "Olá! Sou o assistente da Vitta Prime. Pergunte sobre compra, aluguel, financiamento, visitas ou sobre o seu imóvel." , chips: true };
    if (/\b(obrigad|valeu|vlw|agradec)/.test(n)) return { a: "Por nada! Se quiser, um especialista continua o atendimento pelo WhatsApp.", act: [["Abrir WhatsApp", "wa"]] };
    // proprietário querendo vender, alugar, avaliar ou administrar o próprio imóvel
    const own = /\b(meu|minha|meus|minhas)\b/.test(n);
    if (own && /\b(avaliar|avaliacao|quanto vale|valor)\b/.test(n)) return pick("Quanto vale meu imóvel?");
    if (own && /\b(administrar|administracao|administra)\b/.test(n)) return pick("O que é a administração de aluguel?");
    if (own && /\b(alugar|alugo|locar)\b/.test(n)) return { a: `Ótimo! Encontramos o inquilino certo e cuidamos de contrato, garantia e vistoria. Se quiser, também administramos o aluguel todo mês.`, act: [["Quero alugar meu imóvel", "route:proprietario-alugar"], ["Administração de aluguel", "route:proprietario-administrar"]] };
    if (own && /\b(vender|vendo|anunciar|anuncio)\b/.test(n)) return { a: `Ótimo! Fazemos a avaliação gratuita, fotos profissionais e a divulgação no site, nas redes e nos principais portais, com um corretor dedicado até a escritura.`, act: [["Quero vender meu imóvel", "route:proprietario-vender"], ["Avaliar meu imóvel", "route:proprietario-avaliar"]] };
    // busca de imóveis
    const bairro = Object.keys(BAIRROS).find((b) => n.includes(b));
    const tipoKey = Object.keys(TIPOS).find((t) => new RegExp(`\\b${t}s?\\b`).test(n));
    const owner = /\b(meu|minha|meus|minhas)\b/.test(n) && /\b(vender|vendo|anunciar|anuncio|avaliar|alugar|alugo|administrar)\b/.test(n);
    const wantsList = !owner && /\b(tem|tens|existe|procuro|procurando|quero|busco|mostrar|mostra|ver|disponive|opcoes|imoveis|imovel)\b/.test(n);
    if (VP && !owner && (bairro || tipoKey) && (wantsList || bairro && tipoKey)) {
      const mode = /alug|locac|loca/.test(n) ? "aluguel" : /lancament|planta|obra/.test(n) ? "lancamento" : /compr|vend|venda/.test(n) ? "venda" : "";
      const q = (n.match(/(\d)\s*(quartos|quarto|suites|suite|qts|dorm)/) || [])[1];
      const tipo = tipoKey ? TIPOS[tipoKey] : "";
      const res = VP.imoveis.filter((i) => (!mode || i.mode === mode) && (!bairro || i.bairro === BAIRROS[bairro]) && (!tipo || i.tipo === tipo) && (!q || i.quartos >= +q));
      const desc = [tipo ? tipo.toLowerCase() : "imóveis", bairro ? `em ${BAIRROS[bairro]}` : "", mode === "aluguel" ? "para alugar" : mode === "venda" ? "à venda" : mode === "lancamento" ? "em lançamento" : ""].filter(Boolean).join(" ");
      if (!res.length) return { a: `No momento não encontrei ${desc} no site. Muitos imóveis chegam antes de serem anunciados: um corretor pode buscar para você.`, act: [["Pedir para um corretor", "wa"]] };
      return { a: `Encontrei <b>${res.length}</b> ${res.length === 1 ? "opção" : "opções"} de ${desc}:`, list: res.slice(0, 4),
        act: [["Ver todos no site", `list:${res[0].mode}|${bairro ? BAIRROS[bairro] : ""}|${tipo}`]] };
    }
    return null;
  }

  /* ---------- temas ---------- */
  const IC = {
    "Comprar": '<path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6"/>',
    "Financiamento": '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v.01M18 15v.01"/>',
    "Lançamentos": '<path d="M4 21V10l5-3v14M9 21V4l11 4v13M13 10h3M13 14h3M13 18h3"/>',
    "Alugar": '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M15 8l2 2"/>',
    "Proprietários": '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    "Visitas": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    "Atendimento": '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  };
  const TOPICS = [
    ["Comprar", "Etapas, documentos, custos e ITBI"],
    ["Financiamento", "Bancos, FGTS, SAC ou Price, consórcio"],
    ["Lançamentos", "Imóveis na planta, obra e entrega"],
    ["Alugar", "Documentos, garantias, multa e reajuste"],
    ["Proprietários", "Vender, alugar, avaliar e administrar"],
    ["Visitas", "Agendar, remarcar e visita por vídeo"],
    ["Atendimento", "Contato, endereço, segurança e dados"],
  ];
  const icon = (cat) => `<svg viewBox="0 0 24 24" aria-hidden="true">${IC[cat] || ""}</svg>`;

  /* ---------- seção "Perguntas frequentes" na página: só os temas; o assistente mostra as perguntas ---------- */
  const faqTopics = document.getElementById("faqTopics");
  if (faqTopics) {
    faqTopics.innerHTML = TOPICS.map(([cat, desc]) => `
      <button type="button" class="topic-card" data-open-topic="${cat}">
        ${icon(cat)}<span><b>${cat}</b><small>${desc}</small></span>
        <em>${KB.filter((e) => e.cat === cat).length} perguntas →</em>
      </button>`).join("");
  }

  /* ---------- interface ---------- */
  const root = document.createElement("div");
  root.className = "chat";
  root.innerHTML = `
    <button type="button" class="chat__fab" id="chatFab" aria-expanded="false" aria-controls="chatWin">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/></svg>
      <span>Tire suas dúvidas</span>
    </button>
    <section class="chat__win" id="chatWin" role="dialog" aria-label="Assistente Vitta Prime" hidden>
      <header class="chat__head">
        <span class="chat__avatar">${document.querySelector(".logo__mark svg")?.outerHTML || ""}</span>
        <span class="chat__who"><b>Assistente Vitta Prime</b><small><i></i>Responde na hora</small></span>
        <button type="button" class="chat__x" id="chatClose" aria-label="Fechar assistente"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      </header>
      <div class="chat__log" id="chatLog" aria-live="polite"></div>
      <form class="chat__form" id="chatForm" autocomplete="off">
        <input id="chatInput" type="text" placeholder="Escreva sua pergunta…" aria-label="Sua pergunta" maxlength="300">
        <button type="submit" aria-label="Enviar"><svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg></button>
      </form>
      <p class="chat__foot">Respostas automáticas sobre dúvidas comuns. Para o seu caso, fale com um especialista.</p>
    </section>`;
  document.body.appendChild(root);
  const $ = (s) => root.querySelector(s);
  const log = $("#chatLog"), input = $("#chatInput"), win = $("#chatWin"), fab = $("#chatFab");
  const history = [];

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const scrollDown = () => (log.scrollTop = log.scrollHeight);

  const waLink = () => {
    const lastQ = [...history].reverse().find((h) => h.role === "user")?.text || "";
    return `https://wa.me/${WA}?text=${encodeURIComponent(`Olá! Vim pelo site da Vitta Prime.${lastQ ? ` Minha dúvida: ${lastQ}` : ""}`)}`;
  };
  const actHtml = (l, v) => v === "wa" ? `<a class="is-wa" href="${esc(waLink())}" target="_blank" rel="noopener">${l}</a>`
    : v.startsWith("url:") ? `<a href="${esc(v.slice(4))}" target="_blank" rel="noopener">${l}</a>`
    : `<button type="button" data-act="${esc(v)}">${l}</button>`;

  function addUser(text) {
    log.insertAdjacentHTML("beforeend", `<div class="msg msg--me">${esc(text)}</div>`);
    scrollDown();
  }
  function addBot({ a, act = [], list = [], related = [], chips = false, qs = [], back = false }) {
    const el = document.createElement("div");
    el.className = "msg msg--bot";
    el.innerHTML = `<div class="msg__body">${a}</div>
      ${list.length ? `<div class="msg__list">${list.map((i) => `<button type="button" data-open="${i.id}"><img src="${i.img}" alt=""><span><small>${i.bairro}</small><b>${i.titulo}</b><em>${window.VP.brl(i.preco)}${i.mode === "aluguel" ? "/mês" : ""}</em></span></button>`).join("")}</div>` : ""}
      ${act.length ? `<div class="msg__acts">${act.map(([l, v]) => actHtml(l, v)).join("")}</div>` : ""}
      ${related.length ? `<div class="msg__rel"><small>Perguntas relacionadas</small>${related.map((q) => `<button type="button" data-ask="${esc(q)}">${q}</button>`).join("")}</div>` : ""}
      ${chips ? `<div class="msg__topics">${TOPICS.map(([c]) => `<button type="button" data-topic="${c}">${icon(c)}${c}</button>`).join("")}</div>` : ""}
      ${qs.length ? `<div class="msg__chips">${qs.map((q) => `<button type="button" data-ask="${esc(q)}">${q}</button>`).join("")}${back ? '<button type="button" class="is-back" data-topics>← Outros temas</button>' : ""}</div>` : ""}`;
    log.appendChild(el);
    scrollDown();
  }
  function typing() {
    const t = document.createElement("div");
    t.className = "msg msg--bot msg--typing";
    t.innerHTML = "<i></i><i></i><i></i>";
    log.appendChild(t); scrollDown();
    return t;
  }

  async function answer(text) {
    history.push({ role: "user", text });
    const sp = special(text);
    if (sp) return sp;
    if (RUDE.test(norm(text))) return { a: "Vamos manter a conversa respeitosa, combinado? Estou aqui para ajudar com compra, venda, aluguel e financiamento de imóveis. Em que posso ajudar?", chips: true };
    if (!inDomain(text)) return OFF_TOPIC;
    const r = rank(text);
    if (r.length && r[0].s >= 1.1) {
      const best = r[0].e;
      const related = r.slice(1).filter((x) => x.s >= 0.9 && x.e.q !== best.q).slice(0, 2).map((x) => x.e.q);
      return { a: best.a, act: best.act, related };
    }
    if (typeof window.VP_AI === "function") {
      try { const a = await window.VP_AI(text, history); if (a) return { a: esc(a), act: [["Falar com um especialista", "wa"]] }; } catch {}
    }
    const sug = r.slice(0, 3).map((x) => x.e.q);
    return { a: sug.length ? "Não tenho certeza se entendi. Você quis dizer alguma destas?" : "Essa eu prefiro passar para um especialista, para não te dar uma informação errada. Ele responde pelo WhatsApp.",
      related: sug, act: [["Perguntar a um especialista", "wa"]] };
  }

  async function ask(text) {
    text = text.trim();
    if (!text) return;
    addUser(text);
    input.value = "";
    const t = typing();
    const [res] = await Promise.all([answer(text), new Promise((r) => setTimeout(r, 450 + Math.min(text.length * 12, 600)))]);
    t.remove();
    addBot(res);
    save();
  }

  function showTopic(cat) {
    addUser(cat);
    const t = typing();
    setTimeout(() => {
      t.remove();
      addBot({ a: `Sobre <b>${cat}</b>, o que você quer saber? Escolha uma pergunta ou escreva a sua.`, qs: KB.filter((e) => e.cat === cat).map((e) => e.q), back: true });
      save();
    }, 350);
  }
  const save = () => { try { sessionStorage.setItem("vp-chat", log.innerHTML); } catch {} };

  function setOpen(open, welcome = true) {
    win.hidden = !open;
    root.classList.toggle("is-open", open);
    fab.setAttribute("aria-expanded", String(open));
    if (open) {
      if (welcome && !log.children.length) addBot({ a: "Olá! Sou o assistente da <b>Vitta Prime</b>. Posso tirar dúvidas sobre compra, aluguel, financiamento, lançamentos e sobre o seu imóvel. Escolha um tema ou escreva sua pergunta:", chips: true });
      setTimeout(() => input.focus(), 50);
    }
  }
  try { const saved = sessionStorage.getItem("vp-chat"); if (saved) log.innerHTML = saved; } catch {}

  fab.addEventListener("click", () => setOpen(win.hidden));
  $("#chatClose").addEventListener("click", () => { setOpen(false); fab.focus(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !win.hidden) { setOpen(false); fab.focus(); } });
  $("#chatForm").addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); });
  document.querySelectorAll("[data-chat]").forEach((b) => b.addEventListener("click", () => { setOpen(true); if (b.dataset.chat) ask(b.dataset.chat); }));

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-open-topic]");
    if (!t) return;
    const first = !log.children.length;
    setOpen(true, false);
    if (first) addBot({ a: "Olá! Sou o assistente da <b>Vitta Prime</b>." });
    showTopic(t.dataset.openTopic);
  });
  log.addEventListener("click", (e) => {
    const q = e.target.closest("[data-ask]");
    if (q) { ask(q.dataset.ask); return; }
    const tp = e.target.closest("[data-topic]");
    if (tp) { showTopic(tp.dataset.topic); return; }
    if (e.target.closest("[data-topics]")) { addBot({ a: "Claro! Escolha um tema:", chips: true }); save(); return; }
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const [type, val = ""] = b.dataset.act.split(/:(.*)/s);
    const VP = window.VP;
    if (matchMedia("(max-width: 600px)").matches) setOpen(false);
    if (type === "route") VP.openRoute(val);
    else if (type === "routes") VP.openRoutes();
    else if (type === "map") VP.focusMap(val);
    else if (type === "scroll") document.getElementById(val)?.scrollIntoView({ behavior: "smooth" });
    else if (type === "list") { const [mode, bairro = "", tipo = ""] = val.split("|"); VP.showListing({ mode, bairro, tipo }); }
  });
})();

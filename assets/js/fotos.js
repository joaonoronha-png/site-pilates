/* ==========================================================================
   CARRIONE FESTAS — FOTOS DO SITE
   --------------------------------------------------------------------------
   Este é o ÚNICO arquivo que precisa ser editado para colocar as fotos reais.

   1. Copie as fotos para a pasta  assets/fotos/  (JPG ou WEBP, ~1600px no lado
      maior, até ~300 KB cada — veja assets/fotos/LEIA-ME.md).
   2. Preencha os caminhos abaixo.

   Enquanto um espaço estiver vazio (''), o site exibe um fundo artístico nas
   cores do tema no lugar da foto. Nada quebra.

   [PENDENTE] Nenhuma foto real foi incluída ainda: Instagram e Facebook exigem
   login para baixar as imagens. Elas precisam ser enviadas pela Carrione.
   ========================================================================== */

window.CARRIONE_FOTOS = {

  /* Fotos de destaque ----------------------------------------------------- */
  destaques: {
    // Abertura do site. Use a foto MAIS bonita, horizontal (ex.: 2400x1600).
    hero:        { src: '', alt: 'Mesa de festa decorada pela Carrione Festas no Rio de Janeiro' },

    // Blocos de serviços (fotos verticais, ex.: 1200x1500).
    decoracao:   { src: '', alt: 'Decoração de festa personalizada da Carrione Festas' },
    pegueMonte:  { src: '', alt: 'Peças de decoração do Pegue e Monte da Carrione Festas' },
    buffet:      { src: '', alt: 'Mesa de buffet da Carrione Festas' },

    // Seção "Momentos Carrione" (editorial).
    momento1:    { src: '', alt: 'Detalhe de decoração de festa' },   // horizontal
    momento2:    { src: '', alt: 'Painel e mesa do bolo decorados' },  // vertical
    momento3:    { src: '', alt: 'Doces personalizados da festa' },    // vertical
    momento4:    { src: '', alt: 'Ambiente de festa montado' },        // horizontal
    momento5:    { src: '', alt: 'Detalhe de flores e arranjos' },     // vertical ou quadrada
  },

  /* Temas do portfólio ----------------------------------------------------
     Temas e álbuns confirmados no Linktree oficial (linktr.ee/carrionefestas).
     "tons" define as cores do fundo exibido enquanto não houver foto.
     "fotos": lista de fotos do tema. A primeira é usada como capa.
       Exemplo:
       fotos: [
         { src: 'assets/fotos/bailarina-1.jpg', w: 1200, h: 1500 },
         { src: 'assets/fotos/bailarina-2.jpg', w: 1600, h: 1067, alt: 'Mesa do bolo tema Bailarina' },
       ]
     "w" e "h" (largura/altura em px) são opcionais, mas evitam saltos no layout.
  ------------------------------------------------------------------------- */
  temas: [
    {
      id: 'bailarina', nome: 'Bailarina',
      album: 'https://www.facebook.com/media/set/?set=a.862440409354605&type=3',
      tons: ['#f4d9dc', '#e7b5bd', '#f7ebdf'],
      fotos: [],
    },
    {
      id: 'flamengo', nome: 'Flamengo',
      album: 'https://www.facebook.com/media/set/?set=a.858172553114724&type=3',
      tons: ['#b3202f', '#2a1b1f', '#e6cfc2'],
      fotos: [],
    },
    {
      id: 'mickey-safari', nome: 'Mickey Safari',
      album: 'https://www.facebook.com/media/set/?set=a.847164104215569&type=3',
      tons: ['#8c8a55', '#d9c49b', '#b0673a'],
      fotos: [],
    },
    {
      id: 'moana-baby', nome: 'Moana Baby',
      album: 'https://www.facebook.com/media/set/?set=a.856338589964787&type=3',
      tons: ['#4aa6a0', '#ecd9b8', '#e98d6f'],
      fotos: [],
    },
    {
      id: 'patrulha-canina', nome: 'Patrulha Canina',
      album: 'https://www.facebook.com/media/set/?set=a.847157777549535&type=3',
      tons: ['#2c4f8f', '#d24a3f', '#a8cbe8'],
      fotos: [],
    },
    {
      id: 'princesas-disney', nome: 'Princesas Disney',
      album: 'https://www.facebook.com/media/set/?set=a.847248760873770&type=3',
      tons: ['#cbb6e2', '#e8c47f', '#f2c9d7'],
      fotos: [],
    },
    {
      id: 'princesa-e-o-sapo', nome: 'Princesa e o Sapo',
      album: 'https://www.facebook.com/media/set/?set=a.862438586021454&type=3',
      tons: ['#6f9a5c', '#d8b35e', '#bba9d8'],
      fotos: [],
    },
  ],
};

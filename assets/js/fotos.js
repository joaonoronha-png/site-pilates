/* ==========================================================================
   CARRIONE FESTAS — FOTOS DO SITE
   --------------------------------------------------------------------------
   Este é o ÚNICO arquivo que precisa ser editado para colocar as fotos reais.

   1. Copie as fotos para a pasta  assets/fotos/  (JPG ou WEBP, ~1600px no lado
      maior, até ~300 KB cada — veja assets/fotos/LEIA-ME.md).
   2. Preencha os caminhos abaixo.

   Enquanto um espaço estiver vazio (''), o site exibe um fundo artístico nas
   cores do tema no lugar da foto. Nada quebra.

   Fotos atuais: álbuns públicos da página da Carrione Festas no Facebook
   (os mesmos linkados no Linktree oficial). Cada foto tem versão -800 (celular)
   e -1600 (telas grandes); o site escolhe a versão certa sozinho.
   ========================================================================== */

window.CARRIONE_FOTOS = {

  /* Fotos de destaque ----------------------------------------------------- */
  destaques: {
    // Abertura do site: fotos horizontais que se alternam (a primeira carrega primeiro).
    heroSlides: [
      { src: 'assets/fotos/bailarina-1-1600.webp', tema: 'Bailarina', alt: "Decoração tema Bailarina feita pela Carrione Festas, com painel redondo, balões rosa e lilás e mesa com saia de tule" },
      { src: 'assets/fotos/moana-baby-1-1600.webp', tema: 'Moana Baby', alt: "Decoração tema Moana Baby com arco de balões coloridos e painel do mar" },
      { src: 'assets/fotos/princesa-e-o-sapo-2-1600.webp', tema: 'Princesa e o Sapo', alt: "Decoração tema Princesa e o Sapo com balões lilás e piso florido" },
      { src: 'assets/fotos/princesas-disney-1-1600.webp', tema: 'Princesas Disney', alt: "Decoração tema Princesas Disney com balões rosa, azul e amarelo" },
    ],

    // Blocos de serviços (fotos verticais, ex.: 1200x1500).
    decoracao:   { src: 'assets/fotos/princesa-e-o-sapo-1-1600.webp', alt: "Decoração tema Princesa e o Sapo com balões lilás e verdes e mesas brancas" },
    pegueMonte:  { src: 'assets/fotos/bailarina-4-1600.webp', alt: "Arranjo de flores e peças de decoração sobre cilindro" },
    buffet:      { src: 'assets/fotos/princesa-e-o-sapo-4-1600.webp', alt: "Doces personalizados em festa decorada pela Carrione Festas" },

    // Seção "Momentos Carrione" (editorial).
    momento1:    { src: 'assets/fotos/moana-baby-1-1600.webp', alt: "Decoração tema Moana Baby com arco de balões coloridos, painel do mar e mesa do bolo" },   // horizontal
    momento2:    { src: 'assets/fotos/bailarina-2-1600.webp', alt: "Bolo rosa tema Bailarina com topo personalizado e base de flores" },  // vertical
    momento3:    { src: 'assets/fotos/princesas-disney-3-1600.webp', alt: "Display da Cinderela ao lado de cilindro com doces e caixas 'Era uma vez...'" },    // vertical
    momento4:    { src: 'assets/fotos/princesas-disney-1-1600.webp', alt: "Decoração tema Princesas Disney com balões rosa, azul e amarelo e personagens em displays" },        // horizontal
    momento5:    { src: 'assets/fotos/mickey-safari-6-1600.webp', alt: "Mickeys exploradores de biscuit em prato laranja" },     // vertical ou quadrada
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
      fotos: [
        { src: 'assets/fotos/bailarina-1-1600.webp', w: 1600, h: 1200, alt: "Decoração tema Bailarina com painel redondo, balões em tons de rosa e lilás e mesa com saia de tule" },
        { src: 'assets/fotos/bailarina-2-1600.webp', w: 1200, h: 1600, alt: "Bolo rosa tema Bailarina com topo personalizado e base de flores" },
        { src: 'assets/fotos/bailarina-3-1600.webp', w: 898, h: 1600, alt: "Doces personalizados de bailarina sobre cilindro de bolinhas" },
        { src: 'assets/fotos/bailarina-4-1600.webp', w: 898, h: 1600, alt: "Arranjo de flores lilás e doces personalizados sobre cilindro decorado" },
      ],
    },
    {
      id: 'flamengo', nome: 'Flamengo',
      album: 'https://www.facebook.com/media/set/?set=a.858172553114724&type=3',
      tons: ['#b3202f', '#2a1b1f', '#e6cfc2'],
      fotos: [
        { src: 'assets/fotos/flamengo-1-1600.webp', w: 960, h: 1280, alt: "Decoração tema Flamengo com painel do escudo, balões vermelhos e pretos e camisa do time" },
      ],
    },
    {
      id: 'mickey-safari', nome: 'Mickey Safari',
      album: 'https://www.facebook.com/media/set/?set=a.847164104215569&type=3',
      tons: ['#8c8a55', '#d9c49b', '#b0673a'],
      fotos: [
        { src: 'assets/fotos/mickey-safari-1-1600.webp', w: 960, h: 732, alt: "Decoração tema Mickey Safari com painel da selva, balões verdes e animais" },
        { src: 'assets/fotos/mickey-safari-2-1600.webp', w: 960, h: 626, alt: "Visão geral da decoração Mickey Safari com balões e troncos de madeira" },
        { src: 'assets/fotos/mickey-safari-3-1600.webp', w: 1280, h: 960, alt: "Docinhos com toppers de Mickey e animais da selva sobre tronco de madeira" },
        { src: 'assets/fotos/mickey-safari-4-1600.webp', w: 960, h: 1280, alt: "Pateta explorador e toppers de animais em vasinhos na mesa Mickey Safari" },
        { src: 'assets/fotos/mickey-safari-5-1600.webp', w: 960, h: 720, alt: "Cubos de madeira com letras e bichinhos de biscuit, tema Mickey Safari" },
        { src: 'assets/fotos/mickey-safari-6-1600.webp', w: 720, h: 960, alt: "Mickeys exploradores de biscuit em prato laranja" },
      ],
    },
    {
      id: 'moana-baby', nome: 'Moana Baby',
      album: 'https://www.facebook.com/media/set/?set=a.856338589964787&type=3',
      tons: ['#4aa6a0', '#ecd9b8', '#e98d6f'],
      fotos: [
        { src: 'assets/fotos/moana-baby-1-1600.webp', w: 1600, h: 1200, alt: "Decoração tema Moana Baby com arco de balões coloridos, painel do mar e mesa do bolo" },
        { src: 'assets/fotos/moana-baby-2-1600.webp', w: 1333, h: 1600, alt: "Mesa Moana Baby com palmeira, cilindros azuis e tartaruga de pelúcia" },
        { src: 'assets/fotos/moana-baby-3-1600.webp', w: 720, h: 960, alt: "Painel da Moana bebê com bolo e personagem em destaque" },
        { src: 'assets/fotos/moana-baby-4-1600.webp', w: 1200, h: 1600, alt: "Lateral da decoração Moana Baby com balões e corais" },
      ],
    },
    {
      id: 'patrulha-canina', nome: 'Patrulha Canina',
      album: 'https://www.facebook.com/media/set/?set=a.847157777549535&type=3',
      tons: ['#2c4f8f', '#d24a3f', '#a8cbe8'],
      fotos: [
        { src: 'assets/fotos/patrulha-canina-1-1600.webp', w: 719, h: 1031, alt: "Decoração tema Patrulha Canina com balões amarelos, vermelhos e azuis" },
        { src: 'assets/fotos/patrulha-canina-2-1600.webp', w: 960, h: 1280, alt: "Mesa com Marshall e doces personalizados da Patrulha Canina" },
        { src: 'assets/fotos/patrulha-canina-3-1600.webp', w: 1280, h: 960, alt: "Chase e doces personalizados com o nome do aniversariante, tema Patrulha Canina" },
        { src: 'assets/fotos/patrulha-canina-4-1600.webp', w: 959, h: 1259, alt: "Aparador branco com Rubble e miniaturas da Patrulha Canina" },
      ],
    },
    {
      id: 'princesas-disney', nome: 'Princesas Disney',
      album: 'https://www.facebook.com/media/set/?set=a.847248760873770&type=3',
      tons: ['#cbb6e2', '#e8c47f', '#f2c9d7'],
      fotos: [
        { src: 'assets/fotos/princesas-disney-1-1600.webp', w: 1600, h: 1158, alt: "Decoração tema Princesas Disney com balões rosa, azul e amarelo e personagens em displays" },
        { src: 'assets/fotos/princesas-disney-2-1600.webp', w: 1200, h: 1600, alt: "Caixas 'Era uma vez...' com bonecas das princesas e arranjo de rosas" },
        { src: 'assets/fotos/princesas-disney-3-1600.webp', w: 1200, h: 1600, alt: "Display da Cinderela ao lado de cilindro com doces e caixas 'Era uma vez...'" },
        { src: 'assets/fotos/princesas-disney-4-1600.webp', w: 1600, h: 858, alt: "Mesa das Princesas Disney com cilindros brancos e piso de bolinhas" },
      ],
    },
    {
      id: 'princesa-e-o-sapo', nome: 'Princesa e o Sapo',
      album: 'https://www.facebook.com/media/set/?set=a.862438586021454&type=3',
      tons: ['#6f9a5c', '#d8b35e', '#bba9d8'],
      fotos: [
        { src: 'assets/fotos/princesa-e-o-sapo-1-1600.webp', w: 1200, h: 1600, alt: "Decoração tema Princesa e o Sapo com balões lilás e verdes e mesas brancas" },
        { src: 'assets/fotos/princesa-e-o-sapo-2-1600.webp', w: 1600, h: 1200, alt: "Visão geral da decoração Princesa e o Sapo com piso florido" },
        { src: 'assets/fotos/princesa-e-o-sapo-3-1600.webp', w: 1200, h: 1600, alt: "Tiana e sapos em destaque na mesa da Princesa e o Sapo" },
        { src: 'assets/fotos/princesa-e-o-sapo-4-1600.webp', w: 1200, h: 1600, alt: "Doces personalizados tema Princesa e o Sapo" },
        { src: 'assets/fotos/princesa-e-o-sapo-5-1600.webp', w: 1200, h: 1600, alt: "Arranjos de flores, balões e cilindros na festa Princesa e o Sapo" },
      ],
    },
  ],
};

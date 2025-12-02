
import { Recipe } from '../types';

export const seasonalRecipesData: Record<string, Recipe[]> = {
  // --- SAZONAIS ---
  'Natal': [
    {
      title: "Peru de Natal Clássico (Passo a Passo)",
      time_minutes: 240,
      difficulty: "Difícil",
      servings: 10,
      rating: 5,
      image: "https://images.unsplash.com/photo-1574672174777-b41d8b620b04?q=80&w=1000&auto=format&fit=crop",
      used_ingredients: [
        "1 peru inteiro (aprox. 4kg)",
        "1 garrafa de vinho branco seco",
        "100g de manteiga derretida",
        "1 cebola grande",
        "4 dentes de alho",
        "Ervas finas (alecrim, tomilho)",
        "Sal e pimenta do reino a gosto",
        "Papel alumínio para cobrir"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1 (Planejamento): O **1 peru inteiro (aprox. 4kg)** demora para descongelar. Deixe-o na parte de baixo da geladeira por cerca de 48 horas antes do preparo. Mantenha na embalagem para não vazar.",
        "Passo 2 (Marinada): No liquidificador, bata a **1 garrafa de vinho branco seco**, a **1 cebola grande** descascada, os **4 dentes de alho**, as **ervas finas**, o sal e a pimenta até formar um líquido homogêneo e aromático.",
        "Passo 3 (Tempero): Coloque o peru (sem os miúdos que vêm dentro) em um saco plástico culinário grande ou em uma bacia funda. Despeje a marinada sobre ele, garantindo que pegue em tudo. Deixe na geladeira por **12 horas**, virando na metade do tempo.",
        "Passo 4 (Preparando para assar): Retire o peru da marinada e seque a pele levemente com papel toalha (isso ajuda a ficar crocante). Pincele os **100g de manteiga derretida** por toda a pele, caprichando no peito e nas coxas.",
        "Passo 5 (Forno): Pré-aqueça o forno a 200°C por 15 minutos. Cubra a assadeira do peru com **papel alumínio** (lado brilhante para dentro) vedando bem as laterais. Asse por cerca de **2 horas**.",
        "Passo 6 (Dourar): Retire o papel alumínio com cuidado (sai vapor quente!). Regue o peru com o caldo que formou no fundo da assadeira. Volte ao forno por mais **1 hora e meia** ou até o pino do termômetro (se tiver) pular, ou até a pele ficar bem dourada e a carne macia.",
        "Passo 7: Deixe descansar por 20 minutos antes de cortar para a carne ficar suculenta."
      ],
      tags: ["Natal", "Clássico", "Ave", "Forno"]
    },
    {
      title: "Tender Glaceado com Mel e Laranja",
      time_minutes: 60,
      difficulty: "Médio",
      servings: 8,
      rating: 4.9,
      image: "https://claudia.abril.com.br/wp-content/uploads/2020/02/receita-tender-molho-agridoce-laranja-1.jpg",
      used_ingredients: [
        "1 tender bolinha (aprox. 1kg)",
        "1 xícara de mel",
        "1 xícara de suco de laranja natural",
        "Cravos da índia a gosto",
        "Rodelas de abacaxi ou pêssego para decorar",
        "Cerejas em calda para decorar"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Com uma faca afiada, faça cortes superficiais na pele do **1 tender bolinha**, formando losangos (quadradinhos). Não corte muito fundo para não despedaçar a carne.",
        "Passo 2: Em cada cruzamento dos cortes, espete um **cravo da índia**. Isso dá o aroma clássico e deixa o visual lindo.",
        "Passo 3: Em uma tigela, misture a **1 xícara de mel** com a **1 xícara de suco de laranja**. Pincele generosamente sobre o tender.",
        "Passo 4: Coloque o tender em uma assadeira, decore ao redor com as **rodelas de abacaxi**. Cubra com papel alumínio e leve ao forno médio (180°C) por **30 minutos**.",
        "Passo 5: Retire o papel alumínio. Regue o tender com o caldo da forma e pincele mais da mistura de mel. Deixe assar por mais **15 a 20 minutos** até ficar brilhante e dourado.",
        "Passo 6: Decore o centro das frutas com as **cerejas** e sirva fatiado bem fininho."
      ],
      tags: ["Natal", "Porco", "Agridoce"]
    },
    {
      title: "Salpicão de Frango Tradicional",
      time_minutes: 40,
      difficulty: "Fácil",
      servings: 8,
      rating: 4.9,
      image: "https://img.cybercook.com.br/receitas/12/salpicao-de-frango-tradicional-6.jpeg",
      used_ingredients: [
        "1kg de peito de frango cozido e desfiado",
        "2 cenouras raladas",
        "1 lata de milho verde",
        "100g de uva passa (opcional)",
        "1 maçã verde picada",
        "1 pote de maionese (500g)",
        "1 caixinha de creme de leite",
        "Suco de 1 limão",
        "Batata palha a gosto"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1 (Preparação): Cozinhe o **1kg de peito de frango** apenas em água e sal até ficar bem macio. Espere esfriar e desfie bem fininho com um garfo ou na batedeira.",
        "Passo 2 (Mistura Seca): Em uma tigela bem grande, coloque o frango desfiado, as **2 cenouras raladas** (ralo grosso), a **1 lata de milho verde** escorrida, a **1 maçã verde picada** (sem semente) e os **100g de uva passa**.",
        "Passo 3 (Tempero): Tempere essa mistura com sal, pimenta do reino a gosto e o **suco de 1 limão**. O limão ajuda a dar sabor e impede a maçã de escurecer.",
        "Passo 4 (Cremosidade): Adicione o **1 pote de maionese** inteiro e a **1 caixinha de creme de leite**. Misture muito bem com uma colher grande até tudo ficar envolvido pelo creme.",
        "Passo 5 (Geladeira): O salpicão fica melhor gelado. Cubra e leve à geladeira por pelo menos **1 hora** antes de servir.",
        "Passo 6 (Finalização): Só coloque a **batata palha a gosto** por cima na hora exata de servir, para ela não murchar e continuar crocante."
      ],
      tags: ["Natal", "Frio", "Acompanhamento"]
    },
    {
      title: "Arroz à Grega Colorido",
      time_minutes: 25,
      difficulty: "Fácil",
      servings: 6,
      rating: 4.7,
      image: "https://www.sabornamesa.com.br/media/k2/items/cache/arroz-a-grega-receita-capa_XL.jpg",
      used_ingredients: [
        "2 xícaras de arroz branco cru",
        "1 cenoura cortada em cubinhos pequenos",
        "1 pimentão vermelho picado",
        "1 lata de milho verde",
        "1/2 xícara de uvas passas",
        "1 colher (sopa) de manteiga",
        "4 xícaras de água fervente",
        "Sal e alho a gosto"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Em uma panela, derreta a **1 colher (sopa) de manteiga** e refogue o alho picado.",
        "Passo 2: Adicione a **1 cenoura** em cubinhos e o **1 pimentão** picado. Refogue por 2 minutos para eles começarem a amaciar, mas sem desmanchar.",
        "Passo 3: Jogue as **2 xícaras de arroz** e refogue junto ('fritar o arroz') até ficar branquiçado.",
        "Passo 4: Adicione a **1 lata de milho**, as **1/2 xícara de uvas passas** e sal a gosto. Misture.",
        "Passo 5: Despeje as **4 xícaras de água fervente**. Quando a água baixar ao nível do arroz, tampe a panela e abaixe o fogo.",
        "Passo 6: Cozinhe até secar a água e o arroz estar macio. Solte os grãos com um garfo antes de servir."
      ],
      tags: ["Natal", "Acompanhamento", "Vegano"]
    },
    {
      title: "Farofa Natalina Rica",
      time_minutes: 30,
      difficulty: "Fácil",
      servings: 8,
      rating: 4.8,
      image: "https://claudia.abril.com.br/wp-content/uploads/2020/02/receita-farofa-california-natal-1.jpg",
      used_ingredients: [
        "500g de farinha de mandioca torrada",
        "200g de bacon picado",
        "1 calabresa picada",
        "100g de manteiga",
        "1 cebola picada",
        "3 ovos cozidos picados",
        "Azeitonas picadas",
        "Salsinha a gosto"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Corte os **200g de bacon** e a **1 calabresa** em cubinhos pequenos. Pique também a **1 cebola**.",
        "Passo 2: Em uma panela grande, derreta os **100g de manteiga** em fogo médio. Adicione o bacon e a calabresa e frite mexendo de vez em quando até ficarem dourados.",
        "Passo 3: Adicione a cebola picada na mesma panela e refogue até ela ficar transparente e macia (uns 3 minutos).",
        "Passo 4: Abaixe o fogo. Vá adicionando os **500g de farinha de mandioca** aos poucos, mexendo sem parar para não queimar o fundo. Deixe a farinha 'torrar' nessa gordura por uns **5 minutos** para ficar crocante.",
        "Passo 5: Desligue o fogo. Misture delicadamente os **3 ovos cozidos picados**, as **azeitonas picadas** e a **salsinha a gosto**.",
        "Passo 6: Prove um pouquinho (cuidado que está quente) e veja se precisa de sal. Sirva em uma travessa bonita."
      ],
      tags: ["Natal", "Acompanhamento", "Brasileira"]
    },
    {
      title: "Rabanada de Forno (Sem Fritura)",
      time_minutes: 40,
      difficulty: "Fácil",
      servings: 10,
      rating: 4.7,
      image: "https://vovopalmirinha.com.br/wp-content/uploads/2020/02/rabanada-forno.jpg",
      used_ingredients: [
        "4 pães franceses amanhecidos (duriinhos)",
        "2 xícaras de leite",
        "1 lata de leite condensado",
        "3 ovos",
        "Açúcar e canela para polvilhar",
        "Manteiga para untar a forma"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Corte os **4 pães franceses** em fatias grossas (cerca de 2 dedos de largura). Se cortar muito fino, elas desmancham.",
        "Passo 2: Pegue duas tigelas. Na primeira, misture as **2 xícaras de leite** e a **1 lata de leite condensado** até dissolver bem. Na segunda, bata os **3 ovos** com um garfo até misturar clara e gema.",
        "Passo 3: Unte uma assadeira grande com bastante **manteiga**.",
        "Passo 4: Pegue uma fatia de pão, mergulhe rapidamente na mistura de leite (não deixe encharcar demais senão quebra), depois passe nos ovos batidos e coloque na assadeira. Repita com todos.",
        "Passo 5: Leve ao forno médio (180°C) por cerca de **15 a 20 minutos**. Abra o forno, vire as rabanadas com uma espátula e deixe dourar o outro lado por mais **10 minutos**.",
        "Passo 6: Tire do forno e, enquanto ainda estão quentes, passe cada uma em um prato com **açúcar e canela** misturados."
      ],
      tags: ["Natal", "Sobremesa", "Econômica"]
    }
  ],
  'Festa Junina': [
    {
      title: "Bolo de Fubá Cremoso de Liquidificador",
      time_minutes: 55,
      difficulty: "Fácil",
      servings: 12,
      rating: 5,
      image: "https://images.unsplash.com/photo-1610626087588-410c59828d50?q=80&w=1000&auto=format&fit=crop",
      used_ingredients: [
        "4 xícaras de leite",
        "4 ovos",
        "3 xícaras de açúcar",
        "2 xícaras de fubá",
        "2 colheres (sopa) de manteiga",
        "100g de queijo parmesão ralado",
        "1 colher (sopa) de fermento em pó"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Pré-aqueça o forno a 180°C. Unte uma forma retangular média com manteiga e polvilhe um pouco de fubá nela toda.",
        "Passo 2: No liquidificador, coloque os **4 ovos**, as **4 xícaras de leite**, as **3 xícaras de açúcar**, as **2 xícaras de fubá**, as **2 colheres (sopa) de manteiga** e os **100g de queijo parmesão**. Bata bem por uns 3 minutos até ficar tudo misturado.",
        "Passo 3: Adicione a **1 colher (sopa) de fermento** por último e misture delicadamente com uma colher ou use a função 'pulsar' do liquidificador apenas duas vezes. A massa fica bem líquida mesmo, parece água, não se assuste!",
        "Passo 4: Despeje na forma com cuidado e leve ao forno por cerca de **40 a 50 minutos**.",
        "Passo 5: O bolo estará pronto quando estiver dourado em cima. Ele fica com o centro meio mole (cremoso) mesmo. Espere esfriar completamente para cortar, senão ele desmancha."
      ],
      tags: ["Festa Junina", "Bolo", "Lanche"]
    },
    {
      title: "Curau de Milho Verde (Tradicional)",
      time_minutes: 40,
      difficulty: "Médio",
      servings: 8,
      rating: 4.8,
      image: "https://vovopalmirinha.com.br/wp-content/uploads/2017/06/curau.jpg",
      used_ingredients: [
        "4 espigas de milho verde (ou 3 latas de milho sem água)",
        "1 litro de leite",
        "1 xícara e 1/2 de açúcar",
        "1 pitada de sal",
        "1 colher (sopa) de manteiga",
        "Canela em pó para polvilhar"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Se usar espigas, corte os grãos rente ao sabugo com uma faca. Se usar lata, escorra toda a água. Coloque o milho no liquidificador com **500ml de leite**. Bata muito bem por 3 minutos.",
        "Passo 2 (Peneirar): Passe essa mistura por uma peneira fina ou um pano limpo, espremendo bem para sair todo o suco do milho. O bagaço que sobrar na peneira pode ser usado para fazer bolo, mas para o curau só queremos o líquido.",
        "Passo 3: Coloque esse caldo de milho coado em uma panela. Adicione o restante do leite (**mais 500ml**), a **1 e 1/2 xícara de açúcar**, a **pitada de sal** e a **1 colher de manteiga**.",
        "Passo 4: Leve ao fogo médio, mexendo SEM PARAR com uma colher de pau ou fouet. É igual fazer brigadeiro, se parar de mexer, empelota.",
        "Passo 5: O creme vai engrossar. Quando começar a borbulhar, abaixe o fogo e cozinhe por mais **10 minutos** para não ficar com gosto de milho cru.",
        "Passo 6: Despeje em uma travessa ou potinhos. Polvilhe **canela em pó** a gosto. Pode comer quente ou gelado."
      ],
      tags: ["Festa Junina", "Sobremesa", "Milho"]
    },
    {
      title: "Caldo Verde com Calabresa",
      time_minutes: 40,
      difficulty: "Fácil",
      servings: 6,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1547592166-23acbe346499?q=80&w=1000&auto=format&fit=crop",
      used_ingredients: [
        "1kg de batata descascada",
        "2 linguiças calabresas em rodelas",
        "1 maço de couve manteiga fatiada bem fina",
        "1 cebola picada",
        "2 dentes de alho amassados",
        "Azeite e sal a gosto"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Descasque o **1kg de batata** e cozinhe em água até ficarem bem moles, quase desmanchando. Não jogue a água fora!",
        "Passo 2: Bata as batatas no liquidificador junto com a água do cozimento até virar um creme liso. Reserve.",
        "Passo 3: Em uma panela grande, coloque um fio de azeite e frite as **2 linguiças calabresas** em rodelas até dourarem. Adicione a **1 cebola picada** e os **2 dentes de alho** e refogue junto por 2 minutos.",
        "Passo 4: Despeje o creme de batata na panela com a calabresa. Misture bem e deixe ferver. Prove o sal e ajuste se precisar.",
        "Passo 5: Quando estiver fervendo, desligue o fogo. Adicione o **1 maço de couve** fatiada e misture. O calor do caldo cozinha a couve na medida certa para ela ficar verdinha.",
        "Passo 6: Sirva quente com um fio de azeite por cima."
      ],
      tags: ["Festa Junina", "Sopa", "Inverno"]
    },
    {
      title: "Canjica Branca Cremosa",
      time_minutes: 60,
      difficulty: "Médio",
      servings: 10,
      rating: 4.9,
      image: "https://static.itdg.com.br/images/1200-675/d87178c52089c16928e4695574514300/314227-original.jpg",
      used_ingredients: [
        "500g de canjica branca (milho para canjica)",
        "1 lata de leite condensado",
        "1 litro de leite",
        "5 cravos da índia",
        "1 pau de canela",
        "200ml de leite de coco",
        "Canela em pó para polvilhar"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1 (De molho): Coloque os **500g de canjica** em uma tigela grande, cubra com bastante água e deixe descansar de um dia para o outro (ou pelo menos 12 horas). Isso amacia o grão.",
        "Passo 2 (Cozimento): Escorra a água do molho. Coloque a canjica na panela de pressão e cubra com água nova (uns 4 dedos acima do milho). Cozinhe por **30 a 40 minutos** após pegar pressão.",
        "Passo 3: Abra a panela com cuidado (tire a pressão antes). Se o milho estiver molinho, adicione o **1 litro de leite**, a **1 lata de leite condensado**, os **200ml de leite de coco**, os **5 cravos** e o **pau de canela**.",
        "Passo 4 (Apurar): Deixe ferver em fogo baixo, com a panela destampada, mexendo de vez em quando para não grudar no fundo. Cozinhe por mais uns **20 minutos** até o caldo ficar grosso e cremoso.",
        "Passo 5: Sirva quente em potinhos e polvilhe **canela em pó** por cima."
      ],
      tags: ["Festa Junina", "Sobremesa", "Quente"]
    },
    {
      title: "Paçoca de Colher (Verrine)",
      time_minutes: 20,
      difficulty: "Muito Fácil",
      servings: 6,
      rating: 4.9,
      image: "https://www.receiteria.com.br/wp-content/uploads/pacoca-de-colher-01.jpg",
      used_ingredients: [
        "500g de amendoim torrado e sem pele (sem sal)",
        "1 lata de leite condensado",
        "1 caixinha de creme de leite",
        "1 colher (sopa) de manteiga",
        "Paçocas rolha para decorar"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Triture os **500g de amendoim** no liquidificador ou processador até virar uma farinha grossa (xerém). Não bata demais para não virar pasta.",
        "Passo 2: Em uma panela, misture a **1 lata de leite condensado**, a **1 colher de manteiga** e metade do amendoim triturado.",
        "Passo 3: Leve ao fogo médio, mexendo sempre, até dar o ponto de brigadeiro mole (desgrudando levemente do fundo).",
        "Passo 4: Desligue o fogo e misture a **1 caixinha de creme de leite** para ficar cremoso.",
        "Passo 5: Monte em copinhos: coloque uma camada do creme de amendoim e uma camada do restante do amendoim triturado.",
        "Passo 6: Esfarele uma paçoca pronta por cima para decorar e leve para gelar."
      ],
      tags: ["Festa Junina", "Doce", "Amendoim"]
    },
    {
      title: "Pamonha de Forno (Sem palha)",
      time_minutes: 60,
      difficulty: "Fácil",
      servings: 8,
      rating: 4.6,
      image: "https://claudia.abril.com.br/wp-content/uploads/2020/02/receita-pamonha-de-forno.jpg",
      used_ingredients: [
        "2 latas de milho verde (escorra a água)",
        "1 garrafa de leite de coco (200ml)",
        "2 xícaras de açúcar",
        "4 ovos",
        "1/2 xícara de queijo parmesão ralado",
        "1 colher (sopa) de fermento em pó"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Pré-aqueça o forno a 180°C. Unte uma forma média com manteiga e farinha.",
        "Passo 2: No liquidificador, coloque as **2 latas de milho** (sem a água), a **1 garrafa de leite de coco**, os **4 ovos** e as **2 xícaras de açúcar**. Bata bem por uns **3 a 4 minutos** até o milho ficar bem triturado.",
        "Passo 3: Adicione a **1/2 xícara de queijo parmesão** e a **1 colher (sopa) de fermento**. Bata rapidinho (só aperte o botão pulsar) apenas para misturar.",
        "Passo 4: Despeje na forma e leve ao forno por cerca de **45 a 50 minutos**.",
        "Passo 5: A pamonha estará pronta quando estiver dourada por cima e firme. Espere amornar para cortar em quadrados."
      ],
      tags: ["Festa Junina", "Milho", "Lanche"]
    }
  ],
  'Páscoa': [
    {
      title: "Bacalhau à Gomes de Sá Simples",
      time_minutes: 60,
      difficulty: "Médio",
      servings: 6,
      rating: 5,
      image: "https://naminhapanela.com/wp-content/uploads/2012/03/Bacalhau-Gomes-de-Sa-2-1024x680.jpg",
      used_ingredients: [
        "500g de bacalhau dessalgado em lascas",
        "500g de batatas cozidas em rodelas",
        "3 ovos cozidos em rodelas",
        "2 cebolas cortadas em rodelas",
        "1/2 xícara de azeite extra virgem",
        "Azeitonas pretas",
        "Salsinha picada"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Coloque água numa panela e, quando ferver, jogue os **500g de bacalhau**. Deixe ferver por 10 minutos. Escorra e reserve.",
        "Passo 2: Na mesma água (que pegou gosto), cozinhe os **500g de batatas** em rodelas até ficarem macias (mas não desmanchando). Escorra.",
        "Passo 3: Em uma frigideira grande e funda, coloque metade da **1/2 xícara de azeite** e refogue as **2 cebolas** em rodelas até ficarem transparentes.",
        "Passo 4: Adicione o bacalhau e as batatas na frigideira com a cebola. Misture com cuidado para não quebrar as batatas.",
        "Passo 5: Passe tudo para um refratário bonito que possa ir ao forno. Leve ao forno por **15 minutos** apenas para esquentar bem.",
        "Passo 6: Retire do forno. Decore com os **3 ovos cozidos**, as **azeitonas pretas** e a **salsinha picada**. Regue com o resto do azeite antes de servir."
      ],
      tags: ["Páscoa", "Peixe", "Clássico"]
    },
    {
      title: "Bacalhau com Natas (Cremoso)",
      time_minutes: 50,
      difficulty: "Médio",
      servings: 6,
      rating: 5,
      image: "https://receitas.ig.com.br/wp-content/uploads/2021/03/bacalhau-com-natas.jpg",
      used_ingredients: [
        "500g de bacalhau dessalgado e desfiado",
        "500g de batatas em cubos",
        "2 caixinhas de creme de leite (substituindo natas)",
        "2 cebolas picadas",
        "2 dentes de alho",
        "100g de queijo parmesão ralado",
        "Azeite e noz moscada"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Frite os **500g de batatas** em cubos em óleo quente até ficarem douradas (não precisa ficar super crocante, pois vai ao forno). Escorra em papel toalha.",
        "Passo 2: Em uma panela larga, refogue as **2 cebolas** e o alho em bastante azeite até a cebola murchar.",
        "Passo 3: Adicione o **bacalhau desfiado** e refogue por uns 5 minutos. Junte as batatas fritas e misture com cuidado.",
        "Passo 4: Adicione as **2 caixinhas de creme de leite**. Tempere com noz moscada e pimenta do reino. Se ficar muito seco, ponha um pouquinho de leite. Deixe aquecer bem, mas não ferver muito.",
        "Passo 5: Transfira para um refratário. Polvilhe os **100g de queijo parmesão** por cima.",
        "Passo 6: Leve ao forno alto (220°C) até gratinar (ficar marrom dourado por cima), cerca de **15 a 20 minutos**."
      ],
      tags: ["Páscoa", "Peixe", "Cremoso"]
    },
    {
      title: "Ovo de Páscoa de Travessa",
      time_minutes: 40,
      difficulty: "Fácil",
      servings: 10,
      rating: 4.9,
      image: "https://www.receiteria.com.br/wp-content/uploads/ovo-de-pascoa-na-travessa-13.jpg",
      used_ingredients: [
        "3 latas de leite condensado (total)",
        "3 caixas de creme de leite (total)",
        "4 colheres (sopa) de chocolate em pó",
        "1 colher (sopa) de manteiga",
        "200g de chocolate meio amargo picado",
        "Raspas de chocolate para decorar"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1 (Creme Escuro): Em uma panela, coloque 1 lata de leite condensado, 1 caixa de creme de leite, as **4 colheres (sopa) de chocolate em pó** e a **1 colher (sopa) de manteiga**. Mexa em fogo médio até virar um brigadeiro mole (desgrudando levemente do fundo). Despeje no fundo de uma travessa.",
        "Passo 2 (Creme Branco): Em outra panela limpa, coloque 1 lata de leite condensado e 1 caixa de creme de leite. Mexa em fogo médio até engrossar (ponto de brigadeiro mole). Despeje com cuidado por cima do creme escuro na travessa.",
        "Passo 3 (Ganache): Derreta os **200g de chocolate meio amargo** no microondas (de 30 em 30 segundos, mexendo sempre). Misture com 1 caixinha de creme de leite até ficar um creme liso e brilhante.",
        "Passo 4: Espalhe essa ganache por cima do creme branco.",
        "Passo 5: Decore com as **raspas de chocolate** e leve à geladeira por pelo menos 2 horas antes de servir."
      ],
      tags: ["Páscoa", "Sobremesa", "Chocolate"]
    },
    {
      title: "Colomba Pascal (Massa Fácil)",
      time_minutes: 90,
      difficulty: "Médio",
      servings: 8,
      rating: 4.5,
      image: "https://www.sabornamesa.com.br/media/k2/items/cache/0904d13e33464a4b49467657d2948c26_XL.jpg",
      used_ingredients: [
        "500g de farinha de trigo",
        "10g de fermento biológico seco (para pão)",
        "100g de manteiga em temperatura ambiente",
        "3 gemas",
        "1/2 xícara de açúcar",
        "1 xícara de água morna",
        "Gotas de chocolate ou frutas cristalizadas"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1 (Esponja): Em uma tigela, misture os **10g de fermento**, meia xícara de farinha e a **1 xícara de água morna**. Cubra com um pano e deixe descansar por 15 minutos até espumar.",
        "Passo 2: Na mesma tigela, adicione o resto da farinha (**500g total**), a **1/2 xícara de açúcar**, os **100g de manteiga** e as **3 gemas**. Misture bem com as mãos e sove a massa por uns 10 minutos até ficar lisa e elástica.",
        "Passo 3: Misture as **gotas de chocolate** (ou frutas) na massa.",
        "Passo 4: Coloque a massa em uma forma de papel própria para Colomba (vende em lojas de festa) ou em uma forma redonda untada.",
        "Passo 5: Cubra com um pano e deixe descansar em lugar morno por **1 hora** (ela vai dobrar de tamanho).",
        "Passo 6: Leve ao forno pré-aquecido a 180°C por cerca de **35 a 40 minutos** até ficar dourada."
      ],
      tags: ["Páscoa", "Pão", "Doce"]
    }
  ],
  'Ano Novo': [
    {
      title: "Lombo Suíno com Abacaxi",
      time_minutes: 120,
      difficulty: "Médio",
      servings: 8,
      rating: 4.8,
      image: "https://i.pinimg.com/originals/93/29/4f/93294f9996d914569426f04c06236b28.jpg",
      used_ingredients: [
        "1.5kg de lombo de porco inteiro (peça única)",
        "1 abacaxi cortado em meias rodelas",
        "1 xícara de vinho branco (ou suco de abacaxi)",
        "4 colheres (sopa) de mel ou açúcar mascavo",
        "3 dentes de alho amassados",
        "Suco de 1 limão",
        "Sal e alecrim a gosto"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1 (Tempero): Em uma tigela, misture a **1 xícara de vinho**, o **suco de 1 limão**, os **3 dentes de alho**, o sal e o alecrim. Coloque o **1.5kg de lombo** nessa mistura e deixe marinar na geladeira por 4 horas para pegar gosto.",
        "Passo 2: Coloque o lombo em uma assadeira. Com uma faca afiada, faça cortes profundos na carne (como se fosse fatiar, mas sem separar as fatias até o fim).",
        "Passo 3: Em cada corte desse, encaixe uma meia rodela do **1 abacaxi**.",
        "Passo 4: Regue com a marinada, cubra com papel alumínio e leve ao forno (200°C) por **1 hora e 15 minutos**.",
        "Passo 5: Tire o papel alumínio. Pincele as **4 colheres (sopa) de mel** (ou açúcar) por cima da carne.",
        "Passo 6: Volte ao forno (agora sem papel) por mais **20 a 30 minutos** até a carne ficar dourada e caramelizada."
      ],
      tags: ["Ano Novo", "Carne", "Agridoce"]
    },
    {
      title: "Arroz com Lentilha da Sorte",
      time_minutes: 30,
      difficulty: "Fácil",
      servings: 6,
      rating: 4.7,
      image: "https://www.comidaereceitas.com.br/img/sizeswp/1200x675/2008/12/Arroz_lentilha.jpg",
      used_ingredients: [
        "1 xícara de lentilha crua",
        "1 xícara de arroz branco",
        "2 cebolas grandes cortadas em rodelas",
        "3 colheres (sopa) de azeite",
        "Sal a gosto",
        "4 xícaras de água fervente"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Coloque a **1 xícara de lentilha** em uma panela com água e cozinhe por 10 minutos. Ela tem que ficar 'al dente' (meio durinha ainda), não pode desmanchar. Escorra a água e reserve a lentilha.",
        "Passo 2 (Cebola Caramelizada): Em uma frigideira, aqueça as **3 colheres (sopa) de azeite** e frite as **2 cebolas** em rodelas em fogo médio/baixo, mexendo sempre, até elas ficarem bem marrons e docinhas. Reserve metade para decorar.",
        "Passo 3: Na panela do arroz, coloque a outra metade da cebola frita e refogue a **1 xícara de arroz** cru junto. Adicione a lentilha pré-cozida.",
        "Passo 4: Jogue as **4 xícaras de água fervente** e o sal. Deixe cozinhar com a panela semi-tampada até a água secar e o arroz ficar macio.",
        "Passo 5: Solte o arroz com um garfo, coloque numa travessa e jogue o restante da cebola frita por cima para decorar."
      ],
      tags: ["Ano Novo", "Acompanhamento", "Sorte"]
    },
    {
      title: "Pudim de Leite Condensado (Sem Erro)",
      time_minutes: 90,
      difficulty: "Médio",
      servings: 10,
      rating: 5,
      image: "https://images.unsplash.com/photo-1590069006232-a544b6765d75?q=80&w=1000&auto=format&fit=crop",
      used_ingredients: [
        "1 lata de leite condensado",
        "2 latas de leite (use a lata de leite condensado vazia para medir)",
        "3 ovos inteiros",
        "1 xícara de açúcar (para a calda)"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1 (Calda): Coloque a **1 xícara de açúcar** direto na forma de pudim (aquela com furo no meio). Leve ao fogo baixo no fogão, mexendo a forma (use uma luva!) até o açúcar derreter e virar um caramelo dourado. Espalhe esse caramelo pelo fundo e laterais da forma e deixe esfriar.",
        "Passo 2 (Massa): No liquidificador, bata a **1 lata de leite condensado**, as **2 latas de leite** e os **3 ovos** por 3 minutos. Bater bastante ajuda a tirar o cheiro de ovo.",
        "Passo 3: Despeje essa mistura na forma caramelizada (se quiser sem furinhos, passe por uma peneira ao despejar).",
        "Passo 4 (Banho-Maria): Cubra a forma com papel alumínio. Coloque a forma de pudim dentro de uma assadeira maior com água quente (até a metade da altura da forma do pudim).",
        "Passo 5: Leve ao forno (180°C) por **1 hora e 30 minutos**.",
        "Passo 6: Importante: Deixe esfriar totalmente fora da geladeira e depois leve para gelar por pelo menos 4 horas antes de tentar desenformar."
      ],
      tags: ["Ano Novo", "Sobremesa", "Clássico"]
    },
    {
      title: "Mousse de Maracujá Rápido",
      time_minutes: 15,
      difficulty: "Muito Fácil",
      servings: 6,
      rating: 4.8,
      image: "https://receitinhas.com.br/wp-content/uploads/2017/01/Mousse-de-maracuja-1-1200x900.jpg",
      used_ingredients: [
        "1 lata de leite condensado",
        "1 lata de creme de leite (sem soro se possível)",
        "1 lata de suco de maracujá concentrado (use a lata de leite condensado para medir)",
        "Polpa de 1 maracujá fresco para decorar"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: No liquidificador, coloque a **1 lata de leite condensado**, a **1 lata de creme de leite** e a **1 medida da lata de suco concentrado**.",
        "Passo 2: Bata por **3 a 4 minutos**. Quanto mais bater, mais aerado e firme ele fica.",
        "Passo 3: Despeje em taças individuais ou em uma travessa.",
        "Passo 4: Espalhe as sementes da **polpa do maracujá fresco** por cima para decorar.",
        "Passo 5: Leve à geladeira por pelo menos **2 horas** para firmar antes de servir."
      ],
      tags: ["Ano Novo", "Sobremesa", "Rápido"]
    }
  ],

  // --- REFEIÇÕES ---
  'Café da Manhã': [
    {
      title: "Pão de Queijo Mineiro (Escaldado)",
      time_minutes: 45,
      difficulty: "Médio",
      servings: 20,
      rating: 5,
      image: "https://images.unsplash.com/photo-1598142993883-93d39366df21?q=80&w=1000&auto=format&fit=crop",
      used_ingredients: [
        "500g de polvilho azedo",
        "1 xícara de leite",
        "1/2 xícara de óleo",
        "1/2 xícara de água",
        "1 colher (chá) de sal",
        "2 ovos",
        "300g de queijo minas padrão ralado"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Em uma tigela grande, coloque os **500g de polvilho azedo**.",
        "Passo 2: Em uma panela, ferva a **1 xícara de leite**, a **1/2 xícara de óleo**, a **1/2 xícara de água** e a **1 colher (chá) de sal**. Tem que ferver mesmo, subir bolha.",
        "Passo 3 (Escaldar): Despeje esse líquido fervente sobre o polvilho e misture com uma colher grande imediatamente. Vai virar uma 'farofa' grudenta. Deixe esfriar um pouco para não cozinhar os ovos.",
        "Passo 4: Quando estiver morno, adicione os **2 ovos** e amasse com as mãos. No começo parece que deu errado, continue amassando.",
        "Passo 5: Adicione os **300g de queijo ralado** e amasse até a massa soltar da mão e ficar lisa.",
        "Passo 6: Faça bolinhas, coloque em uma assadeira (não precisa untar) e asse em forno pré-aquecido a 180°C por **20 a 25 minutos** até dourar."
      ],
      tags: ["Café da Manhã", "Clássico", "Sem Glúten"]
    },
    {
      title: "Bolo de Cenoura com Cobertura de Chocolate",
      time_minutes: 50,
      difficulty: "Fácil",
      servings: 10,
      rating: 5,
      image: "https://images.unsplash.com/photo-1598155523122-38423bf4d6cb?q=80&w=1000&auto=format&fit=crop",
      used_ingredients: [
        "3 cenouras médias (descascadas e picadas)",
        "3 ovos",
        "1 xícara de óleo",
        "2 xícaras de açúcar",
        "2 xícaras de farinha de trigo",
        "1 colher (sopa) de fermento",
        "Cobertura: 1 colher de manteiga, 3 de chocolate, 1 de açúcar, 1/2 xícara de leite"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1 (Massa): No liquidificador, bata as **3 cenouras**, os **3 ovos** e a **1 xícara de óleo** até ficar um creme laranja bem liso. Se ficar pedaço de cenoura, o bolo sola.",
        "Passo 2: Em uma tigela, coloque o creme de cenoura e misture as **2 xícaras de açúcar**. Depois, adicione as **2 xícaras de farinha de trigo** aos poucos, peneirando se possível. Misture delicadamente.",
        "Passo 3: Adicione o **fermento** por último e misture devagar.",
        "Passo 4: Asse em forma untada (forno 180°C) por **40 minutos**.",
        "Passo 5 (Cobertura Craquelada): Misture todos os ingredientes da cobertura em uma panela. Deixe ferver até engrossar. Despeje sobre o bolo ainda morno."
      ],
      tags: ["Café da Manhã", "Bolo", "Doce"]
    },
    {
      title: "Ovos Mexidos Cremosos de Hotel",
      time_minutes: 10,
      difficulty: "Fácil",
      servings: 2,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1519727402857-e4359074094a?q=80&w=1000&auto=format&fit=crop",
      used_ingredients: [
        "4 ovos",
        "2 colheres (sopa) de manteiga gelada",
        "1 colher (sopa) de creme de leite ou requeijão",
        "Sal e pimenta do reino",
        "Cebolinha picada para decorar"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Quebre os **4 ovos** direto em uma panela fria (não ligue o fogo ainda). Adicione **1 colher (sopa) de manteiga**.",
        "Passo 2: Ligue o fogo médio e comece a mexer com uma espátula sem parar. Misture a clara e a gema enquanto a panela esquenta.",
        "Passo 3 (O Segredo): Quando começar a coagular (formar grumos), tire a panela do fogo por 30 segundos, mexendo sempre. Volte ao fogo por 30 segundos. Repita isso para controlar a temperatura e não secar o ovo.",
        "Passo 4: Quando estiver quase no ponto (ainda brilhante e úmido), desligue o fogo. O calor da panela termina de cozinhar.",
        "Passo 5: Misture a **1 colher (sopa) de creme de leite** e a outra colher de manteiga gelada para parar o cozimento e dar brilho. Tempere com sal e pimenta apenas agora no final. Sirva com cebolinha."
      ],
      tags: ["Café da Manhã", "Rápido", "Proteína"]
    },
    {
      title: "Panqueca Americana Fofinha",
      time_minutes: 20,
      difficulty: "Fácil",
      servings: 4,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=1000&auto=format&fit=crop",
      used_ingredients: [
        "1 e 1/4 xícara de farinha de trigo",
        "1 colher (sopa) de açúcar",
        "1 colher (sopa) de fermento em pó",
        "1 pitada de sal",
        "1 ovo batido",
        "1 xícara de leite",
        "2 colheres (sopa) de óleo"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Em uma tigela, misture os secos: **1 1/4 xícara de farinha**, **1 colher (sopa) de açúcar**, o fermento e o sal.",
        "Passo 2: Em outro recipiente, misture o **1 ovo batido**, a **1 xícara de leite** e as **2 colheres (sopa) de óleo**.",
        "Passo 3: Jogue os líquidos nos secos e misture levemente com um garfo. Atenção: A massa DEVE ficar meio empelotada. Se mexer demais, a panqueca fica dura.",
        "Passo 4: Aqueça uma frigideira antiaderente em fogo médio e unte com um pingo de óleo.",
        "Passo 5: Coloque uma concha de massa. Quando começar a fazer furinhos (bolhas) na parte de cima, vire e deixe dourar o outro lado por mais 1 minuto.",
        "Passo 6: Sirva com mel, geleia ou manteiga."
      ],
      tags: ["Café da Manhã", "Doce", "Internacional"]
    },
    {
      title: "Cuscuz Nordestino Fofinho",
      time_minutes: 20,
      difficulty: "Fácil",
      servings: 2,
      rating: 5,
      image: "https://www.sabornamesa.com.br/media/k2/items/cache/4d8a0c2c36660633008477531778939b_XL.jpg",
      used_ingredients: [
        "2 xícaras de flocão de milho",
        "1 xícara de água (aproximadamente)",
        "1 colher (chá) de sal",
        "Manteiga ou queijo coalho para servir"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1 (Hidratação - O Segredo): Em uma tigela, misture as **2 xícaras de flocão** com o sal. Adicione a **1 xícara de água** aos poucos, mexendo com a mão. A textura deve parecer areia molhada (quando aperta, forma um bolinho, mas se tocar, desmancha). Deixe descansar por **10 minutos** para o milho absorver a água.",
        "Passo 2: Encha o fundo da cuscuzeira com água (até a marca indicada, cuidado para não encostar na grelha).",
        "Passo 3: Coloque a massa de milho hidratada na cuscuzeira SEM APERTAR. Deixe ela soltinha para o vapor passar. Tampe.",
        "Passo 4: Leve ao fogo médio. Quando começar a cheirar milho cozido e sair vapor pela tampa (cerca de **10 a 15 minutos**), está pronto.",
        "Passo 5: Sirva quente com manteiga por cima ou fatias de queijo coalho assado."
      ],
      tags: ["Café da Manhã", "Tradicional", "Vegano"]
    }
  ],
  'Almoço de Domingo': [
    {
      title: "Feijoada Completa Simplificada",
      time_minutes: 90,
      difficulty: "Médio",
      servings: 8,
      rating: 5,
      image: "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?q=80&w=1000&auto=format&fit=crop",
      used_ingredients: [
        "1kg de feijão preto (de molho)",
        "500g de carne seca dessalgada em cubos",
        "2 paios em rodelas",
        "2 linguiças calabresas em rodelas",
        "300g de costelinha de porco (opcional)",
        "2 folhas de louro",
        "1 cebola e 4 dentes de alho picados",
        "1 laranja inteira (lavada, com casca)"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Coloque o **1kg de feijão preto** de molho na véspera. Escorra a água antes de usar.",
        "Passo 2: Em uma panela de pressão grande, coloque o feijão, a **500g de carne seca**, a **300g de costelinha** e as **2 folhas de louro**. Cubra com bastante água (uns 4 dedos acima).",
        "Passo 3: Coloque a **1 laranja inteira** (sim, inteira e com casca) dentro da panela. Ela ajuda a absorver a gordura e dá sabor. Cozinhe por 35 minutos após pegar pressão.",
        "Passo 4: Abra a panela, retire a laranja e jogue fora. Adicione as **linguiças (paio e calabresa)** e deixe cozinhar agora sem pressão por 20 minutos para o caldo engrossar.",
        "Passo 5: Em uma frigideira à parte, frite o alho e a cebola em um pouco de óleo. Pegue uma concha do feijão cozido, amasse nessa frigideira para fazer um purê e jogue tudo de volta no caldeirão. Isso engrossa o caldo e tempera.",
        "Passo 6: Acerte o sal se precisar e sirva com arroz branco, couve e farofa."
      ],
      tags: ["Almoço", "Tradicional", "Brasileira"]
    },
    {
      title: "Lasanha à Bolonhesa Clássica",
      time_minutes: 60,
      difficulty: "Médio",
      servings: 6,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1574868291534-18401d726a7e?q=80&w=1000&auto=format&fit=crop",
      used_ingredients: [
        "500g de massa para lasanha (direto ao forno)",
        "500g de carne moída",
        "1 cebola e 2 alhos picados",
        "2 sachês de molho de tomate",
        "400g de presunto fatiado",
        "400g de mussarela fatiada",
        "Queijo parmesão para gratinar"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1 (Molho): Refogue a cebola e o alho. Adicione a **500g de carne moída** e frite bem até secar a água. Adicione os **2 sachês de molho** e mais meia xícara de água. Tempere com sal. Deixe o molho mais líquido que o normal, pois a massa vai absorver essa água.",
        "Passo 2 (Montagem): Em um refratário grande, comece com uma camada de molho no fundo para não grudar.",
        "Passo 3: Coloque uma camada de massa (não sobreponha muito as folhas), uma camada de presunto, uma de queijo e bastante molho por cima. Repita até acabar, terminando com molho e uma camada generosa de mussarela.",
        "Passo 4: Polvilhe o **queijo parmesão** por cima de tudo.",
        "Passo 5: Cubra com papel alumínio e leve ao forno (200°C) por 30 minutos. Retire o papel e deixe mais 10 minutos para o queijo dourar e borbulhar.",
        "Passo 6: Espere 5 minutos antes de cortar para ela firmar e não desmontar no prato."
      ],
      tags: ["Almoço", "Massa", "Domingo"]
    },
    {
      title: "Frango Assado com Batatas (Estilo Padaria)",
      time_minutes: 90,
      difficulty: "Fácil",
      servings: 5,
      rating: 4.8,
      image: "https://claudia.abril.com.br/wp-content/uploads/2020/02/receita-frango-assado-batatas-1.jpg",
      used_ingredients: [
        "1 frango inteiro (ou 4 coxas com sobrecoxa)",
        "1kg de batatas cortadas em cubos grandes",
        "4 colheres (sopa) de maionese (o segredo)",
        "1 pacote de creme de cebola (sopa em pó)",
        "Suco de 1 limão",
        "Orégano a gosto"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Tempere o frango com o **suco de limão**. Em uma tigela, misture a **maionese** com metade do pacote de **creme de cebola**.",
        "Passo 2: Lambuze o frango com essa pasta de maionese (pode passar por baixo da pele também). A maionese deixa a carne úmida e a pele dourada.",
        "Passo 3: Em uma assadeira grande, coloque as **batatas** cortadas. Polvilhe o restante do creme de cebola sobre elas e regue com um fio de azeite.",
        "Passo 4: Coloque o frango no centro da assadeira, rodeado pelas batatas.",
        "Passo 5: Cubra com papel alumínio e asse por **40 minutos** a 200°C.",
        "Passo 6: Retire o papel e asse por mais **30 a 40 minutos** até o frango ficar bem dourado e as batatas macias."
      ],
      tags: ["Almoço", "Frango", "Econômica"]
    },
    {
      title: "Escondidinho de Carne Seca",
      time_minutes: 60,
      difficulty: "Médio",
      servings: 6,
      rating: 4.9,
      image: "https://www.sabornamesa.com.br/media/k2/items/cache/b1f9b0e3e7f0c1c8a0a8e0e7a8e0e0a5_XL.jpg",
      used_ingredients: [
        "1kg de mandioca (aipim) descascada",
        "500g de carne seca dessalgada, cozida e desfiada",
        "1 caixinha de creme de leite",
        "2 colheres (sopa) de manteiga",
        "1 cebola picada",
        "Queijo coalho ou mussarela para gratinar"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1 (Purê): Cozinhe a **1kg de mandioca** até desmanchar. Retire os fiapos do meio. Amasse bem com um garfo ou espremedor enquanto quente.",
        "Passo 2: Em uma panela, derreta a **manteiga**, jogue a mandioca amassada e o **creme de leite**. Mexa até virar um purê cremoso. Acerte o sal.",
        "Passo 3 (Recheio): Refogue a **cebola** em um pouco de azeite. Adicione a **carne seca desfiada** e frite um pouco. Se quiser, ponha cheiro-verde.",
        "Passo 4: Em um refratário, coloque metade do purê, depois a carne seca, e cubra com o restante do purê.",
        "Passo 5: Cubra com o **queijo** e leve ao forno alto para gratinar (uns 20 minutos) até o queijo dourar."
      ],
      tags: ["Almoço", "Brasileira", "Mandioca"]
    }
  ],
  'Jantar Romântico': [
    {
      title: "Risoto de Camarão com Limão Siciliano",
      time_minutes: 40,
      difficulty: "Médio",
      servings: 2,
      rating: 5,
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1000&auto=format&fit=crop",
      used_ingredients: [
        "1 xícara de arroz arbóreo (próprio para risoto)",
        "400g de camarão limpo",
        "1/2 cebola picada bem pequena",
        "1/2 xícara de vinho branco seco",
        "1 litro de caldo de legumes (quente)",
        "1 colher (sopa) de manteiga gelada",
        "Suco e raspas de 1 limão siciliano",
        "Queijo parmesão ralado a gosto"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Tempere os camarões com sal e pimenta. Em uma panela, doure-os rapidamente no azeite (2 min). Retire os camarões da panela e reserve (para não ficarem borrachudos).",
        "Passo 2: Na mesma panela (suja de camarão), refogue a cebola na manteiga até ficar transparente. Adicione a **1 xícara de arroz arbóreo** e refogue por 1 minuto.",
        "Passo 3: Jogue a **1/2 xícara de vinho branco** e mexa até evaporar o álcool (o cheiro muda).",
        "Passo 4: Vá adicionando o **caldo de legumes quente**, uma concha de cada vez, mexendo SEM PARAR. Quando secar, coloque mais uma. Repita isso por uns 18-20 minutos até o arroz ficar 'al dente'.",
        "Passo 5: Quando o arroz estiver no ponto, desligue o fogo. Misture os camarões reservados, o **suco do limão**, as raspas, o **queijo parmesão** e a **1 colher de manteiga gelada**.",
        "Passo 6: Mexa vigorosamente (isso chama 'mantecatura') para ficar super cremoso. Sirva imediatamente."
      ],
      tags: ["Jantar", "Sofisticado", "Frutos do Mar"]
    },
    {
      title: "Filé Mignon ao Molho Madeira",
      time_minutes: 30,
      difficulty: "Médio",
      servings: 2,
      rating: 4.9,
      image: "https://www.sabornamesa.com.br/media/k2/items/cache/f1b7b0e1e8e0e1e9a9a9a9a9a9a9a9a9_XL.jpg",
      used_ingredients: [
        "400g de filé mignon em medalhões (altos)",
        "1/2 xícara de vinho tinto seco (ou madeira)",
        "1 colher (sopa) de manteiga",
        "1/2 cebola picada bem miúda",
        "1 colher (chá) de amido de milho (maizena)",
        "1/2 xícara de caldo de carne",
        "Sal e pimenta do reino"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Tempere os **medalhões** com sal e pimenta. Aqueça bem uma frigideira com um fio de azeite e manteiga.",
        "Passo 2: Sele a carne (deixe fritar sem mexer) por 3 minutos de cada lado para ficar dourada por fora e rosada por dentro. Retire a carne e reserve em um prato (cubra para não esfriar).",
        "Passo 3: Na mesma frigideira (sem lavar), refogue a **cebola** na gordura da carne.",
        "Passo 4: Adicione o **vinho** e raspe o fundo da panela para soltar o sabor. Deixe ferver por 2 minutos.",
        "Passo 5: Dissolva a **maizena** no **caldo de carne** frio e jogue na frigideira. Mexa até engrossar e ficar brilhante.",
        "Passo 6: Volte a carne (e o suco que ela soltou no prato) para a frigideira apenas para aquecer no molho. Sirva com purê de batatas ou arroz branco."
      ],
      tags: ["Jantar", "Carne", "Clássico"]
    },
    {
      title: "Fondue de Queijo Caseiro (Sem panela especial)",
      time_minutes: 30,
      difficulty: "Fácil",
      servings: 2,
      rating: 4.8,
      image: "https://receitinhas.com.br/wp-content/uploads/2017/06/Fondue-de-queijo-1.jpg",
      used_ingredients: [
        "200g de queijo mussarela ralado",
        "200g de queijo prato ou gouda ralado",
        "1 caixinha de creme de leite",
        "1 dente de alho",
        "1 colher (sopa) de requeijão",
        "Noz moscada e pimenta do reino",
        "Pão italiano em cubos para servir"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Esfregue o **1 dente de alho** descascado no fundo e nas laterais da panela onde vai fazer o fondue. Isso dá um aroma sutil.",
        "Passo 2: Coloque a **1 caixinha de creme de leite** e a **1 colher (sopa) de requeijão** na panela e aqueça em fogo baixo até quase ferver.",
        "Passo 3: Vá adicionando os **400g de queijos ralados** aos poucos, mexendo sempre com um fouet ou colher de pau, esperando derreter antes de por mais.",
        "Passo 4: Quando estiver um creme liso, tempere com uma pitada de **noz moscada** e pimenta do reino. Se ficar muito duro, ponha um pouquinho de leite.",
        "Passo 5: Sirva imediatamente dentro de um Pão Italiano redondo (retire o miolo) ou em uma tigela aquecida, acompanhado de cubos de pão, batatinhas cozidas ou goiabada."
      ],
      tags: ["Jantar", "Inverno", "Romântico"]
    }
  ],
  'Lanche Rápido': [
    {
      title: "Sanduíche Natural de Frango Cremoso",
      time_minutes: 15,
      difficulty: "Muito Fácil",
      servings: 4,
      rating: 4.7,
      image: "https://www.sabornamesa.com.br/media/k2/items/cache/b9ad772005653a66717a61d18721477d_XL.jpg",
      used_ingredients: [
        "2 xícaras de frango cozido e desfiado",
        "1 cenoura ralada fina",
        "1/2 lata de milho",
        "4 colheres (sopa) de maionese",
        "2 colheres (sopa) de creme de leite ou iogurte",
        "Salsinha e cebolinha picadas",
        "Pão de forma"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Em uma tigela, misture o **frango desfiado**, a **cenoura ralada** e o **milho**.",
        "Passo 2: Adicione a **maionese** e o **creme de leite** (ou iogurte para ficar mais leve). Misture até formar um patê bem úmido.",
        "Passo 3: Tempere com sal, pimenta e as **ervas picadas**.",
        "Passo 4: Pegue duas fatias de pão de forma, coloque uma camada generosa do recheio. Se quiser, adicione folhas de alface lavadas e rodelas de tomate para dar frescor.",
        "Passo 5: Corte o sanduíche na diagonal (formato triangular) e sirva frio."
      ],
      tags: ["Lanche", "Frio", "Prático"]
    },
    {
      title: "Misto Quente de Forno",
      time_minutes: 25,
      difficulty: "Fácil",
      servings: 6,
      rating: 4.8,
      image: "https://receitatodahora.com.br/wp-content/uploads/2019/07/misto-quente-de-forno.jpg",
      used_ingredients: [
        "1 pacote de pão de forma",
        "200g de presunto fatiado",
        "200g de mussarela fatiada",
        "1 caixa de creme de leite",
        "1/2 xícara de molho de tomate",
        "Orégano a gosto"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Unte um refratário com manteiga. Forre o fundo com fatias de **pão de forma** (pode tirar a casca se preferir).",
        "Passo 2: Espalhe um pouco de **molho de tomate** sobre os pães para umedecer.",
        "Passo 3: Faça uma camada de **presunto** e uma de **mussarela**. Repita: mais uma camada de pão, molho, presunto e mussarela.",
        "Passo 4: Por cima da última camada de queijo, espalhe a **1 caixa de creme de leite** com uma colher. Isso vai gratinar e ficar dourado.",
        "Passo 5: Polvilhe **orégano** e leve ao forno (200°C) por **15 a 20 minutos** até o queijo derreter e dourar."
      ],
      tags: ["Lanche", "Forno", "Família"]
    },
    {
      title: "Torta de Liquidificador (Salgada)",
      time_minutes: 45,
      difficulty: "Fácil",
      servings: 8,
      rating: 4.8,
      image: "https://www.receiteria.com.br/wp-content/uploads/torta-de-liquidificador-facil-01.jpg",
      used_ingredients: [
        "3 ovos",
        "2 xícaras de leite",
        "1 xícara de óleo",
        "2 xícaras de farinha de trigo",
        "1 colher (sopa) de fermento em pó",
        "Recheio: Sardinha, frango, legumes ou frios",
        "50g de queijo ralado"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: No liquidificador, bata os **3 ovos**, as **2 xícaras de leite** e a **1 xícara de óleo**.",
        "Passo 2: Adicione as **2 xícaras de farinha**, o queijo ralado e o sal. Bata até ficar liso. Adicione o **fermento** e bata rapidinho.",
        "Passo 3: Unte uma assadeira com óleo e farinha. Despeje metade da massa.",
        "Passo 4: Espalhe o recheio de sua escolha (ex: **1 lata de sardinha** amassada com tomate, milho e ervilha). O recheio não pode ter muito molho líquido.",
        "Passo 5: Cubra com o restante da massa. Polvilhe orégano.",
        "Passo 6: Asse em forno pré-aquecido a 180°C por cerca de **35 a 40 minutos** até dourar."
      ],
      tags: ["Lanche", "Econômica", "Bolo Salgado"]
    },
    {
      title: "Dadinho de Tapioca",
      time_minutes: 180,
      difficulty: "Fácil",
      servings: 6,
      rating: 4.9,
      image: "https://static.itdg.com.br/images/1200-675/0283f36746973e27129f1224d06900f8/322971-original.jpg",
      used_ingredients: [
        "250g de tapioca granulada (não é a goma de frigideira!)",
        "250g de queijo coalho ralado",
        "500ml de leite quente",
        "Sal e pimenta branca a gosto",
        "Óleo para fritar (ou pode assar)"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Em uma tigela, misture a **250g de tapioca granulada**, o **250g de queijo coalho** ralado, o sal e a pimenta.",
        "Passo 2: Adicione os **500ml de leite bem quente** (quase fervendo) e misture vigorosamente. A massa vai começar a hidratar e virar um grude só.",
        "Passo 3: Forre uma assadeira pequena com plástico filme. Despeje a massa e alise bem para ficar reta. Cubra com plástico (encostando na massa).",
        "Passo 4: Leve à geladeira por **3 horas** até ficar bem dura.",
        "Passo 5: Desenforme em uma tábua e corte em cubos de 2cm.",
        "Passo 6: Frite em óleo quente até dourar ou asse no forno (200°C) virando na metade do tempo até ficar crocante. Sirva com geleia de pimenta."
      ],
      tags: ["Lanche", "Petisco", "Sem Glúten"]
    }
  ],
  
  // --- ESTILOS & DIETAS ---
  'Fitness / Saudável': [
    {
      title: "Crepioca Recheada Fit",
      time_minutes: 10,
      difficulty: "Muito Fácil",
      servings: 1,
      rating: 4.8,
      image: "https://blog.tudogostoso.com.br/wp-content/uploads/2018/12/crepioca.jpg",
      used_ingredients: [
        "1 ovo",
        "2 colheres (sopa) de goma de tapioca",
        "1 colher (sopa) de requeijão light ou cottage",
        "Sal e orégano a gosto",
        "Recheio a gosto (frango, queijo branco, tomate)"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Em uma tigela pequena, bata bem o **1 ovo** com um garfo.",
        "Passo 2: Adicione as **2 colheres de tapioca** e o **requeijão**. Misture até ficar homogêneo. Tempere com uma pitada de sal e orégano.",
        "Passo 3: Aqueça uma frigideira antiaderente pequena em fogo baixo. Despeje a massa.",
        "Passo 4: Deixe cozinhar como uma panqueca. Quando a borda soltar e a parte de cima secar, vire e doure o outro lado.",
        "Passo 5: Coloque o recheio de sua preferência (ex: queijo branco e tomate) em metade da crepioca, dobre ao meio e sirva."
      ],
      tags: ["Fitness", "Sem Glúten", "Rápido"]
    },
    {
      title: "Peixe Assado com Legumes na Manteiga",
      time_minutes: 40,
      difficulty: "Fácil",
      servings: 2,
      rating: 4.9,
      image: "https://img.cybercook.com.br/receitas/560/peixe-assado-com-batatas-e-brocolis.jpeg",
      used_ingredients: [
        "2 filés de tilápia (ou pescada)",
        "1 abobrinha em rodelas",
        "1 cenoura em palitos finos",
        "1/2 brócolis em buquês",
        "2 colheres (sopa) de manteiga ou azeite",
        "Suco de limão",
        "Sal, pimenta e ervas"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Tempere os **2 filés de peixe** com **suco de limão**, sal e pimenta. Deixe descansar por 5 minutos.",
        "Passo 2: Em uma assadeira, faça uma 'cama' com a **abobrinha**, a **cenoura** e o **brócolis**. Tempere os legumes com sal e um fio de azeite.",
        "Passo 3: Coloque os filés de peixe por cima dos legumes. Distribua pedacinhos da **manteiga** sobre o peixe e os legumes.",
        "Passo 4: Cubra com papel alumínio e leve ao forno (200°C) por **20 minutos**.",
        "Passo 5: Retire o papel e deixe mais **10 minutos** para secar a água que soltou e dourar levemente. É uma refeição completa e leve."
      ],
      tags: ["Saudável", "Low Carb", "Jantar"]
    },
    {
      title: "Macarrão de Abobrinha (Zoodles)",
      time_minutes: 15,
      difficulty: "Fácil",
      servings: 2,
      rating: 4.7,
      image: "https://www.receiteria.com.br/wp-content/uploads/macarrao-de-abobrinha-09.jpg",
      used_ingredients: [
        "2 abobrinhas italianas médias",
        "1 dente de alho picado",
        "1 colher (sopa) de azeite",
        "Molho de tomate caseiro (ou bolonhesa)",
        "Queijo parmesão ralado"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Lave bem as abobrinhas e corte as pontas. Use um fatiador de legumes (espiraizadora) ou um descascador julienne para fazer tiras finas parecendo espaguete. Se não tiver, corte fatias finas com a faca e depois em tirinhas.",
        "Passo 2: Em uma frigideira, aqueça o **azeite** e doure levemente o **alho**.",
        "Passo 3: Jogue o 'macarrão' de abobrinha. Refogue rápido (apenas **2 a 3 minutos**). Se cozinhar muito, vira água. Ela tem que ficar 'al dente'.",
        "Passo 4: Tempere com sal apenas no final (o sal faz soltar água).",
        "Passo 5: Sirva imediatamente com o molho de sua preferência por cima."
      ],
      tags: ["Low Carb", "Vegano", "Jantar"]
    }
  ],
  'Comfort Food': [
    {
      title: "Strogonoff de Carne Brasileiro",
      time_minutes: 30,
      difficulty: "Fácil",
      servings: 4,
      rating: 5,
      image: "https://p2.trrsf.com/image/fget/cf/1200/900/middle/images.terra.com/2023/10/05/1754020464-strogonoff-de-carne-simples.jpg",
      used_ingredients: [
        "500g de alcatra ou filé mignon em tirinhas",
        "1 cebola picada",
        "2 colheres (sopa) de ketchup",
        "1 colher (sopa) de mostarda",
        "100g de champignon fatiado (opcional)",
        "2 caixas de creme de leite",
        "Sal e pimenta do reino"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Tempere a **500g de carne** apenas com sal e pimenta.",
        "Passo 2: Aqueça bem uma frigideira com óleo. Frite a carne aos poucos (não coloque tudo de uma vez para não juntar água). A carne tem que ficar douradinha. Reserve.",
        "Passo 3: Na mesma panela, refogue a **1 cebola picada** raspando o 'queimadinho' do fundo da carne (isso dá sabor).",
        "Passo 4: Volte a carne para a panela. Adicione as **2 colheres de ketchup**, a **1 colher de mostarda** e o **champignon**. Misture bem.",
        "Passo 5: Abaixe o fogo para o mínimo. Adicione as **2 caixas de creme de leite** e misture. IMPORTANTE: Não deixe ferver depois que colocar o creme de leite, senão talha. Só aqueça bem.",
        "Passo 6: Sirva com arroz branco e batata palha (combinação obrigatória!)."
      ],
      tags: ["Conforto", "Carne", "Clássico"]
    },
    {
      title: "Brigadeiro de Panela (Colher)",
      time_minutes: 15,
      difficulty: "Muito Fácil",
      servings: 4,
      rating: 5,
      image: "https://www.estadao.com.br/resizer/v2/W3Q2Z562NVI5RDRG3Q6Z33333E.jpg?auth=a8607a518063065672f059c122170364f5175902099351786591022137563149&width=720&height=503&smart=true",
      used_ingredients: [
        "1 lata de leite condensado",
        "1 colher (sopa) de manteiga",
        "3 colheres (sopa) de chocolate em pó ou cacau",
        "1 caixinha de creme de leite (o segredo da cremosidade)"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Em uma panela fora do fogo, misture a **1 lata de leite condensado** e as **3 colheres de chocolate em pó** até dissolver todas as bolinhas.",
        "Passo 2: Adicione a **1 colher de manteiga** e leve ao fogo baixo, mexendo sem parar.",
        "Passo 3: Quando começar a desgrudar do fundo da panela (ponto de enrolar), adicione a **1 caixinha de creme de leite**. Misture bem.",
        "Passo 4: Continue mexendo até borbulhar e engrossar novamente (ponto de colher).",
        "Passo 5: Despeje em um prato fundo e coma morno ou frio. O creme de leite deixa ele menos doce e super cremoso."
      ],
      tags: ["Doce", "Conforto", "Rápido"]
    },
    {
      title: "Polenta Mole com Ragu de Carne",
      time_minutes: 45,
      difficulty: "Fácil",
      servings: 4,
      rating: 4.8,
      image: "https://www.sabornamesa.com.br/media/k2/items/cache/4089c922a9699f8d5500858102d416b2_XL.jpg",
      used_ingredients: [
        "1 xícara de fubá pré-cozido",
        "4 xícaras de água (ou caldo de carne)",
        "300g de carne moída",
        "1 sachê de molho de tomate",
        "1 colher (sopa) de manteiga",
        "Queijo parmesão ralado"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1 (Ragu): Refogue alho e cebola. Frite a **300g de carne moída** até dourar bem. Adicione o **molho de tomate**, um pouco de água e deixe apurar até ficar um molho grosso. Reserve.",
        "Passo 2 (Polenta): Em uma panela funda, dissolva a **1 xícara de fubá** nas **4 xícaras de água** fria (para não empelotar). Ligue o fogo.",
        "Passo 3: Mexa sem parar até ferver e engrossar. Abaixe o fogo e cozinhe por uns 5 a 10 minutos (se for fubá pré-cozido).",
        "Passo 4: Quando estiver pronta, desligue o fogo e misture a **1 colher de manteiga** e um punhado de queijo. Isso deixa ela aveludada.",
        "Passo 5: Coloque a polenta no prato, faça um buraco no meio e sirva o ragu de carne por cima."
      ],
      tags: ["Conforto", "Inverno", "Jantar"]
    },
    {
      title: "Bolinho de Chuva da Vovó",
      time_minutes: 20,
      difficulty: "Fácil",
      servings: 4,
      rating: 4.9,
      image: "https://guiadacozinha.com.br/wp-content/uploads/2019/10/bolinho-de-chuva-simples.jpg",
      used_ingredients: [
        "2 ovos",
        "1 xícara de açúcar",
        "1 xícara de leite",
        "2 e 1/2 xícaras de farinha de trigo",
        "1 colher (sopa) de fermento em pó",
        "Óleo para fritar",
        "Açúcar e canela para polvilhar"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Em uma tigela, misture os **2 ovos**, a **1 xícara de açúcar** e a **1 xícara de leite**.",
        "Passo 2: Vá adicionando a **farinha** aos poucos, misturando até ficar uma massa mole (mais grossa que bolo, mas que cai da colher).",
        "Passo 3: Adicione o **fermento** e misture.",
        "Passo 4: Aqueça o óleo em uma panela pequena (não pode estar fervendo demais senão queima por fora e fica cru por dentro). Teste com um pingo de massa: se borbulhar e subir, tá bom.",
        "Passo 5: Com a ajuda de duas colheres, pegue porções de massa e pingue no óleo. Frite até dourar, virando se precisar.",
        "Passo 6: Escorra em papel toalha e passe no açúcar com canela."
      ],
      tags: ["Doce", "Lanche", "Conforto"]
    }
  ],
  'Vegetariano': [
    {
      title: "Moqueca de Banana da Terra",
      time_minutes: 40,
      difficulty: "Médio",
      servings: 4,
      rating: 4.8,
      image: "https://img.cybercook.com.br/receitas/775/moqueca-de-banana-da-terra-1.jpeg",
      used_ingredients: [
        "4 bananas da terra maduras (mas firmes)",
        "1 pimentão vermelho em rodelas",
        "1 pimentão amarelo em rodelas",
        "2 tomates em rodelas",
        "1 cebola em rodelas",
        "200ml de leite de coco",
        "2 colheres (sopa) de azeite de dendê",
        "Coentro a gosto"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Descasque as **4 bananas** e corte em fatias compridas (na diagonal).",
        "Passo 2: Em uma panela de barro ou fundo largo, faça camadas: metade da cebola, metade dos pimentões e tomates. Coloque as fatias de banana por cima.",
        "Passo 3: Cubra com o restante dos vegetais (cebola, pimentão, tomate).",
        "Passo 4: Regue com o **200ml de leite de coco** e o **azeite de dendê**. Tempere com sal e pimenta.",
        "Passo 5: Tampe a panela e leve ao fogo médio por cerca de **20 minutos**. Não mexa para não desmanchar a banana, só balance a panela.",
        "Passo 6: Finalize com bastante **coentro picado** e sirva com arroz branco e farofa."
      ],
      tags: ["Vegetariano", "Brasileira", "Sem Glúten"]
    },
    {
      title: "Escondidinho de Cogumelos",
      time_minutes: 45,
      difficulty: "Médio",
      servings: 4,
      rating: 4.7,
      image: "https://www.receiteria.com.br/wp-content/uploads/escondidinho-de-cogumelos-08.jpg",
      used_ingredients: [
        "500g de batata ou mandioca cozida",
        "2 colheres (sopa) de manteiga",
        "1/2 xícara de leite",
        "400g de mix de cogumelos (shimeji, paris) picados",
        "2 colheres (sopa) de shoyu",
        "1 cebola picada",
        "Queijo parmesão para gratinar"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1 (Purê): Amasse as **500g de batatas** quentes. Misture com a **manteiga** e o **leite** no fogo até virar um purê firme. Tempere com sal. Reserve.",
        "Passo 2 (Recheio): Refogue a cebola em um fio de azeite. Adicione os **400g de cogumelos** e deixe cozinhar em fogo alto até secar a água que eles soltam.",
        "Passo 3: Adicione o **shoyu** e refogue por mais 1 minuto. Acerte o sal se precisar.",
        "Passo 4: Em um refratário, coloque o refogado de cogumelos no fundo. Cubra com o purê, alisando bem.",
        "Passo 5: Polvilhe **queijo parmesão** e leve ao forno alto apenas para gratinar (uns 15 minutos)."
      ],
      tags: ["Vegetariano", "Jantar", "Conforto"]
    },
    {
      title: "Berinjela à Parmegiana (De Forno)",
      time_minutes: 50,
      difficulty: "Médio",
      servings: 4,
      rating: 4.8,
      image: "https://static.itdg.com.br/images/1200-675/0283f36746973e27129f1224d06900f8/322971-original.jpg",
      used_ingredients: [
        "2 berinjelas grandes fatiadas no sentido do comprimento",
        "2 ovos batidos e farinha de rosca para empanar",
        "2 sachês de molho de tomate",
        "300g de mussarela fatiada",
        "Queijo parmesão ralado"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Corte as berinjelas e deixe de molho em água com sal por 15 min para tirar o amargo. Seque bem.",
        "Passo 2: Passe cada fatia no ovo batido e depois na farinha de rosca.",
        "Passo 3: Coloque as fatias em uma assadeira untada com azeite e asse no forno (200°C) por 20 minutos (virando na metade) até dourar. Isso evita fritura e sujeira.",
        "Passo 4: Em um refratário, monte: molho no fundo, camada de berinjela assada, camada de queijo, molho. Repita.",
        "Passo 5: Finalize com molho e bastante queijo. Gratine no forno por mais **15 minutos**."
      ],
      tags: ["Vegetariano", "Almoço", "Forno"]
    }
  ],
  'Econômicas': [
    {
      title: "Macarrão Alho e Óleo Turbinado",
      time_minutes: 15,
      difficulty: "Muito Fácil",
      servings: 2,
      rating: 4.6,
      image: "https://vovopalmirinha.com.br/wp-content/uploads/2016/04/macarrao-alho-oleo.jpg",
      used_ingredients: [
        "250g de espaguete",
        "5 dentes de alho fatiados (lâminas)",
        "1/2 xícara de azeite ou óleo",
        "1 pimenta dedo de moça picada (opcional)",
        "Salsinha picada"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Cozinhe os **250g de macarrão** em água salgada até ficar 'al dente'. Guarde 1 xícara da água do cozimento antes de escorrer.",
        "Passo 2: Enquanto a massa cozinha, coloque o **azeite** e os **5 dentes de alho** fatiados na frigideira fria. Ligue o fogo baixo. Deixe o alho fritar devagarzinho até ficar dourado claro (cuidado para não queimar e amargar!).",
        "Passo 3: Adicione a pimenta picada se gostar.",
        "Passo 4: Jogue o macarrão escorrido na frigideira do alho. Adicione um pouquinho da água do cozimento reservada e mexa bem no fogo alto por 1 minuto. A água + azeite cria um molhinho cremoso.",
        "Passo 5: Desligue, jogue a **salsinha** e sirva."
      ],
      tags: ["Econômica", "Rápido", "Vegano"]
    },
    {
      title: "Arroz de Forno com Sobras",
      time_minutes: 30,
      difficulty: "Fácil",
      servings: 4,
      rating: 4.5,
      image: "https://guiadacozinha.com.br/wp-content/uploads/2019/10/arroz-de-forno-cremoso.jpg",
      used_ingredients: [
        "3 xícaras de arroz cozido (sobras)",
        "1 cenoura ralada",
        "1 lata de milho/ervilha",
        "100g de presunto picado (ou frango desfiado)",
        "100g de mussarela picada",
        "1 caixinha de creme de leite ou requeijão",
        "Queijo ralado para polvilhar"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Em uma tigela grande, misture o **arroz cozido**, a **cenoura**, o **milho**, o **presunto** e a **mussarela**.",
        "Passo 2: Adicione a **1 caixinha de creme de leite** e misture bem. O arroz deve ficar úmido e grudentinho. Tempere com sal e orégano.",
        "Passo 3: Transfira para um refratário untado.",
        "Passo 4: Cubra com **queijo ralado** ou mais fatias de mussarela.",
        "Passo 5: Leve ao forno médio (200°C) por **20 minutos** até o queijo derreter e dourar. Ótima forma de salvar o almoço!"
      ],
      tags: ["Econômica", "Reaproveitamento", "Forno"]
    },
    {
      title: "Carne Moída com Batata (Rende muito)",
      time_minutes: 30,
      difficulty: "Fácil",
      servings: 5,
      rating: 4.7,
      image: "https://receitinhas.com.br/wp-content/uploads/2017/04/Carne-moida-com-batata-1.jpg",
      used_ingredients: [
        "500g de carne moída",
        "3 batatas grandes em cubos",
        "1 cebola e 2 dentes de alho",
        "1 sachê de molho de tomate",
        "Cheiro-verde picado"
      ],
      missing_ingredients: [],
      instructions: [
        "Passo 1: Refogue a cebola e o alho. Junte a **500g de carne moída** e frite até ficar marrom e soltinha.",
        "Passo 2: Adicione as **3 batatas** em cubos e o **molho de tomate**.",
        "Passo 3: Coloque 1 xícara de água, tampe a panela e cozinhe em fogo médio por cerca de **15 minutos**.",
        "Passo 4: Quando a batata estiver macia (espete com garfo), destampe e deixe o molho engrossar um pouco.",
        "Passo 5: Salpique **cheiro-verde** e sirva com arroz e feijão."
      ],
      tags: ["Econômica", "Almoço", "Dia a Dia"]
    }
  ]
};

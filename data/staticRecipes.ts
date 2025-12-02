
import { Recipe } from '../types';

export const seasonalRecipesData: Record<string, Recipe[]> = {
  'Natal': [
    {
      title: "Peru de Natal Clássico",
      time_minutes: 240,
      difficulty: "Difícil",
      servings: 10,
      rating: 5,
      used_ingredients: [
        "1 peru inteiro (aprox. 4kg)",
        "1 garrafa de vinho branco seco",
        "100g de manteiga derretida",
        "1 cebola grande",
        "4 dentes de alho",
        "Ervas finas (alecrim, tomilho)",
        "Sal e pimenta do reino a gosto"
      ],
      missing_ingredients: ["Papel alumínio para cobrir"],
      instructions: [
        "Descongele o peru na geladeira por 48 horas antes do preparo.",
        "Prepare a marinada: bata no liquidificador o vinho, cebola, alho, ervas, sal e pimenta.",
        "Coloque o peru em um saco plástico culinário ou tigela grande com a marinada. Deixe na geladeira por **12 horas**, virando na metade do tempo.",
        "Retire da marinada, seque levemente com papel toalha e pincele a **manteiga derretida** por toda a pele (isso garante o dourado).",
        "Cubra com papel alumínio e asse em forno pré-aquecido a 200°C por cerca de **2 horas**.",
        "Retire o papel alumínio, regue com o caldo da assadeira e asse por mais **1 hora e meia** ou até o termômetro pular/ficar bem dourado."
      ],
      tags: ["Natal", "Clássico", "Ave", "Forno"]
    },
    {
      title: "Salpicão de Frango Tradicional",
      time_minutes: 40,
      difficulty: "Fácil",
      servings: 8,
      rating: 4.9,
      used_ingredients: [
        "1kg de peito de frango cozido e desfiado",
        "2 cenouras raladas",
        "1 lata de milho verde",
        "100g de uva passa (opcional)",
        "1 maçã verde picada",
        "1 pote de maionese (500g)",
        "1 caixinha de creme de leite",
        "Suco de 1 limão"
      ],
      missing_ingredients: ["Batata palha a gosto"],
      instructions: [
        "Em uma tigela grande, misture o frango desfiado, a cenoura ralada, o milho, a maçã e as passas.",
        "Tempere com sal, pimenta e o suco de limão.",
        "Adicione a maionese e o creme de leite. Misture bem até ficar bem cremoso.",
        "Leve à geladeira por pelo menos **1 hora** antes de servir.",
        "Na hora de servir, cubra com **bastante batata palha** para manter a crocância."
      ],
      tags: ["Natal", "Frio", "Acompanhamento"]
    },
    {
      title: "Farofa Natalina Rica",
      time_minutes: 30,
      difficulty: "Fácil",
      servings: 8,
      rating: 4.8,
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
        "Em uma panela grande, derreta a manteiga e frite o bacon e a calabresa até dourarem.",
        "Adicione a cebola e refogue até ficar transparente.",
        "Acrescente a farinha de mandioca aos poucos, mexendo sempre para não queimar.",
        "Deixe a farinha torrar levemente na gordura das carnes por **5 minutos**.",
        "Desligue o fogo e misture os ovos cozidos, as azeitonas e a salsinha fresca.",
        "Acerte o sal se necessário."
      ],
      tags: ["Natal", "Acompanhamento", "Brasileira"]
    },
    {
      title: "Rabanada de Forno (Mais Leve)",
      time_minutes: 40,
      difficulty: "Fácil",
      servings: 10,
      rating: 4.7,
      used_ingredients: [
        "4 pães franceses amanhecidos",
        "2 xícaras de leite",
        "1 lata de leite condensado",
        "3 ovos batidos",
        "Açúcar e canela para polvilhar",
        "Manteiga para untar"
      ],
      missing_ingredients: [],
      instructions: [
        "Corte os pães em fatias grossas (aprox 2cm).",
        "Em uma tigela, misture o leite e o leite condensado. Em outra, bata os ovos.",
        "Passe as fatias de pão na mistura de leite (rapidamente para não desmanchar) e depois nos ovos.",
        "Coloque em uma assadeira untada com bastante manteiga.",
        "Leve ao forno médio (180°C) por **20 minutos**, vire as fatias e asse por mais **10 minutos** até dourar.",
        "Passe na mistura de açúcar com canela ainda quentes."
      ],
      tags: ["Natal", "Sobremesa", "Econômica"]
    }
  ],
  'Festa Junina': [
    {
      title: "Bolo de Fubá Cremoso",
      time_minutes: 55,
      difficulty: "Fácil",
      servings: 12,
      rating: 5,
      used_ingredients: [
        "4 xícaras de leite",
        "4 ovos",
        "3 xícaras de açúcar",
        "2 xícaras de fubá",
        "2 colheres (sopa) de manteiga",
        "100g de queijo parmesão ralado",
        "1 colher (sopa) de fermento"
      ],
      missing_ingredients: [],
      instructions: [
        "Bata tudo no liquidificador, exceto o fermento, até ficar homogêneo.",
        "Adicione o fermento e misture delicadamente (a massa fica bem líquida mesmo).",
        "Despeje em uma forma untada e enfarinhada com fubá.",
        "Leve ao forno médio (180°C) por cerca de **40 a 50 minutos**.",
        "O bolo fica com uma camada cremosa no meio parecida com pudim. Espere esfriar para cortar."
      ],
      tags: ["Festa Junina", "Bolo", "Lanche"]
    },
    {
      title: "Canjica Branca Tradicional",
      time_minutes: 60,
      difficulty: "Médio",
      servings: 10,
      rating: 4.9,
      used_ingredients: [
        "500g de canjica branca",
        "1 lata de leite condensado",
        "1 litro de leite",
        "5 cravos da índia",
        "1 pau de canela",
        "200ml de leite de coco",
        "Canela em pó para polvilhar"
      ],
      missing_ingredients: ["Amendoim torrado moído (opcional)"],
      instructions: [
        "Deixe a canjica de molho em água por 12 horas.",
        "Escorra e cozinhe na panela de pressão com água nova por **30 minutos**.",
        "Após cozida, adicione o leite, leite condensado, leite de coco, cravos e canela em pau.",
        "Deixe ferver em fogo baixo, mexendo de vez em quando, até o caldo engrossar bem (aprox. **20 min**).",
        "Sirva quente polvilhada com canela em pó ou amendoim."
      ],
      tags: ["Festa Junina", "Sobremesa", "Quente"]
    },
    {
      title: "Caldo Verde com Calabresa",
      time_minutes: 40,
      difficulty: "Fácil",
      servings: 6,
      rating: 4.8,
      used_ingredients: [
        "1kg de batata descascada",
        "2 linguiças calabresas em rodelas",
        "1 maço de couve manteiga fatiada fina",
        "1 cebola picada",
        "2 dentes de alho",
        "Azeite e sal"
      ],
      missing_ingredients: [],
      instructions: [
        "Cozinhe as batatas até desmancharem. Bata no liquidificador com a própria água do cozimento.",
        "Em uma panela grande, frite a calabresa no azeite. Reserve algumas rodelas para decorar.",
        "Na mesma gordura, refogue a cebola e o alho.",
        "Adicione o creme de batata e deixe ferver. Acerte o sal.",
        "Desligue o fogo e adicione a couve fatiada (ela cozinha no calor residual para ficar verdinha).",
        "Sirva com fio de azeite."
      ],
      tags: ["Festa Junina", "Sopa", "Inverno"]
    },
    {
      title: "Pamonha de Forno (Preguiçosa)",
      time_minutes: 60,
      difficulty: "Fácil",
      servings: 8,
      rating: 4.6,
      used_ingredients: [
        "2 latas de milho verde (sem água)",
        "1 garrafa de leite de coco (200ml)",
        "2 xícaras de açúcar",
        "4 ovos",
        "1/2 xícara de queijo parmesão",
        "1 colher (sopa) de fermento"
      ],
      missing_ingredients: [],
      instructions: [
        "Bata no liquidificador o milho, o leite de coco, os ovos e o açúcar por **3 minutos**.",
        "Adicione o queijo e o fermento e bata rapidamente apenas para misturar.",
        "Despeje em uma forma untada e enfarinhada.",
        "Asse em forno pré-aquecido a 180°C por **45 a 50 minutos** até dourar bem.",
        "Corte em quadrados e sirva morno."
      ],
      tags: ["Festa Junina", "Milho", "Lanche"]
    }
  ],
  'Páscoa': [
    {
      title: "Bacalhau à Gomes de Sá",
      time_minutes: 60,
      difficulty: "Médio",
      servings: 6,
      rating: 5,
      used_ingredients: [
        "500g de bacalhau dessalgado em lascas",
        "500g de batatas cozidas em rodelas",
        "3 ovos cozidos em rodelas",
        "2 cebolas em rodelas",
        "1/2 xícara de azeite extra virgem",
        "Azeitonas pretas",
        "Salsinha picada"
      ],
      missing_ingredients: [],
      instructions: [
        "Afervente as lascas de bacalhau por 10 minutos. Escorra.",
        "Em uma frigideira funda, refogue a cebola no azeite até murchar bem.",
        "Adicione o bacalhau e as batatas cozidas à cebola e misture delicadamente.",
        "Transfira para um refratário.",
        "Leve ao forno por **15 minutos** apenas para aquecer bem.",
        "Decore com os ovos cozidos, azeitonas pretas e muita salsinha. Regue com mais azeite."
      ],
      tags: ["Páscoa", "Peixe", "Clássico"]
    },
    {
      title: "Ovo de Páscoa de Travessa",
      time_minutes: 40,
      difficulty: "Fácil",
      servings: 10,
      rating: 4.9,
      used_ingredients: [
        "2 latas de leite condensado",
        "2 caixas de creme de leite",
        "4 colheres (sopa) de chocolate em pó",
        "1 colher (sopa) de manteiga",
        "200g de chocolate meio amargo picado",
        "Granulado ou raspas de chocolate"
      ],
      missing_ingredients: ["Bombons picados ou uvas (opcional)"],
      instructions: [
        "Faça um brigadeiro mole: leve ao fogo 1 leite condensado, 1 creme de leite, o chocolate em pó e a manteiga. Mexa até desgrudar levemente do fundo.",
        "Faça um creme branco: leve ao fogo 1 leite condensado, 1 creme de leite e mexa até engrossar.",
        "Derreta o chocolate meio amargo e misture com o creme branco (ganache).",
        "Na travessa, monte camadas: brigadeiro escuro, bombons ou uvas (se usar), e finalize com a ganache de chocolate.",
        "Decore com raspas de chocolate e leve à geladeira."
      ],
      tags: ["Páscoa", "Sobremesa", "Chocolate"]
    },
    {
      title: "Colomba Pascal Fácil",
      time_minutes: 90,
      difficulty: "Médio",
      servings: 8,
      rating: 4.5,
      used_ingredients: [
        "500g de farinha de trigo",
        "10g de fermento biológico seco",
        "100g de manteiga",
        "3 gemas",
        "1/2 xícara de açúcar",
        "1 xícara de água morna",
        "Essência de laranja ou baunilha",
        "Gotas de chocolate ou frutas cristalizadas"
      ],
      missing_ingredients: ["Cobertura de açúcar (opcional)"],
      instructions: [
        "Misture o fermento com um pouco de farinha e água morna. Deixe espumar por 15 min.",
        "Na batedeira (gancho) ou tigela, misture o restante da farinha, açúcar, manteiga, gemas e a essência.",
        "Adicione a mistura de fermento e sove bem até ficar elástica.",
        "Incorpore as gotas de chocolate ou frutas.",
        "Deixe descansar coberto por **1 hora** (até dobrar).",
        "Coloque em forma de papel própria para colomba ou assadeira.",
        "Asse a 180°C por **35 a 40 minutos**."
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
      used_ingredients: [
        "1.5kg de lombo de porco inteiro",
        "1 abacaxi em rodelas",
        "1 xícara de vinho branco",
        "4 colheres (sopa) de açúcar mascavo (ou mel)",
        "3 dentes de alho amassados",
        "Suco de 1 limão",
        "Sal e alecrim"
      ],
      missing_ingredients: [],
      instructions: [
        "Tempere o lombo com alho, limão, vinho, sal e alecrim. Deixe marinar por 4 horas.",
        "Faça cortes profundos no lombo (fatias que não vão até o fim) e insira meias rodelas de abacaxi nos cortes.",
        "Coloque em uma assadeira com a marinada. Cubra com papel alumínio.",
        "Asse a 200°C por **1 hora e 15 minutos**.",
        "Retire o papel, pincele o açúcar mascavo ou mel por cima.",
        "Volte ao forno alto para dourar/caramelizar por mais **20 minutos**.",
        "Sirva decorado com o restante do abacaxi."
      ],
      tags: ["Ano Novo", "Carne", "Agridoce"]
    },
    {
      title: "Arroz com Lentilha da Sorte",
      time_minutes: 30,
      difficulty: "Fácil",
      servings: 6,
      rating: 4.7,
      used_ingredients: [
        "1 xícara de lentilha crua",
        "1 xícara de arroz branco",
        "2 cebolas grandes cortadas em rodelas",
        "3 colheres (sopa) de azeite",
        "Sal a gosto",
        "Água fervente"
      ],
      missing_ingredients: [],
      instructions: [
        "Cozinhe a lentilha em água por 10 minutos (ela deve ficar al dente, não desmanchando). Escorra.",
        "Em uma panela, refogue o arroz no azeite com sal.",
        "Adicione a lentilha pré-cozida ao arroz e cubra com água fervente (aprox. 4 xícaras). Cozinhe até secar.",
        "Enquanto isso, em uma frigideira, frite as cebolas no azeite em fogo baixo até ficarem bem escuras e caramelizadas (cebola queimadinha).",
        "Quando o arroz estiver pronto, misture metade da cebola e coloque o restante por cima para decorar."
      ],
      tags: ["Ano Novo", "Acompanhamento", "Sorte"]
    },
    {
      title: "Pudim de Leite Condensado (Sem Erro)",
      time_minutes: 90,
      difficulty: "Médio",
      servings: 10,
      rating: 5,
      used_ingredients: [
        "1 lata de leite condensado",
        "2 latas de leite (use a lata de leite condensado como medida)",
        "3 ovos inteiros",
        "1 xícara de açúcar (para a calda)"
      ],
      missing_ingredients: [],
      instructions: [
        "Calda: Derreta o açúcar na própria forma de pudim até virar caramelo. Espalhe pelos lados e fundo.",
        "Pudim: Bata no liquidificador o leite condensado, o leite e os ovos por 3 minutos.",
        "Despeje na forma caramelizada (use uma peneira se quiser sem furinhos).",
        "Cubra com papel alumínio.",
        "Asse em **Banho-Maria** no forno a 180°C por **1 hora e 30 minutos**.",
        "Deixe esfriar completamente e leve à geladeira por 4 horas antes de desenformar."
      ],
      tags: ["Ano Novo", "Sobremesa", "Clássico"]
    }
  ]
};

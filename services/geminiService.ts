
import { GoogleGenAI, HarmCategory, HarmBlockThreshold, GenerateContentResponse } from "@google/genai";
import { ScanResult, Recipe, FamilyMember, CookingMethod } from "../types";
import { seasonalRecipesData } from "../data/staticRecipes";

// Fix: Always use process.env.API_KEY directly for initialization as per coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string suitable for the API.
 */
const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Helper to clean JSON string from Markdown code blocks
 */
const cleanJsonString = (text: string): string => {
  if (!text) return "{}";
  // Remove ```json and ``` wrapping
  let clean = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  // Remove generic ``` wrapping
  clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
  return clean;
};

/**
 * MOCK DATA FOR TESTING
 */
export const getMockScanResult = (): ScanResult => ({
  ingredients: [
    { name: "cenoura", confidence: 0.99 },
    { name: "bacon", confidence: 0.98 },
    { name: "ovos", confidence: 0.95 },
    { name: "queijo parmesão", confidence: 0.90 },
    { name: "creme de leite", confidence: 0.85 },
    { name: "cebola", confidence: 0.92 },
    { name: "alho", confidence: 0.91 },
    { name: "tomate", confidence: 0.89 },
    { name: "alface", confidence: 0.88 }
  ],
  notes: "⚠️ MODO DEMO: Resultados simulados."
});

export const getMockRecipes = (): Recipe[] => ([
  {
    title: "Carbonara Brasileira Rápida",
    time_minutes: 20,
    difficulty: "Fácil",
    servings: 2,
    used_ingredients: ["250g de macarrão", "3 ovos", "150g de bacon", "50g de queijo parmesão", "1/2 caixa de creme de leite"],
    missing_ingredients: ["pimenta do reino a gosto"],
    instructions: [
      "Passo 1: Primeiro, coloque bastante água com sal para ferver em uma panela grande. Quando ferver, adicione os **250g de macarrão** e cozinhe por cerca de **10 minutos**.",
      "Passo 2: Enquanto a água esquenta, corte os **150g de bacon** em cubos pequenos.",
      "Passo 3: Em uma frigideira, frite o bacon em fogo médio por cerca de **8 minutos** até ficar bem douradinho e crocante. Não precisa por óleo.",
      "Passo 4: Em uma tigela separada, misture as **3 gemas**, a **1/2 caixa de creme de leite** e os **50g de queijo parmesão** ralado até virar um creme amarelinho.",
      "Passo 5: Quando o macarrão estiver cozido, escorra a água (mas guarde um pouquinho da água do cozimento).",
      "Passo 6: Desligue o fogo do bacon. Misture o macarrão na frigideira do bacon.",
      "Passo 7: ATENÇÃO: Com o fogo desligado, despeje a mistura de ovos e queijo sobre o macarrão quente e mexa rápido para ficar cremoso.",
      "Passo 8: Sirva imediatamente bem quentinho!"
    ],
    tags: ["massa", "rápida", "conforto"],
    timers: [
      { label: "Cozinhar Macarrão", minutes: 12 },
      { label: "Fritar Bacon", minutes: 8 }
    ]
  },
  {
    title: "Omelete Recheado Cremoso",
    time_minutes: 10,
    difficulty: "Muito Fácil",
    servings: 1,
    used_ingredients: ["2 ovos", "30g de queijo parmesão", "1 fatia de bacon picado", "1/4 de cebola picada", "1 dente de alho"],
    missing_ingredients: ["salsinha picada"],
    instructions: [
      "Passo 1: Quebre os **2 ovos** em uma tigela e bata com um garfo por **1 minuto** até misturar bem.",
      "Passo 2: Pique a **1/4 de cebola**, o dente de alho e a fatia de bacon em pedaços bem pequenos.",
      "Passo 3: Aqueça uma frigideira antiaderente. Refogue o bacon, a cebola e o alho por **3 minutos** até a cebola ficar transparente.",
      "Passo 4: Despeje os ovos batidos na frigideira, espalhando por todo o fundo.",
      "Passo 5: Abaixe o fogo e deixe cozinhar por **4 minutos**. Quando a borda estiver soltando, jogue os **30g de queijo** por cima.",
      "Passo 6: Com cuidado, dobre a omelete ao meio (formando uma meia lua) e deixe dourar mais um pouquinho.",
      "Passo 7: Sirva em seguida."
    ],
    tags: ["café da manhã", "low carb", "rápida"],
    timers: [
      { label: "Refogar Temperos", minutes: 3 },
      { label: "Cozinhar Ovos", minutes: 5 }
    ]
  }
]);

/**
 * Analyzes the fridge image using Plain Text Output to allow robust parsing.
 */
export const analyzeFridgeImage = async (file: File): Promise<ScanResult> => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found in environment. Falling back to Mock Data.");
    return new Promise(resolve => setTimeout(() => resolve(getMockScanResult()), 1500));
  }

  const base64Data = await fileToGenerativePart(file);
  const mimeType = file.type || 'image/jpeg';
  // Fix: Use gemini-3-flash-preview as the default multimodal model for analysis.
  const model = "gemini-3-flash-preview"; 
  
  const prompt = `
  Analise esta imagem de geladeira/despensa.
  Liste os alimentos identificados.
  
  FORMATO DE RESPOSTA (Texto Simples):
  - [Nome do Alimento]
  - [Nome do Alimento]
  
  REGRAS:
  1. Use apenas hífen (-) no início de cada linha.
  2. Nomes curtos e diretos (Ex: "Cenoura", "Leite", "Manteiga").
  3. NÃO descreva embalagem, quantidade ou posição.
  4. NÃO use adjetivos como "fatiado", "picado", "pote de".
  5. Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: prompt }
        ]
      },
      config: {
        temperature: 0.1,
        maxOutputTokens: 1000,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
      }
    });

    // Fix: Accessing response.text directly (it is a property, not a method).
    const text = response.text;
    if (!text) throw new Error("A IA não retornou texto.");

    const lines = text.split('\n');
    const ingredients = lines
        .map(line => line.trim())
        .filter(line => (line.startsWith('-') || line.startsWith('*')) && line.length > 2)
        .map(line => {
            let name = line.replace(/^[-*]\s*/, '').trim();
            name = name.replace(/[.,;]$/, '');
            name = name.replace(/^(pote de|garrafa de|caixa de|saco de)\s*/i, '');
            return {
                name: name.toLowerCase(),
                confidence: 0.9
            };
        })
        .filter(item => item.name.length > 1 && item.name.length < 40);

    if (ingredients.length === 0) {
        if (text.length < 200) {
             return { ingredients: [{ name: text, confidence: 0.5 }], notes: "Texto livre detectado." };
        }
        return { ingredients: [], notes: "Não foi possível identificar itens em formato de lista." };
    }

    return { ingredients, notes: "Análise via lista de texto." };

  } catch (error: any) {
    console.error("Error analyzing image:", error);
    if (error.message?.includes("403") || error.message?.includes("API key")) {
       return getMockScanResult();
    }
    throw new Error("Falha ao analisar a imagem. Tente novamente.");
  }
};

/**
 * Filters recipes that inadvertently contain disliked items.
 */
const postProcessRecipes = (recipes: Recipe[], dislikes: string[]): Recipe[] => {
  if (!dislikes || dislikes.length === 0) return recipes;

  const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const normalizedDislikes = dislikes.map(d => normalize(d.trim())).filter(d => d.length > 0);

  if (normalizedDislikes.length === 0) return recipes;

  return recipes.filter(recipe => {
    const combinedText = normalize(
      [
        recipe.title,
        ...(recipe.used_ingredients || []),
        ...(recipe.missing_ingredients || []),
        ...(recipe.instructions || [])
      ].join(' ')
    );

    const hasForbiddenItem = normalizedDislikes.some(dislike => {
        return combinedText.includes(dislike);
    });

    if (hasForbiddenItem) return false;
    return true;
  });
};

/**
 * Generates recipe suggestions based on ingredients.
 */
export const generateRecipes = async (ingredients: string[], activeProfiles?: FamilyMember[], cookingMethod?: CookingMethod, pantryItems?: string[]): Promise<Recipe[]> => {
  if (!process.env.API_KEY) {
    return new Promise(resolve => setTimeout(() => resolve(getMockRecipes()), 1500));
  }
  
  // Fix: Use gemini-3-flash-preview as the standard model for basic text/multimodal tasks.
  const model = "gemini-3-flash-preview";

  const stapleIngredients = (pantryItems && pantryItems.length > 0) 
    ? pantryItems.join(', ') 
    : "água, sal, açúcar, óleo, azeite, pimenta do reino, vinagre, café, manteiga, arroz, feijão, farinha de trigo";

  let profileContext = "";
  let restrictionRules = "";
  
  let methodInstruction = "Método: Livre (Fogão, Forno, Microondas) ou o mais adequado para o prato.";
  if (cookingMethod && cookingMethod !== CookingMethod.ANY) {
     methodInstruction = `
     MÉTODO OBRIGATÓRIO: ${cookingMethod}.
     As receitas DEVEM ser feitas usando ${cookingMethod}.
     Se for AirFryer: dê temperaturas (ex: 200°C) e tempos precisos.
     `;
  }

  let dislikeList: string[] = [];
  if (activeProfiles && activeProfiles.length > 0) {
    const names = activeProfiles.map(p => p.name).join(', ');
    const rawDislikes = activeProfiles.map(p => p.dislikes).filter(d => d && d.trim().length > 0).join(',');
    dislikeList = rawDislikes.split(',').map(s => s.trim()).filter(s => s);
    const allRestrictions = [...new Set(activeProfiles.flatMap(p => p.restrictions))];
    const hasBaby = activeProfiles.some(p => p.isChild || p.name.toLowerCase().includes('bebê') || p.restrictions.includes('Bebê (< 2 anos)'));

    profileContext = `
    COZINHANDO PARA: ${names}
    RESTRIÇÕES: ${allRestrictions.join(', ') || "Nenhuma"}
    `;

    restrictionRules = `
    INGREDIENTES PROIBIDOS (Se a receita levar, NÃO SUGIRA): ${dislikeList.join(', ')}.
    ${hasBaby ? "ALERTA BEBÊ: Zero açúcar, zero mel, pouco sal. Texturas macias." : ""}
    `;
  }

  const systemInstruction = `
  Você é um Professor de Culinária extremamente paciente e detalhista, especializado em ensinar iniciantes completos.
  
  OBJETIVO: Criar receitas DELICIOSAS usando os ingredientes disponíveis, mas focando na DIDÁTICA.
  O usuário pode não saber cozinhar. Explique TUDO.
  
  INGREDIENTES DISPONÍVEIS (Prioridade): ${ingredients.join(', ')}.
  DESPENSA BÁSICA (Pode usar à vontade): ${stapleIngredients}.
  
  ${methodInstruction}
  ${profileContext}
  ${restrictionRules}

  REGRAS DE OURO PARA O MODO DE PREPARO (OBRIGATÓRIO):
  1. NÃO assuma conhecimento prévio. Não diga apenas "refogue" ou "sele". 
     -> DIGA: "Aqueça o óleo e coloque a carne, deixando fritar sem mexer por 2 minutos até ficar marrom (isso se chama selar)."
  2. DICAS VISUAIS E SENSORIAIS: O usuário precisa saber quando passar para o próximo passo.
     -> DIGA: "Até a cebola ficar transparente", "Até a borda começar a dourar", "Até sentir cheiro de biscoito".
  3. EXPLIQUE O "PORQUÊ": Ensine enquanto guia.
     -> DIGA: "Não mexa agora para não soltar água e a carne não ficar dura."
  4. SEGURANÇA: Avise sobre óleo espirrando, vapor quente ao abrir forno/panela, cuidado com facas.
  5. DETALHE QUANTIDADES NO TEXTO: ISSO É OBRIGATÓRIO. 
     -> NÃO DIGA: "Adicione o leite." 
     -> DIGA: "Adicione os **200ml de leite**."
     O usuário não deve ter que subir a tela para lembrar a quantidade.

  ESTRUTURA DA RESPOSTA:
  - Título atraente e honesto.
  - Ingredientes com quantidades precisas (gramas, xícaras, colheres). Use "missing_ingredients" se precisar de algo fora da lista do usuário para o prato ficar bom.
  - Instruções longas e descritivas.
  
  FORMATO JSON OBRIGATÓRIO:
  {
    "recipes": [
      {
        "title": "Nome Real do Prato",
        "time_minutes": 40,
        "difficulty": "Médio",
        "servings": 4,
        "used_ingredients": ["500g de carne moída", "3 batatas"], 
        "missing_ingredients": ["1 sachê de molho de tomate"],
        "instructions": [
            "Passo 1 (Preparação): Comece descascando as **3 batatas**. Corte-as em cubos de cerca de 2cm (tamanho de um dado). Isso ajuda a cozinhar por igual.", 
            "Passo 2 (Refogar): Aqueça uma panela média em fogo alto com um fio de óleo. Quando estiver quente, coloque os **500g de carne moída**. Dica: Não mexa imediatamente! Deixe fritar por 1 minuto para criar uma crostinha saborosa no fundo."
        ],
        "tags": ["almoço", "carne", "dia a dia"]
      }
    ]
  }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: "Sugira 4 receitas detalhadas passo-a-passo como se estivesse ensinando alguém que nunca cozinhou.",
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4,
        responseMimeType: "application/json",
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
      }
    });

    return processGeminiResponse(response, activeProfiles, dislikeList);
  } catch (error: any) {
    console.error("Error generating recipes:", error);
    if (error.message?.includes("403") || error.message?.includes("API key")) {
        return getMockRecipes();
    }
    throw new Error("Falha ao gerar receitas. Tente novamente.");
  }
};

/**
 * Generates recipes based on a CATEGORY/THEME (no fridge scanning required).
 */
export const generateRecipesByCategory = async (category: string, activeProfiles?: FamilyMember[], cookingMethod?: CookingMethod): Promise<Recipe[]> => {
    const normalizedCategory = Object.keys(seasonalRecipesData).find(
      key => category.toLowerCase().includes(key.toLowerCase())
    );

    if (normalizedCategory) {
      await new Promise(resolve => setTimeout(resolve, 800));
      let staticRecipes = [...seasonalRecipesData[normalizedCategory]];
      if (activeProfiles && activeProfiles.length > 0) {
        const rawDislikes = activeProfiles.map(p => p.dislikes).filter(d => d && d.trim().length > 0).join(',');
        const dislikeList = rawDislikes.split(',').map(s => s.trim()).filter(s => s);
        if (dislikeList.length > 0) {
           staticRecipes = postProcessRecipes(staticRecipes, dislikeList);
        }
      }
      return staticRecipes;
    }

    if (!process.env.API_KEY) {
      return new Promise(resolve => setTimeout(() => resolve(getMockRecipes()), 1500));
    }
    
    // Fix: Use gemini-3-flash-preview.
    const model = "gemini-3-flash-preview";
  
    let profileContext = "";
    let restrictionRules = "";
    
    let methodInstruction = "Método: O mais tradicional para o prato ou adaptado ao doméstico.";
    if (cookingMethod && cookingMethod !== CookingMethod.ANY) {
       methodInstruction = `
       MÉTODO PREFERENCIAL: ${cookingMethod}.
       Tente sugerir pratos que funcionem bem no ${cookingMethod}.
       Se for AirFryer: dê temperaturas (ex: 200°C) e tempos precisos.
       `;
    }
  
    let dislikeList: string[] = [];
    if (activeProfiles && activeProfiles.length > 0) {
      const names = activeProfiles.map(p => p.name).join(', ');
      const rawDislikes = activeProfiles.map(p => p.dislikes).filter(d => d && d.trim().length > 0).join(',');
      dislikeList = rawDislikes.split(',').map(s => s.trim()).filter(s => s);
      const allRestrictions = [...new Set(activeProfiles.flatMap(p => p.restrictions))];
      const hasBaby = activeProfiles.some(p => p.isChild || p.name.toLowerCase().includes('bebê') || p.restrictions.includes('Bebê (< 2 anos)'));
  
      profileContext = `
      COZINHANDO PARA: ${names}
      RESTRIÇÕES OBRIGATÓRIAS: ${allRestrictions.join(', ') || "Nenhuma"}
      `;
  
      restrictionRules = `
      INGREDIENTES PROIBIDOS: ${dislikeList.join(', ')}.
      ${hasBaby ? "ALERTA BEBÊ: Receitas devem ser seguras para bebês (sem mel, pouco sal, texturas adequadas)." : ""}
      `;
    }
  
    const systemInstruction = `
    Você é um Professor de Culinária extremamente paciente e detalhista.
    
    TAREFA: Sugerir as 5 melhores receitas para a categoria/tema: "${category}".
    
    CONTEXTO: O usuário quer inspiração para "${category}". 
    
    ${methodInstruction}
    ${profileContext}
    ${restrictionRules}
  
    REGRAS DE DIDÁTICA (IMPORTANTE):
    1. EXPLIQUE CADA PASSO: Assuma que o usuário nunca cozinhou antes. Explique termos como "untar", "banho-maria" ou "ponto de bico".
    2. DETALHE VISUAIS: "Bata até dobrar de volume e ficar esbranquiçado".
    3. QUANTIDADES NO TEXTO (MUITO IMPORTANTE): Sempre repita a quantidade do ingrediente no passo a passo. 
       -> "Misture o item A" (ERRADO). 
       -> "Misture as **2 xícaras de item A**" (CORRETO).
    4. ORGANIZAÇÃO: Instruções numeradas e em ordem cronológica lógica.
    5. EXPLIQUE O PORQUÊ: "Faça isso para evitar que a massa sole", "Isso ajuda a dar crocância".
    
    FORMATO JSON OBRIGATÓRIO:
    {
      "recipes": [
        {
          "title": "Nome do Prato Temático",
          "time_minutes": 45,
          "difficulty": "Médio",
          "servings": 4,
          "used_ingredients": ["500g de item A", "2 latas de item B"], 
          "missing_ingredients": [], 
          "instructions": ["Passo 1 (Mise en place): Separe todos os ingredientes...", "Passo 2: Misture as **2 latas de item B** com os **500g de item A** suavemente para não perder o ar da massa..."],
          "tags": ["${category}", "típico", "forno"]
        }
      ]
    }
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: `Quero 5 receitas incríveis e explicadas passo-a-passo para o tema: ${category}`,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.5,
          responseMimeType: "application/json",
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          ]
        }
      });
  
      return processGeminiResponse(response, activeProfiles, dislikeList);
    } catch (error: any) {
      console.error("Error generating category recipes:", error);
      if (error.message?.includes("403") || error.message?.includes("API key")) {
          return getMockRecipes();
      }
      throw new Error("Falha ao gerar sugestões. Tente novamente.");
    }
  };

/**
 * Shared helper to process Gemini JSON response.
 */
const processGeminiResponse = (response: GenerateContentResponse, activeProfiles?: FamilyMember[], dislikeList: string[] = []): Recipe[] => {
    // Fix: Access response.text property directly.
    const text = response.text;
    if (!text) throw new Error("A IA não retornou texto.");

    try {
      const cleanText = cleanJsonString(text);
      const json = JSON.parse(cleanText);
      let recipes = json.recipes || [];

      recipes = recipes.map((r: any) => ({
          ...r,
          used_ingredients: r.used_ingredients || [],
          missing_ingredients: r.missing_ingredients || [],
          instructions: r.instructions || [],
          tags: r.tags || [],
          timers: r.timers || []
      }));

      if (activeProfiles && activeProfiles.length > 0) {
          recipes = postProcessRecipes(recipes, dislikeList);
      }
      return recipes;
    } catch (parseError) {
       console.error("JSON Parse Error (Recipes):", parseError);
       throw new Error("Erro ao interpretar receitas.");
    }
}

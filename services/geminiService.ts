

import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { ScanResult, Recipe, FamilyMember, CookingMethod } from "../types";

// Helper to safely get env vars without crashing if process is undefined
const getSafeEnv = (key: string): string | undefined => {
  try {
    // Check standard Node/Next.js/CRA process.env
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || process.env[`NEXT_PUBLIC_${key}`] || process.env[`REACT_APP_${key}`];
    }
    // Fallback for Vite (unlikely in this setup but good for safety)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[`VITE_${key}`] || import.meta.env[key];
    }
    // Fallback to window object if manually injected
    // @ts-ignore
    if (typeof window !== 'undefined' && window.ENV && window.ENV[key]) {
        // @ts-ignore
        return window.ENV[key];
    }
  } catch (e) {
    console.warn("Environment variable access failed:", e);
  }
  return undefined;
};

// Initialize the client with the environment API Key safely
const apiKey = getSafeEnv('API_KEY');
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-to-prevent-init-crash' });

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
      "Coloque a água do macarrão para ferver com sal (aprox. **10 min**).",
      "Corte os **150g de bacon** em cubos e frite por cerca de **8 minutos** até ficar crocante. Reserve.",
      "Em uma tigela, misture as **3 gemas**, a **1/2 caixa de creme de leite** e os **50g de queijo parmesão** ralado.",
      "Cozinhe os **250g de macarrão** por **10 minutos** até ficar al dente.",
      "Escorra o macarrão (guarde um pouco da água) e misture rapidamente ao molho de ovos fora do fogo para não talhar.",
      "Adicione o bacon e sirva imediatamente."
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
      "Bata os **2 ovos** com sal e pimenta por **1 minuto**.",
      "Refogue a **1/4 cebola** e o alho com a **fatia de bacon** picado por **3 minutos**.",
      "Despeje os ovos na frigideira e deixe cozinhar por **4 minutos**.",
      "Quando firmar, adicione os **30g queijo** e dobre ao meio.",
      "Sirva dourado."
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
 * This avoids the "Unterminated string" JSON errors caused by long AI descriptions.
 */
export const analyzeFridgeImage = async (file: File): Promise<ScanResult> => {
  if (!apiKey) {
    console.warn("API Key not found. Falling back to Mock Data for demonstration.");
    return new Promise(resolve => setTimeout(() => resolve(getMockScanResult()), 1500));
  }

  const base64Data = await fileToGenerativePart(file);
  const mimeType = file.type || 'image/jpeg';
  const model = "gemini-2.5-flash"; 
  
  // Prompt asking for a simple list, easier to parse than complex JSON
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
        // Removed responseMimeType: "application/json" to get plain text
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
      }
    });

    const text = response.text;
    if (!text) throw new Error("A IA não retornou texto.");

    // Robust Line-by-Line Parsing
    const lines = text.split('\n');
    const ingredients = lines
        .map(line => line.trim())
        .filter(line => (line.startsWith('-') || line.startsWith('*')) && line.length > 2)
        .map(line => {
            // Remove bullet point and extra spaces
            let name = line.replace(/^[-*]\s*/, '').trim();
            // Remove trailing punctuation
            name = name.replace(/[.,;]$/, '');
            // Basic cleanup of common hallucinated prefixes
            name = name.replace(/^(pote de|garrafa de|caixa de|saco de)\s*/i, '');
            return {
                name: name.toLowerCase(),
                confidence: 0.9 // Default confidence for text lists
            };
        })
        .filter(item => item.name.length > 1 && item.name.length < 40); // Filter out garbage

    if (ingredients.length === 0) {
        // Fallback if AI didn't use list format but wrote a sentence
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
  if (!apiKey) {
    return new Promise(resolve => setTimeout(() => resolve(getMockRecipes()), 1500));
  }
  
  const model = "gemini-2.5-flash";

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
  Você é um Chef Profissional especializado em Culinária Caseira Real e Saborosa.
  
  OBJETIVO PRINCIPAL: Sugerir receitas REAIS, que existem de verdade em restaurantes ou casas de família.
  NÃO invente "misturas criativas" que não fazem sentido gastronômico. As pessoas vão comer isso.
  
  INGREDIENTES DISPONÍVEIS: ${ingredients.join(', ')}.
  DESPENSA BÁSICA: ${stapleIngredients}.
  
  ${methodInstruction}
  ${profileContext}
  ${restrictionRules}

  REGRAS RÍGIDAS DE QUALIDADE:
  1. RECUPERE RECEITAS CLÁSSICAS: Se tenho ovos e batata, sugira "Tortilla Espanhola" ou "Omelete de Batata", não invente "Batata cozida com casca de ovo".
  2. SIMPLICIDADE: Se os ingredientes forem poucos, sugira pratos simples e honestos (Ex: Arroz frito, Macarrão alho e óleo, Salada Caprese).
  3. SEM "GOROROBA": Não misture ingredientes que não combinam quimicamente ou culturalmente.
  4. QUANTIDADES: Seja preciso. Use gramas, xícaras ou colheres. Nunca diga "um pouco".
  
  FORMATO JSON OBRIGATÓRIO:
  {
    "recipes": [
      {
        "title": "Nome Real do Prato (Ex: Escondidinho de Carne)",
        "time_minutes": 40,
        "difficulty": "Médio",
        "servings": 4,
        "used_ingredients": ["500g de carne moída", "3 batatas grandes"], // INICIE COM QUANTIDADE
        "missing_ingredients": ["100g de queijo mussarela"], // INICIE COM QUANTIDADE (Liste apenas o essencial que falta)
        "instructions": ["Passo 1 detalhado com tempo **10 min**", "Passo 2 com temperatura"],
        "tags": ["almoço", "clássico", "carne"]
      }
    ]
  }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: "Sugira 4 receitas deliciosas e reais baseadas no que eu tenho.",
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4, // Lower temperature to prioritize realistic/proven recipes over "creative" hallucinations
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
    if (!apiKey) {
      return new Promise(resolve => setTimeout(() => resolve(getMockRecipes()), 1500));
    }
    
    const model = "gemini-2.5-flash";
  
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
    Você é um Chef Profissional Criativo.
    
    TAREFA: Sugerir as 5 melhores receitas para a categoria/tema: "${category}".
    
    CONTEXTO: O usuário quer inspiração para "${category}". Não estamos limitados ao que tem na geladeira, o usuário pode ir comprar.
    
    ${methodInstruction}
    ${profileContext}
    ${restrictionRules}
  
    REGRAS:
    1. SEJA TEMÁTICO: Se for "Festa Junina", sugira Pamonha, Canjica, Caldos. Se for "Páscoa", Bacalhau, Chocolate.
    2. VARIABILIDADE: Sugira opções variadas dentro do tema (entrada, prato principal, sobremesa ou variações do prato).
    3. INGREDIENTES: Liste todos os ingredientes necessários como "used_ingredients". Deixe "missing_ingredients" vazio, pois é uma sugestão de compra.
    
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
          "instructions": ["Passo 1...", "Passo 2..."],
          "tags": ["${category}", "típico", "forno"]
        }
      ]
    }
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: `Quero 5 receitas incríveis para o tema: ${category}`,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.6, // Higher temp for creativity in suggestions
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
 * Shared helper to process Gemini JSON response
 */
const processGeminiResponse = (response: any, activeProfiles?: FamilyMember[], dislikeList: string[] = []): Recipe[] => {
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

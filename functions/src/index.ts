import { onCall, HttpsError } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { GoogleGenAI } from "@google/genai";

// Configuração para permitir chamadas mais longas (IA demora)
setGlobalOptions({ maxInstances: 10, timeoutSeconds: 60 });

const apiKey = process.env.GEMINI_API_KEY; // Você define isso no ambiente do Google Cloud
const ai = new GoogleGenAI({ apiKey: apiKey });

// 1. Função de Analisar Geladeira
export const analyzeFridgeImage = onCall(async (request) => {
  // O usuário precisa estar logado
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Usuário deve estar logado.');
  }

  const { imageBase64, mimeType } = request.data;
  const model = "gemini-2.5-flash";

  const prompt = `
  Analise esta imagem de geladeira/despensa.
  Liste os alimentos identificados.
  FORMATO DE RESPOSTA (Texto Simples):
  - [Nome do Alimento]
  REGRAS: Use apenas hífen no início. Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType || 'image/jpeg', data: imageBase64 } },
          { text: prompt }
        ]
      }
    });
    
    return { text: response.text };
  } catch (error) {
    console.error(error);
    throw new HttpsError('internal', 'Erro ao processar imagem.');
  }
});

// 2. Função de Gerar Receitas
export const generateRecipes = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Login necessário.');

  const { ingredients, userProfileString } = request.data;
  const model = "gemini-2.5-flash";

  const systemInstruction = `
    Você é um Chef de Cozinha.
    Crie receitas baseadas nestes ingredientes: ${ingredients}.
    Perfil do Usuário: ${userProfileString}.
    Retorne APENAS JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: "Sugira 3 receitas detalhadas.",
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json"
      }
    });
    
    return { text: response.text };
  } catch (error) {
    throw new HttpsError('internal', 'Erro ao gerar receitas.');
  }
});
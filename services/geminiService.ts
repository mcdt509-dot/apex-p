
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";

const getAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateHealthTip = async (topic: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Give me a concise, expert bodybuilding or fitness health tip regarding: ${topic}. 
    Focus on advanced techniques or often-overlooked details. 
    Include a title, content, and 3 relevant tags.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          tags: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "content", "tags"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const createFitnessCoachChat = (): Chat => {
  const ai = getAI();
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the "Apex Physique AI Coach". You are an expert in sports nutrition, kinesiology, and high-performance bodybuilding. 
      Your tone is motivating, professional, and hardcore. 
      
      IMPORTANT: You have full knowledge of the Apex Store inventory. If a user needs help, suggest these specific products:
      - 'Nitro-Whey Isolate' (For recovery)
      - 'Advanced Multivitamin Pro' (Micronutrients)
      - 'Creatine Monohydrate Pure' (Power/Strength)
      - 'Apex Lifting Belt' (Support)
      - 'Pro Wrist Wraps' (Joint support)
      - 'BCAA 2:1:1 Recover' (Endurance)
      - 'Vegan Pea Protein' (Plant-based)
      - 'Omega-3 Fish Oil' (Joint health)
      
      Keep answers concise. Always push the user to achieve their peak physique.`,
    },
  });
};

export const calculateMacros = async (data: { weight: number, height: number, age: number, activity: string, goal: string }) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Calculate target daily macros (Protein, Carbs, Fats) and total calories for this individual:
    Weight: ${data.weight}kg, Height: ${data.height}cm, Age: ${data.age}, Activity Level: ${data.activity}, Primary Goal: ${data.goal}.
    Provide a brief explanation for the split.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fats: { type: Type.NUMBER },
          explanation: { type: Type.STRING }
        },
        required: ["calories", "protein", "carbs", "fats", "explanation"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const getProductExpertInsight = async (productName: string, category: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a professional sports supplement analyst. Provide a detailed expert insight for a product named "${productName}" in the "${category}" category. 
    Include a sharp "Verdict", a list of 3 specific "Core Benefits", and one "Pro Tip" for usage.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verdict: { type: Type.STRING },
          benefits: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          proTip: { type: Type.STRING }
        },
        required: ["verdict", "benefits", "proTip"]
      }
    }
  });

  return JSON.parse(response.text);
};

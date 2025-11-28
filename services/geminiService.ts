import { GoogleGenAI, Type } from "@google/genai";
import { DuaResponse, Verse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateDua = async (situation: string): Promise<DuaResponse | null> => {
  try {
    const prompt = `
      You are a wise, compassionate spiritual companion. The user is in this situation: "${situation}".
      
      Provide the most perfect Dua (supplication) for them. 
      Prioritize authentic Duas from the Quran or Sunnah if they directly fit.
      If no specific authentic text fits perfectly, compose a spiritually profound Dua in the style of the righteous (in high-quality Classical Arabic).
      
      Also provide a "guidance" section: a short, uplifting, comforting message speaking directly to their heart about why this Dua is for them.

      Return structured JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            arabic: { type: Type.STRING, description: "The Arabic text of the Dua with vowel marks (Tashkeel)." },
            transliteration: { type: Type.STRING, description: "English transliteration." },
            translation: { type: Type.STRING, description: "Beautiful English translation." },
            source: { type: Type.STRING, description: "Source (e.g., 'Quran 2:201', 'Sahih Bukhari', or 'Inspirational')." },
            guidance: { type: Type.STRING, description: "A comforting paragraph explaining the wisdom of this Dua." }
          }
        }
      }
    });

    return JSON.parse(response.text || 'null');
  } catch (error) {
    console.error("Dua Generation Error:", error);
    return null;
  }
};

export const generateQuizForVerse = async (verse: Verse): Promise<any> => {
  try {
    const prompt = `
      Create a multiple-choice question to test memorization or understanding of this Quranic verse.
      Verse (Arabic): ${verse.arabicText}
      Translation: ${verse.translation}
      
      Generate a question, 4 distinct options, and indicate the index of the correct option (0-3).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER }
          }
        }
      }
    });

    return JSON.parse(response.text || 'null');
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    return null;
  }
};

export const explainVerseContext = async (verse: Verse): Promise<string> => {
  try {
    const prompt = `
      Provide a brief, inspiring explanation (max 2-3 sentences) of the context or spiritual benefit of this verse to help a student memorize it.
      Verse: ${verse.translation}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Explanation Error:", error);
    return "Could not retrieve explanation at this time.";
  }
};

export const chatWithCoach = async (message: string, context: string): Promise<string> => {
  try {
    const prompt = `
      You are HafizAI, a kind, knowledgeable, and encouraging Quran memorization coach.
      Context of current session: ${context}
      
      User says: "${message}"
      
      Respond helpfully and briefly.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "I apologize, I am having trouble responding right now.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "I apologize, I am unable to connect at the moment.";
  }
};
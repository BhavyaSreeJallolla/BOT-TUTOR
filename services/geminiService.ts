
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Difficulty, UserRole, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `You are a world-class AI Programming Tutor. 
Your goal is to teach programming to users of all levels. 
Be encouraging, clear, and adaptive. 
Use markdown for formatting. 
Always provide code examples in triple backticks. 
When explaining errors, highlight the exact issue and provide the concept explanation before showing the fix.`;

export async function getTutorResponse(
  message: string, 
  history: { role: 'user' | 'model'; text: string }[],
  profile: UserProfile
) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: 'user', parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: `${SYSTEM_INSTRUCTION}\nUser is currently at ${profile.role} level. They are interested in ${profile.preferredLanguages.join(', ')}.`,
      temperature: 0.7,
    },
  });
  return response.text;
}

export async function generateChallenge(
  language: string, 
  topic: string, 
  difficulty: Difficulty
) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a programming challenge for ${language} about ${topic} at ${difficulty} level.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          starterCode: { type: Type.STRING },
          hints: { type: Type.ARRAY, items: { type: Type.STRING } },
          difficulty: { type: Type.STRING }
        },
        required: ["title", "description", "starterCode", "difficulty"]
      }
    }
  });
  return JSON.parse(response.text);
}

export async function reviewCode(
  code: string, 
  language: string, 
  context: string,
  profile: UserProfile
) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Review this ${language} code for the following task: "${context}".\nCode:\n\`\`\`${language}\n${code}\n\`\`\``,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isCorrect: { type: Type.BOOLEAN },
          errorType: { type: Type.STRING },
          explanation: { type: Type.STRING },
          lineOfError: { type: Type.NUMBER },
          correctedCode: { type: Type.STRING },
          feedback: { type: Type.STRING },
          improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["isCorrect", "explanation", "feedback"]
      }
    }
  });
  return JSON.parse(response.text);
}

export async function getRecommendedResources(topic: string, language: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Recommend 5 high-quality learning resources for ${topic} in ${language}. Include official docs, videos, and GitHub repos.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            type: { type: Type.STRING, description: "Video, Document, Repo, or Article" },
            url: { type: Type.STRING },
            description: { type: Type.STRING }
          }
        }
      }
    }
  });
  return JSON.parse(response.text);
}

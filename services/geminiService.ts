
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Difficulty, StandardCategory } from "../types";

// Fix: Always use the recommended initialization pattern
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    standard: { type: Type.STRING, description: "Florida Standard Code (e.g., SC.912.L.14.1)" },
    category: { type: Type.STRING, description: "One of the StandardCategory values" },
    difficulty: { type: Type.STRING, description: "Low, Moderate, or High" },
    text: { type: Type.STRING, description: "The actual question text" },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      minItems: 4,
      maxItems: 4,
    },
    correctAnswer: { type: Type.INTEGER, description: "Index of the correct answer (0-3)" },
    explanation: { type: Type.STRING, description: "Brief explanation of why the answer is correct" },
  },
  required: ["standard", "category", "difficulty", "text", "options", "correctAnswer", "explanation"],
};

export async function generateAdaptiveQuestion(
  currentLevel: number,
  answeredStandards: string[],
  category: StandardCategory
): Promise<Question> {
  const difficulty = currentLevel >= 4 ? Difficulty.HIGH : currentLevel >= 2.5 ? Difficulty.MODERATE : Difficulty.LOW;
  
  const prompt = `
    Generate a high-quality Biology EOC (End of Course) question for Florida State Standards.
    Target Difficulty: ${difficulty}
    Category: ${category}
    Avoid these specific standards already used if possible: ${answeredStandards.join(", ")}
    The question should be rigorous, similar to official FLDOE released items.
    Focus on conceptual understanding rather than rote memorization.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
      },
    });

    const data = JSON.parse(response.text);
    return {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    };
  } catch (error) {
    console.error("Error generating question:", error);
    // Fallback simple question if AI fails
    return {
      id: "fallback",
      standard: "SC.912.L.14.1",
      category: StandardCategory.CELLS,
      difficulty: Difficulty.LOW,
      text: "Which component is a key part of the cell theory?",
      options: ["All cells come from pre-existing cells", "All cells have a nucleus", "All cells move", "Cells are made of atoms only"],
      correctAnswer: 0,
      explanation: "Cell theory states that all cells come from pre-existing cells.",
    };
  }
}

export async function generateFinalReport(
  performance: any,
  totalQuestions: number
): Promise<{ recommendations: string[]; summary: string }> {
  const prompt = `
    Based on the following performance data from a 60-question Florida Biology EOC simulation:
    ${JSON.stringify(performance)}
    
    Provide a professional summary of student strengths and weaknesses.
    Include 3-5 specific, actionable recommendations for improvement aligned with Florida Standards.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return {
      summary: "Simulation complete. Review your performance by category below.",
      recommendations: ["Focus on standards with lower accuracy.", "Practice high-complexity data analysis questions."]
    };
  }
}

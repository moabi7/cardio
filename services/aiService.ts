import { GoogleGenerativeAI } from "@google/generative-ai";
import { FitnessPlan } from "../models/user";

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export const generateFitnessPlan = async (userData: {
  gender: string;
  goal: string;
  workoutDays: string;
  birthdate: string;
  height: number;
  weight: number;
}): Promise<FitnessPlan> => {
  // Array of model names to try in order of preference
  const modelNames = ["gemini-3-flash-preview", "gemini-flash-latest", "gemini-3.1-pro-preview"];
  let lastError: any = null;

  for (const modelName of modelNames) {
    try {
      console.log(`Attempting fitness plan generation with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `
        As a professional fitness and nutrition expert, generate a personalized fitness plan for a user with the following metrics:
        - Gender: ${userData.gender}
        - Goal: ${userData.goal}
        - Workout Frequency: ${userData.workoutDays}
        - Birthdate: ${userData.birthdate}
        - Height: ${userData.height} Feet
        - Weight: ${userData.weight} Kg

        Please provide the response in STRICT JSON format with the following keys:
        {
          "calories": number (daily target),
          "protein": number (in grams),
          "carbs": number (in grams),
          "fats": number (in grams),
          "water": number (in Liters, e.g., 3.5),
          "advice": [string, string, string] (at least 3 specific fitness or nutrition tips)
        }
        
        Only return the JSON object, no other text.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Clean potential markdown code blocks from response
      const jsonString = responseText.replace(/```json|```/g, "").trim();
      const data = JSON.parse(jsonString);

      return {
        ...data,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.warn(`Failed to generate with ${modelName}:`, error);
      lastError = error;
      // Continue to next model
    }
  }

  console.error("All Gemini models failed:", lastError);
  throw new Error("Failed to generate fitness plan with available AI models. Please check your API key and region.");
};

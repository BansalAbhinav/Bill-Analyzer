import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

async function testGemini() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "models/gemini-flash-latest",
    contents: [
      {
        role: "user",
        parts: [{ text: "Say hello in one word" }],
      },
    ],
  });

  console.log("✅ SUCCESS:", response.text);
}

testGemini().catch(console.error);

import { GoogleGenAI } from "@google/genai";
import { promptText } from "../prompts/bill_analysis_prompt.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = "models/gemini-flash-latest";

/**
 * Utility: clean common markdown wrappers from LLM JSON
 */
function cleanJson(text) {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

/**
 * Core Gemini call
 */
async function runGemini(prompt) {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ], //llm configuration
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1024,
    },
  });

  return response.text;
}

/**
 * Analyze hospital bill text
 */
export async function analyzeBillWithGemini(extractedText) {
  if (!extractedText?.trim()) {
    throw new Error("Extracted text is empty");
  }

  const fullPrompt = `
${promptText}

---
## DOCUMENT TEXT:
${extractedText}
`;

  const rawText = await runGemini(fullPrompt);

  try {
    const cleaned = cleanJson(rawText);
    return {
      analysis: JSON.parse(cleaned),
      rawText,
    };
  } catch (err) {
    return {
      analysis: { raw_response: rawText },
      rawText,
    };
  }
}

/**
 * Analyze using custom prompt
 */
export async function analyzeWithCustomPrompt(extractedText, customPrompt) {
  if (!extractedText?.trim()) {
    throw new Error("Extracted text is empty");
  }

  const fullPrompt = `
${customPrompt}

---
## DOCUMENT TEXT:
${extractedText}
`;

  const rawText = await runGemini(fullPrompt);

  try {
    const cleaned = cleanJson(rawText);
    return {
      analysis: JSON.parse(cleaned),
      rawText,
    };
  } catch {
    return {
      analysis: { raw_response: rawText },
      rawText,
    };
  }
}

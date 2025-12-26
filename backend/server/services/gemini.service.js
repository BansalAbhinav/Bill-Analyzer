import { GoogleGenAI } from "@google/genai";
import { promptText } from "../prompts/bill_analysis_prompt.js";

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = "models/gemini-flash-latest";

/**
 * Analyze hospital bill text using Gemini
 */
export const analyzeBillWithGemini = async (extractedText) => {
  try {
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("Extracted text is empty");
    }

    // Combine prompt + document text
    const fullPrompt = `
${promptText}

---
## DOCUMENT TEXT:
${extractedText}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
    });

    const analysisText = response.text;

    // Parse JSON from response (remove markdown code blocks if present)
    let parsedAnalysis = null;
    try {
      let jsonText = analysisText.trim();

      // Remove markdown code blocks
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/```\n?/g, "");
      }

      // Remove any trailing commas before closing braces/brackets
      jsonText = jsonText.replace(/,(\s*[}\]])/g, "$1");

      parsedAnalysis = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.warn(
        "Could not parse JSON response, attempting to fix common issues",
      );

      // Try alternative parsing strategies
      try {
        let jsonText = analysisText.trim();

        // More aggressive cleaning
        jsonText = jsonText
          .replace(/```json\n?/g, "")
          .replace(/```\n?$/g, "")
          .replace(/```/g, "")
          .replace(/,(\s*[}\]])/g, "$1")
          .replace(/\n/g, " ")
          .replace(/\s+/g, " ");

        parsedAnalysis = JSON.parse(jsonText);
      } catch (secondError) {
        console.error(
          "Failed to parse LLM response as JSON:",
          secondError.message,
        );
        console.log("Raw response:", analysisText.substring(0, 500));

        // Return raw text wrapped in an object
        parsedAnalysis = {
          raw_response: analysisText,
          parse_error: "Could not parse as JSON",
          error_message: secondError.message,
        };
      }
    }

    return {
      analysis: parsedAnalysis,
      rawText: analysisText,
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

/**
 * Analyze using a custom prompt
 */
export const analyzeWithCustomPrompt = async (extractedText, customPrompt) => {
  try {
    const fullPrompt = `
${customPrompt}

---
## DOCUMENT TEXT:
${extractedText}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
    });

    const analysisText = response.text;

    // Parse JSON from response
    let parsedAnalysis = null;
    try {
      let jsonText = analysisText.trim();

      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/```\n?/g, "");
      }

      parsedAnalysis = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.warn("Could not parse JSON response");
      parsedAnalysis = { raw_response: analysisText };
    }

    return {
      analysis: parsedAnalysis,
      rawText: analysisText,
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

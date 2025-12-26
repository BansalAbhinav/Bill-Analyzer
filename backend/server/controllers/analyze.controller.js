import {
  analyzeBillWithGemini,
  analyzeWithCustomPrompt,
} from "../services/gemini.service.js";
import { readTextFile } from "../utils/fileCleanup.js";

/**
 * Analyze bill using Gemini - expects textFile from extraction
 */
export const analyzeBill = async (req, res) => {
  try {
    // Check if body exists
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message:
          "Request body is required. Send JSON with 'extractedText' or 'textFile'",
      });
    }

    const { textFile, extractedText, customPrompt } = req.body;

    // Get text either from file or directly from request
    let textToAnalyze = extractedText;

    if (!textToAnalyze && textFile) {
      textToAnalyze = readTextFile(textFile);
    }

    if (!textToAnalyze) {
      return res.status(400).json({
        success: false,
        message:
          "No text provided for analysis. Provide either 'textFile' or 'extractedText'",
      });
    }

    // Use custom prompt or default
    let result;
    if (customPrompt) {
      result = await analyzeWithCustomPrompt(textToAnalyze, customPrompt);
    } else {
      result = await analyzeBillWithGemini(textToAnalyze);
    }

    res.json({
      success: true,
      data: {
        analysis: result.analysis,
        savedFile: result.fileName,
        promptUsed: result.promptUsed || "custom",
      },
    });
  } catch (error) {
    console.error("Analysis Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Analysis failed",
      error: error.message,
    });
  }
};

/**
 * Extract and analyze in one call
 */
export const extractAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // This will be called after extraction middleware processes the file
    // The extracted text should be in req.extractedText (we'll need to add this)
    const { extractedText } = req.body;

    if (!extractedText) {
      return res.status(400).json({
        success: false,
        message: "Extraction failed, no text available",
      });
    }

    const result = await analyzeBillWithGemini(extractedText);

    res.json({
      success: true,
      data: {
        analysis: result.analysis,
        savedFile: result.fileName,
      },
    });
  } catch (error) {
    console.error("Extract and Analyze Error:", error);
    res.status(500).json({
      success: false,
      message: "Extract and analyze failed",
      error: error.message,
    });
  }
};

import { extractText } from "../services/documentExtractor.service.js";
import { analyzeBillWithGemini } from "../services/gemini.service.js";

export const processDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { path, mimetype } = req.file;

    const extractedText = await extractText(path, mimetype);

    const llmResponse = await analyzeBillWithGemini(extractedText);
    res.json({
      message: "File processed successfully",
      Data: llmResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to process document",
    });
  }
};

import { extractText } from "../services/documentExtractor.service.js";
import { analyzeBillWithGemini } from "../services/gemini.service.js";
import { BillAnalysis } from "../models/bill.models.js";

export const processDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { path, mimetype, originalname } = req.file;
    const userId = req.user?.userId || req.user?._id;

    // Extract text from document
    const { text: extractedText, via: extractedVia } = await extractText(
      path,
      mimetype,
    );

    // Analyze with Gemini AI
    const llmResponse = await analyzeBillWithGemini(extractedText);

    // Determine file type
    const fileType = mimetype.includes("pdf") ? "pdf" : "image";

    // Save to database
    const billAnalysis = await BillAnalysis.create({
      originalFileName: originalname,
      fileType,
      extractedText,
      extractedVia,
      analysis: llmResponse,
      userId,
      status: "completed",
      totalPages: 1, // You can enhance this later
    });

    res.json({
      message: "File processed successfully",
      billId: billAnalysis._id,
      Data: llmResponse,
      info: {
        remainingSlots: 4 - (req.userBillCount + 1),
        expiresIn: "24 hours",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to process document",
    });
  }
};


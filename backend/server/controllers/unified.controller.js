import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { analyzeBillWithGemini } from "../services/gemini.service.js";
import { asyncHandler } from "../helpers/helper.js";
import { BillAnalysis } from "../models/bill.models.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Single endpoint: Upload PDF/Image → Extract Text → Analyze with LLM → Save to MongoDB
 */
export const processDocument = asyncHandler(async (req, res) => {
  let filePath = null;
  const { userId } = req.userInfo;
  // Step 1: Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded. Upload a PDF or image file.",
    });
  }

  filePath = req.file.path;
  const pythonScriptPath = path.join(__dirname, "../../python/cli_extract.py");
  const venvPython = path.join(
    __dirname,
    "../../python/venv/Scripts/python.exe",
  );

  // Step 2: Extract text from PDF/Image using Python
  const pythonProcess = spawn(venvPython, [pythonScriptPath, filePath]);

  let dataString = "";
  let errorString = "";

  pythonProcess.stdout.on("data", (data) => {
    dataString += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    errorString += data.toString();
  });

  pythonProcess.on("close", async (code) => {
    // Delete uploaded file immediately after extraction
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    if (code !== 0) {
      console.error("Python Extraction Error:", errorString);
      return res.status(500).json({
        success: false,
        message: "Text extraction failed",
        error: errorString,
      });
    }

    try {
      const extractionResult = JSON.parse(dataString);

      if (extractionResult.error) {
        return res.status(500).json({
          success: false,
          message: extractionResult.error,
        });
      }

      // Step 3: Format extracted text
      const extractedText = extractionResult.pages
        .map((page) => page.text.trim())
        .filter((text) => text.length > 0)
        .join("\n\n");

      // Step 4: Analyze with Gemini LLM
      const customPrompt = req.body?.customPrompt;
      let analysisResult;

      if (customPrompt) {
        const { analyzeWithCustomPrompt } =
          await import("../services/gemini.service.js");
        analysisResult = await analyzeWithCustomPrompt(
          extractedText,
          customPrompt,
        );
      } else {
        analysisResult = await analyzeBillWithGemini(extractedText);
      }

      // Step 5: Save to MongoDB
      const billAnalysis = new BillAnalysis({
        originalFileName: extractionResult.file_name,
        fileType: extractionResult.file_name.toLowerCase().endsWith(".pdf")
          ? "pdf"
          : "image",
        extractedText: extractedText,
        totalPages: extractionResult.total_pages,
        extractedVia: extractionResult.extracted_via,
        analysis: analysisResult.analysis,
        status: "completed",
        userId: userId,
      });

      await billAnalysis.save();

      // Step 6: Return complete response
      res.json({
        success: true,
        data: {
          id: billAnalysis._id,
          userId: billAnalysis.userId,
          extraction: {
            fileName: extractionResult.file_name,
            totalPages: extractionResult.total_pages,
            extractedVia: extractionResult.extracted_via,
          },
          analysis: analysisResult.analysis,
          createdAt: billAnalysis.createdAt,
        },
      });
    } catch (error) {
      console.error("Processing Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to process document",
        error: error.message,
      });
    }
  });
});

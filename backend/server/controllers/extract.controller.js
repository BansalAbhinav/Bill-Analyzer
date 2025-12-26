import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const extractionData = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;
    const pythonScriptPath = path.join(
      __dirname,
      "../../python/cli_extract.py",
    );
    const venvPython = path.join(
      __dirname,
      "../../python/venv/Scripts/python.exe",
    );

    // Call Python script using virtual environment
    const pythonProcess = spawn(venvPython, [pythonScriptPath, filePath]);

    let dataString = "";
    let errorString = "";

    pythonProcess.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorString += data.toString();
    });

    pythonProcess.on("close", (code) => {
      // Delete the uploaded PDF file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      if (code !== 0) {
        console.error("Python Error:", errorString);
        return res.status(500).json({
          success: false,
          message: "Extraction failed",
          error: errorString,
        });
      }

      try {
        const result = JSON.parse(dataString);

        if (result.error) {
          return res.status(500).json({
            success: false,
            message: result.error,
          });
        }

        // Format text for LLM - clean and structured
        const formattedText = formatTextForLLM(result);

        // Save formatted text to file
        const textFileName = `extracted-${Date.now()}.txt`;
        const textFilePath = path.join(__dirname, "../uploads/", textFileName);
        fs.writeFileSync(textFilePath, formattedText, "utf-8");

        res.json({
          success: true,
          data: {
            fileName: result.file_name,
            totalPages: result.total_pages,
            extractedVia: result.extracted_via,
            textFile: textFileName,
            formattedText: formattedText,
          },
        });
      } catch (parseError) {
        console.error("Parse Error:", parseError);
        return res.status(500).json({
          success: false,
          message: "Failed to parse extraction result",
        });
      }
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Format extracted text for LLM consumption - clean text only
function formatTextForLLM(extractionResult) {
  // Just concatenate all page text with simple spacing
  return extractionResult.pages
    .map((page) => page.text.trim())
    .filter((text) => text.length > 0)
    .join("\n\n");
}

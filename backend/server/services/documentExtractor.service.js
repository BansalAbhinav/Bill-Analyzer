import { extractTextFromImage } from "./imageOcr.service.js";
import { extractTextFromPDF } from "./pdfText.service.js";

/**
 * Main extractor
 */
export async function extractText(filePath, mimeType) {
  // IMAGE
  if (mimeType.startsWith("image/")) {
    return await extractTextFromImage(filePath);
  }

  // PDF
  if (mimeType === "application/pdf") {
    const text = await extractTextFromPDF(filePath);

    if (text.length > 50) {
      return text; // text-based PDF
    }

    // For scanned PDFs, return a message or throw an error
    // In a serverless environment, you'd typically use an external OCR API
    // like Google Cloud Vision, AWS Textract, or Azure Computer Vision
    throw new Error(
      "This PDF appears to be scanned. Please upload an image file instead, or use a text-based PDF."
    );
  }

  throw new Error("Unsupported file type");
}

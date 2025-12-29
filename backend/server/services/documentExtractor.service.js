import { extractTextFromImage } from "./imageOcr.service.js";
import { extractTextFromPDF } from "./pdfText.service.js";

/**
 * OCR scanned PDF - Disabled for cloud deployment
 * pdf-poppler requires system binaries not available on Render/Vercel
 */
async function ocrScannedPDF(pdfPath) {
  throw new Error(
    "OCR for scanned PDFs is not supported in cloud environment. " +
    "Please upload text-based PDFs or extract images first."
  );
}

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

    return await ocrScannedPDF(filePath); // scanned PDF
  }

  throw new Error("Unsupported file type");
}

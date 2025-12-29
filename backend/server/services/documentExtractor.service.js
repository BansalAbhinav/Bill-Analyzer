import fs from "fs";
import path from "path";
import pdfPoppler from "pdf-poppler";
import { extractTextFromImage } from "./imageOcr.service.js";
import { extractTextFromPDF } from "./pdfText.service.js";

const TEMP_DIR = "./temp";

/**
 * Convert PDF pages to images
 */
async function convertPdfToImages(pdfPath) {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
  }

  const options = {
    format: "png",
    out_dir: TEMP_DIR,
    out_prefix: "page",
    page: null,
  };

  await pdfPoppler.convert(pdfPath, options);
}

/**
 * OCR scanned PDF
 */
async function ocrScannedPDF(pdfPath) {
  await convertPdfToImages(pdfPath);

  const images = fs
    .readdirSync(TEMP_DIR)
    .filter((file) => file.endsWith(".png"));

  let fullText = "";

  for (const image of images) {
    const text = await extractTextFromImage(path.join(TEMP_DIR, image));
    fullText += "\n" + text;
  }

  return fullText.trim();
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

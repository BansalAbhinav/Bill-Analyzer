// make sure you install npm install pdf-parse@1.1.1
import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export async function extractTextFromPDF(pdfPath) {
  const buffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(buffer);

  return data.text?.trim() || "";
}

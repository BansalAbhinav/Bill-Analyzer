import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Clean up old extracted text files older than specified hours
 * @param {number} hoursOld - Delete files older than this many hours (default: 24)
 */
export const cleanupOldTextFiles = (hoursOld = 24) => {
  const uploadsDir = path.join(__dirname, "../uploads/");
  const now = Date.now();
  const maxAge = hoursOld * 60 * 60 * 1000; // Convert hours to milliseconds

  try {
    const files = fs.readdirSync(uploadsDir);

    files.forEach((file) => {
      if (file.startsWith("extracted-") && file.endsWith(".txt")) {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtimeMs;

        if (fileAge > maxAge) {
          fs.unlinkSync(filePath);
          console.log(`Deleted old text file: ${file}`);
        }
      }
    });
  } catch (error) {
    console.error("Error cleaning up old text files:", error);
  }
};

/**
 * Read extracted text file by filename
 * @param {string} fileName - Name of the text file
 * @returns {string} - File content
 */
export const readTextFile = (fileName) => {
  const filePath = path.join(__dirname, "../uploads/", fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error("Text file not found");
  }

  return fs.readFileSync(filePath, "utf-8");
};

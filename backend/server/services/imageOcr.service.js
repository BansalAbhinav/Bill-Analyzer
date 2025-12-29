import { createWorker, PSM } from "tesseract.js";

export async function extractTextFromImage(imagePath) {
  const worker = await createWorker("eng");

  await worker.setParameters({
    tessedit_pageseg_mode: PSM.AUTO,
  });

  const {
    data: { text },
  } = await worker.recognize(imagePath);

  await worker.terminate();
  return text.trim();
}

import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkBillLimit } from "../middlewares/billLimit.middleware.js";
import { processDocument } from "../controllers/generateText.controller.js";

const router = express.Router();

// Single endpoint: Upload → Extract → Analyze → Save to MongoDB
// Protected route with auth and bill limit checks
router.post(
  "/process",
  authMiddleware,
  checkBillLimit,
  upload.single("file"),
  processDocument,
);

export default router;

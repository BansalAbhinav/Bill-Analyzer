import express from "express";
import { processDocument } from "../controllers/unified.controller.js";
import {
  getAllBillAnalyses,
  getBillAnalysisById,
  deleteBillAnalysis,
  getAnalyticsSummary,
} from "../controllers/billAnalysis.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Single endpoint: Upload → Extract → Analyze → Save to MongoDB
router.post("/process", upload.single("file"), authMiddleware, processDocument);

// Get all analyses (with pagination)
router.get("/analyses", getAllBillAnalyses);

// Get analytics summary
router.get("/analytics", getAnalyticsSummary);

// Get single analysis by ID
router.get("/analysis/:id", getBillAnalysisById);

// Delete analysis
router.delete("/analysis/:id", deleteBillAnalysis);

export default router;

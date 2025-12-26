import express from "express";
import { analyzeBill } from "../controllers/analyze.controller.js";

const router = express.Router();

// Analyze already extracted text
router.post("/analyze", analyzeBill);

export default router;

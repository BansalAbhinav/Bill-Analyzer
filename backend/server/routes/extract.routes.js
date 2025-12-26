import express from "express";
import { extractionData } from "../controllers/extract.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

//Auth  Routes
router.post("/extract", upload.single("file"), extractionData);

export default router;

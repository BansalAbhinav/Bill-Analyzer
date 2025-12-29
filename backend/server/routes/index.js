import express from "express";
import authRoutes from "./auth.routes.js";
import ProcessRoutes from "./process.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/data", ProcessRoutes);

export default router;

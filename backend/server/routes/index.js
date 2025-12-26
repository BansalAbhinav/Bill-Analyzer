import express from "express";
import authRoutes from "./auth.routes.js";
// import userRoutes from "./user.routes.js";
// import resourceRoutes from "./resource.routes.js";
// import categoryRoutes from "./category.routes.js";
import ExtractRoutes from "./extract.routes.js";
import AnalyzeRoutes from "./analyze.routes.js";
import ProcessRoutes from "./process.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
// router.use("/user", userRoutes);
// router.use("/resource", resourceRoutes);
// router.use("/category", categoryRoutes);

// Unified endpoint (recommended)
router.use("/data", ProcessRoutes);

// Individual endpoints (if needed)
router.use("/data", ExtractRoutes);
router.use("/data", AnalyzeRoutes);
// router.use("/auth", userRoutes);

export default router;

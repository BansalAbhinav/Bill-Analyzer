import express from "express";
import { userLogin, userRegister } from "../controllers/auth.controller.js";
import { asyncHandler } from "../helpers/helper.js";

const router = express.Router();

//Auth  Routes
router.post("/signUp", asyncHandler(userRegister));
router.post("/signIn", asyncHandler(userLogin));

export default router;

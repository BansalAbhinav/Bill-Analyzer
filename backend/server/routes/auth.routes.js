import express from "express";
import { userLogin, userRegister } from "../controllers/auth.controller.js";
import { asyncHandler } from "../helpers/helper.js";

import {
  googleAuthStartHandler,
  googleCallbackHandle,
} from "../controllers/googleoAuth.controller.js";
const router = express.Router();

//Auth  Routes
router.post("/signUp", asyncHandler(userRegister));
router.post("/signIn", asyncHandler(userLogin));
router.get("/google", asyncHandler(googleAuthStartHandler));
router.get("/google/callback", asyncHandler(googleCallbackHandle));

export default router;

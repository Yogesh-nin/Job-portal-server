import express from "express";
import { signin, signup } from "../controller/authController.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, signupSchema } from "../validators/authValidator.js";
import { createUserProfile, getUserProfile } from "../controller/profileController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { profileSchema } from "../validators/profileValidator.js";

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.post("/profile", validate(profileSchema), createUserProfile);

export default router
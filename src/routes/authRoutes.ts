import express from "express";
import { signin, signup } from "../controller/authController.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, signupSchema } from "../validators/authValidator.js";

const router = express.Router();

router.post("/sign-up", validate(signupSchema), signup);
router.post("/sign-in", validate(loginSchema), signin);

export default router;

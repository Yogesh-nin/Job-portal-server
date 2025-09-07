import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get('/experience', authMiddleware)

export default router;

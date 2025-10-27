import express from "express";
import multer from "multer";
import { compressImage } from "../controller/image-compress.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/compress", upload.single("image"), compressImage);

export default router;

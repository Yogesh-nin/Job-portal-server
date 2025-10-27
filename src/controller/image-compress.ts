import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import type { Request, Response } from "express";

export const compressImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { buffer, originalname, size } = req.file;
    const ext = path.extname(originalname).toLowerCase();

    // 5 MB = 5 * 1024 * 1024
    if (size <= 5 * 1024 * 1024) {
      return res.status(200).json({
        message: "Image is less than 5MB, no compression applied.",
        fileSize: `${(size / 1024 / 1024).toFixed(2)} MB`,
      });
    }

    // compress with sharp
    const outputBuffer = await sharp(buffer)
      .toFormat(ext === ".png" ? "png" : "jpeg", {
        quality: 80,
        mozjpeg: true,
      })
      .toBuffer();

    // root-level uploads folder
    const uploadsDir = path.join(process.cwd(), "uploads");
    await fs.mkdir(uploadsDir, { recursive: true }); // ✅ ensure folder exists

    const compressedFileName = `compressed-${Date.now()}${ext}`;
    const outputPath = path.join(uploadsDir, compressedFileName);

    await fs.writeFile(outputPath, outputBuffer);

    return res.status(200).json({
      message: "Image compressed successfully",
      originalSize: `${(size / 1024 / 1024).toFixed(2)} MB`,
      compressedSize: `${(outputBuffer.length / 1024 / 1024).toFixed(2)} MB`,
      filePath: `/uploads/${compressedFileName}`, // served from static folder
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Image compression failed" });
  }
};
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();

const uploadDir = path.join(process.cwd(), "uploads", "logos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_MIME = ["image/png", "image/jpeg", "image/webp"];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext =
      file.mimetype === "image/png"
        ? "png"
        : file.mimetype === "image/webp"
          ? "webp"
          : "jpg";
    cb(null, `${crypto.randomUUID()}.${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, ALLOWED_MIME.includes(file.mimetype));
  },
});

router.post("/upload/logo", requireAdmin, upload.single("logo"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "File tidak valid. Gunakan PNG, JPG, atau WEBP." });
    return;
  }
  const publicUrl = `/uploads/logos/${req.file.filename}`;
  res.json({ url: publicUrl });
});

export default router;

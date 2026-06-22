import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();

const uploadDir = path.join(process.cwd(), "uploads", "logos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `logo_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];
    cb(null, allowed.includes(file.mimetype));
  },
});

router.post("/upload/logo", requireAdmin, upload.single("logo"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "File tidak valid." });
  const publicUrl = `/uploads/logos/${req.file.filename}`;
  res.json({ url: publicUrl });
});

export default router;

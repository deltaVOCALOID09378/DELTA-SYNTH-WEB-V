import cors from "cors";
import express from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 3000);
const uploadDir = path.join(__dirname, "uploads");
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const allowedExtensions = new Set([".wav", ".mp3", ".ogg", ".flac", ".png", ".jpg", ".jpeg", ".webp", ".zip", ".rar", ".7z", ".ust", ".vsqx", ".mid"]);

fs.mkdirSync(uploadDir, { recursive: true });
app.disable("x-powered-by");
app.set("trust proxy", (ip) => ip === "127.0.0.1" || ip === "::1");
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(uploadDir, { maxAge: "1h", fallthrough: false }));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${safeName}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  cb(allowedExtensions.has(extension) ? null : new Error("ประเภทไฟล์ไม่รองรับ! อนุญาตเฉพาะไฟล์เสียง รูปภาพ และไฟล์โปรเจกต์เท่านั้น"), allowedExtensions.has(extension));
};
const upload = multer({ storage, limits: { fileSize: MAX_FILE_SIZE, files: 10 }, fileFilter });

function fileUrl(req, filename) { return `${req.protocol}://${req.get("host")}/uploads/${encodeURIComponent(filename)}`; }
function removeFiles(files = []) { for (const file of files) { try { fs.unlinkSync(file.path); } catch {} } }
function health(_req, res) { res.set("Cache-Control", "no-store").json({ status: "ok", service: "upload-api" }); }

app.get(["/healthz", "/health"], health);
app.head(["/healthz", "/health"], (_req, res) => res.status(200).end());

app.post("/api/upload/single", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "กรุณาเลือกไฟล์ที่ต้องการอัปโหลด" });
  res.status(200).json({ success: true, message: "อัปโหลดไฟล์สำเร็จ", data: { filename: req.file.filename, originalName: req.file.originalname, mimetype: req.file.mimetype, size: req.file.size, url: fileUrl(req, req.file.filename) } });
});

app.post("/api/upload/multiple", upload.array("files", 10), (req, res) => {
  if (!req.files?.length) return res.status(400).json({ success: false, message: "กรุณาเลือกไฟล์" });
  const files = req.files.map((file) => ({ filename: file.filename, originalName: file.originalname, mimetype: file.mimetype, size: file.size, url: fileUrl(req, file.filename) }));
  res.status(200).json({ success: true, message: `อัปโหลดสำเร็จทั้งหมด ${files.length} ไฟล์`, files });
});

app.use((err, req, res, _next) => {
  if (req.files) removeFiles(Array.isArray(req.files) ? req.files : [req.files]);
  if (req.file) removeFiles([req.file]);
  if (err instanceof multer.MulterError) {
    const message = err.code === "LIMIT_FILE_SIZE" ? "ขนาดไฟล์เกินกำหนด (สูงสุด 100MB)" : err.message;
    return res.status(400).json({ success: false, message });
  }
  if (err) return res.status(400).json({ success: false, message: err.message });
  res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
});

const server = app.listen(PORT, () => console.log(`[DELTA SYNTH] Upload Server running on port ${PORT}`));
server.keepAliveTimeout = 5_000;
server.headersTimeout = 35_000;
let shuttingDown = false;
function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`[DELTA SYNTH] ${signal}: closing upload server`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("uncaughtException", (error) => { console.error("[DELTA SYNTH] Uncaught exception", error); shutdown("uncaughtException"); });
process.on("unhandledRejection", (error) => { console.error("[DELTA SYNTH] Unhandled rejection", error); shutdown("unhandledRejection"); });

export { app, server };

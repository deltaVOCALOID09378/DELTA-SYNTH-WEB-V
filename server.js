/**
 * DELTA SYNTH — Node.js File Upload Server
 * รองรับการอัปโหลดไฟล์ Audio, Image และ Archive พร้อมระบบคัดกรองความปลอดภัย
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ตรวจสอบและสร้างโฟลเดอร์ uploads หากยังไม่มี
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ตั้งค่า Storage Engine ของ Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // ป้องกันชื่อไฟล์ซ้ำด้วย timestamp และ sanitize อักขระ
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${safeName}`);
  }
});

// กรองประเภทไฟล์ที่อนุญาต
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /wav|mp3|ogg|flac|png|jpg|jpeg|webp|zip|rar|7z|ust|vsqx|mid/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('ประเภทไฟล์ไม่รองรับ! อนุญาตเฉพาะไฟล์เสียง รูปภาพ และไฟล์โปรเจกต์เท่านั้น'));
  }
};

// กำหนดขีดจำกัดขนาดไฟล์ (เช่น สูงสุด 100MB สำหรับ Voicebank/Dataset)
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
  fileFilter: fileFilter
});

// Endpoint: อัปโหลดไฟล์เดี่ยว (Single File)
app.post('/api/upload/single', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'กรุณาเลือกไฟล์ที่ต้องการอัปโหลด' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: 'อัปโหลดไฟล์สำเร็จ',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint: อัปโหลดหลายไฟล์พร้อมกัน (Multiple Files)
app.post('/api/upload/multiple', upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'กรุณาเลือกไฟล์' });
    }

    const uploadedList = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    }));

    res.status(200).json({
      success: true,
      message: `อัปโหลดสำเร็จทั้งหมด ${uploadedList.length} ไฟล์`,
      files: uploadedList
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Middleware จัดการ Error
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'ขนาดไฟล์เกินกำหนด (สูงสุด 100MB)' });
    }
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`[DELTA SYNTH] Upload Server running on http://localhost:${PORT}`);
});
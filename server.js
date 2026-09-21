/**
 * server.js
 * Root Directory
 * Made And Checked By DELTA SYNTH & Gemini AI
 * Original by Patiphat Wongyai (Delta)
 * Revision: 2.1
 * DELTA SYNTH — RESTful Backend & File Server API
 * Compliant with RESTful Resource-Oriented API Design Principles
 */

import express from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import cors from 'cors';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads');

// Resolve the correct public directory (support both src/public and public)
const publicDir = fs.existsSync(path.join(__dirname, 'src', 'public'))
  ? path.join(__dirname, 'src', 'public')
  : path.join(__dirname, 'public');

// Global Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));
app.use('/uploads', express.static(uploadDir));

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer Storage Engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${safeName}`);
  }
});

// File validation filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(wav|mp3|ogg|flac|png|jpg|jpeg|webp|zip|rar|7z|ust|ustx|vsqx|svp|mid|midi)$/i;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: Audio, Images, Project Archives (ZIP/7Z/RAR), USTX/VSQX/SVP/MIDI.'));
  }
};

// Upload Limits (100MB per file)
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: fileFilter
});

// ============================================================================
// RESTful API v1 Endpoints (Following backend-development-api-design-principles)
// ============================================================================

// 1. Health check & system status
const healthHandler = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      service: 'delta-synth-api',
      version: '2.1.0',
      domain: 'delta-synth-studio-th.com',
      timestamp: new Date().toISOString()
    }
  });
};
app.get(['/api/v1/health', '/health', '/healthz'], healthHandler);
app.head(['/health', '/healthz'], (_req, res) => res.status(200).end());

// 2. Resource: Voicebanks Collection
app.get('/api/v1/voicebanks', (req, res) => {
  try {
    const catalogPath = path.join(publicDir, 'voicebanks_catalog.json');
    if (fs.existsSync(catalogPath)) {
      const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
      const keys = Object.keys(catalogData);
      
      const { search, language } = req.query;
      let filteredKeys = keys;
      
      if (search) {
        const query = String(search).toLowerCase();
        filteredKeys = filteredKeys.filter(k => k.toLowerCase().includes(query));
      }
      
      const results = filteredKeys.map(key => ({
        id: key,
        packagesCount: catalogData[key]?.length || 0,
        packages: catalogData[key] || []
      }));
      
      res.status(200).json({
        success: true,
        data: {
          total: results.length,
          voicebanks: results
        }
      });
    } else {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Voicebank catalog not found on server.' }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

// 3. Resource: Single Voicebank Member
app.get('/api/v1/voicebanks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const catalogPath = path.join(publicDir, 'voicebanks_catalog.json');
    if (fs.existsSync(catalogPath)) {
      const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
      const voicebank = catalogData[id.toLowerCase()];
      if (voicebank) {
        return res.status(200).json({
          success: true,
          data: {
            id: id.toLowerCase(),
            packagesCount: voicebank.length,
            packages: voicebank
          }
        });
      }
      return res.status(404).json({
        success: false,
        error: { code: 'VOICEBANK_NOT_FOUND', message: `Voicebank '${id}' does not exist.` }
      });
    }
    res.status(404).json({
      success: false,
      error: { code: 'CATALOG_NOT_FOUND', message: 'Voicebank catalog file missing.' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

// 4. Resource: Single Upload
app.post('/api/v1/uploads/single', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FILE', message: 'No file uploaded. Please provide a file.' }
      });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(201).json({
      success: true,
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'UPLOAD_FAILED', message: error.message }
    });
  }
});

// 5. Resource: Batch Upload
app.post('/api/v1/uploads/multiple', upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FILES', message: 'No files uploaded.' }
      });
    }

    const uploadedList = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    }));

    res.status(201).json({
      success: true,
      data: {
        count: uploadedList.length,
        files: uploadedList
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'UPLOAD_FAILED', message: error.message }
    });
  }
});

// ============================================================================
// Backward Compatibility Endpoints
// ============================================================================
app.post('/api/upload/single', upload.single('file'), (req, res) => {
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
});

app.post('/api/upload/multiple', upload.array('files', 10), (req, res) => {
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
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: { code: 'FILE_TOO_LARGE', message: 'File size exceeds limit of 100MB.' }
      });
    }
    return res.status(400).json({
      success: false,
      error: { code: err.code, message: err.message }
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      error: { code: 'BAD_REQUEST', message: err.message }
    });
  }
  next();
});

// Fallback to index.html for SPA/Static routing (Express 5 compatible)
app.use((req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Not Found');
  }
});

const server = app.listen(PORT, () => {
  console.log(`[DELTA SYNTH] RESTful Server running on http://localhost:${PORT}`);
  console.log(`[DELTA SYNTH] Serving static content from: ${publicDir}`);
});

let isShuttingDown = false;
function gracefulShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`[DELTA SYNTH] ${signal} received: closing server gracefully`);
  server.close(() => {
    console.log('[DELTA SYNTH] Server closed cleanly');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

export { app, server };
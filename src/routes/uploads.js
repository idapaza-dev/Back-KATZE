const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) return cb(new Error('Tipo no permitido'));
    cb(null, true);
  }
});

// POST /api/v1/uploads (admin)
router.post('/', authenticate, authorize('admin'), upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Archivo requerido' });
  const fileUrl = `${process.env.SERVER_URL || ''}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, filename: req.file.filename, size: req.file.size });
});

module.exports = router;
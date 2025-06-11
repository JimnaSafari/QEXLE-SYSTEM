import express from 'express';
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  downloadDocument,
  updateDocument,
  deleteDocument
} from '../controllers/document.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import multer from 'multer';
import path from 'path';

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

const router = express.Router();

// All routes are protected
router.use(protect);

// Document routes
router.route('/')
  .get(getDocuments)
  .post(authorize(['admin', 'attorney', 'paralegal']), upload.single('file'), uploadDocument);

router.route('/:id')
  .get(getDocumentById)
  .put(authorize(['admin', 'attorney']), updateDocument)
  .delete(authorize(['admin']), deleteDocument);

router.get('/:id/download', downloadDocument);

export default router; 
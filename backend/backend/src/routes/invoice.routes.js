import express from 'express';
import { body } from 'express-validator';
import {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  generatePDF
} from '../controllers/invoice.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Validation middleware
const invoiceValidation = [
  body('clientId').isUUID().withMessage('Valid client ID is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.description').notEmpty().withMessage('Item description is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.unitPrice').isFloat({ min: 0 }).withMessage('Unit price must be positive'),
  body('notes').optional().isString(),
  body('terms').optional().isString()
];

// Routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'attorney'),
  invoiceValidation,
  createInvoice
);

router.get(
  '/',
  authenticate,
  getInvoices
);

router.get(
  '/:id',
  authenticate,
  getInvoice
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'attorney'),
  invoiceValidation,
  updateInvoice
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  deleteInvoice
);

router.get(
  '/:id/pdf',
  authenticate,
  generatePDF
);

export default router; 
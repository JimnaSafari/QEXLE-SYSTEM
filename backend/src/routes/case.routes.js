import express from 'express';
import {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
  getCaseStats
} from '../controllers/case.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Case routes
router.route('/')
  .get(getCases)
  .post(authorize(['admin', 'attorney']), createCase);

router.route('/stats')
  .get(getCaseStats);

router.route('/:id')
  .get(getCaseById)
  .put(authorize(['admin', 'attorney']), updateCase)
  .delete(authorize(['admin']), deleteCase);

export default router; 
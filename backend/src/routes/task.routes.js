import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats
} from '../controllers/task.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Task routes
router.route('/')
  .get(getTasks)
  .post(authorize(['admin', 'attorney', 'paralegal']), createTask);

router.route('/stats')
  .get(getTaskStats);

router.route('/:id')
  .get(getTaskById)
  .put(authorize(['admin', 'attorney', 'paralegal']), updateTask)
  .delete(authorize(['admin', 'attorney']), deleteTask);

export default router; 
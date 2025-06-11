import express from 'express';
import authRoutes from './auth.routes.js';
import caseRoutes from './case.routes.js';
import documentRoutes from './document.routes.js';
import taskRoutes from './task.routes.js';

const router = express.Router();

// API routes
router.use('/auth', authRoutes);
router.use('/cases', caseRoutes);
router.use('/documents', documentRoutes);
router.use('/tasks', taskRoutes);

export default router; 
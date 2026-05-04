import express from 'express';
import { getDashboardStats } from '../controllers/admin.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/dashboard', protect, isAdmin, getDashboardStats);

export default router;

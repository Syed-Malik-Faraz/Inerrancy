import express from 'express';
import { createInquiry, getInquiries, updateInquiryStatus } from '../controllers/contact.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route to submit an inquiry
router.post('/', createInquiry);

// Admin-only routes
router.get('/admin', protect, isAdmin, getInquiries);
router.put('/admin/:id/status', protect, isAdmin, updateInquiryStatus);

export default router;

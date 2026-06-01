import express from 'express';
import { protect, isAdmin } from '../middleware/auth.middleware.js';
import {
  getNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
} from '../controllers/notification.controller.js';

const router = express.Router();

router.use(protect, isAdmin);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/mark-all-read', markAllRead);
router.put('/:id/read', markRead);

export default router;

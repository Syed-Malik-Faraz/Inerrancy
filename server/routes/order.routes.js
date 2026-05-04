import express from 'express';
import {
  createOrder, getMyOrders, getOrderById,
  getAllOrders, updateOrderStatus, cancelOrder,
} from '../controllers/order.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin
router.get('/', protect, isAdmin, getAllOrders);
router.put('/:id/status', protect, isAdmin, updateOrderStatus);
router.post('/:id/cancel', protect, cancelOrder);

export default router;

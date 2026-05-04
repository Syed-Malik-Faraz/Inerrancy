import express from 'express';
import {
  createCoupon, getAllCoupons, updateCoupon, deleteCoupon, validateCoupon,
} from '../controllers/coupon.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/validate', protect, validateCoupon);
router.get('/', protect, isAdmin, getAllCoupons);
router.post('/', protect, isAdmin, createCoupon);
router.put('/:id', protect, isAdmin, updateCoupon);
router.delete('/:id', protect, isAdmin, deleteCoupon);

export default router;

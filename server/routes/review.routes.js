import express from 'express';
import {
  getProductReviews, addReview, getAllReviews, deleteReview, approveReview,
} from '../controllers/review.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, isAdmin, getAllReviews);
router.get('/all', protect, isAdmin, getAllReviews);
router.get('/:productId', getProductReviews);
router.post('/:productId', protect, addReview);
router.delete('/:id', protect, isAdmin, deleteReview);
router.put('/:id/approve', protect, isAdmin, approveReview);

export default router;

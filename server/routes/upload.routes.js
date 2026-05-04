import express from 'express';
import { uploadImage, uploadMultipleImages } from '../controllers/upload.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const router = express.Router();

router.post('/', protect, isAdmin, upload.single('image'), uploadImage);
router.post('/multiple', protect, isAdmin, upload.array('images', 10), uploadMultipleImages);

export default router;

import express from 'express';
import {
  getProducts, getProductById, createProduct, updateProduct,
  deleteProduct, uploadProductImages, deleteProductImage, getBrands,
} from '../controllers/product.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/brands', getBrands);
router.get('/:id', getProductById);

// Admin
router.post('/', protect, isAdmin, createProduct);
router.put('/:id', protect, isAdmin, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);
router.post('/:id/images', protect, isAdmin, upload.array('images', 10), uploadProductImages);
router.delete('/:id/images', protect, isAdmin, deleteProductImage);

export default router;

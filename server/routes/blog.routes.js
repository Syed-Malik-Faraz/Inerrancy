import express from 'express';
import {
  getBlogs, getAllBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog,
} from '../controllers/blog.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/admin', protect, isAdmin, getAllBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', protect, isAdmin, createBlog);
router.put('/:id', protect, isAdmin, updateBlog);
router.delete('/:id', protect, isAdmin, deleteBlog);

export default router;

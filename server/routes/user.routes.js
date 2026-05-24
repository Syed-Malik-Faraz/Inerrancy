import express from 'express';
import {
  getAllUsers, getUserById, updateProfile, changePassword,
  uploadAvatar, addAddress, updateAddress, deleteAddress,
  toggleWishlist, getWishlist, updateUserRole, deleteUser,
} from '../controllers/user.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const router = express.Router();

// ─── Specific user routes (must come BEFORE wildcard /:id routes) ────────────
// These paths would otherwise be matched by GET /:id or DELETE /:id first.

router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/address', protect, addAddress);
router.put('/address/:addressId', protect, updateAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.get('/wishlist', protect, getWishlist);
router.put('/wishlist/:productId', protect, toggleWishlist);

// ─── Admin wildcard routes (come LAST to avoid shadowing specific routes) ─────
router.get('/', protect, isAdmin, getAllUsers);
router.get('/:id', protect, isAdmin, getUserById);
router.put('/:id/role', protect, isAdmin, updateUserRole);
router.delete('/:id', protect, isAdmin, deleteUser);

export default router;

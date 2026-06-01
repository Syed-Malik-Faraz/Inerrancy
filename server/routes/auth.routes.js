import express from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  sendOtp,
  forgotPassword,
  resetPassword,
  googleAuth,
} from '../controllers/auth.controller.js';
import { optionalProtect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', optionalProtect, logout);
router.post('/refresh-token', refreshToken);
router.get('/me', optionalProtect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google', googleAuth);

export default router;

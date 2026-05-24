import express from 'express';
import { register, login, logout, refreshToken, getMe, sendOtp } from '../controllers/auth.controller.js';
import { protect, optionalProtect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', optionalProtect, logout); // optionalProtect so logout works even with an expired access token
router.post('/refresh-token', refreshToken);
router.get('/me', optionalProtect, getMe);

export default router;

import User from '../models/User.model.js';
import OTP from '../models/OTP.model.js';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken, setTokenCookies, clearTokenCookies } from '../utils/tokens.js';
import { sendWelcomeEmail } from '../config/mailer.js';

// POST /api/auth/send-otp
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Clean existing OTPs
    await OTP.deleteMany({ phone });

    // Store OTP in database (TTL 5 mins auto-expiry)
    await OTP.create({ phone, otp });

    // Log the OTP beautifully to the server console log
    console.log('\n🏺 =============================================');
    console.log(`🏺 [OTP SERVICE] Code for phone ${phone}:`);
    console.log(`🏺 🔑 OTP: ${otp}`);
    console.log('🏺 =============================================\n');

    res.status(200).json({ success: true, message: 'Identity transmission initialized' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, otp } = req.body;
    if (!name || !email || !phone || !password || !otp)
      return res.status(400).json({ success: false, message: 'All fields are mandatory, including verification' });

    // Verify OTP first
    const record = await OTP.findOne({ phone, otp });
    if (!record) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification key' });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ success: false, message: 'Email already registered' });

    // Consume (delete) the OTP after verification
    await OTP.deleteMany({ phone });

    // Create user with phone
    const user = await User.create({ name, email, phone, password });
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    setTokenCookies(res, accessToken, refreshToken);

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ to: email, name }).catch(console.error);

    res.status(201).json({ success: true, user, accessToken });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    setTokenCookies(res, accessToken, refreshToken);

    res.json({ success: true, user, accessToken });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });
    }
    clearTokenCookies(res);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/refresh-token
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(200).json({ success: false, message: 'No refresh token' });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token)
      return res.status(200).json({ success: false, message: 'Invalid refresh token' });

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    await user.save();
    setTokenCookies(res, newAccessToken, newRefreshToken);

    res.json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    res.status(200).json({ success: false, message: 'Refresh token expired' });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

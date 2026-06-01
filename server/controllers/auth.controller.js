import User from '../models/User.model.js';
import OTP from '../models/OTP.model.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { generateAccessToken, generateRefreshToken, setTokenCookies, clearTokenCookies } from '../utils/tokens.js';
import { sendWelcomeEmail, sendOtpEmail, sendPasswordResetEmail } from '../config/mailer.js';
import Notification from '../models/Notification.model.js';

// POST /api/auth/send-otp  (registration OTP sent to email)
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({ email: email.toLowerCase().trim() });
    await OTP.create({ email: email.toLowerCase().trim(), otp });

    console.log(`\n🏺 [OTP] Code for ${email}: ${otp}\n`);

    sendOtpEmail({ to: email, otp }).catch((err) =>
      console.error('🏺 [OTP EMAIL] Failed:', err.message)
    );

    res.status(200).json({ success: true, message: 'Verification code sent to your email' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    if (!name || !email || !password || !otp)
      return res.status(400).json({ success: false, message: 'All fields are required including the verification code' });

    // Verify OTP
    const record = await OTP.findOne({ email: email.toLowerCase().trim(), otp });
    if (!record)
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });

    const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (emailExists)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    await OTP.deleteMany({ email: email.toLowerCase().trim() });

    const user = await User.create({ name, email, password });
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    setTokenCookies(res, accessToken, refreshToken);

    sendWelcomeEmail({ to: email, name }).catch(console.error);

    Notification.create({
      type: 'new_user',
      title: 'New User Registered',
      message: `${name} (${email}) just created an account`,
      data: { userId: user._id, userName: name, userEmail: email },
    }).catch(console.error);

    res.status(201).json({ success: true, user, accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/forgot-password  (send reset OTP to registered email)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return res.status(404).json({ success: false, message: 'No account found with this email' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({ email: email.toLowerCase().trim() });
    await OTP.create({ email: email.toLowerCase().trim(), otp });

    console.log(`\n🏺 [RESET OTP] Code for ${email}: ${otp}\n`);

    try {
      await sendPasswordResetEmail({ to: email, otp });
    } catch (emailErr) {
      console.error('\n❌ [RESET EMAIL] Failed to send to', email, ':', emailErr.message, '\n');
      return res.status(500).json({ success: false, message: `Email delivery failed: ${emailErr.message}` });
    }

    res.status(200).json({ success: true, message: 'Password reset code sent to your email' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/reset-password  (verify OTP + set new password)
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ success: false, message: 'Email, OTP, and new password are all required' });

    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const record = await OTP.findOne({ email: email.toLowerCase().trim(), otp });
    if (!record)
      return res.status(400).json({ success: false, message: 'Invalid or expired reset code' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    await OTP.deleteMany({ email: email.toLowerCase().trim() });

    user.password = newPassword; // pre-save hook hashes it
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully. You can now sign in.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/google  (sign in or register with Google)
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(400).json({ success: false, message: 'Google token is required' });

    // Verify the Google access token and retrieve user info
    const googleRes = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`);
    if (!googleRes.ok)
      return res.status(401).json({ success: false, message: 'Invalid Google token' });

    const { email, name, picture } = await googleRes.json();
    if (!email)
      return res.status(401).json({ success: false, message: 'Could not retrieve email from Google' });

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // New user — create account with a random password they won't use
      const randomPassword = crypto.randomBytes(32).toString('hex');
      user = await User.create({
        name,
        email: email.toLowerCase(),
        password: randomPassword,
        avatar: picture || '',
      });
      sendWelcomeEmail({ to: email, name }).catch(console.error);
      Notification.create({
        type: 'new_user',
        title: 'New User Registered',
        message: `${name} (${email}) just created an account via Google`,
        data: { userId: user._id, userName: name, userEmail: email },
      }).catch(console.error);
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    setTokenCookies(res, accessToken, refreshToken);

    res.status(200).json({ success: true, user, accessToken, refreshToken });
  } catch (err) {
    console.error('🏺 [GOOGLE AUTH]', err.message);
    res.status(401).json({ success: false, message: 'Google authentication failed' });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const accessToken = generateAccessToken(user._id);
    const refreshTokenVal = generateRefreshToken(user._id);
    user.refreshToken = refreshTokenVal;
    await user.save();
    setTokenCookies(res, accessToken, refreshTokenVal);

    console.log('🔐 [LOGIN] stored RT in DB (len):', refreshTokenVal.length);
    res.json({ success: true, user, accessToken, refreshToken: refreshTokenVal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });
    } else {
      const rt = req.cookies?.refreshToken || req.body?.refreshToken;
      if (rt) {
        try {
          const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
          const decoded = jwt.verify(rt, REFRESH_SECRET);
          await User.findByIdAndUpdate(decoded.id, { refreshToken: '' });
        } catch {
          // RT invalid or already expired
        }
      }
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
    const bodyToken = req.body?.refreshToken;
    const cookieToken = req.cookies?.refreshToken;
    const token = bodyToken || cookieToken;

    console.log('🔄 [REFRESH] bodyToken:', !!bodyToken, 'cookieToken:', !!cookieToken, 'token:', token ? 'present' : 'missing');
    if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });

    const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
    const decoded = jwt.verify(token, REFRESH_SECRET);
    console.log('🔄 [REFRESH] decoded id:', decoded.id);

    const user = await User.findById(decoded.id);
    console.log('🔄 [REFRESH] user found:', !!user, '| stored RT length:', user?.refreshToken?.length, '| incoming RT length:', token?.length);
    console.log('🔄 [REFRESH] tokens match:', user?.refreshToken === token);

    if (!user || user.refreshToken !== token)
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    await user.save();
    setTokenCookies(res, newAccessToken, newRefreshToken);

    console.log('🔄 [REFRESH] success, new AT issued');
    res.json({ success: true, accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error('🔄 [REFRESH] error:', err.message);
    return res.status(401).json({ success: false, message: 'Refresh token expired' });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user || null });
};

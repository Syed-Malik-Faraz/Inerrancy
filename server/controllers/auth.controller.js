import User from '../models/User.model.js';
import OTP from '../models/OTP.model.js';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken, setTokenCookies, clearTokenCookies } from '../utils/tokens.js';
import { sendWelcomeEmail, sendOtpEmail } from '../config/mailer.js';

// POST /api/auth/send-otp
export const sendOtp = async (req, res) => {
  try {
    const { phone, email } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone number is required' });
    if (!email) return res.status(400).json({ success: false, message: 'Email is required to send the OTP' });

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Clean existing OTPs for this phone
    await OTP.deleteMany({ phone });

    // Store OTP in database (auto-expires in 5 mins via TTL index)
    await OTP.create({ phone, otp });

    // Always log to console for dev visibility
    console.log('\n🏺 =============================================');
    console.log(`🏺 [OTP SERVICE] Code for ${email} / ${phone}:`);
    console.log(`🏺 🔑 OTP: ${otp}`);
    console.log('🏺 =============================================\n');

    // Send OTP to user's email (non-blocking — order/flow continues even if SMTP fails)
    sendOtpEmail({ to: email, otp }).catch((err) =>
      console.error('🏺 [OTP EMAIL] Failed to send:', err.message)
    );

    res.status(200).json({ success: true, message: 'Verification code sent to your email' });
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

    res.status(201).json({ success: true, user, accessToken, refreshToken });
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

    // Normalize to lowercase — the schema stores emails lowercase, so a case mismatch
    // (e.g. "User@Test.com" vs "user@test.com") would cause findOne to return null.
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
    // Case 1: access token was valid — optionalProtect populated req.user
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });
    } else {
      // Case 2: access token is expired/missing — use the refresh token
      // (httpOnly cookie or body) to identify the user and clear their RT.
      const rt = req.cookies?.refreshToken || req.body?.refreshToken;
      if (rt) {
        try {
          const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
          const decoded = jwt.verify(rt, REFRESH_SECRET);
          await User.findByIdAndUpdate(decoded.id, { refreshToken: '' });
        } catch {
          // RT is invalid or already expired — nothing to clear in DB
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
    // Body token takes priority — it's the token explicitly stored in localStorage
    // during the last successful login (always in sync with the DB). The httpOnly
    // cookie may be from an older session whose login was interrupted (e.g. nodemon
    // restart), leaving the browser with a stale cookie that doesn't match the DB.
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
  // Explicitly return null (not undefined) so the frontend always gets
  // a defined value and can safely do setUser(res.data.user).
  res.json({ success: true, user: req.user || null });
};

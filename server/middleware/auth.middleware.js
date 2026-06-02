import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const protect = async (req, res, next) => {
  try {
    // Header token takes priority over cookie — the Authorization header is
    // explicitly set by the axios request interceptor from the in-memory /
    // localStorage token (always current). The cookie may be stale from an
    // older session whose Set-Cookie the browser retained past a server restart.
    const headerToken = req.headers.authorization?.replace('Bearer ', '');
    const cookieToken = req.cookies?.accessToken;
    const token = headerToken || cookieToken;

    if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });

    const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};


export const optionalProtect = async (req, res, next) => {
  try {
    // Same priority as protect — header first, cookie fallback.
    const headerToken = req.headers.authorization?.replace('Bearer ', '');
    const cookieToken = req.cookies?.accessToken;
    const token = headerToken || cookieToken;
    if (token) {
      const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
      const decoded = jwt.verify(token, ACCESS_SECRET);
      req.user = await User.findById(decoded.id).select('-password -refreshToken');
    }
    next();
  } catch (err) {
    next(); // Token invalid/expired — continue as unauthenticated
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access only' });
  }
  next();
};

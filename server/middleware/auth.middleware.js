import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });

    const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    next();
  } catch (err) {
    // Some clients may surface this as 403; keep it consistent as 401 so front-end can handle refresh.
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};


export const optionalProtect = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
      const decoded = jwt.verify(token, ACCESS_SECRET);
      req.user = await User.findById(decoded.id).select('-password -refreshToken');
    }
    next();
  } catch (err) {
    next();
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access only' });
  }
  next();
};

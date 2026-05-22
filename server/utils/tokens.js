import jwt from 'jsonwebtoken';

// NOTE: if env secrets are missing, tokens can't be verified (protect will fail).
// We fall back to development-safe defaults to prevent 403/401 loops.
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';

export const generateAccessToken = (id) =>
  jwt.sign({ id }, ACCESS_SECRET, { expiresIn: '15m' });

export const generateRefreshToken = (id) =>
  jwt.sign({ id }, REFRESH_SECRET, { expiresIn: '7d' });

export const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';
  // In development (localhost), don't set secure to allow cross-port cookies
  const secure = isProd;
  // For development with cross-port, use 'none'. For production with HTTPS, use 'none'.
  const sameSite = 'none';

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    maxAge: 15 * 60 * 1000, // 15m
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });

};

export const clearTokenCookies = (res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};

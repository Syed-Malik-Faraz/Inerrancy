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
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // allow frontend on localhost:<vitePort> to receive cookie on http requests
    // (Set-Cookie will still be gated by sameSite/secure, but this avoids host mismatch)
    // Note: domain intentionally omitted.

    maxAge: 15 * 60 * 1000, // 15m
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });

};

export const clearTokenCookies = (res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};

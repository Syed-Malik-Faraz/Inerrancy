import jwt from 'jsonwebtoken';

// IMPORTANT: Do NOT read process.env secrets at module level.
// In ES modules all imports are hoisted and executed BEFORE the module body runs,
// so dotenv.config() in index.js hasn't fired yet when this file is first evaluated.
// Reading secrets here would always capture 'undefined' → fallback to the dev defaults,
// causing a secret mismatch: tokens signed with 'dev_access_secret' but verified
// with the real secret → every authenticated request returns 401.
// Reading inside the function body ensures we get the correct value at call time
// (after dotenv.config() has run).

export const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_ACCESS_SECRET || 'dev_access_secret', { expiresIn: '1h' });

export const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret', { expiresIn: '7d' });

export const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';
  const secure = isProd;

  // Browsers require: SameSite=None cookies must also be Secure.
  // So in dev (secure=false) we must NOT use SameSite=None.
  const sameSite = secure ? 'none' : 'lax';

  // Access token is readable (not httpOnly) so JS can use it in Authorization header
  res.cookie('accessToken', accessToken, {
    httpOnly: false, // readable by JS for auth header
    secure,
    sameSite,
    path: '/',
    maxAge: 60 * 60 * 1000, // 1h
  });

  // Refresh token: httpOnly for security (server-only) + non-httpOnly copy so JS can read it
  // for use in the refresh-token request body when cookies fail to forward
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });

  res.cookie('refreshTokenJS', refreshToken, {
    httpOnly: false,
    secure,
    sameSite,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });
};

export const clearTokenCookies = (res) => {
  const isProd = process.env.NODE_ENV === 'production';
  const secure = isProd;
  const sameSite = secure ? 'none' : 'lax';

  res.clearCookie('accessToken', { path: '/', sameSite, secure });
  res.clearCookie('refreshToken', { path: '/', sameSite, secure });
  res.clearCookie('refreshTokenJS', { path: '/', sameSite, secure });
};
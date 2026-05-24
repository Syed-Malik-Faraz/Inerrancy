// Standalone token store — no imports to avoid circular dependency cycles
let accessTokenRef = null;
let refreshTokenRef = null;

export const setAccessToken = (token) => {
  accessTokenRef = token;
  if (token) {
    localStorage.setItem('accessToken', token);
    document.cookie = `accessToken=${encodeURIComponent(token)}; path=/; max-age=${60 * 60}`;
  } else {
    localStorage.removeItem('accessToken');
    document.cookie = 'accessToken=; Max-Age=0; path=/';
  }
};

export const getAccessToken = () => accessTokenRef;

export const setRefreshToken = (token) => {
  refreshTokenRef = token;
  if (token) {
    localStorage.setItem('refreshToken', token);
    // Use 'refreshTokenJS' to match the server's non-httpOnly cookie name and
    // avoid conflicting with the server's httpOnly 'refreshToken' cookie.
    document.cookie = `refreshTokenJS=${encodeURIComponent(token)}; path=/; max-age=${7 * 24 * 60 * 60}`;
  } else {
    localStorage.removeItem('refreshToken');
    document.cookie = 'refreshTokenJS=; Max-Age=0; path=/';
  }
};

export const getRefreshToken = () => refreshTokenRef;

// Initialize tokens from localStorage or cookies on app startup.
// Called once when axios.js loads — ensures both tokens are in memory
// before any interceptor fires.
export const initializeToken = () => {
  // ── Access token ──────────────────────────────────────────────────────
  let savedToken = localStorage.getItem('accessToken');
  if (savedToken && savedToken !== 'undefined') {
    accessTokenRef = savedToken;
  } else {
    // Fallback: readable accessToken cookie set by the server
    const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
    const cookieToken = match ? decodeURIComponent(match[1]) : null;
    if (cookieToken && cookieToken !== 'undefined') {
      accessTokenRef = cookieToken;
      localStorage.setItem('accessToken', cookieToken);
      savedToken = cookieToken;
    }
  }

  // ── Refresh token ─────────────────────────────────────────────────────
  let savedRT = localStorage.getItem('refreshToken');
  if (!savedRT || savedRT === 'undefined') {
    // Fallback: readable refreshTokenJS cookie set by the server
    const rtMatch = document.cookie.match(/(?:^|;\s*)refreshTokenJS=([^;]*)/);
    const cookieRT = rtMatch ? decodeURIComponent(rtMatch[1]) : null;
    if (cookieRT && cookieRT !== 'undefined') {
      savedRT = cookieRT;
      localStorage.setItem('refreshToken', cookieRT);
    }
  }
  refreshTokenRef = (savedRT && savedRT !== 'undefined') ? savedRT : null;

  return savedToken || null;
};

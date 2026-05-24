import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios.js';
import toast from 'react-hot-toast';
import { setAccessToken, setRefreshToken, getRefreshToken } from './tokenStore.js';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');

      if (res.data.user) {
        // Access token is valid — user is authenticated.
        setUser(res.data.user);
      } else {
        // /me returned no user. This means either:
        //   (a) the user is not logged in (no tokens), or
        //   (b) the access token is expired / was signed with a stale secret.
        // If we have a refresh token, try to get a fresh access token now
        // (before any other component like CartContext makes a protected request
        // and hits a 401 mid-render).
        const rt = getRefreshToken() || localStorage.getItem('refreshToken');
        if (rt) {
          try {
            const refreshRes = await api.post('/auth/refresh-token', { refreshToken: rt });
            setAccessToken(refreshRes.data.accessToken);
            setRefreshToken(refreshRes.data.refreshToken);
            // Retry /me with the fresh access token now in memory.
            const res2 = await api.get('/auth/me');
            setUser(res2.data.user || null);
          } catch {
            // Refresh failed — tokens are stale, mismatched, or revoked.
            // Clear everything so the app starts from a clean logged-out state.
            setAccessToken(null);
            setRefreshToken(null);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  // When the axios interceptor gives up on refreshing (both tokens gone),
  // clear user state so the UI reflects the logged-out reality.
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
    };
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      setAccessToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      throw err;
    }
  };

  const register = async (name, email, password, phone, otp) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, phone, otp });
      setAccessToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAdmin, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};
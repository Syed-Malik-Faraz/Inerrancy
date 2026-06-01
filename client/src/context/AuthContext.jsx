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
        setUser(res.data.user);
      } else {
        const rt = getRefreshToken() || localStorage.getItem('refreshToken');
        if (rt) {
          try {
            const refreshRes = await api.post('/auth/refresh-token', { refreshToken: rt });
            setAccessToken(refreshRes.data.accessToken);
            setRefreshToken(refreshRes.data.refreshToken);
            const res2 = await api.get('/auth/me');
            setUser(res2.data.user || null);
          } catch {
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

  useEffect(() => {
    const handleSessionExpired = () => setUser(null);
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

  // otp is sent to email; phone field removed
  const register = async (name, email, password, otp) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, otp });
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

  // token is the Google OAuth access_token from useGoogleLogin
  const googleLogin = async (token) => {
    try {
      const res = await api.post('/auth/google', { token });
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
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, updateUser, isAdmin, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};

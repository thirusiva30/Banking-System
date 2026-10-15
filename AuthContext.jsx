import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);
const INACTIVITY_MS = 15 * 60 * 1000; // auto logout after 15 minutes idle

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const timer = useRef(null);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  // Restore session on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [logout]);

  // Inactivity timer
  useEffect(() => {
    if (!user) return undefined;
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    const reset = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(logout, INACTIVITY_MS);
    };
    events.forEach((e) => window.addEventListener(e, reset));
    reset();
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      clearTimeout(timer.current);
    };
  }, [user, logout]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

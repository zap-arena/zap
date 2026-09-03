import { useState, useEffect } from 'react';
import type { User } from '../types';
import { api, ApiError, getToken, setToken } from '../lib/api';

let _user: User | null = null;
let _initialized = false;
const listeners: Set<() => void> = new Set();
const notify = () => listeners.forEach(fn => fn());

async function loadCurrentUser() {
  if (!getToken()) { _initialized = true; notify(); return; }
  try {
    _user = await api.get<User>('/auth/me');
  } catch {
    setToken(null);
    _user = null;
  } finally {
    _initialized = true;
    notify();
  }
}
void loadCurrentUser();

export const authStore = {
  getUser: () => _user,
  isInitialized: () => _initialized,
  setUser: (user: User | null) => { _user = user; notify(); },
  subscribe: (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; },
  login: async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
      setToken(res.token);
      _user = res.user;
      notify();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof ApiError ? err.message : 'Login failed' };
    }
  },
  register: async (name: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await api.post<{ token: string; user: User }>('/auth/register', { name, email, password });
      setToken(res.token);
      _user = res.user;
      notify();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof ApiError ? err.message : 'Registration failed' };
    }
  },
  logout: () => { setToken(null); _user = null; notify(); },
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(authStore.getUser());
  useEffect(() => authStore.subscribe(() => setUser(authStore.getUser())), []);
  return { user, login: authStore.login, register: authStore.register, logout: authStore.logout };
};

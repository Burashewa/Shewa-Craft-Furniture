import { api } from './api';
import { clearAllSessions, getAccessToken, writeSession } from './session';

export const DEMO_CREDENTIALS = [
  {
    email: 'customer@shewacraft.com',
    password: 'Customer123!',
    role: 'customer',
  },
  {
    email: 'admin@shewacraft.com',
    password: 'Admin123!',
    role: 'admin',
  },
];

export function validatePassword(password) {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must include at least one letter and one number';
  }
  return null;
}

export function validateEmail(email) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'Enter a valid email address';
  }
  return null;
}

function storeAuth({ user, token }, remember = false) {
  writeSession(token, remember);
  return user;
}

export async function getCurrentUser() {
  if (!getAccessToken()) return null;

  try {
    const data = await api('/api/auth/me', { auth: true });
    return data.user;
  } catch {
    return null;
  }
}

export async function signUp({ fullName, email, password }) {
  const data = await api('/api/auth/register', {
    method: 'POST',
    body: { fullName, email, password },
  });
  return storeAuth(data, false);
}

export async function signIn({ email, password, remember = false }) {
  const data = await api('/api/auth/login', {
    method: 'POST',
    body: { email, password, remember },
  });
  return storeAuth(data, remember);
}

export async function signOut() {
  try {
    if (getAccessToken()) {
      await api('/api/auth/logout', { method: 'POST', auth: true });
    }
  } catch {
    // Token is discarded locally either way.
  } finally {
    clearAllSessions();
  }
}

export async function forgotPassword(email) {
  return api('/api/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });
}

export async function resetPassword({ token, password }) {
  return api('/api/auth/reset-password', {
    method: 'POST',
    body: { token, password },
  });
}

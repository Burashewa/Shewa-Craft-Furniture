const USERS_KEY = 'shewacraft_users';
const SESSION_KEY = 'shewacraft_session';
const SESSION_MS = 8 * 60 * 60 * 1000; // 8 hours (browser session storage)
const REMEMBER_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const DEMO_ACCOUNTS = [
  {
    id: 'demo-customer',
    fullName: 'Demo Customer',
    email: 'customer@shewacraft.com',
    password: 'Customer123!',
    role: 'customer',
  },
  {
    id: 'demo-admin',
    fullName: 'Demo Admin',
    email: 'admin@shewacraft.com',
    password: 'Admin123!',
    role: 'admin',
  },
];

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function bytesToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function createSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return bytesToHex(bytes);
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(digest);
}

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function publicUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
}

function getSessionStorage(remember) {
  return remember ? localStorage : sessionStorage;
}

function clearAllSessions() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
}

function writeSession(session, remember) {
  clearAllSessions();
  getSessionStorage(remember).setItem(SESSION_KEY, JSON.stringify(session));
}

function readSessionRecord() {
  const fromSession = sessionStorage.getItem(SESSION_KEY);
  const fromLocal = localStorage.getItem(SESSION_KEY);
  const raw = fromSession || fromLocal;
  if (!raw) return null;

  try {
    return { session: JSON.parse(raw), remember: Boolean(fromLocal && !fromSession) };
  } catch {
    clearAllSessions();
    return null;
  }
}

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

export async function ensureSeedUsers() {
  const users = readUsers();
  let changed = false;

  for (const demo of DEMO_ACCOUNTS) {
    const existing = users.find((u) => u.email === demo.email);
    if (existing) continue;

    const salt = createSalt();
    const passwordHash = await hashPassword(demo.password, salt);
    users.push({
      id: demo.id,
      fullName: demo.fullName,
      email: demo.email.toLowerCase(),
      role: demo.role,
      salt,
      passwordHash,
      createdAt: new Date().toISOString(),
    });
    changed = true;
  }

  if (changed) writeUsers(users);
}

export async function getCurrentUser() {
  await ensureSeedUsers();
  const record = readSessionRecord();
  if (!record) return null;

  const { session } = record;
  if (!session?.expiresAt || Date.now() > session.expiresAt) {
    clearAllSessions();
    return null;
  }

  const user = readUsers().find((u) => u.id === session.userId);
  if (!user) {
    clearAllSessions();
    return null;
  }

  return publicUser(user);
}

export async function signUp({ fullName, email, password }) {
  await delay();
  await ensureSeedUsers();

  const trimmedName = fullName?.trim();
  const normalizedEmail = email?.trim().toLowerCase();

  if (!trimmedName) {
    throw new Error('Full name is required');
  }

  const emailError = validateEmail(normalizedEmail);
  if (emailError) throw new Error(emailError);

  const passwordError = validatePassword(password);
  if (passwordError) throw new Error(passwordError);

  const users = readUsers();
  if (users.some((u) => u.email === normalizedEmail)) {
    throw new Error('An account with this email already exists');
  }

  const salt = createSalt();
  const passwordHash = await hashPassword(password, salt);
  const user = {
    id: crypto.randomUUID(),
    fullName: trimmedName,
    email: normalizedEmail,
    role: 'customer',
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  writeUsers(users);

  const session = {
    token: crypto.randomUUID(),
    userId: user.id,
    role: user.role,
    expiresAt: Date.now() + SESSION_MS,
  };
  writeSession(session, false);

  return publicUser(user);
}

export async function signIn({ email, password, remember = false }) {
  await delay();
  await ensureSeedUsers();

  const normalizedEmail = email?.trim().toLowerCase();
  const emailError = validateEmail(normalizedEmail);
  if (emailError) throw new Error('Invalid email or password');

  const users = readUsers();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const passwordHash = await hashPassword(password, user.salt);
  if (passwordHash !== user.passwordHash) {
    throw new Error('Invalid email or password');
  }

  const session = {
    token: crypto.randomUUID(),
    userId: user.id,
    role: user.role,
    expiresAt: Date.now() + (remember ? REMEMBER_MS : SESSION_MS),
  };
  writeSession(session, remember);

  return publicUser(user);
}

export function signOut() {
  clearAllSessions();
}

export const DEMO_CREDENTIALS = DEMO_ACCOUNTS.map(({ email, password, role }) => ({
  email,
  password,
  role,
}));

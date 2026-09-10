import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export function validateEmail(email) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
    return 'Enter a valid email address';
  }
  return null;
}

export function validatePassword(password) {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (password.length > 128) {
    return 'Password is too long';
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must include at least one letter and one number';
  }
  return null;
}

export function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function comparePassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

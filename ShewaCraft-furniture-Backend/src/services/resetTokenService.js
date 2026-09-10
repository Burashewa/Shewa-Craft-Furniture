import crypto from 'node:crypto';

export function createResetToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const hashed = hashResetToken(token);
  return { token, hashed };
}

export function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

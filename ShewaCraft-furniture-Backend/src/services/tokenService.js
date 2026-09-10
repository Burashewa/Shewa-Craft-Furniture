import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(userId, { remember = false } = {}) {
  const expiresIn = remember ? env.jwtExpiresInRemember : env.jwtExpiresIn;
  return jwt.sign({ sub: String(userId) }, env.jwtSecret, { expiresIn });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

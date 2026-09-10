import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { hashPassword, validatePassword } from '../services/passwordService.js';

export async function seedAdmin() {
  const email = env.adminEmail.trim().toLowerCase();
  const password = env.adminPassword;

  if (!email || !password) {
    console.warn('[seed] ADMIN_EMAIL / ADMIN_PASSWORD not set; skipping admin seed');
    return;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    console.warn(`[seed] ADMIN_PASSWORD rejected: ${passwordError}`);
    return;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      existing.status = 'active';
      await existing.save();
      console.info(`[seed] Promoted existing user to admin: ${email}`);
    }
    return;
  }

  await User.create({
    fullName: 'Demo Admin',
    email,
    passwordHash: await hashPassword(password),
    role: 'admin',
    status: 'active',
  });
  console.info(`[seed] Created admin user: ${email}`);
}

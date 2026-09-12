import { User, publicUser } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';
import {
  comparePassword,
  hashPassword,
  validateEmail,
  validatePassword,
} from '../services/passwordService.js';
import { signAccessToken } from '../services/tokenService.js';
import { createResetToken, hashResetToken } from '../services/resetTokenService.js';
import { isSmtpConfigured, sendPasswordResetEmail } from '../services/mailService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const RESET_MS = 60 * 60 * 1000;

function authPayload(user, { remember = false } = {}) {
  return {
    user: publicUser(user),
    token: signAccessToken(user._id, { remember }),
  };
}

export const register = asyncHandler(async (req, res) => {
  const fullName = String(req.body?.fullName || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  const fields = {};
  if (!fullName) fields.fullName = 'Full name is required';
  else if (fullName.length > 80) fields.fullName = 'Full name is too long';
  const emailError = validateEmail(email);
  if (emailError) fields.email = emailError;
  const passwordError = validatePassword(password);
  if (passwordError) fields.password = passwordError;

  if (Object.keys(fields).length > 0) {
    throw new AppError(400, Object.values(fields)[0], fields);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError(409, 'An account with this email already exists', {
      email: 'An account with this email already exists',
    });
  }

  const user = await User.create({
    fullName,
    email,
    passwordHash: await hashPassword(password),
    role: 'customer',
  });

  res.status(201).json(authPayload(user));
});

export const login = asyncHandler(async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const remember = Boolean(req.body?.remember);

  const emailError = validateEmail(email);
  if (emailError || !password) {
    throw new AppError(400, emailError || 'Password is required', {
      ...(emailError ? { email: emailError } : {}),
      ...(!password ? { password: 'Password is required' } : {}),
    });
  }

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const match = await comparePassword(password, user.passwordHash);
  if (!match) {
    throw new AppError(401, 'Invalid email or password');
  }

  res.json(authPayload(user, { remember }));
});

export const logout = asyncHandler(async (_req, res) => {
  res.json({ ok: true });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const emailError = validateEmail(email);
  if (emailError) {
    throw new AppError(400, emailError, { email: emailError });
  }

  if (!isSmtpConfigured()) {
    throw new AppError(503, 'Email delivery is not configured');
  }

  const user = await User.findOne({ email });
  if (user) {
    const { token, hashed } = createResetToken();
    user.passwordResetToken = hashed;
    user.passwordResetExpires = new Date(Date.now() + RESET_MS);
    await user.save();

    const resetUrl = `${env.clientUrl}/auth/forgot-password?token=${token}`;
    try {
      await sendPasswordResetEmail({ to: user.email, resetUrl });
    } catch (err) {
      const authFailed =
        err?.code === 'EAUTH' || /invalid login/i.test(String(err?.response || ''));
      throw new AppError(
        502,
        authFailed
          ? 'Unable to send reset email. Check SMTP_USER and use a Gmail App Password for SMTP_PASS.'
          : 'Unable to send reset email'
      );
    }
  }

  res.json({
    ok: true,
    message: 'If an account exists for that email, you can continue to the next step.',
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const token = String(req.body?.token || '');
  const password = String(req.body?.password || '');

  const fields = {};
  if (!token) fields.token = 'Reset token is required';
  const passwordError = validatePassword(password);
  if (passwordError) fields.password = passwordError;
  if (Object.keys(fields).length > 0) {
    throw new AppError(400, Object.values(fields)[0], fields);
  }

  const hashed = hashResetToken(token);
  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetExpires +passwordHash');

  if (!user) {
    throw new AppError(400, 'Invalid or expired reset token');
  }

  user.passwordHash = await hashPassword(password);
  user.passwordResetToken = '';
  user.passwordResetExpires = null;
  await user.save();

  res.json({ ok: true });
});

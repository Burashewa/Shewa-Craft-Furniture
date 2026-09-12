import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export function isSmtpConfigured() {
  return Boolean(env.smtpUser && env.smtpPass);
}

function mailFrom() {
  const from = env.mailFrom;
  if (!from) return `ShewaCraft <${env.smtpUser}>`;
  if (from.includes('@')) return from;
  return `${from} <${env.smtpUser}>`;
}

function getTransport() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });
}

export async function sendPasswordResetEmail({ to, resetUrl }) {
  const transport = getTransport();
  await transport.sendMail({
    from: mailFrom(),
    to,
    subject: 'Reset your ShewaCraft password',
    text: [
      'We received a request to reset the password for your ShewaCraft account.',
      '',
      'Open this link to choose a new password (expires in 1 hour):',
      resetUrl,
      '',
      'If you did not request this, you can ignore this email.',
    ].join('\n'),
    html: [
      '<p>We received a request to reset the password for your ShewaCraft account.</p>',
      '<p>Open this link to choose a new password (expires in 1 hour):</p>',
      `<p><a href="${resetUrl}">Reset your password</a></p>`,
      '<p>If you did not request this, you can ignore this email.</p>',
    ].join(''),
  });
}

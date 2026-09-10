import { AppError } from '../utils/AppError.js';
import { isDev } from '../config/env.js';

export function notFound(_req, _res, next) {
  next(new AppError(404, 'Not found'));
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    const body = { error: { message: err.message } };
    if (err.fields) body.error.fields = err.fields;
    return res.status(err.status).json(body);
  }

  if (err.name === 'ValidationError') {
    const fields = {};
    for (const [key, value] of Object.entries(err.errors || {})) {
      fields[key] = value.message;
    }
    return res.status(400).json({
      error: { message: 'Validation failed', fields },
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      error: {
        message: 'An account with this email already exists',
        fields: { email: 'An account with this email already exists' },
      },
    });
  }

  if (err.name === 'CastError') {
    return res.status(404).json({ error: { message: 'Not found' } });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: { message: 'Invalid or expired session' } });
  }

  if (err.name === 'MulterError' && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: {
        message: 'Image must be 10MB or smaller.',
        fields: { file: 'Image must be 10MB or smaller.' },
      },
    });
  }

  if (err.status === 429 || err.statusCode === 429) {
    return res.status(429).json({
      error: { message: err.message || 'Too many attempts. Try again later.' },
    });
  }

  const message = isDev && err.message ? err.message : 'Unexpected server error';
  return res.status(500).json({ error: { message } });
}

import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
dotenv.config({ path: path.join(rootDir, '.env') });

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongodbUri: required('MONGODB_URI'),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  jwtExpiresInRemember: process.env.JWT_EXPIRES_IN_REMEMBER || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  uploadDir: process.env.UPLOAD_DIR || path.join(rootDir, 'uploads'),
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
};

export const isDev = env.nodeEnv !== 'production';

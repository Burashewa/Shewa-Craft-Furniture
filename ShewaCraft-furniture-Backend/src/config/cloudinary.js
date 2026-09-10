import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

export function isCloudinaryConfigured() {
  return Boolean(
    env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret
  );
}

export function getCloudinary() {
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true,
  });
  return cloudinary;
}

export function uploadImageBuffer(buffer, folder) {
  const client = getCloudinary();
  return new Promise((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

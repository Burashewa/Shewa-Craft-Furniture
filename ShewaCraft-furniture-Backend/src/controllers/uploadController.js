import { isCloudinaryConfigured, uploadImageBuffer } from '../config/cloudinary.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const uploadImage = asyncHandler(async (req, res) => {
  if (!isCloudinaryConfigured()) {
    throw new AppError(503, 'Image uploads are not configured');
  }
  if (!req.file?.buffer) {
    throw new AppError(400, 'Upload a product photo', {
      file: 'Upload a product photo',
    });
  }

  try {
    const result = await uploadImageBuffer(req.file.buffer, 'shewacraft/products');
    const url = result?.secure_url || '';
    if (!url) {
      throw new AppError(500, 'Unexpected server error');
    }
    res.status(201).json({ url });
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(502, 'Unable to upload image');
  }
});

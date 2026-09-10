import multer from 'multer';
import { AppError } from '../utils/AppError.js';
import { assertImageFile } from './assertImageFile.js';

const MAX_BYTES = 10 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES },
  fileFilter(_req, file, cb) {
    if (!file.mimetype?.startsWith('image/')) {
      cb(
        new AppError(415, 'Please choose a PNG or JPG image.', {
          file: 'Please choose a PNG or JPG image.',
        })
      );
      return;
    }
    cb(null, true);
  },
}).single('image');

export function uploadProductImage(req, res, next) {
  upload(req, res, (err) => {
    if (err) {
      if (err instanceof AppError) return next(err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(
          new AppError(413, 'Image must be 10MB or smaller.', {
            file: 'Image must be 10MB or smaller.',
          })
        );
      }
      return next(err);
    }
    return assertImageFile(req, res, next);
  });
}

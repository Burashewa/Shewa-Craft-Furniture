import { AppError } from '../utils/AppError.js';

const IMAGE_MESSAGE = 'Please choose a PNG or JPG image.';

export function isImageBuffer(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return false;

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return true;
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return true;
  }

  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return true;
  }

  return false;
}

export function assertImageFile(req, _res, next) {
  if (!req.file) return next();
  if (!isImageBuffer(req.file.buffer)) {
    return next(
      new AppError(415, IMAGE_MESSAGE, {
        file: IMAGE_MESSAGE,
      })
    );
  }
  next();
}

import { AppError } from '../utils/AppError.js';

export function requireRole(...roles) {
  return (req, _res, next) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      return next(new AppError(403, 'You do not have permission to perform this action'));
    }
    next();
  };
}

import { User, publicUser } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { verifyAccessToken } from '../services/tokenService.js';

function readBearer(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
}

export async function requireAuth(req, _res, next) {
  try {
    const token = readBearer(req);
    if (!token) {
      throw new AppError(401, 'Invalid or expired session');
    }

    const payload = verifyAccessToken(token);
    const userId = payload.sub;
    if (!userId) {
      throw new AppError(401, 'Invalid or expired session');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(401, 'Invalid or expired session');
    }

    req.user = user;
    req.authUser = publicUser(user);
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new AppError(401, 'Invalid or expired session'));
  }
}

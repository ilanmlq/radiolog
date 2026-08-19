import type { NextFunction, Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import type { JWTPayload } from 'jose';
import { logMessage } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  token_payload?: JWTPayload;
}

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const NODE_ENV = process.env.NODE_ENV;

  if (NODE_ENV === 'development' || NODE_ENV === 'test') {
    logMessage('info', 'authGuard', 'Skipping auth in dev or test environment');
    return next();
  }

  const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
  const AUTH0_AUDIENCE = process.env.AUTH0_FRONTEND_AUDIENCE;

  if (!AUTH0_DOMAIN || !AUTH0_AUDIENCE) {
    const message = 'missing AUTH0_DOMAIN and AUTH0_AUDIENCE environment variables';

    logMessage('error', 'authGuard', message);

    throw new Error(message);
  }

  logMessage('debug', 'authGuard', 'auth data', { auth: req.auth });

  const useAuth0 = req.headers?.authorization?.startsWith('Bearer');
  if (!useAuth0) {
    logMessage('warn', 'authGuard', 'No Bearer token provided');
    return res.status(401).json({ message: 'Authentication required' });
  }

  logMessage('info', 'authGuard', 'Using auth0 for auth');

  const checkJwt = auth({
    audience: AUTH0_AUDIENCE,
    issuerBaseURL: `https://${AUTH0_DOMAIN}/`,
  });

  return checkJwt(req, res, next);
};

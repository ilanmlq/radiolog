import { Permissions } from '../utils/permissions';
import { logMessage } from '../utils/logger';

export const requirePermissions = (requiredPermissions: Permissions[]) => {
  return (req: any, res: any, next: any) => {
    const NODE_ENV = process.env.NODE_ENV;

    if (NODE_ENV === 'development' || NODE_ENV === 'test') {
      logMessage('info', 'require-permissions', 'Skipping permission in dev or test environment');
      return next();
    }

    const token = req.auth;
    if (!token) return res.sendStatus(401);

    const tokenPermissions = token.payload.permissions || [];

    const hasAllScopes = requiredPermissions.every((scope) =>
      tokenPermissions.includes(scope),
    );

    if (!hasAllScopes) return res.sendStatus(403);

    next();
  };
};

import { Response, Router } from 'express';
import { AuthenticatedRequest, authGuard } from '../middlewares/auth.guard';
import { requirePermissions } from '../middlewares/require-permissions';
import { Permissions } from '../utils/permissions';
import { validateQuery } from '../middlewares/schema-validator';
import { PaginationParams, paginationParamsSchema } from '../middlewares/paging.validator';
import { PaginatedResult } from '../common/common.model';
import { listUsers } from './user.service';
import { User } from './user.model';

const userRoutes = Router();

userRoutes.use(authGuard);

userRoutes.get(
  '/',
  requirePermissions([Permissions.READ_DATA]),
  validateQuery(paginationParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const paginationParams = request.parsedQuery as PaginationParams;
    const users: PaginatedResult<User> = await listUsers(paginationParams);
    response.status(200).json(users);
  }
);

export default userRoutes;

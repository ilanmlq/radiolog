import { Response, Router } from 'express';
import { PaginatedResult } from '../common/common.model';
import { listEvents } from './event.service';
import { EventSummary } from './event.model';
import { validateQuery } from '../middlewares/schema-validator';
import { PaginationParams, paginationParamsSchema } from '../middlewares/paging.validator';
import { AuthenticatedRequest, authGuard } from '../middlewares/auth.guard';
import { requirePermissions } from '../middlewares/require-permissions';
import { Permissions } from '../utils/permissions';

const eventRoutes = Router();

eventRoutes.use(authGuard);

eventRoutes.get(
  '/',
  requirePermissions([Permissions.READ_DATA]),
  validateQuery(paginationParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const paginationParams = request.parsedQuery as PaginationParams;
    const events: PaginatedResult<EventSummary> = await listEvents(paginationParams);
    response.status(200).json(events);
  }
);

export default eventRoutes;
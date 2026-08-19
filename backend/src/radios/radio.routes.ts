import { Response, Router } from 'express';
import { validateParams, validateQuery } from '../middlewares/schema-validator';
import { getRadioDetails, listRadios } from './radio.service';
import { Radio } from './radio.model';
import { radioParamsSchema, RadioParams } from './radio.validator';
import { PaginatedResult } from '../common/common.model';
import { PaginationParams, paginationParamsSchema } from '../middlewares/paging.validator';
import { AuthenticatedRequest, authGuard } from '../middlewares/auth.guard';
import { requirePermissions } from '../middlewares/require-permissions';
import { Permissions } from '../utils/permissions';

const radioRoutes = Router();

radioRoutes.use(authGuard);

radioRoutes.get(
  '/',
  requirePermissions([Permissions.READ_DATA]),
  validateQuery(paginationParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const paginationParams = request.parsedQuery as PaginationParams;
    const radios: PaginatedResult<Radio> = await listRadios(paginationParams);
    response.status(200).json(radios);
  }
);

radioRoutes.get(
  '/:radioId',
  requirePermissions([Permissions.READ_DATA]),
  validateParams(radioParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { radioId } = request.parsedParams as RadioParams;
    const radio = await getRadioDetails(radioId);
    response.status(200).json(radio);
  }
);

export default radioRoutes;
import {
  Response, Router } from 'express';
import { PaginatedResult } from '../common/common.model';
import { CanalSummary } from './canal.model';
import { createCanal, deleteCanal, getCanalDetails, listCanals, updateCanal } from './canal.service';
import {
  CanalParams,
  canalParamsSchema,
  CreateCanalInput,
  createCanalSchema,
  UpdateCanalInput,
  updateCanalSchema,
} from './canal.validator';
import { validateBody, validateParams, validateQuery } from '../middlewares/schema-validator';
import { PaginationParams, paginationParamsSchema } from '../middlewares/paging.validator';
import { AuthenticatedRequest, authGuard } from '../middlewares/auth.guard';
import { requirePermissions } from '../middlewares/require-permissions';
import { Permissions } from '../utils/permissions';
import { getConnectedUserId } from '../users/user.service';

const canalRoutes = Router();

canalRoutes.use(authGuard);

canalRoutes.get(
  '/',
  requirePermissions([Permissions.READ_DATA]),
  validateQuery(paginationParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const paginationParams = request.parsedQuery as PaginationParams;
    const canals: PaginatedResult<CanalSummary> = await listCanals(paginationParams);
    response.status(200).json(canals);
  }
);

canalRoutes.get(
  '/:canalId',
  requirePermissions([Permissions.READ_DATA]),
  validateParams(canalParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { canalId } = request.parsedParams as CanalParams;
    const canal = await getCanalDetails(canalId);
    response.status(200).json(canal);
  }
);

canalRoutes.post(
  '/',
  requirePermissions([Permissions.WRITE_DATA]),
  validateBody(createCanalSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const data = request.parsedBody as CreateCanalInput;
    const connectedUserId = await getConnectedUserId();
    const newCanal = await createCanal({...data, createdById: connectedUserId });
    response.status(201).json(newCanal);
  }
);

canalRoutes.put(
  '/:canalId',
  requirePermissions([Permissions.WRITE_DATA]),
  validateParams(canalParamsSchema),
  validateBody(updateCanalSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { canalId } = request.parsedParams as CanalParams;
    const data = request.parsedBody as UpdateCanalInput;
    const connectedUserId = await getConnectedUserId();
    const updatedCanal = await updateCanal(canalId, {...data, updatedById: connectedUserId });
    response.status(200).json(updatedCanal);
  }
);

canalRoutes.delete(
  '/:canalId',
  requirePermissions([Permissions.WRITE_DATA]),
  validateParams(canalParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { canalId } = request.parsedParams as CanalParams;
    await deleteCanal(canalId);
    response.status(204).send();
  }
);

export default canalRoutes;
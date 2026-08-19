import { Response, Router } from 'express';
import { PaginatedResult } from '../common/common.model';
import { CreatePlaceData, Place } from './place.model';
import { listPlaces, getPlace, createPlace, updatePlace } from './place.service';
import { validateBody, validateParams, validateQuery } from '../middlewares/schema-validator';
import { PaginationParams, paginationParamsSchema } from '../middlewares/paging.validator';
import { createPlaceDTOSchema, PlaceParams, placeParamsSchema, UpdatePlaceDTO, updatePlaceDTOSchema } from './place.validator';
import { AuthenticatedRequest, authGuard } from '../middlewares/auth.guard';
import { requirePermissions } from '../middlewares/require-permissions';
import { Permissions } from '../utils/permissions';
import { getConnectedUserId } from '../users/user.service';
import { deletePlace } from './place.database';

const placeRoutes = Router();

placeRoutes.use(authGuard);

placeRoutes.get(
  '/',
  requirePermissions([Permissions.READ_DATA]),
  validateQuery(paginationParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const paginationParams = request.parsedQuery as PaginationParams;
    const places: PaginatedResult<Place> = await listPlaces(paginationParams);
    response.status(200).json(places);
  }
);

placeRoutes.get(
  '/:placeId',
  requirePermissions([Permissions.READ_DATA]),
  validateParams(placeParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { placeId } = request.parsedParams as PlaceParams;
    const place = await getPlace(placeId);
    response.status(200).json(place);
  }
);

placeRoutes.post(
  '/',
  requirePermissions([Permissions.WRITE_DATA]),
  validateBody(createPlaceDTOSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const data = request.parsedBody as CreatePlaceData;
    const connectedUserId = await getConnectedUserId();
    const newPlace = await createPlace({ ...data, createdById: connectedUserId });
    response.status(201).json(newPlace);
  }
);

placeRoutes.put(
  '/:placeId',
  requirePermissions([Permissions.WRITE_DATA]),
  validateParams(placeParamsSchema),
  validateBody(updatePlaceDTOSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { placeId } = request.parsedParams as PlaceParams;
    const data = request.parsedBody as UpdatePlaceDTO;
    const connectedUserId = await getConnectedUserId();
    const updatedCanal = await updatePlace(placeId, { ...data, updatedById: connectedUserId });
    response.status(200).json(updatedCanal);
  }
);

placeRoutes.delete(
  '/:placeId',
  requirePermissions([Permissions.WRITE_DATA]),
  validateParams(placeParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { placeId } = request.parsedParams as PlaceParams;
    await deletePlace(placeId);
    response.status(204).send();
  }
);

export default placeRoutes;
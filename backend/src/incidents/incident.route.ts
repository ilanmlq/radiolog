import { Response, Router } from 'express';
import { PaginatedResult } from '../common/common.model';
import { CreateIncidentData, Incident, IncidentSummary, UpdateIncidentData } from './incident.model';
import { listIncidents, listIncidentsForPlace, getIncidentDetails, deleteIncident, listIncidentsResolved } from './incident.service';
import { validateBody, validateParams, validateQuery } from '../middlewares/schema-validator';
import { PaginationParams, paginationParamsSchema } from '../middlewares/paging.validator';
import { CreateIncidentDTO, IncidentParams, incidentParamsSchema, UpdateIncidentDTO, updateIncidentDTOSchema } from './incident.validator';
import { AuthenticatedRequest, authGuard } from '../middlewares/auth.guard';
import { requirePermissions } from '../middlewares/require-permissions';
import { Permissions } from '../utils/permissions';
import { PlaceParams, placeParamsSchema } from '../places/place.validator';
import { getConnectedUserId } from '../users/user.service';
import { createIncident, updateIncident } from './incident.service';

const incidentRoutes = Router();
incidentRoutes.use(authGuard);

incidentRoutes.get(
    '/',
    requirePermissions([Permissions.READ_DATA]),
    validateQuery(paginationParamsSchema),
    async (request: AuthenticatedRequest, response: Response) => {
        const paginationParams = request.parsedQuery as PaginationParams;
        const incidents: PaginatedResult<IncidentSummary> = await listIncidents(paginationParams);
        response.status(200).json(incidents);
    }
);

incidentRoutes.get(
    '/:incidentId',
    requirePermissions([Permissions.READ_DATA]),
    validateParams(incidentParamsSchema),
    async (request: AuthenticatedRequest, response: Response) => {
        const { incidentId } = request.parsedParams as IncidentParams;
        const incident = await getIncidentDetails(incidentId);
        response.status(200).json(incident);
    }
);

incidentRoutes.get(
    '/places/:placeId',
    requirePermissions([Permissions.READ_DATA]),
    validateParams(placeParamsSchema),
    async (request: AuthenticatedRequest, response: Response) => {
        const { placeId } = request.parsedParams as PlaceParams;
        const paginationParams = request.parsedQuery as PaginationParams;
        const incidents: PaginatedResult<Incident> = await listIncidentsForPlace(placeId, paginationParams);
        response.status(200).json(incidents);
    }
);

incidentRoutes.get(
    '/status/resolved',
    requirePermissions([Permissions.READ_DATA]),
    validateParams(placeParamsSchema),
    async (request: AuthenticatedRequest, response: Response) => {
        const paginationParams = request.parsedQuery as PaginationParams;
        const incidents: PaginatedResult<IncidentSummary> = await listIncidentsResolved(true, paginationParams);
        response.status(200).json(incidents);
    }
);

incidentRoutes.get(
    '/status/unresolved',
    requirePermissions([Permissions.READ_DATA]),
    validateParams(placeParamsSchema),
    async (request: AuthenticatedRequest, response: Response) => {
        const paginationParams = request.parsedQuery as PaginationParams;
        const incidents: PaginatedResult<IncidentSummary> = await listIncidentsResolved(false, paginationParams);
        response.status(200).json(incidents);
    }
);

incidentRoutes.post(
    '/',
    requirePermissions([Permissions.WRITE_DATA]),
    async (request: AuthenticatedRequest, response: Response) => {
        const body = request.parsedBody as CreateIncidentDTO;
        const connectedUserId = await getConnectedUserId();
        const createData: CreateIncidentData = {
            placeId: body.placeId,
            conversationId: body.conversationId,
            criticality: body.criticality,
            description: body.description,
            statusId: body.statusId,
            createdById: connectedUserId,
        };
        const newIncident = await createIncident(createData);
        response.status(201).json(newIncident);
    }
);

incidentRoutes.put(
    '/:incidentId',
    requirePermissions([Permissions.WRITE_DATA]),
    validateParams(incidentParamsSchema),
    validateBody(updateIncidentDTOSchema),
    async (request: AuthenticatedRequest, response: Response) => {
        const { incidentId } = request.parsedParams as IncidentParams;
        const body = request.parsedBody as UpdateIncidentDTO;
        const connectedUserId = await getConnectedUserId();
        const updateData: UpdateIncidentData = {
            criticality: body.criticality,
            description: body.description,
            updatedById: connectedUserId,
        };
        const updatedIncident = await updateIncident(incidentId, updateData);
        response.status(200).json(updatedIncident);
    }
);

incidentRoutes.delete(
    '/:incidentId',
    requirePermissions([Permissions.WRITE_DATA]),
    validateParams(incidentParamsSchema),
    async (request: AuthenticatedRequest, response: Response) => {
        const { incidentId } = request.parsedParams as IncidentParams;
        await deleteIncident(incidentId);
        response.status(204).send();
    }
);

export default incidentRoutes;
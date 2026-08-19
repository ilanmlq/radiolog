import { Response, Router } from "express";
import { AuthenticatedRequest, authGuard } from "../middlewares/auth.guard";
import { requirePermissions } from "../middlewares/require-permissions";
import { Permissions } from "../utils/permissions";
import { validateBody, validateParams, validateQuery } from "../middlewares/schema-validator";
import { PaginationParams, paginationParamsSchema } from "../middlewares/paging.validator";
import { PaginatedResult } from "../common/common.model";
import { CreateStatusData, Status, StatusSummary, UpdateStatusData } from "./status.model";
import { createStatus, deleteStatus, getStatusDetails, listStatus, updateStatus } from "./status.service";
import { CreateStatusDTO, StatusParams, statusParamsSchema, UpdateStatusDTO, updateStatusDTOSchema } from "./status.validator";
import { UserID } from "../users/user.model";
import { getConnectedUserId } from "../users/user.service";

const statusRoutes = Router();
statusRoutes.use(authGuard);

statusRoutes.get(
    '/',
    requirePermissions([Permissions.READ_DATA]),
    validateQuery(paginationParamsSchema),
    async (request: AuthenticatedRequest, response: Response) => {
        const paginationParams: PaginationParams = request.parsedQuery as PaginationParams;
        const status: PaginatedResult<StatusSummary> = await listStatus(paginationParams);
        response.status(200).json(status);
    }
);

statusRoutes.get(
    '/:statusId',
    requirePermissions([Permissions.READ_DATA]),
    validateParams(statusParamsSchema),
    async (request: AuthenticatedRequest, response: Response) => {
        const { statusId }: StatusParams = request.parsedParams as StatusParams;
        const status: Status | undefined = await getStatusDetails(statusId);
        response.status(200).json(status);
    }
)

statusRoutes.post(
    '/',
    requirePermissions([Permissions.WRITE_DATA]),
    async (request: AuthenticatedRequest, response: Response) => {
        const body: CreateStatusDTO = request.parsedBody as CreateStatusDTO;
        const connectedUserId: UserID = await getConnectedUserId();
        const createData: CreateStatusData = {
            resolve: body.resolve,
            description: body.description,
            createdById: connectedUserId,
        };
        const newStatus: Status = await createStatus(createData);
        response.status(201).json(newStatus);
    }
)

statusRoutes.put(
    '/:statusId',
    requirePermissions([Permissions.WRITE_DATA]),
    validateParams(statusParamsSchema),
    validateBody(updateStatusDTOSchema),
    async (request: AuthenticatedRequest, response: Response) => {
        const { statusId }: StatusParams = request.parsedParams as StatusParams;
        const body: UpdateStatusDTO = request.parsedBody as UpdateStatusDTO;
        const connectedUserId: UserID = await getConnectedUserId();
        const updateData: UpdateStatusData = {
            resolve: body.resolve,
            description: body.description,
            updatedById: connectedUserId,
        };
        const updatedStatus: Status = await updateStatus(statusId, updateData);
        response.status(200).json(updatedStatus);
    }
);

statusRoutes.delete(
    '/:statusId',
    requirePermissions([Permissions.WRITE_DATA]),
    validateParams(statusParamsSchema),
    async (request: AuthenticatedRequest, response: Response) => {
        const { statusId }: StatusParams = request.parsedParams as StatusParams;
        await deleteStatus(statusId);
        response.status(204).send();
    }
);

export default statusRoutes;
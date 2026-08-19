import { PaginatedResult } from "../common/common.model";
import { PaginationParams } from "../middlewares/paging.validator";
import { CreateStatusData, Status, StatusID, StatusSummary, UpdateStatusData } from "./status.model";
import * as database from "./status.database";
import { NotFoundError } from "../utils/errors";

export async function listStatus(
    paginationParams: PaginationParams
): Promise<PaginatedResult<Status>> {
    const count: number = await database.countStatus();
    const status: Status[] = await database.findManyStatus(paginationParams.limit, paginationParams.offset);
    return ({
        items: status,
        total: count,
        limit: paginationParams.limit,
        offset: paginationParams.offset,
    });
}

export async function getStatusDetails(
    id: StatusID
): Promise<Status | undefined> {
    const status: Status | undefined = await database.findStatusById(id);
    if (!status) {
        throw new NotFoundError(`Status with ${id} not found`);
    }
    return status;
}

export async function createStatus(
    data: CreateStatusData
): Promise<Status> {
    return await database.createStatus(data);
}

export async function updateStatus(
    id: StatusID, 
    data: UpdateStatusData
): Promise<Status> {
    const existingStatus: Status | undefined = await database.findStatusById(id);
    if (!existingStatus) {
        throw new NotFoundError(`Status with id ${id} not found`);
    }
    const updatedStatus: Status | undefined = await database.updateStatus(id, data);
    if (!updatedStatus) {
        throw new NotFoundError(`Status with id ${id} not found during update`);
    }
    return updatedStatus;
}

export async function deleteStatus(
    id: StatusID
): Promise<void> {
    const deleted: boolean = await database.deleteStatus(id);
    if (!deleted) {
        throw new NotFoundError(`Status with id ${id} not found`);
    }
}

function toStatusSummary(status: Status): StatusSummary {
    return {
        id: status.id,
        resolve: status.resolve,
        description: status.description
    }
}
import { ObjectId } from "mongodb";
import { AuditFields } from "../common/common.model";
import { UserID } from "../users/user.model";

export type StatusID = ObjectId | string;

export interface StatusSummary {
    id: StatusID;
    resolve: boolean;
    description: string;
}

export interface Status extends StatusSummary, AuditFields {}

export interface CreateStatusData {
    resolve: boolean;
    description: string;
    createdById: UserID;
}

export interface UpdateStatusData {
    resolve?: boolean;
    description?: string;
    updatedById: UserID;
}
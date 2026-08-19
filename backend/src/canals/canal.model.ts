import { AuditFields } from '../common/common.model';
import { UserID } from '../users/user.model';

export type CanalID = string;

export interface CanalSummary {
  id: CanalID;

  number: number;
  name: string;
  description: string;
}

export interface Canal extends CanalSummary, AuditFields {}

export interface CreateCanalData {
  number: number;
  name: string;
  description: string;

  createdById: UserID;
}

export interface UpdateCanalData {
  number: number;
  name: string;
  description: string;

  updatedById: UserID;
}
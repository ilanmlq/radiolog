import { AuditFields } from '@/modules/common.model.ts';

export type CanalID = string;

export interface CanalSummary {
  id: CanalID;

  number: number;
  name: string;
  description: string;
}

export interface Canal extends CanalSummary, AuditFields {}

export interface CreateCanalDTO {
  number: number;
  name: string;
  description: string;
}

export interface UpdateCanalDTO {
  number: number;
  name: string;
  description: string;
}
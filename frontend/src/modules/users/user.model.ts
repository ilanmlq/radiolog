import { AuditFields } from '@/modules/common.model.ts';

export type UserID = string;

export interface UserSummary {
  id: UserID;
  name: string;
  email: string;
  isAdmin: boolean;
  lastLoginAt: string;
}

export interface User extends UserSummary, AuditFields {}

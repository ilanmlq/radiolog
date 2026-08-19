import { AuditFields, ISODateTime } from '../common/common.model'
import { EventID } from '../events/event.model';
import { UserID } from '../users/user.model'
import { MemberID } from '../teams/team.model'
import { ObjectId } from 'mongodb';

export type RadioID = string;
export type RadioAssignmentID = string;

export type RadioStatus = "available" | "in_charge" | "checked_out" | "maintenance" | "lost";

export interface Radio extends AuditFields {
  id: RadioID;
  eventId: EventID;

  name: string;
  brand?: string;
  model?: string;
  serialNumber?: string;

  status: RadioStatus;
  notes?: string;
}

export interface CreateRadioData {
  eventId: EventID;

  name: string;
  brand?: string;
  model?: string;
  serialNumber?: string

  status?: string;
  notes?: string

  createdById?: UserID;
}

export interface UpdateRadioData {
  eventId: EventID;

  name?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;

  status?: string;
  notes?: string;

  updatedById?: UserID;
}

export type RadioAssignmentStatus = "checked_out" | "returned" | "lost";

export interface RadioAssignment extends AuditFields {
  id: RadioAssignmentID;

  radioId: RadioID;
  assignedToId: MemberID;

  checkedOutAt: ISODateTime;
  checkedOutById?: UserID;

  expectedReturnAt?: ISODateTime;

  returnedAt?: ISODateTime;
  returnedToId?: UserID;

  status: RadioAssignmentStatus;
  notes?: string;
}
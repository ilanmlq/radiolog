import { AuditFields, ISODateTime } from '@/modules/common.model.ts';
import { OrganisationID } from '@/modules/organisations/organisation.model';

export type EventID = string;

export type EventStatus = "preparation" | "active" | "completed";

export interface EventDTO extends AuditFields {
  id?: EventID;
  organisationId?: OrganisationID;

  name: string;
  description: string;
  location: string;
  startAt: ISODateTime;
  endAt: ISODateTime;
}

export interface Event extends AuditFields {
  id: EventID;

  status: EventStatus;
  name: string;
  description: string;
  location: string;
  startAt: Date;
  endAt: Date;
}
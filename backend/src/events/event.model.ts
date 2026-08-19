import { AuditFields, ISODateTime } from '../common/common.model';
import { OrganisationID } from '../organisations/organisation.model';
import { UserID } from '../users/user.model';

export type EventID = string;

export interface EventSummary {
  id: EventID;
  organisationId: OrganisationID;

  name: string;
  description: string;
  location: string;
  startAt: ISODateTime;
  endAt: ISODateTime;
}

export interface Event extends EventSummary, AuditFields {}

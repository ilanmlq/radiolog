import { AuditFields } from '../common/common.model';
import { EventID } from '../events/event.model';

export type OrganisationID = string;

export interface Organisation extends AuditFields {
  id: OrganisationID;

  activeEventId: EventID | null;

  name: string;
  description?: string;
  timezone: string; // e.g. "Europe/Zurich"
}
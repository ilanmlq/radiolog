import { AuditFields } from '@/modules/common.model.ts';
import { EventID } from '@/modules/events';


export type OrganisationID = string;

export interface Organisation extends AuditFields {
  id: OrganisationID;

  activeEventId: EventID | null;

  name: string;
  description?: string;
  timezone: string; // e.g. "Europe/Zurich"
}
import { getOrganisation, updateOrganisation } from './organisation.database';
import { Event, EventID } from '../events/event.model';
import { Organisation, OrganisationID } from './organisation.model';
import { NotFoundError } from '../utils/errors';
import { getEvent } from '../events/event.service';

export async function getOrganisationDetails(): Promise<Organisation> {
  const organisation = await getOrganisation();
  if (!organisation) {
    throw new NotFoundError('Organisation not found.');
  }
  return organisation;
}

export async function getOrganisationId(): Promise<OrganisationID> {
  const organisation = await getOrganisationDetails();
  return organisation.id;
}

export async function getActiveEventDetails(): Promise<Event | null> {
  const eventId = await getActiveEventId();
  if (!eventId) {
    return null;
  }
  return await getEvent(eventId) || null;
}

export async function getActiveEventId(): Promise<EventID | null> {
  const organisation = await getOrganisationDetails();
  return organisation.activeEventId;
}

export async function setActiveEvent(activeEventId: EventID | null): Promise<Organisation> {
  return await updateOrganisation({ activeEventId });
}
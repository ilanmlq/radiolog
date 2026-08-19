import { PaginatedResult, PaginationParams } from '../common/common.model';
import { Event, EventSummary } from './event.model';
import * as database from './event.database';
import { getOrganisationId } from '../organisations/organisation.service';


export async function listEvents(
  paginationParams: PaginationParams,
): Promise<PaginatedResult<EventSummary>> {
  const organisationId = await getOrganisationId();
  const count = await database.countEvents(organisationId);
  const events = await database.findManyEvents(organisationId, paginationParams.limit, paginationParams.offset);
  return ({
    items: events.map(toEventSummary),
    total: count,
    limit: paginationParams.limit,
    offset: paginationParams.offset,
  });
}

export async function getEvent(eventId: string): Promise<Event | undefined> {
  return await database.findEventById(eventId);
}

function toEventSummary(event: Event): EventSummary {
  return {
    id: event.id,
    organisationId: event.organisationId,

    name: event.name,
    description: event.description,
    location: event.location,
    startAt: event.startAt,
    endAt: event.endAt,
  }
}
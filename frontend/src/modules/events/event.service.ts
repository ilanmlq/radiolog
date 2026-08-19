import { Event, EventDTO } from "./event.model";
import { PaginatedResult } from '@/modules/common.model.ts';
import { AxiosInstance } from 'axios';

export async function listEvents(api: AxiosInstance, options: { limit: number; offset?: number }): Promise<PaginatedResult<Event>> {
  const limit = options.limit;
  const offset = options.offset ?? 0;

  return api.get(`/events?limit=${limit}&offset=${offset}`)
    .then((res) => {
      if (!res.status || res.status !== 200) {
        throw new Error("Failed to fetch events");
      }
      return res.data;
    })
    .then((res) => ({
      ...res,
      items: res.items.map(dtoToEvent),
    }));
}

function dtoToEvent(event: EventDTO): Event {
  if (!event.id) {
    throw new Error("EventDTO must have an id");
  }
  return {
    ...event,
    id: event.id,
    status: defineStatus(event),
    startAt: new Date(event.startAt),
    endAt: new Date(event.endAt),
  }
}

function defineStatus(event: EventDTO): "preparation" | "active" | "completed" {
  const now = new Date();
  if (event.endAt < now.toISOString()) {
    return "completed";
  }
  if (event.startAt > now.toISOString()) {
    return "preparation";
  }
  return "active";
}

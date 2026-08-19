import { OrganisationID } from '../organisations/organisation.model';
import { Event, EventID } from "./event.model";
import { getDatabase } from '../configs/config.database';
import { ObjectId } from 'mongodb';

const COLLECTION = 'events';

export async function countEvents(organisationId: OrganisationID): Promise<number> {
  const db = getDatabase();
  return await db.collection(COLLECTION).countDocuments({ organisationId: new ObjectId(organisationId) });
}

export async function findManyEvents(
  organisationId: OrganisationID,
  limit: number = 50,
  offset: number = 0
): Promise<Event[]> {
  const db = getDatabase();
  const events = await db.collection(COLLECTION)
    .find({ organisationId: new ObjectId(organisationId) })
    .skip(offset)
    .limit(limit)
    .toArray();

  return events.map((doc: any) => ({
    id: doc._id.toString(),
    organisationId: doc.organisationId?.toString(),
    name: doc.name,
    description: doc.description,
    location: doc.location,
    startAt: doc.startAt,
    endAt: doc.endAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString()
  }));
}

export async function findEventById(eventId: EventID): Promise<Event | undefined> {
  const db = getDatabase();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(eventId) });

  if (!doc) return undefined;

  return {
    id: doc._id.toString(),
    organisationId: doc.organisationId?.toString(),
    name: doc.name,
    description: doc.description,
    location: doc.location,
    startAt: doc.startAt,
    endAt: doc.endAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString()
  };
}
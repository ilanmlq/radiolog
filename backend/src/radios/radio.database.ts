import { Radio, RadioID } from './radio.model';
import { EventID } from '../events/event.model';
import { getDatabase } from '../configs/config.database';
import { ObjectId } from 'mongodb';

const COLLECTION = 'radios';

export async function countRadios(eventId: EventID): Promise<number> {
  const db = getDatabase();
  return await db.collection(COLLECTION).countDocuments({ eventId: new ObjectId(eventId) });
}

export async function findManyRadios(
  eventId: EventID,
  limit: number = 50,
  offset: number = 0
): Promise<Radio[]> {
  const db = getDatabase();
  const radios = await db.collection(COLLECTION)
    .find({ eventId: new ObjectId(eventId) })
    .skip(offset)
    .limit(limit)
    .toArray();

  return radios.map((doc: any) => ({
    id: doc._id.toString(),
    eventId: doc.eventId?.toString(),
    name: doc.name,
    brand: doc.brand,
    model: doc.model,
    serialNumber: doc.serialNumber,
    status: doc.status,
    notes: doc.notes,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString()
  }));
}

export async function findRadioById(eventId: EventID, radioId: RadioID): Promise<Radio | undefined> {
  const db = getDatabase();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(radioId), eventId: new ObjectId(eventId) });

  if (!doc) return undefined;

  return {
    id: doc._id.toString(),
    eventId: doc.eventId?.toString(),
    name: doc.name,
    brand: doc.brand,
    model: doc.model,
    serialNumber: doc.serialNumber,
    status: doc.status,
    notes: doc.notes,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString()
  };
}

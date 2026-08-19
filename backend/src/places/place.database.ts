import { CreatePlaceData, Place, PlaceID, UpdatePlaceData } from './place.model';
import { EventID } from '../events/event.model';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../configs/config.database';
import { logMessage } from '../utils/logger';

const COLLECTION = 'places';

export async function countPlaces(eventId: EventID): Promise<number> {
  const db = getDatabase();
  return await db.collection(COLLECTION).countDocuments({ eventId: new ObjectId(eventId) });
}

export async function findManyPlaces(
  eventId: EventID,
  limit: number = 50,
  offset: number = 0
): Promise<Place[]> {
  const db = getDatabase();
  const places = await db.collection(COLLECTION)
    .find({ eventId: new ObjectId(eventId) })
    .skip(offset)
    .limit(limit)
    .toArray();

  return places.map((doc: any) => ({
    id: doc._id.toString(),
    eventId: doc.eventId?.toString(),
    categoryId: doc.categoryId?.toString(),
    name: doc.name,
    description: doc.description,
    longitude: doc.longitude,
    latitude: doc.latitude,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString(),
  }));
}

export async function findAllPlaceSummaries(eventId: EventID): Promise<Partial<Place>[]> {
  const db = getDatabase();
  const places = await db.collection(COLLECTION)
    .find({ eventId: new ObjectId(eventId) })
    .project({ name: 1, description: 1 })
    .toArray();

  return places.map((doc: any) => ({
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description
  }));
}

export async function findPlaceNames(eventId: EventID): Promise<string[]> {
  const db = getDatabase();
  const docs = await db.collection(COLLECTION).find({ eventId: new ObjectId(eventId) }, { projection: { name: 1 } }).toArray();
  return docs.map((doc: any) => doc.name);
}

export async function findPlaceById(eventId: EventID, placeId: PlaceID): Promise<Place | undefined> {
  const db = getDatabase();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(placeId), eventId: new ObjectId(eventId) });

  if (!doc) return undefined;

  return {
    id: doc._id.toString(),
    eventId: doc.eventId?.toString(),
    categoryId: doc.categoryId?.toString(),
    name: doc.name,
    description: doc.description,
    longitude: doc.longitude,
    latitude: doc.latitude,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString(),
  }
}

export async function createPlace(eventId: EventID, data: CreatePlaceData): Promise<Place> {
  const db = getDatabase();

  const newPlace = {
    eventId: new ObjectId(eventId),
    categoryId: new ObjectId(data.categoryId),
    name: data.name,
    description: data.description ?? '',
    latitude: data.latitude,
    longitude: data.longitude,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdById: new ObjectId(data.createdById),
    updatedById: new ObjectId(data.createdById)
  };

  const result = await db.collection(COLLECTION).insertOne(newPlace);

  return {
    id: result.insertedId.toString(),
    eventId: newPlace.eventId?.toString(),
    categoryId: newPlace.categoryId?.toString(),
    name: newPlace.name,
    description: newPlace.description,
    latitude: newPlace.latitude,
    longitude: newPlace.longitude,
    createdAt: newPlace.createdAt,
    updatedAt: newPlace.updatedAt,
    createdById: newPlace.createdById?.toString(),
    updatedById: newPlace.updatedById?.toString()
  };
}

export async function updatePlace(placeId: PlaceID, data: UpdatePlaceData): Promise<Place | undefined> {
  const db = getDatabase();

  const result: any = await db.collection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(placeId) },
    {
      $set: {
        name: data.name,
        description: data.description,
        updatedAt: new Date().toISOString(),
        updatedById: new ObjectId(data.updatedById)
      }
    },
    { returnDocument: 'after' }
  );

  logMessage('info', 'place.database', `Updated place with id ${placeId}: ${JSON.stringify(result)}`);

  const doc = result?.value || result;

  if (!doc || !doc._id) return undefined;
  
  return {
    id: doc._id.toString(),
    eventId: doc.eventId?.toString(),
    categoryId: doc.categoryId?.toString(),
    name: doc.name,
    description: doc.description,
    latitude: doc.latitude,
    longitude: doc.longitude,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString()
  };
}

export async function deletePlace(placeId: PlaceID): Promise<boolean> {
  const db = getDatabase();
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(placeId) });
  return result.deletedCount > 0;
}
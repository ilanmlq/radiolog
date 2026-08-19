import { Canal, CanalID, CreateCanalData, UpdateCanalData } from './canal.model';
import { getDatabase } from '../configs/config.database';
import { ObjectId } from 'mongodb';
import { logMessage } from '../utils/logger';
import { PaginationParams } from '../common/common.model';

const COLLECTION = 'canals';

export async function countCanals(query?: string): Promise<number> {
  const db = getDatabase();
  const filter = query ? buildSearchFilter(query) : {};
  return await db.collection(COLLECTION).countDocuments(filter);
}

export async function findManyCanals(
  paginationParams: PaginationParams
): Promise<Canal[]> {
  const db = getDatabase();
  const { limit, offset, query, sortBy, sortOrder } = paginationParams;

  const filter = query ? buildSearchFilter(query) : {};

  const sort: any = {};
  if (sortBy) {
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  const canals = await db.collection(COLLECTION)
    .find(filter)
    .sort(sort)
    .skip(offset)
    .limit(limit)
    .toArray();

  return canals.map((doc: any) => ({
    id: doc._id.toString(),
    number: doc.number,
    name: doc.name,
    description: doc.description,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString()
  }));
}

function buildSearchFilter(query: string): any {
  const conditions: any[] = [
    { name: { $regex: query, $options: 'i' } },
    { description: { $regex: query, $options: 'i' } }
  ];

  const numberValue = Number(query);
  if (!isNaN(numberValue)) {
    conditions.push({ number: numberValue });
  }

  return {
    $or: conditions
  };
}

export async function findCanalById(canalId: CanalID): Promise<Canal | undefined> {
  const db = getDatabase();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(canalId) });

  if (!doc) return undefined;

  return {
    id: doc._id.toString(),
    number: doc.number,
    name: doc.name,
    description: doc.description,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString()
  };
}

export async function findCanalByNumber(canalNumber: number): Promise<Canal | undefined> {
  const db = getDatabase();
  const doc = await db.collection(COLLECTION).findOne({ number: canalNumber });

  if (!doc) return undefined;

  return {
    id: doc._id.toString(),
    number: doc.number,
    name: doc.name,
    description: doc.description,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString()
  };
}

export async function createCanal(data: CreateCanalData): Promise<Canal> {
  const db = getDatabase();

  const newCanal = {
    number: data.number,
    name: data.name,
    description: data.description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdById: data.createdById,
    updatedById: data.createdById
  };

  const result = await db.collection(COLLECTION).insertOne(newCanal);

  return {
    id: result.insertedId.toString(),
    number: newCanal.number,
    name: newCanal.name,
    description: newCanal.description,
    createdAt: newCanal.createdAt,
    updatedAt: newCanal.updatedAt,
    createdById: newCanal.createdById,
    updatedById: newCanal.updatedById
  };
}

export async function updateCanal(canalId: CanalID, data: UpdateCanalData): Promise<Canal | undefined> {
  const db = getDatabase();

  const result = await db.collection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(canalId) },
    {
      $set: {
        number: data.number,
        name: data.name,
        description: data.description,
        updatedAt: new Date().toISOString(),
        updatedById: data.updatedById
      }
    },
    { returnDocument: 'after' }
  );

  logMessage('info', 'canal.database', `Updated canal with id ${canalId}: ${JSON.stringify(result)}`);

  if (!result || !result.value) return undefined;

  const doc = result.value;

  return {
    id: doc._id.toString(),
    number: doc.number,
    name: doc.name,
    description: doc.description,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString()
  };
}

export async function deleteCanal(canalId: CanalID): Promise<boolean> {
  const db = getDatabase();
  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(canalId) });
  return result.deletedCount > 0;
}


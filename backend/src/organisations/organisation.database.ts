import { Organisation } from './organisation.model';
import { getDatabase } from '../configs/config.database';

const COLLECTION = 'organisations';

export async function getOrganisation(): Promise<Organisation | undefined> {
  const db = getDatabase();
  const doc = await db.collection(COLLECTION).findOne({});

  if (!doc) return undefined;

  return {
    id: doc._id.toString(),
    activeEventId: doc.activeEventId?.toString() || null,
    name: doc.name,
    description: doc.description,
    timezone: doc.timezone,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString()
  };
}

export async function updateOrganisation(updatedFields: Partial<Organisation>): Promise<Organisation> {
  const db = getDatabase();

  const result = await db.collection(COLLECTION).findOneAndUpdate(
    {},
    {
      $set: {
        ...updatedFields,
        updatedAt: new Date().toISOString()
      }
    },
    { returnDocument: 'after' }
  );

  if (!result || !result.value) {
    throw new Error('Organisation not found');
  }

  const doc = result.value;

  return {
    id: doc._id.toString(),
    activeEventId: doc.activeEventId?.toString() || null,
    name: doc.name,
    description: doc.description,
    timezone: doc.timezone,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString()
  };
}

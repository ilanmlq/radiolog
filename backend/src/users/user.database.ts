import { Auth0ID, User } from './user.model';
import { getDatabase } from '../configs/config.database';

const COLLECTION = 'users';

export async function countUsers(): Promise<number> {
  const db = getDatabase();
  return await db.collection(COLLECTION).countDocuments();
}

export async function findManyUsers(
  limit: number = 50,
  offset: number = 0
): Promise<User[]> {
  const db = getDatabase();
  const users = await db.collection(COLLECTION)
    .find()
    .skip(offset)
    .limit(limit)
    .toArray();

  return users.map((doc: any) => ({
    id: doc._id?.toString(),
    auth0Id: doc.auth0Id?.toString(),
    organisationId: doc.organisationId?.toString(),
    name: doc.name,
    email: doc.email,
    isAdmin: doc.isAdmin,
    lastLoginAt: doc.lastLoginAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString()
  }));
}

export async function findUserByAuth0Id(auth0Id: Auth0ID): Promise<User | undefined> {
  const db = getDatabase();
  const doc = await db.collection(COLLECTION).findOne({ auth0Id });

  if (!doc) return undefined;

  return {
    id: doc._id.toString(),
    auth0Id: doc.auth0Id?.toString(),
    organisationId: doc.organisationId?.toString(),
    name: doc.name,
    email: doc.email,
    isAdmin: doc.isAdmin,
    lastLoginAt: doc.lastLoginAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString()
  };
}
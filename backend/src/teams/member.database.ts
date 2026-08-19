import { EventID } from '../events/event.model';
import { CreateMemberData, Member, MemberID, TeamID, UpdateMemberData } from './team.model';
import { getDatabase } from '../configs/config.database';
import { ObjectId } from 'mongodb';

const COLLECTION = 'members';

function normalizeTeamIds(...values: unknown[]): TeamID[] {
  const ids = values.flatMap((value) => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  });

  return Array.from(new Set(ids.map((id) => id.toString())));
}

function buildTeamFilter(teamIds?: TeamID[]) {
  if (!teamIds || teamIds.length === 0) return {};

  const ids = teamIds.flatMap((id) => [new ObjectId(id), id]);

  return {
    $or: [
      { teamId: { $in: ids } },
      { teamIds: { $in: ids } },
    ],
  };
}

function mapMemberDocument(doc: any): Member {
  return {
    id: doc._id.toString(),
    eventId: doc.eventId?.toString(),
    teamId: normalizeTeamIds(doc.teamId, doc.teamIds),
    userId: doc.userId?.toString(),
    name: doc.name,
    surnames: doc.surnames,
    email: doc.email,
    phone: doc.phone,
    address: doc.address,
    roleTitles: doc.roleTitles,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString(),
  };
}

export async function countMembers(teamIds?: TeamID[]): Promise<number> {
  const db = getDatabase();

  return await db.collection(COLLECTION).countDocuments(buildTeamFilter(teamIds));
}

export async function findManyMembers(
  teamIds?: TeamID[],
  limit: number = 50,
  offset: number = 0
): Promise<Member[]> {
  const db = getDatabase();

  const members = await db
    .collection(COLLECTION)
    .find(buildTeamFilter(teamIds))
    .skip(offset)
    .limit(limit)
    .toArray();

  return members.map(mapMemberDocument);
}

export async function findAllMemberSummaries(eventId: EventID): Promise<Partial<Member>[]> {
  const db = getDatabase();
  const members = await db.collection(COLLECTION)
    .find({ eventId: new ObjectId(eventId) })
    .project({ name: 1, surnames: 1 })
    .toArray();

  return members.map((doc: any) => ({
    id: doc._id.toString(),
    name: doc.name,
    surnames: doc.surnames
  }));
}

export async function findMemberById(eventId: EventID, memberId: MemberID): Promise<Member | undefined> {
  const db = getDatabase();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(memberId) });

  if (!doc) return undefined;

  return mapMemberDocument(doc);
}

export async function findMemberByEmail(email: string[]): Promise<Member | undefined> {
  const db = getDatabase();
  const doc = await db.collection(COLLECTION).findOne({ email: { $in: email } });

  if (!doc) return undefined;

  return mapMemberDocument(doc);
}

export async function findMemberByPhone(phone: string[]): Promise<Member | undefined> {
  const db = getDatabase();
  const doc = await db.collection(COLLECTION).findOne({ phone: { $in: phone } });

  if (!doc) return undefined;

  return mapMemberDocument(doc);
}


export async function createMember(data: CreateMemberData): Promise<Member> {
  const db = getDatabase();

  const newMember: any = {
    eventId: data.eventId,
    teamId: data.teamId.map((id) => new ObjectId(id)),
    ...(data.userId !== undefined && {
      userId: new ObjectId(data.userId),
    }),
    name: data.name,
    surnames: data.surnames,
    email: data.email,
    phone: data.phone,
    roleTitles: data.roleTitles,
    createdById: data.createdById,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (data.address) {
    newMember.address = data.address;
  }

  const result = await db.collection(COLLECTION).insertOne(newMember);

  return {
    id: result.insertedId.toString(),
    eventId: newMember.eventId?.toString(),
    teamId: newMember.teamId.map((id: ObjectId) => id.toString()),
    ...(newMember.userId && {
      userId: newMember.userId.toString(),
    }),

    name: newMember.name,
    surnames: newMember.surnames,
    email: newMember.email,
    phone: newMember.phone,
    ...(newMember.address ? { address: newMember.address } : {}),
    roleTitles: newMember.roleTitles,
    createdById: newMember.createdById,
    createdAt: newMember.createdAt,
    updatedAt: newMember.updatedAt,
  };
}

export async function updateMember(memberId: MemberID, data: UpdateMemberData): Promise<Member | undefined> {
  const db = getDatabase();

  const updateData: any = {
    ...(data.eventId !== undefined && {
      eventId: new ObjectId(data.eventId),
    }),
    ...(data.teamId !== undefined && {
      teamId: data.teamId.map((id) => new ObjectId(id)),
    }),
    ...(data.userId !== undefined && {
      userId: new ObjectId(data.userId),
    }),
    ...(data.name !== undefined && {
      name: data.name,
    }),
    ...(data.surnames !== undefined && {
      surnames: data.surnames,
    }),
    ...(data.email !== undefined && {
      email: data.email,
    }),
    ...(data.phone !== undefined && {
      phone: data.phone,
    }),
    ...(data.roleTitles !== undefined && {
      roleTitles: data.roleTitles,
    }),
    updatedAt: new Date().toISOString(),
    updatedById: data.updatedById,
  };

  if (data.address) {
    updateData.address = data.address;
  }

  const result = await db.collection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(memberId) },
    { $set: updateData },
    { returnDocument: 'after' }
  );

  if (!result || !result.value) return undefined;

  const doc = result.value;

  return mapMemberDocument(doc);
}

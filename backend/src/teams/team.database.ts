import { CreateTeamData, Team, TeamID, UpdateTeamData } from './team.model';
import { EventID } from '../events/event.model';
import { getDatabase } from '../configs/config.database';
import { ObjectId } from 'mongodb';

const COLLECTION = 'teams';

export async function countTeams(eventId: EventID): Promise<number> {
  const db = getDatabase();
  return await db.collection(COLLECTION).countDocuments({ eventId: new ObjectId(eventId) });
}

export async function findManyTeams(
  eventId: EventID,
  limit: number = 50,
  offset: number = 0
): Promise<Team[]> {
  const db = getDatabase();
  const teams = await db.collection(COLLECTION)
    .find({ eventId: new ObjectId(eventId) })
    .skip(offset)
    .limit(limit)
    .toArray();

  return teams.map((doc: any) => ({
    id: doc._id.toString(),
    eventId: doc.eventId?.toString(),
    parentTeamId: doc.parentTeamId?.toString(),
    canalId: doc.canalId?.toString(),
    name: doc.name,
    teamLeaders: doc.teamLeaders?.map((id: any) => id.toString()),
    description: doc.description,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString()
  }));
}

export async function findAllTeamSummaries(eventId: EventID): Promise<Partial<Team>[]> {
  const db = getDatabase();
  const teams = await db.collection(COLLECTION)
    .find({ eventId: new ObjectId(eventId) })
    .project({ name: 1, description: 1 })
    .toArray();

  return teams.map((doc: any) => ({
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description
  }));
}

export async function findTeamById(eventId: EventID, teamId: TeamID): Promise<Team | undefined> {
  const db = getDatabase();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(teamId), eventId: new ObjectId(eventId) });

  if (!doc) return undefined;

  return {
    id: doc._id.toString(),
    eventId: doc.eventId?.toString(),
    canalId: doc.canalId?.toString(),
    name: doc.name,
    teamLeaders: doc.teamLeaders?.map((id: any) => id.toString()),
    description: doc.description,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString()
  };
}

export async function findTeamByName(name: string): Promise<Team | undefined> {
  const db = getDatabase();
  const doc = await db.collection(COLLECTION).findOne({ name });
  if (!doc) return undefined;

  return {
    id: doc._id.toString(),
    eventId: doc.eventId?.toString(),
    parentTeamId: doc.parentTeamId?.toString(),
    canalId: doc.canalId?.toString(),
    name: doc.name,
    teamLeaders: doc.teamLeaders?.map((id: any) => id.toString()),
    description: doc.description,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString()
  };
}

export async function createTeam(data: CreateTeamData): Promise<Team> {
  const db = getDatabase();
  const newTeam = {
    eventId: new ObjectId(data.eventId),
    ...(data.parentTeamId !== undefined && {
      parentTeamId: new ObjectId(data.parentTeamId),
    }),
    ...(data.canalId !== undefined && {
      canalId: new ObjectId(data.canalId),
    }),
    name: data.name,
    teamLeaders: data.teamLeaders.map(
      (id) => new ObjectId(id)
    ),
    ...(data.description !== undefined && {
      description: data.description,
    }),
    createdById: data.createdById,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };  

  const result = await db.collection(COLLECTION).insertOne(newTeam);

  return {
    id: result.insertedId.toString(),
    eventId: newTeam.eventId.toString(),
    ...(newTeam.parentTeamId && {
      parentTeamId: newTeam.parentTeamId.toString(),
    }),
    ...(newTeam.canalId && {
      canalId: newTeam.canalId.toString(),
    }),
    name: newTeam.name,
    teamLeaders: newTeam.teamLeaders.map(
      (id) => id.toString()
    ),
    ...(newTeam.description !== undefined && {
      description: newTeam.description,
    }),
    createdAt: newTeam.createdAt,
    updatedAt: newTeam.updatedAt,
  };
}


export async function updateTeam(teamId: string, data: UpdateTeamData): Promise<Team | undefined> {
  const db = getDatabase();

  const updateData: any = {
    ...(data.eventId !== undefined && {
      eventId: new ObjectId(data.eventId),
    }),
    ...(data.parentTeamId !== undefined && {
      parentTeamId: new ObjectId(data.parentTeamId),
    }),
    ...(data.canalId !== undefined && {
      canalId: new ObjectId(data.canalId),
    }),
    ...(data.name !== undefined && {
      name: data.name,
    }),
    ...(data.teamLeaders !== undefined && {
      teamLeaders: data.teamLeaders,
    }),
    ...(data.description !== undefined && {
      description: data.description,
    }),
    updatedAt: new Date().toISOString(),
    updatedById: data.updatedById,
  };

  const doc = await db.collection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(teamId) },
    { $set: updateData },
    { returnDocument: 'after' }
  );
  
  if (!doc) return undefined;

  return {
    id: doc._id.toString(),
    eventId: doc.eventId?.toString(),
    parentTeamId: doc.parentTeamId?.toString(),
    canalId: doc.canalId?.toString(),
    name: doc.name,
    teamLeaders: doc.teamLeaders,
    description: doc.description,
    updatedById: doc.updatedById,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

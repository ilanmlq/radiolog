import { EventID } from '../events/event.model';
import { Conversation, ConversationID, CreateConversationData, UpdateConversationData } from './conversation.model';
import { getDatabase } from '../configs/config.database';
import { ObjectId } from 'mongodb';
import { CanalID } from '../canals/canal.model';

const COLLECTION = 'conversations';

export async function countConversations(eventId: EventID): Promise<number> {
  const db = getDatabase();
  return await db.collection(COLLECTION).countDocuments({ eventId: new ObjectId(eventId) });
}

export async function findManyConversations(
  eventId: EventID,
  limit: number = 50,
  offset: number = 0
): Promise<Conversation[]> {
  const db = getDatabase();
  const conversations = await db.collection(COLLECTION)
    .find({ eventId: new ObjectId(eventId) })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .toArray();

  return conversations.map(mapToConversation);
}

export async function countConversationsByCanal(canalID: CanalID): Promise<number> {
  const db = getDatabase();
  return await db.collection(COLLECTION).countDocuments({ canalID: new ObjectId(canalID) });
}

export async function findManyConversationsByCanal(
  canalID: CanalID,
  limit: number = 50,
  offset: number = 0
): Promise<Conversation[]> {
  const db = getDatabase();
  const conversations = await db.collection(COLLECTION)
    .find({ canalID: new ObjectId(canalID) })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .toArray();

  return conversations.map(mapToConversation);
}

export async function findLastConversations(
  canalID: CanalID,
  limit: number,
): Promise<Conversation[]> {
  const db = getDatabase();
  const conversations = await db.collection(COLLECTION)
    .find({ canalID: new ObjectId(canalID) })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return conversations.map(mapToConversation);
}

export async function findConversationById(conversationID: ConversationID): Promise<Conversation> {
  const db = getDatabase();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(conversationID) });

  if (!doc) {
    throw new Error(`Conversation with id ${conversationID} not found`);
  }

  return mapToConversation(doc);
}

export async function addConversation(data: CreateConversationData): Promise<Conversation> {
  const db = getDatabase();
  const conversation = {
    ...data,
    eventId: new ObjectId(data.eventId),
    canalID: new ObjectId(data.canalID),
    memberIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const result = await db.collection(COLLECTION).insertOne(conversation);
  return mapToConversation({
    _id: result.insertedId,
    ...conversation
  });
}

export async function updateConversation(conversationId: ConversationID, data: UpdateConversationData): Promise<Conversation | undefined> {
  const db = getDatabase();

  const result = await db.collection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(conversationId) },
    {
      $set: {
        summary: data.summary,
        memberIds: data.memberIds.map((id) => new ObjectId(id)),
        criticality: data.criticality,
        updatedAt: new Date().toISOString(),
      }
    },
    { returnDocument: 'after', includeResultMetadata: false }
  );

  if (!result) {
    return undefined;
  }

  return mapToConversation(result);
}

function mapToConversation(data: any): Conversation {
  return {
    conversationId: data._id.toString(),
    eventId: data.eventId?.toString(),
    canalID: data.canalID?.toString(),
    memberIds: data.memberIds?.map((id: any) => id.toString()),
    summary: data.summary,
    criticality: data.criticality,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    createdById: data.createdById?.toString(),
    updatedById: data.updatedById?.toString()
  };
}

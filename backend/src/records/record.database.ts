import { CreateRecordData, Record } from './record.model';
import { EventID } from '../events/event.model';
import { getDatabase } from '../configs/config.database';
import { ObjectId } from 'mongodb';
import { ConversationID } from '../conversations/conversation.model';

const COLLECTION = 'records';
const MESSAGES_COLLECTION = 'messages';

export async function createRecord(
  eventId: EventID,
  data: CreateRecordData,
  recordedAt?: Date | null,
): Promise<Record> {
  const db = getDatabase();

  const createdAt = recordedAt ? recordedAt.toISOString() : new Date().toISOString();

  const newRecord = {
    eventId: new ObjectId(eventId),
    canalID: new ObjectId(data.canalID),
    fileName: data.fileName,
    duration: data.duration,
    status: 'pending' as const,
    createdAt,
  };

  const result = await db.collection(COLLECTION).insertOne(newRecord);

  return {
    ...newRecord,
    id: result.insertedId.toString(),
    eventId: eventId,
    canalID: data.canalID,
  };
}

export async function updateStatus(
  recordId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed'
): Promise<void> {
  const db = getDatabase();
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(recordId) },
    { $set: { status } }
  );
}

export async function findRecordsByConversationId(conversationId: ConversationID): Promise<Record[]> {
  const db = getDatabase();
  
  const messages = await db.collection(MESSAGES_COLLECTION)
    .find({ relatedToConversationId: new ObjectId(conversationId) })
    .project({ recordID: 1 })
    .toArray();

  const recordIds = messages
    .map(m => m.recordID)
    .filter((id): id is ObjectId => id != null);

  if (recordIds.length === 0) {
    return [];
  }

  const records = await db.collection(COLLECTION)
    .find({ _id: { $in: recordIds } })
    .toArray();

  return records.map((doc: any) => ({
    id: doc._id.toString(),
    eventId: doc.eventId.toString(),
    canalID: doc.canalID.toString(),
    fileName: doc.fileName,
    duration: doc.duration,
    status: doc.status,
    createdAt: doc.createdAt,
  }));
}

export async function findRecordById(recordId: string): Promise<Record | undefined> {
  const db = getDatabase();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(recordId) });

  if (!doc) return undefined;

  return {
    id: doc._id.toString(),
    eventId: doc.eventId.toString(),
    canalID: doc.canalID.toString(),
    fileName: doc.fileName,
    duration: doc.duration,
    status: doc.status,
    createdAt: doc.createdAt,
  };
}

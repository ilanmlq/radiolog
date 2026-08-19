import {
  ConversationID,
  CreateMessageData,
  Message,
  MessageContent,
  MessageID,
  SimpleMessage,
} from './conversation.model';
import { getDatabase } from '../configs/config.database';
import { ObjectId } from 'mongodb';
import { RecordID } from '../records/record.model';
import { MemberID } from '../teams/team.model';
import { ISODateTime } from '../common/common.model';

const COLLECTION = 'messages';

export async function countMessagesForConversation(conversationId: ConversationID): Promise<number> {
  const db = getDatabase();
  return await db.collection(COLLECTION).countDocuments({ relatedToConversationId: new ObjectId(conversationId) });
}

export async function findManyMessagesForConversation(
  conversationId: ConversationID,
  limit: number = 50,
  offset: number = 0
): Promise<Message[]> {
  const db = getDatabase();
  const messages = await db.collection(COLLECTION)
    .find({ relatedToConversationId: new ObjectId(conversationId) })
    .skip(offset)
    .limit(limit)
    .toArray();

  return messages.map((doc: any) => mapToMessage(doc));
}

export async function findAllSimpleMessagesForConversation(conversationId: ConversationID): Promise<SimpleMessage[]> {
  const db = getDatabase();
  const messages = await db.collection(COLLECTION)
    .find({ relatedToConversationId: new ObjectId(conversationId) })
    .project({ content: 1 })
    .toArray();

  return messages.map((doc: any) => ({
    text: doc.content.map((messageContent: MessageContent) => messageContent.text).join(' '),
    sentAt: doc.createdAt
  }));
}

export async function findMessageById(messageId: MessageID): Promise<Message | undefined> {
  const db = getDatabase();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(messageId) });

  if (!doc) return undefined;

  return mapToMessage(doc);
}

export async function addMessageToConversation(data: CreateMessageData): Promise<void> {
  const db = getDatabase();
  const createdAt = data.recordedAt || new Date().toISOString();
  
  const message = {
    recordID: new ObjectId(data.recordID),
    relatedToConversationId: new ObjectId(data.relatedToConversationId),
    fromMemberId: data.fromMemberId ? new ObjectId(data.fromMemberId) : undefined,

    content: data.content,

    createdAt,
    updatedAt: new Date().toISOString(),
  };
  await db.collection(COLLECTION).insertOne(message);
}

export async function moveMessage(messageId: MessageID, targetConvId: ConversationID): Promise<Message | undefined> {
  const db = getDatabase();
  await db.collection(COLLECTION).updateOne({ _id: new ObjectId(messageId) }, {
    $set: {
      relatedToConversationId: new ObjectId(targetConvId),
      updatedAt: new Date(),
    },
  });

  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(messageId) });

  if (!doc) return undefined;

  return mapToMessage(doc);
}


export async function editMessage(messageId: MessageID, content : Message['content']): Promise<Message | undefined> {
  const db = getDatabase();
  await db.collection(COLLECTION).updateOne({ _id: new ObjectId(messageId) }, {
    $set: {
      content,
      updatedAt: new Date(),
    },
  });

  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(messageId) });

  if (!doc) return undefined;

  return mapToMessage(doc);
}

function mapToMessage(data: any): Message {
  return {
    id: data._id.toString(),
    ...(data.recordID ? { recordID: data.recordID.toString() } : {}),
    relatedToConversationId: data.relatedToConversationId?.toString(),
    ...(data.fromMemberId ? { fromMemberId: data.fromMemberId.toString() } : {}),
    content: data.content,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    createdById: data.createdById?.toString(),
    updatedById: data.updatedById?.toString()
  }
}
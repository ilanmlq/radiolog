import { ConversationID, Message, MessageID } from './conversation.model';
import { getDatabase } from '../configs/config.database';
import { ObjectId } from 'mongodb';

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

  return messages.map((doc: any) => ({
    id: doc._id.toString(),
    relatedToConversationId: doc.relatedToConversationId?.toString(),
    fromMemberId: doc.fromMemberId?.toString(),
    content: doc.content,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString()
  }));
}

export async function findMessageById(messageId: MessageID): Promise<Message | undefined> {
  const db = getDatabase();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(messageId) });

  if (!doc) return undefined;

  return {
    id: doc._id.toString(),
    relatedToConversationId: doc.relatedToConversationId?.toString(),
    fromMemberId: doc.fromMemberId?.toString(),
    content: doc.content,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    createdById: doc.createdById?.toString(),
    updatedById: doc.updatedById?.toString()
  };
}

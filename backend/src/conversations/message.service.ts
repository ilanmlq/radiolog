import { PaginatedResult, PaginationParams } from '../common/common.model';
import {
  ConversationID,
  CreateMessageData,
  Message,
  MessageContent,
  MessageID, SimpleMessage,
} from './conversation.model';
import * as database from './message.database';
import { RecordID } from '../records/record.model';
import { MemberID } from '../teams/team.model';


export async function listMessagesForConversation(
  conversationId: ConversationID,
  paginationParams: PaginationParams,
): Promise<PaginatedResult<Message>> {
  const count = await database.countMessagesForConversation(conversationId);
  const messages = await database.findManyMessagesForConversation(conversationId, paginationParams.limit, paginationParams.offset);



  return {
    items: messages,
    total: count,
    limit: paginationParams.limit,
    offset: paginationParams.offset,
  };
}

export async function listAllMessageTextsForConversation(conversationId: ConversationID): Promise<SimpleMessage[]> {
  return await database.findAllSimpleMessagesForConversation(conversationId)
}

export async function addMessageToConversation(recordID: RecordID, conversationId: ConversationID, content: MessageContent[], memberId: MemberID | undefined, recordedAt?: string): Promise<void> {
  let message: CreateMessageData = {
    recordID,
    relatedToConversationId: conversationId,
    content,
  };
  if (memberId) {
    message.fromMemberId = memberId;
  }
  if (recordedAt) {
    message.recordedAt = recordedAt;
  }
  await database.addMessageToConversation(message);
}

export async function exportMessage(
  messageId: MessageID,
  targetConvId: ConversationID
): Promise<Message | undefined> {

  const message = await database.findMessageById(messageId);
  if (!message) {
    return undefined;
  }

  const messageMoved = await database.moveMessage(messageId, targetConvId);
  return messageMoved;
}

export async function editMessage(
  messageId: MessageID,
  newContent: Message['content']
): Promise<Message | undefined> {

  const message = await database.editMessage(messageId, newContent);
  return message;
}
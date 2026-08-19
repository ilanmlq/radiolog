import { PaginatedResult, PaginationParams } from '../common/common.model';
import {
  Conversation,
  ConversationID,
  CreateConversationData,
  Criticality,
  MessageContent, SimpleMessage, UpdateConversationData,
} from './conversation.model';
import { getActiveEventId } from '../organisations/organisation.service';
import { getConversationCriticality } from '../incidents/incident.service';
import * as database from './conversation.database';
import { CanalID } from '../canals/canal.model';
import { findAllSimpleMessagesForConversation } from './message.database';
import { NotFoundError } from '../utils/errors';

export async function listConversations(
  paginationParams: PaginationParams,
): Promise<PaginatedResult<Conversation>> {
  const activeEventId = await getActiveEventId();
  if (!activeEventId) {
    throw new Error('No active event found for the current organisation.');
  }
  const count = await database.countConversations(activeEventId);
  const conversations = await database.findManyConversations(activeEventId, paginationParams.limit, paginationParams.offset);
const conversationsWithCriticality = await Promise.all(
  conversations.map(async (conversation) => {
    const criticality = await getConversationCriticality(
      conversation.conversationId
    );

    conversation.criticality = await numberToCriticality(criticality);

    return conversation;
  })
);
  return ({
    items: conversationsWithCriticality,
    total: count,
    limit: paginationParams.limit,
    offset: paginationParams.offset,
  });
}

export async function listConversationsByCanal(
  canalID: CanalID,
  paginationParams: PaginationParams,
): Promise<PaginatedResult<Conversation>> {
  const count = await database.countConversationsByCanal(canalID);
  const conversations = await database.findManyConversationsByCanal(canalID, paginationParams.limit, paginationParams.offset);

  const conversationsWithCriticality = await Promise.all(
    conversations.map(async (conversation) => {
      const criticality = await getConversationCriticality(conversation.conversationId);
      conversation.criticality = await numberToCriticality(criticality);
      return conversation;
    })
  );

  return {
    items: conversationsWithCriticality,
    total: count,
    limit: paginationParams.limit,
    offset: paginationParams.offset,
  };
}

export async function getLastConversations(
  canalID: CanalID,
  limit: number,
): Promise<{ conversation: Conversation, messages: SimpleMessage[] }[]> {
  const conversations = await database.findLastConversations(canalID, limit);
  return await Promise.all(conversations.map(async (conversation) => {
    const messages = await findAllSimpleMessagesForConversation(conversation.conversationId);
    return {
      conversation,
      messages: messages
    };
  }));
}

export async function getConversation(conversationId: ConversationID): Promise<Conversation> {
  return await database.findConversationById(conversationId);
}

export async function createConversation(canalID: CanalID, summary: string): Promise<Conversation> {
  const activeEventId = await getActiveEventId();
  if (!activeEventId) {
    throw new Error('No active event found for the current organisation.');
  }

  const conversation: CreateConversationData = {
    eventId: activeEventId,
    canalID,
    summary,
  };
  return await database.addConversation(conversation);
}

export async function updateConversation(conversationId: ConversationID, messageContent: MessageContent[], summary: string, criticality: Criticality | null = null): Promise<Conversation> {
  const conversation: UpdateConversationData = {
    memberIds: messageContent.filter(content => content.memberId).map(content => content.memberId!) as string[],
    summary,
    criticality,
  };
  const updatedConversation = await database.updateConversation(conversationId, conversation);
  if (!updatedConversation) {
    throw new NotFoundError(`Conversation with id ${conversationId} not found`);
  }
  return updatedConversation;
}

async function numberToCriticality(criticality?: number): Promise<Criticality | null> {
  switch (criticality) {
    case 1:
      return "low"
    case 2:
      return "medium";
    case 3:
      return "high";
    case 0:
    case null:
      return null;
    default:
      throw new Error(`Invalid criticality value: ${criticality}`);
  }
}



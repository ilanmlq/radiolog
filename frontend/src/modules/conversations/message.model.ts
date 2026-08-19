import { AuditFields } from '@/modules/common.model.ts';
import { ConversationID } from './conversation.model';

export type MessageID = string;

export interface MessageContentPart {
  text: string;
  placeId?: string;
  teamId?: string;
  memberId?: string;
}

export interface ChatMessage extends AuditFields {
  id: MessageID;
  recordID?: string;
  relatedToConversationId: ConversationID;
  fromMemberId?: string;
  content: MessageContentPart[];
}

export interface EditMessageDTO {
  content: string;
}

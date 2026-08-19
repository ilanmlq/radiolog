import { AuditFields, ISODateTime } from '../common/common.model';
import { EventID } from '../events/event.model';
import { CanalID } from '../canals/canal.model';
import { MemberID, TeamID } from '../teams/team.model';
import { RecordID } from '../records/record.model';
import { PlaceID } from '../places/place.model';
import { ObjectId } from 'mongodb';

export type ConversationID = ObjectId | string;
export type MessageID = string;

export type Criticality = 'low' | 'medium' | 'high';

export interface Conversation extends AuditFields {
  conversationId: ConversationID;
  eventId: EventID;
  canalID: CanalID;

  memberIds: MemberID[];

  summary: string;
  criticality?: Criticality | null;
}

export interface CreateConversationData {
  eventId: EventID;
  canalID: CanalID;

  summary: string;
}

export interface UpdateConversationData {
  memberIds: MemberID[];

  summary: string;
  criticality?: Criticality | null;
}

export interface Message extends AuditFields {
  id: MessageID;

  recordID?: RecordID;
  relatedToConversationId: ConversationID;
  fromMemberId?: MemberID;

  content: MessageContent[];
}

export interface CreateMessageData {
  recordID: RecordID;
  relatedToConversationId: ConversationID;
  fromMemberId?: MemberID;

  content: MessageContent[];
  recordedAt?: ISODateTime;
}

export interface MessageContent {
  placeId?: PlaceID;
  teamId?: TeamID;
  memberId?: MemberID;

  text: string;
}

export interface SimpleMessage {
  text: string;
  sentAt: ISODateTime;
}
import { AuditFields } from '@/modules/common.model.ts';
import { CanalID } from '@/modules/canals/canal.model';

export type ConversationID = string;
export type Criticality = "low" | "medium" | "high";

export interface ConversationSummary extends AuditFields {
  id: ConversationID;
  summary: string;
  criticality?: Criticality;
  canalID: CanalID;
}

export interface Conversation extends ConversationSummary {
  eventId: string;
  memberIds: string[];
}

export interface CreateConversationDTO {
  canalID: CanalID;
  memberIds: string[];
  summary: string;
  criticality?: Criticality;
}

export interface UpdateConversationDTO {
  memberIds?: string[];
  summary?: string;
  criticality?: Criticality;
}

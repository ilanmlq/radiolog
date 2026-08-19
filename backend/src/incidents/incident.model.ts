import { ObjectId } from "mongodb";
import { AuditFields } from "../common/common.model";
import { PlaceID } from "../places/place.model";
import { ConversationID } from "../conversations/conversation.model";
import { UserID } from "../users/user.model";
import { StatusID } from "../status/status.model";

export type IncidentID = ObjectId | string;

export interface IncidentSummary {
  id: IncidentID;
  placeId: PlaceID;
  conversationId?: ConversationID;
  criticality: number;
  description?: string;
  statusId: StatusID;
}

export interface Incident extends IncidentSummary, AuditFields { }

export interface CreateIncidentData {
  placeId: PlaceID;
  conversationId?: ConversationID;
  criticality: number;
  description?: string;
  statusId: StatusID;
  createdById: UserID;
}

export interface UpdateIncidentData {
  criticality?: number;
  description?: string;
  updatedById: UserID;
}
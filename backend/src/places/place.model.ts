import { ObjectId } from 'mongodb';
import { AuditFields } from '../common/common.model';
import { EventID } from '../events/event.model';
import { CategoryID } from '../categories/category.model';
import { UserID } from '../users/user.model';

export type PlaceID = ObjectId | string;

export interface PlaceSumary {
  id: PlaceID;
  eventId: EventID;
  categoryId: CategoryID;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
}

export interface Place extends PlaceSumary, AuditFields { }

export interface CreatePlaceData {
  categoryId: CategoryID;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;

  createdById: UserID;
}

export interface UpdatePlaceData {
  name: string;
  description?: string;

  updatedById: UserID;
}
import { ObjectId } from 'mongodb';
import { AuditFields, ISODateTime } from '../common/common.model';
import { OrganisationID } from '../organisations/organisation.model';

export type UserID = ObjectId | string;
export type Auth0ID = string;

export interface User extends AuditFields {
  id: UserID;
  auth0Id: Auth0ID;
  organisationId: OrganisationID;

  name: string;
  email: string;
  isAdmin: boolean;

  lastLoginAt?: ISODateTime;
}
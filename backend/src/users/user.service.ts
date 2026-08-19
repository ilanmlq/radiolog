import { ISODateTime, PaginatedResult, PaginationParams } from '../common/common.model';
import { User, UserID } from './user.model';
import * as auth from '../auth0/auth0.service';
import { OrganisationID } from '../organisations/organisation.model';
import { getOrganisationId } from '../organisations/organisation.service';
import { Auth0User } from '../auth0/auth0.model';


export async function listUsers(
  paginationParams: PaginationParams,
): Promise<PaginatedResult<User>> {
  const response = await auth.findManyUsers(paginationParams);
  const organisationId = await getOrganisationId();
  return ({
    items: response.users.map(user => mapAuth0UserToUser(user, organisationId)),
    total: response.total,
    limit: response.limit,
    offset: response.start,
  });
}

// TODO : replace hardcoded auth0Id with actual connected user info from auth guard
export async function getConnectedUser(): Promise<User> {
  const auth0user = await auth.findUserById("auth0|69a5b8d3a37f11bb4e72a242");
  if (!auth0user) {
    throw new Error('Connected user not found');
  }
  const organisationId = await getOrganisationId();
  return mapAuth0UserToUser(auth0user, organisationId);
}

export async function getConnectedUserId(): Promise<UserID> {
  const user = await getConnectedUser();
  if (!user) {
    throw new Error('Connected user not found');
  }
  console.log('getConnectedUser:', user   );
  return user.id;
}

function mapAuth0UserToUser(auth0User: Auth0User, organisationId: OrganisationID): User {
  console.log(auth0User);
  const user = {
    id: auth0User.identities[0]?.user_id || auth0User.user_id,
    auth0Id: auth0User.user_id,
    organisationId,
    name: auth0User.name,
    email: auth0User.email,
    isAdmin: (auth0User.app_metadata?.roles || []).includes('admin'),
    createdAt: mapAuth0DateToISODateTime(auth0User.created_at),
    updatedAt: mapAuth0DateToISODateTime(auth0User.updated_at),
  };
  if (auth0User.last_login) {
    return {
      ...user,
      lastLoginAt: mapAuth0DateToISODateTime(auth0User.last_login),
    };
  }
  return user;
}

function mapAuth0DateToISODateTime(dateString: string): ISODateTime {
  return dateString?.replace(/\.\d{3}Z$/, "Z")
}
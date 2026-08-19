import { Auth0User, Auth0UserResponse, Token } from './auth0.model';
import { PaginationParams } from '../common/common.model';
import { logMessage } from '../utils/logger';

export async function getToken(): Promise<Token> {
  try {
    const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        "client_id": process.env.AUTH0_CLIENT_ID,
        "client_secret": process.env.AUTH0_CLIENT_SECRET,
        "audience": process.env.AUTH0_BACKEND_AUDIENCE,
        "grant_type": "client_credentials"
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get token: ' + response.status);
    }

    return await response.json();
  } catch (error) {
    logMessage('error', 'auth0.service', `Failed to get token: ${error}`);
    throw error;
  }
}

const USER_API_URL = `https://${process.env.AUTH0_DOMAIN}/api/v2/users`;

export async function findUserById(userId: string): Promise<Auth0User> {
  const token = await getToken();
  const url = `${USER_API_URL}/${encodeURIComponent(userId)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });

  if (!response.ok) {
    logMessage('error', 'auth0.service', `Failed to fetch user by ID: ${response.status} ${response.statusText}`);
    throw new Error('Failed to fetch user by ID');
  }

  return await response.json();
}

export async function findManyUsers(
  paginationParams: PaginationParams
): Promise<Auth0UserResponse> {
  const token = await getToken();
  const { limit, offset, query, sortBy, sortOrder } = paginationParams;
  const q = encodeURIComponent(query || '');
  const perPage = limit;
  const page = Math.floor(offset / limit);
  const sort = `${sortBy || 'name'}:${sortOrder === 'asc' ? 1 : -1}`;
  const url = `${USER_API_URL}?search_engine=v3&include_totals=true&q=${q}&per_page=${perPage}&page=${page}&sort=${sort}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });

  if (!response.ok) {
    logMessage('error', 'auth0.service', `Failed to fetch users: ${response.status} ${response.statusText}`);
    throw new Error('Failed to fetch users');
  }

  return await response.json();
}

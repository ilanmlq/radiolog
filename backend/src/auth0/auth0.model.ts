export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface Auth0UserResponse {
  start: number;
  limit: number;
  length: number;
  total: number;
  users: Auth0User[];
}

interface Identities {
  connection: string;
  provider: string;
  user_id: string;
  isSocial: boolean;
}

export interface Auth0User {
  created_at: string;
  email: string;
  email_verified: boolean;
  identities: Identities[];
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
  user_id: string;
  user_metadata: {};
  app_metadata: { organisationId: number, roles: [ 'admin' ] };
  last_ip: string;
  last_login: string;
  logins_count: number;
}
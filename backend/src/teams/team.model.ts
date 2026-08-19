import { Address, AuditFields } from '../common/common.model';
import { EventID } from '../events/event.model';
import { CanalID } from '../canals/canal.model';
import { UserID } from '../users/user.model';

export type TeamID = string;
export type MemberID = string;

export interface Team extends AuditFields {
  id: TeamID;
  eventId: EventID;
  parentTeamId?: TeamID;
  canalId?: CanalID;

  name: string;
  teamLeaders: Array<MemberID>;
  description?: string;
}

export interface CreateTeamData {
  eventId: EventID;
  parentTeamId?: TeamID | undefined;
  canalId?: CanalID | undefined;

  name: string;
  teamLeaders: Array<MemberID>;
  description?: string | undefined;
  createdById: UserID;
}

export interface UpdateTeamData {
  eventId?: EventID | undefined;
  parentTeamId?: TeamID | undefined;
  canalId?: CanalID | undefined;

  name?: string | undefined;
  teamLeaders?: Array<MemberID> | undefined;
  description?: string | undefined;
  updatedById: UserID;
}

export interface Member extends AuditFields {
  id: MemberID;
  eventId: EventID;
  teamId: TeamID[];
  userId?: UserID;

  name: string;
  surnames: string[]

  email: string[];
  phone: string[];
  address?: Address;

  roleTitles: string[];
}

export interface CreateMemberData {
  eventId: EventID;
  teamId: TeamID[];
  userId?: UserID | undefined;

  name: string;
  surnames: string[]

  email: string[];
  phone: string[];
  address?: Address | undefined;

  roleTitles: string[];
  createdById: UserID;
}

export interface UpdateMemberData {
  eventId?: EventID | undefined;
  teamId?: TeamID[] | undefined
  userId?: UserID | undefined;
  name?: string | undefined;
  surnames?: string[] | undefined;

  email?: string[] | undefined;
  phone?: string[] | undefined;
  address?: Address | undefined;

  roleTitles?: string[] | undefined;
  updatedById: UserID;
}

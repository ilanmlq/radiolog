import { PaginatedResult, PaginationParams } from '../common/common.model';
import { CreateMemberData, Member, MemberID, TeamID, UpdateMemberData } from './team.model';
import { getActiveEventId } from '../organisations/organisation.service';
import * as database from './member.database';
import { ConflictError, NotFoundError } from '../utils/errors';

export async function listAllMembers(
  paginationParams: PaginationParams,
): Promise<PaginatedResult<Member>> {
  const count = await database.countMembers();
  const members = await database.findManyMembers(undefined, paginationParams.limit, paginationParams.offset);
  return ({
    items: members,
    total: count,
    limit: paginationParams.limit,
    offset: paginationParams.offset,
  });
}

export async function listMembersForTeam(
  teamId: TeamID,
  paginationParams: PaginationParams,
): Promise<PaginatedResult<Member>> {
  const count = await database.countMembers([teamId]);
  // const members = await database.findManyMembers([teamId], paginationParams.limit, paginationParams.offset);
  const members = await database.findManyMembers([teamId], paginationParams.limit, paginationParams.offset)
  return ({
    items: members,
    total: count,
    limit: paginationParams.limit,
    offset: paginationParams.offset,
  });
}

export async function listAllMemberSummaries(): Promise<Partial<Member>[]> {
  const activeEventId = await getActiveEventId();
  if (!activeEventId) {
    throw new Error('No active event found for the current organisation.');
  }
  return await database.findAllMemberSummaries(activeEventId);
}

export async function getMember(memberId: MemberID): Promise<Member | undefined> {
  const activeEventId = await getActiveEventId();
  if (!activeEventId) {
    throw new Error('No active event found for the current organisation.');
  }
  return await database.findMemberById(activeEventId, memberId);
}

export async function createMember(data: CreateMemberData): Promise<Member> {
  if (await database.findMemberByEmail(data.email)) {
    throw new ConflictError(`Member with email ${data.email} already exists`);
  }
  if (await database.findMemberByPhone(data.phone)) {
    throw new ConflictError(`Member with phone ${data.phone} already exists`);
  }
  return await database.createMember(data);
}

export async function updatedMember(memberId: MemberID, data: UpdateMemberData): Promise<Member> {
  const existingMember = await getMember(memberId);
  if (!existingMember) {
    throw new NotFoundError(`Member with id ${memberId} not found`);
  }
  if (data.email) {
    if (existingMember.email !== data.email) {
      const memberWithSameEmail = await database.findMemberByEmail(data.email);
      if (memberWithSameEmail) {
        throw new ConflictError(`Member with email ${data.email} already exists`);
      }
    }
  }
  if (data.phone) {
    if (existingMember.phone !== data.phone) {
      const memberWithSamePhone = await database.findMemberByPhone(data.phone);
      if (memberWithSamePhone) {
        throw new ConflictError(`Member with phone ${data.phone} already exists`);
      }
    }  
  }
  
  const updateMember = await database.updateMember(memberId, data);
  if (!updateMember) {
    throw new NotFoundError(`Member with id ${memberId} not found during update`);
  }
  return updateMember;
}
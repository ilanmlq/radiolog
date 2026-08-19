import { PaginatedResult, PaginationParams } from '../common/common.model';
import { CreateTeamData, Team, TeamID, UpdateTeamData } from './team.model';
import * as database from './team.database';
import { getActiveEventId } from '../organisations/organisation.service';
import { ConflictError, NotFoundError } from '../utils/errors';

export async function listTeams(
  paginationParams: PaginationParams,
): Promise<PaginatedResult<Team>> {
  const activeEventId = await getActiveEventId();
  if (!activeEventId) {
    throw new Error('No active event found for the current organisation.');
  }
  const count = await database.countTeams(activeEventId);
  const teams = await database.findManyTeams(activeEventId, paginationParams.limit, paginationParams.offset);
  return ({
    items: teams,
    total: count,
    limit: paginationParams.limit,
    offset: paginationParams.offset,
  });
}

export async function listAllTeamSummaries(): Promise<Partial<Team>[]> {
  const activeEventId = await getActiveEventId();
  if (!activeEventId) {
    throw new Error('No active event found for the current organisation.');
  }
  return await database.findAllTeamSummaries(activeEventId);
}

export async function getTeam(teamId: TeamID): Promise<Team | undefined> {
  const activeEventId = await getActiveEventId();
  if (!activeEventId) {
    throw new Error('No active event found for the current organisation.');
  }
  return await database.findTeamById(activeEventId, teamId);
}

export async function createTeam(data: CreateTeamData): Promise<Team> {
  if (await database.findTeamByName(data.name)) {
    throw new ConflictError(`Team with name ${data.name} already exists`);
  }
  return await database.createTeam(data);
}

export async function updateTeam(teamId: TeamID, data: UpdateTeamData): Promise<Team> {
  const existingTeam = await getTeam(teamId);
  if (!existingTeam) {
    throw new NotFoundError(`Team with id ${teamId} not found`);
  }

  if(data.name) {
    if (existingTeam.name !== data.name) {
      const teamWithSameName = await database.findTeamByName(data.name);
      if (teamWithSameName) {
        throw new ConflictError(`Team with name ${data.name} already exists`);
      }
    }
  }

  const updatedTeam = await database.updateTeam(teamId, data);
  if (!updatedTeam) {
    throw new NotFoundError(`Team with id ${teamId} not found during update`);
  }
  return updatedTeam;
}
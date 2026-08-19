import { Response, Router } from 'express';
import { PaginatedResult } from '../common/common.model';
import { Team, Member } from './team.model';
import { listTeams, getTeam, createTeam, updateTeam } from './team.service';
import { listMembersForTeam } from './member.service';
import { validateBody, validateParams, validateQuery } from '../middlewares/schema-validator';
import { PaginationParams, paginationParamsSchema } from '../middlewares/paging.validator';
import { CreateTeamInput, createTeamSchema, TeamParams, teamParamsSchema, UpdateTeamInput, updateTeamSchema } from './team.validator';
import { AuthenticatedRequest, authGuard } from '../middlewares/auth.guard';
import { requirePermissions } from '../middlewares/require-permissions';
import { Permissions } from '../utils/permissions';
import { getConnectedUserId } from '../users/user.service';

const teamRoutes = Router();

teamRoutes.use(authGuard);

teamRoutes.get(
  '/',
  requirePermissions([Permissions.READ_DATA]),
  validateQuery(paginationParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const paginationParams = request.parsedQuery as PaginationParams;
    const teams: PaginatedResult<Team> = await listTeams(paginationParams);
    response.status(200).json(teams);
  }
);

teamRoutes.get(
  '/:teamId',
  requirePermissions([Permissions.READ_DATA]),
  validateParams(teamParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { teamId } = request.parsedParams as TeamParams;
    const team = await getTeam(teamId);
    response.status(200).json(team);
  }
);

teamRoutes.get(
  '/:teamId/members',
  requirePermissions([Permissions.READ_DATA]),
  validateParams(teamParamsSchema),
  validateQuery(paginationParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { teamId } = request.parsedParams as TeamParams;
    const paginationParams = request.parsedQuery as PaginationParams;
    const members: PaginatedResult<Member> = await listMembersForTeam(teamId, paginationParams);
    response.status(200).json(members);
  }
);

teamRoutes.post(
  '/',
  requirePermissions([Permissions.WRITE_DATA]),
  validateBody(createTeamSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const data = request.parsedBody as CreateTeamInput;
    const connectedUserId = await getConnectedUserId();
    const newTeam = await createTeam({...data, createdById: connectedUserId });
    response.status(201).json(newTeam);
  }
);

teamRoutes.put(
  '/:teamId',
  requirePermissions([Permissions.WRITE_DATA]),
  validateParams(teamParamsSchema),
  validateBody(updateTeamSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { teamId } = request.parsedParams as TeamParams;
    const data = request.parsedBody as UpdateTeamInput;
    const connectedUserId = await getConnectedUserId();
    const updatedTeam = await updateTeam(teamId, {...data, updatedById: connectedUserId });
    response.status(201).json(updatedTeam);
  }
);

export default teamRoutes;

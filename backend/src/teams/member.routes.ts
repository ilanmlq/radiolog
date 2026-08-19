import { Response, Router } from 'express';
import { PaginatedResult } from '../common/common.model';
import { Member } from './team.model';
import { listAllMembers, getMember, createMember, updatedMember } from './member.service';
import { validateBody, validateParams, validateQuery } from '../middlewares/schema-validator';
import { PaginationParams, paginationParamsSchema } from '../middlewares/paging.validator';
import {
  CreateMemberInput,
  createMemberSchema,
  MemberParams,
  memberParamsSchema,
  UpdateMemberInput,
  updateMemberSchema,
} from './member.validator';
import { AuthenticatedRequest, authGuard } from '../middlewares/auth.guard';
import { requirePermissions } from '../middlewares/require-permissions';
import { Permissions } from '../utils/permissions';
import { getConnectedUserId } from '../users/user.service';

const memberRoutes = Router();

memberRoutes.use(authGuard);

memberRoutes.get(
  '/',
  requirePermissions([Permissions.READ_DATA]),
  validateQuery(paginationParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const paginationParams = request.parsedQuery as PaginationParams;
    const members: PaginatedResult<Member> = await listAllMembers(paginationParams);
    response.status(200).json(members);
  }
);

memberRoutes.get(
  '/:memberId',
  requirePermissions([Permissions.READ_DATA]),
  validateParams(memberParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { memberId } = request.parsedParams as MemberParams;
    const member = await getMember(memberId);
    response.status(200).json(member);
  }
);
  
memberRoutes.post(
  '/',
  requirePermissions([Permissions.WRITE_DATA]),
  validateBody(createMemberSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const data = request.parsedBody as CreateMemberInput;
    const connectedUserId = await getConnectedUserId();
    const newMember = await createMember({...data, createdById: connectedUserId });
    response.status(201).json(newMember);
  }
);

memberRoutes.put(
  '/:memberId',
  requirePermissions([Permissions.WRITE_DATA]),
  validateParams(memberParamsSchema),
  validateBody(updateMemberSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { memberId } = request.parsedParams as MemberParams;
    const data = request.parsedBody as UpdateMemberInput;
    const connectedUserId = await getConnectedUserId();
    const updateMember = await updatedMember(memberId, {...data, updatedById: connectedUserId });
    response.status(200).json(updateMember);
  }
);



export default memberRoutes;

import { Response, Router } from 'express';
import { PaginatedResult } from '../common/common.model';
import { Conversation } from './conversation.model';
import { listConversations, listConversationsByCanal } from './conversation.service';
import { listMessagesForConversation, exportMessage, editMessage } from './message.service';
import { validateBody, validateParams, validateQuery } from '../middlewares/schema-validator';
import { PaginationParams, paginationParamsSchema } from '../middlewares/paging.validator';
import {
  CanalParams,
  ConversationParams,
  EditMessageBody,
  EditMessageParams,
  ExportMessageParams,
  canalParamsSchema,
  conversationParamsSchema,
  editMessageBodySchema,
  editMessageParamsSchema,
  exportMessageParamsSchema,
} from './conversation.validator';
import { AuthenticatedRequest, authGuard } from '../middlewares/auth.guard';
import { requirePermissions } from '../middlewares/require-permissions';
import { Permissions } from '../utils/permissions';


const conversationRoutes = Router();

conversationRoutes.use(authGuard);

conversationRoutes.get(
  '/',
  requirePermissions([Permissions.READ_DATA]),
  validateQuery(paginationParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const paginationParams = request.parsedQuery as PaginationParams;
    const conversations: PaginatedResult<Conversation> = await listConversations(paginationParams);
    response.status(200).json(conversations);
  }
);

conversationRoutes.get(
  '/canals/:canalId',
  requirePermissions([Permissions.READ_DATA]),
  validateParams(canalParamsSchema),
  validateQuery(paginationParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { canalId } = request.parsedParams as CanalParams;
    const paginationParams = request.parsedQuery as PaginationParams;
    const conversations: PaginatedResult<Conversation> = await listConversationsByCanal(canalId, paginationParams);
    response.status(200).json(conversations);
  }
);

conversationRoutes.get(
  '/:conversationId/messages',
  requirePermissions([Permissions.READ_DATA]),
  validateParams(conversationParamsSchema),
  validateQuery(paginationParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { conversationId } = request.parsedParams as ConversationParams;
    const paginationParams = request.parsedQuery as PaginationParams;
    const messages = await listMessagesForConversation(conversationId, paginationParams);
    response.status(200).json(messages);
  }
);

conversationRoutes.put(
  '/messages/move/:messageId/:conversationId',
  requirePermissions([Permissions.WRITE_DATA]),
  validateParams(exportMessageParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { messageId, conversationId } = request.parsedParams as ExportMessageParams;
    const messages = await exportMessage(messageId, conversationId);
    if (messages == undefined) {
      response.status(400);
    }
    else {
      response.status(201).json(messages);
    }
  }
)

conversationRoutes.put(
  '/messages/edit/:messageId',
  requirePermissions([Permissions.WRITE_DATA]),
  validateParams(editMessageParamsSchema),
  validateBody(editMessageBodySchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { messageId } = request.parsedParams as EditMessageParams;
    const { content } = request.parsedBody as EditMessageBody;
    const newContentArray = [{ text: content }];
    const message = await editMessage(messageId, newContentArray);
    if (message == undefined) {
      response.status(404).json({ error: 'Message not found' });
    }
    else {
      response.status(200).json(message);
    }
  }
)

export default conversationRoutes;
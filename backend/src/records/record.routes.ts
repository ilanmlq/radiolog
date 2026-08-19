import { Response, Router } from 'express';
import { Record } from './record.model';
import { addRecord, processRecord, getRecordsByConversationId, getRecordAudioStream } from './record.service';
import { validateBody, validateParams } from '../middlewares/schema-validator';
import { CreateRecordInput, createRecordSchema, ConversationParams, conversationParamsSchema, RecordParams, recordParamsSchema } from './record.validator';
import { AuthenticatedRequest, authGuard } from '../middlewares/auth.guard';
import { getCanalDetailsFromNumber } from '../canals/canal.service';
import { requirePermissions } from '../middlewares/require-permissions';
import { Permissions } from '../utils/permissions';
import { pipeline } from 'stream/promises';

const recordRoutes = Router();

recordRoutes.post(
  '/',
  validateBody(createRecordSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const data = request.parsedBody as CreateRecordInput;
    const canal = await getCanalDetailsFromNumber(data.canalNumber);
    const newRecord: Record = await addRecord({ ...data, canalID: canal.id });
    await processRecord(newRecord);
    response.status(201).json(newRecord);
  }
);

recordRoutes.get(
  '/conversation/:conversationId',
  authGuard,
  requirePermissions([Permissions.READ_DATA]),
  validateParams(conversationParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { conversationId } = request.parsedParams as ConversationParams;
    const records: Record[] = await getRecordsByConversationId(conversationId);
    response.status(200).json(records);
  }
);

recordRoutes.get(
  '/:recordId/audio',
  // TODO Use token instead of authGuard,
  // requirePermissions([Permissions.READ_DATA]),
  validateParams(recordParamsSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { recordId } = request.parsedParams as RecordParams;
    
    try {
      const { stream, sftp, fileName, mimeType } = await getRecordAudioStream(recordId);
      
      response.setHeader('Content-Type', mimeType);
      response.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      
      stream.on('error', async (error) => {
        console.error('Stream error:', error);
        await sftp.end();
        if (!response.headersSent) {
          response.status(500).json({ error: 'Error streaming audio file' });
        }
      });

      stream.on('end', async () => {
        await sftp.end();
      });

      await pipeline(stream, response);
    } catch (error) {
      console.error('Error streaming audio:', error);
      if (!response.headersSent) {
        response.status(500).json({ error: 'Failed to stream audio file' });
      }
    }
  }
);

export default recordRoutes;

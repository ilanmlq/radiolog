import { z } from 'zod';

export const conversationParamsSchema = z.object({
  conversationId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export const recordParamsSchema = z.object({
  recordId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export const createRecordSchema = z.object({
  canalNumber: z.number().int().positive(),
  fileName: z.string().nonempty(),
  duration: z.number().positive(),
});

export type ConversationParams = z.infer<typeof conversationParamsSchema>;
export type RecordParams = z.infer<typeof recordParamsSchema>;
export type CreateRecordInput = z.infer<typeof createRecordSchema>;

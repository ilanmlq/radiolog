import { z } from 'zod';

export const conversationParamsSchema = z.object({
  conversationId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export const canalParamsSchema = z.object({
  canalId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export const exportMessageParamsSchema = z.object({
  messageId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  conversationId: z.string().regex(/^[0-9a-fA-F]{24}$/),
})

export const editMessageParamsSchema = z.object({
  messageId: z.string().regex(/^[0-9a-fA-F]{24}$/)
})

export const editMessageBodySchema = z.object({
  content: z.string().min(1)
})

export type ConversationParams = z.infer<typeof conversationParamsSchema>;
export type CanalParams = z.infer<typeof canalParamsSchema>;
export type ExportMessageParams = z.infer<typeof exportMessageParamsSchema>;
export type EditMessageParams = z.infer<typeof editMessageParamsSchema>;
export type EditMessageBody = z.infer<typeof editMessageBodySchema>;


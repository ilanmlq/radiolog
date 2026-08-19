import { z } from 'zod';

export const paginationParamsSchema = z.object({
  query: z.string().optional().default(''),
  limit: z.coerce.number().int().positive().default(20),
  offset: z.coerce.number().int().min(0).default(0),
  sortBy: z.string().optional().default('id'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export type PaginationParams = z.infer<typeof paginationParamsSchema>;
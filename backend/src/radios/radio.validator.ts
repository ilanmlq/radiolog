import { z } from 'zod';

// Schema for route parameters when getting a single radio
export const radioParamsSchema = z.object({
  radioId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

// Types TypeScript inférés des schémas
export type RadioParams = z.infer<typeof radioParamsSchema>;

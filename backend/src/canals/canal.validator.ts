import { z } from 'zod';

export const canalParamsSchema = z.object({
  canalId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

// Schéma de validation pour la création d'un canal
export const createCanalSchema = z.object({
  number: z.number().int().positive(),
  name: z.string().min(1).max(100).trim(),
  description: z.string().max(500).trim().default(''),
});

export const updateCanalSchema = z.object({
  number: z.number().int().positive(),
  name: z.string().min(1).max(100).trim(),
  description: z.string().max(500).trim().default(''),
});

export type CanalParams = z.infer<typeof canalParamsSchema>;
export type CreateCanalInput = z.infer<typeof createCanalSchema>;
export type UpdateCanalInput = z.infer<typeof updateCanalSchema>;


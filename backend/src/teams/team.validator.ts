import { z } from 'zod';

// Schéma de validation pour le paramètre teamId
export const teamParamsSchema = z.object({
  teamId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

// Schéma de validation pour la création d'une équipe
export const createTeamSchema = z.object({
  eventId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  parentTeamId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  canalId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  name: z.string().min(1).max(255).trim(),
  teamLeaders: z.array(
    z.string().regex(/^[0-9a-fA-F]{24}$/)
  ).min(1),
  description: z.string().max(1000).trim().optional(),
});

// Schéma de validation pour la mise à jour d'une équipe
export const updateTeamSchema = z.object({
  eventId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  parentTeamId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  canalId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  name: z.string().min(1).max(255).trim().optional(),
  teamLeaders: z.array(
    z.string().regex(/^[0-9a-fA-F]{24}$/)
  ).min(1).optional(),
  description: z.string().max(1000).trim().optional(),
});

// Types TypeScript inférés des schémas
export type TeamParams = z.infer<typeof teamParamsSchema>;
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;

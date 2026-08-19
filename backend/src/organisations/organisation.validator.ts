import { z } from 'zod';

// Schéma de validation pour définir l'événement actif
export const setActiveEventSchema = z.object({
  activeEventId: z.string().regex(/^[0-9a-fA-F]{24}$/).nullable(),
});

// Schéma de validation pour la mise à jour d'une organisation
export const updateOrganisationSchema = z.object({
  name: z.string().min(1).max(255).trim().optional(),
  description: z.string().max(1000).trim().optional(),
});

// Types TypeScript inférés des schémas
export type SetActiveEventInput = z.infer<typeof setActiveEventSchema>;
export type UpdateOrganisationInput = z.infer<typeof updateOrganisationSchema>;

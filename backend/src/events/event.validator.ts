import { ObjectId } from 'mongodb';
import { z } from 'zod';

// Schéma de validation pour le paramètre eventId
export const eventParamsSchema = z.object({
  eventId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

// Schéma de validation pour la création d'un événement
export const createEventSchema = z.object({
  name: z.string().min(1).max(255).trim(),
  description: z.string().max(1000).trim().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string().max(255).trim().optional(),
  organisationId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

// Schéma de validation pour la mise à jour d'un événement
export const updateEventSchema = z.object({
  name: z.string().min(1).max(255).trim().optional(),
  description: z.string().max(1000).trim().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  location: z.string().max(255).trim().optional(),
});

// Types TypeScript inférés des schémas
export type EventParams = z.infer<typeof eventParamsSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

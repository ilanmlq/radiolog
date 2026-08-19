import { z } from 'zod';

const objectIdValidation = z.string().regex(/^[0-9a-fA-F]{24}$/);
const descriptionValidation = z.string().max(1000).trim();
const criticalityValidation = z.coerce.number().gte(1).lte(3).and(z.number().int());

export const incidentParamsSchema = z.object({
    incidentId: objectIdValidation,
});

// Schéma de validation pour la criticité
export const incidentCriticalitySchema = z.object({
    criticality: criticalityValidation,
});

// Schéma de validation pour la création d'un incident
export const createIncidentDTOSchema = z.object({
    placeId: objectIdValidation,
    conversationId: objectIdValidation.optional().default(''),
    criticality: criticalityValidation,
    description: descriptionValidation,
    statusId: objectIdValidation,
});

// Schéma de validation pour la mise à jour d'un incident
export const updateIncidentDTOSchema = z.object({
    criticality: criticalityValidation,
    description: descriptionValidation,
});

export type IncidentParams = z.infer<typeof incidentParamsSchema>;
export type IncidentCriticality = z.infer<typeof incidentCriticalitySchema>;
export type CreateIncidentDTO = z.infer<typeof createIncidentDTOSchema>;
export type UpdateIncidentDTO = z.infer<typeof updateIncidentDTOSchema>;
import { z } from 'zod';

const objectIdValidation = z.string().regex(/^[0-9a-fA-F]{24}$/);
const resolveValidation = z.boolean();
const descriptionValidation = z.string().max(1000).trim() ;

export const statusParamsSchema = z.object({
    statusId: objectIdValidation,
});

export const createStatusDTOSchema = z.object({
    statusId: objectIdValidation,
    resolve: resolveValidation,
    description: descriptionValidation,
});

export const updateStatusDTOSchema = z.object({
    resolve: resolveValidation,
    description: descriptionValidation,
});

export type StatusParams = z.infer<typeof statusParamsSchema>;
export type CreateStatusDTO = z.infer<typeof createStatusDTOSchema>;
export type UpdateStatusDTO = z.infer<typeof updateStatusDTOSchema>;
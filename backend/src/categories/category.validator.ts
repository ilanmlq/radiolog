import { z } from 'zod';

const objectIdValidation = z.string().regex(/^[0-9a-fA-F]{24}$/);
const nameValidation = z.string().min(1).max(255).trim();

// Schéma de validation pour la création d'une catégorie
export const createCategoryDTOSchema = z.object({
    name: nameValidation,
});

// Schéma de validation pour le paramètre categoryId
export const categoryParamsSchema = z.object({
    categoryId: objectIdValidation,
});

export type CreateCategoryDTO = z.infer<typeof createCategoryDTOSchema>;
export type CategoryParams = z.infer<typeof categoryParamsSchema>;
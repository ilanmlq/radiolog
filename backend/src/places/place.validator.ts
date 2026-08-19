import { z } from 'zod';

const objectIdValidation = z.string().regex(/^[0-9a-fA-F]{24}$/);
const nameValidation = z.string().min(1).max(255).trim();
const descriptionValidation = z.string().max(1000).trim();
const latitudeValidation = z.number().min(-90).max(90);
const longitudeValidation = z.number().min(-180).max(180);

/// CREATE

// Schéma de validation pour la création d'un lieu
export const createPlaceDTOSchema = z.object({
  categoryId: objectIdValidation,
  name: nameValidation,
  description: descriptionValidation.optional(),
  latitude: latitudeValidation,
  longitude: longitudeValidation,
});

// Schéma de validation pour la mise à jour d'un lieu
export const updatePlaceDTOSchema = z.object({
  name: nameValidation,
  description: descriptionValidation,
  latitude: latitudeValidation,
  longitude: longitudeValidation,
});

// Schéma de validation pour le paramètre placeId
export const placeParamsSchema = z.object({
  placeId: objectIdValidation,
});

// Types TypeScript inférés des schémas
export type CreatePlaceDTO = z.infer<typeof createPlaceDTOSchema>;
export type UpdatePlaceDTO = z.infer<typeof updatePlaceDTOSchema>;
export type PlaceParams = z.infer<typeof placeParamsSchema>;
import { z } from "zod"

const PHONE_ALLOWED_CHARACTERS = /^\+?[\d\s()./-]+$/

const emailEntrySchema = z
  .string()
  .trim()
  .email("Adresse email invalide")

const phoneEntrySchema = z
  .string()
  .trim()
  .min(1, "Le numéro de téléphone ne peut pas être vide")
  .refine((value) => PHONE_ALLOWED_CHARACTERS.test(value), "Numéro de téléphone invalide")
  .refine((value) => {
    const digits = value.replace(/\D/g, "")
    return digits.length >= 7 && digits.length <= 15
  }, "Numéro de téléphone invalide")

export const memberFormValidationSchema = z.object({
  name: z.string().trim().min(1, "Le nom du membre est requis"),
  email: z.array(emailEntrySchema).min(1, "Au moins une adresse email est requise"),
  phone: z.array(phoneEntrySchema).min(1, "Au moins un numéro de téléphone est requis"),
  teamIds: z.array(z.string()).min(1, "Au moins une équipe est requise"),
})

export interface MemberFormFieldErrors {
  name?: string
  email?: string
  phone?: string
  teamIds?: string
}

export function validateMemberFormData(data: {
  name: string
  email: string[]
  phone: string[]
  teamIds: string[]
}): { fieldErrors: MemberFormFieldErrors; formError: string | null } {
  const result = memberFormValidationSchema.safeParse(data)

  if (result.success) {
    return {
      fieldErrors: {},
      formError: null,
    }
  }

  const { fieldErrors } = result.error.flatten()

  return {
    fieldErrors: {
      name: fieldErrors.name?.[0],
      email: fieldErrors.email?.[0],
      phone: fieldErrors.phone?.[0],
      teamIds: fieldErrors.teamIds?.[0],
    },
    formError:
      result.error.issues[0]?.message ??
      "Une erreur est survenue. Veuillez vérifier les données du formulaire.",
  }
}

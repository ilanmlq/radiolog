import { z } from 'zod';

// Schéma de validation pour le paramètre memberId
export const memberParamsSchema = z.object({
  memberId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export const createMemberSchema = z.object({
  eventId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  teamId: z.array(
    z.string().regex(/^[0-9a-fA-F]{24}$/)
  ).min(1),
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  name: z.string().min(1).max(100).trim(),
  surnames: z.array(
    z.string().min(1).max(100).trim()
  ).min(1),
  email: z.array(
    z.string().min(1).max(100).trim()
  ).min(1),
  phone: z.array(
    z.string().min(1).max(100).trim()
  ).min(1),
  roleTitles: z.array(
    z.string().min(1).max(100).trim()
  ).min(1),
  address: z.object({
    line1: z.string().min(1).max(100).trim(),
    line2: z.string().min(1).max(100).trim().optional(),
    postalCode: z.string().min(1).max(100).trim(),
    city: z.string().min(1).max(100).trim(),
    country: z.string().min(1).max(100).trim(),
  }).optional(),
});

export const updateMemberSchema = z.object({
  eventId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  teamId: z.array(
    z.string().regex(/^[0-9a-fA-F]{24}$/)
  ).min(1).optional(),
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  name: z.string().min(1).max(100).trim().optional(),
  surnames: z.array(
    z.string().min(1).max(100).trim()
  ).optional(),
  email: z.array(
    z.string().min(1).max(100).trim()
  ).optional(),
  phone: z.array(
    z.string().min(1).max(100).trim()
  ).optional(),
  roleTitles: z.array(
    z.string().min(1).max(100).trim()
  ).optional(),
  address: z.object({
    line1: z.string().min(1).max(100).trim(),
    line2: z.string().min(1).max(100).trim().optional(),
    postalCode: z.string().min(1).max(100).trim(),
    city: z.string().min(1).max(100).trim(),
    country: z.string().min(1).max(100).trim(),
  }).optional(),
});



// Types TypeScript inférés des schémas
export type MemberParams = z.infer<typeof memberParamsSchema>;
export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;

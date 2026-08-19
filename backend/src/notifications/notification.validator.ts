import { z } from 'zod';

// Schéma de validation pour définir l'événement actif
export const testNotificationSchema = z.object({
  title: z.string().min(1).max(255).trim(),
  text: z.string().min(1).max(1000).trim()
});



// Types TypeScript inférés des schémas
export type TestNotificationInput = z.infer<typeof testNotificationSchema>;

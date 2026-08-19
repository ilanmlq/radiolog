import { PaginationParams } from '@/modules/common.model.ts';

/**
 * Configuration de pagination par défaut pour l'application
 */
export const DEFAULT_PAGE_SIZE = 15

/**
 * Options de taille de page disponibles dans les DataTables
 */
export const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50] as const
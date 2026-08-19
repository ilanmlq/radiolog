import { Response, Router } from 'express';
import { PaginatedResult } from '../common/common.model';
import { Category } from './category.model';
import { listCategories, getCategory } from './category.service';
import { validateParams, validateQuery } from '../middlewares/schema-validator';
import { PaginationParams, paginationParamsSchema } from '../middlewares/paging.validator';
import { CategoryParams, categoryParamsSchema } from './category.validator';
import { AuthenticatedRequest, authGuard } from '../middlewares/auth.guard';
import { requirePermissions } from '../middlewares/require-permissions';
import { Permissions } from '../utils/permissions';

const categoriesRoutes = Router();

categoriesRoutes.use(authGuard);

categoriesRoutes.get(
    '/',
    requirePermissions([Permissions.READ_DATA]),
    validateQuery(paginationParamsSchema),
    async (request: AuthenticatedRequest, response: Response) => {
        const paginationParams = request.parsedQuery as PaginationParams;
        const categories: PaginatedResult<Category> = await listCategories(paginationParams);
        response.status(200).json(categories);
    }
);

categoriesRoutes.get(
    '/:categoryId',
    requirePermissions([Permissions.READ_DATA]),
    validateParams(categoryParamsSchema),
    async (request: AuthenticatedRequest, response: Response) => {
        const { categoryId } = request.parsedParams as CategoryParams;
        const category = await getCategory(categoryId);
        response.status(200).json(category);
    }
);

export default categoriesRoutes;

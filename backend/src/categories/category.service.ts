import { PaginatedResult, PaginationParams } from "../common/common.model";
import { Category, CategoryID } from "./category.model";
import * as database from "./category.database";

export async function listCategories(paginationParams: PaginationParams): Promise<PaginatedResult<Category>> {
    const count = await database.countCategories();
    const categories = await database.findManyCategories(paginationParams.limit, paginationParams.offset);
    return ({
        items: categories,
        total: count,
        limit: paginationParams.limit,
        offset: paginationParams.offset,
    });
}

export async function getCategory(id: CategoryID): Promise<Category | undefined> {
    return await database.findCategory(id);
}
import { Category, CategoryID } from "./category.model";
import { getDatabase } from "../configs/config.database";
import { ObjectId } from "mongodb";

const COLLECTION = 'categories';

export async function countCategories(): Promise<number> {
    const db = getDatabase();
    return await db.collection(COLLECTION).countDocuments();
}

export async function findManyCategories(
    limit: number = 50, 
    offset: number = 0
): Promise<Category[]> {
    const db = getDatabase();
    const categories = await db.collection(COLLECTION)
        .find()
        .skip(offset)
        .limit(limit)
        .toArray();

    return categories.map((doc: any) => ({
        id: doc._id.toString(),
        name: doc.name
    }))
}

export async function findCategory(id: CategoryID): Promise<Category | undefined> {
    const db = getDatabase();
    const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });

    if (!doc) return undefined;

    return {
        id: doc._id.toString(),
        name: doc.name
    }
}
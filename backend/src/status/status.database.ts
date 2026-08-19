import { Db, DeleteResult, Document, InsertOneResult, ObjectId, WithId } from "mongodb";
import { getDatabase } from "../configs/config.database";
import { CreateStatusData, Status, StatusID, UpdateStatusData } from "./status.model";
import { logMessage } from "../utils/logger";

const COLLECTION = 'status';

export async function countStatus(): Promise<number> {
    const db: Db = getDatabase();
    return await db.collection(COLLECTION).countDocuments();
}

export async function findManyStatus(
    limit: number = 50,
    offset: number = 0
): Promise<Status[]> {
    const db: Db = getDatabase();
    const status: WithId<Document>[] = await db.collection(COLLECTION)
        .find()
        .skip(offset)
        .limit(limit)
        .toArray();

    return status.map((doc: any) => ({
        id: doc._id.toString(),
        resolve: doc.resolve,
        description: doc.description,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        createdById: doc.createdById?.toString(),
        updatedById: doc.updatedById?.toString()
    }));
}

export async function findStatusById(id: StatusID): Promise<Status | undefined> {
    const db: Db = getDatabase();
    const doc: WithId<Document> | null = await db.collection(COLLECTION)
        .findOne({ _id: new ObjectId(id) });

    if (!doc) return undefined;

    return {
        id: doc._id.toString(),
        resolve: doc.resolve,
        description: doc.description,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        createdById: doc.createdById?.toString(),
        updatedById: doc.updatedById?.toString()
    }
}

export async function createStatus(status: CreateStatusData): Promise<Status> {
    const db: Db = getDatabase();

    const doc: any = {
        resolve: status.resolve,
        description: status.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdById: new ObjectId(status.createdById),
        updatedById: new ObjectId(status.createdById)
    };

    const result: InsertOneResult<Document> = await db.collection(COLLECTION).insertOne(doc);

    return {
        id: result.insertedId.toString(),
        resolve: doc.resolve,
        description: doc.description,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        createdById: doc.createdById,
        updatedById: doc.updatedById
    };
}

export async function updateStatus(
    id: StatusID,
    status: UpdateStatusData
): Promise<Status | undefined> {
    const db: Db = getDatabase();
    console.log(status.updatedById)
    const result: WithId<Document> | null = await db.collection(COLLECTION)
        .findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: {
                    resolve: status.resolve,
                    description: status.description,
                    updatedAt: new Date().toISOString(),
                    updatedById: new ObjectId(status.updatedById)
                }
            },
            { returnDocument: 'after' }
        );

        logMessage('info', 'status.database', `Updated status with id ${id}: ${JSON.stringify(result)}`);

        const doc = result?.value || result;

        if (!doc || !doc._id) return undefined;

        return {
            id: doc._id.toString(),
            resolve: doc.resolve,
            description: doc.description,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            createdById: doc.createdById?.toString(),
            updatedById: doc.updatedById?.toString()
        };
}

export async function deleteStatus(id: StatusID): Promise<boolean> {
    const db: Db = getDatabase();
    const result: DeleteResult = await db.collection(COLLECTION)
        .deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount > 0;
}
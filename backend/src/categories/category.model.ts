import { ObjectId } from "mongodb";

export type CategoryID = ObjectId | string;

export interface Category {
    id: CategoryID;
    name: string;
}
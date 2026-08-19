import { CreateIncidentData, Incident, IncidentID, UpdateIncidentData } from "./incident.model";
import { PlaceID } from "../places/place.model";
import { getDatabase } from "../configs/config.database";
import { Document, ObjectId } from "mongodb";
import { logMessage } from "../utils/logger";
import { deleteStatus } from "../status/status.database";
import { EventID } from "../events/event.model";
import { Status } from "../status/status.model";
import { ConversationID } from "../conversations/conversation.model";

const COLLECTION = 'incidents';
const PLACES_COLLECTION = 'places';
const STATUS_COLLECTION = 'status';

export async function countIncidents(eventId: EventID): Promise<number> {
    const db = getDatabase();
    const result: Document[] = await db.collection(COLLECTION).aggregate([
        {
            $lookup: {
                from: PLACES_COLLECTION,
                let: { placeId: { $toObjectId: "$placeId" } },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$placeId"] } } }
                ],
                as: "place"
            }
        },
        { $unwind: "$place" },
        { $match: { "place.eventId": new ObjectId(eventId) } },
        { $count: "total" }
    ]).toArray();

    return result[0]?.total ?? 0;
}

export async function countIncidentsByPlace(placeId: PlaceID): Promise<number> {
    const db = getDatabase();
    return await db.collection(COLLECTION).countDocuments({ placeId: new ObjectId(placeId) });
}

export async function countIncidentsResolve(
    eventId: EventID,
    resolved: boolean
): Promise<number> {
    const db = getDatabase();
    const result: Document[] = await db.collection(COLLECTION).aggregate([
        {
            $lookup: {
                from: PLACES_COLLECTION,
                let: { placeId: { $toObjectId: "$placeId" } },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$placeId"] } } }
                ],
                as: "place"
            }
        },
        { $unwind: "$place" },
        { $match: { "place.eventId": new ObjectId(eventId) } },
        {
            $lookup: {
                from: STATUS_COLLECTION,
                localField: "statusId",
                foreignField: "_id",
                as: "status_data"
            }
        },
        { $unwind: "$status_data" },
        { $match: { "status_data.resolve": resolved } },
        { $count: "total" }
    ]).toArray();

    return (result.length > 0 && result[0] != undefined) ? result[0].total : 0;
}

export async function findManyIncidents(
    eventId: EventID,
    limit: number = 50,
    offset: number = 0
): Promise<(Incident & { status: Status })[]> {
    const db = getDatabase();
    const incidents = await db.collection(COLLECTION)
        .aggregate([
            {
                $lookup: {
                    from: PLACES_COLLECTION,
                    let: { placeId: { $toObjectId: "$placeId" } },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$placeId"] } } }
                    ],
                    as: "place"
                }
            },
            { $unwind: "$place" },
            { $match: { "place.eventId": new ObjectId(eventId) } },
            {
                $lookup: {
                    from: STATUS_COLLECTION,
                    localField: "statusId",
                    foreignField: "_id",
                    as: "status_data"
                }
            },
            { $unwind: "$status_data" },
            { $skip: offset },
            { $limit: limit }
        ])
        .toArray()

    return incidents.map((doc: any) => ({
        id: doc._id.toString(),
        placeId: doc.placeId?.toString(),
        conversationId: doc.conversationId?.toString(),
        criticality: doc.criticality,
        description: doc.description,
        statusId: doc.statusId?.toString(),
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        createdById: doc.createdById?.toString(),
        updatedById: doc.updatedById?.toString(),
        status: {
            id: doc.status_data._id.toString(),
            resolve: doc.status_data.resolve,
            description: doc.status_data.description,
            createdAt: doc.status_data.createdAt,
            updatedAt: doc.status_data.updatedAt,
            createdById: doc.status_data.createdById?.toString(),
            updatedById: doc.status_data.updatedById?.toString(),
        }
    }));
}

export async function findManyIncidentsResolve(
    eventId: EventID,
    resolved: boolean,
    limit: number = 50,
    offset: number = 0
): Promise<(Incident & { status: Status })[]> {
    const db = getDatabase();
    const incidents = await db.collection(COLLECTION).aggregate([
        {
            $lookup: {
                from: PLACES_COLLECTION,
                let: { placeId: { $toObjectId: "$placeId" } },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$placeId"] } } }
                ],
                as: "place"
            }
        },
        { $unwind: "$place" },
        { $match: { "place.eventId": new ObjectId(eventId) } },
        {
            $lookup: {
                from: STATUS_COLLECTION,
                localField: "statusId",
                foreignField: "_id",
                as: "status_data"
            }
        },
        { $unwind: "$status_data" },
        { $match: { "status_data.resolve": resolved } },
        { $skip: offset },
        { $limit: limit }
    ]).toArray();

    return incidents.map((doc: any) => ({
        id: doc._id.toString(),
        placeId: doc.placeId?.toString(),
        conversationId: doc.conversationId?.toString(),
        criticality: doc.criticality,
        description: doc.description,
        statusId: doc.statusId.toString(),
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        createdById: doc.createdById?.toString(),
        updatedById: doc.updatedById?.toString(),
        status: {
            id: doc.status_data._id.toString(),
            resolve: doc.status_data.resolve,
            description: doc.status_data.description,
            createdAt: doc.status_data.createdAt,
            updatedAt: doc.status_data.updatedAt,
            createdById: doc.status_data.createdById?.toString(),
            updatedById: doc.status_data.updatedById?.toString(),
        }
    }));
}

export async function findIncidentById(id: IncidentID): Promise<Incident | undefined> {
    const db = getDatabase();
    const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });

    if (!doc) return undefined;

    return {
        id: doc._id.toString(),
        placeId: doc.placeId?.toString(),
        conversationId: doc.conversationId?.toString(),
        criticality: doc.criticality,
        description: doc.description,
        statusId: doc.statusId?.toString(),
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        createdById: doc.createdById?.toString(),
        updatedById: doc.updatedById?.toString()
    }
}

export async function findManyIncidentsByPlace(
    placeId: PlaceID,
    limit: number = 50,
    offset: number = 0
): Promise<Incident[]> {
    const db = getDatabase();
    const incidents = await db.collection(COLLECTION)
        .find({ placeId: new ObjectId(placeId) })
        .skip(offset)
        .limit(limit)
        .toArray();

    return incidents.map((doc: any) => ({
        id: doc._id.toString(),
        placeId: doc.placeId?.toString(),
        conversationId: doc.conversationId?.toString(),
        criticality: doc.criticality,
        description: doc.description,
        statusId: doc.statusId?.toString(),
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        createdById: doc.createdById?.toString(),
        updatedById: doc.updatedById?.toString()
    }))
}

export async function createIncident(incident: CreateIncidentData): Promise<Incident> {
    const db = getDatabase();

    const doc = {
        placeId: new ObjectId(incident.placeId),
        conversationId: new ObjectId(incident.conversationId ?? ""),
        criticality: incident.criticality,
        description: incident.description,
        statusId: incident.statusId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdById: new ObjectId(incident.createdById),
        updatedById: new ObjectId(incident.createdById)
    };

    const result = await db.collection(COLLECTION).insertOne(doc);

    return {
        id: result.insertedId.toString(),
        placeId: doc.placeId,
        conversationId: doc.conversationId.toString(),
        criticality: doc.criticality,
        description: doc.description ?? "",
        statusId: doc.statusId,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        createdById: doc.createdById.toString(),
        updatedById: doc.updatedById.toString()
    }
}

export async function updateIncident(incidentId: IncidentID, incident: UpdateIncidentData): Promise<Incident | undefined> {
    const db = getDatabase();

    const result: any = await db.collection(COLLECTION).findOneAndUpdate(
        { _id: new ObjectId(incidentId) },
        {
            $set: {
                criticality: incident.criticality,
                description: incident.description,
                updatedAt: new Date().toISOString(),
                updatedById: new ObjectId(incident.updatedById)
            }
        },
        { returnDocument: 'after' }
    );

    logMessage('info', 'incident.database', `Updated incident with id ${incidentId}: ${JSON.stringify(result)}`);

    const doc = result?.value || result;

    if (!doc || !doc._id) return undefined;

    return {
        id: doc._id.toString(),
        placeId: doc.placeId?.toString(),
        conversationId: doc.conversationId?.toString(),
        criticality: doc.criticality,
        description: doc.description,
        statusId: doc.statusId,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        createdById: doc.createdById?.toString(),
        updatedById: doc.updatedById?.toString()
    }
}

export async function deleteIncident(incidentId: IncidentID): Promise<boolean> {
    const db = getDatabase();
    const incident: Incident | undefined = await findIncidentById(incidentId);
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(incidentId) });
    if (incident != undefined) deleteStatus(incident.statusId);
    return result.deletedCount > 0;
}

export async function getConversationCriticality(conversationId: ConversationID): Promise<number> {
  const db = getDatabase();

  const incident = await db.collection<Incident>(COLLECTION).findOne({
    conversationId: new ObjectId(conversationId)
  });

  logMessage('info', 'incident.database', `Fetched incident for conversationId ${conversationId}: ${incident?.criticality}`);
  return incident?.criticality ?? 0;
}
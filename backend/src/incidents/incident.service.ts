import { PaginatedResult, PaginationParams } from '../common/common.model';
import { CreateIncidentData, Incident, IncidentID, IncidentSummary, UpdateIncidentData } from './incident.model';
import * as database from './incident.database';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { PlaceID } from '../places/place.model';
import { getActiveEventId } from '../organisations/organisation.service';
import { ConversationID } from '../conversations/conversation.model';

export async function listIncidents(
    paginationParams: PaginationParams,
): Promise<PaginatedResult<IncidentSummary>> {
    const activeEventId = await getActiveEventId();
    if (!activeEventId) {
        throw new BadRequestError('No active event found for the current organisation.');
    }
    const count = await database.countIncidents(activeEventId);
    const incidents = await database.findManyIncidents(activeEventId, paginationParams.limit, paginationParams.offset);
    return ({
        items: incidents.map(toIncidentSummary),
        total: count,
        limit: paginationParams.limit,
        offset: paginationParams.offset,
    });
}

export async function getIncidentDetails(id: IncidentID): Promise<Incident | undefined> {
    const incident = await database.findIncidentById(id);
    if (!incident) {
        throw new NotFoundError(`Incident with id ${id} not found`);
    }
    return incident;
}

export async function listIncidentsForPlace(
    placeId: PlaceID,
    paginationParams: PaginationParams,
): Promise<PaginatedResult<Incident>> {
    const count = await database.countIncidentsByPlace(placeId);
    const incidents = await database.findManyIncidentsByPlace(placeId, paginationParams.limit, paginationParams.offset);
    return ({
        items: incidents,
        total: count,
        limit: paginationParams.limit,
        offset: paginationParams.offset,
    });
}

export async function listIncidentsResolved(
    resolve: boolean,
    paginationParams: PaginationParams,
): Promise<PaginatedResult<IncidentSummary>> {
    const activeEventId = await getActiveEventId();
    if (!activeEventId) {
        throw new BadRequestError('No active event found for the current organisation.');
    }
    const count = await database.countIncidentsResolve(activeEventId, resolve);
    const incidents = await database.findManyIncidentsResolve(activeEventId, resolve, paginationParams.limit, paginationParams.offset);
    return ({
        items: incidents.map(toIncidentSummary),
        total: count,
        limit: paginationParams.limit,
        offset: paginationParams.offset,
    });
}

export async function createIncident(data: CreateIncidentData): Promise<Incident> {
    return await database.createIncident(data);
}

export async function updateIncident(incidentId: IncidentID, data: UpdateIncidentData): Promise<Incident> {
    const existingIncident = await database.findIncidentById(incidentId);
    if (!existingIncident) {
        throw new NotFoundError(`Incident with id ${incidentId} not found`);
    }
    const updatedIncident = await database.updateIncident(incidentId, data);
    if (!updatedIncident) {
        throw new NotFoundError(`Incident with id ${incidentId} not found during update`);
    }
    return updatedIncident;
}

export async function deleteIncident(incidentId: IncidentID): Promise<void> {
    const deleted = await database.deleteIncident(incidentId);
    if (!deleted) {
        throw new NotFoundError(`Incident with id ${incidentId} not found`);
    }
}

function toIncidentSummary(incident: Incident): IncidentSummary {
    return {
        id: incident.id,
        placeId: incident.placeId,
        conversationId: incident.conversationId ?? "",
        criticality: incident.criticality,
        description: incident.description ?? "",
        statusId: incident.statusId,
    };
}

export async function getConversationCriticality(conversationId: ConversationID): Promise<number> {
    return await database.getConversationCriticality(conversationId);
}
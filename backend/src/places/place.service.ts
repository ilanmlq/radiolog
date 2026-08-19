import { PaginatedResult, PaginationParams } from '../common/common.model';
import { Place, PlaceID, CreatePlaceData, UpdatePlaceData } from './place.model';
import { getActiveEventId } from '../organisations/organisation.service';
import * as database from './place.database';
import { BadRequestError, NotFoundError } from '../utils/errors';

export async function listPlaces(
  paginationParams: PaginationParams,
): Promise<PaginatedResult<Place>> {
  const activeEventId = await getActiveEventId();
  if (!activeEventId) {
    throw new BadRequestError('No active event found for the current organisation.');
  }
  const count = await database.countPlaces(activeEventId);
  const places = await database.findManyPlaces(activeEventId, paginationParams.limit, paginationParams.offset);
  return ({
    items: places,
    total: count,
    limit: paginationParams.limit,
    offset: paginationParams.offset,
  });
}

export async function listAllPlaceSummaries(): Promise<Partial<Place>[]> {
  const activeEventId = await getActiveEventId();
  if (!activeEventId) {
    throw new BadRequestError('No active event found for the current organisation.');
  }
  return await database.findAllPlaceSummaries(activeEventId);
}

export async function getPlace(placeId: PlaceID): Promise<Place | undefined> {
  const activeEventId = await getActiveEventId();
  if (!activeEventId) {
    throw new BadRequestError('No active event found for the current organisation.');
  }
  return await database.findPlaceById(activeEventId, placeId);
}

export async function createPlace(data: CreatePlaceData): Promise<Place | undefined> {
  const activeEventId = await getActiveEventId();
  if (!activeEventId) {
    throw new BadRequestError('No active event found for the current organisation.');
  }
  return await database.createPlace(activeEventId, data);
}

export async function updatePlace(placeId: PlaceID, data: UpdatePlaceData): Promise<Place> {
  const activeEventId = await getActiveEventId();
  if (!activeEventId) {
    throw new BadRequestError('No active event found for the current organisation.');
  }
  const existingPlace = await database.findPlaceById(activeEventId, placeId);
  if (!existingPlace) {
    throw new NotFoundError(`Place with id ${placeId} not found`);
  }
  const updatedPlace = await database.updatePlace(placeId, data);
  if (!updatedPlace) {
    throw new NotFoundError(`Place with id ${placeId} not found during update`);
  }
  return updatedPlace;
}

export async function deletePlace(placeId: PlaceID): Promise<void> {
  const deleted = await database.deletePlace(placeId);
  if (!deleted) {
    throw new NotFoundError(`Place with id ${placeId} not found`);
  }
}
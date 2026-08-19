import { Canal, CanalID, CanalSummary, CreateCanalData, UpdateCanalData } from './canal.model';
import * as database from './canal.database';
import { PaginatedResult, PaginationParams } from '../common/common.model';
import { NotFoundError, ConflictError } from '../utils/errors';

export async function listCanals(
  paginationParams: PaginationParams,
): Promise<PaginatedResult<CanalSummary>> {
  const count = await database.countCanals(paginationParams.query);
  const canals = await database.findManyCanals(paginationParams);
  return ({
    items: canals.map(toCanalSummary),
    total: count,
    limit: paginationParams.limit,
    offset: paginationParams.offset,
  });
}

export async function getCanalDetails(canalId: CanalID): Promise<Canal> {
  const canal = await database.findCanalById(canalId);
  if (!canal) {
    throw new NotFoundError(`Canal with id ${canalId} not found`);
  }
  return canal;
}

export async function getCanalDetailsFromNumber(canalNumber: number): Promise<Canal> {
  const canal = await database.findCanalByNumber(canalNumber);
  if (!canal) {
    throw new NotFoundError(`Canal with number ${canalNumber} not found`);
  }
  return canal;
}

export async function createCanal(data: CreateCanalData): Promise<Canal> {
  if (await database.findCanalByNumber(data.number)) {
    throw new ConflictError(`Canal with number ${data.number} already exists`);
  }
  return await database.createCanal(data);
}

export async function updateCanal(canalId: CanalID, data: UpdateCanalData): Promise<Canal> {
  const existingCanal = await database.findCanalById(canalId);
  if (!existingCanal) {
    throw new NotFoundError(`Canal with id ${canalId} not found`);
  }
  if (existingCanal.number !== data.number) {
    const canalWithSameNumber = await database.findCanalByNumber(data.number);
    if (canalWithSameNumber) {
      throw new ConflictError(`Canal with number ${data.number} already exists`);
    }
  }
  const updatedCanal = await database.updateCanal(canalId, data);
  if (!updatedCanal) {
    throw new NotFoundError(`Canal with id ${canalId} not found during update`);
  }
  return updatedCanal;
}

export async function deleteCanal(canalId: CanalID): Promise<void> {
  const deleted = await database.deleteCanal(canalId);
  if (!deleted) {
    throw new NotFoundError(`Canal with id ${canalId} not found`);
  }
}

function toCanalSummary(canal: Canal): CanalSummary {
  return {
    id: canal.id,

    number: canal.number,
    name: canal.name,
    description: canal.description,
  }
}
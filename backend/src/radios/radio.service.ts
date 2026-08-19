import { Radio, RadioID } from './radio.model';
import { PaginatedResult, PaginationParams } from '../common/common.model';
import * as database from './radio.database';
import { getActiveEventId } from '../organisations/organisation.service';

export async function listRadios(
  paginationParams: PaginationParams,
): Promise<PaginatedResult<Radio>> {
  const activeEventId = await getActiveEventId();
  if (!activeEventId) {
    throw new Error('No active event found for the current organisation.');
  }
  const count = await database.countRadios(activeEventId);
  const radios = await database.findManyRadios(activeEventId, paginationParams.limit, paginationParams.offset);
  return ({
    items: radios,
    total: count,
    limit: paginationParams.limit,
    offset: paginationParams.offset,
  });
}

export async function getRadioDetails(radioId: RadioID): Promise<Radio | undefined> {
  const activeEventId = await getActiveEventId();
  if (!activeEventId) {
    throw new Error('No active event found for the current organisation.');
  }
  return await database.findRadioById(activeEventId, radioId);
}

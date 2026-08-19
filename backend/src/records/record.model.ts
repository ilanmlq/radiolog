import { ISODateTime } from '../common/common.model';
import { EventID } from '../events/event.model';
import { CanalID } from '../canals/canal.model';

export type RecordID = string;

export type RecordStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Record {
  id: RecordID;
  eventId: EventID;

  canalID: CanalID;

  fileName: string;
  duration: number; // duration in sec
  status: RecordStatus;

  createdAt: ISODateTime;
}

export interface CreateRecordData {
  canalID: CanalID;
  fileName: string;
  duration: number;
}
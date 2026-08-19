export type RecordID = string;

export type RecordStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Record {
  id: RecordID;
  eventId: string;
  canalID: string;
  fileName: string;
  duration: number;
  status: RecordStatus;
  createdAt: string;
}

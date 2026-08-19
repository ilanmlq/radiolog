import { AxiosInstance } from 'axios';
import { Record } from './record.model';
import { ConversationID } from '@/modules/conversations';

export async function listRecordsForConversation(api: AxiosInstance, conversationId: ConversationID): Promise<Record[]> {
  return api.get(`/records/conversation/${conversationId}`)
    .then((res) => {
      if (!res.status || res.status !== 200) {
        throw new Error("Failed to fetch records");
      }
      return res.data || [];
    });
}

export function getRecordAudioUrl(recordId: string): string {
  return `${import.meta.env.VITE_PUBLIC_API_BASE_URL}/records/${recordId}/audio`;
}

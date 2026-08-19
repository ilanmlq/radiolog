import { ConversationSummary, ConversationID } from "./conversation.model";
import { ChatMessage, MessageID, EditMessageDTO } from "./message.model";
import { AxiosInstance } from 'axios';

export async function listConversationsByCanal(
  api: AxiosInstance, 
  canalId: string,
  limit: number = 50, 
  offset: number = 0
): Promise<{ items: ConversationSummary[], total: number }> {
  return api.get(`/conversations/canals/${canalId}?limit=${limit}&offset=${offset}`)
    .then((res) => {
      if (!res.status || res.status !== 200) {
        throw new Error("Failed to fetch conversations");
      }
      const items = res.data.items || [];
      return {
        items: items.map((item: any) => ({
          ...item,
          id: item.id || item.conversationId,
          criticality: item.criticality?.toLowerCase(),
        })),
        total: res.data.total || 0
      };
    });
}

export async function listConversations(
  api: AxiosInstance, 
  limit: number = 100, 
  offset: number = 0
): Promise<{ items: ConversationSummary[], total: number }> {
  return api.get(`/conversations?limit=${limit}&offset=${offset}`)
    .then((res) => {
      if (!res.status || res.status !== 200) {
        throw new Error("Failed to fetch conversations");
      }
      const items = res.data.items || [];
      return {
        items: items.map((item: any) => ({
          ...item,
          id: item.id || item.conversationId,
          criticality: item.criticality?.toLowerCase(),
        })),
        total: res.data.total || 0
      };
    });
}

export async function listMessagesForConversation(
  api: AxiosInstance, 
  conversationId: ConversationID, 
  limit: number = 100, 
  offset: number = 0
): Promise<{ items: ChatMessage[], total: number }> {
  return api.get(`/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`)
    .then((res) => {
      if (!res.status || res.status !== 200) {
        throw new Error("Failed to fetch messages");
      }
      return {
        items: res.data.items || [],
        total: res.data.total || 0
      };
    });
}

export async function moveMessage(api: AxiosInstance, messageId: MessageID, targetConversationId: ConversationID): Promise<ChatMessage> {
  return api.put(`/conversations/messages/move/${messageId}/${targetConversationId}`)
    .then((res) => {
      if (!res.status || res.status !== 201) {
        throw new Error("Failed to move message");
      }
      return res.data as ChatMessage;
    });
}

export async function editMessage(api: AxiosInstance, messageId: MessageID, data: EditMessageDTO): Promise<ChatMessage> {
  return api.put(`/conversations/messages/edit/${messageId}`, data)
    .then((res) => {
      if (!res.status || res.status !== 200) {
        throw new Error("Failed to edit message");
      }
      return res.data as ChatMessage;
    });
}

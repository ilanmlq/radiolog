import { UUID } from 'crypto';
import { AuditFields } from '../common/common.model';
import { UserID } from '../users/user.model';
export type NotificationID = string;

export interface NotificationSettings extends AuditFields {
  id: NotificationID;
  userId : UserID;
  telegramChatId : string | null;
  token : UUID;
  expireAt : Date;
  used : boolean;
}

// Pour le webHook TElegram et le long polling
export type TelegramUpdate = {
  update_id: number;
  message?: {
    text?: string;
    chat: {
      id: number;
    };
  };
};
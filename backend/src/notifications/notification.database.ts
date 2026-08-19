import { NotificationSettings } from './notification.model';
import { getDatabase } from '../configs/config.database';
import { UUID } from 'crypto';
import { logMessage } from '../utils/logger';

const COLLECTION = 'notifications';

export async function createNotificationSettings(UserId : string, token : UUID): Promise<NotificationSettings> {

    const db = getDatabase();

    const now = new Date();
    const expireAt = new Date(now.getTime() + 5 * 60 * 1000); // expire dans 5 minutes

    // Vérifier si des settings existent déjà pour cet utilisateur
    const existing = await db.collection(COLLECTION).findOne({ userId: UserId });
    if (existing) {
      // Mettre à jour seulement le token, la date d'expiration, used et updatedAt/updatedById
      const update = {
        $set: {
          token: token,
          expireAt: expireAt,
          used: false,
          updatedAt: now.toISOString(),
          updatedById: UserId
        }
      };
      await db.collection(COLLECTION).updateOne({ _id:   existing._id }, update);

      return {
        id: existing._id.toString(),
        userId: existing.userId,
        telegramChatId: existing.telegramChatId ?? null,
        token: token,
        expireAt: expireAt,
        used: false,
        createdAt: existing.createdAt,
        updatedAt: now.toISOString(),
        createdById: existing.createdById,
        updatedById: UserId
      };
    }

    const newNotifSettings = {
      userId: UserId,
      telegramChatId: null,
      token: token,
      expireAt: expireAt,
      used: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      createdById: UserId,
      updatedById: UserId
    };

    const result = await db.collection(COLLECTION).insertOne(newNotifSettings);

    return {
      id: result.insertedId.toString(),
      userId: newNotifSettings.userId,
      telegramChatId: newNotifSettings.telegramChatId,
      token: newNotifSettings.token,
      expireAt: newNotifSettings.expireAt,
      used: newNotifSettings.used,
      createdAt: newNotifSettings.createdAt,
      updatedAt: newNotifSettings.updatedAt,
      createdById: newNotifSettings.createdById,
      updatedById: newNotifSettings.updatedById
    };
}

export async function findNotificationSettingsByToken(token: UUID): Promise<boolean | undefined> {
  const db = getDatabase();
  const doc = await db.collection(COLLECTION).findOne
  ({ token: token });
  
  if (!doc) return undefined;
  if(new Date(doc.expireAt) < new Date()) return undefined; // Vérifie si le token a expiré
  return doc.used;
}
export async function updateNotificationSetttingsOnValidToken(chatId : string, token: UUID) : Promise<void> {
  try {
    const db = getDatabase();
    await db.collection(COLLECTION).updateOne(
      { token: token },
      { $set: { telegramChatId: chatId, used: true } }
    );
  } catch (error) {
    logMessage('error', 'radiolog', 'Error updating notification settings:');
    throw error;
  }
}

export async function getChatIds(): Promise<string[]> {
  const db = getDatabase();
  const docs = await db.collection(COLLECTION).find({ telegramChatId: { $ne: null } }).toArray();
  if (!docs) return [];
  return docs.map(doc => doc.telegramChatId);
}
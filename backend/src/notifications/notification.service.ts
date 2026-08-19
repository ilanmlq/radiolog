import { logMessage } from '../utils/logger';
import { createNotificationSettings, getChatIds, findNotificationSettingsByToken, updateNotificationSetttingsOnValidToken } from './notification.database';
import { UUID } from 'node:crypto';
import { TelegramUpdate } from './notification.model';

const TELEGRAM_API_URL = 'https://api.telegram.org';

let lastUpdateId = 0;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

async function sendTelegramMessage(chatId: string, text: string): Promise<void> {
  const token = process.env.TELEGRAM_TOKEN;
  if (!token) {
    logMessage('warn', 'radiolog', '[notification] TELEGRAM_TOKEN manquant — message ignoré');
    return;
  }

  const response = await fetch(`${TELEGRAM_API_URL}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'markdown' }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API ${response.status}: ${error}`);
  }
}

function formatMessage(title: string, text: string): string {
  return `*${title}*\n\n${text}`;
}

export async function broadcast(title: string, text: string): Promise<void> {
  const chatIds = await getChatIds(); 
  const message = formatMessage(title, text);
  if (!TELEGRAM_TOKEN || !chatIds || chatIds.length === 0) {
    logMessage('warn', 'radiolog', '[notification] TELEGRAM_TOKEN manquant ou aucun chat ID trouvé — ignoré');
    return;
  }

  try {
    const sendPromises = chatIds.map(id => sendTelegramMessage(id, message));
    await Promise.all(sendPromises);
  } catch (error) {
    logMessage('error', 'radiolog', '[notification] Erreur lors de l\'envoi des messages Telegram:');
  }
}

export async function generateToken(UserId: string): Promise<UUID> {
  const token = crypto.randomUUID() as UUID;
  await createNotificationSettings(UserId, token); 
  return token;
}

export async function handleTelegramUpdate(update: TelegramUpdate): Promise<void> {
  const message = update.message;
  if (!message?.text) return;

  const text = message.text.trim();
  const chatId = message.chat.id.toString();

  if (text.startsWith('/start')) {
    const parts = text.split(' ');
    const tokenFromMsg = parts[1];

    if (!tokenFromMsg || tokenFromMsg.length < 10) {
      await sendTelegramMessage(chatId, 'Token invalide. Passez bien par le lien présent dans l\'application pour démarrer la liaison.');
      return;
    }

    try {
      const isUsed = await findNotificationSettingsByToken(tokenFromMsg as UUID);

      if (isUsed === false) {
        await updateNotificationSetttingsOnValidToken(chatId, tokenFromMsg as UUID);

        await sendTelegramMessage(
          chatId,
          '✅ Votre compte a été lié avec succès !'
        );
      } else {
        logMessage('warn', 'radiolog', `Token déjà utilisé ou expiré: ${tokenFromMsg}`);
      }

    } catch (err) {
      console.error('[notification] DB error:', err);
      await sendTelegramMessage(chatId, 'Erreur serveur.');
    }
  }
}

export async function activateWebhook() {
  const token = process.env.TELEGRAM_TOKEN;
  if (!token) {
    console.warn('[notification] TELEGRAM_TOKEN manquant — webhook non activé');
    return;
  }
  
  const webhookUrl = `${process.env.BASE_URL}/notifications/telegram/webhook`;
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Telegram API ${response.status}: ${error}`);
    }

    logMessage('info', 'radiolog', `Webhook Telegram activé: ${webhookUrl}`);
  } catch (error) {
    console.error('[notification] Erreur lors de l\'activation du webhook Telegram:', error);
  }
}
export async function startTelegramLongPolling() {
  if(!process.env.TARGET_ENV || process.env.TARGET_ENV === 'development') {
    logMessage('info', 'radiolog', 'Démarrage du long polling Telegram (dev mode)');
  }else{
    // En prod on met en place un webhook (regarder activateWebhook) et on ne lance pas le polling
    logMessage('info', 'radiolog', 'Environnement de production détecté, le long polling Telegram est désactivé (webhook activé)');
    return;
  }
  const TELEGRAM_API_URL = 'https://api.telegram.org';
  if (!TELEGRAM_TOKEN) {
    logMessage('warn', 'radiolog', '[notification] TELEGRAM_TOKEN manquant — polling ignoré');
    return;
  }

  let lastUpdateId = 0;

  async function poll(): Promise<void> {
    try {
      // Long polling telegram
      const url = `${TELEGRAM_API_URL}/bot${TELEGRAM_TOKEN}/getUpdates?timeout=30&offset=${lastUpdateId + 1}&allowed_updates=["message"]`;
      const response = await fetch(url, {
        signal: AbortSignal.timeout(35000)
      });

      if (response.ok) {
        const data = await response.json();

        for (const update of data.result) {
          lastUpdateId = update.update_id;
          await handleTelegramUpdate(update);
        }
      } else {
        console.error('[poll] HTTP error', response.status);
      }

    } catch (err: any) {
      if (err.name !== 'AbortError' && err.name !== 'TimeoutError') {
        console.error('[poll] error', err);
      }
    }

    setImmediate(poll);
  }

  //Premier lancemnet du polling
  poll();
}


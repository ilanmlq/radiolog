import app from './app';
import config from './configs/config';
import { logMessage } from './utils/logger';
import { connectDatabase, closeDatabase } from './configs/config.database';
import { startTelegramLongPolling } from './notifications/notification.service';

async function bootstrap(): Promise<void> {
  try {
    await connectDatabase();
    startTelegramLongPolling();
    app.listen(config.port, () => {
      logMessage('info', 'radiolog', `Server running on port ${config.port}`);
    });
  } catch (err) {
    logMessage('error', 'radiolog', 'Failed to start server', { error: err });
    await closeDatabase();
  }
}

bootstrap();

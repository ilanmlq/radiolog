import { validateBody, validateParams, validateQuery } from '../middlewares/schema-validator';
import { AuthenticatedRequest, authGuard } from '../middlewares/auth.guard';
import { requirePermissions } from '../middlewares/require-permissions';
import { Permissions } from '../utils/permissions';
import { getConnectedUserId } from '../users/user.service';
import { Router, Response } from 'express';
import { broadcast, generateToken, handleTelegramUpdate } from './notification.service';
import { testNotificationSchema } from './notification.validator';
const notificationsRoute = Router();


//Au dessus du atuhGuard pour que le webhook soit accessible sans auth
notificationsRoute.post('/telegram/webhook', async (req, res) => {
  try {
    const update = req.body;

    await handleTelegramUpdate(update);

    res.sendStatus(200);
  } catch (err) {
    console.error('[webhook] error:', err);
    res.sendStatus(500);
  }
});

notificationsRoute.use(authGuard);

notificationsRoute.get(
  '/token',
  requirePermissions([Permissions.WRITE_DATA]),
  async (request: AuthenticatedRequest, response: Response) => {
    const connectedUserId = await getConnectedUserId();
    const token = await generateToken(connectedUserId.toString());
    response.status(200).json({ token });
  }
);

notificationsRoute.post(
  '/test-api',
  requirePermissions([Permissions.WRITE_DATA]),
  validateBody(testNotificationSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { title, text } = request.body;
    await broadcast(title, text);
    response.status(200).json({ message: 'Notification test envoyée' });
});



export default notificationsRoute;
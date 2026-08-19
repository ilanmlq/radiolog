import express from 'express';
import cors from 'cors';
import userRoutes from './users/user.routes';
import organisationRoutes from './organisations/organisation.routes';
import eventRoutes from './events/event.routes';
import canalRoutes from './canals/canal.routes';
import recordRoutes from './records/record.routes';
import conversationRoutes from './conversations/conversation.routes';
import placeRoutes from './places/place.routes';
import teamRoutes from './teams/team.routes';
import memberRoutes from './teams/member.routes';
import radioRoutes from './radios/radio.routes';
import notificationsRoute from './notifications/notification.routes';
import { errorHandler } from './middlewares/error-handler';
import incidentRoutes from './incidents/incident.route';
import categoriesRoutes from './categories/category.route';
import statusRoutes from './status/status.route';

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://radiolog.tech',
    ],
  }),
);

// Routes
app.get('/api/healthcheck', (_, res) => res.sendStatus(200));
app.use('/api/users', userRoutes);
app.use('/api/organisations', organisationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/canals', canalRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/radios', radioRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/notifications', notificationsRoute);
app.use(errorHandler);

export default app;
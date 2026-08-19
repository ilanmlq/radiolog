import { Response, Router } from 'express';
import { Organisation } from './organisation.model';
import { getOrganisationDetails, setActiveEvent } from './organisation.service';
import { validateBody } from '../middlewares/schema-validator';
import { SetActiveEventInput, setActiveEventSchema } from './organisation.validator';
import { AuthenticatedRequest, authGuard } from '../middlewares/auth.guard';
import { requirePermissions } from '../middlewares/require-permissions';
import { Permissions } from '../utils/permissions';

const organisationRoutes = Router();

organisationRoutes.use(authGuard);

organisationRoutes.get(
  '/',
  requirePermissions([Permissions.READ_DATA]),
  async (_: AuthenticatedRequest, response: Response) => {
    const organisation: Organisation = await getOrganisationDetails();
    response.status(200).json(organisation);
  }
);

organisationRoutes.patch(
  '/active-event',
  requirePermissions([Permissions.WRITE_DATA]),
  validateBody(setActiveEventSchema),
  async (request: AuthenticatedRequest, response: Response) => {
    const { activeEventId } = request.parsedBody as SetActiveEventInput;
    const updatedOrganisation: Organisation = await setActiveEvent(activeEventId);
    response.status(200).json(updatedOrganisation);
  }
);

export default organisationRoutes;
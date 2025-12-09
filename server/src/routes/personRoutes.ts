import { Hono } from 'hono';
import { personController } from '../controllers';

const personRouter = new Hono();

// Person routes (nested under projects)
personRouter.post('/:projectId/people', personController.addPerson);
personRouter.get('/:projectId/people', personController.getPeople);
personRouter.put('/people/:id', personController.updatePerson);
personRouter.delete('/people/:id', personController.deletePerson);

export default personRouter;

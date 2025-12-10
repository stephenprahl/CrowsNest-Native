import { Hono } from 'hono';
import { floorPlanController } from '../controllers';

const floorPlanRouter = new Hono();

// Floor plan routes (nested under projects)
floorPlanRouter.post('/:projectId/floor-plans', floorPlanController.createFloorPlan);
floorPlanRouter.get('/:projectId/floor-plans', floorPlanController.getFloorPlans);
floorPlanRouter.delete('/floor-plans/:id', floorPlanController.deleteFloorPlan);
floorPlanRouter.post('/floor-plans/:id/annotations', floorPlanController.saveAnnotations);
floorPlanRouter.get('/floor-plans/:id/annotations', floorPlanController.getAnnotations);

export default floorPlanRouter;

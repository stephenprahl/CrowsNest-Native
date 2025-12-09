import { Hono } from 'hono';
import { floorPlanController } from '../controllers';

const floorPlanRouter = new Hono();

// Floor plan routes (nested under projects)
floorPlanRouter.post('/:projectId/floor-plans', floorPlanController.createFloorPlan);
floorPlanRouter.get('/:projectId/floor-plans', floorPlanController.getFloorPlans);
floorPlanRouter.delete('/floor-plans/:id', floorPlanController.deleteFloorPlan);

export default floorPlanRouter;

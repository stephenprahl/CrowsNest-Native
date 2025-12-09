import { Hono } from 'hono';
import { projectController } from '../controllers';

const projectRouter = new Hono();

// Project routes
projectRouter.post('/', projectController.createProject);
projectRouter.get('/', projectController.getProjects);
projectRouter.get('/:id', projectController.getProject);
projectRouter.put('/:id', projectController.updateProject);
projectRouter.delete('/:id', projectController.deleteProject);

export default projectRouter;

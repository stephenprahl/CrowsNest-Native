import { Hono } from 'hono';
import { taskController } from '../controllers';

const taskRouter = new Hono();

// Task routes (nested under projects)
taskRouter.post('/:projectId/tasks', taskController.createTask);
taskRouter.get('/:projectId/tasks', taskController.getTasks);
taskRouter.put('/tasks/:id', taskController.updateTask);
taskRouter.delete('/tasks/:id', taskController.deleteTask);

export default taskRouter;

import { Hono } from 'hono';
import floorPlanRouter from './floorPlanRoutes';
import geminiRouter from './geminiRoutes';
import notificationRouter from './notificationRoutes';
import personRouter from './personRoutes';
import projectRouter from './projectRoutes';
import taskRouter from './taskRoutes';

const routes = new Hono();

// API Routes
routes.route('/api/projects', projectRouter);
routes.route('/api', floorPlanRouter);
routes.route('/api', personRouter);
routes.route('/api', taskRouter);
routes.route('/api/notifications', notificationRouter);
routes.route('/api/gemini', geminiRouter);

// Health check
routes.get('/api/health', (c) => {
    return c.json({ success: true, message: 'Server is running' });
});

export default routes;

import { Hono } from 'hono';
import { notificationController } from '../controllers';

const notificationRouter = new Hono();

// Notification routes
notificationRouter.get('/', notificationController.getNotifications);
notificationRouter.put('/:id/read', notificationController.markAsRead);
notificationRouter.delete('/:id', notificationController.deleteNotification);

export default notificationRouter;

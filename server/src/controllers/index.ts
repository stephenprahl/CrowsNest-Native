import { Context } from 'hono';
import { floorPlanService } from '../services/floorPlanService';
import { geminiService } from '../services/geminiService';
import { notificationService } from '../services/notificationService';
import { personService } from '../services/personService';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';

// Project Controllers
export const projectController = {
    async createProject(c: Context) {
        const body = await c.req.json();
        const userId = c.req.header('X-User-Id');

        if (!userId) {
            return c.json({ success: false, error: 'Unauthorized' }, 401);
        }

        const project = await projectService.create({
            ...body,
            userId,
        });

        return c.json({ success: true, data: project }, 201);
    },

    async getProjects(c: Context) {
        const userId = c.req.header('X-User-Id');

        if (!userId) {
            return c.json({ success: false, error: 'Unauthorized' }, 401);
        }

        const projects = await projectService.getUserProjects(userId);
        return c.json({ success: true, data: projects });
    },

    async getProject(c: Context) {
        const { id } = c.req.param();
        if (!id) {
            return c.json({ success: false, error: 'Project ID is required' }, 400);
        }

        const project = await projectService.getById(id);

        if (!project) {
            return c.json({ success: false, error: 'Project not found' }, 404);
        }

        return c.json({ success: true, data: project });
    },

    async updateProject(c: Context) {
        const { id } = c.req.param();
        if (!id) {
            return c.json({ success: false, error: 'Project ID is required' }, 400);
        }

        const body = await c.req.json();

        const project = await projectService.update(id, body);
        return c.json({ success: true, data: project });
    },

    async deleteProject(c: Context) {
        const { id } = c.req.param();
        if (!id) {
            return c.json({ success: false, error: 'Project ID is required' }, 400);
        }

        await projectService.delete(id);
        return c.json({ success: true, message: 'Project deleted' });
    },
};

// Floor Plan Controllers
export const floorPlanController = {
    async createFloorPlan(c: Context) {
        const { projectId } = c.req.param();
        const body = await c.req.json();

        const floorPlan = await floorPlanService.create({
            ...body,
            projectId,
        });

        return c.json({ success: true, data: floorPlan }, 201);
    },

    async getFloorPlans(c: Context) {
        const { projectId } = c.req.param();
        if (!projectId) {
            return c.json({ success: false, error: 'Project ID is required' }, 400);
        }

        const floorPlans = await floorPlanService.getByProjectId(projectId);
        return c.json({ success: true, data: floorPlans });
    },

    async deleteFloorPlan(c: Context) {
        const { id } = c.req.param();
        if (!id) {
            return c.json({ success: false, error: 'Floor plan ID is required' }, 400);
        }

        await floorPlanService.delete(id);
        return c.json({ success: true, message: 'Floor plan deleted' });
    },

    async saveAnnotations(c: Context) {
        const { id } = c.req.param();
        const { annotations } = await c.req.json();

        if (!id) {
            return c.json({ success: false, error: 'Floor plan ID is required' }, 400);
        }

        await floorPlanService.saveAnnotations(id, annotations);
        return c.json({ success: true, message: 'Annotations saved' });
    },

    async getAnnotations(c: Context) {
        const { id } = c.req.param();
        if (!id) {
            return c.json({ success: false, error: 'Floor plan ID is required' }, 400);
        }

        const annotations = await floorPlanService.getAnnotations(id);
        return c.json({ success: true, data: annotations });
    },
};

// Person Controllers
export const personController = {
    async addPerson(c: Context) {
        const { projectId } = c.req.param();
        const body = await c.req.json();
        const userId = c.req.header('X-User-Id');

        if (!userId) {
            return c.json({ success: false, error: 'Unauthorized' }, 401);
        }

        const person = await personService.create({
            ...body,
            projectId,
            userId,
        });

        return c.json({ success: true, data: person }, 201);
    },

    async getPeople(c: Context) {
        const { projectId } = c.req.param();
        if (!projectId) {
            return c.json({ success: false, error: 'Project ID is required' }, 400);
        }

        const people = await personService.getByProjectId(projectId);
        return c.json({ success: true, data: people });
    },

    async updatePerson(c: Context) {
        const { id } = c.req.param();
        if (!id) {
            return c.json({ success: false, error: 'Person ID is required' }, 400);
        }

        const body = await c.req.json();

        const person = await personService.update(id, body);
        return c.json({ success: true, data: person });
    },

    async deletePerson(c: Context) {
        const { id } = c.req.param();
        if (!id) {
            return c.json({ success: false, error: 'Person ID is required' }, 400);
        }

        await personService.delete(id);
        return c.json({ success: true, message: 'Person deleted' });
    },
};

// Task Controllers
export const taskController = {
    async createTask(c: Context) {
        const { projectId } = c.req.param();
        const body = await c.req.json();

        const task = await taskService.create({
            ...body,
            projectId,
        });

        return c.json({ success: true, data: task }, 201);
    },

    async getTasks(c: Context) {
        const { projectId } = c.req.param();
        if (!projectId) {
            return c.json({ success: false, error: 'Project ID is required' }, 400);
        }

        const tasks = await taskService.getByProjectId(projectId);
        return c.json({ success: true, data: tasks });
    },

    async updateTask(c: Context) {
        const { id } = c.req.param();
        if (!id) {
            return c.json({ success: false, error: 'Task ID is required' }, 400);
        }

        const body = await c.req.json();

        const task = await taskService.update(id, body);
        return c.json({ success: true, data: task });
    },

    async deleteTask(c: Context) {
        const { id } = c.req.param();
        if (!id) {
            return c.json({ success: false, error: 'Task ID is required' }, 400);
        }

        await taskService.delete(id);
        return c.json({ success: true, message: 'Task deleted' });
    },
};

// Notification Controllers
export const notificationController = {
    async getNotifications(c: Context) {
        const userId = c.req.header('X-User-Id');

        if (!userId) {
            return c.json({ success: false, error: 'Unauthorized' }, 401);
        }

        const notifications = await notificationService.getUserNotifications(userId);
        return c.json({ success: true, data: notifications });
    },

    async markAsRead(c: Context) {
        const { id } = c.req.param();
        if (!id) {
            return c.json({ success: false, error: 'Notification ID is required' }, 400);
        }

        const notification = await notificationService.markAsRead(id);
        return c.json({ success: true, data: notification });
    },

    async deleteNotification(c: Context) {
        const { id } = c.req.param();
        if (!id) {
            return c.json({ success: false, error: 'Notification ID is required' }, 400);
        }

        await notificationService.delete(id);
        return c.json({ success: true, message: 'Notification deleted' });
    },
};

// Gemini Controllers
export { geminiController } from './geminiController';

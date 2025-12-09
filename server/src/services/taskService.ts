import prisma from '../utils/prisma';

export const taskService = {
    // Create a task
    async create(data: {
        title: string;
        description?: string;
        status?: string;
        priority?: string;
        dueDate?: Date;
        projectId: string;
    }) {
        return await prisma.task.create({
            data,
        });
    },

    // Get tasks for a project
    async getByProjectId(projectId: string) {
        return await prisma.task.findMany({
            where: { projectId },
        });
    },

    // Get a single task
    async getById(id: string) {
        return await prisma.task.findUnique({
            where: { id },
        });
    },

    // Update a task
    async update(id: string, data: {
        title?: string;
        description?: string;
        status?: string;
        priority?: string;
        dueDate?: Date;
    }) {
        return await prisma.task.update({
            where: { id },
            data,
        });
    },

    // Delete a task
    async delete(id: string) {
        return await prisma.task.delete({
            where: { id },
        });
    },
};

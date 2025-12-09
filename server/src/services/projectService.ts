import prisma from '../utils/prisma';

export const projectService = {
    // Create a new project
    async create(data: {
        name: string;
        address?: string;
        description?: string;
        userId: string;
    }) {
        return await prisma.project.create({
            data,
        });
    },

    // Get all projects for a user
    async getUserProjects(userId: string) {
        return await prisma.project.findMany({
            where: { userId },
            include: {
                floorPlans: true,
                people: true,
                tasks: true,
            },
        });
    },

    // Get a single project
    async getById(id: string) {
        return await prisma.project.findUnique({
            where: { id },
            include: {
                floorPlans: true,
                people: true,
                tasks: true,
            },
        });
    },

    // Update a project
    async update(id: string, data: {
        name?: string;
        address?: string;
        description?: string;
        status?: string;
    }) {
        return await prisma.project.update({
            where: { id },
            data,
        });
    },

    // Delete a project
    async delete(id: string) {
        return await prisma.project.delete({
            where: { id },
        });
    },
};

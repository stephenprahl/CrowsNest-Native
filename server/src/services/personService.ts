import prisma from '../utils/prisma';

export const personService = {
    // Add a person to a project
    async create(data: {
        name: string;
        email?: string;
        phone?: string;
        role: string;
        avatar?: string;
        projectId: string;
        userId: string;
    }) {
        return await prisma.person.create({
            data,
        });
    },

    // Get people on a project
    async getByProjectId(projectId: string) {
        return await prisma.person.findMany({
            where: { projectId },
        });
    },

    // Get a single person
    async getById(id: string) {
        return await prisma.person.findUnique({
            where: { id },
        });
    },

    // Update a person
    async update(id: string, data: {
        name?: string;
        email?: string;
        phone?: string;
        role?: string;
        avatar?: string;
    }) {
        return await prisma.person.update({
            where: { id },
            data,
        });
    },

    // Delete a person
    async delete(id: string) {
        return await prisma.person.delete({
            where: { id },
        });
    },
};

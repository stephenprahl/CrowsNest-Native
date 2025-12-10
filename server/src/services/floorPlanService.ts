import prisma from '../utils/prisma';

export const floorPlanService = {
    // Create a floor plan
    async create(data: {
        name: string;
        image?: string;
        projectId: string;
    }) {
        return await prisma.floorPlan.create({
            data,
        });
    },

    // Get floor plans for a project
    async getByProjectId(projectId: string) {
        return await prisma.floorPlan.findMany({
            where: { projectId },
        });
    },

    // Get a single floor plan
    async getById(id: string) {
        return await prisma.floorPlan.findUnique({
            where: { id },
        });
    },

    // Delete a floor plan
    async delete(id: string) {
        return await prisma.floorPlan.delete({
            where: { id },
        });
    },

    // Save annotations for a floor plan
    async saveAnnotations(floorPlanId: string, annotations: any[]) {
        // Delete existing annotations
        await prisma.annotation.deleteMany({
            where: { floorPlanId },
        });

        // Create new annotations
        const annotationData = annotations.map(annotation => ({
            ...annotation,
            floorPlanId,
        }));

        return await prisma.annotation.createMany({
            data: annotationData,
        });
    },

    // Get annotations for a floor plan
    async getAnnotations(floorPlanId: string) {
        return await prisma.annotation.findMany({
            where: { floorPlanId },
            orderBy: { createdAt: 'asc' },
        });
    },
};

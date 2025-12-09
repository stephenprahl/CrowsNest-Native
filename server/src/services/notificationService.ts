import prisma from '../utils/prisma';

export const notificationService = {
    // Create a notification
    async create(data: {
        title: string;
        message: string;
        type: string;
        userId: string;
    }) {
        return await prisma.notification.create({
            data,
        });
    },

    // Get notifications for a user
    async getUserNotifications(userId: string) {
        return await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    },

    // Mark as read
    async markAsRead(id: string) {
        return await prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    },

    // Delete a notification
    async delete(id: string) {
        return await prisma.notification.delete({
            where: { id },
        });
    },
};

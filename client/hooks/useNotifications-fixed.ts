import { useCallback, useState } from 'react';
import { notificationAPI } from '../api';
import { Notification } from '../types';

export const useNotifications = (userId: string) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const response = await notificationAPI.getAll(userId);
            if (response.success && response.data) {
                setNotifications(response.data);
                setError(null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const markAsRead = useCallback(async (id: string) => {
        try {
            const response = await notificationAPI.markAsRead(id);
            if (response.success && response.data) {
                setNotifications(
                    notifications.map((n) => (n.id === id ? response.data! : n))
                );
                return response.data;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to mark as read');
        }
    }, [notifications]);

    const deleteNotification = useCallback(
        async (id: string) => {
            try {
                await notificationAPI.delete(id);
                setNotifications(notifications.filter((n) => n.id !== id));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete notification');
            }
        },
        [notifications]
    );

    return {
        notifications,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        deleteNotification,
        setNotifications,
    };
};

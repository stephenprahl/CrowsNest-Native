import { useCallback, useState } from 'react';
import { taskAPI } from '../api';
import { Task } from '../types';

export const useTasks = (projectId: string) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await taskAPI.getByProject(projectId);
            if (response.success && response.data) {
                setTasks(response.data);
                setError(null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    const createTask = useCallback(
        async (data: {
            title: string;
            description?: string;
            status?: string;
            priority?: string;
            dueDate?: string;
        }) => {
            try {
                const response = await taskAPI.create(projectId, data);
                if (response.success && response.data) {
                    setTasks([...tasks, response.data]);
                    return response.data;
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to create task');
            }
        },
        [projectId, tasks]
    );

    const updateTask = useCallback(
        async (
            id: string,
            data: {
                title?: string;
                description?: string;
                status?: string;
                priority?: string;
                dueDate?: string;
            }
        ) => {
            try {
                const response = await taskAPI.update(id, data);
                if (response.success && response.data) {
                    setTasks(tasks.map((t) => (t.id === id ? response.data! : t)));
                    return response.data;
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to update task');
            }
        },
        [tasks]
    );

    const deleteTask = useCallback(
        async (id: string) => {
            try {
                await taskAPI.delete(id);
                setTasks(tasks.filter((t) => t.id !== id));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete task');
            }
        },
        [tasks]
    );

    return {
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        setTasks,
    };
};

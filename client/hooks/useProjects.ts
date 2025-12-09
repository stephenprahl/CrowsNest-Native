import { useCallback, useState } from 'react';
import { projectAPI } from '../api';
import { Project } from '../types';

export const useProjects = (userId: string) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const response = await projectAPI.getAll(userId);
            if (response.success && response.data) {
                setProjects(response.data);
                setError(null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const createProject = useCallback(
        async (data: { name: string; address?: string; description?: string }) => {
            try {
                const response = await projectAPI.create(data, userId);
                if (response.success && response.data) {
                    setProjects([...projects, response.data]);
                    return response.data;
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to create project');
            }
        },
        [userId, projects]
    );

    const updateProject = useCallback(
        async (
            id: string,
            data: { name?: string; address?: string; description?: string; status?: string }
        ) => {
            try {
                const response = await projectAPI.update(id, data);
                if (response.success && response.data) {
                    setProjects(projects.map((p) => (p.id === id ? response.data! : p)));
                    return response.data;
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to update project');
            }
        },
        [projects]
    );

    const deleteProject = useCallback(
        async (id: string) => {
            try {
                await projectAPI.delete(id);
                setProjects(projects.filter((p) => p.id !== id));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete project');
            }
        },
        [projects]
    );

    return {
        projects,
        loading,
        error,
        fetchProjects,
        createProject,
        updateProject,
        deleteProject,
        setProjects,
    };
};

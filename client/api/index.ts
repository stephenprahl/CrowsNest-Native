import { ApiResponse, FloorPlan, Notification, Person, Project, Task } from '../types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const USER_ID = ''; // This should be set from auth context

// Helper function for API calls
async function apiCall<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any,
    userId?: string
) {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (userId) {
        headers['X-User-Id'] = userId;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'An error occurred');
    }

    return (await response.json()) as ApiResponse<T>;
}

// Project API
export const projectAPI = {
    async getAll(userId: string) {
        return apiCall<Project[]>('/projects', 'GET', undefined, userId);
    },

    async getById(id: string) {
        return apiCall<Project>(`/projects/${id}`);
    },

    async create(data: { name: string; address?: string; description?: string }, userId: string) {
        return apiCall<Project>('/projects', 'POST', data, userId);
    },

    async update(
        id: string,
        data: { name?: string; address?: string; description?: string; status?: string }
    ) {
        return apiCall<Project>(`/projects/${id}`, 'PUT', data);
    },

    async delete(id: string) {
        return apiCall<void>(`/projects/${id}`, 'DELETE');
    },
};

// Floor Plan API
export const floorPlanAPI = {
    async getByProject(projectId: string) {
        return apiCall<FloorPlan[]>(`/${projectId}/floor-plans`);
    },

    async create(projectId: string, data: { name: string; image?: string }) {
        return apiCall<FloorPlan>(`/${projectId}/floor-plans`, 'POST', data);
    },

    async delete(id: string) {
        return apiCall<void>(`/floor-plans/${id}`, 'DELETE');
    },

    async saveAnnotations(id: string, annotations: any[]) {
        return apiCall<void>(`/floor-plans/${id}/annotations`, 'POST', { annotations });
    },

    async getAnnotations(id: string) {
        return apiCall<any[]>(`/floor-plans/${id}/annotations`, 'GET');
    },
};

// Person API
export const personAPI = {
    async getByProject(projectId: string) {
        return apiCall<Person[]>(`/${projectId}/people`);
    },

    async create(
        projectId: string,
        data: {
            name: string;
            email?: string;
            phone?: string;
            role: string;
            avatar?: string;
        },
        userId: string
    ) {
        return apiCall<Person>(`/${projectId}/people`, 'POST', data, userId);
    },

    async update(
        id: string,
        data: {
            name?: string;
            email?: string;
            phone?: string;
            role?: string;
            avatar?: string;
        }
    ) {
        return apiCall<Person>(`/people/${id}`, 'PUT', data);
    },

    async delete(id: string) {
        return apiCall<void>(`/people/${id}`, 'DELETE');
    },
};

// Task API
export const taskAPI = {
    async getByProject(projectId: string) {
        return apiCall<Task[]>(`/${projectId}/tasks`);
    },

    async create(
        projectId: string,
        data: {
            title: string;
            description?: string;
            status?: string;
            priority?: string;
            dueDate?: string;
        }
    ) {
        return apiCall<Task>(`/${projectId}/tasks`, 'POST', data);
    },

    async update(
        id: string,
        data: {
            title?: string;
            description?: string;
            status?: string;
            priority?: string;
            dueDate?: string;
        }
    ) {
        return apiCall<Task>(`/tasks/${id}`, 'PUT', data);
    },

    async delete(id: string) {
        return apiCall<void>(`/tasks/${id}`, 'DELETE');
    },
};

// Notification API
export const notificationAPI = {
    async getAll(userId: string) {
        return apiCall<Notification[]>('/notifications', 'GET', undefined, userId);
    },

    async markAsRead(id: string) {
        return apiCall<Notification>(`/notifications/${id}/read`, 'PUT');
    },

    async delete(id: string) {
        return apiCall<void>(`/notifications/${id}`, 'DELETE');
    },
};

// Gemini API
export const geminiAPI = {
    async generate(prompt: string) {
        return apiCall<{ response: string }>('/gemini/generate', 'POST', { prompt });
    },
};

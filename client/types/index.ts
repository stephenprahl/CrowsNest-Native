// Types shared between client and server
export interface Project {
    id: string;
    name: string;
    address?: string;
    description?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    floorPlans?: FloorPlan[];
    people?: Person[];
    tasks?: Task[];
}

export interface FloorPlan {
    id: string;
    name: string;
    image?: string;
    projectId: string;
    createdAt: string;
    updatedAt: string;
    annotations?: Annotation[];
}

export interface Annotation {
    id: string;
    type: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    endX?: number;
    endY?: number;
    text?: string;
    color: string;
    distance?: number;
    floorPlanId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Person {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    role: string;
    avatar?: string;
    projectId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate?: string;
    projectId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    userId: string;
    createdAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

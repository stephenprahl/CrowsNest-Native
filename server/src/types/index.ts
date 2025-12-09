import { FloorPlan, Notification, Person, Project, Task, User } from '@prisma/client';

// User Types
export type UserResponse = User;

// Project Types
export type ProjectResponse = Project;

// FloorPlan Types
export type FloorPlanResponse = FloorPlan;

// Person Types
export type PersonResponse = Person;

// Task Types
export type TaskResponse = Task;

// Notification Types
export type NotificationResponse = Notification;

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

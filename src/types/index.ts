// Auth Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface User {
    id: string;
    email: string;
    name: string;
    createdAt?: string;
}

// Project Types
export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';

export interface Project {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    createdAt: string;
    updatedAt: string;
    tasks?: Task[];
}

export interface CreateProjectRequest {
    name: string;
    description: string;
    status: ProjectStatus;
}

export interface UpdateProjectRequest {
    name?: string;
    description?: string;
    status?: ProjectStatus;
}

export interface ProjectsResponse {
    projects: Project[];
    totalPages: number;
    currentPage: number;
}

// Task Types
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    projectId: string;
    assignedTo?: string;
    assignedUser?: User;
    project?: Project;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    projectId: string;
    priority: TaskPriority;
    dueDate: string;
    assignedTo?: string;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    assignedTo?: string;
}

export interface TasksResponse {
    tasks: Task[];
    totalPages: number;
    currentPage: number;
}

export interface TaskFilters {
    projectId?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assignedTo?: string;
    page?: number;
    limit?: number;
}

// Team Types
export interface TeamMember {
    id: string;
    name: string;
    email: string;
}

export interface TeamMembersResponse {
    members: TeamMember[];
}

// Dashboard Types
export interface DashboardStats {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
    totalProjects: number;
    activeProjects: number;
}
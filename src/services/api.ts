import axios from 'axios';
import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    User,
    Project,
    CreateProjectRequest,
    UpdateProjectRequest,
    ProjectsResponse,
    Task,
    CreateTaskRequest,
    UpdateTaskRequest,
    TasksResponse,
    TaskFilters,
    TeamMembersResponse,
    TaskStatus,
} from '../types';

const API_BASE_URL = 'https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para añadir el token JWT (excepto en rutas de auth)
api.interceptors.request.use(
    (config) => {
        const isAuthRoute = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');

        if (!isAuthRoute) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const isAuthRoute = error.config?.url?.includes('/auth/');
            if (!isAuthRoute) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: async (data: RegisterRequest): Promise<{ message: string }> => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    getProfile: async (): Promise<User> => {
        const response = await api.get<User>('/auth/profile');
        return response.data;
    },
};

// Projects APIs
export const projectsAPI = {
    getAll: async (page: number = 1, limit: number = 10, search: string = ''): Promise<ProjectsResponse> => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });
        if (search) params.append('search', search);

        const response = await api.get<ProjectsResponse>(`/projects?${params.toString()}`);
        return response.data;
    },

    getById: async (id: string): Promise<Project> => {
        const response = await api.get<Project>(`/projects/${id}`);
        return response.data;
    },

    create: async (data: CreateProjectRequest): Promise<Project> => {
        const response = await api.post<Project>('/projects', data);
        return response.data;
    },

    update: async (id: string, data: UpdateProjectRequest): Promise<Project> => {
        const response = await api.put<Project>(`/projects/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/projects/${id}`);
    },
};

// Tasks APIs
export const tasksAPI = {
    getAll: async (filters: TaskFilters = {}): Promise<TasksResponse> => {
        const params = new URLSearchParams();

        if (filters.projectId) params.append('projectId', filters.projectId);
        if (filters.status) params.append('status', filters.status);
        if (filters.priority) params.append('priority', filters.priority);
        if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get<TasksResponse>(`/tasks?${params.toString()}`);
        return response.data;
    },

    getById: async (id: string): Promise<Task> => {
        const response = await api.get<Task>(`/tasks/${id}`);
        return response.data;
    },

    create: async (data: CreateTaskRequest): Promise<Task> => {
        const response = await api.post<Task>('/tasks', data);
        return response.data;
    },

    update: async (id: string, data: UpdateTaskRequest): Promise<Task> => {
        const response = await api.put<Task>(`/tasks/${id}`, data);
        return response.data;
    },

    updateStatus: async (id: string, status: TaskStatus): Promise<Task> => {
        const response = await api.patch<Task>(`/tasks/${id}/status`, { status });
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/tasks/${id}`);
    },
};

// Team APIs
export const teamAPI = {
    getMembers: async (): Promise<TeamMembersResponse> => {
        const response = await api.get<TeamMembersResponse>('/team/members');
        return response.data;
    },

    getMemberTasks: async (memberId: string): Promise<{ tasks: Task[] }> => {
        const response = await api.get<{ tasks: Task[] }>(`/team/members/${memberId}/tasks`);
        return response.data;
    },
};

export default api;
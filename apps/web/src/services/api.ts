import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Token storage keys
const ACCESS_TOKEN_KEY = "access_token";

// Token helpers
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (accessToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - attach access token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearTokens();
      // Redirect to login if not already there
      if (window.location.pathname !== "/admin") {
        window.location.href = "/admin";
      }
    }
    return Promise.reject(error);
  }
);

// API Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  excerpt: string | null;
  status: "draft" | "published" | "archived";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    email: string;
    name: string | null;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface CreatePostDto {
  title: string;
  content: string;
  excerpt?: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  excerpt?: string;
}

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  register: async (
    email: string,
    password: string,
    name?: string
  ): Promise<User> => {
    const response = await api.post<User>("/auth/register", {
      email,
      password,
      name,
    });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },
};

// Posts API
export const postsApi = {
  // Public endpoints
  getPublished: async (
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Post>> => {
    const response = await api.get<PaginatedResponse<Post>>(
      `/posts?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Post> => {
    const response = await api.get<Post>(`/posts/slug/${slug}`);
    return response.data;
  },

  getById: async (id: string): Promise<Post> => {
    const response = await api.get<Post>(`/posts/${id}`);
    return response.data;
  },

  // Authenticated endpoints
  getMyPosts: async (
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Post>> => {
    const response = await api.get<PaginatedResponse<Post>>(
      `/posts/my?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Admin endpoints
  getAllPosts: async (
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Post>> => {
    const response = await api.get<PaginatedResponse<Post>>(
      `/posts/admin/all?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  create: async (data: CreatePostDto): Promise<Post> => {
    const response = await api.post<Post>("/posts", data);
    return response.data;
  },

  update: async (id: string, data: UpdatePostDto): Promise<Post> => {
    const response = await api.patch<Post>(`/posts/${id}`, data);
    return response.data;
  },

  publish: async (id: string): Promise<Post> => {
    const response = await api.patch<Post>(`/posts/${id}/publish`);
    return response.data;
  },

  archive: async (id: string): Promise<Post> => {
    const response = await api.patch<Post>(`/posts/${id}/archive`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};

export default api;

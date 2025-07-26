import axios, { AxiosInstance, AxiosResponse } from "axios";
const BASE_URL = "http://localhost:5000/api";

// Interfaces
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  user: string;
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: User;
}

export interface NoteRequest {
  title: string;
  content: string;
  isPinned?: boolean;
  tags?: string[];
}

export interface NoteResponse {
  message: string;
  note: Note;
}

export interface NotesResponse {
  message: string;
  notes: Note[];
}

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      // Only redirect if it's not a login request
      const isLoginRequest = error.config?.url?.includes("/auth/login");
      if (!isLoginRequest) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },
};

// Notes API
export const notesAPI = {
  getAll: async (): Promise<NotesResponse> => {
    const response = await api.get("/notes");
    return response.data;
  },

  getById: async (id: string): Promise<NoteResponse> => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  create: async (data: NoteRequest): Promise<NoteResponse> => {
    const response = await api.post("/notes", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<NoteRequest>
  ): Promise<NoteResponse> => {
    const response = await api.put(`/notes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
};

// Health API
export const healthAPI = {
  check: async (): Promise<{ message: string }> => {
    const response = await api.get("/health");
    return response.data;
  },
};

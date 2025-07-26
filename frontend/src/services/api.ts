import axios, { AxiosInstance, AxiosResponse } from "axios";

const BASE_URL = "http://localhost:5000/api";

// API response interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tags?: string[];
  isPinned?: boolean;
}

export interface UpdateNoteRequest extends CreateNoteRequest {}

export interface NotesResponse {
  message: string;
  notes: Note[];
}

export interface NoteResponse {
  message: string;
  note: Note;
}

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      // Only redirect if it's not a login request
      const isLoginRequest = error.config?.url?.includes("/auth/login");
      if (!isLoginRequest) {
        // Clear invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/register", userData);
    return response.data;
  },
};

// Notes API methods
export const notesAPI = {
  getAll: async (): Promise<NotesResponse> => {
    const response = await api.get<NotesResponse>("/notes");
    return response.data;
  },

  getById: async (id: string): Promise<NoteResponse> => {
    const response = await api.get<NoteResponse>(`/notes/${id}`);
    return response.data;
  },

  create: async (noteData: CreateNoteRequest): Promise<NoteResponse> => {
    const response = await api.post<NoteResponse>("/notes", noteData);
    return response.data;
  },

  update: async (
    id: string,
    noteData: UpdateNoteRequest
  ): Promise<NoteResponse> => {
    const response = await api.put<NoteResponse>(`/notes/${id}`, noteData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },
};

// Health check
export const healthAPI = {
  check: async (): Promise<{
    status: string;
    timestamp: string;
    environment: string;
  }> => {
    const response = await api.get("/health");
    return response.data;
  },
};

export default api;

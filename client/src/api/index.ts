import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Automatically attach token if available
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Transform snake_case to camelCase in responses
api.interceptors.response.use((response) => {
  if (response.data && Array.isArray(response.data)) {
    // Transform array of objects
    response.data = response.data.map((item) => transformSnakeToCamel(item));
  } else if (response.data && typeof response.data === "object") {
    // Transform single object
    response.data = transformSnakeToCamel(response.data);
  }
  return response;
});

// Helper function to transform snake_case to camelCase
const transformSnakeToCamel = (obj: any): any => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(transformSnakeToCamel);
  }

  const transformed: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase()
    );
    transformed[camelKey] = transformSnakeToCamel(value);
  }
  return transformed;
};

// AI-specific API functions
export const aiApi = {
  // Create task with real AI parsing
  createTask: async (naturalLanguageInput: string) => {
    const response = await api.post("/ai-tasks/create", {
      naturalLanguageInput,
    });
    return response.data;
  },

  // Enhance existing task with AI
  enhanceTask: async (taskData: {
    title: string;
    description?: string;
    due_date?: string;
    priority?: "low" | "medium" | "high";
  }) => {
    const response = await api.post("/ai-tasks/enhance", taskData);
    return response.data;
  },

  // Get AI suggestions for task improvements
  getSuggestions: async (taskData: {
    title: string;
    description?: string;
    due_date?: string;
    priority?: "low" | "medium" | "high";
  }) => {
    const response = await api.post("/ai-tasks/suggestions", taskData);
    return response.data;
  },
};

export default api;

import type { User, UserInput, UserStats } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Request failed.") as Error & { details?: Record<string, string> };
    error.details = data.errors;
    throw error;
  }

  return data as T;
}

export const userApi = {
  list: () => request<User[]>("/users"),
  get: (id: string) => request<User>(`/users/${id}`),
  create: (payload: UserInput) =>
    request<User>("/users", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: string, payload: UserInput) =>
    request<User>(`/users/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id: string) =>
    request<{ message: string }>(`/users/${id}`, { method: "DELETE" }),
  stats: () => request<UserStats>("/users/stats/summary")
};
import { getToken, clearAuth } from "./auth";

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    if (!path.startsWith("/auth/")) {
      clearAuth();
    }
    throw new UnauthorizedError();
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Request failed");
  }

  if (response.status === 204) return undefined as T;

  return response.json();
}

export const api = {
  auth: {
    login: (data: { username: string; password: string }) =>
      request<{ token: string; type: string; username: string; email: string }>(
        "/auth/login",
        { method: "POST", body: JSON.stringify(data) }
      ),
    signup: (data: { username: string; email: string; password: string }) =>
      request<{ token: string; type: string; username: string; email: string }>(
        "/auth/signup",
        { method: "POST", body: JSON.stringify(data) }
      ),
  },
  items: {
    getAll: () =>
      request<
        {
          id: number;
          name: string;
          description: string | null;
          completed: boolean;
        }[]
      >("/items"),
    getById: (id: number) =>
      request<{
        id: number;
        name: string;
        description: string | null;
        completed: boolean;
      }>(`/items/${id}`),
    create: (data: {
      name: string;
      description: string;
      completed: boolean;
    }) =>
      request<{
        id: number;
        name: string;
        description: string | null;
        completed: boolean;
      }>("/items", { method: "POST", body: JSON.stringify(data) }),
    update: (
      id: number,
      data: { name: string; description: string; completed: boolean }
    ) =>
      request<{
        id: number;
        name: string;
        description: string | null;
        completed: boolean;
      }>(`/items/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) =>
      request<void>(`/items/${id}`, { method: "DELETE" }),
    search: (name: string) =>
      request<
        {
          id: number;
          name: string;
          description: string | null;
          completed: boolean;
        }[]
      >(`/items/search?name=${encodeURIComponent(name)}`),
    exportCsv: () =>
      request<{ filename: string; status: string; message: string }>(
        "/items/csv/export",
        { method: "POST" }
      ),
    csvStatus: (filename: string) =>
      request<{
        filename: string;
        status: "PROCESSING" | "COMPLETED" | "FAILED" | "NOT_FOUND";
      }>(`/items/csv/status/${filename}`),
    downloadCsv: async (filename: string) => {
      const token = getToken();
      const res = await fetch(`${API_BASE}/items/csv/download/${filename}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  },
};

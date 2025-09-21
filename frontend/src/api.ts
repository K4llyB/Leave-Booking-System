// src/api.ts
// Base URL comes from Vite env. Example: VITE_API_URL=http://localhost:8900/api
const BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8900/api").replace(/\/$/, "");

async function req<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as any),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = `${BASE}/${String(path).replace(/^\/+/, "")}`;
  const res = await fetch(url, { ...init, headers });

  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export type LeavePayload = {
  employee_id: number;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  reason?: string;
};

export type LeaveRow = {
  id: number;
  employee_id: number;
  start_date?: any;
  end_date?: any;
  status?: string;
  reason?: string;
};

export const api = {
  // Auth
  login: (email: string, password: string) =>
    req<{ token: string }>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // Lists
  listLeaveForEmployee: (employeeId: number) =>
    req<LeaveRow[]>(`/leave-requests/status/${employeeId}`),

  listAllLeave: () =>
    req<LeaveRow[]>(`/leave-requests`),

  remainingFor: (employeeId: number) =>
    req<{ remaining_leave_days: number }>(`/leave-requests/remaining/${employeeId}`),

  // Create/Update/Delete
  createLeave: (payload: LeavePayload) =>
    req(`/leave-requests`, { method: "POST", body: JSON.stringify(payload) }),

  approveLeave: (id: number) =>
  req(`/leave-requests/approve`, {
    method: "PATCH",
    body: JSON.stringify({ leave_request_id: id }),
  }),

rejectLeave: (id: number) =>
  req(`/leave-requests/reject`, {
    method: "PATCH",
    body: JSON.stringify({ leave_request_id: id }),
  }),

cancelLeave: (id: number, employee_id?: number) =>
  req(`/leave-requests`, {
    method: "DELETE",
    body: JSON.stringify({ leave_request_id: id, employee_id }),
  }),
};

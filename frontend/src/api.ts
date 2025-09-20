const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8900/api";
console.log("API BASE =", BASE);

async function req<T>(path: string, init: RequestInit = {}) {
  const token = sessionStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as any),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  const txt = await res.text();
  const data = txt ? JSON.parse(txt) : null;
  if (!res.ok) throw new Error((data && (data.message || data.error)) || `HTTP ${res.status}`);
  return data as T;
}

export const api = {
  login: (email: string, password: string) =>
    req<{ token: string }>("/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  listLeave: () => req<any[]>("/leave-requests"),
  createLeave: (payload: { employee_id: number; start_date: string; end_date: string; reason?: string }) =>
    req<any>("/leave-requests", { method: "POST", body: JSON.stringify(payload) }),
  approveLeave: (id: number) =>
    req<any>("/leave-requests/approve", { method: "PATCH", body: JSON.stringify({ id }) }),
  rejectLeave: (id: number) =>
    req<any>("/leave-requests/reject", { method: "PATCH", body: JSON.stringify({ id }) }),
  cancelLeave: (id: number, employee_id: number) =>
    req<void>("/leave-requests", { method: "DELETE", body: JSON.stringify({ id, employee_id }) }),
  remainingFor: (employee_id: number) =>
    req<{ employee_id: number; remaining_leave_days: number }>(`/leave-requests/remaining/${employee_id}`),
};

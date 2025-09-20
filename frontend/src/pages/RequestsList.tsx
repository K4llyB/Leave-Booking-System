// src/pages/RequestsList.tsx
import { useEffect, useState } from "react";
import { api } from "../api";

type Leave = {
  id: number;
  employee_id: number;
  start_date: string;
  end_date: string;
  status?: string;
  reason?: string;
};

export default function RequestsList() {
  const [rows, setRows] = useState<Leave[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function load() {
    setErr(null);
    try {
      const list = await api.listLeave();
      const arr: Leave[] = Array.isArray(list) ? list : ((list as any).data ?? []);
      setRows(arr);

      // Try to show remaining leave using the first request's employee_id (if any)
      const firstId = arr[0]?.employee_id;
      if (firstId != null) {
        const r = await api.remainingFor(firstId);
        setRemaining(r.remaining_leave_days);
      } else {
        setRemaining(null);
      }
    } catch (e: any) {
      setErr(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function cancel(id: number, employee_id: number) {
    if (!confirm("Cancel this request?")) return;
    try {
      await api.cancelLeave(id, employee_id);
      await load();
    } catch (e: any) {
      setErr(e.message || "Failed to cancel");
    }
  }

  if (loading) return <p>Loading…</p>;
  if (err) return <p className="text-red-700">{err}</p>;

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">My leave requests</h1>

      {remaining != null && (
        <div className="border rounded p-3 bg-gray-50" role="status" aria-live="polite">
          <p className="font-medium">Remaining leave: {remaining} days</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Start</th>
              <th className="p-2 text-left">End</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.id}</td>
                <td className="p-2">{new Date(r.start_date).toLocaleDateString()}</td>
                <td className="p-2">{new Date(r.end_date).toLocaleDateString()}</td>
                <td className="p-2">{r.status ?? "pending"}</td>
                <td className="p-2">
                  {(!r.status || r.status.toLowerCase() !== "approved") && (
                    <button
                      className="px-2 py-1 rounded bg-gray-200"
                      onClick={() => cancel(r.id, r.employee_id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

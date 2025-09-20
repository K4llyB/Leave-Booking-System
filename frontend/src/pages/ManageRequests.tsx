import { useEffect, useState } from "react";
import { api } from "../api";

type Leave = { id: number; employee_id: number; start_date: string; end_date: string; status?: string; reason?: string; };

export default function ManageRequests() {
  const [rows, setRows] = useState<Leave[]>([]);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      const data = await api.listLeave();
      setRows(Array.isArray(data) ? data : (data as any).data ?? []);
    } catch (e: any) {
      setErr(e.message || "Failed to load");
    }
  }

  useEffect(() => { load(); }, []);

  async function act(kind: "approve" | "reject", id: number) {
    setBusyId(id);
    try {
      if (kind === "approve") await api.approveLeave(id);
      else await api.rejectLeave(id);
      await load();
    } catch (e: any) {
      setErr(e.message || "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Manage leave requests</h1>
      {err && <div className="p-2 bg-red-100 border border-red-300 rounded">{err}</div>}
      <table className="w-full border text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Employee</th>
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
              <td className="p-2">{r.employee_id}</td>
              <td className="p-2">{new Date(r.start_date).toLocaleDateString()}</td>
              <td className="p-2">{new Date(r.end_date).toLocaleDateString()}</td>
              <td className="p-2">{r.status ?? "pending"}</td>
              <td className="p-2 flex gap-2">
                <button
                  className="px-2 py-1 rounded bg-green-600 text-white disabled:opacity-50"
                  onClick={() => act("approve", r.id)}
                  disabled={busyId === r.id}
                >Approve</button>
                <button
                  className="px-2 py-1 rounded bg-red-600 text-white disabled:opacity-50"
                  onClick={() => act("reject", r.id)}
                  disabled={busyId === r.id}
                >Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

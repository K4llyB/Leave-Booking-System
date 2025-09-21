import { useEffect, useState } from "react";
import { api } from "../api";
import { pick, fmtDate } from "../date";

type Leave = {
  id: number;
  employee_id: number;
  start_date: string;
  end_date: string;
  status?: string;
  reason?: string;
};

export default function ManageRequests() {
  const [rows, setRows] = useState<Leave[]>([]);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const data = await api.listLeave();
      const arr: Leave[] = Array.isArray(data) ? data : ((data as any).data ?? []);
      setRows(arr);
    } catch (e: any) {
      setErr(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function act(kind: "approve" | "reject", id: number) {
    setBusyId(id);
    setErr(null);
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

  if (loading) return <p>Loading…</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Manage leave requests</h1>

      {err && (
        <div className="p-3 rounded border bg-red-50 text-red-800">{err}</div>
      )}

      {rows.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <p>No requests to manage right now.</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
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
                  <tr key={r.id} className="odd:bg-white even:bg-gray-50 border-t">
                    <td className="p-2">{r.id}</td>
                    <td className="p-2">{r.employee_id}</td>
                    <td className="p-2">{fmtDate(pick(r, ["start_date","startDate","start"]))}</td>
                    <td className="p-2">{fmtDate(pick(r, ["end_date","endDate","end"]))}</td>
                    <td className="p-2 capitalize">{r.status ?? "pending"}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        className="px-2 py-1 rounded bg-green-600 text-white hover:opacity-90 disabled:opacity-50"
                        onClick={() => act("approve", r.id)}
                        disabled={busyId === r.id}
                      >
                        Approve
                      </button>
                      <button
                        className="px-2 py-1 rounded bg-red-600 text-white hover:opacity-90 disabled:opacity-50"
                        onClick={() => act("reject", r.id)}
                        disabled={busyId === r.id}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

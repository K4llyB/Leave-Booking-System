import { useEffect, useState } from "react";
import { api } from "../api";
import { pick, fmtDate } from "../date";
import StatusBadge from "../components/StatusBadge";
import { useToast } from "../components/ToastProvider";

type Leave = {
  id: number;
  employee_id: number;
  start_date?: any;
  end_date?: any;
  status?: string;
  reason?: string;
};

export default function ManageRequests() {
  const toast = useToast();

  const [rows, setRows] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  async function load() {
    setErr(null);
    try {
      const data = await api.listAllLeave();
      const arr: Leave[] = Array.isArray(data) ? data : ((data as any).data ?? []);
      setRows(arr);
    } catch (e: any) {
      setErr(e.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function act(kind: "approve" | "reject", id: number) {
    try {
      setBusyId(id);
      if (kind === "approve") {
        await api.approveLeave(id);
        toast.success("Request approved");
      } else {
        await api.rejectLeave(id);
        toast.info("Request rejected");
      }
      await load();
    } catch (e: any) {
      toast.error(e.message || `Failed to ${kind} request`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Manage leave requests</h1>

      {err && (
        <div className="p-3 rounded border bg-red-50 text-red-800">{err}</div>
      )}

      {loading ? (
        <div className="p-4 border rounded bg-white">Loading…</div>
      ) : (
        (rows.length === 0 ? (
          <div className="p-4 border rounded bg-white text-gray-700">
            No requests to manage right now.
          </div>
        ) : (
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th scope="col" className="p-2 text-left">ID</th>
                    <th scope="col" className="p-2 text-left">Employee</th>
                    <th scope="col" className="p-2 text-left">Start</th>
                    <th scope="col" className="p-2 text-left">End</th>
                    <th scope="col" className="p-2 text-left">Status</th>
                    <th scope="col" className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="odd:bg-white even:bg-gray-50 border-t">
                      <td className="p-2">{r.id}</td>
                      <td className="p-2">{r.employee_id}</td>
                      <td className="p-2">
                        {fmtDate(pick(r, ["start_date", "startDate", "start"]))}
                      </td>
                      <td className="p-2">
                        {fmtDate(pick(r, ["end_date", "endDate", "end"]))}
                      </td>
                      <td className="p-2">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <button
 className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
  onClick={() => act("approve", r.id)}
  disabled={busyId === r.id}
  aria-label={`Approve request ${r.id}`}
>
  ✔ Approve
</button>
<button
  className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
  onClick={() => act("reject", r.id)}
  disabled={busyId === r.id}
  aria-label={`Reject request ${r.id}`}
>
  ✖ Reject
</button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

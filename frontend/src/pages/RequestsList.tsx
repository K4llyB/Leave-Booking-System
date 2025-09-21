import { useEffect, useState } from "react";
import { api } from "../api";
import { pick, fmtDate } from "../date";
import { useAuth } from "../auth";
import StatusBadge from "../components/StatusBadge";
import { useToast } from "../components/ToastProvider";

type Leave = {
  id: number;
  employee_id: number;
  start_date: string;
  end_date: string;
  status?: string;
  reason?: string;
};

export default function RequestsList() {
  // --- one-time success banner after login ---
  const [flash, setFlash] = useState<string | null>(sessionStorage.getItem("flash"));
  useEffect(() => {
    if (flash) sessionStorage.removeItem("flash"); 
  }, [flash]);

  // --- data/loading/error state ---
  const [rows, setRows] = useState<Leave[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { getEmployeeId } = useAuth();
  const toast = useToast();
  
  // normalize status and detect "pending"-like states
const statusOf = (r: any) => String((r?.status ?? "")).toLowerCase();
const isPending = (r: any) => ["pending", "awaiting approval", "requested"].includes(statusOf(r));

// filter state
const [show, setShow] = useState<"all" | "pending">("all");

// computed rows
const pendingCount = rows.filter(isPending).length;
const displayRows = show === "pending" ? rows.filter(isPending) : rows;

 async function load() {
  setErr(null);
  try {
    const me = getEmployeeId();
    const list = me ? await api.listLeaveForEmployee(me) : [];
    const arr = Array.isArray(list) ? list : (list as any).data ?? [];
    setRows(arr);
    if (me) {
      const r = await api.remainingFor(me);
      setRemaining(r.remaining_leave_days);
    } else {
      setRemaining(null);
      console.warn("[requests] no employee id from jwt");
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
      toast.info("Request cancelled");
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

      {/* success banner shown once after login */}
      {flash === "signed-in" && (
        <div className="p-3 rounded border bg-green-50 text-green-800" role="status" aria-live="polite">
          Signed in successfully.
          <button className="ml-3 underline" onClick={() => setFlash(null)}>dismiss</button>
        </div>
      )}

      {/*remaining-leave widget  */}
      {remaining != null && (
  <div
    role="status"
    aria-live="polite"
    className="inline-block mb-3 px-3 py-2 rounded border bg-white text-gray-700"
  >
    Remaining leave: <strong>{remaining}</strong>
  </div>
)}

      <div className="flex items-center gap-2 mb-3">
  <button
    onClick={() => setShow("all")}
    className={`px-3 py-1 rounded border ${show === "all" ? "bg-gray-200" : "bg-white"}`}
    aria-pressed={show === "all"}
  >
    All <span className="ml-1 text-xs text-gray-600">({rows.length})</span>
  </button>
  <button
    onClick={() => setShow("pending")}
    className={`px-3 py-1 rounded border ${show === "pending" ? "bg-gray-200" : "bg-white"}`}
    aria-pressed={show === "pending"}
  >
    Pending <span className="ml-1 text-xs text-gray-600">({pendingCount})</span>
  </button>
</div>

      {displayRows.length === 0 ? (
  // Empty state
  <div className="p-4 border rounded bg-white text-gray-700">
    No leave requests yet. Use <span className="font-medium">New Request</span> to create one.
  </div>
) : (
  <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th scope="col" className="p-2 text-left">ID</th>
            <th scope="col" className="p-2 text-left">Start</th>
            <th scope="col"className="p-2 text-left">End</th>
            <th scope="col" className="p-2 text-left">Status</th>
            <th scope="col" className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayRows.map(r => (
            <tr key={r.id} className="odd:bg-white even:bg-gray-50 border-t">
              <td className="p-2">{r.id}</td>
              <td className="p-2">{fmtDate(pick(r, ["start_date","startDate","start"]))}</td>
              <td className="p-2">{fmtDate(pick(r, ["end_date","endDate","end"]))}</td>
              <td className="p-2"><StatusBadge status={r.status} /></td>
              <td className="p-2">
                {["pending","approved"].includes(String(r.status ?? "pending").toLowerCase()) && (
  <button
    className="px-2 py-1 rounded bg-gray-200 text-[var(--bt-ink)] hover:bg-gray-300"
    onClick={() => cancel(r.id, r.employee_id)}
    aria-label={`Cancel request ${r.id}`}
  >
    ⏹ Cancel
  </button>
)}

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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import { toIsoDateOut } from "../date";

export default function RequestForm() {
  const nav = useNavigate();
  const [employeeId, setEmployeeId] = useState<number | "">("");
  const [start, setStart] = useState(""); const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { getEmployeeId } = useAuth();
  
  const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErr(null); setLoading(true);
  try {
    const me = getEmployeeId();
    if (me == null) throw new Error("Your employee id was not found. Please log out and in again.");
    const payload = {
      employee_id: Number(me),
      start_date: toIsoDateOut(start),
      end_date: toIsoDateOut(end),
      ...(reason ? { reason } : {}),
    };
    await api.createLeave(payload);
    nav("/requests");
  } catch (e: any) {
    setErr(e.message || "Failed to submit");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-4">New leave request</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <span className="block mb-1">Employee ID</span>
          <input className="w-full border rounded p-2" inputMode="numeric"
            value={employeeId} onChange={e => setEmployeeId(e.target.value ? Number(e.target.value) : "")}/>
        </label>
        <label className="block">
          <span className="block mb-1">Start date</span>
          <input type="date" className="w-full border rounded p-2" value={start} onChange={e=>setStart(e.target.value)} required/>
        </label>
        <label className="block">
          <span className="block mb-1">End date</span>
          <input type="date" className="w-full border rounded p-2" value={end} onChange={e=>setEnd(e.target.value)} required/>
        </label>
        <label className="block">
          <span className="block mb-1">Reason (optional)</span>
          <textarea className="w-full border rounded p-2" value={reason} onChange={e=>setReason(e.target.value)} />
        </label>
        {err && <div className="p-2 bg-red-100 border border-red-300 rounded">{err}</div>}
        <button disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white">
          {loading ? "Submitting…" : "Submit"}
        </button>
      </form>
    </div>
  );
}

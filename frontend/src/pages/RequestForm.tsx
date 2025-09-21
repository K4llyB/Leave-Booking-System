// src/pages/RequestForm.tsx
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { toIsoDateOut } from "../date";
import { useAuth } from "../auth";
import { useToast } from "../components/ToastProvider";

type FieldErrors = Partial<Record<"start" | "end" | "reason", string>>;

export default function RequestForm() {
  const nav = useNavigate();
  const { getEmployeeId } = useAuth();

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // a11y-friendly errors
  const [fieldErrs, setFieldErrs] = useState<FieldErrors>({});
  const [summaryErr, setSummaryErr] = useState<string>("");
  const summaryRef = useRef<HTMLDivElement | null>(null);

  function validate(s: string, e: string, r: string) {
    const errs: FieldErrors = {};
    if (!s) errs.start = "Start date is required.";
    if (!e) errs.end = "End date is required.";
    if (s && e && e < s) errs.end = "End date must be on or after the start date.";
    if (r && r.length > 300) errs.reason = "Reason must be 300 characters or fewer.";

    const messages = Object.values(errs).filter(Boolean) as string[];
    return { ok: messages.length === 0, errs, summary: messages.join(" ") };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSummaryErr("");
    setFieldErrs({});

    const check = validate(start, end, reason);
    if (!check.ok) {
      setFieldErrs(check.errs);
      setSummaryErr(check.summary);
      // move keyboard focus to the error region
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setLoading(true);
    try {
      const me = getEmployeeId();
      if (me == null) throw new Error("Your employee id was not found. Please log in again.");
      await api.createLeave({
        employee_id: Number(me),
        start_date: toIsoDateOut(start),
        end_date: toIsoDateOut(end),
        ...(reason ? { reason } : {}),
      });
      toast.success("Request submitted 👌");
      nav("/requests");
    } catch (err: any) {
      setSummaryErr(err?.message || "Failed to submit.");
      requestAnimationFrame(() => summaryRef.current?.focus());
    } finally {
      setLoading(false);
    }
  }

  // clear individual field errors as user edits
  function clearErr(key: keyof FieldErrors) {
    if (fieldErrs[key]) setFieldErrs((p) => ({ ...p, [key]: undefined }));
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">New request</h1>

      {summaryErr && (
        <div
          ref={summaryRef}
          role="alert"
          tabIndex={-1}
          className="mb-4 p-3 rounded border bg-red-50 text-red-800"
        >
          {summaryErr}
        </div>
      )}

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <form noValidate onSubmit={onSubmit} className="space-y-4">
          {/* Start date */}
          <label className="block">
            <span className="block mb-1">Start date</span>
            <input
              type="date"
              required
              min={todayISO}
              value={start}
              onChange={(ev) => { setStart(ev.target.value); clearErr("start"); }}
              aria-invalid={!!fieldErrs.start}
              aria-describedby={fieldErrs.start ? "err-start" : undefined}
              className="w-full border rounded p-2 bg-white text-[var(--bt-ink)]"
            />
            {fieldErrs.start && (
              <p id="err-start" className="mt-1 text-sm text-red-700">{fieldErrs.start}</p>
            )}
          </label>

          {/* End date */}
          <label className="block">
            <span className="block mb-1">End date</span>
            <input
              type="date"
              required
              min={start || todayISO}
              value={end}
              onChange={(ev) => { setEnd(ev.target.value); clearErr("end"); }}
              aria-invalid={!!fieldErrs.end}
              aria-describedby={fieldErrs.end ? "err-end" : undefined}
              className="w-full border rounded p-2 bg-white text-[var(--bt-ink)]"
            />
            {fieldErrs.end && (
              <p id="err-end" className="mt-1 text-sm text-red-700">{fieldErrs.end}</p>
            )}
          </label>

          {/* Optional reason */}
          <label className="block">
            <span className="block mb-1">Reason <span className="text-gray-500">(optional)</span></span>
            <textarea
              value={reason}
              onChange={(ev) => { setReason(ev.target.value); clearErr("reason"); }}
              maxLength={300}
              rows={3}
              aria-invalid={!!fieldErrs.reason}
              aria-describedby={fieldErrs.reason ? "err-reason" : undefined}
              className="w-full border rounded p-2 bg-white text-[var(--bt-ink)]"
              placeholder="Add a note for your manager (max 300 chars)…"
            />
            {fieldErrs.reason && (
              <p id="err-reason" className="mt-1 text-sm text-red-700">{fieldErrs.reason}</p>
            )}
          </label>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-[var(--bt-blue)] text-white hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Submitting…" : "Submit request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

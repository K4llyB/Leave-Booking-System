export default function StatusBadge({ status }: { status?: string }) {
  const s = String(status ?? "pending").toLowerCase();
  const icon =
    s === "approved" ? "✔︎" :
    s === "rejected" ? "✖︎" :
    s === "cancelled" ? "⏹" :
    "⏳";
  const styles: Record<string, string> = {
    approved:  "bg-green-100 text-green-900 border-green-400 border-solid",
    rejected:  "bg-red-100 text-red-900 border-red-400 border-dotted",
    cancelled: "bg-yellow-100 text-yellow-900 border-yellow-400 border-dashed",
    pending:   "bg-gray-100 text-gray-900 border-gray-400 border-double",
  };
  const cls = styles[s] ?? styles.pending;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-medium capitalize ${cls}`}
      role="status"
      aria-label={`Status: ${s}`}
      title={s}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{s}</span>
    </span>
  );
}

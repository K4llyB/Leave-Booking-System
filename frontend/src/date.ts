export function pick<T = any>(obj: any, keys: string[]): T | undefined {
  for (const k of keys) if (obj && obj[k] != null) return obj[k] as T;
  return undefined;
}

export function toDate(value: any): Date | null {
  if (value == null) return null;
  if (typeof value === "number") {
    const ms = value > 1e12 ? value : value * 1000; // seconds or ms
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "string") {
    let s = value.trim();
    if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(s)) s = s.replace(" ", "T"); // "YYYY-MM-DD HH:mm:ss"
    const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/); // "DD/MM/YYYY"
    if (m) s = `${m[3]}-${m[2]}-${m[1]}T00:00:00`;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export function fmtDate(value: any): string {
  const d = toDate(value);
  return d ? d.toLocaleDateString() : "—";
}

// Normalize what we SEND to API (safe for MySQL/Node)
export function toIsoDateOut(raw: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw; // already from <input type="date">
  const d = toDate(raw);
  return d ? d.toISOString().slice(0, 10) : raw;
}

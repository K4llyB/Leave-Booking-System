import React, { createContext, useContext, useMemo, useState } from "react";

type Kind = "success" | "error" | "info";
type Toast = { id: number; kind: Kind; msg: string; timeout?: number };

type Ctx = {
  show: (msg: string, kind?: Kind, ms?: number) => void;
  success: (msg: string, ms?: number) => void;
  error: (msg: string, ms?: number) => void;
  info: (msg: string, ms?: number) => void;
};

const ToastCtx = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function push(msg: string, kind: Kind = "info", ms = 3500) {
    const id = Date.now() + Math.random();
    const t: Toast = { id, kind, msg, timeout: ms };
    setToasts((prev) => [...prev, t]);
    if (ms > 0) setTimeout(() => dismiss(id), ms);
  }

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  const value = useMemo<Ctx>(() => ({
    show: push,
    success: (m, ms) => push(m, "success", ms),
    error:   (m, ms) => push(m, "error", ms),
    info:    (m, ms) => push(m, "info", ms),
  }), []);

  return (
    <ToastCtx.Provider value={value}>
      {children}

      {/* Toast container (top-right) */}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-[min(92vw,22rem)]">
        {toasts.map((t) => {
          const base = "rounded-lg border p-3 shadow bg-white flex items-start gap-2";
          const styles =
            t.kind === "success" ? "border-green-300 text-green-800 bg-green-50"
          : t.kind === "error"   ? "border-red-300 text-red-800 bg-red-50"
          :                        "border-blue-300 text-blue-800 bg-blue-50";
          const role = t.kind === "error" ? "alert" : "status";
          return (
            <div key={t.id} role={role} aria-live="polite" className={`${base} ${styles}`}>
              <div className="mt-0.5">
                {t.kind === "success" ? "✅" : t.kind === "error" ? "⚠️" : "ℹ️"}
              </div>
              <div className="flex-1">{t.msg}</div>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="ml-2 px-2 py-1 rounded hover:bg-white/60"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

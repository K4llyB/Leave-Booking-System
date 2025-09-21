import { useAuth } from "../auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { FormEvent } from "react";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      await login(email, password);
      sessionStorage.setItem("flash", "signed-in");  
      nav("/requests");
    } catch (e: any) {
      setErr(e.message || "Login failed");
    } finally { setLoading(false); }
  };

   return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Log in</h1>
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-3" aria-describedby={err ? "login-error" : undefined}>
          <label className="block">
            <span className="block mb-1">Email</span>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
              className="w-full border rounded p-2 bg-white text-[var(--bt-ink)]" />
          </label>
          <label className="block">
            <span className="block mb-1">Password</span>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)}
              className="w-full border rounded p-2 bg-white text-[var(--bt-ink)]" />
          </label>
          {err && <div id="login-error" className="p-2 bg-red-50 border border-red-300 rounded text-red-800">{err}</div>}
          <button disabled={loading}
            className="px-4 py-2 rounded bg-[var(--bt-blue)] text-white hover:opacity-90 focus:opacity-90 disabled:opacity-50">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

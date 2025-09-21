import { Link } from "react-router-dom";
import { useAuth } from "./auth";

export default function NavBar() {
  const { token, user, logout, hasRole } = useAuth();
  const isManager = hasRole(["manager","admin"]);

  const linkCls = "underline underline-offset-4 hover:no-underline focus:no-underline";
  const pillCls  = "text-sm px-2 py-1 rounded-full bg-white/15 border border-white/25";

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3">
      <Link to="/" className="font-semibold text-white hover:opacity-90">Leave Booker</Link>

      {token && user?.email && (
        <span className={pillCls} aria-live="polite">
          Signed in as <span className="font-semibold">{user.email}</span>
          {user.role && <> (<span className="uppercase">{user.role}</span>)</>}
        </span>
      )}

      <div className="flex gap-4">
        {token && <>
          <Link to="/requests" className={`${linkCls} text-white`}>My Requests</Link>
          <Link to="/requests/new" className={`${linkCls} text-white`}>New Request</Link>
          {isManager && <Link to="/manage" className={`${linkCls} text-white`}>Manage</Link>}
          <button
            onClick={logout}
            className="px-3 py-1 rounded bg-white text-[var(--bt-ink)] hover:bg-gray-100 focus:bg-gray-100"
          >
            Log out
          </button>
        </>}
        {!token && (
          <Link to="/login" className="px-3 py-1 rounded bg-white text-[var(--bt-ink)] hover:bg-gray-100 focus:bg-gray-100">
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}

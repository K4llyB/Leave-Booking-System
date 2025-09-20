import { Link } from "react-router-dom";
import { useAuth } from "./auth";

export default function NavBar() {
  const { token, user, logout, hasRole } = useAuth();
  const isManager = hasRole(["manager","admin"]);

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 p-4 border-b">
      <Link to="/" className="font-semibold">Leave Booker</Link>

      {token && user?.email && (
        <span className="text-sm px-2 py-1 rounded-full bg-gray-100 border">
          Signed in as <span className="font-medium">{user.email}</span>
          {user.role && <> (<span className="uppercase">{user.role}</span>)</>}
        </span>
      )}

      <div className="flex gap-3">
        {token && <>
          <Link to="/requests" className="underline">My Requests</Link>
          <Link to="/requests/new" className="underline">New Request</Link>
          {isManager && <Link to="/manage" className="underline">Manage</Link>}
          <button onClick={logout} className="px-3 py-1 rounded bg-gray-200">Log out</button>
        </>}
        {!token && <Link to="/login" className="px-3 py-1 rounded bg-gray-800 text-white">Log in</Link>}
      </div>
    </nav>
  );
}

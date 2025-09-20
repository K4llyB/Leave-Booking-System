import { Link } from "react-router-dom";
import { useAuth } from "./auth";

export default function NavBar() {
  const { token, logout, hasRole } = useAuth();
  const isManager = hasRole(["manager","admin"]);

  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <Link to="/" className="font-semibold">Leave Booker</Link>
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

import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function Layout() {
  return (
    <div className="min-h-dvh bg-[var(--bt-paper)] text-[var(--bt-ink)] flex flex-col">
      {/* Full-bleed branded header */}
      <header
        className="text-white"
        style={{ background: "linear-gradient(90deg, var(--bt-purple), var(--bt-blue))" }}
      >
        <div className="w-full px-6 py-3">
          <NavBar />
        </div>
      </header>

      {/* Content stretches to fill remaining height */}
      <main id="main" className="flex-1 w-full px-6 py-6">
        <Outlet />
      </main>

      <footer className="w-full border-t bg-white">
        <div className="w-full px-6 py-6 text-sm text-gray-600">
          © {new Date().getFullYear()} Leave Booker · BT (coursework)
        </div>
      </footer>
    </div>
  );
}

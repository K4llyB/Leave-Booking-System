import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
export default function Layout() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="p-4 max-w-5xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

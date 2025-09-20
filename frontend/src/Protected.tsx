import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth";

export default function Protected({ roles }: { roles?: Array<"staff" | "manager" | "admin"> }) {
  const { token, hasRole } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (roles && !hasRole(roles)) return <Navigate to="/" replace />;
  return <Outlet />;
}

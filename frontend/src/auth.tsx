import React, { createContext, useContext, useMemo, useState } from "react";
import { api } from "./api";

type Role = "staff" | "manager" | "admin";
type User = { id?: number; employee_id?: number; email?: string; role?: Role };

type AuthCtx = {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: Role | Role[]) => boolean;
  getEmployeeId: () => number | null;
};

const Ctx = createContext<AuthCtx | null>(null);

function decodeJwt(token: string): any {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload));
  } catch {
    return {};
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(sessionStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => (token ? decodeJwt(token) : null));

  const login = async (email: string, password: string) => {
    const { token } = await api.login(email, password);
    sessionStorage.setItem("token", token);
    setToken(token);
    setUser(decodeJwt(token));
  };

  const logout = () => {
    sessionStorage.clear();
    setToken(null);
    setUser(null);
    location.assign("/"); // hard refresh back to home
  };

  const hasRole = (roles: Role | Role[]) => {
    const r = Array.isArray(roles) ? roles : [roles];
    return !!user?.role && r.includes(user.role);
  };

  const getEmployeeId = () => (user?.employee_id as number) ?? (user?.id as number) ?? null;

  const value = useMemo(() => ({ token, user, login, logout, hasRole, getEmployeeId }), [token, user]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
};

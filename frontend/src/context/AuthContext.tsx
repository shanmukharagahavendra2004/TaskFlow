/* ─── src/context/AuthContext.tsx ─────────────────────────────────
   Global auth state.  Wrap <App /> with <AuthProvider>.

   • login / register  – call API, persist token, set user
   • logout            – clear token, null-out user
   • loading           – true while we haven't yet determined auth state
                                                                    */

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { UserOut, RegisterPayload, LoginPayload } from "../types";
import { setToken, clearToken } from "../utils/token";
import * as authService from "../services/authService";

// ── shape ─────────────────────────────────────────
interface AuthContextValue {
  user: UserOut | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── provider ──────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserOut | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const data = await authService.login(payload);
      setToken(data.access_token);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      const data = await authService.register(payload);
      setToken(data.access_token);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── hook ──────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

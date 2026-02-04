import React, { createContext, useContext, useState, useCallback } from "react";
import { setToken, clearToken } from "../utils/token";
import * as authService from "../services/authService";

/* ── context ─────────────────────────────────────────────────────  */
const AuthContext = createContext(undefined);

/* ── provider ────────────────────────────────────────────────────  */
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(false);

  /* ── login ───────────────────────────────────────────────────── */
  const login = useCallback(async (payload) => {
    setLoading(true);
    try {
      const result = await authService.login(payload);
      setToken(result.access_token);
      setUser(result.user);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── register ────────────────────────────────────────────────── */
  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      const result = await authService.register(payload);
      setToken(result.access_token);
      setUser(result.user);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── logout ──────────────────────────────────────────────────── */
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

/* ── hook ────────────────────────────────────────────────────────  */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth() must be called inside <AuthProvider>");
  }
  return ctx;
}

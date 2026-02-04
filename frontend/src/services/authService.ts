/* ─── src/services/authService.ts ────────────────────────────────
   Pure functions – no side effects.  The AuthContext layer decides
   when to call setToken / clearToken.                              */

import api from "./api";
import { RegisterPayload, LoginPayload, TokenResponse, UserOut, ApiResponse } from "../types";

export async function register(payload: RegisterPayload): Promise<TokenResponse> {
  const res = await api.post<ApiResponse<TokenResponse>>("/auth/register", payload);
  return res.data.data!;
}

export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const res = await api.post<ApiResponse<TokenResponse>>("/auth/login", payload);
  return res.data.data!;
}

export async function getMe(): Promise<UserOut> {
  const res = await api.get<ApiResponse<UserOut>>("/auth/me");
  return res.data.data!;
}

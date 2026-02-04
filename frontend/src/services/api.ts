/* ─── src/services/api.ts ────────────────────────────────────────
   Shared Axios instance.

   • Base URL points at /api  (Vite proxy forwards to FastAPI)
   • Request interceptor attaches the JWT when available
   • Response interceptor unwraps the envelope and normalises errors
                                                                    */

import axios, { AxiosInstance, AxiosError } from "axios";
import { getToken } from "../utils/token";
import { ApiResponse } from "../types";

const api: AxiosInstance = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});

// ── request interceptor – attach JWT ──────────────
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── response interceptor – unwrap envelope ────────
api.interceptors.response.use(
  (response) => response,           // let callers inspect the full AxiosResponse
  (error: AxiosError<ApiResponse>) => {
    // surface the backend message if available
    const detail =
      error.response?.data?.message ||
      error.message ||
      "Network error";
    return Promise.reject(new Error(detail));
  }
);

export default api;

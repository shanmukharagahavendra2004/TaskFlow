import axios from "axios";
import { getToken } from "../utils/token";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,                          // pass through on 2xx
  (error) => {
    const message =
      error.response?.data?.message ||             // backend envelope
      error.message ||                             // axios network error
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default api;

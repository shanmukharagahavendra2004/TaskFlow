import api from "./api";

/**
 * Register a brand-new user.
 * @param {{ email: string, password: string, full_name: string }} payload
 * @returns {Promise<{ access_token: string, user: object }>}
 */
export async function register(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data.data; // unwrap envelope  { success, message, data }
}

/**
 * Authenticate with email + password.
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<{ access_token: string, user: object }>}
 */
export async function login(payload) {
  const { data } = await api.post("/auth/login", payload);
  return data.data;
}

/**
 * Fetch the current user's profile (requires valid JWT).
 * @returns {Promise<object>} user object
 */
export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data.data;
}

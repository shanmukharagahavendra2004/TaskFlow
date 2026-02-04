/* ──────────────────────────────────────────────────────────────────
   In-memory token store.
   Production note: swap this for an httpOnly cookie set by the
   backend to protect against XSS.
   ────────────────────────────────────────────────────────────────── */

let _token = null;

export function setToken(token) {
  _token = token;
}

export function getToken() {
  return _token;
}

export function clearToken() {
  _token = null;
}

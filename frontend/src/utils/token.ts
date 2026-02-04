/* ─── src/utils/token.ts ─────────────────────────────────────────
   In-memory token store.  We intentionally avoid localStorage to
   keep the code portable inside sandboxed environments, but for a
   production app you would switch to an httpOnly cookie set by the
   backend.                                                         */

let _token: string | null = null;

export function setToken(token: string): void {
  _token = token;
}

export function getToken(): string | null {
  return _token;
}

export function clearToken(): void {
  _token = null;
}

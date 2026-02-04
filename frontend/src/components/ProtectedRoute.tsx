/* ─── src/components/ProtectedRoute.tsx ──────────────────────────
   Wrap any <Route> that needs a valid session.
   Redirects to /login when there is no user in context.           */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

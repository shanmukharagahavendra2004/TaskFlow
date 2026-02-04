import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar        from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login         from "./pages/Login";
import Register      from "./pages/Register";
import Dashboard     from "./pages/Dashboard";

export default function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <Routes>
        {/* ── public (redirect away if already logged in) ── */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {/* ── protected ──────────────────────────────────── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ── root & catch-all ───────────────────────────── */}
        <Route path="/"  element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        <Route path="*"  element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

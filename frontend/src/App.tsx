/* ─── src/App.tsx ─────────────────────────────────────────────────
   Route tree.  The dashboard is wrapped in ProtectedRoute so
   unauthenticated visitors are redirected to /login.               */

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <Routes>
        {/* public – redirect to dashboard if already logged in */}
        <Route path="/login"    element={user ? <Navigate to="/dashboard" /> : <Login />}    />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

        {/* protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* catch-all */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

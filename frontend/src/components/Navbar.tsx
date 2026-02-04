/* ─── src/components/Navbar.tsx ───────────────────────────────────
   Top navigation strip.  Renders differently when authenticated vs
   unauthenticated.                                                 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        height: 64,
        background: "#0f172a",
        boxShadow: "0 2px 12px rgba(0,0,0,.25)",
      }}
    >
      {/* logo */}
      <span
        onClick={() => navigate("/")}
        style={{
          color: "#fff",
          fontSize: 20,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: "-0.5px",
        }}
      >
        ✓ TaskFlow
      </span>

      {/* right side */}
      {user ? (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* user badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {user.full_name[0]?.toUpperCase()}
            </div>
            <span style={{ color: "#e2e8f0", fontSize: 14, fontFamily: "'Inter', sans-serif" }}>
              {user.full_name}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: user.role === "admin" ? "#fbbf24" : "#60a5fa",
                background: user.role === "admin" ? "rgba(251,191,36,.15)" : "rgba(96,165,250,.15)",
                padding: "2px 8px",
                borderRadius: 20,
              }}
            >
              {user.role}
            </span>
          </div>

          {/* logout */}
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255,255,255,.08)",
              border: "1px solid rgba(255,255,255,.15)",
              color: "#cbd5e1",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 13,
              cursor: "pointer",
              transition: "background .2s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "rgba(255,255,255,.15)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "rgba(255,255,255,.08)")}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,.25)",
              color: "#e2e8f0",
              borderRadius: 8,
              padding: "6px 18px",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              border: "none",
              color: "#fff",
              borderRadius: 8,
              padding: "6px 18px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
}

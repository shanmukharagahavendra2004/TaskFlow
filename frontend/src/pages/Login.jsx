import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

export default function Login() {
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [toast,    setToast]    = useState(null); // { msg, type }

 
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setToast({ msg: "Email and password are required", type: "error" });
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      setToast({ msg: "Welcome back!", type: "success" });
      setTimeout(() => navigate("/dashboard"), 550);
    } catch (err) {
      setToast({ msg: err.message || "Login failed", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [email, password, login, navigate]);

  /* ── render ────────────────────────────────────────────────────  */
  return (
    <div className="
      min-h-[calc(100vh-64px)]
      flex items-center justify-center
      bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950
      px-4 py-12
    ">
      <Toast
        message={toast?.msg ?? null}
        type={toast?.type ?? "error"}
        onClose={() => setToast(null)}
      />

      {/* card */}
      <div className="
        w-full max-w-[400px]
        bg-slate-850 border border-slate-700 rounded-modal
        shadow-modal animate-slide-up
        px-8 py-10
      ">
        {/* ── header ──────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center mb-8">
          {/* icon */}
          <div className="
            w-14 h-14 rounded-2xl
            bg-gradient-to-br from-primary-400 to-primary-600
            flex items-center justify-center
            text-white text-2xl font-bold
            shadow-glow mb-4
          ">
            ✓
          </div>

          <h1 className="text-white text-2xl font-display font-bold">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">
            Sign in to your TaskFlow account
          </p>
        </div>

        {/* ── form ────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* email */}
          <div>
            <label className="label text-slate-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-dark"
            />
          </div>

          {/* password */}
          <div>
            <label className="label text-slate-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-dark"
            />
          </div>

          {/* submit */}
          <button type="submit" disabled={loading} className="btn-primary mt-1">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* ── footer link ─────────────────────────────────── */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

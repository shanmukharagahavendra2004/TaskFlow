import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [fullName,setFullName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword]        = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [loading,setLoading]         = useState(false);
  const [toast,setToast]           = useState(null);

  /* ── client-side validation (mirrors backend rules) ─────────── */
  const validate = () => {
    if (!fullName.trim())
      return "Full name is required";
    if (fullName.trim().length < 2)
      return "Full name must be at least 2 characters";
    if (!/^[A-Za-z\s'\-]+$/.test(fullName.trim()))
      return "Full name contains invalid characters";
    if (!email.trim())
      return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return "Enter a valid email address";
    if (!password)
      return "Password is required";
    if (password.length < 8)
      return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password))
      return "Password needs an uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password needs a lowercase letter";
    if (!/[0-9]/.test(password))
      return "Password needs a digit";
    if (password !== confirmPassword)
      return "Passwords do not match";
    return null;                                   // all good
  };

  /* ── submit ────────────────────────────────────────────────── */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setToast({ msg: err, type: "error" }); return; }

    setLoading(true);
    try {
      await register({
        full_name: fullName.trim(),
        email:     email.trim(),
        password,
      });
      setToast({ msg: "Account created successfully!", type: "success" });
      setTimeout(() => navigate("/dashboard"), 550);
    } catch (error) {
      setToast({ msg: error.message || "Registration failed", type: "error" });
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName, email, password, confirmPassword, register, navigate]);

  /* ── render ────────────────────────────────────────────────── */
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
        w-full max-w-[440px]
        bg-slate-850 border border-slate-700 rounded-modal
        shadow-modal animate-slide-up
        px-8 py-10
      ">
        {/* ── header ────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center mb-8">
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
            Create Account
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">
            Join TaskFlow and stay organised
          </p>
        </div>

        {/* ── form ──────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* full name */}
          <div>
            <label className="label text-slate-400">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
              className="input-dark"
            />
          </div>

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
              placeholder="Min 8 chars · uppercase · lowercase · digit"
              className="input-dark"
            />
          </div>

          {/* confirm password */}
          <div>
            <label className="label text-slate-400">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="input-dark"
            />
          </div>

          {/* submit */}
          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? "Creating…" : "Create Account"}
          </button>
        </form>

        {/* ── footer ────────────────────────────────────── */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

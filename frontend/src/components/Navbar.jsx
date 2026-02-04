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
    <nav className="
      sticky top-0 z-50
      flex items-center justify-between
      px-6 h-16
      bg-slate-900 shadow-md
    ">
     
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 group"
      >
        {/* icon circle */}
        <span className="
          flex items-center justify-center
          w-8 h-8 rounded-lg
          bg-gradient-to-br from-primary-400 to-primary-600
          text-white text-sm font-bold
          group-hover:scale-105 transition-transform duration-200
        ">
          ✓
        </span>
        <span className="
          text-white text-lg
          font-display font-bold tracking-tight
        ">
          TaskFlow
        </span>
      </button>

    
      {user ? (
        <div className="flex items-center gap-3">
          {/* avatar + name */}
          <div className="flex items-center gap-2.5">
            {/* avatar circle */}
            <div className="
              w-8 h-8 rounded-full
              bg-gradient-to-br from-primary-400 to-primary-600
              flex items-center justify-center
              text-white text-xs font-bold
            ">
              {user.full_name[0]?.toUpperCase()}
            </div>

            <span className="text-slate-200 text-sm font-body">
              {user.full_name}
            </span>

            {/* role badge */}
            <span className={`
              badge text-[10px] uppercase tracking-wider
              ${user.role === "admin"
                ? "bg-amber-100  text-amber-700"
                : "bg-primary-100 text-primary-700"}
            `}>
              {user.role}
            </span>
          </div>

          {/* logout */}
          <button
            onClick={handleLogout}
            className="
              px-3 py-1 rounded-lg
              border border-slate-700 bg-slate-800
              text-slate-300 text-xs font-medium
              hover:bg-slate-700 hover:text-white
              transition-colors duration-150
            "
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/login")}
            className="
              px-4 py-1.5 rounded-lg
              border border-slate-600 text-slate-300 text-sm font-medium
              hover:border-slate-500 hover:text-white
              transition-colors duration-150
            "
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="
              px-4 py-1.5 rounded-lg
              bg-gradient-to-r from-primary-500 to-primary-600
              text-white text-sm font-semibold
              hover:from-primary-600 hover:to-primary-700
              transition-all duration-150
            "
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
}

import React, { useEffect } from "react";


export default function Toast({ message, type = "error", onClose }) {
  
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

 
  const styles = {
    success: {
      wrap:  "bg-emerald-50  border-emerald-200",
      icon:  "text-emerald-600",
      text:  "text-emerald-800",
      close: "text-emerald-500 hover:text-emerald-700",
    },
    error: {
      wrap:  "bg-red-50     border-red-200",
      icon:  "text-red-600",
      text:  "text-red-800",
      close: "text-red-500   hover:text-red-700",
    },
  };

  const s = styles[type];

  return (
    <div className="fixed top-5 right-5 z-[1000] w-full max-w-sm animate-toast-in">
      <div
        className={`
          flex items-start gap-3
          px-4 py-3
          rounded-xl border shadow-lg
          ${s.wrap}
        `}
      >
        {/* icon */}
        <span className={`mt-0.5 text-lg leading-none ${s.icon}`}>
          {type === "success" ? "✔" : "✕"}
        </span>

        {/* message */}
        <p className={`flex-1 text-sm font-medium leading-snug ${s.text}`}>
          {message}
        </p>

        {/* close button */}
        <button
          onClick={onClose}
          className={`text-lg leading-none transition-colors ${s.close}`}
        >
          ×
        </button>
      </div>
    </div>
  );
}

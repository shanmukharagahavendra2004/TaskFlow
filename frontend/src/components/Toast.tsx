/* ─── src/components/Toast.tsx ────────────────────────────────────
   Simple toast banner.  Controlled by the parent:

       <Toast message={msg} type="success" onClose={() => setMsg(null)} />

   Disappears automatically after 4 seconds.                       */

import React, { useEffect } from "react";

type ToastType = "success" | "error";

interface Props {
  message: string | null;
  type: ToastType;
  onClose: () => void;
}

const COLOURS: Record<ToastType, { bg: string; border: string; text: string }> = {
  success: { bg: "#d1fae5", border: "#10b981", text: "#065f46" },
  error:   { bg: "#fee2e2", border: "#ef4444", text: "#991b1b" },
};

export default function Toast({ message, type, onClose }: Props) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const c = COLOURS[type];

  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 1000,
        maxWidth: 380,
        padding: "14px 20px",
        borderRadius: 10,
        border: `1px solid ${c.border}`,
        background: c.bg,
        color: c.text,
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
        fontWeight: 500,
        boxShadow: "0 4px 14px rgba(0,0,0,.12)",
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        animation: "slideIn .25s ease",
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>{type === "success" ? "✔" : "✕"}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: c.text,
          cursor: "pointer",
          fontSize: 16,
          lineHeight: 1,
          padding: 0,
        }}
      >
        ×
      </button>
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:translateX(0); } }`}</style>
    </div>
  );
}

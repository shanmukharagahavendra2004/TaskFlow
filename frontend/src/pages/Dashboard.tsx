/* ─── src/pages/Dashboard.tsx ─────────────────────────────────────
   Main authenticated view.
     • Summary cards (total / todo / done)
     • Full task table with status & priority badges
     • "Add Task" / "Edit" modal
     • Delete confirmation
     • Toast for every mutation                                     */

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
import * as taskService from "../services/taskService";
import { TaskOut, TaskCreatePayload, TaskUpdatePayload, TaskPriority, TaskStatus } from "../types";

// ── colour maps ───────────────────────────────────
const STATUS_COLOURS: Record<TaskStatus, { bg: string; color: string }> = {
  todo:        { bg: "#dbeafe", color: "#1e40af" },
  in_progress: { bg: "#fef3c7", color: "#92400e" },
  done:        { bg: "#d1fae5", color: "#065f46" },
};
const PRIORITY_COLOURS: Record<TaskPriority, { bg: string; color: string }> = {
  low:    { bg: "#e0e7ff", color: "#3730a3" },
  medium: { bg: "#fef9c3", color: "#713f12" },
  high:   { bg: "#fee2e2", color: "#991b1b" },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskOut[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // ── modal state ─────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskOut | null>(null);
  const [form, setForm] = useState<TaskCreatePayload>({
    title: "", description: "", priority: "medium", status: "todo"
  });

  // ── delete confirmation ─────────────────────────
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ── fetch ───────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    try {
      const data = await taskService.listTasks(page, PAGE_SIZE);
      setTasks(data.tasks);
      setTotal(data.total);
    } catch (err) {
      setToast({ msg: (err as Error).message || "Failed to load tasks", type: "error" });
    }
  }, [page]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ── open modal ──────────────────────────────────
  const openCreate = () => {
    setEditingTask(null);
    setForm({ title: "", description: "", priority: "medium", status: "todo" });
    setModalOpen(true);
  };

  const openEdit = (task: TaskOut) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description ?? "",
      priority: task.priority,
      status: task.status,
    });
    setModalOpen(true);
  };

  // ── submit ──────────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim()) { setToast({ msg: "Title is required", type: "error" }); return; }
    try {
      if (editingTask) {
        const payload: TaskUpdatePayload = { ...form };
        await taskService.updateTask(editingTask.id, payload);
        setToast({ msg: "Task updated", type: "success" });
      } else {
        await taskService.createTask(form);
        setToast({ msg: "Task created", type: "success" });
      }
      setModalOpen(false);
      await fetchTasks();
    } catch (err) {
      setToast({ msg: (err as Error).message || "Save failed", type: "error" });
    }
  };

  // ── delete ──────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await taskService.deleteTask(deleteId);
      setToast({ msg: "Task deleted", type: "success" });
      setDeleteId(null);
      await fetchTasks();
    } catch (err) {
      setToast({ msg: (err as Error).message || "Delete failed", type: "error" });
      setDeleteId(null);
    }
  };

  // ── derived counts ──────────────────────────────
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  // ── pagination ──────────────────────────────────
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  // ═══════════════════ RENDER ════════════════════
  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "28px 32px", fontFamily: "'Inter', sans-serif" }}>
      <Toast message={toast?.msg ?? null} type={toast?.type ?? "error"} onClose={() => setToast(null)} />

      {/* ── header ──────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, color: "#0f172a", fontSize: 22, fontFamily: "'Outfit', sans-serif" }}>
            My Tasks
          </h1>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>
            Welcome, <strong>{user?.full_name}</strong>
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            border: "none",
            color: "#fff",
            borderRadius: 10,
            padding: "10px 22px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(99,102,241,.4)",
          }}
        >
          + Add Task
        </button>
      </div>

      {/* ── summary cards ──────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total", value: total, accent: "#6366f1" },
          { label: "To Do", value: todoCount, accent: "#f59e0b" },
          { label: "Done", value: doneCount, accent: "#10b981" },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "18px 22px",
              border: "1px solid #e2e8f0",
              borderLeft: `4px solid ${card.accent}`,
            }}
          >
            <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>{card.label}</p>
            <p style={{ margin: "4px 0 0", color: "#0f172a", fontSize: 28, fontWeight: 700 }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* ── task table ─────────────────────────── */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Title", "Priority", "Status", "Created", "Actions"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "12px 18px",
                    color: "#64748b",
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
                  No tasks yet. Click <strong>+ Add Task</strong> to get started.
                </td>
              </tr>
            )}
            {tasks.map((task) => {
              const sc = STATUS_COLOURS[task.status];
              const pc = PRIORITY_COLOURS[task.priority];
              return (
                <tr key={task.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "14px 18px", color: "#1e293b", fontWeight: 500, fontSize: 14 }}>
                    {task.title}
                    {task.description && (
                      <p style={{ margin: "3px 0 0", color: "#94a3b8", fontSize: 12, fontWeight: 400 }}>
                        {task.description}
                      </p>
                    )}
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <span style={{ background: pc.bg, color: pc.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {task.priority}
                    </span>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <span style={{ background: sc.bg, color: sc.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {task.status.replace("_", " ")}
                    </span>
                  </td>
                  <td style={{ padding: "14px 18px", color: "#64748b", fontSize: 13 }}>
                    {new Date(task.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "14px 18px", display: "flex", gap: 8 }}>
                    <button onClick={() => openEdit(task)} style={btnSmall("#6366f1")}>Edit</button>
                    <button onClick={() => setDeleteId(task.id)} style={btnSmall("#ef4444")}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "16px 0" }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: 36, height: 36, borderRadius: 8, border: "none",
                  background: p === page ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#f1f5f9",
                  color: p === page ? "#fff" : "#475569",
                  fontWeight: 600, fontSize: 14, cursor: "pointer",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ═══ CREATE / EDIT MODAL ═══════════════════ */}
      {modalOpen && (
        <div style={overlayStyle} onClick={() => setModalOpen(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: "0 0 20px", color: "#0f172a", fontFamily: "'Outfit', sans-serif" }}>
              {editingTask ? "Edit Task" : "New Task"}
            </h2>

            <label style={labelS}>Title</label>
            <input
              style={inputS}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="What needs to be done?"
            />

            <label style={{ ...labelS, marginTop: 16 }}>Description</label>
            <textarea
              style={{ ...inputS, minHeight: 72, resize: "vertical" }}
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional details…"
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
              <div>
                <label style={labelS}>Priority</label>
                <select style={inputS} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label style={labelS}>Status</label>
                <select style={inputS} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
              <button onClick={() => setModalOpen(false)} style={btnOutline}>Cancel</button>
              <button onClick={handleSave} style={btnPrimary}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DELETE CONFIRMATION ════════════════════ */}
      {deleteId && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, maxWidth: 380 }}>
            <h2 style={{ margin: "0 0 8px", color: "#0f172a", fontFamily: "'Outfit', sans-serif" }}>Delete Task</h2>
            <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 24px" }}>
              This action cannot be undone. Are you sure?
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={btnOutline}>Cancel</button>
              <button onClick={confirmDelete} style={{ ...btnPrimary, background: "#ef4444" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── micro style helpers ─────────────────────────────────────────
function btnSmall(bg: string): React.CSSProperties {
  return {
    background: bg,
    border: "none",
    color: "#fff",
    borderRadius: 6,
    padding: "5px 12px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  };
}

const overlayStyle: React.CSSProperties = {
  position: "fixed", inset: 0, zIndex: 500,
  background: "rgba(0,0,0,.45)",
  display: "flex", alignItems: "center", justifyContent: "center",
};

const modalStyle: React.CSSProperties = {
  background: "#fff", borderRadius: 16, padding: "32px 28px",
  width: "90%", maxWidth: 480,
  boxShadow: "0 24px 60px rgba(0,0,0,.3)",
};

const labelS: React.CSSProperties = {
  display: "block", color: "#64748b", fontSize: 13, fontWeight: 500, marginBottom: 6,
};

const inputS: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "10px 14px", borderRadius: 8,
  border: "1px solid #cbd5e1", fontSize: 14,
  fontFamily: "'Inter', sans-serif", outline: "none",
};

const btnOutline: React.CSSProperties = {
  padding: "9px 20px", borderRadius: 8,
  border: "1px solid #cbd5e1", background: "#fff",
  color: "#475569", fontSize: 14, fontWeight: 500, cursor: "pointer",
};

const btnPrimary: React.CSSProperties = {
  padding: "9px 24px", borderRadius: 8,
  border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
  color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
};

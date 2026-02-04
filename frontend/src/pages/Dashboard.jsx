import React, { useState, useEffect, useCallback } from "react";
import { useAuth }    from "../context/AuthContext";
import Toast          from "../components/Toast";
import * as taskSvc   from "../services/taskService";
import {
  PRIORITY_OPTIONS, STATUS_OPTIONS,
  PRIORITY_BADGE,   STATUS_BADGE,   STATUS_LABEL,
} from "../types";

const PAGE_SIZE = 8;

/* ════════════════════════════════════════════════════════════════════
   DASHBOARD
   ════════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const { user } = useAuth();

  /* ── state ───────────────────────────────────────────────────── */
  const [tasks,   setTasks]   = useState([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [toast,   setToast]   = useState(null);          // { msg, type }

  /* modal: null = closed | "create" | "edit" */
  const [modalMode,  setModalMode]  = useState(null);
  const [editTarget, setEditTarget] = useState(null);    // task object when editing
  const [form,       setForm]       = useState(emptyForm());

  /* delete confirmation */
  const [deleteId, setDeleteId] = useState(null);

  /* ── fetch ───────────────────────────────────────────────────── */
  const fetchTasks = useCallback(async () => {
    try {
      const data = await taskSvc.listTasks(page, PAGE_SIZE);
      setTasks(data.tasks);
      setTotal(data.total);
    } catch (err) {
      setToast({ msg: err.message || "Failed to load tasks", type: "error" });
    }
  }, [page]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  /* ── modal helpers ───────────────────────────────────────────── */
  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setModalMode("create");
  };

  const openEdit = (task) => {
    setEditTarget(task);
    setForm({
      title:       task.title,
      description: task.description ?? "",
      priority:    task.priority,
      status:      task.status,
    });
    setModalMode("edit");
  };

  const closeModal = () => { setModalMode(null); setEditTarget(null); };

  /* ── save ────────────────────────────────────────────────────── */
  const handleSave = async () => {
    if (!form.title.trim()) {
      setToast({ msg: "Title is required", type: "error" });
      return;
    }

    try {
      if (modalMode === "edit") {
        await taskSvc.updateTask(editTarget.id, form);
        setToast({ msg: "Task updated", type: "success" });
      } else {
        await taskSvc.createTask(form);
        setToast({ msg: "Task created", type: "success" });
      }
      closeModal();
      await fetchTasks();
    } catch (err) {
      setToast({ msg: err.message || "Save failed", type: "error" });
    }
  };

  /* ── delete ──────────────────────────────────────────────────── */
  const confirmDelete = async () => {
    try {
      await taskSvc.deleteTask(deleteId);
      setToast({ msg: "Task deleted", type: "success" });
      setDeleteId(null);
      await fetchTasks();
    } catch (err) {
      setToast({ msg: err.message || "Delete failed", type: "error" });
      setDeleteId(null);
    }
  };

  /* ── derived ─────────────────────────────────────────────────── */
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  /* ════════════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════════════ */
  return (
    <div className="max-w-6xl mx-auto px-5 py-7 font-body">
      <Toast
        message={toast?.msg ?? null}
        type={toast?.type ?? "error"}
        onClose={() => setToast(null)}
      />

      {/* ── page header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-slate-900 text-[22px] font-display font-bold">
            My Tasks
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Welcome back, <span className="font-semibold text-slate-700">{user?.full_name}</span>
          </p>
        </div>

        <button
          onClick={openCreate}
          className="
            flex items-center gap-1.5
            px-4 py-2 rounded-lg
            bg-gradient-to-r from-primary-500 to-primary-600
            text-white text-sm font-semibold
            shadow-glow
            hover:from-primary-600 hover:to-primary-700
            active:scale-[.96] transition-all duration-150
          "
        >
          <span className="text-base leading-none">+</span> Add Task
        </button>
      </div>

      {/* ── summary cards ──────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Tasks",  value: total,     accent: "border-primary-500", icon: "📋" },
          { label: "To Do",        value: todoCount, accent: "border-amber-400",   icon: "📌" },
          { label: "Completed",    value: doneCount, accent: "border-emerald-500", icon: "✓"  },
        ].map((card) => (
          <div
            key={card.label}
            className={`card border-l-4 ${card.accent} px-5 py-4`}
          >
            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
                {card.label}
              </p>
              <span className="text-lg">{card.icon}</span>
            </div>
            <p className="text-slate-900 text-3xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* ── task table ──────────────────────────────────────── */}
      <div className="card overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {["Title", "Priority", "Status", "Created", "Actions"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-slate-500 text-[11px] font-semibold uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* empty state */}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-14 text-slate-400 text-sm">
                  No tasks yet — click <span className="font-semibold text-primary-500">+ Add Task</span> to get started.
                </td>
              </tr>
            )}

            {/* rows */}
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                {/* title + optional description */}
                <td className="px-5 py-3.5">
                  <p className="text-slate-800 text-sm font-medium">{task.title}</p>
                  {task.description && (
                    <p className="text-slate-400 text-xs mt-0.5 truncate max-w-[220px]">
                      {task.description}
                    </p>
                  )}
                </td>

                {/* priority badge */}
                <td className="px-5 py-3.5">
                  <span className={`badge ${PRIORITY_BADGE[task.priority]}`}>
                    {task.priority}
                  </span>
                </td>

                {/* status badge */}
                <td className="px-5 py-3.5">
                  <span className={`badge ${STATUS_BADGE[task.status]}`}>
                    {STATUS_LABEL[task.status]}
                  </span>
                </td>

                {/* created date */}
                <td className="px-5 py-3.5 text-slate-400 text-xs">
                  {new Date(task.created_at).toLocaleDateString()}
                </td>

                {/* actions */}
                <td className="px-5 py-3.5 flex items-center gap-2">
                  <button onClick={() => openEdit(task)}     className="btn-sm-primary">Edit</button>
                  <button onClick={() => setDeleteId(task.id)} className="btn-sm-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── pagination ──────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-slate-100">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`
                  w-8 h-8 rounded-lg text-sm font-semibold transition-colors duration-150
                  ${p === page
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"}
                `}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ═══ CREATE / EDIT MODAL ═══════════════════════════════ */}
      {modalMode && (
        <Overlay onClose={closeModal}>
          <div className="
            bg-white rounded-modal shadow-modal
            w-full max-w-[480px]
            px-7 py-7
            animate-slide-up
          ">
            <h2 className="text-slate-900 text-lg font-display font-bold mb-5">
              {modalMode === "edit" ? "Edit Task" : "New Task"}
            </h2>

            {/* title */}
            <div>
              <label className="label">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="What needs to be done?"
                className="input-base"
              />
            </div>

            {/* description */}
            <div className="mt-4">
              <label className="label">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional details…"
                rows={3}
                className="input-base resize-none"
              />
            </div>

            {/* priority + status side by side */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="label">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="input-base appearance-none cursor-pointer"
                >
                  {PRIORITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="input-base appearance-none cursor-pointer"
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* footer buttons */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={closeModal} className="btn-outline">Cancel</button>
              <button
                onClick={handleSave}
                className="
                  px-6 py-2 rounded-lg
                  bg-gradient-to-r from-primary-500 to-primary-600
                  text-white text-sm font-semibold
                  hover:from-primary-600 hover:to-primary-700
                  active:scale-[.96] transition-all duration-150
                "
              >
                {modalMode === "edit" ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </div>
        </Overlay>
      )}

      {/* ═══ DELETE CONFIRMATION ════════════════════════════════ */}
      {deleteId && (
        <Overlay onClose={() => setDeleteId(null)}>
          <div className="
            bg-white rounded-modal shadow-modal
            w-full max-w-[380px]
            px-7 py-7
            animate-slide-up
          ">
            <h2 className="text-slate-900 text-lg font-display font-bold">
              Delete Task
            </h2>
            <p className="text-slate-500 text-sm mt-2 mb-6">
              This action cannot be undone.  Are you sure you want to delete this task?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-outline">Cancel</button>
              <button
                onClick={confirmDelete}
                className="
                  px-5 py-2 rounded-lg
                  bg-red-500 text-white text-sm font-semibold
                  hover:bg-red-600 active:scale-[.96]
                  transition-colors duration-150
                "
              >
                Delete
              </button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}

/* ── tiny helpers ────────────────────────────────────────────────── */
function emptyForm() {
  return { title: "", description: "", priority: "medium", status: "todo" };
}

/**
 * Semi-transparent backdrop that closes on click, renders children
 * centred on screen.
 */
function Overlay({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

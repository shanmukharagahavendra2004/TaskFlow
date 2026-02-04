/* ──────────────────────────────────────────────────────────────────
   Shared constants.  Every badge colour and label lives here so
   Dashboard and the task-form modal never duplicate strings.
   ────────────────────────────────────────────────────────────────── */

/**
 * Priority options for the task form <select>.
 * Each entry carries the Tailwind classes its badge needs.
 */
export const PRIORITY_OPTIONS = [
  { value: "low",    label: "Low",    badge: "bg-blue-100   text-blue-700" },
  { value: "medium", label: "Medium", badge: "bg-amber-100  text-amber-700" },
  { value: "high",   label: "High",   badge: "bg-red-100    text-red-700" },
];

/**
 * Status options for the task form <select>.
 */
export const STATUS_OPTIONS = [
  { value: "todo",        label: "To Do",       badge: "bg-slate-100  text-slate-700" },
  { value: "in_progress", label: "In Progress", badge: "bg-amber-100  text-amber-700" },
  { value: "done",        label: "Done",        badge: "bg-emerald-100 text-emerald-700" },
];

/** Quick-lookup: value → badge class string */
export const PRIORITY_BADGE = Object.fromEntries(
  PRIORITY_OPTIONS.map(({ value, badge }) => [value, badge])
);

export const STATUS_BADGE = Object.fromEntries(
  STATUS_OPTIONS.map(({ value, badge }) => [value, badge])
);

/** Quick-lookup: value → human label */
export const STATUS_LABEL = Object.fromEntries(
  STATUS_OPTIONS.map(({ value, label }) => [value, label])
);

/* ─── src/services/taskService.ts ────────────────────────────────
   Every function returns the *unwrapped* payload from the envelope.
                                                                    */

import api from "./api";
import {
  TaskOut,
  TaskCreatePayload,
  TaskUpdatePayload,
  TaskListData,
  ApiResponse,
} from "../types";

export async function createTask(payload: TaskCreatePayload): Promise<TaskOut> {
  const res = await api.post<ApiResponse<TaskOut>>("/tasks/", payload);
  return res.data.data!;
}

export async function listTasks(page = 1, pageSize = 10): Promise<TaskListData> {
  const res = await api.get<ApiResponse<TaskListData>>(
    `/tasks/?page=${page}&page_size=${pageSize}`
  );
  return res.data.data!;
}

export async function getTask(id: string): Promise<TaskOut> {
  const res = await api.get<ApiResponse<TaskOut>>(`/tasks/${id}`);
  return res.data.data!;
}

export async function updateTask(id: string, payload: TaskUpdatePayload): Promise<TaskOut> {
  const res = await api.put<ApiResponse<TaskOut>>(`/tasks/${id}`, payload);
  return res.data.data!;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}

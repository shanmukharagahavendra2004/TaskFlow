import api from "./api";

/**
 * Create a new task.
 * @param {{ title: string, description?: string, priority: string, status: string }} payload
 * @returns {Promise<object>} created task
 */
export async function createTask(payload) {
  const { data } = await api.post("/tasks/", payload);
  return data.data;
}

/**
 * Paginated task list.
 * @param {number} [page=1]
 * @param {number} [pageSize=10]
 * @returns {Promise<{ tasks: object[], total: number, page: number, page_size: number }>}
 */
export async function listTasks(page = 1, pageSize = 10) {
  const { data } = await api.get("/tasks/", {
    params: { page, page_size: pageSize },
  });
  return data.data;
}

/**
 * Fetch a single task by ID.
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function getTask(id) {
  const { data } = await api.get(`/tasks/${id}`);
  return data.data;
}

/**
 * Partial update.  Send only the fields you want to change.
 * @param {string} id
 * @param {object} payload
 * @returns {Promise<object>} updated task
 */
export async function updateTask(id, payload) {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data.data;
}

/**
 * Permanently delete a task.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteTask(id) {
  await api.delete(`/tasks/${id}`);
}

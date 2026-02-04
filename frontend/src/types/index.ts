
export interface UserOut {
  id: string;
  email: string;
  full_name: string;
  role: "user" | "admin";
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: UserOut;
}


export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus  = "todo" | "in_progress" | "done";

export interface TaskOut {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  owner_id: string;
  created_at: string;   // ISO-8601 string from JSON
  updated_at: string;
}

export interface TaskCreatePayload {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface TaskUpdatePayload {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}

export interface TaskListData {
  tasks: TaskOut[];
  total: number;
  page: number;
  page_size: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ loc: string[]; msg: string; type: string }>;
}

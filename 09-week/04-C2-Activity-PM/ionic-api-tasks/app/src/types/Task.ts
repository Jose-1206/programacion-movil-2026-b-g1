export interface Task {
  id: number;
  title: string;
  description: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
}
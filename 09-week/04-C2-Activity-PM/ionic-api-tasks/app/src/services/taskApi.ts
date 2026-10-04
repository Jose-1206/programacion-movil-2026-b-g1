import type { CreateTaskRequest, Task } from '../types/Task';

const API_URL = 'http://localhost:3001/api/tasks';

export const getTasks = async (): Promise<Task[]> => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Unable to load tasks');
  }

  return response.json();
};

export const getTaskById = async (id: string): Promise<Task> => {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error('Unable to load task details');
  }

  return response.json();
};

export const createTask = async (
  task: CreateTaskRequest
): Promise<Task> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || 'Unable to create task'
    );
  }

  return response.json();
};
import { Task } from '../types';
const API_URL: string = `${process.env.NEXT_PUBLIC_API_URL}/tasks`;

const getTasks = async () => {
  const response = await fetch(API_URL, {
    credentials: 'include',
  });

  if (!response.ok) {
    // 401 Unauthorized
    if (response.status === 401) {
      throw new Error('Unauthorized');
    } else {
      throw new Error('Failed to fetch tasks');
    }
  }
  return (await response.json()) as Task[];
};

const createTaskRequest = async (title: string) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: title, completed: false }),
  });
  if (!response.ok) {
    throw new Error('Failed to create task');
  }
  return (await response.json()) as Task;
};

const updateTaskTitle = async (id: string, title: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    throw new Error('Failed to edit task');
  }
  return (await response.json()) as Task;
};

const updateTaskCompleted = async (id: string, completed: boolean) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      completed,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to toggle complete task');
  }
  return (await response.json()) as Task;
};

const deleteTaskRequest = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
  return (await response.json()) as Task;
};

export {
  getTasks,
  createTaskRequest,
  updateTaskTitle,
  updateTaskCompleted,
  deleteTaskRequest,
};

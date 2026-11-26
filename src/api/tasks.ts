import { Task } from '../types';
const API_URL: string = `${process.env.NEXT_PUBLIC_API_URL}/tasks`;

function throwIfNotOk(response: Response, message: string) {
  if (response.ok) return;
  if (response.status === 401) {
    throw new Error('Unauthorized');
  }
  throw new Error(message);
}
const getTasks = async (
  filter: 'active' | 'completed' | 'all' = 'all',
  search?: string,
) => {
  const response = await fetch(
    API_URL +
      `?status=${filter}${search && search.trim() !== '' ? `&search=${encodeURIComponent(search.trim())}` : ''}`,
    {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  throwIfNotOk(response, 'Failed to fetch tasks');
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
  throwIfNotOk(response, 'Failed to create task');

  return (await response.json()) as Task;
};

const createProjectTaskRequest = async (title: string, projectId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: title, completed: false }),
    },
  );
  throwIfNotOk(response, 'Failed to create task');

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
  throwIfNotOk(response, 'Failed to edit task');
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
  throwIfNotOk(response, 'Failed to toggle complete task');
  return (await response.json()) as Task;
};

const deleteTaskRequest = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  throwIfNotOk(response, 'Failed to delete task');
  return (await response.json()) as Task;
};

export {
  getTasks,
  createTaskRequest,
  createProjectTaskRequest,
  updateTaskTitle,
  updateTaskCompleted,
  deleteTaskRequest,
};

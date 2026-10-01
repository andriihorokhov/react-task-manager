import { useState, useEffect } from 'react';
import { Task } from '../types';
import { useFetch } from './useFetch';

const API_URL: string = 'http://localhost:3001/tasks';

export function useTasks() {
  const { data, error, loading } = useFetch<Task[]>(API_URL);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [creatingTask, setCreatingTask] = useState<boolean>(false);
  const [creatingTaskError, setCreatingTaskError] = useState<string | null>(
    null,
  );

  const [editingTask, setEditingTask] = useState<boolean>(false);
  const [editingTaskError, setEditingTaskError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [toggleCompleteLoading, setToggleCompleteTask] =
    useState<boolean>(false);
  const [toggleCompleteTaskError, setToggleCompleteTaskError] = useState<
    string | null
  >(null);
  const [toggleCompleteId, setToggleCompleteId] = useState<string | null>(null);

  const [deletingTask, setDeletingTask] = useState<boolean>(false);
  const [deletingTaskError, setDeletingTaskError] = useState<string | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  const createTask = async (title: string): Promise<boolean> => {
    if (title.trim() === '') return false;
    try {
      setCreatingTask(true);
      setCreatingTaskError(null);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          completed: false,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      const data = (await response.json()) as Task;
      setTasks((prevTasks) => [...prevTasks, data]);
      setCreatingTask(false);
      return true;
    } catch (error) {
      setCreatingTaskError(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
      setCreatingTask(false);
      return false;
    }
  };

  const editTask = async (id: string, title: string): Promise<boolean> => {
    try {
      setEditingTask(true);
      setEditingTaskError(null);
      setEditingId(id);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) {
        throw new Error('Failed to edit task');
      }
      const data = (await response.json()) as Task;
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? data : task)),
      );
      setEditingTask(false);
      setEditingId(null);

      return true;
    } catch (error) {
      setEditingTaskError(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
      setEditingTask(false);
      return false;
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      setToggleCompleteTask(true);
      setToggleCompleteTaskError(null);
      setToggleCompleteId(id);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !tasks.find((task) => task.id === id)?.completed,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to toggle complete task');
      }
      const data = (await response.json()) as Task;
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? data : task)),
      );
      setToggleCompleteTask(false);
      setToggleCompleteId(null);
    } catch (error) {
      setToggleCompleteTaskError(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
      setToggleCompleteTask(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setDeletingTask(true);
      setDeletingTaskError(null);
      setDeletingId(id);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      setDeletingTask(false);
      setDeletingId(null);
    } catch (error) {
      setDeletingTaskError(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
      setDeletingTask(false);
    }
  };
  return {
    tasks,
    loading,
    error,
    creatingTask,
    creatingTaskError,
    createTask,
    editingTask,
    editingTaskError,
    editingId,
    editTask,
    toggleCompleteLoading,
    toggleCompleteTaskError,
    toggleCompleteId,
    toggleComplete,
    deletingTask,
    deletingTaskError,
    deletingId,
    deleteTask,
  };
}

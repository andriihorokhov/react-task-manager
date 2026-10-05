import { useState } from 'react';
import { Task } from '../types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL: string = 'http://localhost:3001/tasks';

export function useTasks() {
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
  const { data, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      return (await response.json()) as Task[];
    },
  });
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (title: string) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title, completed: false }),
      });
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      return (await response.json()) as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
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
      return (await response.json()) as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: string;
      completed: boolean;
    }) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      return (await response.json()) as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const createTask = async (title: string): Promise<boolean> => {
    if (title.trim() === '') return false;

    try {
      setCreatingTask(true);
      setCreatingTaskError(null);
      await createMutation.mutateAsync(title);
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
    if (title.trim() === '') return false;
    try {
      setEditingTask(true);
      setEditingTaskError(null);
      setEditingId(id);
      await editMutation.mutateAsync({ id, title });
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
    const tasks = data ?? [];
    const completed = !tasks.find((task) => task.id === id)?.completed;
    try {
      setToggleCompleteTask(true);
      setToggleCompleteTaskError(null);
      setToggleCompleteId(id);
      await toggleCompleteMutation.mutateAsync({ id, completed });
      setToggleCompleteTask(false);
      setToggleCompleteId(null);
      return true;
    } catch (error) {
      setToggleCompleteTaskError(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
      setToggleCompleteTask(false);
      return false;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setDeletingTask(true);
      setDeletingTaskError(null);
      setDeletingId(id);
      await deleteMutation.mutateAsync(id);
      setDeletingTask(false);
      setDeletingId(null);
      return true;
    } catch (error) {
      setDeletingTaskError(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
      setDeletingTask(false);
      return false;
    }
  };
  return {
    tasks: data ?? [],
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
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

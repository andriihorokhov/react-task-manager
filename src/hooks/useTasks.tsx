import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTasks,
  createTaskRequest,
  updateTaskTitle,
  updateTaskCompleted,
  deleteTaskRequest,
} from '../api/tasks';

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
      return getTasks();
    },
  });
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (title: string) => {
      return createTaskRequest(title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      return updateTaskTitle(id, title);
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
      return updateTaskCompleted(id, completed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteTaskRequest(id);
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

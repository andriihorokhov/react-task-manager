import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjects, getProject } from '../api/projects';
import { createProjectTaskRequest } from '../api/tasks';
import { useState } from 'react';

export function useProjects() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      return getProjects();
    },
  });

  return { data, isLoading, error };
}

export function useProject(id: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      return getProject(id);
    },
  });
  return { data, isLoading, error };
}
export function useCreateProjectTask(id: string) {
  const queryClient = useQueryClient();
  const [creatingTask, setCreatingTask] = useState(false);
  const [creatingTaskError, setCreatingTaskError] = useState<string | null>(
    null,
  );
  const createProjectTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      return createProjectTaskRequest(title, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', id] });
    },
  });

  const createProjectTask = async (title: string): Promise<boolean> => {
    if (title.trim() === '') return false;
    setCreatingTask(true);
    setCreatingTaskError(null);
    try {
      await createProjectTaskMutation.mutateAsync(title);
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

  return { createProjectTask, creatingTask, creatingTaskError };
}

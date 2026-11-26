'use client';
import { useParams } from 'next/navigation';
import { useProject } from '../hooks/useProjects';
import TaskForm from './TaskForm';
import ProjectItem from './ProjectItem';
import { useCreateProjectTask } from '../hooks/useProjects';
export default function ProjectDetail() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, error } = useProject(id);
  const { createProjectTask, creatingTask, creatingTaskError } =
    useCreateProjectTask(id);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || !data) {
    return <div>Error: {error?.message || 'Project not found'}</div>;
  }
  return (
    <>
      <ProjectItem project={data} />
      <TaskForm
        createTask={createProjectTask}
        creatingTask={creatingTask}
        creatingTaskError={creatingTaskError}
      />
    </>
  );
}

'use client';
import { useTasks } from '../hooks/useTasks';
import { useParams } from 'next/navigation';
import TaskItem from './TaskItem';
import { Task } from '../types';
export default function TaskDetail() {
  const params = useParams();
  const id = params.id as string;
  const {
    tasks,
    loading,
    error,
    deleteTask,
    toggleComplete,
    editTask,
    deletingTask,
    deletingTaskError,
    deletingId,
    editingTask,
    editingTaskError,
    editingId,
    toggleCompleteLoading,
    toggleCompleteTaskError,
    toggleCompleteId,
  } = useTasks();
  const task = tasks.find((task) => task.id === id);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div>
      <TaskItem
        task={task as Task}
        deleteTask={deleteTask}
        toggleComplete={toggleComplete}
        editTask={editTask}
        deletingTask={deletingTask}
        deletingTaskError={deletingTaskError}
        deletingId={deletingId}
        editingTask={editingTask}
        editingTaskError={editingTaskError}
        editingId={editingId}
        toggleCompleteLoading={toggleCompleteLoading}
        toggleCompleteTaskError={toggleCompleteTaskError}
        toggleCompleteId={toggleCompleteId}
      />
    </div>
  );
}

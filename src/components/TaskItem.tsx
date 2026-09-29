import type { Task } from '../types';
import TaskItemEdit from './TaskItemEdit';
function TaskItem({
  task,
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
}: {
  task: Task;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  editTask: (id: string, title: string) => Promise<boolean>;
  deletingTask: boolean;
  deletingTaskError: string | null;
  deletingId: string | null;
  editingTask: boolean;
  editingTaskError: string | null;
  editingId: string | null;
  toggleCompleteLoading: boolean;
  toggleCompleteTaskError: string | null;
  toggleCompleteId: string | null;
}) {
  const quietButton =
    'cursor-pointer rounded-md border border-stone-300 bg-white px-2.5 py-1 text-sm text-stone-700 transition-colors duration-150 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50';
  const dangerButton =
    'cursor-pointer rounded-md border border-red-200 bg-white px-2.5 py-1 text-sm text-red-700 transition-colors duration-150 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <li className="flex flex-col gap-2 border-b border-stone-200 py-3 last:border-b-0">
      <TaskItemEdit
        task={task}
        editTask={editTask}
        editingTask={editingTask}
        editingId={editingId}
      />
      <div className="flex flex-wrap gap-2">
        <button
          className={dangerButton}
          onClick={() => deleteTask(task.id)}
          disabled={deletingTask && deletingId === task.id}
        >
          {deletingTask && deletingId === task.id ? 'Deleting...' : 'Delete'}
        </button>
        <button
          className={quietButton}
          onClick={() => toggleComplete(task.id)}
          disabled={toggleCompleteLoading && toggleCompleteId === task.id}
        >
          {toggleCompleteLoading && toggleCompleteId === task.id
            ? 'Loading...'
            : task.completed
              ? 'Incomplete'
              : 'Complete'}
        </button>
      </div>
      {deletingTaskError && deletingId === task.id && (
        <div className="text-sm text-red-700">
          <p>Error: {deletingTaskError}</p>
        </div>
      )}
      {editingTaskError && editingId === task.id && (
        <div className="text-sm text-red-700">
          <p>Error: {editingTaskError}</p>
        </div>
      )}
      {toggleCompleteTaskError && toggleCompleteId === task.id && (
        <div className="text-sm text-red-700">
          <p>Error: {toggleCompleteTaskError}</p>
        </div>
      )}
    </li>
  );
}

export default TaskItem;

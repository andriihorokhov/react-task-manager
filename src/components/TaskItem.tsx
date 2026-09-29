import { useState } from 'react';
import type { Task } from '../types';
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const quietButton =
    'cursor-pointer rounded-md border border-stone-300 bg-white px-2.5 py-1 text-sm text-stone-700 transition-colors duration-150 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50';
  const dangerButton =
    'cursor-pointer rounded-md border border-red-200 bg-white px-2.5 py-1 text-sm text-red-700 transition-colors duration-150 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <li className="flex flex-col gap-2 border-b border-stone-200 py-3 last:border-b-0">
      {isEditing ? (
        <input
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-stone-500"
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
        />
      ) : (
        <span className={task.completed ? 'text-stone-400 line-through' : ''}>
          {task.title}
        </span>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          className={quietButton}
          onClick={() => {
            if (isEditing) {
              setEditedTitle(task.title);
            }
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
        {isEditing && (
          <button
            className="cursor-pointer rounded-md bg-stone-900 px-2.5 py-1 text-sm text-white transition-colors duration-150 hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={async () => {
              if (editedTitle.trim()) {
                const success = await editTask(task.id, editedTitle.trim());
                if (success) {
                  setIsEditing(false);
                }
              } else {
                return;
              }
            }}
            disabled={editingTask && editingId === task.id}
          >
            {editingTask && editingId === task.id ? 'Saving...' : 'Save'}
          </button>
        )}
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

import { useState } from 'react';
import { Task } from '../types';

export default function TaskItemEdit({
  task,
  editTask,
  editingTask,
  editingId,
}: {
  task: Task;
  editTask: (id: string, title: string) => Promise<boolean>;
  editingTask: boolean;
  editingId: string | null;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  return (
    <>
      {isEditMode ? (
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
          className="cursor-pointer rounded-md border border-stone-300 bg-white px-2.5 py-1 text-sm text-stone-700 transition-colors duration-150 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => {
            if (isEditMode) {
              setEditedTitle(task.title);
            }
            setIsEditMode(!isEditMode);
          }}
        >
          {isEditMode ? 'Cancel' : 'Edit'}
        </button>
        {isEditMode && (
          <button
            className="cursor-pointer rounded-md bg-stone-900 px-2.5 py-1 text-sm text-white transition-colors duration-150 hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={async () => {
              if (editedTitle.trim()) {
                const success = await editTask(task.id, editedTitle.trim());
                if (success) {
                  setIsEditMode(false);
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
      </div>
    </>
  );
}

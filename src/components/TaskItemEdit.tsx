import { useState } from 'react';
import { Task } from '../types';
import Button from './Button';
import { motion } from 'framer-motion';

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
        <span
          className={`relative block w-fit ${task.completed ? 'text-stone-400 ' : ''}`}
        >
          {task.title}
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: task.completed ? '100%' : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-1/2 h-0.5 bg-stone-400"
          />
        </span>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="tertiary"
          type="button"
          onClick={() => {
            if (isEditMode) {
              setEditedTitle(task.title);
            }
            setIsEditMode(!isEditMode);
          }}
        >
          {isEditMode ? 'Cancel' : 'Edit'}
        </Button>
        {isEditMode && (
          <Button
            variant="primary"
            type="button"
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
          </Button>
        )}
      </div>
    </>
  );
}

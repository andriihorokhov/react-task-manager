import type { Task } from '../types';
import TaskItemEdit from './TaskItemEdit';
import Button from './Button';
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
  return (
    <li className="flex flex-col gap-2 border-b border-stone-200 py-3 last:border-b-0">
      <TaskItemEdit
        task={task}
        editTask={editTask}
        editingTask={editingTask}
        editingId={editingId}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          children={
            deletingTask && deletingId === task.id ? 'Deleting...' : 'Delete'
          }
          variant="danger"
          type="button"
          onClick={() => deleteTask(task.id)}
          disabled={deletingTask && deletingId === task.id}
        ></Button>

        <Button
          children={
            toggleCompleteLoading && toggleCompleteId === task.id
              ? 'Loading...'
              : task.completed
                ? 'Incomplete'
                : 'Complete'
          }
          variant="tertiary"
          type="button"
          onClick={() => toggleComplete(task.id)}
          disabled={toggleCompleteLoading && toggleCompleteId === task.id}
        ></Button>
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

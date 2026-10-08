import type { Task, TaskStatus } from '../types';
import TaskItem from './TaskItem';
import { AnimatePresence, motion } from 'framer-motion';

function TaskList({
  tasks,
  deleteTask,
  toggleComplete,
  editTask,
  filter,
  loading,
  error,
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
  tasks: Task[];
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  editTask: (id: string, title: string) => Promise<boolean>;
  filter: TaskStatus;
  loading: boolean;
  error: string | null;
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
  if (loading) {
    return (
      <div className="text-sm text-stone-500">
        <p>Loading...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium tracking-wide text-stone-500 uppercase">
        Tasks
      </h2>
      {tasks.length === 0 ? (
        <div className="rounded-xl bg-white px-4 py-6 text-sm text-stone-600 shadow-sm">
          <p>No tasks found. Add a new task to get started.</p>
        </div>
      ) : (
        <motion.ul
          className="rounded-xl bg-white px-4 shadow-sm"
          variants={{
            visible: { transition: { staggerChildren: 0.03 } },
          }}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
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
                hidden={
                  (filter === 'active' && task.completed) ||
                  (filter === 'completed' && !task.completed)
                }
              />
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </section>
  );
}

export default TaskList;

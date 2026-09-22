import type { Task, TaskStatus } from '../types';
import TaskItem from './TaskItem';

function TaskList({
  filteredTasks,
  tasksLength,
  deleteTask,
  toggleComplete,
  editTask,
  filter,
}: {
  filteredTasks: Task[];
  tasksLength: number;
  deleteTask: (id: number) => void;
  toggleComplete: (id: number) => void;
  editTask: (id: number, title: string) => void;
  filter: TaskStatus;
}) {
  return (
    <section>
      <h2>Tasks</h2>
      {tasksLength === 0 ? (
        <p>No tasks found. Add a new task to get started.</p>
      ) : filteredTasks.length === 0 ? (
        <p>No {filter} tasks found. </p>
      ) : (
        <ul>
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              toggleComplete={toggleComplete}
              editTask={editTask}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default TaskList;

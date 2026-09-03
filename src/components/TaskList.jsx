import TaskItem from './TaskItem';
function TaskList({
  filteredTasks,
  tasksLength,
  deleteTask,
  loading,
  error,
  filter,
}) {
  return (
    <section>
      <h2>Tasks</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading &&
        !error &&
        (tasksLength === 0 ? (
          <p>No tasks found. Add a new task to get started.</p>
        ) : filteredTasks.length === 0 ? (
          <p>No {filter} tasks found. </p>
        ) : (
          <ul>
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} deleteTask={deleteTask} />
            ))}
          </ul>
        ))}
    </section>
  );
}

export default TaskList;

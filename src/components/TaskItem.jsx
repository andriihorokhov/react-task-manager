function TaskItem({ task, deleteTask }) {
  return (
    <li>
      {task.title} <button onClick={() => deleteTask(task.id)}>Delete</button>
    </li>
  );
}

export default TaskItem;

function TaskForm({
  handleSubmit,
}: {
  handleSubmit: React.SubmitEventHandler<HTMLFormElement>;
}) {
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Add a new task" />
      <button type="submit">Add</button>
    </form>
  );
}

export default TaskForm;

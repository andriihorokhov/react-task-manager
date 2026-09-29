function TaskForm({
  handleSubmit,
  creatingTask,
  creatingTaskError,
}: {
  handleSubmit: React.SubmitEventHandler<HTMLFormElement>;
  creatingTask: boolean;
  creatingTaskError: string | null;
}) {
  return (
    <>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-stone-500"
          type="text"
          name="title"
          placeholder="Add a new task"
        />
        <button
          className="cursor-pointer rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={creatingTask}
        >
          {creatingTask ? 'Creating...' : 'Add'}
        </button>
      </form>
      {creatingTaskError && (
        <div className="text-sm text-red-700">
          <p>Error: {creatingTaskError}</p>
        </div>
      )}
    </>
  );
}

export default TaskForm;

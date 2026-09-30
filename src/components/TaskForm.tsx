import Button from './Button';
export default function TaskForm({
  handleSubmit,
  creatingTask,
  creatingTaskError,
}: {
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
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
        <Button
          children={creatingTask ? 'Creating...' : 'Add'}
          type="submit"
          disabled={creatingTask}
          variant="primary"
        />
      </form>
      {creatingTaskError && (
        <div className="text-sm text-red-700">
          <p>Error: {creatingTaskError}</p>
        </div>
      )}
    </>
  );
}

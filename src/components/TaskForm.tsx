import Button from './Button';
export default function TaskForm({
  createTask,
  creatingTask,
  creatingTaskError,
}: {
  createTask: (title: string) => Promise<boolean>;
  creatingTask: boolean;
  creatingTaskError: string | null;
}) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get('title');
    if (typeof title !== 'string') return;
    const success = await createTask(title);
    if (success) {
      form.reset();
    }
  };
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

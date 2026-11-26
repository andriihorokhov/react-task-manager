function TaskSearch({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (next: string) => void;
}) {
  return (
    <input
      className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-stone-500"
      type="search"
      value={search}
      placeholder="Search tasks"
      aria-label="Search tasks"
      onChange={(event) => setSearch(event.target.value)}
    />
  );
}

export default TaskSearch;

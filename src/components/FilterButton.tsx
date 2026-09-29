import type { TaskStatus } from '../types';

function FilterButton({
  name,
  isPressed,
  setFilter,
}: {
  name: TaskStatus;
  isPressed: boolean;
  setFilter: (name: TaskStatus) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isPressed}
      className={
        isPressed
          ? 'cursor-pointer rounded-full bg-stone-900 px-3 py-1 text-sm capitalize text-white transition-colors duration-150 hover:bg-stone-700'
          : 'cursor-pointer rounded-full border border-stone-300 bg-white px-3 py-1 text-sm capitalize text-stone-700 transition-colors duration-150 hover:bg-stone-100'
      }
      onClick={() => setFilter(name)}
    >
      {name}
    </button>
  );
}

export default FilterButton;

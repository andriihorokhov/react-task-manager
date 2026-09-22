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
      className="btn toggle-btn"
      onClick={() => setFilter(name)}
    >
      {name}
    </button>
  );
}

export default FilterButton;

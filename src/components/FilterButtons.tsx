import Button from './Button';
import type { TaskStatus } from '../types';

function FilterButtons({
  filters,
  filter,
  setFilter,
}: {
  filters: TaskStatus[];
  filter: TaskStatus;
  setFilter: (filter: TaskStatus) => void;
}) {
  return (
    <div className="flex gap-2">
      {filters.map((name) => (
        <Button
          key={name}
          children={name}
          ariaPressed={filter === name}
          onClick={() => setFilter(name)}
          disabled={false}
          variant="secondary"
          type="button"
        />
      ))}
    </div>
  );
}

export default FilterButtons;

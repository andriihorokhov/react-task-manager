import FilterButton from './FilterButton';
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
    <div className="filters btn-group">
      {filters.map((name) => (
        <FilterButton
          key={name}
          name={name}
          isPressed={filter === name}
          setFilter={setFilter}
        />
      ))}
    </div>
  );
}

export default FilterButtons;

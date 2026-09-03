import FilterButton from './FilterButton';

function FilterButtons({ filters, filter, setFilter }) {
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

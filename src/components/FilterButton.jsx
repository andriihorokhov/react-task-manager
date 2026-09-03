function FilterButton({ name, isPressed, setFilter }) {
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

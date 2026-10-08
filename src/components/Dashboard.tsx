import { useTasks } from '../hooks/useTasks';
import { NavLink } from 'react-router';

export default function Dashboard() {
  const { tasks, loading, error } = useTasks();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <ul>
        <li>
          <NavLink to="/tasks">All ({tasks.length})</NavLink>
        </li>
        <li>
          <NavLink to="/tasks?status=active">
            Active ({tasks.filter((task) => !task.completed).length})
          </NavLink>
        </li>
        <li>
          <NavLink to="/tasks?status=completed">
            Completed ({tasks.filter((task) => task.completed).length})
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

'use client';
import { useTasks } from '../hooks/useTasks';
import Link from 'next/link';

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
          <Link href="/tasks">All ({tasks.length})</Link>
        </li>
        <li>
          <Link href="/tasks?filter=active">
            Active ({tasks.filter((task) => !task.completed).length})
          </Link>
        </li>
        <li>
          <Link href="/tasks?filter=completed">
            Completed ({tasks.filter((task) => task.completed).length})
          </Link>
        </li>
      </ul>
    </div>
  );
}

import { Outlet, NavLink } from 'react-router';
export default function Layout() {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 invert">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-10">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'text-stone-900' : 'text-stone-500'
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            isActive ? 'text-stone-900' : 'text-stone-500'
          }
        >
          Tasks
        </NavLink>
        <Outlet />
      </div>
    </div>
  );
}

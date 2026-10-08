import { Outlet, NavLink, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
export default function Layout() {
  const { pathname } = useLocation();
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
          end
        >
          Tasks
        </NavLink>
        <AnimatePresence mode="wait">
          <motion.div
            className="flex flex-col gap-6"
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

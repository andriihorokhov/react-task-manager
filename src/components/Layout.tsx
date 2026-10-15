'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 invert">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-10">
        <Link
          href="/"
          className={pathname === '/' ? 'text-stone-900' : 'text-stone-500'}
        >
          Home
        </Link>
        <Link
          href="/tasks"
          className={
            pathname === '/tasks' ? 'text-stone-900' : 'text-stone-500'
          }
          prefetch={true}
        >
          Tasks
        </Link>
        <AnimatePresence mode="wait">
          <motion.div
            className="flex flex-col gap-6"
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

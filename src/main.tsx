import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './components/Layout';
import RouteError from './components/RouteError';
import Dashboard from './components/Dashboard';
import TaskDetail from './components/TaskDetail';
import App from './App';
const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    ErrorBoundary: RouteError,
    children: [
      { index: true, Component: Dashboard },
      { path: 'tasks', Component: App },
      { path: 'tasks/:id', Component: TaskDetail },
    ],
  },
]);

const queryClient = new QueryClient();

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);

import './App.css';
import { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import FilterButtons from './components/FilterButtons';
import type { Task, TaskStatus } from './types';
import { useFetch } from './hooks/useFetch';
const API_URL: string = 'http://localhost:3001/tasks';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const { data, error, loading } = useFetch<Task[]>(API_URL);

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);
  const [filter, setFilter] = useState<TaskStatus>('all');

  const [creatingTask, setCreatingTask] = useState<boolean>(false);
  const [creatingTaskError, setCreatingTaskError] = useState<string | null>(
    null,
  );

  async function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get('title');

    if (typeof title !== 'string') return;
    if (title.trim() === '') return;

    try {
      setCreatingTask(true);
      setCreatingTaskError(null);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          completed: false,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      const data = (await response.json()) as Task;
      setTasks((prevTasks) => [...prevTasks, data]);
      setCreatingTask(false);
      form.reset();
    } catch (error) {
      setCreatingTaskError(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
      setCreatingTask(false);
    }
  }

  const [toggleCompleteLoading, setToggleCompleteTask] =
    useState<boolean>(false);
  const [toggleCompleteTaskError, setToggleCompleteTaskError] = useState<
    string | null
  >(null);
  const [toggleCompleteId, setToggleCompleteId] = useState<string | null>(null);
  const toggleComplete = async (id: string) => {
    // patch
    try {
      setToggleCompleteTask(true);
      setToggleCompleteTaskError(null);
      setToggleCompleteId(id);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !tasks.find((task) => task.id === id)?.completed,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to toggle complete task');
      }
      const data = (await response.json()) as Task;
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? data : task)),
      );
      setToggleCompleteTask(false);
      setToggleCompleteId(null);
    } catch (error) {
      setToggleCompleteTaskError(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
      setToggleCompleteTask(false);
    }
  };

  const [deletingTask, setDeletingTask] = useState<boolean>(false);
  const [deletingTaskError, setDeletingTaskError] = useState<string | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deleteTask = async (id: string) => {
    try {
      setDeletingTask(true);
      setDeletingTaskError(null);
      setDeletingId(id);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      setDeletingTask(false);
      setDeletingId(null);
    } catch (error) {
      setDeletingTaskError(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
      setDeletingTask(false);
    }
  };

  const [editingTask, setEditingTask] = useState<boolean>(false);
  const [editingTaskError, setEditingTaskError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editTask = async (id: string, title: string): Promise<boolean> => {
    try {
      setEditingTask(true);
      setEditingTaskError(null);
      setEditingId(id);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) {
        throw new Error('Failed to edit task');
      }
      const data = (await response.json()) as Task;
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? data : task)),
      );
      setEditingTask(false);
      setEditingId(null);

      return true;
    } catch (error) {
      setEditingTaskError(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
      setEditingTask(false);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 invert">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-10">
        <Header />
        <TaskForm
          handleSubmit={handleSubmit}
          creatingTask={creatingTask}
          creatingTaskError={creatingTaskError}
        />
        <FilterButtons
          filters={['all', 'active', 'completed']}
          filter={filter}
          setFilter={setFilter}
        />
        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          deleteTask={deleteTask}
          toggleComplete={toggleComplete}
          editTask={editTask}
          filter={filter}
          deletingTask={deletingTask}
          deletingTaskError={deletingTaskError}
          deletingId={deletingId}
          editingTask={editingTask}
          editingTaskError={editingTaskError}
          editingId={editingId}
          toggleCompleteLoading={toggleCompleteLoading}
          toggleCompleteTaskError={toggleCompleteTaskError}
          toggleCompleteId={toggleCompleteId}
        />
      </div>
    </div>
  );
}

export default App;

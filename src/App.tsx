import './App.css';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import FilterButtons from './components/FilterButtons';
import { useTasks } from './hooks/useTasks';
import { useSearchParams } from 'react-router';
import type { TaskStatus } from './types';
function App() {
  const {
    tasks,
    loading,
    error,
    createTask,
    creatingTask,
    creatingTaskError,
    deleteTask,
    toggleComplete,
    editTask,
    deletingTask,
    deletingTaskError,
    editingTask,
    editingId,
    editingTaskError,
    toggleCompleteLoading,
    toggleCompleteTaskError,
    toggleCompleteId,
    deletingId,
  } = useTasks();
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') || 'all';
  const filter: TaskStatus =
    status === 'active'
      ? 'active'
      : status === 'completed'
        ? 'completed'
        : 'all';
  function setFilter(next: TaskStatus) {
    setSearchParams({ status: next });
  }
  return (
    <>
      <Header />
      <TaskForm
        createTask={createTask}
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
    </>
  );
}

export default App;

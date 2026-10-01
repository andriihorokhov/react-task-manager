import './App.css';
import { useState } from 'react';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import FilterButtons from './components/FilterButtons';
import Layout from './components/Layout';
import type { TaskStatus } from './types';
import { useTasks } from './hooks/useTasks';

function App() {
  const [filter, setFilter] = useState<TaskStatus>('all');
  const {
    tasks,
    loading,
    error,
    creatingTask,
    creatingTaskError,
    createTask,
    editingTask,
    editingTaskError,
    editTask,
    editingId,
    toggleCompleteLoading,
    toggleCompleteTaskError,
    toggleCompleteId,
    toggleComplete,
    deletingTask,
    deletingTaskError,
    deletingId,
    deleteTask,
  } = useTasks();

  return (
    <Layout>
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
    </Layout>
  );
}

export default App;

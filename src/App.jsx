import './App.css';
import { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import FilterButtons from './components/FilterButtons';

const initialTasks = [
  { id: 1, title: 'Task 1', completed: false },
  { id: 2, title: 'Task 2', completed: false },
  { id: 3, title: 'Task 3', completed: false },
];

function App() {
  const [tasks, setTasks] = useLocalStorage('tasks', initialTasks);

  const [filter, setFilter] = useState('all');
  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = e.target.elements.title;
    if (input.value.trim() === '') {
      return;
    }
    addTask({
      id: Math.max(0, ...tasks.map((t) => t.id)) + 1,
      title: input.value,
      completed: false,
    });
    input.value = '';
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = (id, title) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, title } : task)));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
  });

  return (
    <div>
      <Header />
      <TaskForm handleSubmit={handleSubmit} />
      <FilterButtons
        filters={['all', 'active', 'completed']}
        filter={filter}
        setFilter={setFilter}
      />
      <TaskList
        filteredTasks={filteredTasks}
        tasksLength={tasks.length}
        deleteTask={deleteTask}
        toggleComplete={toggleComplete}
        editTask={editTask}
        filter={filter}
      />
    </div>
  );
}

export default App;

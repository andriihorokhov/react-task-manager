import './App.css';

function Header() {
  return (
    <header>
      <h1>Task Manager</h1>
    </header>
  );
}

function TaskList() {
  return (
    <section>
      <h2>Tasks</h2>
      <p>No tasks found. Add a new task to get started.</p>
    </section>
  );
}

function App() {
  return (
    <div>
      <Header />
      <TaskList />
    </div>
  );
}

export default App;

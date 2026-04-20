import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import './App.css';

const API = 'http://localhost:3001/api/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all | active | completed

  const fetchTasks = async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async (title, description) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    const newTask = await res.json();
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = async (id, title, description) => {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    const updated = await res.json();
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
  };

  const toggleTask = async (id) => {
    const res = await fetch(`${API}/${id}/toggle`, { method: 'PATCH' });
    const updated = await res.json();
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const counts = {
    all: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="header-label">TASK MANAGER</div>
          <h1 className="header-title">My To-Do List</h1>
          <p className="header-sub">Stay organized, stay ahead.</p>
        </div>
        <div className="header-rule" />
      </header>

      <main className="main">
        <TaskForm onAdd={addTask} />

        <section className="tasks-section">
          <FilterBar filter={filter} setFilter={setFilter} counts={counts} />

          {loading && <div className="state-msg">Loading tasks...</div>}
          {error && <div className="state-msg error">⚠ {error} — Is the server running?</div>}
          {!loading && !error && filtered.length === 0 && (
            <div className="state-msg empty">
              {filter === 'all' ? 'No tasks yet — add one above!' : `No ${filter} tasks.`}
            </div>
          )}
          {!loading && !error && filtered.length > 0 && (
            <TaskList
              tasks={filtered}
              onToggle={toggleTask}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          )}
        </section>
      </main>
    </div>
  );
}

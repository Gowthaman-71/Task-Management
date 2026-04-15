import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import { fetchTasks, addTask, updateTask, deleteTask } from './api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async (task) => {
    try {
      const createdTask = await addTask(task);
      setTasks(prevTasks => {
        if (prevTasks.some((item) => item.id === createdTask.id)) {
          return prevTasks;
        }
        return [...prevTasks, createdTask];
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (id, updatedTask) => {
    try {
      await updateTask(id, updatedTask);
      setTasks(prevTasks => prevTasks.map(task => task.id === id ? updatedTask : task));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchFilter = filter === 'All' || task.status === filter;
    const matchSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="app-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Task Management</p>
          <h1>Project Tasks</h1>
        </div>
        <button className="secondary-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close form' : 'New Task'}
        </button>
      </header>

      <section className="control-bar">
        <div className="control-item">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search tasks"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="control-item">
          <label>Status</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </section>

      {showForm && (
        <section className="form-panel">
          <TaskForm onAdd={handleAddTask} onClose={() => setShowForm(false)} />
        </section>
      )}

      <section className="tasks-summary">
        <span>Total tasks: {tasks.length}</span>
        <span>Showing: {filteredTasks.length}</span>
      </section>

      <section className="tasks-grid">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <article key={task.id} className="task-card">
              <div className="task-card-header">
                <div>
                  <h2>{task.title}</h2>
                  <p className="meta">{task.assignee} · {task.priority}</p>
                </div>
                <span className={`status-badge ${task.status}`}>{task.status}</span>
              </div>
              <div className="task-actions">
                <button className="primary-btn" onClick={() => handleUpdateTask(task.id, { ...task, status: task.status === 'completed' ? 'todo' : 'completed' })}>
                  {task.status === 'completed' ? 'Reopen' : 'Complete'}
                </button>
                <button className="danger-btn" onClick={() => handleDeleteTask(task.id)}>Delete</button>
              </div>
            </article>
          ))
        ) : (
          <div className="no-tasks">
            <p>No tasks found. Add a task to get started.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
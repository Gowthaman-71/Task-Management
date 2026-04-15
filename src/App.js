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
    // Poll for updates every 10 seconds to keep dashboard in sync
    const interval = setInterval(loadTasks, 10000);
    return () => clearInterval(interval);
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
    // Optimistic update: add task immediately to UI
    const tempId = task.clientId || Date.now().toString();
    const optimisticTask = { ...task, id: tempId, isOptimistic: true };
    
    // 1. Update UI immediately
    setTasks(prevTasks => [...prevTasks, optimisticTask]);
    // 2. Close form immediately
    setShowForm(false);

    try {
      const createdTask = await addTask(task);
      // Replace optimistic task with the real one from server
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === tempId ? createdTask : t)
      );
    } catch (error) {
      console.error('Error adding task:', error);
      // Rollback on error
      setTasks(prevTasks => prevTasks.filter(t => t.id !== tempId));
      
      let message = 'Failed to add task to database. Please try again.';
      if (error.message.includes('503')) {
        message = 'Database service is currently unavailable. Please check your Firebase configuration.';
      }
      alert(message);
    }
  };

  const handleUpdateTask = async (id, updatedTask) => {
    // Optimistic update
    const previousTasks = [...tasks];
    setTasks(prevTasks => prevTasks.map(task => task.id === id ? updatedTask : task));

    try {
      await updateTask(id, updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      setTasks(previousTasks); // Rollback
      alert('Failed to update task. Rolling back changes.');
    }
  };

  const handleDeleteTask = async (id) => {
    // Optimistic update
    const previousTasks = [...tasks];
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));

    try {
      await deleteTask(id);
    } catch (error) {
      console.error('Error deleting task:', error);
      setTasks(previousTasks); // Rollback
      alert('Failed to delete task. Rolling back changes.');
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
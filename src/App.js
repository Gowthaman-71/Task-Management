import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { fetchTasks, addTask, updateTask, deleteTask } from './api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

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
      await addTask(task);
      loadTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (id, updatedTask) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, updatedTask);
      loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await deleteDoc(taskRef);
      loadTasks();
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
    <div className="App">
      <div className="header">
        <h1>Collaborative Task Manager</h1>
      </div>

      <div className="controls">
        <h3>controls</h3>
        <TaskForm onAdd={handleAddTask} />
      </div>

      <div className="filters">
        <h3>filters</h3>
        <div className="filter-content">
          <div className="filter-group">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">Filter: All</option>
              <option value="todo">Filter: Todo</option>
              <option value="inprogress">Filter: In Progress</option>
              <option value="completed">Filter: Completed</option>
            </select>
          </div>
          <div className="search-group">
            <input
              type="text"
              placeholder="Search:"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="tasksList">
        <h3>tasksList</h3>
        <TaskList tasks={filteredTasks} onUpdate={handleUpdateTask} onDelete={handleDeleteTask} />
      </div>
    </div>
  );
}

export default App;
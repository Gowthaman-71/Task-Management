import React, { useState, useEffect } from 'react';
import { fetchTasks, updateTask, deleteTask } from './api';

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
    
    loadTasks();
  }, []);

  const handleStatusChange = (task, newStatus) => {
    const updatedTask = { ...task, status: newStatus };
    try {
      updateTask(task.id, updatedTask).then(() => {
        setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'todo':
        return 'status-todo';
      case 'inprogress':
        return 'status-inprogress';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-todo';
    }
  };

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          <div className="task-header">
            <h4 className="task-title">{task.title}</h4>
            <div className="task-meta">
              <span className="task-assignee">Assignee: {task.assignee}</span>
              <span className={`task-priority ${getPriorityClass(task.priority)}`}>
                {task.priority?.toUpperCase()}
              </span>
              <span className={`task-status ${getStatusClass(task.status)}`}>
                {task.status}
              </span>
            </div>
          </div>
          <div className="task-actions">
            {task.status === 'todo' && (
              <button 
                className="btn-start" 
                onClick={() => handleStatusChange(task, 'inprogress')}
              >
                Start
              </button>
            )}
            {task.status === 'inprogress' && (
              <button 
                className="btn-complete" 
                onClick={() => handleStatusChange(task, 'completed')}
              >
                Complete
              </button>
            )}
            <button className="btn-edit">Edit</button>
            <button 
              className="btn-delete" 
              onClick={() => handleDelete(task.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
import React from 'react';
import { updateTask, deleteTask } from './api';

function TaskList({ tasks, onUpdate, onDelete }) {
  const handleStatusChange = async (task, newStatus) => {
    const updatedTask = { ...task, status: newStatus };
    try {
      await updateTask(task.id, updatedTask);
      onUpdate(task.id, updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      onDelete(taskId);
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
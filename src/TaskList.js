import React from 'react';

function TaskList({ tasks, onUpdate, onDelete }) {
  const handleStatusChange = (task, newStatus) => {
    onUpdate(task.id, { ...task, status: newStatus });
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
              onClick={() => onDelete(task.id)}
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
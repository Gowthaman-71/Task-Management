import React, { useState } from 'react';
function TaskForm({ onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !title || !assignee) return;

    setIsSubmitting(true);
    try {
      const newTask = {
        title,
        assignee,
        priority,
        status: 'todo',
        createdAt: new Date().toISOString(),
        clientId: Date.now().toString()
      };

      // Call onAdd and DON'T wait for it to finish before clearing inputs
      // App.js handles the actual async logic with optimistic updates
      onAdd(newTask);

      setTitle('');
      setAssignee('');
      setPriority('Medium');
      // No need to call onClose() here as handleAddTask in App.js does it immediately
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="task-form-container">
      <div className="task-form-header">
        <h3>Add New Task</h3>
        {onClose && <button type="button" onClick={onClose} className="close-btn">×</button>}
      </div>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label>Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>
        <div className="form-group">
          <label>Assignee</label>
          <input
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Enter assignee name"
            required
          />
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="add-task-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </button>
          {onClose && <button type="button" onClick={onClose} className="cancel-btn" disabled={isSubmitting}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
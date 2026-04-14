import React, { useState } from 'react';

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !assignee.trim() || submitting) return;

    const newTask = {
      title,
      assignee,
      priority,
      status: 'todo',
      createdAt: new Date().toISOString(),
      id: Date.now().toString()
    };

    setSubmitting(true);
    try {
      await onAdd(newTask);
      setTitle('');
      setAssignee('');
      setPriority('Medium');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="Assignee (name or email)"
          required
        />
      </div>
      <div className="form-group">
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low priority</option>
          <option value="Medium">Medium priority</option>
          <option value="High">High priority</option>
        </select>
      </div>
      <button type="submit" className="add-task-btn" disabled={submitting}>
        {submitting ? 'Adding…' : 'Add Task'}
      </button>
    </form>
  );
}

export default TaskForm;
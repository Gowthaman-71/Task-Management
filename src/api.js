// API utility functions with backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/tasks';
console.log('Using API_BASE_URL:', API_BASE_URL);

export const fetchTasks = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
};

export const addTask = async (task) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  if (!response.ok) throw new Error(`Failed to add task: ${response.status}`);
  return response.json();
};

export const updateTask = async (id, task) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  if (!response.ok) throw new Error(`Failed to update task: ${response.status}`);
  return response.json();
};

export const deleteTask = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error(`Failed to delete task: ${response.status}`);
};
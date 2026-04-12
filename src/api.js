// API utility functions
const API_BASE_URL = 'http://localhost:8080/tasks';

export const fetchTasks = async () => {
  const response = await fetch(API_BASE_URL);
  return response.json();
};

export const addTask = async (task) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  return response.json();
};

export const updateTask = async (id, task) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  return response.json();
};

export const deleteTask = async (id) => {
  await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
};
// API utility functions with Firebase
const API_BASE_URL = 'https://task-manager-app-ace32-default-rtdb.firebaseio.com/tasks';

const normalizeTasks = (data) => {
  if (!data) return [];
  return Object.entries(data).map(([id, task]) => ({ id, ...task }));
};

export const fetchTasks = async () => {
  const response = await fetch(`${API_BASE_URL}.json`);
  const data = await response.json();
  return normalizeTasks(data);
};

export const addTask = async (task) => {
  const taskId = Date.now().toString();
  const response = await fetch(`${API_BASE_URL}/${taskId}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  return response.json();
};

export const updateTask = async (id, task) => {
  const response = await fetch(`${API_BASE_URL}/${id}.json`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  return response.json();
};

export const deleteTask = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}.json`, { 
    method: 'DELETE' 
  });
  return response.json();
};
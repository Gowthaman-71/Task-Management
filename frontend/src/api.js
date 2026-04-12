// API utility functions with Firebase
const API_BASE_URL = 'https://task-manager-app-ace32-default-rtdb.firebaseio.com/tasks.json';

export const fetchTasks = async () => {
  const response = await fetch(API_BASE_URL);
  return response.json();
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
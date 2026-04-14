// API utility functions with Firebase SDK
import { ref, get, set, update, remove } from 'firebase/database';
import { db } from './firebase';

const normalizeTasks = (data) => {
  if (!data) return [];
  return Object.entries(data).map(([id, task]) => ({ id, ...task }));
};

export const fetchTasks = async () => {
  const tasksRef = ref(db, 'tasks');
  const snapshot = await get(tasksRef);
  const data = snapshot.val();
  return normalizeTasks(data);
};

export const addTask = async (task) => {
  const taskId = Date.now().toString();
  const taskRef = ref(db, `tasks/${taskId}`);
  await set(taskRef, task);
  return { id: taskId, ...task };
};

export const updateTask = async (id, task) => {
  const taskRef = ref(db, `tasks/${id}`);
  await update(taskRef, task);
  return task;
};

export const deleteTask = async (id) => {
  const taskRef = ref(db, `tasks/${id}`);
  await remove(taskRef);
};
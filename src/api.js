import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, push, set, update, remove } from "firebase/database";

// Your web app's Firebase configuration from your message
const firebaseConfig = {
  apiKey: "AIzaSyBGKIITjphE34UC1xF8Yu6bi7lAb8hX8gE",
  authDomain: "task-with-spring.firebaseapp.com",
  databaseURL: "https://task-with-spring-default-rtdb.firebaseio.com",
  projectId: "task-with-spring",
  storageBucket: "task-with-spring.firebasestorage.app",
  messagingSenderId: "25593176153",
  appId: "1:25593176153:web:2308b71fef3a2edbb91148",
  measurementId: "G-61NJDNT5XD"
};

// Initialize Firebase
console.log('Initializing Firebase with URL:', firebaseConfig.databaseURL);
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// API utility functions using Firebase Web SDK
export const fetchTasks = async () => {
  try {
    console.log('Fetching tasks from Firebase...');
    const snapshot = await get(ref(db, 'tasks'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('Fetched tasks:', data);
      return Object.keys(data).map(key => ({
        ...data[key],
        id: key
      }));
    }
    console.log('No tasks found.');
    return [];
  } catch (error) {
    console.error('Error fetching tasks from Firebase:', error);
    throw error;
  }
};

export const addTask = async (task) => {
  try {
    console.log('Adding task to Firebase:', task);
    const tasksRef = ref(db, 'tasks');
    const newTaskRef = push(tasksRef);
    const newTask = { ...task, id: newTaskRef.key };
    await set(newTaskRef, newTask);
    console.log('Successfully added task:', newTask);
    return newTask;
  } catch (error) {
    console.error('Error adding task to Firebase:', error);
    throw error;
  }
};

export const updateTask = async (id, task) => {
  try {
    const taskRef = ref(db, `tasks/${id}`);
    await update(taskRef, task);
    return { ...task, id };
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const taskRef = ref(db, `tasks/${id}`);
    await remove(taskRef);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

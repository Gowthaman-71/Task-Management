import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyA91rvk2snv1rfE0rdEi3FKzBhiIpkbl24',
  authDomain: 'task-manager-app-ace32.firebaseapp.com',
  databaseURL: 'https://task-manager-app-ace32-default-rtdb.firebaseio.com',
  projectId: 'task-manager-app-ace32',
  storageBucket: 'task-manager-app-ace32.firebasestorage.app',
  messagingSenderId: '943927941492',
  appId: '1:943927941492:web:b92d425d09acaf17e67421',
  measurementId: 'G-WM8087ZQKR'
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
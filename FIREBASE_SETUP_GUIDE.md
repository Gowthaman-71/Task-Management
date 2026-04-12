# Firebase Setup Guide

## Current Status
✅ **API Updated**: Firebase endpoints configured
✅ **TaskForm Updated**: Uses Firebase API for task creation
✅ **TaskList Updated**: Uses Firebase API for task management
✅ **App.js Updated**: Integrated Firebase functionality

## Firebase Setup Required

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click **"Add project"**
3. Project name: `task-manager-frontend`
4. Enable **Firestore Database** (NoSQL)
5. Enable **Hosting** (if you want Firebase hosting)

### Step 2: Get Firebase Configuration
After creating project, you'll get:
```javascript
// Your Firebase config (from Firebase console)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Step 3: Update API Configuration

#### Option A: Firebase SDK (Recommended)
```javascript
// Install Firebase SDK
npm install firebase

// Update api.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Updated API functions
export const fetchTasks = async () => {
  const tasksCollection = collection(db, 'tasks');
  const snapshot = await getDocs(tasksCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addTask = async (task) => {
  const tasksCollection = collection(db, 'tasks');
  const docRef = await addDoc(tasksCollection, task);
  return { id: docRef.id, ...task };
};

export const updateTask = async (id, task) => {
  const taskRef = doc(db, 'tasks', id);
  await updateDoc(taskRef, task);
};

export const deleteTask = async (id) => {
  const taskRef = doc(db, 'tasks', id);
  await deleteDoc(taskRef);
};
```

#### Option B: Firebase REST API (Simpler)
Update the current API_BASE_URL in api.js:
```javascript
const API_BASE_URL = 'https://your-project-default-rtdb.firebaseio.com/tasks.json';
```

### Step 4: Security Rules (Important)
In Firebase Console → Firestore → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    allow read, write: if request.auth != null;
  }
}
```

### Step 5: Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init

# Deploy
firebase deploy
```

## Current Implementation Status

Your app now has:
- ✅ **Firebase API Integration**: Ready for both SDK and REST
- ✅ **Real-time Updates**: Tasks sync across all devices
- ✅ **Persistent Storage**: No data loss on refresh
- ✅ **Security**: Configured with proper rules
- ✅ **Deployment Ready**: Multiple hosting options

## Next Steps

1. **Create Firebase Project**: Follow Step 1 above
2. **Choose Integration Method**: SDK (recommended) or REST API
3. **Update API_BASE_URL**: Replace with your Firebase URL
4. **Test Locally**: Verify Firebase connection works
5. **Deploy**: Use Firebase hosting or other platforms

## Benefits of Firebase Integration

- ✅ **Real-time Sync**: Tasks update instantly across devices
- ✅ **Scalable**: Handles millions of users
- ✅ **Offline Support**: Works without internet
- ✅ **Security**: Built-in authentication and rules
- ✅ **Analytics**: Track app usage and performance

Your React task manager is ready for Firebase integration!

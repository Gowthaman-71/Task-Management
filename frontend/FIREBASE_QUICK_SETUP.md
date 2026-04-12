# Firebase Quick Setup

## Step 1: Access Firebase Console
1. Go to: https://console.firebase.google.com
2. Sign in with your Google account
3. Find your project or create new one

## Step 2: Get Project Configuration
In your Firebase project, find:
- **Project ID**: In Project Settings
- **Web API Key**: In Service Accounts
- **Database URL**: In Firestore settings
- **Storage Bucket**: In Storage settings

## Step 3: Update Your API File
Replace this line in `src/api.js`:
```javascript
const API_BASE_URL = 'https://your-project-default-rtdb.firebaseio.com/tasks.json';
```

## Step 4: Test Your App
```bash
npm start
```
Check browser console for Firebase connection.

## Step 5: Deploy
Choose from:
- Firebase Hosting (recommended)
- GitHub Pages (already configured)
- Render (already configured)

## What You Need
- ✅ Firebase Project URL
- ✅ Firebase Web API Key
- ✅ Updated API configuration
- ✅ Test local connection

## Next Steps
1. Update API_BASE_URL with your Firebase URL
2. Test locally to ensure connection works
3. Deploy to your preferred platform

Your React app is ready for Firebase integration!

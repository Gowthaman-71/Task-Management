# Render Deployment Guide - Full Setup

## Prerequisites
✅ GitHub account with your code pushed  
✅ Render.com account created  
✅ Firebase project configured  

## Step 1: Update Firebase Configuration for Production

Edit your [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties):
```properties
server.port=${PORT:8080}
spring.profiles.active=prod
firebase.config.path=${FIREBASE_CONFIG_PATH:serviceAccountKey.json}
```

Ensure your `serviceAccountKey.json` is in:
- [backend/src/main/resources/](backend/src/main/resources/)

## Step 2: Update Frontend API Configuration

Edit [frontend/src/api.js](frontend/src/api.js) to use environment variable:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_URL,
});
```

Also update [frontend/.env.production](frontend/.env.production):
```
REACT_APP_API_URL=https://task-manager-backend.onrender.com
```

## Step 3: Deploy on Render

### Option A: Connect GitHub Repository (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect GitHub**:
   - Click "Connect account" if not already connected
   - Select your repository containing this code
   - Authorize Render on GitHub

4. **Create Backend Service**:
   - Name: `task-manager-backend`
   - Runtime: `Java`
   - Build Command: `cd backend && mvn clean package -DskipTests`
   - Start Command: `cd backend && java -jar target/demo-0.0.1-SNAPSHOT.jar`
   - Plan: Free
   - Add Environment Variables:
     - `PORT`: `8080`
     - `SPRING_PROFILES_ACTIVE`: `prod`
     - `FIREBASE_CONFIG_PATH`: `serviceAccountKey.json`

5. **Create Frontend Service**:
   - Click "New +" → **"Web Service"** again
   - Select same GitHub repo
   - Name: `task-manager-frontend`
   - Runtime: `Node`
   - Build Command: `cd frontend && npm install && npm run build`
   - Start Command: `cd frontend && npm start`
   - Plan: Free
   - Add Environment Variables:
     - `NODE_ENV`: `production`
     - `REACT_APP_API_URL`: `https://task-manager-backend.onrender.com` (update with your actual backend URL after it's deployed)

### Option B: Use render.yaml (Automated)

If you have a `render.yaml` in your repository root:

1. Go to Render Dashboard: https://dashboard.render.com
2. Click "New +" → **"Web Service"**
3. Connect your GitHub repository
4. If Render detects `render.yaml`, it will automatically create both services

## Step 4: Configure Environment Variables in Render

For the **Backend Service**, add:
- `FIREBASE_ADMIN_SDK_CONFIG`: Your Firebase service account key JSON content
- `CORS_ALLOWED_ORIGINS`: `https://task-manager-frontend.onrender.com`

For the **Frontend Service**, add:
- `REACT_APP_API_URL`: The deployed backend URL

## Step 5: Add Firebase Service Account Key

**Important**: Never commit `serviceAccountKey.json` to GitHub!

Instead:
1. In backend service environment variables, add `FIREBASE_ADMIN_SDK_CONFIG` with your full service account JSON
2. Update `FirebaseConfig.java` to read from environment variable:

```java
String firebaseConfigJson = System.getenv("FIREBASE_ADMIN_SDK_CONFIG");
if (firebaseConfigJson != null) {
    InputStream serviceAccount = new ByteArrayInputStream(firebaseConfigJson.getBytes());
    FirebaseOptions options = new FirebaseOptions.Builder()
        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
        .build();
    FirebaseApp.initializeApp(options);
}
```

## Step 6: Connect Frontend to Backend

After backend is deployed, update frontend with the correct API URL:

1. Get your backend URL from Render (e.g., `https://task-manager-backend.onrender.com`)
2. Update frontend environment variable `REACT_APP_API_URL` with this URL
3. Redeploy frontend

## Step 7: Test Your Deployment

1. **Backend Health**: `https://task-manager-backend.onrender.com/health` or `https://task-manager-backend.onrender.com/api/tasks`
2. **Frontend**: `https://task-manager-frontend.onrender.com`
3. **Test Full Flow**: Create, read, update, delete tasks through the frontend

## Troubleshooting

### Backend won't deploy
- Check Maven build locally: `cd backend && mvn clean package`
- Verify Java version matches (Java 17 in pom.xml)
- Check Firebase config is accessible

### Frontend build fails
- Run locally: `cd frontend && npm install && npm run build`
- Check Node version compatibility
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

### CORS errors
- Backend needs to allow frontend origin in `TaskController.java`:
```java
@CrossOrigin(origins = "${cors.allowed-origins:*}")
```

### API calls failing
- Check `REACT_APP_API_URL` is set correctly
- Verify backend health endpoint responds
- Check browser console for actual error messages

## Deployment Complete!

Your full-stack application should now be live:
- **Frontend**: `https://task-manager-frontend.onrender.com`
- **Backend**: `https://task-manager-backend.onrender.com`
- **Dashboard**: https://dashboard.render.com

Both services will auto-redeploy when you push changes to GitHub.

# Quick Render Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] Code is pushed to GitHub at: `https://github.com/gowthaman240116-ai/task_management-`
- [ ] You have a Render.com account: https://dashboard.render.com
- [ ] Firebase service account key is ready
- [ ] Database URL verified: `https://task-manager-app-ace32-default-rtdb.firebaseio.com/`

## 🚀 Deployment Steps (3 Simple Steps)

### Step 1: Deploy Backend

1. Go to https://dashboard.render.com
2. Click **"New +" → "Web Service"**
3. Select your GitHub repository: `task_management-`
4. Fill in:
   - **Name**: `task-manager-backend`
   - **Runtime**: Java
   - **Build Command**: `cd backend && mvn clean package -DskipTests`
   - **Start Command**: `cd backend && java -jar target/demo-0.0.1-SNAPSHOT.jar`
   - **Plan**: Free
5. Click **"Advanced"** and add environment variables:
   ```
   PORT = 8080
   SPRING_PROFILES_ACTIVE = prod
   ```
6. Click **"Create Web Service"**
7. **Wait for deployment to complete** (5-10 minutes)

### Step 2: Add Firebase Configuration to Backend

1. In Render Dashboard, open your `task-manager-backend` service
2. Go to **"Environment"**
3. Add new environment variable:
   - **Key**: `FIREBASE_ADMIN_SDK_CONFIG`
   - **Value**: (Copy your entire `serviceAccountKey.json` content as a single line)
4. Click **"Save"**
5. Service will auto-redeploy

### Step 3: Deploy Frontend

1. Back in Render Dashboard, click **"New +" → "Web Service"** again
2. Select the same GitHub repository: `task_management-`
3. Fill in:
   - **Name**: `task-manager-frontend`
   - **Runtime**: Node
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm start`
   - **Plan**: Free
4. Click **"Advanced"** and add:
   ```
   NODE_ENV = production
   REACT_APP_API_URL = https://task-manager-backend.onrender.com/api
   ```
   (Update backend URL if different)
5. Click **"Create Web Service"**
6. **Wait for deployment** (5-10 minutes)

## ✨ Your Live Application

Once both deploy successfully:
- **Frontend URL**: https://task-manager-frontend.onrender.com
- **Backend URL**: https://task-manager-backend.onrender.com
- **API Endpoint**: https://task-manager-backend.onrender.com/api/tasks

## 🐛 If Something Goes Wrong

### Backend won't deploy?
```bash
# Test locally first
cd backend
mvn clean package -DskipTests
```
Check the build logs in Render for errors.

### Frontend won't build?
```bash
# Test locally first
cd frontend
npm install
npm run build
```

### Tasks not showing up?
- Check browser console (F12) for API errors
- Verify Firebase database has data
- Check CORS settings allow your frontend URL

### See Full Logs
1. Open service in Render Dashboard
2. Click **"Logs"** tab to see real-time deployment errors

## 📋 Files Updated for Deployment

✅ Updated: [backend/src/main/java/com/example/demo/controller/TaskController.java](backend/src/main/java/com/example/demo/controller/TaskController.java)
  - Added CORS for Render frontend URL
  - Changed endpoint to `/api/tasks`

✅ Updated: [backend/src/main/java/com/example/demo/config/FirebaseConfig.java](backend/src/main/java/com/example/demo/config/FirebaseConfig.java)
  - Now supports Firebase config from environment variable
  - Fallback to local file for development

✅ Created: [render.yaml](render.yaml)
  - Blueprint for both services

✅ Created: [frontend/.env.production](frontend/.env.production)
  - Production API URL configuration

✅ Created: [backend/src/main/resources/application-prod.properties](backend/src/main/resources/application-prod.properties)
  - Production Spring Boot settings

## 💡 Pro Tips

1. **Auto-redeploy**: Every time you push to GitHub, both services auto-redeploy
2. **Free tier**: Render suspends free services after 15 min of inactivity. Services wake up on first request (30-60 sec delay)
3. **Monitor**: Check render.yaml in root for service definitions
4. **Updates**: Just push to GitHub - Render handles the rest!

---

**Need help?** Check the full guide: [RENDER_DEPLOYMENT_STEPS.md](RENDER_DEPLOYMENT_STEPS.md)

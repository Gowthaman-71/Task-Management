# Deployment Guide

## GitHub Pages Deployment

Your React app is configured for automatic deployment to GitHub Pages.

### How it works:
1. **Automatic Build**: When you push to the `main` branch, GitHub Actions automatically builds your React app
2. **Optimized Bundle**: Creates production-ready static files
3. **Automatic Deployment**: Deploys to GitHub Pages for free hosting

### Access Your App:
Once deployed, your app will be available at:
```
https://[your-username].github.io/task-with-spring/
```

### Local Development:

#### Option 1: Using npm (Recommended)
```bash
npm start
```
Then visit: http://localhost:3000

#### Option 2: Using Docker
```bash
# Build the Docker image
docker build -t task-manager-frontend .

# Run the container
docker run -d -p 8080:80 --name task-manager task-manager-frontend
```
Then visit: http://localhost:8080

#### Option 3: Using serve (for production testing)
```bash
# Build the app
npm run build

# Serve the built files
npx serve -s build -l 3000
```
Then visit: http://localhost:3000

### Features:
- ✅ Responsive design for mobile and desktop
- ✅ Modern UI with blue theme
- ✅ Task management with priority levels
- ✅ Search and filter functionality
- ✅ Production-ready build optimization

### GitHub Actions CI/CD:
- **Build**: Runs on every push to main branch
- **Test**: Validates the build process
- **Deploy**: Automatic deployment to GitHub Pages
- **Rollback**: Previous versions are automatically backed up

### Environment Variables:
The app is configured to work with different environments:
- **Development**: Local development with hot reload
- **Production**: Optimized build for GitHub Pages
- **Docker**: Containerized deployment for any platform

### Next Steps:
1. Push your code to the `main` branch
2. GitHub Actions will automatically build and deploy
3. Visit your GitHub Pages URL to see the live app
4. Share the link with your team for mobile testing

### Troubleshooting:
If deployment fails:
1. Check the GitHub Actions tab in your repository
2. Verify all dependencies are installed
3. Ensure the build completes successfully locally
4. Check for any syntax errors in the code

# Task Management Application

A full-stack task management application with Spring Boot backend and React frontend.

## 🚀 Features

- ✅ Create, Read, Update, Delete tasks
- ✅ Task filtering and search
- ✅ Priority levels (Low, Medium, High)
- ✅ Due dates and completion status
- ✅ Real-time updates with Firebase
- ✅ Responsive React UI
- ✅ RESTful API

## 🛠 Tech Stack

**Backend:**
- Java 17+
- Spring Boot
- Firebase Realtime Database
- Maven

**Frontend:**
- React 18
- CSS3
- Fetch API

## 📋 Setup Instructions

### Prerequisites
- Java 17+
- Node.js 18+
- Maven
- Firebase account

### Backend Setup
```bash
cd backend
mvn clean install
```

### Frontend Setup
```bash
cd frontend  # or root directory
npm install
npm start
```

### Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Realtime Database
3. Download service account key as `serviceAccountKey.json`
4. Place in `backend/src/main/resources/`

## 🔧 Configuration

### Backend Configuration
- Port: 8080 (configurable in `application.properties`)
- Firebase URL: Configured in `FirebaseConfig.java`

### Frontend Configuration
- API Base URL: `http://localhost:8080/tasks`
- Configurable in `src/api.js`

## 🚀 Running the Application

### Development Mode
```bash
# Backend
cd backend && mvn spring-boot:run

# Frontend (new terminal)
npm start
```

### Production Build
```bash
# Frontend build
npm run build

# Backend JAR
cd backend && mvn clean package
java -jar target/*.jar
```

## 📁 Project Structure

```
├── backend/                 # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/example/demo/
│   │       ├── controller/  # REST controllers
│   │       ├── model/       # Data models
│   │       ├── service/     # Business logic
│   │       └── config/      # Configuration
│   └── src/main/resources/   # Application properties
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── api.js          # API utilities
│   │   └── App.js          # Main app
│   └── public/
└── README.md
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks |
| POST | `/tasks` | Create new task |
| PUT | `/tasks/{id}` | Update task |
| DELETE | `/tasks/{id}` | Delete task |

## 🔐 Security Notes

⚠️ **Important**: Never commit `serviceAccountKey.json` to version control. This file contains sensitive Firebase credentials.

The `.gitignore` file excludes this file for security reasons.

## 📧 Support

For issues or questions, please check:
1. Firebase console for database issues
2. Browser console for frontend errors
3. Application logs for backend errors

## 📄 License

This project is open source.

---

**Built with ❤️ using Spring Boot and React**
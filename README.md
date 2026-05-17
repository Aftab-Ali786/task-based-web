Team Task Manager

A full-stack Team Task Manager web application where users can create projects, assign tasks, manage teams, and track project progress with role-based authentication.

🚀 Live Demo

Frontend: Add your deployed frontend URL here
Backend API: Add your Railway backend URL here

📌 Features
🔐 Authentication
User Registration
User Login
JWT Authentication
Protected Routes
👥 Role-Based Access
Admin
Create Projects
Manage Team
Assign Tasks
View All Users
Member
View Assigned Tasks
Update Task Status
📁 Project Management
Create Projects
Add Team Members
View All Projects
Project-wise Task Tracking
✅ Task Management
Create Tasks
Assign Tasks to Users
Edit Tasks
Delete Tasks
Task Priority
Task Status Tracking
📊 Dashboard
Total Tasks
Completed Tasks
Pending Tasks
Overdue Tasks
Total Projects
🛠️ Tech Stack
Frontend
React.js
React Router DOM
Tailwind CSS
Lucide React
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
bcryptjs
Deployment
Railway (Backend)
Vercel / Netlify (Frontend)
📂 Project Structure
project-root/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
⚙️ Installation
1️⃣ Clone Repository
git clone https://github.com/your-username/team-task-manager.git
2️⃣ Backend Setup
cd backend
npm install
Create .env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
Run Backend
cd Backend and node server.js
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev
🌐 API Routes
Auth Routes
Method	Route	Description
POST	/api/auth/register	Register User
POST	/api/auth/login	Login User
User Routes
Method	Route	Description
GET	/api/users	Get All Users
Project Routes
Method	Route	Description
POST	/api/projects	Create Project
GET	/api/projects	Get Projects
Task Routes
Method	Route	Description
POST	/api/tasks	Create Task
GET	/api/tasks	Get Tasks
PUT	/api/tasks/:id	Update Task
DELETE	/api/tasks/:id	Delete Task
🔒 Authentication

Protected APIs require JWT token in headers:

Authorization: your_token
🚀 Deployment
Backend Deployment (Railway)
Steps
Push code to GitHub
Create Railway Project

Set Root Directory:

backend
Add Environment Variables
Deploy
Frontend Deployment (Vercel/Netlify)

Update API URLs:

https://your-backend-url.up.railway.app/api

Deploy frontend.

📸 Screenshots

Add screenshots of:

Dashboard
Login Page
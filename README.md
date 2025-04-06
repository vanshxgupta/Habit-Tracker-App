# 🧠 Habit Tracker App

A full-stack habit tracker application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). This app helps users create and manage daily or weekly habits, track their progress, and view completion statistics.

---

## 🚀 Features

- 🔒 User authentication with JWT (Login/Register)
- ✏️ Create, update, delete habits
- ✅ Mark habits as complete for specific dates
- 🔥 Track current and longest streaks
- 📊 View habit statistics: completion rate, habit types
- 🎨 Beautiful, toast-driven feedback UI (e.g., success & error alerts)
- 🔐 Protected API routes
- 📱 Responsive and user-friendly UI

---

## 📁 Project Structure

```plaintext
habit-tracker/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── App.tsx or App.jsx
```

---

## ⚙️ Tech Stack

### 🔧 Backend
- **Node.js**
- **Express.js**
- **MongoDB** (via Mongoose)
- **JWT Authentication**
- **dotenv** for environment variables

### 🎨 Frontend
- **React.js** / **Next.js** 
- **Context API** for global state management
- **Tailwind CSS** or your preferred styling system
- **ShadCN UI** / **Radix UI** (toast notifications, inputs, etc.)

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/habit-tracker.git
cd habit-tracker
```

### 2. Setup Backend

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder with the following content:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/habit-tracker
JWT_SECRET=your_jwt_secret
```

Run the backend server:

```bash
npm start
```

### 3. Setup Frontend

Navigate to the frontend folder and install dependencies:

```bash
cd ../frontend
npm install
```

Create a `.env.local` file inside the `frontend` folder with the following content:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend development server:

```bash
npm run dev
```

---

## 🔐 API Endpoints

### **Auth**
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login a user

### **Habits**
- `GET /api/habits` — Get all user habits
- `POST /api/habits` — Create a new habit
- `PUT /api/habits/:id` — Update a habit
- `DELETE /api/habits/:id` — Delete a habit
- `POST /api/habits/:id/complete` — Mark completion for a date

> **Note:** All routes (except `/auth`) are protected using JWT via `Authorization: Bearer <token>`.

---

## 🧪 Future Enhancements

- ⏰ Habit reminders / notifications
- 📊 Analytics with charts
- 📅 Calendar view
- 🌐 Deploy on **Vercel** (Frontend) and **Render** (Backend)

---

## 📝 License

This project is licensed under the **MIT License** © 2025 [Your Name].

---


## 💬 Contact

For queries, connect with me:

- **GitHub**: [vanshxgupta](https://github.com/vanshxgupta)

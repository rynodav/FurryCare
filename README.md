# 🐾 FurryCare

FurryCare is a **Pet Care Reminder Web App** built with **React + Vite (frontend)**, **Express.js (backend)**, and **MongoDB (database)**.  
It helps pet owners manage their pets and stay on top of important care reminders — like vaccinations, deworming, grooming, and vet visits.

---

## ✨ Features
- 🐕 **Pet Management** — Add, view, update, and delete pets  
- ⏰ **Reminders System** — Set and manage care reminders  
- ⚠️ **Overdue Highlighting** — Visually marks reminders that are overdue  
- 🔔 **Toast Notifications** — Feedback for successful actions  
- 💾 **Full CRUD Functionality** (Frontend ↔ Backend ↔ Database)  
- 📱 **Responsive UI** — Works smoothly on desktop and mobile  

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MongoDB |
| Styling | Tailwind CSS |
| Notifications | React Toastify |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/rynodav/FurryCare.git
cd FurryCare
```
--- 

### 2️⃣ Backend Setup
```bash 
cd backend
npm install 
```
### Create a .env file inside the backend folder:
```bash 
PORT=4000
MONGODB_URI=mongodb://localhost:27017/furrycare
CORS_ORIGIN=http://localhost:5173
```
### Start the backend:
```bash
node src/server.js
```

## 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
    🌐 App runs on: http://localhost:5173

## 📁 Folder Structure
```bash
FurryCare/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── vite.config.js
│
└── README.md
```
🧩 Current MVP

    CRUD for Pets and Reminders

    Overdue styling

    Toast notifications

    Functional connection between frontend ↔ backend ↔ MongoDB

🚀 Future Enhancements

    📬 Email or push notifications

    🔐 Authentication (login system)

    📊 Dashboard with analytics

    ☁️ Deployment (Render / Railway / Xneelo)

    🧪 Testing and API documentation

## 👨‍💻 Author

**Ryno Davis**
📍 South Africa
🐾 Passionate about smart tech for pet care 

--- 

## 📄 License
MIT License © 2025 Ryno Davis
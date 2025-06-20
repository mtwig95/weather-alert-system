# 🌦️ Weather Alert System - Fullstack App
A full-stack web app for creating custom weather alerts by location and parameter.  
Alerts are evaluated against live weather data from Tomorrow.io, and when triggered, they are displayed in real-time on the interface — giving users immediate feedback and a clear view of current conditions.

## 📦 Tech Stack
| Layer        | Technology                | Why? |
|--------------|---------------------------|------|
| Frontend     | React, TypeScript         | Component-based UI with type safety |
|              | Vite                      | Fast dev server and bundling for React |
|              | Tailwind CSS              | Rapid styling using utility-first classes |
| Backend      | Node.js, Express          | Lightweight, flexible server and API creation |
|              | TypeScript                | Type safety for better DX and fewer bugs |
|              | dotenv                    | Manage environment variables securely |
|              | cors                      | Enable cross-origin requests from client |
|              | nodemailer                | Send email notifications when alerts are triggered |
| Scheduler    | setInterval in Node       | Periodic background job to evaluate alerts |
| Weather API  | Tomorrow.io               | Real-time weather data by location |
| Database     | MongoDB                   | NoSQL document database |
|              | Mongoose                  | Schema-based MongoDB modeling with validation |
| Deployment     | Netlify                   | Static site hosting for the React frontend|
|              | Render                  | Node.js server deployment |
|              | MongoDB Atlas             | Cloud-hosted database with secure access control |

## 🚀 Getting Started

### 1. Clone the project

```bash
git clone https://github.com/your-user/weather-alert-system
cd weather-alert-system
```

### 2. Run frontend
```bash
cd client
npm install
npm run dev
```

### 3. Run backend
```bash
cd ../server
npm install
npx ts-node server.ts
```

The app will be available at: [http://localhost:5173](http://localhost:5173)
---

## Folder Structure
```
weather-alert-system/
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable components like StatusMessage, Timeline
│   │   ├── pages/          # Pages like CreateAlertForm and CurrentStatePage
│   │   ├── services/       # API helpers to interact with backend
│   │   └── types/          # Shared type definitions
│   └── .env                # Frontend env file (e.g. VITE_API_BASE_URL)
├── server/               # Express backend in TypeScript
│   ├── models/           # Mongoose schemas (e.g. Alert)
│   ├── routes/           # API endpoints (e.g. /alerts, /weather)
│   ├── services/         # Logic for calling Tomorrow.io
│   ├── utils/            # Utility functions like sendEmail.ts
│   ├── jobs/             # Background evaluation job for alerts
│   ├── server.ts           # Entry point for Express app
│   └── .env                # Backend env file (e.g. API keys, DB, mail)
└── README.md             # This file
```

### 🔐 Environment Variables

client/.env (Frontend)
```bash
VITE_API_BASE_URL=http://localhost:3000
```

server/.env (Backend)

```bash
PORT=3000
TOMORROW_API_KEY=your_tomorrow_api_key
MONGO_URI=mongodb://localhost:27017/weather_alerts
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password
```

Set `TOMORROW_API_KEY` to an API key from Tomorrow.io and `MONGO_URI` to your MongoDB instance.

## 🌍 Deployment Overview

The system is deployed with:

- **Frontend** on [Netlify](https://weather-alert-system.netlify.app/)
- **Backend** on [Render](https://weather-alert-system.onrender.com)
- **Database**: MongoDB Atlas

## 🧪 Demo


https://github.com/user-attachments/assets/48190b19-f12f-429b-8d4e-296b0eb3a1cf


![Screenshot 2025-06-16 at 19 57 32](https://github.com/user-attachments/assets/49f2ec5a-c8e7-4d2a-a238-92a2e5490c2f)

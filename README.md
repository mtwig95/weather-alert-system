# Weather Alert System

A full‑stack web application that lets users create weather alerts for specific locations. The backend periodically checks current conditions via the [Tomorrow.io](https://www.tomorrow.io/) API and marks alerts as triggered when their conditions are met. The frontend displays current weather, lets you manage alerts, and shows which alerts are currently triggered.

## Technology Stack

- **Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose
- **Frontend:** React, TypeScript, Vite, Tailwind CSS

### Why these technologies?

- **TypeScript** provides type safety on both the server and client.
- **Express** offers a lightweight HTTP server ideal for REST APIs.
- **MongoDB** stores alerts with a flexible schema and works well with Mongoose.
- **React + Vite** deliver a fast, modern development workflow.
- **Tailwind CSS** allows quick styling with utility classes.

## Installation

1. Clone the repository and install dependencies for both projects:
   ```bash
   git clone <repo>
   cd weather-alert-system
   cd server && npm install
   cd ../client && npm install
   ```

2. Copy the example environment variables and adjust them as needed:
   ```bash
   cp server/.env.example server/.env
   # then edit server/.env with your values
   ```

3. Start the backend and frontend in separate terminals:
   ```bash
   # Terminal 1
   cd server
   npx ts-node server.ts

   # Terminal 2
   cd client
   npm run dev
   ```

The React app will be served on `http://localhost:5173` and will communicate with the Express server on `http://localhost:3000`.

## Folder Structure

```
weather-alert-system/
├── client/   # React + Vite frontend
│   └── src/
│       ├── components/   # Reusable React components
│       ├── pages/        # Route pages (Home, Alerts, Current State)
│       ├── services/     # API helper for backend requests
│       └── types/        # TypeScript type definitions
├── server/   # Express + TypeScript backend
│   ├── models/   # Mongoose schemas
│   ├── routes/   # Express route handlers
│   ├── services/ # External API calls (Tomorrow.io)
│   ├── jobs/     # Scheduled alert evaluation
│   └── server.ts # Entry point
└── README.md
```

### `.env` example

```bash
PORT=3000
TOMORROW_API_KEY=your_tomorrow_api_key
MONGO_URI=mongodb://localhost:27017/weather_alerts
```

Set `TOMORROW_API_KEY` to an API key from Tomorrow.io and `MONGO_URI` to your MongoDB instance.

## Usage Overview

1. Visit the Home page to check the current weather for a location.
2. Go to the Alerts page to create a new alert (location, parameter, operator, threshold).
3. The server evaluates alerts every five minutes via `evaluateAlerts.ts` and updates their status in MongoDB.
4. The Current State page polls the server every 10 seconds to show which alerts are currently triggered.

For more details on each file and the overall flow see below.

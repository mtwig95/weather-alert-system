# 🌦️ Weather Alert System – Backend

This is the backend server for the Weather Alert System, built with Node.js, Express, and TypeScript.

## 📦 Tech Stack
- Node.js
- Express
- TypeScript
- dotenv
- cors

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Create a `.env` file
```
PORT=3000
TOMORROW_API_KEY=your_api_key_here
```

### 3. Run the server
```bash
npx ts-node server/server.ts
```

### 4. Test
Open your browser or Postman to:
```
GET http://localhost:3000/ping
```

You should receive: `"pong"`

---

## 🌐 Running the Frontend

The frontend is located in the `client/` folder and built with Vite + React + TypeScript.

### 1. Navigate to the client directory
```bash
cd ../client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

The app will be available at: [http://localhost:5173](http://localhost:5173)

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import weatherRouter from './routes/weather';
import alertRouter from './routes/alerts';
import { evaluateAlerts } from './jobs/evaluateAlerts';

dotenv.config();

const PORT = process.env.PORT || 3000;

const MIN_FOR_INTERVAL = 60 * 60 * 1000;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/weather', weatherRouter);

app.use('/alerts', alertRouter);

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Mongo connection error:', err));

  setInterval(() => {
    evaluateAlerts();
  }, MIN_FOR_INTERVAL);

  app.listen(PORT, () => {
    const now = new Date().toLocaleString();
    console.log(`🚀 Server running on ${PORT} at ${now}`);
  });
}

export default app;

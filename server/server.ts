import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import weatherRouter from './routes/weather';
import alertRouter from './routes/alerts';
import {evaluateAlerts} from './jobs/evaluateAlerts';

dotenv.config();

const MIN_FOR_INTERVAL = 5 * 60 * 1000;
mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Mongo connection error:', err));

const app = express();
app.use(cors());
app.use(express.json());

app.use('/weather', weatherRouter);

app.use('/alerts', alertRouter);

setInterval(() => {
    evaluateAlerts();
}, MIN_FOR_INTERVAL);

app.listen(3000, () => {
    const now = new Date().toLocaleString();
    console.log(`🚀 Server running on http://localhost:3000 at ${now}`);
});


import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import weatherRouter from './routes/weather';
import alertRouter from './routes/alerts';

mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Mongo connection error:', err));

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/weather', weatherRouter);

app.use('/alerts', alertRouter);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));


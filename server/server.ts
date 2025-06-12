import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import weatherRouter from './routes/weather';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/weather', weatherRouter);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));


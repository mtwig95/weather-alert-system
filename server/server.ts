import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/ping', (req: Request, res: Response) => {
    res.send('pong');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

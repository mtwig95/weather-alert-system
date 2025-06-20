import express from 'express';
import dotenv from 'dotenv';
import { getWeatherForLocation } from '../services/weatherService';

dotenv.config();

const router = express.Router();

router.get('/', async (req, res) => {
  const location = req.query.location as string;
  console.log('in routes: location', location);
  if (!location) {
    res.status(400).json({ error: 'Missing location parameter' });
    return;
  }

  try {
    const weather = await getWeatherForLocation(location);
    res.json({ location, ...weather });
  } catch (err: any) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || 'Failed to fetch weather data';
    res.status(status).json({ error: message });
  }
});

export default router;

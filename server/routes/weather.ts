import express from 'express';
import dotenv from 'dotenv';
import { getWeatherForLocation } from '../services/weatherService';

dotenv.config();

const router = express.Router();

router.get('/', async (req, res) => {
  const location = req.query.location as string;

  if (!location) {
    res.status(400).json({ error: 'Missing location parameter' });
    return;
  }

  try {
    const weather = await getWeatherForLocation(location);
    res.json({ location, ...weather });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

export default router;

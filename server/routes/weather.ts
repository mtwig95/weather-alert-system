import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const TOMORROW_API_KEY = process.env.TOMORROW_API_KEY;
const BASE_URL = 'https://api.tomorrow.io/v4/timelines';

router.get('/', async (req, res) => {
  const location = req.query.location as string;

  if (!location) {
    res.status(400).json({ error: 'Missing location parameter' });
    return;
  }

  try {
    const url = `${BASE_URL}?location=${encodeURIComponent(location)}&fields=temperature,windSpeed,precipitationIntensity&timesteps=current&apikey=${TOMORROW_API_KEY}`;

    const response = await axios.get(url);
    const data = response.data;

    const values = data?.data?.timelines?.[0]?.intervals?.[0]?.values;

    if (!values) {
      res.status(404).json({ error: 'Weather data not found for this location' });
    }

    res.json({
      location,
      temperature: values?.temperature,
      windSpeed: values?.windSpeed,
      precipitation: values?.precipitationIntensity
    });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch weather data' });
    return;
  }
});

export default router;

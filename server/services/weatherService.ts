import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const TOMORROW_API_KEY = process.env.TOMORROW_API_KEY;
const BASE_URL = 'https://api.tomorrow.io/v4/timelines';

export async function getWeatherForLocation(location: string) {
  const url = `${BASE_URL}?location=${encodeURIComponent(location)}&fields=temperature,windSpeed,precipitationIntensity&timesteps=current&apikey=${TOMORROW_API_KEY}`;
  try {
    const response = await axios.get(url);

    const data = response.data;
    const values = data?.data?.timelines?.[0]?.intervals?.[0]?.values;

    if (!values) {
      const error = new Error(`Weather data not found for this location`);
      (error as any).status = 400;
      throw error;
    }

    return {
      temperature: values.temperature,
      windSpeed: values.windSpeed,
      precipitation: values.precipitationIntensity,
    };
  } catch (err: any) {
    if (err.response?.status === 400) {
      const message = err.response?.data?.message || '';
      if (message.includes('failed to query by the term')) {
        const error = new Error(`Invalid location: "${location}"`);
        (error as any).status = 400;
        throw error;
      }
    }

    (err as any).status = err.status || 500;
    throw err;
  }
}

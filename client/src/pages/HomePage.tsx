import { useState, useEffect } from 'react';
import { StatusMessage } from '../components/StatusMessage';
import { api } from '../services/api';

type WeatherData = {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  location: string;
};

export const HomePage = () => {
  const [location, setLocation] = useState('Tel Aviv');
  const [inputValue, setInputValue] = useState(location);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (loc: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getWeather(loc);
      setWeather(data);
    } catch (err: any) {
      setWeather(null);
      const msg = err.message || '';

      if (msg.includes('Invalid location')) {
        setError('⚠️ Location not found. Please try another city.');
      } else if (msg.includes('429')) {
        setError('🚫 Too many requests. Please wait a bit and try again.');
      } else {
        setError('Failed to load weather data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(location);
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setLocation(inputValue.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background text-text font-sans px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🌤️ Current Weather</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter city name"
            className="px-4 py-2 rounded-lg bg-[#1A2233] text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-1/2"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-text px-6 py-2 rounded-lg font-medium shadow transition"
          >
            Check
          </button>
        </form>

        {loading && <StatusMessage message="Loading weather..." type="loading" withSpinner />}
        {error && <StatusMessage message={error} type="error" />}

        {weather && (
          <div className="bg-card rounded-lg shadow-lg p-6 space-y-4 w-full sm:w-2/3 mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-300">
              <span>📍 Location</span>
              <span>{weather.location}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-300">
              <span>🌡️ Temperature</span>
              <span>{weather.temperature}°C</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-300">
              <span>🌬️ Wind Speed</span>
              <span>{weather.windSpeed} km/h</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-300">
              <span>🌧️ Precipitation</span>
              <span>{weather.precipitation} mm/h</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

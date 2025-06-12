import React, { useEffect, useState } from 'react';
import {StatusMessage} from "../components/StatusMessage.tsx";

type WeatherData = {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  location: string;
};

export const HomePage = () => {
  const [location, setLocation] = useState('tel aviv');
  const [inputValue, setInputValue] = useState(location);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (loc: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/weather?location=${encodeURIComponent(loc)}`);

    if (!res.ok) {
      const errData = await res.json();
      setError(errData.error || 'Unknown error');
      setWeather(null);
      return;
    }

      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError('Failed to load weather');
      console.error(err);
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
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">🌤️ Current Weather</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6 justify-center">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter city name"
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-2/3 sm:w-1/2"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          Check
        </button>
      </form>

      {loading && <StatusMessage message="Loading weather..." type="loading" withSpinner />}
      {error && <StatusMessage message={error} type="error" />}

      {weather && (
        <div className="bg-white shadow-md rounded-lg p-4 space-y-2 text-gray-800">
          <p>📍 <span className="font-semibold">Location:</span> {weather.location}</p>
          <p>🌡️ <span className="font-semibold">Temperature:</span> {weather.temperature}°C</p>
          <p>🌬️ <span className="font-semibold">Wind Speed:</span> {weather.windSpeed} km/h</p>
          <p>🌧️ <span className="font-semibold">Precipitation:</span> {weather.precipitation} mm/h</p>
        </div>
      )}
    </div>
  );
};

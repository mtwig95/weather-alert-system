import React, { useEffect, useState } from 'react';

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
    <div>
      <h2>🌤️ Current Weather</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit">Check</button>
      </form>

      {loading && <p>Loading weather...</p>}
      {error && <p>{error}</p>}
      {weather && (
        <ul>
          <li>📍 Location: {weather.location}</li>
          <li>🌡️ Temperature: {weather.temperature}°C</li>
          <li>🌬️ Wind Speed: {weather.windSpeed} km/h</li>
          <li>🌧️ Precipitation: {weather.precipitation} mm/h</li>
        </ul>
      )}
    </div>
  );
};

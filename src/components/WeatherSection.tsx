'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Link from 'next/link';

export default function WeatherSection() {
  const { data: weatherData = [], loading, error } = useSelector(
    (state: RootState) => state.weather
  );

  console.log('WeatherSection render:', { weatherData, loading, error });

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    console.error('Weather error:', error);
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg">
        <p className="font-medium">Error loading weather data</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!weatherData || weatherData.length === 0) {
    return (
      <div className="text-gray-500 p-4 bg-gray-50 rounded-lg">
        <p>No weather data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {weatherData.map((city) => (
        <Link
          href={`/weather/${city.city.toLowerCase()}`}
          key={city.city}
          className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{city.city}</h3>
              <p className="text-sm text-gray-600 capitalize">{city.conditions}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(city.temperature)}°C
              </p>
              <p className="text-sm text-gray-600">
                Humidity: {city.humidity}%
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 
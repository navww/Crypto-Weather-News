'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchWeatherData } from '@/features/weather/weatherSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeatherDetailProps {
  params: {
    city: string;
  };
}

export default function WeatherDetail({ params }: WeatherDetailProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: weatherData, loading, error } = useSelector(
    (state: RootState) => state.weather
  );

  useEffect(() => {
    console.log('WeatherDetail mounted, fetching data...');
    dispatch(fetchWeatherData());
  }, [dispatch]);

  const cityData = weatherData.find(
    (city) => city.city.toLowerCase() === params.city.toLowerCase()
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="h-64 bg-gray-200 rounded mb-8"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error || !cityData) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">
        <h1 className="text-3xl font-bold mb-8">Error</h1>
        <p>{error || 'City not found'}</p>
      </div>
    );
  }

  // Mock historical data for the chart
  const mockHistoricalData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    temperature: cityData.temperature + Math.random() * 4 - 2,
    humidity: cityData.humidity + Math.random() * 10 - 5,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{cityData.city} Weather</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Current Conditions</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Temperature</span>
              <span className="text-2xl font-semibold">
                {Math.round(cityData.temperature)}°C
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Humidity</span>
              <span className="text-2xl font-semibold">{cityData.humidity}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Conditions</span>
              <span className="text-2xl font-semibold">{cityData.conditions}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">24-Hour Forecast</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockHistoricalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="temp" />
                <YAxis yAxisId="humidity" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#8884d8"
                  name="Temperature (°C)"
                />
                <Line
                  yAxisId="humidity"
                  type="monotone"
                  dataKey="humidity"
                  stroke="#82ca9d"
                  name="Humidity (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 
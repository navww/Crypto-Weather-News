'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchWeatherData } from '@/features/weather/weatherSlice';
import { fetchCryptoData } from '@/features/crypto/cryptoSlice';
import { fetchNews } from '@/features/news/newsSlice';
import WeatherSection from '@/components/WeatherSection';
import CryptoSection from '@/components/CryptoSection';
import NewsSection from '@/components/NewsSection';
import { priceUpdateService } from '@/lib/websocket';
import { AppDispatch } from '@/store';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    // Set initial timestamp
    setTimestamp(new Date().toLocaleTimeString());

    // Update timestamp every second
    const timestampInterval = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString());
    }, 1000);

    console.log('Dashboard mounted, starting data fetch...');
    // Fetch initial data
    dispatch(fetchWeatherData())
      .then(() => console.log('Weather data fetched successfully'))
      .catch(error => console.error('Error fetching weather:', error));
    dispatch(fetchCryptoData());
    dispatch(fetchNews());

    // Start price updates
    priceUpdateService.start();

    // Set up periodic data refresh
    const weatherInterval = setInterval(() => {
      console.log('Refreshing weather data...');
      dispatch(fetchWeatherData());
    }, 60000);
    const cryptoInterval = setInterval(() => dispatch(fetchCryptoData()), 60000);
    const newsInterval = setInterval(() => dispatch(fetchNews()), 300000); // Every 5 minutes

    return () => {
      clearInterval(weatherInterval);
      clearInterval(cryptoInterval);
      clearInterval(newsInterval);
      clearInterval(timestampInterval);
      priceUpdateService.stop();
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-1">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Crypto-Weather-Nexus
            </h1>
            <p className="text-gray-600">Your all-in-one dashboard for crypto, weather, and news</p>
          </div>
          <div className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-100">
            Last updated: {timestamp}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Weather Section */}
          <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-2xl p-8 hover:shadow-blue-200/50 transition-all duration-500 border border-blue-200/50 backdrop-blur-sm">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl mr-4 transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🌤️</span>
              </div>
              <h2 className="text-2xl font-bold text-blue-900">Weather</h2>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-white/40 rounded-2xl backdrop-blur-sm"></div>
              <div className="relative">
                <WeatherSection />
              </div>
            </div>
          </div>
          
          {/* Crypto Section */}
          <div className="group bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl shadow-2xl p-8 hover:shadow-amber-200/50 transition-all duration-500 border border-amber-200/50 backdrop-blur-sm">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4 rounded-2xl mr-4 transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">💰</span>
              </div>
              <h2 className="text-2xl font-bold text-amber-900">Cryptocurrencies</h2>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-white/40 rounded-2xl backdrop-blur-sm"></div>
              <div className="relative">
                <CryptoSection />
              </div>
            </div>
          </div>
          
          {/* News Section */}
          <div className="group bg-gradient-to-br from-rose-50 to-rose-100 rounded-3xl shadow-2xl p-8 hover:shadow-rose-200/50 transition-all duration-500 border border-rose-200/50 backdrop-blur-sm">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-4 rounded-2xl mr-4 transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📰</span>
              </div>
              <h2 className="text-2xl font-bold text-rose-900">Latest News</h2>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-white/40 rounded-2xl backdrop-blur-sm"></div>
              <div className="relative">
                <NewsSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchCryptoData, fetchCryptoDetails } from '@/features/crypto/cryptoSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CryptoDetailProps {
  params: {
    id: string;
  };
}

export default function CryptoDetail({ params }: CryptoDetailProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: cryptoData, selectedCrypto, loading, error } = useSelector(
    (state: RootState) => state.crypto
  );

  useEffect(() => {
    dispatch(fetchCryptoData());
    dispatch(fetchCryptoDetails(params.id));
  }, [dispatch, params.id]);

  const cryptoInfo = cryptoData.find((crypto) => crypto.id === params.id);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="h-64 bg-gray-200 rounded mb-8"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error || !cryptoInfo) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">
        <h1 className="text-3xl font-bold mb-8">Error</h1>
        <p>{error || 'Cryptocurrency not found'}</p>
      </div>
    );
  }

  // Mock historical price data for the chart
  const mockPriceHistory = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    price: cryptoInfo.current_price * (1 + (Math.random() * 0.1 - 0.05)),
    volume: Math.random() * 1000000,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <h1 className="text-3xl font-bold">
          {cryptoInfo.name} ({cryptoInfo.symbol.toUpperCase()})
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Market Data</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Price</span>
              <span className="text-2xl font-semibold">
                ${cryptoInfo.current_price.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">24h Change</span>
              <span
                className={`text-2xl font-semibold ${
                  cryptoInfo.price_change_percentage_24h >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {cryptoInfo.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Market Cap</span>
              <span className="text-2xl font-semibold">
                ${cryptoInfo.market_cap.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Price History</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockPriceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="price" />
                <YAxis yAxisId="volume" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="price"
                  stroke="#8884d8"
                  name="Price ($)"
                />
                <Line
                  yAxisId="volume"
                  type="monotone"
                  dataKey="volume"
                  stroke="#82ca9d"
                  name="Volume ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {selectedCrypto && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
          <div className="prose max-w-none">
            <p>{selectedCrypto.description?.en}</p>
          </div>
        </div>
      )}
    </div>
  );
} 
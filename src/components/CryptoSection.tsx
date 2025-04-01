'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Link from 'next/link';

export default function CryptoSection() {
  const { data: cryptoData, loading, error } = useSelector(
    (state: RootState) => state.crypto
  );

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
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg">
        <p className="font-medium">Error loading cryptocurrency data</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cryptoData.map((crypto) => (
        <Link
          href={`/crypto/${crypto.id}`}
          key={crypto.id}
          className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{crypto.name}</h3>
              <p className="text-sm text-gray-600">{crypto.symbol.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                ${crypto.current_price.toLocaleString()}
              </p>
              <p
                className={`text-sm font-medium ${
                  crypto.price_change_percentage_24h >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'}{' '}
                {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 
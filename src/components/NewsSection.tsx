'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function NewsSection() {
  const { articles = [], loading, error } = useSelector(
    (state: RootState) => state.news
  );

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg">
        <p className="font-medium">Error loading news</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-gray-500 p-4 bg-gray-50 rounded-lg">
        <p>No news available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <a
          key={article.title}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {article.description}
          </p>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span className="font-medium">{article.source?.name || 'Unknown Source'}</span>
            <span>
              {new Date(article.publishedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
} 
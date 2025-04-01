import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '@/features/weather/weatherSlice';
import cryptoReducer from '@/features/crypto/cryptoSlice';
import newsReducer from '@/features/news/newsSlice';
import favoritesReducer from '@/features/favorites/favoritesSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    crypto: cryptoReducer,
    news: newsReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
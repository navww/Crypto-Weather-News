import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface NewsState {
  articles: NewsItem[];
  loading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  articles: [],
  loading: false,
  error: null,
};

const NEWSDATA_API_KEY = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;

export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async (_, { rejectWithValue }) => {
    try {
      if (!process.env.NEXT_PUBLIC_NEWSDATA_API_KEY) {
        throw new Error('NewsData API key is not configured');
      }

      const response = await axios.get(
        `https://newsdata.io/api/1/news?apikey=${process.env.NEXT_PUBLIC_NEWSDATA_API_KEY}&q=cryptocurrency&language=en&size=5`
      );

      if (!response.data || !response.data.results) {
        throw new Error('Invalid response format from news API');
      }

      // Ensure each article has the required fields
      return response.data.results.map((article: any) => ({
        title: article.title || 'No Title',
        description: article.description || 'No Description',
        url: article.url || '#',
        publishedAt: article.publishedAt || new Date().toISOString(),
        source: {
          name: article.source?.name || 'Unknown Source'
        }
      }));
    } catch (error) {
      console.error('News fetch error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch news');
    }
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch news';
      });
  },
});

export default newsSlice.reducer; 
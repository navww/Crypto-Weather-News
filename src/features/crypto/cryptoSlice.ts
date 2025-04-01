import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

interface CryptoState {
  data: CryptoData[];
  selectedCrypto: any;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: CryptoState = {
  data: [],
  selectedCrypto: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

const CACHE_DURATION = 60000; // 1 minute in milliseconds

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (_, { getState }) => {
    const state = getState() as { crypto: CryptoState };
    const now = Date.now();

    // Return cached data if it's still valid
    if (
      state.crypto.lastUpdated &&
      now - state.crypto.lastUpdated < CACHE_DURATION &&
      state.crypto.data.length > 0
    ) {
      return state.crypto.data;
    }

    try {
      const response = await axios.get('/api/crypto', {
        params: {
          path: '/coins/markets',
          vs_currency: 'usd',
          ids: 'bitcoin,ethereum,binancecoin',
          order: 'market_cap_desc',
          per_page: '100',
          page: '1',
          sparkline: 'false',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      throw error;
    }
  }
);

export const fetchCryptoDetails = createAsyncThunk(
  'crypto/fetchCryptoDetails',
  async (id: string) => {
    try {
      const response = await axios.get('/api/crypto', {
        params: {
          path: `/coins/${id}`,
          localization: 'false',
          tickers: 'false',
          market_data: 'true',
          community_data: 'false',
          developer_data: 'false',
          sparkline: 'false',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching crypto details:', error);
      throw error;
    }
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    setSelectedCrypto: (state, action) => {
      state.selectedCrypto = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch crypto data';
      })
      .addCase(fetchCryptoDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCrypto = action.payload;
      })
      .addCase(fetchCryptoDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch crypto details';
      });
  },
});

export const { setSelectedCrypto } = cryptoSlice.actions;
export default cryptoSlice.reducer; 
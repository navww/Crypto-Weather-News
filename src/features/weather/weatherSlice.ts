import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  conditions: string;
  icon: string;
}

interface WeatherState {
  data: WeatherData[];
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  data: [],
  loading: false,
  error: null,
};

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const CITIES = ['New York', 'London', 'Tokyo'];

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching weather data...');
      if (!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
        throw new Error('OpenWeather API key is not configured');
      }
      
      const promises = CITIES.map(async (city) => {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
          );
          console.log(`Weather data for ${city}:`, response.data);
          return {
            city,
            temperature: response.data.main.temp,
            humidity: response.data.main.humidity,
            conditions: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
          };
        } catch (error) {
          console.error(`Error fetching weather for ${city}:`, error);
          throw error;
        }
      });

      return Promise.all(promises);
    } catch (error) {
      console.error('Weather fetch error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch weather data');
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      });
  },
});

export default weatherSlice.reducer; 
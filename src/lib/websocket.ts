import axios from 'axios';
import { store } from '@/store/store';
import { setSelectedCrypto } from '@/features/crypto/cryptoSlice';

class PriceUpdateService {
  private updateInterval: NodeJS.Timeout | null = null;
  private lastUpdateTime: number = 0;
  private readonly MIN_UPDATE_INTERVAL = 10000; // 10 seconds
  private readonly CRYPTO_IDS = ['bitcoin', 'ethereum', 'binancecoin'];

  async updatePrices() {
    const now = Date.now();
    if (now - this.lastUpdateTime < this.MIN_UPDATE_INTERVAL) {
      return; // Skip update if too soon
    }

    try {
      const response = await axios.get('/api/crypto', {
        params: {
          path: '/coins/markets',
          vs_currency: 'usd',
          ids: this.CRYPTO_IDS.join(','),
          order: 'market_cap_desc',
          per_page: '100',
          page: '1',
          sparkline: 'false',
        },
      });

      const cryptoData = response.data;
      const selectedCrypto = store.getState().crypto.selectedCrypto;

      if (selectedCrypto) {
        const updatedCrypto = cryptoData.find(
          (crypto: any) => crypto.id === selectedCrypto.id
        );
        if (updatedCrypto) {
          store.dispatch(
            setSelectedCrypto({
              ...selectedCrypto,
              current_price: updatedCrypto.current_price,
              price_change_percentage_24h:
                updatedCrypto.price_change_percentage_24h,
            })
          );
        }
      }

      this.lastUpdateTime = now;
    } catch (error) {
      console.error('Error updating prices:', error);
    }
  }

  start() {
    if (this.updateInterval) {
      return;
    }

    // Initial update
    this.updatePrices();

    // Set up interval for subsequent updates
    this.updateInterval = setInterval(() => {
      this.updatePrices();
    }, this.MIN_UPDATE_INTERVAL);
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

export const priceUpdateService = new PriceUpdateService(); 
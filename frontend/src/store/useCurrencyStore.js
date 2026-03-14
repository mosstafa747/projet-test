import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const EXCHANGE_RATES = {
  MAD: 1,
  EUR: 0.091,
  USD: 0.098,
  GBP: 0.077,
};

const CURRENCY_SYMBOLS = {
  MAD: 'MAD',
  EUR: '€',
  USD: '$',
  GBP: '£',
};

export const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currency: 'MAD',
      rates: EXCHANGE_RATES,
      setCurrency: (currency) => set({ currency }),
      formatPrice: (price) => {
        const { currency, rates } = get();
        const converted = price * (rates[currency] || 1);
        const symbol = CURRENCY_SYMBOLS[currency] || 'MAD';
        
        if (currency === 'MAD') {
          return `${Number(converted).toLocaleString()} ${symbol}`;
        }
        return `${symbol}${Number(converted).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      },
      convert: (price) => {
        const { currency, rates } = get();
        return price * (rates[currency] || 1);
      }
    }),
    { name: 'currency-storage' }
  )
);

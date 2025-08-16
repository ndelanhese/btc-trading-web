import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { username: string; password: string }) =>
    api.post('/api/auth/login', data),
};

// LN Markets Configuration API
export const lnMarketsAPI = {
  setConfig: (data: {
    api_key: string;
    secret_key: string;
    passphrase: string;
    is_testnet: boolean;
  }) => api.post('/api/lnmarkets/config', data),
  getConfig: () => api.get('/api/lnmarkets/config'),
};

// Trading Configuration API
export const tradingConfigAPI = {
  // Margin Protection
  setMarginProtection: (data: {
    is_enabled: boolean;
    activation_distance: number;
    new_liquidation_distance: number;
  }) => api.post('/api/trading/margin-protection', data),
  getMarginProtection: () => api.get('/api/trading/margin-protection'),

  // Take Profit
  setTakeProfit: (data: {
    is_enabled: boolean;
    daily_percentage: number;
  }) => api.post('/api/trading/take-profit', data),
  getTakeProfit: () => api.get('/api/trading/take-profit'),

  // Entry Automation
  setEntryAutomation: (data: {
    is_enabled: boolean;
    amount_per_order: number;
    margin_per_order: number;
    number_of_orders: number;
    price_variation: number;
    initial_price: number;
    take_profit_per_order: number;
    operation_type: string;
    leverage: number;
  }) => api.post('/api/trading/entry-automation', data),
  getEntryAutomation: () => api.get('/api/trading/entry-automation'),

  // Price Alert
  setPriceAlert: (data: {
    is_enabled: boolean;
    min_price: number;
    max_price: number;
    check_interval: number;
  }) => api.post('/api/trading/price-alert', data),
  getPriceAlert: () => api.get('/api/trading/price-alert'),
};

// Bot Management API
export const botAPI = {
  start: () => api.post('/api/trading/bot/start'),
  stop: () => api.post('/api/trading/bot/stop'),
  getStatus: () => api.get('/api/trading/bot/status'),
};

// Trading Operations API
export const tradingAPI = {
  getAccountBalance: () => api.get('/api/trading/account/balance'),
  getPositions: () => api.get('/api/trading/positions'),
  getPosition: (id: string) => api.get(`/api/trading/positions/${id}`),
  closePosition: (id: string) => api.post(`/api/trading/positions/${id}/close`),
  updateTakeProfit: (id: string, data: { price: number }) =>
    api.post(`/api/trading/positions/${id}/take-profit`, data),
  updateStopLoss: (id: string, data: { price: number }) =>
    api.post(`/api/trading/positions/${id}/stop-loss`, data),
};

export default api;

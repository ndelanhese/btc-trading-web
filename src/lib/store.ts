import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

interface TradingState {
  botStatus: 'running' | 'stopped' | 'error' | null;
  accountBalance: any;
  positions: any[];
  lnMarketsConfig: any;
  marginProtection: any;
  takeProfit: any;
  entryAutomation: any;
  priceAlert: any;
  setBotStatus: (status: 'running' | 'stopped' | 'error' | null) => void;
  setAccountBalance: (balance: any) => void;
  setPositions: (positions: any[]) => void;
  setLNMarketsConfig: (config: any) => void;
  setMarginProtection: (config: any) => void;
  setTakeProfit: (config: any) => void;
  setEntryAutomation: (config: any) => void;
  setPriceAlert: (config: any) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user: User, token: string) =>
        set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useTradingStore = create<TradingState>((set) => ({
  botStatus: null,
  accountBalance: null,
  positions: [],
  lnMarketsConfig: null,
  marginProtection: null,
  takeProfit: null,
  entryAutomation: null,
  priceAlert: null,
  setBotStatus: (status) => set({ botStatus: status }),
  setAccountBalance: (balance) => set({ accountBalance: balance }),
  setPositions: (positions) => set({ positions }),
  setLNMarketsConfig: (config) => set({ lnMarketsConfig: config }),
  setMarginProtection: (config) => set({ marginProtection: config }),
  setTakeProfit: (config) => set({ takeProfit: config }),
  setEntryAutomation: (config) => set({ entryAutomation: config }),
  setPriceAlert: (config) => set({ priceAlert: config }),
}));

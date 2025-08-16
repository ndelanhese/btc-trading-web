import { apiClient, handleApiResponse } from './api-client';
import type {
  User,
  UserRegister,
  UserLogin,
  LoginResponse,
  LNMarketsConfig,
  MarginProtection,
  TakeProfit,
  EntryAutomation,
  PriceAlert,
  BotStatus,
  AccountBalance,
  Position,
  ClosePositionRequest,
  UpdateTakeProfitRequest,
  UpdateStopLossRequest,
  ApiResponse,
  PaginatedResponse,
} from './types';

// Auth API
export const authApi = {
  login: async (data: UserLogin): Promise<LoginResponse> => {
    const response = await apiClient.post('auth/login', { json: data });
    return handleApiResponse<LoginResponse>(response);
  },

  register: async (data: UserRegister): Promise<ApiResponse<User>> => {
    const response = await apiClient.post('auth/register', { json: data });
    return handleApiResponse<ApiResponse<User>>(response);
  },
};

// LN Markets Configuration API
export const lnMarketsApi = {
  getConfig: async (): Promise<LNMarketsConfig> => {
    const response = await apiClient.get('lnmarkets/config');
    return handleApiResponse<LNMarketsConfig>(response);
  },

  updateConfig: async (data: LNMarketsConfig): Promise<LNMarketsConfig> => {
    const response = await apiClient.post('lnmarkets/config', { json: data });
    return handleApiResponse<LNMarketsConfig>(response);
  },
};

// Trading Configuration API
export const tradingConfigApi = {
  // Margin Protection
  getMarginProtection: async (): Promise<MarginProtection> => {
    const response = await apiClient.get('trading/margin-protection');
    return handleApiResponse<MarginProtection>(response);
  },

  updateMarginProtection: async (data: MarginProtection): Promise<MarginProtection> => {
    const response = await apiClient.post('trading/margin-protection', { json: data });
    return handleApiResponse<MarginProtection>(response);
  },

  // Take Profit
  getTakeProfit: async (): Promise<TakeProfit> => {
    const response = await apiClient.get('trading/take-profit');
    return handleApiResponse<TakeProfit>(response);
  },

  updateTakeProfit: async (data: TakeProfit): Promise<TakeProfit> => {
    const response = await apiClient.post('trading/take-profit', { json: data });
    return handleApiResponse<TakeProfit>(response);
  },

  // Entry Automation
  getEntryAutomation: async (): Promise<EntryAutomation> => {
    const response = await apiClient.get('trading/entry-automation');
    return handleApiResponse<EntryAutomation>(response);
  },

  updateEntryAutomation: async (data: EntryAutomation): Promise<EntryAutomation> => {
    const response = await apiClient.post('trading/entry-automation', { json: data });
    return handleApiResponse<EntryAutomation>(response);
  },

  // Price Alert
  getPriceAlert: async (): Promise<PriceAlert> => {
    const response = await apiClient.get('trading/price-alert');
    return handleApiResponse<PriceAlert>(response);
  },

  updatePriceAlert: async (data: PriceAlert): Promise<PriceAlert> => {
    const response = await apiClient.post('trading/price-alert', { json: data });
    return handleApiResponse<PriceAlert>(response);
  },
};

// Bot Management API
export const botApi = {
  getStatus: async (): Promise<BotStatus> => {
    const response = await apiClient.get('trading/bot/status');
    return handleApiResponse<BotStatus>(response);
  },

  startBot: async (): Promise<ApiResponse<BotStatus>> => {
    const response = await apiClient.post('trading/bot/start');
    return handleApiResponse<ApiResponse<BotStatus>>(response);
  },

  stopBot: async (): Promise<ApiResponse<BotStatus>> => {
    const response = await apiClient.post('trading/bot/stop');
    return handleApiResponse<ApiResponse<BotStatus>>(response);
  },
};

// Trading API
export const tradingApi = {
  getAccountBalance: async (): Promise<AccountBalance> => {
    const response = await apiClient.get('trading/account/balance');
    return handleApiResponse<AccountBalance>(response);
  },

  getPositions: async (): Promise<Position[]> => {
    const response = await apiClient.get('trading/positions');
    return handleApiResponse<Position[]>(response);
  },

  getPosition: async (id: string): Promise<Position> => {
    const response = await apiClient.get(`trading/positions/${id}`);
    return handleApiResponse<Position>(response);
  },

  closePosition: async (data: ClosePositionRequest): Promise<ApiResponse<Position>> => {
    const response = await apiClient.post(`trading/positions/${data.id}/close`);
    return handleApiResponse<ApiResponse<Position>>(response);
  },

  updateTakeProfit: async (data: UpdateTakeProfitRequest): Promise<ApiResponse<Position>> => {
    const response = await apiClient.post(`trading/positions/${data.id}/take-profit`, {
      json: { take_profit: data.take_profit },
    });
    return handleApiResponse<ApiResponse<Position>>(response);
  },

  updateStopLoss: async (data: UpdateStopLossRequest): Promise<ApiResponse<Position>> => {
    const response = await apiClient.post(`trading/positions/${data.id}/stop-loss`, {
      json: { stop_loss: data.stop_loss },
    });
    return handleApiResponse<ApiResponse<Position>>(response);
  },
};

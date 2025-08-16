// User types
export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserRegister {
  username: string;
  password: string;
  email: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  user?: User;
}

// LN Markets Configuration
export interface LNMarketsConfig {
  id?: number;
  user_id?: number;
  api_key?: string;
  secret_key?: string;
  passphrase?: string;
  is_testnet?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Trading Configuration types
export interface MarginProtection {
  id?: number;
  user_id?: number;
  is_enabled?: boolean;
  activation_distance?: number;
  new_liquidation_distance?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TakeProfit {
  id?: number;
  user_id?: number;
  is_enabled?: boolean;
  percentage?: number;
  created_at?: string;
  updated_at?: string;
}

export interface EntryAutomation {
  id?: number;
  user_id?: number;
  is_enabled?: boolean;
  strategy?: string;
  parameters?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface PriceAlert {
  id?: number;
  user_id?: number;
  is_enabled?: boolean;
  price_threshold?: number;
  alert_type?: 'above' | 'below';
  created_at?: string;
  updated_at?: string;
}

// Bot Management
export interface BotStatus {
  is_running?: boolean;
  status?: string;
  last_activity?: string;
  error_message?: string;
}

// Trading types
export interface AccountBalance {
  balance?: number;
  currency?: string;
  available_balance?: number;
  margin_balance?: number;
}

export interface Position {
  id?: string;
  symbol?: string;
  side?: 'long' | 'short';
  size?: number;
  entry_price?: number;
  current_price?: number;
  unrealized_pnl?: number;
  realized_pnl?: number;
  margin?: number;
  liquidation_price?: number;
  take_profit?: number;
  stop_loss?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ClosePositionRequest {
  id: string;
}

export interface UpdateTakeProfitRequest {
  id: string;
  take_profit: number;
}

export interface UpdateStopLossRequest {
  id: string;
  stop_loss: number;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  authApi,
  lnMarketsApi,
  tradingConfigApi,
  botApi,
  tradingApi,
} from './api';
import { createQueryKey } from './api-client';
import type {
  UserLogin,
  UserRegister,
  LNMarketsConfig,
  MarginProtection,
  TakeProfit,
  EntryAutomation,
  PriceAlert,
  ClosePositionRequest,
  UpdateTakeProfitRequest,
  UpdateStopLossRequest,
} from './types';

// Custom hook for authentication with error handling
export const useAuth = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onError: (error: any) => {
      toast({
        title: 'Login Failed',
        description: error?.message || 'Failed to login. Please try again.',
        variant: 'destructive',
      });
    },
    onSuccess: (data) => {
      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onError: (error: any) => {
      toast({
        title: 'Registration Failed',
        description: error?.message || 'Failed to register. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};

// Custom hook for LN Markets configuration
export const useLNMarketsConfig = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: createQueryKey('lnmarkets/config'),
    queryFn: lnMarketsApi.getConfig,
  });
  
  const updateConfig = useMutation({
    mutationFn: lnMarketsApi.updateConfig,
    onSuccess: () => {
      toast({
        title: 'Configuration Updated',
        description: 'LN Markets configuration has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: createQueryKey('lnmarkets/config') });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error?.message || 'Failed to update configuration.',
        variant: 'destructive',
      });
    },
  });

  return {
    config: data,
    isLoading,
    error,
    updateConfig: updateConfig.mutate,
    isUpdating: updateConfig.isPending,
  };
};

// Custom hook for margin protection configuration
export const useMarginProtection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: createQueryKey('trading/margin-protection'),
    queryFn: tradingConfigApi.getMarginProtection,
  });
  
  const updateConfig = useMutation({
    mutationFn: tradingConfigApi.updateMarginProtection,
    onSuccess: () => {
      toast({
        title: 'Configuration Updated',
        description: 'Margin protection configuration has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: createQueryKey('trading/margin-protection') });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error?.message || 'Failed to update margin protection configuration.',
        variant: 'destructive',
      });
    },
  });

  return {
    config: data,
    isLoading,
    error,
    updateConfig: updateConfig.mutate,
    isUpdating: updateConfig.isPending,
  };
};

// Custom hook for take profit configuration
export const useTakeProfit = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: createQueryKey('trading/take-profit'),
    queryFn: tradingConfigApi.getTakeProfit,
  });
  
  const updateConfig = useMutation({
    mutationFn: tradingConfigApi.updateTakeProfit,
    onSuccess: () => {
      toast({
        title: 'Configuration Updated',
        description: 'Take profit configuration has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: createQueryKey('trading/take-profit') });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error?.message || 'Failed to update take profit configuration.',
        variant: 'destructive',
      });
    },
  });

  return {
    config: data,
    isLoading,
    error,
    updateConfig: updateConfig.mutate,
    isUpdating: updateConfig.isPending,
  };
};

// Custom hook for entry automation configuration
export const useEntryAutomation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: createQueryKey('trading/entry-automation'),
    queryFn: tradingConfigApi.getEntryAutomation,
  });
  
  const updateConfig = useMutation({
    mutationFn: tradingConfigApi.updateEntryAutomation,
    onSuccess: () => {
      toast({
        title: 'Configuration Updated',
        description: 'Entry automation configuration has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: createQueryKey('trading/entry-automation') });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error?.message || 'Failed to update entry automation configuration.',
        variant: 'destructive',
      });
    },
  });

  return {
    config: data,
    isLoading,
    error,
    updateConfig: updateConfig.mutate,
    isUpdating: updateConfig.isPending,
  };
};

// Custom hook for price alert configuration
export const usePriceAlert = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: createQueryKey('trading/price-alert'),
    queryFn: tradingConfigApi.getPriceAlert,
  });
  
  const updateConfig = useMutation({
    mutationFn: tradingConfigApi.updatePriceAlert,
    onSuccess: () => {
      toast({
        title: 'Configuration Updated',
        description: 'Price alert configuration has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: createQueryKey('trading/price-alert') });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error?.message || 'Failed to update price alert configuration.',
        variant: 'destructive',
      });
    },
  });

  return {
    config: data,
    isLoading,
    error,
    updateConfig: updateConfig.mutate,
    isUpdating: updateConfig.isPending,
  };
};

// Custom hook for bot management
export const useBotManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: status, isLoading, error, refetch } = useQuery({
    queryKey: createQueryKey('trading/bot/status'),
    queryFn: botApi.getStatus,
    refetchInterval: 5000, // Poll every 5 seconds
  });
  
  const startBot = useMutation({
    mutationFn: botApi.startBot,
    onSuccess: () => {
      toast({
        title: 'Bot Started',
        description: 'Trading bot has been started successfully.',
      });
      queryClient.invalidateQueries({ queryKey: createQueryKey('trading/bot/status') });
    },
    onError: (error: any) => {
      toast({
        title: 'Start Failed',
        description: error?.message || 'Failed to start the trading bot.',
        variant: 'destructive',
      });
    },
  });

  const stopBot = useMutation({
    mutationFn: botApi.stopBot,
    onSuccess: () => {
      toast({
        title: 'Bot Stopped',
        description: 'Trading bot has been stopped successfully.',
      });
      queryClient.invalidateQueries({ queryKey: createQueryKey('trading/bot/status') });
    },
    onError: (error: any) => {
      toast({
        title: 'Stop Failed',
        description: error?.message || 'Failed to stop the trading bot.',
        variant: 'destructive',
      });
    },
  });

  return {
    status,
    isLoading,
    error,
    startBot: startBot.mutate,
    stopBot: stopBot.mutate,
    isStarting: startBot.isPending,
    isStopping: stopBot.isPending,
  };
};

// Custom hook for account balance
export const useAccountBalance = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: createQueryKey('trading/account/balance'),
    queryFn: tradingApi.getAccountBalance,
    refetchInterval: 10000, // Poll every 10 seconds
  });
  
  return {
    balance: data,
    isLoading,
    error,
  };
};

// Custom hook for positions
export const usePositions = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: createQueryKey('trading/positions'),
    queryFn: tradingApi.getPositions,
    refetchInterval: 5000, // Poll every 5 seconds
  });
  
  return {
    positions: data,
    isLoading,
    error,
    refetch,
  };
};

// Custom hook for individual position
export const usePosition = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: createQueryKey(`trading/positions/${id}`),
    queryFn: () => tradingApi.getPosition(id),
    enabled: !!id,
  });
  
  return {
    position: data,
    isLoading,
    error,
  };
};

// Custom hook for position operations
export const usePositionOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const closePosition = useMutation({
    mutationFn: tradingApi.closePosition,
    onSuccess: () => {
      toast({
        title: 'Position Closed',
        description: 'Position has been closed successfully.',
      });
      queryClient.invalidateQueries({ queryKey: createQueryKey('trading/positions') });
    },
    onError: (error: any) => {
      toast({
        title: 'Close Failed',
        description: error?.message || 'Failed to close position.',
        variant: 'destructive',
      });
    },
  });

  const updateTakeProfit = useMutation({
    mutationFn: tradingApi.updateTakeProfit,
    onSuccess: () => {
      toast({
        title: 'Take Profit Updated',
        description: 'Take profit has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: createQueryKey('trading/positions') });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error?.message || 'Failed to update take profit.',
        variant: 'destructive',
      });
    },
  });

  const updateStopLoss = useMutation({
    mutationFn: tradingApi.updateStopLoss,
    onSuccess: () => {
      toast({
        title: 'Stop Loss Updated',
        description: 'Stop loss has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: createQueryKey('trading/positions') });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error?.message || 'Failed to update stop loss.',
        variant: 'destructive',
      });
    },
  });

  return {
    closePosition: closePosition.mutate,
    updateTakeProfit: updateTakeProfit.mutate,
    updateStopLoss: updateStopLoss.mutate,
    isClosing: closePosition.isPending,
    isUpdatingTakeProfit: updateTakeProfit.isPending,
    isUpdatingStopLoss: updateStopLoss.isPending,
  };
};

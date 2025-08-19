import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	authApi,
	botApi,
	lnMarketsApi,
	tradingApi,
	tradingConfigApi,
} from "./api";
import { createQueryKey } from "./api-client";
import type { ApiError } from "./types";

export const useAuth = () => {
	const loginMutation = useMutation({
		mutationFn: authApi.login,
		onError: (error: ApiError) => {
			toast.error(error?.message || "Failed to login. Please try again.");
		},
	});

	const registerMutation = useMutation({
		mutationFn: authApi.register,
		onError: (error: ApiError) => {
			toast.error(error?.message || "Failed to register. Please try again.");
		},
	});

	return {
		login: loginMutation.mutate,
		register: registerMutation.mutate,
		isLoggingIn: loginMutation.isPending,
		isRegistering: registerMutation.isPending,
	};
};

export const useLNMarketsConfig = () => {
	const queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery({
		queryKey: createQueryKey("lnmarkets/config"),
		queryFn: lnMarketsApi.getConfig,
	});

	const updateConfig = useMutation({
		mutationFn: lnMarketsApi.updateConfig,
		onSuccess: () => {
			toast.success("LN Markets configuration has been updated successfully.");
			queryClient.invalidateQueries({
				queryKey: createQueryKey("lnmarkets/config"),
			});
		},
		onError: (error: ApiError) => {
			toast.error(error?.message || "Failed to update configuration.");
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

export const useMarginProtection = () => {
	const queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery({
		queryKey: createQueryKey("trading/margin-protection"),
		queryFn: tradingConfigApi.getMarginProtection,
	});

	const updateConfig = useMutation({
		mutationFn: tradingConfigApi.updateMarginProtection,
		onSuccess: () => {
			toast.success(
				"Margin protection configuration has been updated successfully.",
			);
			queryClient.invalidateQueries({
				queryKey: createQueryKey("trading/margin-protection"),
			});
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.message || "Failed to update margin protection configuration.",
			);
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

export const useTakeProfit = () => {
	const queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery({
		queryKey: createQueryKey("trading/take-profit"),
		queryFn: tradingConfigApi.getTakeProfit,
	});

	const updateConfig = useMutation({
		mutationFn: tradingConfigApi.updateTakeProfit,
		onSuccess: () => {
			toast.success("Take profit configuration has been updated successfully.");
			queryClient.invalidateQueries({
				queryKey: createQueryKey("trading/take-profit"),
			});
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.message || "Failed to update take profit configuration.",
			);
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

export const useEntryAutomation = () => {
	const queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery({
		queryKey: createQueryKey("trading/entry-automation"),
		queryFn: tradingConfigApi.getEntryAutomation,
	});

	const updateConfig = useMutation({
		mutationFn: tradingConfigApi.updateEntryAutomation,
		onSuccess: () => {
			toast.success(
				"Entry automation configuration has been updated successfully.",
			);
			queryClient.invalidateQueries({
				queryKey: createQueryKey("trading/entry-automation"),
			});
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.message || "Failed to update entry automation configuration.",
			);
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

export const usePriceAlert = () => {
	const queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery({
		queryKey: createQueryKey("trading/price-alert"),
		queryFn: tradingConfigApi.getPriceAlert,
	});

	const updateConfig = useMutation({
		mutationFn: tradingConfigApi.updatePriceAlert,
		onSuccess: () => {
			toast.success("Price alert configuration has been updated successfully.");
			queryClient.invalidateQueries({
				queryKey: createQueryKey("trading/price-alert"),
			});
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.message || "Failed to update price alert configuration.",
			);
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

export const useBotManagement = () => {
	const queryClient = useQueryClient();

	const {
		data: status,
		isLoading,
		error,
	} = useQuery({
		queryKey: createQueryKey("trading/bot/status"),
		queryFn: botApi.getStatus,
		refetchInterval: 5000, // Poll every 5 seconds
	});

	const startBot = useMutation({
		mutationFn: botApi.startBot,
		onSuccess: () => {
			toast.success("Trading bot has been started successfully.");
			queryClient.invalidateQueries({
				queryKey: createQueryKey("trading/bot/status"),
			});
		},
		onError: (error: ApiError) => {
			toast.error(error?.message || "Failed to start the trading bot.");
		},
	});

	const stopBot = useMutation({
		mutationFn: botApi.stopBot,
		onSuccess: () => {
			toast.success("Trading bot has been stopped successfully.");
			queryClient.invalidateQueries({
				queryKey: createQueryKey("trading/bot/status"),
			});
		},
		onError: (error: ApiError) => {
			toast.error(error?.message || "Failed to stop the trading bot.");
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

export const useAccountBalance = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: createQueryKey("trading/account/balance"),
		queryFn: tradingApi.getAccountBalance,
		refetchInterval: 10000, // Poll every 10 seconds
	});

	return {
		balance: data,
		isLoading,
		error,
	};
};

export const usePositions = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: createQueryKey("trading/positions"),
		queryFn: tradingApi.getPositions,
		refetchInterval: 5000, // Poll every 5 seconds
	});

	return {
		positions: data,
		isLoading,
		error,
	};
};

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

export const usePositionOperations = () => {
	const queryClient = useQueryClient();

	const closePosition = useMutation({
		mutationFn: tradingApi.closePosition,
		onSuccess: () => {
			toast.success("Position has been closed successfully.");
			queryClient.invalidateQueries({
				queryKey: createQueryKey("trading/positions"),
			});
		},
		onError: (error: ApiError) => {
			toast.error(error?.message || "Failed to close position.");
		},
	});

	const updateTakeProfit = useMutation({
		mutationFn: tradingApi.updateTakeProfit,
		onSuccess: () => {
			toast.success("Take profit has been updated successfully.");
			queryClient.invalidateQueries({
				queryKey: createQueryKey("trading/positions"),
			});
		},
		onError: (error: ApiError) => {
			toast.error(error?.message || "Failed to update take profit.");
		},
	});

	const updateStopLoss = useMutation({
		mutationFn: tradingApi.updateStopLoss,
		onSuccess: () => {
			toast.success("Stop loss has been updated successfully.");
			queryClient.invalidateQueries({
				queryKey: createQueryKey("trading/positions"),
			});
		},
		onError: (error: ApiError) => {
			toast.error(error?.message || "Failed to update stop loss.");
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

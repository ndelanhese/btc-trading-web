import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
	authApi,
	botApi,
	lnMarketsApi,
	tradingApi,
	tradingConfigApi,
} from "./api";
import { createQueryKey } from "./api-client";
import { tokenCookies } from "./cookies";
import type { ApiError } from "./types";
import { setLatestBitcoinPrice } from "./utils";

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

export const useBitcoinPriceWebSocket = () => {
	const [price, setPrice] = useState<number | null>(null);
	const [sources, setSources] = useState<Record<string, number>>({});
	const [timestamp, setTimestamp] = useState<number | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const socketRef = useRef<WebSocket | null>(null);
	const isConnectingRef = useRef(false);

	useEffect(() => {
		const connectSocket = () => {
			if (isConnectingRef.current) {
				return;
			}
			
			isConnectingRef.current = true;
			
			try {
				if (socketRef.current) {
					socketRef.current.close();
					socketRef.current = null;
				}
				const baseUrl = (() => {
					// Prefer explicit env override
					const envUrl = process.env.NEXT_PUBLIC_WS_API_URL;
					if (envUrl && typeof envUrl === "string") return envUrl.replace(/\/?$/,'');

					// Derive from current page protocol and host to avoid mixed content
					if (typeof window !== "undefined") {
						const isSecure = window.location.protocol === "https:";
						const wsScheme = isSecure ? "wss" : "ws";
						// If backend is running on same host but different port, allow configuring via NEXT_PUBLIC_API_URL
						const apiBase = process.env.NEXT_PUBLIC_API_URL;
						if (apiBase && /^https?:\/\//.test(apiBase)) {
							try {
								const u = new URL(apiBase);
								return `${wsScheme}://${u.host}`;
							} catch {}
						}
						return `${wsScheme}://${window.location.host}`;
					}

					// Fallback for SSR or unknown
					return "ws://localhost:8080";
				})();

				const token = tokenCookies
				.getAuthToken();
				if (!token) {
					setError("Authentication token not found");
					return;
				}

				const wsUrl = `${baseUrl}/api/ws/btc-price?token=${encodeURIComponent(token)}`;
				const socket = new WebSocket(wsUrl);

				socket.onopen = () => {
					isConnectingRef.current = false;
					setIsConnected(true);
					setError(null);
					toast.success("WebSocket connected to BTC price stream");
				};

				socket.onmessage = (event) => {
					try {
						const data = JSON.parse(event.data);
						setPrice(data.price);
						setSources(data.sources);
						setTimestamp(data.timestamp);
						setLatestBitcoinPrice(data.price);
					} catch (err) {
						toast.error("Failed to parse WebSocket message");
					}
				};

				socket.onclose = (event) => {
					isConnectingRef.current = false;
					setIsConnected(false);
					toast.warning("WebSocket disconnected from BTC price stream");
					
					if (event.code !== 1000 && socketRef.current === socket) {
						toast.warning("Attempting to reconnect in 3 seconds...");
						setTimeout(() => {
							if (socketRef.current === socket) {
								connectSocket();
							}
						}, 3000);
					}
				};

				socket.onerror = (error) => {
					isConnectingRef.current = false;
					setError("WebSocket connection error");
					toast.error("WebSocket connection error");
				};

				socketRef.current = socket;
			} catch (err) {
				isConnectingRef.current = false;
				setError("Failed to connect to WebSocket");
				toast.error("Failed to create WebSocket connection");
			}
		};

		connectSocket();

		return () => {
			if (socketRef.current) {
				socketRef.current.close(1000, "Component unmounting");
				socketRef.current = null;
			}
		};
	}, []);

	return {
		price,
		sources,
		timestamp,
		isConnected,
		error,
	};
};

export const useBitcoinPrice = () => {
	const { price: wsPrice, isConnected } = useBitcoinPriceWebSocket();
	const [apiPrice, setApiPrice] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isConnected && wsPrice !== null) {
			return;
		}

		const fetchApiPrice = async () => {
			setIsLoading(true);
			try {
				const { getBitcoinPrice } = await import("./utils");
				const price = await getBitcoinPrice();
				setApiPrice(price);
			} catch (error) {
				toast.error("Failed to fetch Bitcoin price from API");
			} finally {
				setIsLoading(false);
			}
		};

		fetchApiPrice();
	}, [isConnected, wsPrice]);

	return {
		price: wsPrice !== null ? wsPrice : apiPrice,
		isLoading: isLoading && !isConnected,
		isConnected,
	};
};

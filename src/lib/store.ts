import { create } from "zustand";
import { securityUtils, tokenCookies } from "./cookies";

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
	isInitialized: boolean;
	login: (user: User, token: string, refreshToken?: string) => Promise<void>;
	logout: () => void;
	initialize: () => Promise<void>;
}

interface TradingState {
	botStatus: "running" | "stopped" | "error" | null;
	accountBalance: any;
	positions: any[];
	lnMarketsConfig: any;
	marginProtection: any;
	takeProfit: any;
	entryAutomation: any;
	priceAlert: any;
	setBotStatus: (status: "running" | "stopped" | "error" | null) => void;
	setAccountBalance: (balance: any) => void;
	setPositions: (positions: any[]) => void;
	setLNMarketsConfig: (config: any) => void;
	setMarginProtection: (config: any) => void;
	setTakeProfit: (config: any) => void;
	setEntryAutomation: (config: any) => void;
	setPriceAlert: (config: any) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	token: null,
	isAuthenticated: false,
	isInitialized: false,

	login: async (user: User, token: string, refreshToken?: string) => {
		// Validate token before storing
		if (!securityUtils.isValidToken(token)) {
			console.error("Invalid token format");
			return;
		}

		// Sanitize user data
		const sanitizedUser = securityUtils.sanitizeUserData(user);

		// Store in secure cookies
		await tokenCookies.setAuthToken(token);
		if (refreshToken) {
			await tokenCookies.setRefreshToken(refreshToken);
		}
		await tokenCookies.setUserData(sanitizedUser);

		// Update store state
		set({
			user: sanitizedUser,
			token,
			isAuthenticated: true,
		});
	},

	logout: () => {
		// Clear all cookies
		tokenCookies.clearAll();

		// Update store state
		set({
			user: null,
			token: null,
			isAuthenticated: false,
		});
	},

	initialize: async () => {
		// Initialize auth state from cookies on app start
		if (typeof window === "undefined") {
			set({ isInitialized: true });
			return;
		}

		try {
			const token = tokenCookies.getAuthToken();
			const user = tokenCookies.getUserData();

			if (token && user && securityUtils.isValidToken(token)) {
				set({
					user,
					token,
					isAuthenticated: true,
					isInitialized: true,
				});
			} else {
				// Clear invalid cookies
				tokenCookies.clearAll();
				set({
					user: null,
					token: null,
					isAuthenticated: false,
					isInitialized: true,
				});
			}
		} catch (error) {
			console.error("Failed to initialize auth state:", error);
			// Clear cookies on error
			tokenCookies.clearAll();
			set({
				user: null,
				token: null,
				isAuthenticated: false,
				isInitialized: true,
			});
		}
	},
}));

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

import { create } from "zustand";
import { securityUtils, tokenCookies } from "./cookies";
import type {
	AccountBalance,
	EntryAutomation,
	LNMarketsConfig,
	MarginProtection,
	Position,
	PriceAlert,
	TakeProfit,
	User,
} from "./types";

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
	accountBalance: AccountBalance | null;
	positions: Position[];
	lnMarketsConfig: LNMarketsConfig | null;
	marginProtection: MarginProtection | null;
	takeProfit: TakeProfit | null;
	entryAutomation: EntryAutomation | null;
	priceAlert: PriceAlert | null;
	setBotStatus: (status: "running" | "stopped" | "error" | null) => void;
	setAccountBalance: (balance: AccountBalance | null) => void;
	setPositions: (positions: Position[]) => void;
	setLNMarketsConfig: (config: LNMarketsConfig | null) => void;
	setMarginProtection: (config: MarginProtection | null) => void;
	setTakeProfit: (config: TakeProfit | null) => void;
	setEntryAutomation: (config: EntryAutomation | null) => void;
	setPriceAlert: (config: PriceAlert | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
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
		if (sanitizedUser) {
			await tokenCookies.setUserData(sanitizedUser);
		}

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

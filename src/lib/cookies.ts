import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { setCookieAction } from "@/actions/setCookie";
import {
	getCookieConfig,
	sanitizeUserData,
	validateTokenFormat,
} from "./security-config";
import type { User } from "./types";

// Cookie configuration for security
const COOKIE_CONFIG = getCookieConfig();

// Cookie names
export const COOKIE_NAMES = {
	AUTH_TOKEN: "auth_token",
	REFRESH_TOKEN: "refresh_token",
	USER_DATA: "user_data",
} as const;

// Token management
export const tokenCookies = {
	// Set authentication token
	setAuthToken: async (token: string) => {
		try {
			await setCookieAction(COOKIE_NAMES.AUTH_TOKEN, token, COOKIE_CONFIG);
		} catch (error) {
			console.error("Failed to set auth token:", error);
		}
	},

	// Get authentication token
	getAuthToken: (): string | undefined => {
		try {
			return getCookie(COOKIE_NAMES.AUTH_TOKEN) as string | undefined;
		} catch (error) {
			console.error("Failed to get auth token:", error);
			return undefined;
		}
	},

	// Check if auth token exists
	hasAuthToken: (): boolean => {
		try {
			const result = hasCookie(COOKIE_NAMES.AUTH_TOKEN);
			return typeof result === "boolean" ? result : false;
		} catch (error) {
			console.error("Failed to check auth token:", error);
			return false;
		}
	},

	// Set refresh token
	setRefreshToken: async (token: string) => {
		try {
			await setCookieAction(COOKIE_NAMES.REFRESH_TOKEN, token, COOKIE_CONFIG);
		} catch (error) {
			console.error("Failed to set refresh token:", error);
		}
	},

	// Get refresh token
	getRefreshToken: (): string | undefined => {
		try {
			return getCookie(COOKIE_NAMES.REFRESH_TOKEN) as string | undefined;
		} catch (error) {
			console.error("Failed to get refresh token:", error);
			return undefined;
		}
	},

	// Check if refresh token exists
	hasRefreshToken: (): boolean => {
		try {
			const result = hasCookie(COOKIE_NAMES.REFRESH_TOKEN);
			return typeof result === "boolean" ? result : false;
		} catch (error) {
			console.error("Failed to check refresh token:", error);
			return false;
		}
	},

	// Set user data
	setUserData: async (userData: User) => {
		try {
			const sanitizedData = sanitizeUserData(
				userData as unknown as Record<string, unknown>,
			);
			if (sanitizedData) {
				await setCookieAction(
					COOKIE_NAMES.USER_DATA,
					JSON.stringify(sanitizedData),
					COOKIE_CONFIG,
				);
			}
		} catch (error) {
			console.error("Failed to set user data:", error);
		}
	},

	// Get user data
	getUserData: (): User | null => {
		try {
			const userData = getCookie(COOKIE_NAMES.USER_DATA);
			if (typeof userData === "string") {
				try {
					const parsed = JSON.parse(userData);
					// Validate that it has the required User properties
					if (
						parsed &&
						typeof parsed === "object" &&
						typeof parsed.id === "number" &&
						typeof parsed.username === "string" &&
						typeof parsed.email === "string"
					) {
						return parsed as User;
					}
					return null;
				} catch {
					return null;
				}
			}
			return null;
		} catch (error) {
			console.error("Failed to get user data:", error);
			return null;
		}
	},

	// Check if user data exists
	hasUserData: (): boolean => {
		try {
			const result = hasCookie(COOKIE_NAMES.USER_DATA);
			return typeof result === "boolean" ? result : false;
		} catch (error) {
			console.error("Failed to check user data:", error);
			return false;
		}
	},

	// Clear all authentication cookies
	clearAll: () => {
		try {
			deleteCookie(COOKIE_NAMES.AUTH_TOKEN, { path: "/" });
			deleteCookie(COOKIE_NAMES.REFRESH_TOKEN, { path: "/" });
			deleteCookie(COOKIE_NAMES.USER_DATA, { path: "/" });
		} catch (error) {
			console.error("Failed to clear cookies:", error);
		}
	},

	// Clear specific cookie
	clear: (cookieName: keyof typeof COOKIE_NAMES) => {
		try {
			deleteCookie(COOKIE_NAMES[cookieName], { path: "/" });
		} catch (error) {
			console.error(`Failed to clear ${cookieName}:`, error);
		}
	},
};

// Security utilities
export const securityUtils = {
	// Validate token format (basic validation)
	isValidToken: (token: string): boolean => {
		return validateTokenFormat(token);
	},

	// Sanitize user data before storing
	sanitizeUserData: (userData: User): User | null => {
		const sanitized = sanitizeUserData(
			userData as unknown as Record<string, unknown>,
		);
		if (sanitized?.created_at && sanitized?.updated_at) {
			return {
				id: sanitized.id,
				username: sanitized.username,
				email: sanitized.email,
				created_at: sanitized.created_at,
				updated_at: sanitized.updated_at,
			};
		}
		return null;
	},

	// Check if cookies are enabled
	areCookiesEnabled: async (): Promise<boolean> => {
		if (typeof window === "undefined") return true; // Server-side, assume enabled

		try {
			// Test if we can set a test cookie using cookies-next
			setCookie("test", "1", { path: "/" });
			const enabled = await hasCookie("test");
			// Clean up test cookie
			deleteCookie("test", { path: "/" });
			return enabled;
		} catch {
			return false;
		}
	},
};

// Export default for convenience
export default {
	tokenCookies,
	securityUtils,
	COOKIE_NAMES,
	COOKIE_CONFIG,
};

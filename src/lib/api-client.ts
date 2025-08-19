import ky from "ky";
import { securityUtils, tokenCookies } from "./cookies";
import { SECURITY_CONFIG } from "./security-config";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Create a custom ky instance with authentication and error handling
export const apiClient = ky.create({
	prefixUrl: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	hooks: {
		beforeRequest: [
			async (request) => {
				// Add auth token to requests from secure cookies
				if (typeof window !== "undefined") {
					const token = tokenCookies.getAuthToken();
					if (token && securityUtils.isValidToken(token)) {
						request.headers.set("Authorization", `Bearer ${token}`);
					}
				}
			},
		],
		afterResponse: [
			async (_request, _options, response) => {
				// Handle 401 errors by clearing cookies and redirecting to login
				if (response.status === 401) {
					if (typeof window !== "undefined") {
						// Clear all authentication cookies
						tokenCookies.clearAll();
						// Redirect to login page
						window.location.href = "/login";
					}
				}
				return response;
			},
		],
	},
	retry: {
		limit: SECURITY_CONFIG.API.MAX_RETRIES,
		methods: ["get"],
		statusCodes: [...SECURITY_CONFIG.API.RETRY_STATUS_CODES],
	},
	timeout: SECURITY_CONFIG.API.TIMEOUT,
});

// Helper function to handle API responses
export const handleApiResponse = async <T>(response: Response): Promise<T> => {
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			errorData.message || `HTTP error! status: ${response.status}`,
		);
	}
	return response.json();
};

// Helper function to create query keys
export const createQueryKey = (
	endpoint: string,
	params?: Record<string, unknown>,
) => {
	return [endpoint, params];
};

// Authentication helper functions
export const authHelpers = {
	// Check if user is authenticated
	isAuthenticated: (): boolean => {
		if (typeof window === "undefined") return false;
		return tokenCookies.hasAuthToken() && tokenCookies.hasUserData();
	},

	// Get current user data
	getCurrentUser: () => {
		if (typeof window === "undefined") return null;
		return tokenCookies.getUserData();
	},

	// Logout user
	logout: () => {
		if (typeof window === "undefined") return;
		tokenCookies.clearAll();
		window.location.href = "/login";
	},

	// Refresh authentication (if needed)
	refreshAuth: async (): Promise<boolean> => {
		if (typeof window === "undefined") return false;

		const refreshToken = tokenCookies.getRefreshToken();
		if (!refreshToken) return false;

		try {
			const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ refresh_token: refreshToken }),
			});

			if (response.ok) {
				const data = await response.json();
				if (data.token) {
					await tokenCookies.setAuthToken(data.token);
					if (data.refresh_token) {
						await tokenCookies.setRefreshToken(data.refresh_token);
					}
					return true;
				}
			}
		} catch (error) {
			console.error("Failed to refresh authentication:", error);
		}

		// If refresh fails, clear all tokens
		tokenCookies.clearAll();
		return false;
	},
};

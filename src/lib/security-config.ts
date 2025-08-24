// Security configuration constants
export const SECURITY_CONFIG = {
	// Cookie settings
	COOKIE: {
		// Authentication token expiry (7 days)
		AUTH_TOKEN_MAX_AGE: 7 * 24 * 60 * 60,
		// Refresh token expiry (30 days)
		REFRESH_TOKEN_MAX_AGE: 30 * 24 * 60 * 60,
		// User data expiry (7 days)
		USER_DATA_MAX_AGE: 7 * 24 * 60 * 60,
		// Cookie path
		PATH: "/",
		// SameSite setting
		SAME_SITE: "lax" as const,
		// HttpOnly setting (false for client-side access)
		HTTP_ONLY: false,
	},

	// Token validation
	TOKEN: {
		// Minimum token length
		MIN_LENGTH: 10,
		// JWT parts count
		JWT_PARTS_COUNT: 3,
	},

	// API settings
	API: {
		// Request timeout (10 seconds)
		TIMEOUT: 10000,
		// Retry attempts
		MAX_RETRIES: 2,
		// Retry status codes
		RETRY_STATUS_CODES: [408, 413, 429, 500, 502, 503, 504],
	},

	// Security headers
	HEADERS: {
		// Content Security Policy
		CSP: [
			"default-src 'self'",
			"script-src 'self' 'unsafe-eval' 'unsafe-inline'",
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' data: https:",
			"font-src 'self'",
			"connect-src 'self' http://localhost:8080 https://api-btc-trading-bot.ndelanhese.online ws://localhost:8080 wss://api-btc-trading-bot.ndelanhese.online ws: wss:",
			"frame-ancestors 'none'",
		].join("; "),

		// Other security headers
		X_FRAME_OPTIONS: "DENY",
		X_CONTENT_TYPE_OPTIONS: "nosniff",
		REFERRER_POLICY: "strict-origin-when-cross-origin",
		PERMISSIONS_POLICY: "camera=(), microphone=(), geolocation=()",
	},

	// Route protection
	ROUTES: {
		// Protected routes that require authentication
		PROTECTED: ["/dashboard"],
		// Auth routes (login/register)
		AUTH: ["/login", "/register"],
		// Public routes
		PUBLIC: ["/", "/about", "/contact"],
	},

	// Environment-specific settings
	ENVIRONMENT: {
		// Development settings
		DEVELOPMENT: {
			SECURE_COOKIES: false,
			DOMAIN: undefined,
		},
		// Production settings
		PRODUCTION: {
			SECURE_COOKIES: true,
			DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
		},
	},
} as const;

// Helper function to get environment-specific cookie config
export const getCookieConfig = () => {
	const isProduction = process.env.NODE_ENV === "production";
	const envConfig = isProduction
		? SECURITY_CONFIG.ENVIRONMENT.PRODUCTION
		: SECURITY_CONFIG.ENVIRONMENT.DEVELOPMENT;

	return {
		maxAge: SECURITY_CONFIG.COOKIE.AUTH_TOKEN_MAX_AGE,
		secure: envConfig.SECURE_COOKIES,
		httpOnly: SECURITY_CONFIG.COOKIE.HTTP_ONLY,
		sameSite: SECURITY_CONFIG.COOKIE.SAME_SITE,
		path: SECURITY_CONFIG.COOKIE.PATH,
		domain: envConfig.DOMAIN,
	};
};

// Helper function to validate token format
export const validateTokenFormat = (token: string): boolean => {
	if (!token || typeof token !== "string") return false;
	if (token.length < SECURITY_CONFIG.TOKEN.MIN_LENGTH) return false;

	// Check for JWT format (3 parts separated by dots)
	const parts = token.split(".");
	return parts.length === SECURITY_CONFIG.TOKEN.JWT_PARTS_COUNT;
};

// Helper function to sanitize user data
export const sanitizeUserData = (
	userData:
		| Record<string, unknown>
		| {
				id: number;
				username: string;
				email: string;
				created_at: string;
				updated_at: string;
		  },
): {
	id: number;
	username: string;
	email: string;
	created_at?: string;
	updated_at?: string;
} | null => {
	if (!userData || typeof userData !== "object") return null;

	// Only extract safe user properties
	const { id, username, email, created_at, updated_at } = userData;

	// Validate required fields
	if (!id || !username || !email) return null;

	return {
		id: id as number,
		username: username as string,
		email: email as string,
		created_at: created_at as string | undefined,
		updated_at: updated_at as string | undefined,
	};
};
